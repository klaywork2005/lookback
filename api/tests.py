# Imports Django test classes.
from django.test import SimpleTestCase, TestCase

# Imports movie filtering tools.
from .models import Movie, date_months_ago


class HealthViewTests(SimpleTestCase):
    def test_health_endpoint(self):
        response = self.client.get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


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
