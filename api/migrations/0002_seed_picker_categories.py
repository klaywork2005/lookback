from django.db import migrations


CATEGORIES = [
    {
        "name": "Blockbuster Duds",
        "slug": "blockbuster-duds",
        "description": "Large budget movies with low ratings and substantial vote counts.",
        "rule_key": "blockbuster_duds",
        "display_order": 1,
    },
    {
        "name": "Blockbuster Greats",
        "slug": "blockbuster-greats",
        "description": "Large budget movies with high revenue, strong ratings, and substantial vote counts.",
        "rule_key": "blockbuster_greats",
        "display_order": 2,
    },
    {
        "name": "Certified Classics",
        "slug": "certified-classics",
        "description": "Highly rated movies released at least twenty five years ago.",
        "rule_key": "certified_classics",
        "display_order": 3,
    },
    {
        "name": "Crowd Favorites",
        "slug": "crowd-favorites",
        "description": "Highly rated movies with broad audience participation.",
        "rule_key": "crowd_favorites",
        "display_order": 4,
    },
    {
        "name": "Epic Runtime",
        "slug": "epic-runtime",
        "description": "Highly rated movies with runtimes of at least one hundred fifty minutes.",
        "rule_key": "epic_runtime",
        "display_order": 5,
    },
    {
        "name": "Hidden Gems",
        "slug": "hidden-gems",
        "description": "Well rated movies with limited popularity and moderate vote counts.",
        "rule_key": "hidden_gems",
        "display_order": 6,
    },
    {
        "name": "International Picks",
        "slug": "international-picks",
        "description": "Well rated movies whose original language is not English.",
        "rule_key": "international_picks",
        "display_order": 7,
    },
    {
        "name": "New Releases",
        "slug": "new-releases",
        "description": "Movies released during the last eighteen months.",
        "rule_key": "new_releases",
        "display_order": 8,
    },
    {
        "name": "Short and Sweet",
        "slug": "short-and-sweet",
        "description": "Well rated movies with runtimes of one hundred minutes or less.",
        "rule_key": "short_and_sweet",
        "display_order": 9,
    },
    {
        "name": "Small Budget Standouts",
        "slug": "small-budget-standouts",
        "description": "Well rated movies produced with budgets of ten million dollars or less.",
        "rule_key": "small_budget_standouts",
        "display_order": 10,
    },
    {
        "name": "Surprise Hits",
        "slug": "surprise-hits",
        "description": "Movies earning at least five times their production budgets.",
        "rule_key": "surprise_hits",
        "display_order": 11,
    },
    {
        "name": "Trending Now",
        "slug": "trending-now",
        "description": "Recent movies with high current popularity and sufficient vote counts.",
        "rule_key": "trending_now",
        "display_order": 12,
    },
]


def create_picker_categories(apps, schema_editor):
    PickerCategory = apps.get_model("api", "PickerCategory")

    for category in CATEGORIES:
        rule_key = category["rule_key"]
        defaults = {
            key: value
            for key, value in category.items()
            if key != "rule_key"
        }
        PickerCategory.objects.update_or_create(
            rule_key=rule_key,
            defaults=defaults,
        )


def delete_picker_categories(apps, schema_editor):
    PickerCategory = apps.get_model("api", "PickerCategory")
    rule_keys = [category["rule_key"] for category in CATEGORIES]
    PickerCategory.objects.filter(rule_key__in=rule_keys).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            create_picker_categories,
            delete_picker_categories,
        ),
    ]
