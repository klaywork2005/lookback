# LookBack

LookBack contains a React frontend and a Django server.

## Stack

The frontend uses React, TypeScript, Vite, Tailwind CSS, and Cytoscape.js.

The server uses Django and PostgreSQL.

Docker provides the local PostgreSQL service.

## Structure

```text
frontend        React application
backend         Django project
compose.yaml    PostgreSQL service
```

## Database

The Django project uses the existing PostgreSQL service named `postgres` in `compose.yaml`.

Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD` and `DJANGO_SECRET_KEY`.

Start PostgreSQL from the repository root.

```text
docker compose up postgres
```

## Server

Install Django, psycopg, and python dotenv.

Run these commands from `backend`.

```text
pip install Django==6.1 "psycopg[binary]" python-dotenv
python manage.py migrate
python manage.py runserver
```

The health endpoint is available at `http://127.0.0.1:8000/api/health/`.

API key integration is intentionally absent.

## Frontend

Run these commands from `frontend`.

```text
npm install
npm run dev
```

Vite forwards requests beginning with `/api` to Django during development.
