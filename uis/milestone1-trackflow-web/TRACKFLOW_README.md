# TrackFlow Company Briefing

TrackFlow is a last-mile delivery and warehouse management company founded in 2009 in Los Angeles, United States.

It operates in two markets, United States and Spain, with warehouses in Los Angeles and Zaragoza. The company employs approximately 130 people and generates around 9 million euros in annual revenue.

TrackFlow exists because e-commerce brands are good at making and selling products, but not at getting those products to customers' doors. TrackFlow solves that problem by storing inventory, picking and packing orders, shipping through a network of carriers, and handling returns. For partner brands, the entire logistics operation, from order placement to delivery or return, is TrackFlow's responsibility.

## How the company is organised

TrackFlow is led by Thomas Harry, founder and CEO, based in Los Angeles. The company has a technology office in Zaragoza, Spain, where CTO Andres Kim and most of the tech team are based. Operations, commercial, and customer-facing teams are distributed between both countries.

The company is organised around the following areas:

### Warehouse Operations

Warehouse Operations is where the physical logistics work happens. Ana Whitfield oversees the two warehouses, Los Angeles and Zaragoza, and roughly 70 operatives. Every day, hundreds of orders arrive, are picked from shelves, packed into boxes, and handed off to carriers. The two warehouses currently run on different systems and have no shared view of inventory.

### Last Mile and Carrier Management

Last Mile and Carrier Management handles relationships with 8 carriers across both countries, including UPS, FedEx, MRW, and SEUR. Carlos Vega coordinates shipment assignment, tracks deliveries, and manages incidents such as lost parcels, failed deliveries, and wrong addresses. Most of this work is currently manual and done carrier by carrier.

### Reverse Logistics

Reverse Logistics manages returned products. Sofia Ramos leads a team of five. Returns represent between 18% and 25% of total volume depending on client and country. Every return involves decisions such as approve or reject, collect or not, recondition or dispose, and all decisions currently require human review.

### Customer Experience

Customer Experience is the frontline between TrackFlow and the people it serves. Valentina Cruz manages 15 agents in Los Angeles and Zaragoza who handle queries from both brands and end consumers. Most queries are repetitive, and all are currently handled by humans.

### Commercial and Client Relations

Commercial and Client Relations manages TrackFlow's portfolio of brand clients. Miguel Torres leads account managers and business development staff responsible for retaining existing clients and winning new ones. Contracts run annually, and renewals depend on whether clients feel operations are running well.

### Technology

Technology builds and maintains TrackFlow systems. Andres Kim leads developers, data engineers, and systems staff from Zaragoza. The architecture is currently a patchwork of two warehouse systems, a legacy ERP from the early 2010s, and undocumented integrations built quickly and never properly documented. When something breaks, teams often learn about it via WhatsApp messages from operations.

### Executive Leadership

Executive leadership currently sits with Thomas in Los Angeles, who manages the business with a weekly consolidated report manually prepared by directors every Sunday evening. This process consumes hours and still delivers data that is already one to two days old.

## Where the company stands today

TrackFlow has strong clients, a skilled operations team, and a clear value proposition. What it lacks is the infrastructure required to run a two-country logistics business at scale.

Current pain points include:

- Warehouses cannot see each other's inventory.
- Carrier performance data is not structured.
- Returns are approved or rejected one by one.
- Customer agents answer queries using a Word document in Google Drive.
- The CEO makes decisions based on manually assembled reports.

As a result, TrackFlow is slower, more error-prone, and less profitable than it should be. The gap is growing while competitors invest in automation.

Daniel has created an internal unit called TrackFlow Tech with a clear mandate: build systems, integrations, and intelligent automations so TrackFlow can operate like a modern logistics company.

You are part of that unit.

## Departments and their problems

### Warehouse Operations

Manager: Ana Whitfield (about 70 operatives plus 2 warehouse managers)

Los Angeles and Zaragoza use different warehouse systems, one commercial product and one advanced spreadsheet. Real-time global inventory visibility does not exist. Inbound orders arrive by email in different formats and are transcribed manually. Picking is done with printed paper lists. Inventory discrepancies are frequent and detected late.

What they need:

