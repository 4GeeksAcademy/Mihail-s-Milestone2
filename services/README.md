# `services` folder

This folder contains **all the backend services** (APIs and background workers) related to the company for the cross-functional AI Engineering project.

Each subfolder inside `services/` must correspond to **one specific service** (for example: `admin-api`, `data-processor-worker`) and include its own technical and functional documentation.

- **Main purpose**: to centralize all the backend logic, APIs, and queue consumers that support the company's use cases.
- **Recommendation**: document in this file (or in sub-READMEs) the services you add, their objective, the technology used, and how to run them.

> _Spanish version: [README.es.md](./README.es.md)._

## TrackFlow inventory API

The existing service directory had documentation but no FastAPI or TinyDB auth source on this branch, so this milestone adds the service scaffold here. TinyDB is used only for operative accounts and bearer-token lookups; Supabase/PostgreSQL stores `SKU`, `StockEntry`, and `StockExit`. There is no SQL user table.

### Local configuration

Create a private `services/.env` file. Do not commit this file or share its values:

```dotenv
DATABASE_URL=postgresql://<supabase-user>:<password>@<host>:5432/postgres
JWT_SECRET=<random-secret-at-least-32-characters>
AUTH_DB_PATH=./services/data/users.json
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

Install and start the API from the repository root:

```bash
python3 -m venv services/.venv
services/.venv/bin/pip install -r services/requirements.txt
set -a && source services/.env && set +a
services/.venv/bin/uvicorn services.main:app --reload --port 8000
```

FastAPI documentation is available at `http://localhost:8000/docs`. The backoffice connects to this local API using `NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:8000` in its ignored `uis/backoffice/.env.local` file.

Register an operative with `POST /auth/register`, then log in with `POST /auth/login`. Passwords are stored as salted PBKDF2 hashes in TinyDB. JWTs expire after eight hours; protected inventory routes resolve `user_uuid` back to TinyDB on every request.

### Inventory contract

The implementation follows the syllabus TrackFlow context at `content/contexts/05-backend-development/CONTEXT-trackflow.en.md`. The six routes are `GET/POST /inventory/products`, `GET /inventory/products/{id}`, `POST /inventory/orders/inbound`, `POST /inventory/orders/outbound`, and `GET /inventory/orders`.

- `SKU`, `StockEntry`, and `StockExit` are SQLModel tables with database foreign keys and ORM relationships. Pydantic request/response schemas are separate.
- `current_stock` is computed from entries minus exits per SKU and warehouse (`LA` or `ZGZ`); it is not stored or accepted as a writable input.
- A movement's warehouse must match its SKU's warehouse. Outbound quantities cannot exceed available stock and return the required HTTP 400 message.
- Dispatch exits require `tracking_number`; loss exits require it to be null. Orders include SKU data loaded with `selectinload` to avoid N+1 queries.
- Each movement records the authenticated TinyDB user's `user_uuid`; it has no SQL foreign key to a replicated user table.

### Development seed and tests

After starting the API and registering a real operative, load the context's six SKUs, five receipts, and three exits with:

```bash
set -a && source services/.env && set +a
services/.venv/bin/python -m services.seed_data
```

The seed is idempotent and refuses to invent an operative UUID. Run the backend tests with:

```bash
services/.venv/bin/python -m pytest services/tests -q
```

Tests use an in-memory SQLite database and temporary TinyDB files; live Supabase validation requires your private `DATABASE_URL`.
