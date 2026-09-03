# Enables deferred type annotations.
from __future__ import annotations

# Imports calendar month lengths.
from calendar import monthrange

# Imports iterable type support.
from collections.abc import Iterable

# Imports date values.
from datetime import date

# Imports Django model tools.
from django.db import models

# Imports the configured local date.
from django.utils import timezone


# Returns a date a number of months before today.
def date_months_ago(months: int) -> date:
    # Stores the current local date.
    today = timezone.localdate()

    # Converts the target month to one continuous index.
    target_month_index = (today.year * 12) + today.month - 1 - months

    # Separates the target year and month.
    target_year, target_month_offset = divmod(target_month_index, 12)

    # Converts the month offset to a calendar month.
    target_month = target_month_offset + 1

    # Limits the day to a valid day in the target month.
    target_day = min(today.day, monthrange(target_year, target_month)[1])

    # Returns the calculated date.
    return date(target_year, target_month, target_day)


# Provides reusable movie category filters.
class MovieQuerySet(models.QuerySet):
    # Returns poorly rated movies with large budgets.
    def blockbuster_duds(self) -> MovieQuerySet:
        # Applies the blockbuster duds thresholds.
        return self.filter(
            budget__gte=50_000_000,
            vote_average__lt=6,
            vote_count__gte=500,
        )

    # Returns successful and well rated blockbusters.
    def blockbuster_greats(self) -> MovieQuerySet:
        # Applies the blockbuster greats thresholds.
        return self.filter(
            budget__gte=50_000_000,
            revenue__gte=200_000_000,
            vote_average__gte=7,
            vote_count__gte=1_000,
        )

    # Returns highly rated movies at least twenty five years old.
    def certified_classics(self) -> MovieQuerySet:
        # Applies the certified classics thresholds.
        return self.filter(
            release_date__lte=date_months_ago(300),
            vote_average__gte=7,
            vote_count__gte=1_000,
        )

    # Returns movies with strong ratings and broad participation.
    def crowd_favorites(self) -> MovieQuerySet:
        # Applies the crowd favorites thresholds.
        return self.filter(
            vote_average__gte=7.5,
            vote_count__gte=5_000,
        )

    # Returns long and well rated movies.
    def epic_runtime(self) -> MovieQuerySet:
        # Applies the epic runtime thresholds.
        return self.filter(
            runtime_minutes__gte=150,
            vote_average__gte=7.5,
            vote_count__gte=100,
        )

    # Returns well rated movies with limited popularity.
    def hidden_gems(self) -> MovieQuerySet:
        # Applies the hidden gems thresholds.
        return self.filter(
            popularity__lt=25,
            vote_average__gte=7,
            vote_count__gte=100,
            vote_count__lte=2_500,
        )

    # Returns well rated movies produced outside English.
    def international_picks(self) -> MovieQuerySet:
        # Removes missing and English language values.
        queryset = self.exclude(original_language__in=["", "en"])

        # Applies the international picks thresholds.
        return queryset.filter(
            vote_average__gte=7,
            vote_count__gte=100,
        )

    # Returns movies released during the last eighteen months.
    def new_releases(self) -> MovieQuerySet:
        # Stores the current local date.
        today = timezone.localdate()

        # Applies the new release date range.
        return self.filter(
            release_date__gte=date_months_ago(18),
            release_date__lte=today,
        )

    # Returns short and well rated movies.
    def short_and_sweet(self) -> MovieQuerySet:
        # Applies the short and sweet thresholds.
        return self.filter(
            runtime_minutes__lte=100,
            vote_average__gte=7,
            vote_count__gte=100,
        )

    # Returns well rated movies made with small budgets.
    def small_budget_standouts(self) -> MovieQuerySet:
        # Applies the small budget standouts thresholds.
        return self.filter(
            budget__gt=0,
            budget__lte=10_000_000,
            vote_average__gte=7,
            vote_count__gte=500,
        )

    # Returns movies earning at least five times their budgets.
    def surprise_hits(self) -> MovieQuerySet:
        # Applies the surprise hits thresholds.
        return self.filter(
            budget__gt=0,
            revenue__gte=models.F("budget") * 5,
            vote_count__gte=500,
        )

    # Returns recent movies with high popularity.
    def trending_now(self) -> MovieQuerySet:
        # Stores the current local date.
        today = timezone.localdate()

        # Applies the trending now thresholds.
        return self.filter(
            release_date__gte=date_months_ago(60),
            release_date__lte=today,
            popularity__gte=50,
            vote_count__gte=100,
        )

    # Applies every selected category rule.
    def apply_category_rules(self, rule_keys: Iterable[str]) -> MovieQuerySet:
        # Maps stored rule keys to queryset methods.
        rule_methods = {
            "blockbuster_duds": "blockbuster_duds",
            "blockbuster_greats": "blockbuster_greats",
            "certified_classics": "certified_classics",
            "crowd_favorites": "crowd_favorites",
            "epic_runtime": "epic_runtime",
            "hidden_gems": "hidden_gems",
            "international_picks": "international_picks",
            "new_releases": "new_releases",
            "short_and_sweet": "short_and_sweet",
            "small_budget_standouts": "small_budget_standouts",
            "surprise_hits": "surprise_hits",
            "trending_now": "trending_now",
        }

        # Starts with the current queryset.
        queryset = self

        # Applies each distinct rule in selection order.
        for rule_key in dict.fromkeys(rule_keys):
            # Finds the method assigned to the rule.
            method_name = rule_methods.get(rule_key)

            # Rejects an unsupported rule.
            if method_name is None:
                # Reports the unsupported rule.
                raise ValueError(f"Unsupported category rule: {rule_key}")

            # Applies the rule to the current results.
            queryset = getattr(queryset, method_name)()

        # Returns the filtered results.
        return queryset


