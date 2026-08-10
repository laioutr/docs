---
title: Markets
description: Define storefront markets with name, currency, flag, domains, and default language routing in the Cockpit project settings.
seo:
  title: Markets | Cockpit
sitemap:
  loc: /cockpit/features/markets
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Markets

**Markets** group how your storefront is exposed for a region or segment: **name**, **currency**, **visual flag**, and the **domains** (URLs) that visitors use—each mapped to a **language** you maintain under **Translations**. Open **Markets** from the project sidebar (under project settings).

### Overview

The markets page lists every market in a card-style layout. Each row shows the **market name**, **slug**, **domains** (host and optional path) with language hints, and **currency**. A market that is not yet launched carries a **Draft** badge, and the project's default market carries a **Default market** badge. From here you can open **Settings** for a market or **delete** it after confirmation.

If you have no markets yet, an **empty state** explains how to get started and offers **Create market**.

### Default market

Above the list, **Default market** picks which market the storefront treats as primary. It decides:

- the `x-default` hreflang, which tells search engines where to send visitors whose language you don't publish;
- the primary URL of every page, the one that isn't an alias;
- what visitors get when they reach a hostname you haven't assigned to any market;
- which market Studio opens on.

Only **active** markets can be chosen. Leaving it unset falls back to whichever active market happens to sort first, and the page names that market so you can see what you're getting. Set it explicitly on any project with more than one market. Otherwise `x-default` can end up pointing at a market that isn't your main one.

### Market status

Every market is either **Active** or **Draft**, set under **General settings**.

**Draft** means configured but not launched. The market's own domain still works, so you can open it and check the market before go-live, but:

- nothing on the storefront links to it: it stays out of market switchers, hreflang alternates, and `x-default`;
- its pages are served with `noindex, nofollow`, so search engines don't index them.

New markets are created as **Draft**. Set a market to **Active** once its domains and languages are right and you want visitors on it.

The current default market cannot be set to Draft. Assign another default market first.

::callout{type="info"}
Draft is not the same as the **not deployed yet** warning in Studio's market switcher. Not-deployed means the market exists in Cockpit but isn't in the deployed build. Draft means it is deployed and reachable, just not launched.
::

### Creating a market

**Create market** opens a dialog where you set up the basics before saving:

- **General settings**
  - **Name** — required; used as the display name and drives the market’s **slug** when created.
  - **Currency** — choose from a searchable list (name and code).
  - **Status**: either **Active** or **Draft**; new markets default to **Draft** (see [Market status](#market-status)).
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
- **General settings** card: same fields as creation (name, currency, status, flag).
- **Domains** card — edit hosts, paths, and assigned languages; **add** or **remove** rows (you cannot remove the last row).
  - For existing domains, you can mark one as **default** from the row menu so Cockpit knows which domain is primary when that matters for routing or previews.
- **Save** / **Cancel** at the bottom.

If you rename the market, the **slug** may update; when it does, Cockpit can **redirect** you to the URL that matches the new slug.

### Hints on the page

The market editor may remind you to add **missing languages** in **Translations** so every domain can be assigned a language. A **documentation** link in the footer points to further reading outside the Cockpit.

### How this connects to Studio

**Studio** uses your **markets** and their **languages** for the market/language switcher in the top bar, and opens on the **default market**. Draft markets stay listed and editable there, since you configure a market before launching it, and are marked **Draft**. Getting markets and domains right ensures editors preview the storefront in the correct **locale and URL context**.
