# TrackFlow public website

Public-facing TrackFlow site and application form, placed at the monorepo's canonical `uis/website/` path. It uses static HTML and vanilla JavaScript; Tailwind CSS, fonts, and editorial photography are loaded from external CDNs.

## Run locally

From the repository root:

```bash
python3 -m http.server 8080 --directory uis/website
```

Open `http://localhost:8080/index.html` for the site or `http://localhost:8080/application.html` for the application form. The existing `WEB_RUN.md` also documents `npx serve .` when run from this directory.

This is a static milestone UI. Do not assume its application form is connected to a production API. The detailed company briefing is in `TRACKFLOW_README.md`, but its market claims have not been confirmed against the assigned course briefing. Keep public copy geographically neutral until the authoritative source is provided; see `../../memory-bank/projectbrief.md`.