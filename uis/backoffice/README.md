# TrackFlow Operations Backoffice

An independently runnable internal operations entry view for the TrackFlow monorepo. It demonstrates a workspace shell and a searchable, filterable shipment activity table using local illustrative data.

## Demo data

All shipment rows and summary counts are illustrative examples implemented locally in `app.js`. This page has no API connection and does not display live company operations. Warehouse sites, destinations, and carriers use generic labels because the assigned company briefing has not confirmed market geography; see `memory-bank/projectbrief.md`.

## Technology

Static HTML, CSS, and vanilla JavaScript. No build step or package installation is needed. Fonts load from Google Fonts when a network connection is available; system fallbacks remain usable offline.

## Run

From the repository root:

```bash
python3 -m http.server 8081 --directory uis/backoffice
```

Open `http://localhost:8081`.

## Current interactions

- Search sample rows by order ID, example brand, destination, or carrier.
- Filter sample rows by warehouse and shipment status.
- Use `/` to focus search and the refresh control to update the local display timestamp.
- Summary cards update with the active filters and count only the local sample records.
