# Defines the API routes.
from django.urls import path

from .views import health, pick_movie


urlpatterns = [
    path("health/", health, name="health"),
    path("movies/pick/", pick_movie, name="pick_movie"),
]
