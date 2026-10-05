# Tests API routes and movie filters.
import json
from datetime import date

# Imports Django test classes.
from django.test import SimpleTestCase, TestCase

# Imports movie filtering tools.
from .models import Genre, Movie, date_months_ago


class HealthViewTests(SimpleTestCase):
    def test_health_endpoint(self):
        response = self.client.get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


class MovieDiscoveryViewTests(TestCase):
    def setUp(self):
        self.action = Genre.objects.create(tmdb_id=28, name="Action", slug="action")
        self.scifi = Genre.objects.create(tmdb_id=878, name="Science Fiction", slug="science-fiction")
        self.comedy = Genre.objects.create(tmdb_id=35, name="Comedy", slug="comedy")
        self.seed = self.create_movie(100, "Starting Movie", [self.action, self.scifi])

    def create_movie(self, tmdb_id, title, genres, **overrides):
        values = {"runtime_minutes": 120, "release_date": date(2010, 6, 1), "vote_count": 100}
        values.update(overrides)
        movie = Movie.objects.create(tmdb_id=tmdb_id, title=title, **values)
        movie.genres.set(genres)
        return movie

    def discover(self, tmdb_id=100):
        return self.client.get("/api/movies/discover/", {"tmdb_id": tmdb_id})

    def test_ranking_explains_similarity_and_excludes_unrelated_and_adult_movies(self):
        self.create_movie(101, "Same Genres", [self.action, self.scifi])
        self.create_movie(102, "Partial Match", [self.action])
        self.create_movie(103, "Broader Genres", [self.action, self.scifi, self.comedy])
        self.create_movie(104, "Adult Movie", [self.action, self.scifi], adult=True)
        self.create_movie(105, "Unrelated Movie", [self.comedy])

        response = self.discover()
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["seed"]["tmdb_id"], 100)
        matches = data["recommendations"]
        self.assertEqual([match["movie"]["tmdb_id"] for match in matches], [101, 103, 102])
        self.assertEqual(matches[0]["score"], 100)
        self.assertEqual(matches[1]["score"], 76.7)
        self.assertEqual(matches[2]["score"], 65)
        self.assertEqual(matches[0]["shared_genres"], ["Action", "Science Fiction"])
        self.assertEqual(matches[0]["reasons"], [
            "Shared genres: Action, Science Fiction", "Runtime within 20 minutes",
            "Released within five years",
        ])

    def test_missing_metadata_does_not_create_false_reasons_or_bonus_points(self):
        self.create_movie(101, "Unknown Details", [self.action, self.scifi], runtime_minutes=None, release_date=None)
        self.create_movie(102, "Zero Runtime", [self.action, self.scifi], runtime_minutes=0, release_date=None)
        self.seed.runtime_minutes = None
        self.seed.release_date = None
        self.seed.save()
        matches = self.discover().json()["recommendations"]
        self.assertEqual(len(matches), 2)
        for match in matches:
            self.assertEqual(match["score"], 70)
            self.assertEqual(match["reasons"], ["Shared genres: Action, Science Fiction"])

    def test_runtime_and_release_year_boundaries(self):
        self.create_movie(101, "At Boundaries", [self.action, self.scifi], runtime_minutes=140, release_date=date(2015, 12, 31))
        self.create_movie(102, "Outside Boundaries", [self.action, self.scifi], runtime_minutes=141, release_date=date(2016, 1, 1))
        matches = self.discover().json()["recommendations"]
        self.assertEqual([match["score"] for match in matches], [100, 70])

    def test_results_are_limited_without_per_movie_queries(self):
        for index in range(8):
            self.create_movie(200 + index, f"Related {index}", [self.action, self.scifi])
        # Seed + genres and ranked recommendations + genres, regardless of result count.
        with self.assertNumQueries(4):
            response = self.discover()
        self.assertEqual(len(response.json()["recommendations"]), 6)
        self.assertEqual([match["movie"]["tmdb_id"] for match in response.json()["recommendations"]], list(range(200, 206)))

    def test_seed_without_genres_has_an_empty_map(self):
        self.seed.genres.clear()
        response = self.discover()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["recommendations"], [])

    def test_invalid_unknown_and_adult_identifiers(self):
        for invalid in ("abc", "", "-1", "0", "1.5", "1" * 30):
            with self.subTest(identifier=invalid):
                self.assertEqual(self.discover(invalid).status_code, 400)
        self.assertEqual(self.discover(999).status_code, 404)
        self.seed.adult = True
        self.seed.save()
        self.assertEqual(self.discover().status_code, 404)

    def test_surprise_pick_and_empty_catalogue(self):
        response = self.client.get("/api/movies/discover/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["seed"]["tmdb_id"], self.seed.tmdb_id)
        Movie.objects.all().delete()
        self.assertEqual(self.client.get("/api/movies/discover/").status_code, 404)

    def test_discovery_is_read_only(self):
        self.assertEqual(self.client.post("/api/movies/discover/").status_code, 405)


class MoviePickerViewTests(TestCase):
    def setUp(self):
        self.action = Genre.objects.create(
            tmdb_id=28,
            name="Action",
            slug="action",
        )
        self.comedy = Genre.objects.create(
            tmdb_id=35,
            name="Comedy",
            slug="comedy",
        )

        self.matching_movie = Movie.objects.create(
            tmdb_id=100,
            title="Matching Movie",
            runtime_minutes=90,
            vote_average=7.5,
            vote_count=500,
            adult=False,
        )
        self.matching_movie.genres.set([self.action, self.comedy])

        other_movie = Movie.objects.create(
            tmdb_id=101,
            title="Other Movie",
            runtime_minutes=120,
            vote_average=6.5,
            vote_count=50,
            adult=False,
        )
        other_movie.genres.set([self.action])

    def post_json(self, payload):
        return self.client.post(
            "/api/movies/pick/",
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_pick_movie_applies_every_selected_filter(self):
        response = self.post_json(
            {
                "genres": ["Action", "Comedy"],
                "categories": ["Short and Sweet"],
            }
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["match_count"], 1)
        self.assertEqual(response.json()["movie"]["tmdb_id"], 100)

    def test_pick_movie_rejects_unknown_filters(self):
        response = self.post_json(
            {
                "genres": ["Unknown Genre"],
                "categories": [],
            }
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["unknown_genres"], ["Unknown Genre"])

    def test_pick_movie_reports_no_matches(self):
        response = self.post_json(
            {
                "genres": ["Comedy"],
                "categories": ["Epic Runtime"],
            }
        )

        self.assertEqual(response.status_code, 404)

    def test_pick_movie_requires_valid_json(self):
        response = self.client.post(
            "/api/movies/pick/",
            data="not json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)


# Tests every movie category filter.
class MovieQuerySetTests(TestCase):
    # Creates the common movie values.
    def setUp(self):
        # Stores the next unique TMDB identifier.
        self.next_tmdb_id = 1

        # Stores the common valid movie values.
        self.default_movie_values = {
            "release_date": date_months_ago(120),
            "runtime_minutes": 120,
            "budget": 20_000_000,
            "revenue": 50_000_000,
            "popularity": 30,
            "vote_average": 6.5,
            "vote_count": 300,
            "original_language": "en",
        }

    # Creates one movie with optional value changes.
    def create_movie(self, title: str, **overrides) -> Movie:
        # Copies the common movie values.
        movie_values = self.default_movie_values.copy()

        # Adds the requested value changes.
        movie_values.update(overrides)

        # Creates the movie.
        movie = Movie.objects.create(
            tmdb_id=self.next_tmdb_id,
            title=title,
            **movie_values,
        )

        # Advances the unique TMDB identifier.
        self.next_tmdb_id += 1

        # Returns the created movie.
        return movie

    # Tests matching and rejected movies for every rule.
    def test_category_filters(self):
        # Defines one passing and failing case for each rule.
        filter_cases = (
            (
                "blockbuster_duds",
                {"budget": 60_000_000, "vote_average": 5.5, "vote_count": 600},
                {"budget": 60_000_000, "vote_average": 6.5, "vote_count": 600},
            ),
            (
                "blockbuster_greats",
                {"budget": 60_000_000, "revenue": 250_000_000, "vote_average": 7.2, "vote_count": 1_500},
                {"budget": 60_000_000, "revenue": 150_000_000, "vote_average": 7.2, "vote_count": 1_500},
            ),
            (
                "certified_classics",
                {"release_date": date_months_ago(301), "vote_average": 7.2, "vote_count": 1_500},
                {"release_date": date_months_ago(299), "vote_average": 7.2, "vote_count": 1_500},
            ),
            (
                "crowd_favorites",
                {"vote_average": 8, "vote_count": 6_000},
                {"vote_average": 8, "vote_count": 4_000},
            ),
            (
                "epic_runtime",
                {"runtime_minutes": 160, "vote_average": 8, "vote_count": 500},
                {"runtime_minutes": 140, "vote_average": 8, "vote_count": 500},
            ),
            (
                "hidden_gems",
                {"popularity": 10, "vote_average": 7.2, "vote_count": 1_000},
                {"popularity": 40, "vote_average": 7.2, "vote_count": 1_000},
            ),
            (
                "international_picks",
                {"original_language": "fr", "vote_average": 7.2, "vote_count": 500},
                {"original_language": "en", "vote_average": 7.2, "vote_count": 500},
            ),
            (
                "new_releases",
                {"release_date": date_months_ago(3)},
                {"release_date": date_months_ago(19)},
            ),
            (
                "short_and_sweet",
                {"runtime_minutes": 90, "vote_average": 7.2, "vote_count": 500},
                {"runtime_minutes": 110, "vote_average": 7.2, "vote_count": 500},
            ),
            (
                "small_budget_standouts",
                {"budget": 5_000_000, "vote_average": 7.2, "vote_count": 600},
                {"budget": 15_000_000, "vote_average": 7.2, "vote_count": 600},
            ),
            (
                "surprise_hits",
                {"budget": 5_000_000, "revenue": 30_000_000, "vote_count": 600},
                {"budget": 5_000_000, "revenue": 20_000_000, "vote_count": 600},
            ),
            (
                "trending_now",
                {"release_date": date_months_ago(3), "popularity": 60, "vote_count": 500},
                {"release_date": date_months_ago(3), "popularity": 30, "vote_count": 500},
            ),
        )

        # Tests each filter case independently.
        for method_name, matching_values, rejected_values in filter_cases:
            # Labels the current filter case.
            with self.subTest(method_name=method_name):
                # Removes movies from the previous case.
                Movie.objects.all().delete()

                # Creates the expected matching movie.
                matching_movie = self.create_movie("Matching Movie", **matching_values)

                # Creates the expected rejected movie.
                self.create_movie("Rejected Movie", **rejected_values)

                # Applies the current category filter.
                results = list(getattr(Movie.objects.all(), method_name)())

                # Confirms only the matching movie remains.
                self.assertEqual(results, [matching_movie])

    # Tests that multiple category rules narrow the result.
    def test_apply_category_rules_combines_filters(self):
        # Creates a movie matching both selected rules.
        matching_movie = self.create_movie(
            "Short Crowd Favorite",
            runtime_minutes=90,
            vote_average=8,
            vote_count=6_000,
        )

        # Creates a movie matching only the crowd rule.
        self.create_movie(
            "Long Crowd Favorite",
            runtime_minutes=120,
            vote_average=8,
            vote_count=6_000,
        )

        # Applies both selected rules.
        results = list(
            Movie.objects.apply_category_rules(
                ["crowd_favorites", "short_and_sweet"]
            )
        )

        # Confirms the rules use intersection behavior.
        self.assertEqual(results, [matching_movie])

    # Tests rejection of an unknown rule key.
    def test_apply_category_rules_rejects_unknown_rule(self):
        # Confirms the invalid rule reports an error.
        with self.assertRaisesRegex(ValueError, "Unsupported category rule"):
            # Applies an invalid rule.
            Movie.objects.apply_category_rules(["unknown_rule"])
