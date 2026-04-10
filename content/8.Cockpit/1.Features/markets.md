---
title: Markets
description: Define storefront markets with name, currency, flag, domains, and default language routing in the Cockpit project settings.
seo:
  title: Markets | Cockpit | Laioutr
sitemap:
  loc: /cockpit/features/markets
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Markets

**Markets** group how your storefront is exposed for a region or segment: **name**, **currency**, **visual flag**, and the **domains** (URLs) that visitors use—each mapped to a **language** you maintain under **Translations**. Open **Markets** from the project sidebar (under project settings).

### Overview

The markets page lists every market in a card-style layout. Each row shows the **market name**, **slug**, **domains** (host and optional path) with language hints, and **currency**. From here you can open **Settings** for a market or **delete** it after confirmation.

If you have no markets yet, an **empty state** explains how to get started and offers **Create market**.

### Creating a market

**Create market** opens a dialog where you set up the basics before saving:

- **General settings**
  - **Name** — required; used as the display name and drives the market’s **slug** when created.
  - **Currency** — choose from a searchable list (name and code).
  - **Market image / icon** — optional **flag or region** picker (including a “global” style option) so the market is easy to recognize in lists and in Studio.
- **Domains**
  - One or more **domain rows**: enter the hostname (the field is prefixed with `www.` as a visual hint; you can still enter values like `shop.example.com` or paths such as `shop.example.com/de`).
  - For each row, pick the **language** that should be served on that domain (only **languages you already added** under **Translations** appear here).
  - Add another domain with **Add domain** when one market serves multiple hosts or paths.

Save creates the market and returns you to the list.

### Editing a market

Open a market via its name, flag, or **Settings**. The detail view shows:

- A **back** link to the markets list.
- The market **title** and **delete market** (with confirmation—same as deleting from the list).
- **General settings** card — same fields as creation (name, currency, flag).
- **Domains** card — edit hosts, paths, and assigned languages; **add** or **remove** rows (you cannot remove the last row).
  - For existing domains, you can mark one as **default** from the row menu so Cockpit knows which domain is primary when that matters for routing or previews.
- **Save** / **Cancel** at the bottom.

If you rename the market, the **slug** may update; when it does, Cockpit can **redirect** you to the URL that matches the new slug.

### Hints on the page

The market editor may remind you to add **missing languages** in **Translations** so every domain can be assigned a language. A **documentation** link in the footer points to further reading outside the Cockpit.

### How this connects to Studio

**Studio** uses your **markets** and their **languages** for the market/language switcher in the top bar. Getting markets and domains right ensures editors preview the storefront in the correct **locale and URL context**.
