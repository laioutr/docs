---
title: Variant Off Canvas
description: Off-canvas sheet for multi-attribute variant selection.
playground:
  name: VariantOffCanvas
  base: ui-features-variantoffcanvas
  defaultStory: default
  height: 460px
seo:
  title: Variant Off Canvas | Laioutr
  description: Off-canvas sheet for multi-attribute variant selection.
sitemap:
  loc: /laioutr-ui/shop/product-detail/variant-off-canvas
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`VariantOffCanvas` is the off-canvas sheet that opens from [`VariantSelectorMultiple`](/laioutr-ui/shop/product-detail/variant-selector-multiple). It hosts the full variant grid so shoppers can pick across several dimensions at once without leaving the PDP.

Pass the variant data through `groupedVariants` (the array of `{ groupName, variants, swatch? }` groups produced by `VariantSelectorMultiple`), the active dimension through `groupBy`, and the active row through `selectedVariantId`. Control sheet visibility with `v-model:open`, and listen for the `selected` event to receive the picked variant card.

Auto-import tag: `<LVariantOffCanvas>`.

## Key Business & UX Benefits

- Dedicated sheet for picking across multiple dimensions stops the buy-box from filling with selectors, keeping price and CTA above the fold.
- Full-grid presentation makes variant trade-offs visible at once, so shoppers see "this color isn't in your size" before they hit add-to-cart.
- Off-canvas pattern keeps shoppers on the PDP throughout the picking flow, avoiding the conversion drop of a redirect to a configuration page.
- Touch-friendly sheet sized for mobile keeps multi-dimension picking workable on the device where most commerce traffic now lands.

## Feature List

::features
---
items:
  - "v-model:open controls the sheet so any trigger (VariantSelectorMultiple or custom) can open it"
  - "groupedVariants prop takes the { groupName, variants, swatch? } shape produced by VariantSelectorMultiple"
  - "selected event fires with the picked VariantSelectionCardProps so the parent can update the active variant"
  - "Off-canvas pattern keeps shoppers on the PDP throughout picking, avoiding a redirect to a configuration page"
  - "Touch-friendly sheet sized for mobile, where most variant decisions now happen"
  - "Pairs with VariantSelectorMultiple as the standard trigger and sheet duo for multi-dimension PDPs"
---
::

## API Reference

::component-meta{:name="VariantOffCanvas"}
::
