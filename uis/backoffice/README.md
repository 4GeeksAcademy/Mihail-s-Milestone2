# TrackFlow Operations Backoffice

An independently runnable internal operations demo built with Next.js 15, React 19, and TypeScript. It keeps a separate layout from the public website, with searchable and filterable shipment activity and an M2 analytics section.

## Demo data and M2 integration

All records are illustrative local data, not live operations. Typed fixtures live in `lib/demo-data.ts`. `lib/analytics.ts` imports the Milestone 2 algorithms directly from the monorepo's `src/utils/` modules and renders their inventory, shipment, carrier-selection, search, filter, and validation results on the page. The M2 implementations are not copied into this application.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

The app starts on `http://localhost:3001`. From the monorepo root, use `npm --prefix uis/backoffice run dev`.

## Verification

```bash
npm run typecheck
npm run build
```
# TrackFlow Operations Backoffice

An independently runnable internal operations entry view for the TrackFlow monorepo. It demonstrates a workspace shell and a searchable, filterable shipment activity table using local illustrative data.

## Demo data

All shipment rows and summary counts are illustrative examples implemented locally in `app.js`. This page has no API connection and does not display live company operations. Warehouse sites, destinations, and carriers use generic labels to keep sample records clearly illustrative; see `memory-bank/projectbrief.md` for the company facts.

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
