"""Rank related movies using the existing catalogue, without external API calls."""

from datetime import date

from django.db.models import Case, Count, ExpressionWrapper, F, FloatField, Q, Value, When

from api.models import Movie


def related_movies(seed, limit=6):
    seed_genres = list(seed.genres.all())
    genre_ids = [genre.pk for genre in seed_genres]
    if not genre_ids:
        return []

    # Rank in SQL before limiting, so the whole catalogue is considered.
    candidates = (
        Movie.objects.filter(adult=False)
        .exclude(pk=seed.pk)
        .annotate(
            shared_genres=Count("genres", filter=Q(genres__pk__in=genre_ids), distinct=True),
            total_genres=Count("genres", distinct=True),
        )
        .filter(shared_genres__gt=0)
    )
    runtime_match = Q(pk__in=[])
    if seed.runtime_minutes and seed.runtime_minutes > 0:
        runtime_match = Q(
            runtime_minutes__gt=0,
            runtime_minutes__gte=seed.runtime_minutes - 20,
            runtime_minutes__lte=seed.runtime_minutes + 20,
        )
    year_match = Q(pk__in=[])
    if seed.release_date:
        year_match = Q(release_date__range=(
            date(max(1, seed.release_date.year - 5), 1, 1),
            date(min(9999, seed.release_date.year + 5), 12, 31),
        ))
    candidates = candidates.annotate(
        similarity_score=ExpressionWrapper(
            70.0 * F("shared_genres")
            / (len(genre_ids) + F("total_genres") - F("shared_genres"))
            + Case(When(runtime_match, then=Value(15.0)), default=Value(0.0))
            + Case(When(year_match, then=Value(15.0)), default=Value(0.0)),
            output_field=FloatField(),
        )
    ).order_by("-similarity_score", "-vote_count", "tmdb_id").prefetch_related("genres")[:limit]

    results = []
    for movie in candidates:
        shared = sorted(genre.name for genre in movie.genres.all() if genre.pk in genre_ids)
        reasons = [f"Shared genres: {', '.join(shared)}"]
        if (
            seed.runtime_minutes and movie.runtime_minutes
            and abs(seed.runtime_minutes - movie.runtime_minutes) <= 20
        ):
            reasons.append("Runtime within 20 minutes")
        if (
            seed.release_date and movie.release_date
            and abs(seed.release_date.year - movie.release_date.year) <= 5
        ):
            reasons.append("Released within five years")
        results.append((movie, round(movie.similarity_score, 1), shared, reasons))
    return results
