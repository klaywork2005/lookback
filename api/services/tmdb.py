# Reads movie data through tmdbsimple.
import time

from django.conf import settings
import requests
import tmdbsimple as tmdb


TRANSIENT_STATUS_CODES = {429, 500, 502, 503, 504}


def configure_tmdb():
    tmdb.API_KEY = settings.TMDB_ACCESS_TOKEN
    tmdb.USE_BEARER_AUTH = True
    tmdb.REQUESTS_TIMEOUT = 10


def run_tmdb_request(request_function):
    for attempt in range(5):
        try:
            return request_function()
        except requests.RequestException as error:
            response = error.response
            status_code = response.status_code if response is not None else None

            if attempt == 4 or (
                status_code is not None
                and status_code not in TRANSIENT_STATUS_CODES
            ):
                raise

            retry_after = response.headers.get("Retry-After") if response is not None else None
            wait_seconds = float(retry_after) if retry_after else 2 ** attempt
            time.sleep(wait_seconds)


def get_movie_genres():
    configure_tmdb()
    response = run_tmdb_request(lambda: tmdb.Genres().movie_list())
    return response["genres"]


def discover_movies(page=1, **filters):
    configure_tmdb()
    parameters = {
        "include_adult": False,
        "sort_by": "popularity.desc",
    }
    parameters.update(filters)
    return run_tmdb_request(
        lambda: tmdb.Discover().movie(page=page, **parameters)
    )


def get_movie_details(tmdb_id):
    configure_tmdb()
    return run_tmdb_request(lambda: tmdb.Movies(tmdb_id).info())
