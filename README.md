# Pulse — Resource & Project Management Platform

Role-based prototypes for a resource allocation, project management, timesheet, and finance platform. Every file is **self-contained** (React + Babel via CDN, inline styles, no build step). Double-click any HTML file to run it in a browser — no server required. An internet connection is needed the first time so the CDN scripts can load.

## Start here

Open **`index.html`** — a launcher that links to each role portal. Credentials are pre-filled on every login screen; just click **Log in**.

## Portals

| File | Role | Sign in as | What it does |
|------|------|-----------|--------------|
| `portals/resource-portal.html` | Resource | Marcus Vance | Weekly timesheet with mandatory per-day work descriptions (20-char minimum, "Done & next day", auto-save, edit flow), capacity overview, editable skills. |
| `portals/pm-portal.html` | Project Manager | Sarah Jenkins | Create projects (3-step: details + drag-and-drop attachments → resource discovery & allocation → review), client autocomplete + create-client drawer, client directory, edit/delete projects, remove resources, approve timesheets (with work descriptions), own timesheet. |
| `portals/admin-portal.html` | Admin / Operations | Arjun Mehta | Business KPIs + P&L trend + status donut, finance ledger, client directory (with financial summary + activity timeline), project oversight (delivery + financials), PM oversight, people/user management (+ timesheet status & work-log), sales tracking, role & access matrix. Global search + notifications. |

## Design

One shared minimal language across all portals: warm paper canvas, hairline borders, near-black ink, a single steel-blue accent for live/active states, tabular numerals. Font: Hanken Grotesk.

## Known limitations (prototype)

- **Separate data.** Each portal carries its own demo data; they are not yet behind one role-routed login or a shared data source, so changes in one do not appear in another.
- **Attachments** store metadata only (name, type, uploaded-by, date, version) — file contents are not persisted and "Download" is a placeholder.
- **Not built yet:** the **Sales** portal (acquisition pipeline → project handoff) and the **COO** portal (organizational insights).
- The system "engine" (capacity, utilization, progress, profitability) is computed inside the portals, not as a standalone screen.

## Roles at a glance

- **Admin** — creates users & roles, adds revenue & expenses.
- **PM** — creates projects, allocates resources, approves timesheets.
- **Resource** — logs hours, updates skills.
- **Sales** — owns project acquisition. *(not built)*
- **COO** — consumes organizational insights. *(not built)*
- **System** — calculates capacity, utilization, progress, profitability.