# Stores one TMDB movie genre.
class Genre(models.Model):
    # Stores the stable TMDB identifier.
    tmdb_id = models.PositiveIntegerField(unique=True)

    # Stores the displayed genre name.
    name = models.CharField(max_length=100, unique=True)

    # Stores the stable genre value used by the API.
    slug = models.SlugField(max_length=100, unique=True)

    # Stores the local creation time.
    created_at = models.DateTimeField(auto_now_add=True)

    # Stores the local update time.
    updated_at = models.DateTimeField(auto_now=True)

    # Defines database behavior for genres.
    class Meta:
        # Orders genres by name.
        ordering = ["name"]

    # Returns the displayed genre name.
    def __str__(self) -> str:
        # Returns a readable admin label.
        return self.name


# Stores one movie imported from TMDB.
class Movie(models.Model):
    # Provides the movie category filters.
    objects = MovieQuerySet.as_manager()

    # Stores the stable TMDB identifier.
    tmdb_id = models.PositiveBigIntegerField(unique=True)

    # Stores the displayed movie title.
    title = models.CharField(max_length=255)

    # Stores the original movie title.
    original_title = models.CharField(max_length=255, blank=True)

    # Stores the movie description.
    overview = models.TextField(blank=True)

    # Stores the first known release date.
    release_date = models.DateField(null=True, blank=True, db_index=True)

    # Stores the runtime in minutes.
    runtime_minutes = models.PositiveSmallIntegerField(null=True, blank=True, db_index=True)

    # Stores the production budget.
    budget = models.PositiveBigIntegerField(null=True, blank=True, db_index=True)

    # Stores the reported revenue.
    revenue = models.PositiveBigIntegerField(null=True, blank=True, db_index=True)

    # Stores the current TMDB popularity score.
    popularity = models.FloatField(null=True, blank=True, db_index=True)

    # Stores the TMDB vote average.
    vote_average = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True,
        db_index=True,
    )

    # Stores the number of TMDB votes.
    vote_count = models.PositiveIntegerField(default=0, db_index=True)

    # Stores the relative poster image path.
    poster_path = models.CharField(max_length=255, blank=True)

    # Stores the relative backdrop image path.
    backdrop_path = models.CharField(max_length=255, blank=True)

    # Stores the original language code.
    original_language = models.CharField(max_length=10, blank=True, db_index=True)

    # Stores the TMDB adult content flag.
    adult = models.BooleanField(default=False)

    # Stores every genre assigned to the movie.
    genres = models.ManyToManyField(Genre, related_name="movies", blank=True)

    # Stores the most recent TMDB synchronization time.
    last_synced_at = models.DateTimeField(null=True, blank=True)

    # Stores the local creation time.
    created_at = models.DateTimeField(auto_now_add=True)

    # Stores the local update time.
    updated_at = models.DateTimeField(auto_now=True)

    # Defines database behavior for movies.
    class Meta:
        # Orders movies by title and release date.
        ordering = ["title", "release_date"]

        # Defines movie data constraints.
        constraints = [
            # Limits known ratings to the TMDB scale.
            models.CheckConstraint(
                condition=(
                    models.Q(vote_average__isnull=True)
                    | models.Q(vote_average__gte=0, vote_average__lte=10)
                ),
                name="movie_vote_average_between_zero_and_ten",
            ),
        ]

    # Returns the displayed movie title.
    def __str__(self) -> str:
        # Returns a readable admin label.
        return self.title


