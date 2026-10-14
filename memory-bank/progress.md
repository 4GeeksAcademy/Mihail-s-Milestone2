# Current project state

## Milestone

Milestone 5: migrate the public website and internal backoffice to independent Next.js + TypeScript apps, and render Milestone 2 utility results in the backoffice.

## Known applications

- The root Next.js application currently implements a candidate pipeline and candidate detail flow. It is retained as existing work and is not the TrackFlow operations backoffice.
- `uis/website/` is a standalone Next.js 15, React 19, and TypeScript app on port 3000. `/` contains the migrated corporate homepage sections; `/application` retains the locally validated simulated onboarding form and bilingual toggle.
- `uis/talent-pipeline-tracker/` is a separate static candidate-tracking UI and remains in place.
- `uis/backoffice/` is a separate Next.js 15, React 19, and TypeScript app on port 3001. It retains the operations overview and displays analytics computed by direct imports from the existing M2 modules in `src/utils/`; sample data remains illustrative and there is no backend connection.

## Open facts and constraints

- Root `CONTEXT.md` contains the assigned briefing and resolves the CEO attribution in favor of Thomas Harry based on repeated overview and executive-leadership statements.
- The root Next.js candidate demo, public website, and operations backoffice have separate run and verification workflows.
- No TrackFlow backend service has been created by this milestone; service work belongs under `services/` when requirements and API contracts exist.

## Next steps

- Preserve the backoffice demo-data disclaimer until real integrations exist.
- Attach website/backoffice screenshots and link `AGENTS.md` in the PR description when preparing the change for review.
- Add backend services only after requirements and API contracts are defined.