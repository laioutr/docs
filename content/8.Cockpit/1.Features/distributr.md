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

**Distributr** turns your catalogue into the file a marketing channel expects and publishes it at a web address that never changes. You set up one **feed** per channel and market; Cockpit reads your storefront on a schedule, writes the file, and the channel downloads it whenever it likes. Open **Distributr** from the project sidebar.

A feed reads the **same storefront your visitors see**, not the shop system behind it. So a product that is hidden, out of stock, or priced differently for one market appears that way in the feed too.

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

Three things shape what the file contains. The **column mapping** says which column carries what. The **field bindings** say where your particular shop keeps each value. The **market values** supply the things that are your decision rather than a fact about a product — what delivery costs, for instance.

### Channels

Each channel comes with a ready **template**: the columns that channel asks for, named the way it reads them, in the order it expects.

| Channel | File type | One row per |
| --- | --- | --- |
| Google Shopping | Tab-separated | Variant |
| Meta Commerce | CSV | Product |
| AWIN | CSV | Variant |
| idealo | CSV | Variant |
| eBay File Exchange | Tab-separated | Variant |

Templates follow each channel's own published specification — including the column names that look misspelled but are not. idealo really does read `decription`, and correcting it breaks the import.

::callout{type="info"}
Some channels also offer an older **legacy** template, kept for accounts already set up against it. Choose the specification template for a new feed: that is the one kept in step with the channel's current documentation.
::

### Creating a feed

**Create feed** asks for the basics. The feed arrives with its channel's mapping already filled in, so it can generate before you change anything.

- **Channel** — decides the columns, the file type, and whether each row is a product or a variant.
- **Market** — decides which catalogue, prices and currency the feed reads.
- **Storefront endpoint** — the address your storefront answers on, for example `https://shop.example.com`.
- **Locale** — the language the feed is written in. Defaults to the market's.
- **Currency** — leave empty to use the market's own.
- **Format** — leave empty to use the channel's own. Only change it if your channel account expects something else.
- **Encoding** — UTF-8, unless the channel account expects otherwise.
- **Refresh** — how often the feed regenerates on its own.

### The feed address

Every feed has a public **Feed address**, shown on its page with a copy button. You can hand it to a channel **before the feed has ever run** — which matters, because setting up a channel account starts with pasting a URL.

The address contains a long random token, so nobody can guess it from your project or market name. Each run replaces the file behind that address; the address itself never changes.

### Column mapping

A feed's page lists its columns in a table you can edit, reorder and extend. Each column has:

- **Channel column** — the heading the channel reads. Rename it only if your account expects something different.
- **Source field** — which value from your catalogue fills it.
- **Transform** — how that value is turned into what the channel accepts: a price with its currency, an availability word from that channel's own list, a category path with the right separator.
- **Constant** — a fixed value written into every row, whatever the product says.
- **Fallback** — used only when everything above comes out empty.
- **Prefix / suffix** — text wrapped around the result, such as a unit.

::callout{type="info"}
**A fallback is not the same as a constant.** A constant overwrites the product's own value. A fallback only fills in a blank, so a product that does have its own value keeps it. Use a fallback for something true of your whole catalogue that your shop has no field for — a marketplace condition code, or a delivery time that is the same for everything.
::

### Where a field lives

A template asks for a field by name — `gender`, `gtin`, `taxonomy` — without saying where your shop keeps it, because every shop keeps it somewhere different. You answer that once per project, as a **channel input** binding, and every feed that needs the field uses it.

Cockpit suggests the fields your storefront actually returned for a real product, so you are picking from things that exist and are filled in.

Leaving a field unbound is not fatal. The feed still generates, that column is empty, and the run tells you which one.

### Market values

Some values are a decision rather than a fact about a product. They belong to the market, and every feed of that market uses them.

- **Ships to** — the country a delivery offer applies to. Without it the offer is left out entirely, because a delivery price with no country applies nowhere.
- **Service name** — what to call the delivery service, for example `Standard`.
- **Shipping rate** and **Free above** — what delivery costs, and the order value above which it is free.
- **Decimal separator** and **Category separator** — what your channel account expects in a price and in a category path.
- **New for** and **Top seller from** — how long a product counts as new, and the sales figure above which it is a top seller.
- **Reference** — small dictionaries that translate your shop's own words into a channel's. Your shop says `Damen`; Google wants `female`, and nothing can work that out on its own.

### Which products go in

A feed can require products to be **in stock** or to **have an image**, set a **minimum price**, and add conditions on any other field. Separately, an **exclusion list** removes individual products by SKU — for the handful of items no rule would ever describe.

Whatever a rule removes is counted, rule by rule. So if a feed suddenly has half the products, you can see which rule did it.

### Running a feed

A feed regenerates on its **Refresh** interval, and you can also run one by hand from the list or from the feed itself. A manual run asks you to confirm: a large catalogue takes minutes, cannot be stopped once it starts, and reads your live storefront while it is serving shoppers.

If a run is interrupted it continues from where it stopped instead of starting over, and a feed that is already running will not start a second time. The list shows progress in the row, so you can tell a long run from a stuck one without opening it.

When several feeds of the same market come due together, they share a single read of the catalogue. Five channels cost one pass over your products, not five.

### What a run tells you

The run log names exactly what it is talking about:

- a column the channel **requires** that came out empty;
- a column only your **channel account** can fill — a marketplace's own category number lives in that account, and no catalogue has it. This is what gets a file rejected on the first upload, and nothing else warns you about it;
- two rows with the **same ID**, which a channel reads as one product replacing the other;
- a **link** that would have been a slug instead of a full address;
- which parts of your catalogue the run asked for — the first thing to check when a column is unexpectedly empty.

If a run had to leave something out, it says so. If it could not start at all, it says why.

### Product links

Most channels need a web address for every product. Cockpit builds it from your own product page setup, so it matches where a visitor would actually land.

If your product pages are set up in an unusual way, you can write the address pattern yourself in **Product URL** — `https://shop.example.com/p/{slug}` — and that is used as-is. Leave it empty and Cockpit works the address out for you.
