---
title: Price Info
description: PDP price display with strikethrough original, savings indicator, and reference price.
playground:
  name: PriceInfo
  base: ui-blocks-priceinfo
  defaultStory: default
  height: 460px
seo:
  title: Price Info
  description: PDP price display with strikethrough original.
sitemap:
  loc: /laioutr-ui/shop/product-detail/price-info
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=103-224223&t=wABQtnJ0GubOC0US-4
    target: _blank
---

## Overview

`PriceInfo` is the PDP price display. It renders the current `price`, an optional `strikethroughPrice` (the MSRP shown above the sale price), a unit price (for example, `€2.50 / 100g`), an optional `savingPercentage` badge, a shipping line when `shippingRate` is set, and a tax note such as "VAT included". Values are formatted through the active locale so currency symbols and decimal separators stay correct across markets.

Auto-import tag: `<LPriceInfo>`.

## Customizing the labels

The texts around the price are overridable. Each label prop falls back to its locale string when left empty, so a storefront that is happy with the defaults passes nothing:

| Prop | Overrides | Falls back to |
|---|---|---|
| `strikethroughPriceLabel` | The label before the strikethrough price (MSRP / UVP) | `pdp.msrp` |
| `vatInfo` | The tax and legal note below the price | `pdp.vatIncluded` |
| `shippingPrefix` | The text before the shipping amount | `pdp.plusShipping` |
| `shippingSuffix` | The text after the shipping amount | `pdp.shipping` |

The displayed price values themselves are never affected by these props — they only change the surrounding wording.

`vatInfoVisible` controls whether the tax note renders at all. It shows by default; only an explicit `false` hides it, which is what a market with no applicable tax note needs.

```vue
<LPriceInfo
  :price="price"
  :strikethrough-price="listPrice"
  strikethrough-price-label="UVP"
  :shipping-rate="shipping"
  :vat-info-visible="false"
/>
```

## Key Business & UX Benefits

- Strikethrough original price and savings indicator make promotional value obvious, the same anchoring effect that retailers use to lift conversion on sale items.
- Unit and reference price display meets EU price-indication rules and helps shoppers compare across pack sizes, a known driver of repeat purchase.
- Locale-aware currency, symbol position, and decimal separator render correctly per market with no per-country code paths.
- Single price component keeps the PDP, tile, and cart in visual sync, so shoppers see the same price story from browse to buy.

## Feature List

::features
---
items:
  - "Renders price, strikethroughPrice (MSRP), unitPrice, shippingRate, and a savingPercentage badge in one block"
  - "unitPrice prop supports formats like '€2.50 / 100g' to meet EU price-indication rules"
  - "Every label around the price (MSRP, tax note, shipping prefix and suffix) is overridable, falling back to its pdp.* locale string"
  - "vatInfoVisible hides the tax note for markets where it does not apply"
  - "Locale-aware currency symbol, position, and decimal separator with no per-country code paths"
  - "One price component covers PDP, tile, and cart so shoppers see the same price story from browse to buy"
  - "Optional props mean the same block handles full-price items, promotions, and compared-at displays without conditional templates"
---
::

## API Reference

::component-meta{:name="PriceInfo"}
::
