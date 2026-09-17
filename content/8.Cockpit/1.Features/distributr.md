---
title: Distributr
description: Generate product data feeds for Google, Meta, AWIN, idealo and eBay from your storefront, and publish each one at a stable address the channel fetches on its own.
seo:
  title: Distributr | Cockpit
sitemap:
  loc: /cockpit/features/distributr
  lastmod: 2026-09-17
  changefreq: monthly
  priority: 0.8

---

## Distributr

**Distributr** turns your catalogue into the file a marketing channel expects, and publishes it at an address that never changes. You configure a **feed** per channel and market; Cockpit reads your storefront on a schedule, writes the file, and the channel fetches it whenever it likes. Open **Distributr** from the project sidebar.

Nothing is exported from a database or a commerce platform directly. A feed reads the **same storefront a visitor sees**, so a product that is hidden, out of stock or priced differently for a market is that way in the feed too.

### Overview

The feeds page lists every feed with its **channel**, **market**, **file name**, when it last published, and what it is doing now. A feed that is generating shows its progress in the row, so a long run is distinguishable from a stuck one without opening anything.

From the list you can **run** a feed, open it, or delete it. Search filters by name, file or storefront.

### Channels

Each channel ships as a **template**: the columns that channel documents, spelled the way it reads them, in the order it expects.

| Channel | File | One row per |
| --- | --- | --- |
| Google Shopping | Tab-separated | Variant |
| Meta Commerce | CSV | Product |
| AWIN | CSV | Variant |
| idealo | CSV | Variant |
| eBay File Exchange | Tab-separated | Variant |

Templates are written against each channel's own published specification and checked against it automatically, including the spellings that are wrong on purpose — idealo reads `decription`, and correcting it breaks the import.

::callout{type="info"}
Some channels are also offered in an older **legacy** shape, kept for accounts already configured against it. New feeds should use the specification template: it is the one held to the channel's current documentation.
::

### Creating a feed

**Create feed** asks for the essentials:

- **Channel** — decides the columns, the file format and whether rows are products or variants.
- **Market** — decides the currency, the prices and the catalogue the feed reads.
- **Name** and **File name** — the name is yours; the file name is what the channel downloads.
- **Encoding** — UTF-8 unless the channel account expects otherwise.
- **Refresh** — how often the schedule regenerates it.
- **Storefront endpoint** — the address Cockpit reads the catalogue from.
- **Locale** — which language the feed carries.
- **Currency** — leave empty to take the market's.
- **Format** — leave empty to take the channel's own.

### The feed address

Every feed has a public **Feed address**, shown on its page with a copy button. It is stable and answerable **before the first run**, which is the point: a channel account is configured with a URL, and waiting for a generation to learn it is backwards.

The address carries an unguessable token, so it is not derivable from your project or market names. Each run replaces the file at that address; the URL never moves.

### Column mapping

A feed's page shows its columns as a table you can edit. Per column:

| Field | What it does |
| --- | --- |
| **Channel column** | The header the channel reads. Rename only if your account expects something else. |
| **Source field** | Which catalogue value fills it. |
| **Transform** | How the value is turned into what the channel accepts — a price with its currency, an availability word from that channel's own vocabulary, a category path with the right separator. |
| **Constant** | A literal written into every row. |
| **Fallback** | Used only when everything above produces nothing. |
| **Prefix / suffix** | Wrapped around the result — a unit, a marker. |

Columns can be reordered or removed, and new ones added.

**Fallback is not a constant.** A constant overwrites whatever the product says; a fallback only fills a blank. It is how a catalogue-wide fact your shop has no field for reaches a column — a marketplace condition code, a delivery time quoted the same for everything — while a product that *does* carry its own value still wins.

### Where a field lives

A template asks for a field by name — `gender`, `gtin`, `taxonomy` — and never says where your shop keeps it. That is different per shop, so it is answered once per project under **Channel input** bindings and shared by every feed that asks for it.

Cockpit suggests paths taken from what your storefront actually returned for a real product, so you are choosing from fields that exist and are populated, not from a schema.

A field nobody has bound is not fatal: the feed generates, the column is empty, and the run names it.

### Market values

Some values are a decision rather than a catalogue fact, and belong to the market rather than to a channel. They are set once per market:

- **Ships to** and **Service name** — the country a shipping offer applies to and what to call it. A shipping price with no country applies nowhere.
- **Shipping rate** and **Free above** — the cost, and the order value above which it is nothing.
- **Decimal separator** and **Category separator** — what your channel account expects.
- **New for** and **Top seller from** — the thresholds behind the "new" and "top seller" labels.
- **Reference** — dictionaries that map your shop's own words to a channel's vocabulary. A shop says `Damen`; Google takes `female`, and no automatic rule can know that.

### Which products go in

A feed can require products to be **in stock** or to **have an image**, set a **minimum price**, and add conditions on any field. Separately, an **exclusion list** removes named products outright — the answer for the handful of items a rule would never describe.

Every product a rule removes is counted and reported, per rule, so a feed that suddenly halves tells you which rule did it.

### Running a feed

A feed regenerates on its **Refresh** interval. You can also run one by hand, from the list or from the feed.

A manual run **asks first**. A regeneration of a large catalogue takes minutes, cannot be stopped once started, and reads a live storefront while it serves buyers — so it is a decision, not a click.

Runs are **resumable**. A generation that is interrupted continues where it stopped rather than starting over, and a feed that is already running refuses a second run instead of publishing two files over each other.

When several feeds of one market are due together, they **share one read** of the catalogue. Five channels cost one pass over your products, not five.

### What a run tells you

The run log is written for whoever has to fix something, and names the unit it is talking about:

- a column the channel **requires** that came out empty;
- a column only your **channel account** can answer — a marketplace's own category id lives in that account, and no catalogue has it. A file is rejected wholesale on first upload for exactly this, and nothing else reports it;
- two rows claiming the **same id**, which a channel reads as one product overwriting the other;
- a **link** that would ship a slug rather than an address;
- which **components** the run asked your storefront for — the first thing to check when a column comes back empty.

A run that had to degrade says so. A run that could not start says why.

### Product links

Most channels need an address for every product. Cockpit builds it from your project's own product page configuration, so it matches what a visitor would land on.

A project whose product pages are not configured in the usual way can state the shape directly in **Product URL** — for example `https://shop.example.com/p/{slug}` — and that is used verbatim. Leave it empty and Cockpit derives the address from the storefront endpoint and the page configuration.

### A storefront behind bot protection

A feed is a machine reading your storefront, so a storefront that keeps non-browsers out keeps the feed out too. Where Laioutr manages the hosting, Cockpit presents the deployment's own credential automatically and you configure nothing.

Where it cannot, the run fails **immediately** and names the protection rather than retrying quietly — a challenge never clears, and a feed that retries forever looks like one that is still generating. See [Bot Protection](/frontend/features/bot-protection) for how protection is configured for a storefront.
