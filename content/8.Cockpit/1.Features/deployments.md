---
title: Deployments
description: Deployments overview table, filters, deploy action, and deployment detail with build logs.
seo:
  title: Deployments | Cockpit
sitemap:
  loc: /cockpit/features/deployments
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Deployments overview

Open **Deployments** from the project sidebar. The overview lists deployments for the **current project** in a sortable, filterable table (newest first by default).

### What you see in the list

- **Environment** — e.g. production or preview. The environment name links to the **deployment detail** for that row.
- **Current deployment** — the row that matches the active deployment for an environment is marked with a **Current** badge.
- **Created** — timestamp; the row also shows **who triggered** the deployment when that information is available.
- **Status** — lifecycle state such as preparing, waiting, running, success, error, or canceled. In-progress states are visually highlighted.
- **Domains / URLs** — links for the deployment URL and, when applicable, the hosting domain for the current deployment.

### Filters and real-time updates

- Filter by **status** and **environment** using the filter bar. Canceled deployments are hidden by default (you can adjust filters to include them).
- The table can **update in real time** as deployment records change, so you do not need to refresh the page to see status changes.

### Deploy

Use the **Deploy** action on the overview to start a new deployment for the project’s main environment. While a deployment is starting or running, the button shows a loading state.

### Empty state

If there are no deployments yet, the overview explains that you can **deploy the project** to get started.

---

## Deployment details

Click an **environment** link in the overview (or open a deployment by ID from the URL) to open the **detail** view for a single deployment.

### Summary

The detail page shows:

- **Status** — same status model as the overview.
- **Environment** — production, preview, etc.
- **Provider** — which hosting integration produced this deployment.
- **Duration** — from start to finish when the run has completed.
- **Triggered by** — profile of the user who started the deployment, when available.
- **URL** — deployment URL and, for the **current** deployment, the configured hosting URL when present.

The page subscribes to updates for that deployment record, so **status and metadata refresh** while a build is in progress.

### Build log

An expandable **Build log** section loads log lines from the hosting integration when supported.

- While the deployment is still in progress, logs may **poll** so new lines appear.
- If the provider does not support logs in Cockpit, you will see a message that build logs are **not available** for that provider.
- If loading fails, use **Retry** to fetch again.

If the deployment cannot be found, Cockpit shows a **not found** message with a short explanation.
