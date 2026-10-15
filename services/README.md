# `services` folder

This folder contains **all the backend services** (APIs and background workers) related to the company for the cross-functional AI Engineering project.

Each subfolder inside `services/` must correspond to **one specific service** (for example: `admin-api`, `data-processor-worker`) and include its own technical and functional documentation.

- **Main purpose**: to centralize all the backend logic, APIs, and queue consumers that support the company's use cases.
- **Recommendation**: document in this file (or in sub-READMEs) the services you add, their objective, the technology used, and how to run them.

> _Spanish version: [README.es.md](./README.es.md)._

## TrackFlow inventory API

The FastAPI service implements TinyDB-backed operative registration/login and the Supabase/PostgreSQL-backed TrackFlow inventory API. Inventory routes are protected with bearer JWTs issued by `/auth/login`; `/docs` exposes the generated OpenAPI reference.

### Local setup

From the repository root, create `services/.env` with your own private values (never commit it):

```dotenv
DATABASE_URL=postgresql+psycopg://<user>:<password>@<host>:5432/postgres
JWT_SECRET=<random-secret-at-least-32-characters>
AUTH_DB_PATH=./services/data/users.json
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

Install and run the API on port 8000, loading the private values into the process:

```bash
python3 -m venv services/.venv
services/.venv/bin/pip install -r services/requirements.txt
set -a && source services/.env && set +a && services/.venv/bin/uvicorn services.main:app --reload --port 8000
```

Register an operative at `/auth/register`, sign in at `/auth/login`, then run `services/.venv/bin/python -m services.seed_data` to add the syllabus development SKUs and movements to the configured database. Seed data is explicit, idempotent, and attributes movements to an already registered TinyDB user. Never use seed credentials or development data as a production access policy.

### Inventory rules

- The API follows `content/contexts/05-backend-development/CONTEXT-trackflow.en.md`: `SKU`, `StockEntry`, and `StockExit`, with `/inventory` routes.
- `current_stock` is calculated per SKU and warehouse from entries minus exits; it is not stored.
- Outbound stock cannot go below zero. API responses use the required HTTP 400 error detail.
- Dispatch exits require a tracking number; loss exits require `tracking_number: null`.
- TinyDB stores operative credentials separately from SQLModel inventory tables. There is no SQL user table.

### Backend checks

```bash
services/.venv/bin/python -m pytest services/tests -q
```

Tests use an in-memory SQLite database and temporary TinyDB file. For live integration, configure a development Supabase `DATABASE_URL` and the backoffice API URL; no real credentials belong in source control.
