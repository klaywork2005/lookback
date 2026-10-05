# Defines the API routes.
from django.urls import path

from .views import discover_movies, health, pick_movie


urlpatterns = [
    path("health/", health, name="health"),
    path("movies/pick/", pick_movie, name="pick_movie"),
    path("movies/discover/", discover_movies, name="discover_movies"),
]
