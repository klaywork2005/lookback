from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.PositiveIntegerField(unique=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='PickerCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
                ('rule_key', models.CharField(choices=[('blockbuster_duds', 'Blockbuster Duds'), ('blockbuster_greats', 'Blockbuster Greats'), ('certified_classics', 'Certified Classics'), ('crowd_favorites', 'Crowd Favorites'), ('epic_runtime', 'Epic Runtime'), ('hidden_gems', 'Hidden Gems'), ('international_picks', 'International Picks'), ('new_releases', 'New Releases'), ('short_and_sweet', 'Short and Sweet'), ('small_budget_standouts', 'Small Budget Standouts'), ('surprise_hits', 'Surprise Hits'), ('trending_now', 'Trending Now')], max_length=100, unique=True)),
                ('display_order', models.PositiveSmallIntegerField(db_index=True, default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'picker categories',
                'ordering': ['display_order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.PositiveBigIntegerField(unique=True)),
                ('title', models.CharField(max_length=255)),
                ('original_title', models.CharField(blank=True, max_length=255)),
                ('overview', models.TextField(blank=True)),
                ('release_date', models.DateField(blank=True, db_index=True, null=True)),
                ('runtime_minutes', models.PositiveSmallIntegerField(blank=True, db_index=True, null=True)),
                ('budget', models.PositiveBigIntegerField(blank=True, db_index=True, null=True)),
                ('revenue', models.PositiveBigIntegerField(blank=True, db_index=True, null=True)),
                ('popularity', models.FloatField(blank=True, db_index=True, null=True)),
                ('vote_average', models.DecimalField(blank=True, db_index=True, decimal_places=2, max_digits=4, null=True)),
                ('vote_count', models.PositiveIntegerField(db_index=True, default=0)),
                ('poster_path', models.CharField(blank=True, max_length=255)),
                ('backdrop_path', models.CharField(blank=True, max_length=255)),
                ('original_language', models.CharField(blank=True, db_index=True, max_length=10)),
                ('adult', models.BooleanField(default=False)),
                ('last_synced_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('genres', models.ManyToManyField(blank=True, related_name='movies', to='api.genre')),
            ],
            options={
                'ordering': ['title', 'release_date'],
                'constraints': [models.CheckConstraint(condition=models.Q(('vote_average__isnull', True), models.Q(('vote_average__gte', 0), ('vote_average__lte', 10)), _connector='OR'), name='movie_vote_average_between_zero_and_ten')],
            },
        ),
    ]
