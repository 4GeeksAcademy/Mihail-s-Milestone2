# TrackFlow Operations Backoffice

An independently runnable internal operations application built with Next.js 15, React 19, and TypeScript. It retains the searchable shipment activity and M2 analytics, and adds a protected stock management area at `/backoffice/inventory`.

## Demo data and M2 integration

All records are illustrative local data, not live operations. Typed fixtures live in `lib/demo-data.ts`. `lib/analytics.ts` imports the Milestone 2 algorithms directly from the monorepo's `src/utils/` modules and renders their inventory, shipment, carrier-selection, search, filter, and validation results on the page. The M2 implementations are not copied into this application.

## Inventory and authentication

- `/backoffice/login` registers or signs in an operative through the FastAPI auth endpoints. Access tokens are held in browser `localStorage` and sent as Bearer credentials by the centralized `lib/api-client.ts` module.
- `/backoffice/inventory/products` displays live SKU stock per assigned warehouse. Low stock is defined as 1-5 units; zero is displayed as out of stock.
- `/backoffice/inventory/orders/inbound` records `StockEntry` goods receipts.
- `/backoffice/inventory/orders/outbound` records `StockExit` dispatches/losses and refreshes current stock when a SKU is selected.
- `/backoffice/inventory/orders` is a read-only history of stock movements.
- Inventory/API fields follow the Milestone 5 TrackFlow context: SKU, StockEntry, StockExit, `warehouse` (`LA`/`ZGZ`) and computed `current_stock`.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

The app starts on `http://localhost:3001`. From the monorepo root, use `npm --prefix uis/backoffice run dev`.

Create `uis/backoffice/.env.local` with `NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:8000` to connect to the local FastAPI service. This value is a URL, not a secret.

In `uis/backoffice/.env.local`, set `NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:8000`. The value is a local API URL, not a credential.

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