# Stores one selectable filtering category.
class PickerCategory(models.Model):
    # Defines every supported category rule.
    class RuleKey(models.TextChoices):
        # Identifies the blockbuster duds rule.
        BLOCKBUSTER_DUDS = "blockbuster_duds", "Blockbuster Duds"
        # Identifies the blockbuster greats rule.
        BLOCKBUSTER_GREATS = "blockbuster_greats", "Blockbuster Greats"
        # Identifies the certified classics rule.
        CERTIFIED_CLASSICS = "certified_classics", "Certified Classics"
        # Identifies the crowd favorites rule.
        CROWD_FAVORITES = "crowd_favorites", "Crowd Favorites"
        # Identifies the epic runtime rule.
        EPIC_RUNTIME = "epic_runtime", "Epic Runtime"
        # Identifies the hidden gems rule.
        HIDDEN_GEMS = "hidden_gems", "Hidden Gems"
        # Identifies the international picks rule.
        INTERNATIONAL_PICKS = "international_picks", "International Picks"
        # Identifies the new releases rule.
        NEW_RELEASES = "new_releases", "New Releases"
        # Identifies the short and sweet rule.
        SHORT_AND_SWEET = "short_and_sweet", "Short and Sweet"
        # Identifies the small budget standouts rule.
        SMALL_BUDGET_STANDOUTS = "small_budget_standouts", "Small Budget Standouts"
        # Identifies the surprise hits rule.
        SURPRISE_HITS = "surprise_hits", "Surprise Hits"
        # Identifies the trending now rule.
        TRENDING_NOW = "trending_now", "Trending Now"

    # Stores the displayed category name.
    name = models.CharField(max_length=100, unique=True)

    # Stores the stable category value used by the API.
    slug = models.SlugField(max_length=100, unique=True)

    # Stores the category explanation.
    description = models.TextField(blank=True)

    # Stores the filtering rule used by Django.
    rule_key = models.CharField(max_length=100, choices=RuleKey.choices, unique=True)

    # Stores the category display position.
    display_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    # Controls whether the category is available.
    is_active = models.BooleanField(default=True)

    # Stores the local creation time.
    created_at = models.DateTimeField(auto_now_add=True)

    # Stores the local update time.
    updated_at = models.DateTimeField(auto_now=True)

    # Defines database behavior for categories.
    class Meta:
        # Orders categories by position and name.
        ordering = ["display_order", "name"]

        # Defines the plural admin label.
        verbose_name_plural = "picker categories"

    # Returns the displayed category name.
    def __str__(self) -> str:
        # Returns a readable admin label.
        return self.name
