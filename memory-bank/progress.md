# Current project state

## Milestone

Milestone 5 part 1: scaffold operative authentication in TinyDB and the TrackFlow inventory API in Supabase/PostgreSQL using SQLModel.

## Known applications

- The root Next.js application currently implements a candidate pipeline and candidate detail flow. It is retained as existing work and is not the TrackFlow operations backoffice.
- `uis/website/` contains the TrackFlow public site and application form. The assigned briefing is now available in `CONTEXT.md`; reconcile neutral copy with confirmed company facts when relevant.
- `uis/talent-pipeline-tracker/` is a separate static candidate-tracking UI and remains in place.
- `uis/backoffice/` contains an independently runnable operations overview with clearly labeled illustrative sample data and no backend connection.
- `services/` now contains `/auth/register`, `/auth/login`, protected `/inventory` routes, SQLModel inventory tables, separate Pydantic schemas, and an idempotent context-based seed command. Backend tests run against in-memory SQLite; a real Supabase URL remains local configuration.

## Open facts and constraints

- Root `CONTEXT.md` contains the assigned briefing and resolves the CEO attribution in favor of Thomas Harry based on repeated overview and executive-leadership statements.
- The root Next.js app and the static UI projects have separate run and verification workflows.
- Live Supabase validation requires a private `DATABASE_URL` and `JWT_SECRET` in `services/.env`; these values are ignored and must not be committed.

## Next steps

- Reconcile public website copy with the authoritative company briefing as it evolves.
- Preserve the backoffice demo-data disclaimer until real integrations exist.
- Configure the development Supabase database, register an operative, seed it, and verify `/docs` plus live persistence before the demo.