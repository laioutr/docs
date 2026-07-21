---
title: Quantity Discount
description: Tiered quantity-discount display, for example "buy 3+ for 10% off".
playground:
  name: QuantityDiscount
  base: ui-blocks-quantitydiscount
  defaultStory: two-items
  height: 460px
seo:
  title: Quantity Discount
  description: Tiered quantity-discount display.
sitemap:
  loc: /laioutr-ui/shop/product-detail/quantity-discount
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`QuantityDiscount` surfaces tiered quantity discounts on PDPs, the "buy 3+ for 10% off, 6+ for 20% off" ladder shoppers compare before bulk-buying. Each row shows the quantity threshold and a savings-percent flag. The data shape is `prices: { quantity: number; savingsPercent: number }[]`; the component sorts the rows by quantity and drops the `quantity: 1` row if present.

Auto-import tag: `<LQuantityDiscount>`.

## Key Business & UX Benefits

- Visible tier ladder is a direct AOV lever, nudging shoppers to add one more unit to clear the next discount threshold.
- A clear savings-percent flag per row removes the math friction that stops shoppers from comparing bulk options on their own.
- Data-driven `prices` array lets promotions and B2B price lists ship without touching PDP code, so merchandising owns the lever directly.

## Feature List

::features
---
items:
  - "Each row shows the quantity threshold and a savings-percent flag so shoppers see the next jump at a glance"
  - "Single prices prop drives the ladder ({ quantity, savingsPercent }[]), so promotions and B2B price lists ship as data without touching PDP code"
  - "Drops into the PDP buy-box next to the quantity stepper, where the next-add decision happens"
  - "Handles any number of tiers from a simple 'buy 3+' nudge to multi-tier B2B price breaks"
  - "Rows sort by quantity automatically and a `quantity: 1` row is filtered out, so authoring stays forgiving"
---
::

## API Reference

::component-meta{:name="QuantityDiscount"}
::
