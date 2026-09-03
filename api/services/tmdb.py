from django.conf import settings
import tmdbsimple as tmdb


def configure_tmdb():
    tmdb.API_KEY = settings.TMDB_ACCESS_TOKEN
    tmdb.USE_BEARER_AUTH = True
    tmdb.REQUESTS_TIMEOUT = 10


def get_movie_genres():
    configure_tmdb()
    response = tmdb.Genres().movie_list()
    return response["genres"]


def discover_movies(page=1, **filters):
    configure_tmdb()
    parameters = {
        "include_adult": False,
        "sort_by": "popularity.desc",
    }
    parameters.update(filters)
    return tmdb.Discover().movie(page=page, **parameters)


def get_movie_details(tmdb_id):
    configure_tmdb()
    return tmdb.Movies(tmdb_id).info()
