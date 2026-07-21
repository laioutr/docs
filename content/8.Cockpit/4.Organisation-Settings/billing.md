---
title: Billing
description: Stripe customer portal, subscription details, plan changes, and pricing upsell when no subscription exists.
seo:
  title: Organization billing | Cockpit
sitemap:
  loc: /cockpit/organisation/billing
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## Billing (organization)

The **Billing** tab (`/o/{organization-slug}/billing`) shows **payment customer data**, **subscriptions**, and (when enabled) a **plan picker**. You need the **`billing`** permission to open this tab; otherwise it stays **disabled** with a tooltip.

### Billing profile

When a **billing customer** exists for the organization, you see:

- **Customer name** (and related billing context).
- **Manage billing** — opens the **Stripe customer portal** in the browser so you can update payment methods, invoices, and other customer-facing billing settings (exact options depend on Stripe and your Laioutr setup).

### Active subscription

If the organization has a **core product / subscription**, a card shows:

- **Product** name (and **description** when present).
- **Subscription status**.
- **Next billing date** (formatted in your locale).

Actions (when applicable):

- **Change plan** — redirects through the billing portal flow for **subscription updates**.
- **Cancel subscription** — only shown when the current subscription **allows cancellation** in product logic; also uses the billing portal flow.

### Plans and upsell

Depending on **feature flags** and whether you already have a subscription, you may see:

- A **pricing table** (Stripe) to **choose a plan** when no core product is active. On **demo** organizations the table may be **masked** with a **contact / upgrade** call-to-action instead of clickable plans.
- **Upsell cards** when the public pricing table is turned off: variants for **custom subscription**, **no plan yet**, etc., each with a **contact** action (e.g. email).

Exact copy and which blocks appear depend on your environment (demo vs production, pricing enabled or not).
