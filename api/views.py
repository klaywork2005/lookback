# Handles API requests and movie selection.
import json
import random

from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Genre, Movie, PickerCategory
from .services.discovery import related_movies


def health(request):
    return JsonResponse({"status": "ok"})


def read_filter_values(payload, field_name):
    values = payload.get(field_name, [])

    if not isinstance(values, list):
        raise ValueError(f"{field_name} must be a list.")

    cleaned_values = []

    for value in values:
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"Every {field_name} value must be a nonempty string.")

        cleaned_value = value.strip()

        if cleaned_value not in cleaned_values:
            cleaned_values.append(cleaned_value)

    return cleaned_values


def resolve_genres(values):
    genres = []
    unknown_values = []

    for value in values:
        genre = Genre.objects.filter(
            Q(name__iexact=value) | Q(slug__iexact=value)
        ).first()

        if genre is None:
            unknown_values.append(value)
        else:
            genres.append(genre)

    return genres, unknown_values


def resolve_category_rules(values):
    rule_keys = []
    unknown_values = []

    for value in values:
        category = PickerCategory.objects.filter(
            Q(name__iexact=value)
            | Q(slug__iexact=value)
            | Q(rule_key__iexact=value),
            is_active=True,
        ).first()

        if category is None:
            unknown_values.append(value)
        else:
            rule_keys.append(category.rule_key)

    return rule_keys, unknown_values


def serialize_movie(movie):
    poster_url = None
    backdrop_url = None

    if movie.poster_path:
        poster_url = f"https://image.tmdb.org/t/p/w500{movie.poster_path}"

    if movie.backdrop_path:
        backdrop_url = f"https://image.tmdb.org/t/p/original{movie.backdrop_path}"

    return {
        "id": movie.id,
        "tmdb_id": movie.tmdb_id,
        "title": movie.title,
        "original_title": movie.original_title,
        "overview": movie.overview,
        "release_date": (
            movie.release_date.isoformat()
            if movie.release_date is not None
            else None
        ),
        "runtime_minutes": movie.runtime_minutes,
        "budget": movie.budget,
        "revenue": movie.revenue,
        "popularity": movie.popularity,
        "vote_average": (
            float(movie.vote_average)
            if movie.vote_average is not None
            else None
        ),
        "vote_count": movie.vote_count,
        "poster_path": movie.poster_path,
        "poster_url": poster_url,
        "backdrop_path": movie.backdrop_path,
        "backdrop_url": backdrop_url,
        "original_language": movie.original_language,
        "adult": movie.adult,
        "genres": [genre.name for genre in movie.genres.all()],
    }


@require_GET
def discover_movies(request):
    """Return a movie and six explainable recommendations from stored data."""
    requested_id = request.GET.get("tmdb_id")
    movies = Movie.objects.filter(adult=False).prefetch_related("genres")
    if requested_id is not None:
        if (
            not requested_id.isascii() or not requested_id.isdecimal()
            or len(requested_id) > 18 or int(requested_id) == 0
        ):
            return JsonResponse({"error": "tmdb_id must be a positive movie identifier."}, status=400)
        seed = movies.filter(tmdb_id=int(requested_id)).first()
        if seed is None:
            return JsonResponse({"error": "This movie is not available in the catalogue."}, status=404)
    else:
        # Start from a familiar movie; keep the random selection bounded.
        seed_ids = list(
            movies.exclude(genres=None).order_by("-vote_count", "tmdb_id")
            .values_list("tmdb_id", flat=True).distinct()[:50]
        )
        if not seed_ids:
            return JsonResponse({"error": "No movies are available to explore yet."}, status=404)
        seed = movies.get(tmdb_id=random.choice(seed_ids))

    recommendations = []
    for movie, score, shared_genres, reasons in related_movies(seed):
        recommendations.append({
            "movie": serialize_movie(movie),
            "score": score,
            "shared_genres": shared_genres,
            "reasons": reasons,
        })
    return JsonResponse({"seed": serialize_movie(seed), "recommendations": recommendations})


@csrf_exempt
@require_POST
def pick_movie(request):
    try:
        payload = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Request body must contain valid JSON."}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"error": "Request body must be a JSON object."}, status=400)

    try:
        genre_values = read_filter_values(payload, "genres")
        category_values = read_filter_values(payload, "categories")
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)

    genres, unknown_genres = resolve_genres(genre_values)
    rule_keys, unknown_categories = resolve_category_rules(category_values)

    if unknown_genres or unknown_categories:
        return JsonResponse(
            {
                "error": "One or more filters are not supported.",
                "unknown_genres": unknown_genres,
                "unknown_categories": unknown_categories,
            },
            status=400,
        )

    movies = Movie.objects.filter(adult=False)

    for genre in genres:
        movies = movies.filter(genres=genre)

    movies = movies.apply_category_rules(rule_keys).distinct().order_by("id")
    match_count = movies.count()

    if match_count == 0:
        return JsonResponse(
            {"error": "No movies match every selected filter."},
            status=404,
        )

    movie = movies[random.randrange(match_count)]
    return JsonResponse(
        {
            "movie": serialize_movie(movie),
            "match_count": match_count,
        }
    )
