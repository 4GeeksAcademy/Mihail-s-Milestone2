# Current project state

## Milestone

Milestone 4: establish AI-agent context and delivery conventions, keep the public website under `uis/website`, and provide a visible internal entry view under `uis/backoffice`.

## Known applications

- The root Next.js application currently implements a candidate pipeline and candidate detail flow. It is retained as existing work and is not the TrackFlow operations backoffice.
- `uis/website/` contains the TrackFlow public site and application form. Its public content avoids market claims until the authoritative company briefing is available.
- `uis/talent-pipeline-tracker/` is a separate static candidate-tracking UI and remains in place.
- `uis/backoffice/` contains an independently runnable operations overview with clearly labeled illustrative sample data and no backend connection.

## Open facts and constraints

- The root scenario label and detailed in-repo briefing contain conflicting market claims; the assigned company briefing is missing. Keep user-facing content geographically neutral until the project owner provides or confirms the authoritative source.
- The root Next.js app and the static UI projects have separate run and verification workflows.
- No TrackFlow backend service has been created by this milestone; service work belongs under `services/` when requirements and API contracts exist.

## Next steps

- Obtain and copy the authoritative assigned company briefing into `CONTEXT.md` before adding further company-specific claims.
- Keep the public website and operations demo aligned with confirmed facts and preserve the demo-data disclaimer until real integrations exist.
- Add backend services only after requirements and API contracts are defined.