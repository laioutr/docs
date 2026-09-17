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

### How it fits together

```mermaid
flowchart LR
  SF[("Storefront catalogue")]
  MAP["Column mapping"]
  BIND["Field bindings"]
  MV["Market values"]
  RUN{{"Run"}}
  FILE["Feed file"]
  ADDR(["Feed address"])
  CH["Google · Meta · AWIN<br/>idealo · eBay"]

  SF --> RUN
  MAP --> RUN
  BIND --> RUN
  MV --> RUN
  RUN --> FILE
  FILE --> ADDR
  ADDR --> CH
```

The mapping says which column carries what, the bindings say where this shop keeps each value, and the market values supply what is a decision rather than a catalogue fact. A run combines the three, writes the file, and replaces whatever sat at the address before.

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

::note
Some channels are also offered in an older **legacy** shape, kept for accounts already configured against it. New feeds should use the specification template: it is the one held to the channel's current documentation.
::

### Creating a feed

::steps{level="4"}

#### Pick the channel and market

The **channel** decides the columns, the file format and whether a row is a product or a variant. The **market** decides the currency, the prices and the catalogue the feed reads.

#### Point it at your storefront

**Storefront endpoint** is the address the catalogue is read from, and **Locale** is the language the feed carries.

#### Name the file

**Name** is yours, for the list. **File name** is what the channel downloads.

#### Set the cadence

**Refresh** is how often the schedule regenerates the feed.

::

The feed is created with its channel's own mapping already in place, so it can generate before you change anything.

### Feed settings

::field-group{title="Feed settings"}
  :::field{required name="Channel" type="string"}
  Which channel definition the feed follows. Decides the columns, the format and the row granularity.
  :::

  :::field{required name="Market" type="string"}
  The market whose catalogue, prices and currency the feed reads.
  :::

  :::field{required name="Storefront endpoint" type="url"}
  Where the catalogue is read from, for example `https://shop.example.com`.
  :::

  :::field{name="Locale" type="string"}
  The language the feed carries. Defaults to the market's.
  :::

  :::field{name="Currency" type="ISO 4217"}
  Leave empty to take the market's own currency.
  :::

  :::field{name="Format" type="csv | tsv"}
  Leave empty to take the channel's own. Only an account configured otherwise needs to disagree.
  :::

  :::field{name="Encoding" type="UTF-8 | ISO-8859-1"}
  UTF-8 unless the channel account expects otherwise.
  :::

  :::field{name="Refresh" type="minutes"}
  How often the schedule regenerates the feed.
  :::

  :::field{name="Product URL" type="pattern"}
  Stated only when this project's product pages are not configured in the usual way — see [Product links](#product-links).
  :::
::

### The feed address

Every feed has a public **Feed address**, shown on its page with a copy button. It is stable and answerable **before the first run**, which is the point: a channel account is configured with a URL, and waiting for a generation to learn it is backwards.

The address carries an unguessable token, so it is not derivable from your project or market names. Each run replaces the file at that address; the URL never moves.

### Column mapping

A feed's page shows its columns as a table you can edit, reorder and extend.

::field-group{title="Per column"}
  :::field{required name="Channel column" type="string"}
  The header the channel reads. Rename only if your account expects something else.
  :::

  :::field{name="Source field" type="string"}
  Which catalogue value fills it.
  :::

  :::field{required name="Transform" type="string"}
  How the value becomes what the channel accepts — a price with its currency, an availability word from that channel's own vocabulary, a category path with the right separator.
  :::

  :::field{name="Constant" type="string"}
  A literal written into every row, whatever the product says.
  :::

  :::field{name="Fallback" type="string"}
  Used only when everything above produces nothing.
  :::

  :::field{name="Prefix / suffix" type="string"}
  Wrapped around the result — a unit, a literal marker.
  :::
::

::tip
**A fallback is not a constant.** A constant overwrites the product's own value; a fallback only fills a blank. It is how a catalogue-wide fact your shop has no field for reaches a column — a marketplace condition code, a delivery time quoted the same for everything — while a product that *does* carry its own value still wins.
::

### Where a field lives

A template asks for a field by name — `gender`, `gtin`, `taxonomy` — and never says where your shop keeps it. That is different per shop, so it is answered once per project as a **channel input** binding and shared by every feed that asks for it.

Cockpit suggests paths taken from what your storefront actually returned for a real product, so you are choosing among fields that exist and are populated, not reading a schema.

A field nobody has bound is not fatal: the feed generates, the column is empty, and the run names it.

### Market values

Some values are a decision rather than a catalogue fact, and belong to the market rather than to a channel. They are set once and every feed of that market uses them.

::field-group{title="Market values"}
  :::field{name="Ships to" type="ISO country"}
  The country a shipping offer applies to. A shipping price with no country applies nowhere, so the offer is left out entirely without it.
  :::

  :::field{name="Service name" type="string"}
  What to call the shipping service, for example `Standard`.
  :::

  :::field{name="Shipping rate" type="money"}
  What delivery costs.
  :::

  :::field{name="Free above" type="money"}
  The order value above which delivery is nothing.
  :::

  :::field{name="Decimal separator" type="'.' | ','"}
  What the channel account expects in a price.
  :::

  :::field{name="Category separator" type="string"}
  What separates the levels of a category path.
  :::

  :::field{name="New for" type="days"}
  How long after publication a product still counts as new.
  :::

  :::field{name="Top seller from" type="number"}
  The sales figure above which a product is labelled a top seller.
  :::

  :::field{name="Reference" type="dictionary"}
  Maps your shop's own words to a channel's vocabulary. A shop says `Damen`; Google takes `female`, and no automatic rule can know that.
  :::
::

### Which products go in

A feed can require products to be **in stock** or to **have an image**, set a **minimum price**, and add conditions on any field. Separately, an **exclusion list** removes named products outright — the answer for the handful of items no rule would ever describe.

Every product a rule removes is counted and reported, per rule, so a feed that suddenly halves tells you which rule did it.

### Running a feed

A feed regenerates on its **Refresh** interval. You can also run one by hand, from the list or from the feed itself.

::caution
**A manual run asks for confirmation first.** Regenerating a large catalogue takes minutes, cannot be stopped once started, and reads a live storefront while it serves buyers. The confirmation is there because a mistaken click costs real time on a real shop.
::

Runs are **resumable**: a generation that is interrupted continues where it stopped rather than starting over, and a feed already running refuses a second run instead of publishing two files over each other. The list shows progress in the row, so a long run is distinguishable from a stuck one without opening anything.

When several feeds of one market are due together they **share one read** of the catalogue. Five channels cost one pass over your products, not five.

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

A project whose product pages are not configured in the usual way can state the shape directly in **Product URL**:

```text
https://shop.example.com/p/{slug}
```

That is then used verbatim. Leave it empty and Cockpit derives the address from the storefront endpoint and the page configuration.

### A storefront behind bot protection

A feed is a machine reading your storefront, so a storefront that keeps non-browsers out keeps the feed out too. Where Laioutr manages the hosting, Cockpit presents the deployment's own credential automatically and you configure nothing.

Where it cannot, the run fails **immediately** and names the protection rather than retrying quietly — a challenge never clears, and a feed that retries forever looks like one still generating.

::card{title="Bot Protection" to="/frontend/features/bot-protection"}
How protection is configured for a storefront, and what it does to requests that are not a browser.
::
