from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.utils.text import slugify

from api.models import Genre, Movie, date_months_ago
from api.services.tmdb import discover_movies, get_movie_details, get_movie_genres


def get_category_discovery_profiles():
    return (
        (
            "Blockbuster Duds",
            {
                "sort_by": "revenue.desc",
                "vote_average.lte": 5.99,
                "vote_count.gte": 500,
            },
        ),
        (
            "Blockbuster Greats",
            {
                "sort_by": "revenue.desc",
                "vote_average.gte": 7,
                "vote_count.gte": 1_000,
            },
        ),
        (
            "Certified Classics",
            {
                "sort_by": "vote_average.desc",
                "primary_release_date.lte": date_months_ago(300).isoformat(),
                "vote_average.gte": 7,
                "vote_count.gte": 1_000,
            },
        ),
        (
            "Crowd Favorites",
            {
                "sort_by": "vote_average.desc",
                "vote_average.gte": 7.5,
                "vote_count.gte": 5_000,
            },
        ),
        (
            "Epic Runtime",
            {
                "sort_by": "vote_average.desc",
                "with_runtime.gte": 150,
                "vote_average.gte": 7.5,
                "vote_count.gte": 100,
            },
        ),
        (
            "Hidden Gems",
            {
                "sort_by": "popularity.asc",
                "vote_average.gte": 7,
                "vote_count.gte": 100,
                "vote_count.lte": 2_500,
            },
        ),
        (
            "International Picks",
            {
                "sort_by": "vote_average.desc",
                "with_original_language": "ko",
                "vote_average.gte": 7,
                "vote_count.gte": 100,
            },
        ),
        (
            "New Releases",
            {
                "sort_by": "primary_release_date.desc",
                "primary_release_date.gte": date_months_ago(18).isoformat(),
            },
        ),
        (
            "Short and Sweet",
            {
                "sort_by": "vote_average.desc",
                "with_runtime.lte": 100,
                "vote_average.gte": 7,
                "vote_count.gte": 100,
            },
        ),
        (
            "Small Budget Standouts",
            {
                "sort_by": "popularity.asc",
                "vote_average.gte": 7,
                "vote_count.gte": 500,
            },
        ),
        (
            "Surprise Hits",
            {
                "sort_by": "revenue.desc",
                "vote_count.gte": 500,
            },
        ),
        (
            "Trending Now",
            {
                "sort_by": "popularity.desc",
                "primary_release_date.gte": date_months_ago(60).isoformat(),
                "vote_count.gte": 100,
            },
        ),
    )


class Command(BaseCommand):
    help = "Imports movie genres and full movie details from TMDB."

    def add_arguments(self, parser):
        parser.add_argument(
            "--pages",
            type=int,
            default=1,
            help="Number of TMDB discovery pages to import.",
        )
        parser.add_argument(
            "--category-pages",
            type=int,
            default=0,
            help="Number of discovery pages to import for every picker category.",
        )

    def handle(self, *args, **options):
        page_count = options["pages"]
        category_page_count = options["category_pages"]

        if page_count < 0 or page_count > 500:
            raise CommandError("Pages must be between 0 and 500.")

        if category_page_count < 0 or category_page_count > 20:
            raise CommandError("Category pages must be between 0 and 20.")

        if page_count == 0 and category_page_count == 0:
            raise CommandError("At least one page must be requested.")

        genres_by_tmdb_id = self.sync_genres()
        created_count = 0
        updated_count = 0
        seen_tmdb_ids = set()
        discovery_jobs = [
            ("Popular", page_number, {})
            for page_number in range(1, page_count + 1)
        ]

        for profile_name, filters in get_category_discovery_profiles():
            discovery_jobs.extend(
                (profile_name, page_number, filters)
                for page_number in range(1, category_page_count + 1)
            )

        for profile_name, page_number, filters in discovery_jobs:
            discovery = discover_movies(page=page_number, **filters)

            for movie_summary in discovery.get("results", []):
                tmdb_id = movie_summary["id"]

                if tmdb_id in seen_tmdb_ids:
                    continue

                seen_tmdb_ids.add(tmdb_id)
                details = get_movie_details(tmdb_id)
                was_created = self.save_movie(details, genres_by_tmdb_id)

                if was_created:
                    created_count += 1
                else:
                    updated_count += 1

            self.stdout.write(f"Imported {profile_name} page {page_number}.")

        self.stdout.write(
            self.style.SUCCESS(
                f"Movie synchronization complete. Created {created_count}. Updated {updated_count}."
            )
        )

    def sync_genres(self):
        genres_by_tmdb_id = {}

        for genre_data in get_movie_genres():
            genre, unused_created = Genre.objects.update_or_create(
                tmdb_id=genre_data["id"],
                defaults={
                    "name": genre_data["name"],
                    "slug": slugify(genre_data["name"]),
                },
            )
            genres_by_tmdb_id[genre.tmdb_id] = genre

        self.stdout.write(f"Synchronized {len(genres_by_tmdb_id)} genres.")
        return genres_by_tmdb_id

    @transaction.atomic
    def save_movie(self, details, genres_by_tmdb_id):
        tmdb_id = details["id"]
        title = details.get("title") or details.get("original_title")

        if not title:
            raise CommandError(f"TMDB movie {tmdb_id} has no title.")

        vote_average = details.get("vote_average")
        movie, was_created = Movie.objects.update_or_create(
            tmdb_id=tmdb_id,
            defaults={
                "title": title,
                "original_title": details.get("original_title") or "",
                "overview": details.get("overview") or "",
                "release_date": parse_date(details.get("release_date") or ""),
                "runtime_minutes": details.get("runtime") or None,
                "budget": details.get("budget") or None,
                "revenue": details.get("revenue") or None,
                "popularity": details.get("popularity"),
                "vote_average": (
                    Decimal(str(vote_average))
                    if vote_average is not None
                    else None
                ),
                "vote_count": details.get("vote_count") or 0,
                "poster_path": details.get("poster_path") or "",
                "backdrop_path": details.get("backdrop_path") or "",
                "original_language": details.get("original_language") or "",
                "adult": bool(details.get("adult", False)),
                "last_synced_at": timezone.now(),
            },
        )

        movie_genres = []

        for genre_data in details.get("genres", []):
            genre = genres_by_tmdb_id.get(genre_data["id"])

            if genre is None:
                genre, unused_created = Genre.objects.update_or_create(
                    tmdb_id=genre_data["id"],
                    defaults={
                        "name": genre_data["name"],
                        "slug": slugify(genre_data["name"]),
                    },
                )
                genres_by_tmdb_id[genre.tmdb_id] = genre

            movie_genres.append(genre)

        movie.genres.set(movie_genres)
        return was_created
