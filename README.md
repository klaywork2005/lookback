# LookBack

LookBack selects a movie from local TMDB data by genre and category.

## Technology

The client uses React, TypeScript, Vite, and Tailwind CSS.

The server uses Django, PostgreSQL, tmdbsimple, and Docker.

## Structure

```text
api          Models, filters, endpoints, TMDB services, and import commands
lookback     Django settings and root URL configuration
templates    React and Vite client
manage.py    Django command entry point
compose.yaml PostgreSQL service
```

## Environment

Copy `.env.example` to `.env`.

Set `POSTGRES_PASSWORD`, `DJANGO_SECRET_KEY`, and `TMDB_ACCESS_TOKEN`.

Do not commit `.env`.

## Python setup

Run from the project root.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Database setup

```powershell
docker compose up -d
python manage.py migrate
python manage.py createsuperuser
```

PostgreSQL uses host port `5433` and container port `5432`.

## Movie import

Import one popular page and one page for every category.

```powershell
python manage.py sync_movies --pages 1 --category-pages 1
```

Each TMDB page contains up to twenty movie summaries. Full details are requested before each movie is saved. Existing records are updated by TMDB identifier.

Continue an import at a later page and stop after a fixed number of new records.

```powershell
python manage.py sync_movies --start-page 51 --pages 60 --new-movies 1000
```

## Server

```powershell
python manage.py runserver
```

Django runs at `http://127.0.0.1:8000`.

The admin page is `http://127.0.0.1:8000/admin/`.

The health endpoint is `http://127.0.0.1:8000/api/health/`.

The movie picker endpoint is `http://127.0.0.1:8000/api/movies/pick/`.

## Client

Run from `templates`.

```powershell
npm install
npm run dev
```

Vite runs at `http://localhost:5173` and forwards `/api` requests to Django.

## Movie request

The picker accepts a JSON object through `POST`.

```json
{
  "genres": ["Action", "Comedy"],
  "categories": ["Blockbuster Greats"]
}
```

Every selected genre and category must match. A successful response contains one movie and the total match count.

## Checks

```powershell
python manage.py check
python manage.py test api
cd templates
npm run lint
npm run build
```

## TMDB attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
