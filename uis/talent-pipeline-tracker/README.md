# Talent Pipeline Tracker

Internal frontend for the **People & Talent** department to manage the candidate pipeline of an active recruitment campaign.

It replaces the shared spreadsheet + scattered documents workflow with a single screen where the team can see every candidate, filter them, move them through the pipeline and keep internal notes.

## What it does

- **Candidate list** — name, position, current status and current stage at a glance, with applied date and note count.
- **Filtering & search** — filter by status and stage, search by name or email. All done asynchronously, without reloading the page. The active filters are reflected in the URL so a view can be shared or bookmarked.
- **Candidate detail** — opens in a side panel over the list, so the team never loses the context of where they were.
- **Status / stage changes** — a single `select` interaction saves the change (`PATCH`) and rolls back on failure.
- **Internal notes** — add and delete notes from the detail panel.
- **Register & edit candidates** — modal form with client-side validation plus server-side validation errors mapped back to the offending field.
- **Delete candidate** — with confirmation.

## UX guarantees

- Every request has a visible state: skeleton loaders on the list and detail, inline "Saving…" feedback on the pipeline controls, disabled buttons while a mutation is in flight.
- Errors never fail silently: the list shows a retry panel, mutations surface a toast, and form errors are shown per field.
- Requests time out after 15s and in-flight list/detail requests are aborted when superseded, so fast typing never renders stale results.
- Keyboard accessible: `Esc` closes the panel and modal, focus is restored to the triggering element, live regions announce loading and result counts.

## Technology

Zero build step — plain HTML, CSS and JavaScript (ES2017+) with Tailwind via CDN, matching the stack used by the other UI in this folder.

```
talent-pipeline-tracker/
├── index.html      # markup and layout
├── css/styles.css  # form controls, skeleton loader
└── js/
    ├── api.js      # REST client, error normalization, status/stage catalogs
    ├── ui.js       # escaping, formatting, badges, toasts, debounce
    └── app.js      # state, list, detail, notes and form controllers
```

## API

Base URL: `https://playground.4geeks.com/tracker/api/v1` — docs at [/docs](https://playground.4geeks.com/tracker/api/v1/docs).

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/records?status&stage&search&page&limit` | List, filter, search, paginate |
| `POST` | `/records` | Register a candidate |
| `GET` | `/records/{id}` | Candidate detail |
| `PUT` | `/records/{id}` | Edit candidate data |
| `PATCH` | `/records/{id}` | Change status / stage |
| `DELETE` | `/records/{id}` | Remove a candidate |
| `GET` `POST` | `/records/{id}/notes` | List / add internal notes |
| `DELETE` | `/records/{id}/notes/{note_id}` | Delete a note |

Statuses: `received`, `in_progress`, `selected`, `discarded`.
Stages: `pending`, `review`, `personal_interview`, `technical_interview`, `offer_presented`.

## Run it

The API sends permissive CORS headers, so any static server works. Open it over `http://`, not `file://`.

```bash
cd uis/talent-pipeline-tracker
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
