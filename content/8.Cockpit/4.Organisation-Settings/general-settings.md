---
title: General settings
description: Organization name, read-only slug and ID, danger zone for deleting the organization.
seo:
  title: Organization general settings | Cockpit
sitemap:
  loc: /cockpit/organisation/general-settings
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## General settings (organization)

Open your organization in the Cockpit, then go to **Settings** (sidebar). The first tab is **General** — URL pattern: `/o/{organization-slug}/general`.

### Organization details

This section is labeled as basic details about the organization. You get a form with:

- **Organization name** — editable. Save with the submit action; success and error feedback is shown when the update completes.
- **Organization slug** — **read-only** (cannot be changed here).
- **Organization ID (UUID)** — **read-only**, for support and integrations.

Only fields that are enabled can be changed; slug and ID are there so you can **copy** them when needed.

### Danger zone — delete organization

A separate card warns that **deleting the organization also removes its projects**. You should **back up** anything you need before deleting.

- **Delete** starts a **confirmation dialog** (title and body explain the action).
- The delete action is **only enabled** when **all** of the following are true:
  - You are an **admin** of the organization.
  - There are **no active projects** in the organization.
  - There is **no active subscription** (no paid products on the organization).

If the button stays disabled, hover the **info** icon next to it for the full explanation (e.g. active projects or subscriptions must be cleared first).

After a successful deletion, you are typically redirected **away from the organization** (e.g. to the home / organization picker).
