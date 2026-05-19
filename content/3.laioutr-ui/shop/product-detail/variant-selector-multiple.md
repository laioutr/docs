---
title: Variant Selector (Multiple)
description: Multi-attribute variant selector that opens an off-canvas sheet to pick across several dimensions at once.
seo:
  title: Variant Selector (Multiple) | Laioutr
  description: Multi-attribute variant selector.
sitemap:
  loc: /laioutr-ui/shop/product-detail/variant-selector-multiple
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`VariantSelectorMultiple` is the trigger row for products where shoppers need to pick across more than one dimension at the same time. Tapping it opens [`VariantOffCanvas`](/laioutr-ui/shop/product-detail/variant-off-canvas) with the full variant grid. Control sheet visibility with `v-model:open`.

The companion siblings `VariantSelectorMultipleTrigger` and `VariantSelectorMultipleAvailability` let you build a custom trigger or surface availability separately when the default layout does not fit.

For a flat inline picker (size and color in the same row), use [`VariantSelectorOptions`](/laioutr-ui/shop/product-detail/variant-selector-options). For wizard-style products with many configurable attributes, use [`VariantSelectorConfigurator`](/laioutr-ui/shop/product-detail/variant-selector-configurator).

Auto-import tag: `<LVariantSelectorMultiple>`.

## Key Business & UX Benefits

- Trigger row keeps the buy-box compact while still signaling "pick your size and color", so the PDP stays scannable for the majority of shoppers.
- Sheet handoff to the full variant grid is the cleanest way to handle two-plus dimensions on mobile, where most variant decisions now happen.
- Companion trigger and availability components let teams tailor the entry point for category-specific buy-boxes (footwear sizing, electronics specs) without forking the picker.
- Availability sits in a `VariantSelectorMultipleAvailability` row directly beneath the trigger, setting expectations before shoppers open the sheet and cutting the frustration of opening a picker only to see everything sold out.

## Usage

::component-code
---
:name: LVariantSelectorMultiple
:story-height: 400px
story-id: ui-blocks-variantselectormultiple--default
title: VariantSelectorMultiple Default
---
```vue-template
<VariantSelectorMultiple v-model:open="open" :variants="product.variants" />
```
::

## Feature List

::features
---
items:
  - "Trigger row keeps the buy-box compact while still signalling that size and color picks live behind it"
  - "v-model:open hands off to VariantOffCanvas so the full variant grid takes over once the shopper taps in"
  - "Companion VariantSelectorMultipleTrigger lets teams ship a custom trigger when the default row does not fit"
  - "Companion VariantSelectorMultipleAvailability renders directly beneath the trigger, surfacing stock state before the sheet opens"
  - "Sheet handoff is the cleanest mobile pattern for products that span two or more attribute dimensions"
---
::

## API Reference

::component-meta{:name="VariantSelectorMultiple"}
::

::component-meta{:name="VariantSelectorMultipleTrigger"}
::

::component-meta{:name="VariantSelectorMultipleAvailability"}
::
