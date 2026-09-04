# Configures model access in Django Admin.
from django.contrib import admin

from .models import Genre, Movie, PickerCategory


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name", "tmdb_id", "slug", "updated_at")
    search_fields = ("name", "slug", "tmdb_id")
    ordering = ("name",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "tmdb_id",
        "release_date",
        "vote_average",
        "vote_count",
        "popularity",
    )
    list_filter = ("adult", "original_language", "genres")
    search_fields = ("title", "original_title", "tmdb_id")
    ordering = ("title", "release_date")
    filter_horizontal = ("genres",)
    readonly_fields = ("created_at", "updated_at", "last_synced_at")


@admin.register(PickerCategory)
class PickerCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "rule_key",
        "display_order",
        "is_active",
        "updated_at",
    )
    list_editable = ("display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "slug", "rule_key")
    ordering = ("display_order", "name")
    readonly_fields = ("created_at", "updated_at")