- A unified inventory API with real-time stock by SKU and warehouse.
- An order ingestion pipeline that parses emails automatically.
- A warehouse operations dashboard.
- Low-stock alerts for clients and procurement.

### Last Mile and Carrier Management

Manager: Carlos Vega (6 logistics coordinators)

TrackFlow works with 8 carriers across both countries, including UPS, FedEx, DHL in the United States; MRW, SEUR, DHL in Spain; and two local carriers. Carrier assignment is manual. Tracking requires checking multiple portals individually. No historical performance metrics are available (on-time delivery, incidents per route, cost per kilogram).

What they need:

- A carrier selection engine that recommends the best carrier by destination, weight, and urgency.
- A unified tracking endpoint aggregating all carriers.
- A public tracking portal for recipients.
- A carrier performance dashboard.

### Reverse Logistics

Manager: Sofia Ramos (5-person team)

Returns are 18% to 25% of volume depending on client and country. Every return is manually reviewed with no automatic approval criteria. Product inspection is subjective and inconsistent. There is no visibility into most-returned products or return reasons.

What they need:

- Automatic returns approval with configurable per-client rules.
- Automated collection flow from approval to label and carrier scheduling.
- AI-assisted inspection where operatives photograph products and AI classifies condition.
- A returns dashboard with pattern analysis.

### Customer Experience

Manager: Valentina Cruz (15 agents in Los Angeles and Zaragoza)

TrackFlow serves two customer types: brands (B2B) and end consumers (B2C). Agents support email, WhatsApp, and phone without a unified ticketing system. About 80% of queries could be automated. There is no knowledge base and no after-hours coverage.

What they need:

- A first-line CX agent for automated tracking and return status responses.
- A semantic knowledge base indexed for RAG.
- A unified ticketing system.
- A real-time CX dashboard.
- Sentiment analysis to identify frustrated customers early.
- Optional but recommended multilingual support (Spanish and English), starting from one base language.

### Commercial and Client Relations

Manager: Miguel Torres (4 account managers plus 4 business development)

Account managers track accounts in personal spreadsheets and email threads. There is no CRM. Monthly client reports are compiled manually into PDFs. There is no visibility into which clients are at risk of non-renewal.

What they need:

- CRM integration with unified client profiles.
- Automated client PDF reports generated by an agent.
- A client health dashboard with renewal risk scores.
- 90-day and 30-day renewal alerts.
- A commercial agent that suggests relevant services to prospects.

### Technology

CTO: Andres Kim (7-person team in Zaragoza)

TrackFlow's architecture reflects years of unplanned growth: two WMS systems, a legacy ERP, undocumented point-to-point Python scripts, and databases in two cloud providers. There is no centralized telemetry. When an endpoint fails in Los Angeles, Zaragoza often discovers it through WhatsApp. Deploying a new feature takes one to two weeks.

What they need:

- Centralized telemetry and logging across both countries.
- A data pipeline feeding all dashboards.
- Real-time monitoring with automatic alerts.
- A technical documentation agent.
- Automated operations tasks (backups, health checks, incident notifications).

### Executive Direction

CEO: Daniel Espinoza

Daniel receives a consolidated report every Monday, manually prepared by directors on Sunday evening. Each director spends three to four hours, and by Monday morning some data is already two days old. There is no unified country-by-country business view, so strategic decisions are made with partial data.

What he needs:

- A global executive dashboard with real-time KPIs from both countries, including shipment volume, on-time delivery, costs, returns, and CSAT.
- An automatically generated weekly report every Monday at 7:00 AM.
- Country comparison views.
- Threshold alerts.
- A natural-language AI assistant.

## Why choose TrackFlow

Choose TrackFlow if you are drawn to:

- Logistics and physical operations where every line of code affects real parcel movement.
- Cross-border complexity with two countries, two languages, two regulatory environments, and two tech stacks to unify.
- Practical data engineering with carrier metrics, SKU inventory, shipment event streams, and returns classification.
- 24/7 systems where CX, tracking, and operations dashboards must be always on.

The AI challenges include image-based product condition classification for returns, semantic search over logistics policies in two languages, explainable carrier selection recommendations, and a real-time parcel tracking aggregator integrating 8 carrier APIs.

If you want to build systems that handle physical-world complexity at scale, TrackFlow is your company.
