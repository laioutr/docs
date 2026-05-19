---
title: Variant Selection Card
description: Card-shaped variant tile combining image, option attributes, price, and a savings indicator.
seo:
  title: Variant Selection Card | Laioutr
  description: Card-shaped variant tile.
sitemap:
  loc: /laioutr-ui/ui-kit/form/variant-selection-card
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`VariantSelectionCard` is the card-shaped variant tile used by `VariantSelectorMultiple` for product choices that span more than just color or size: subscription plans, bundle options, upgrade tiers. It is a `RadioGroupItem`, so it must be rendered inside a `RadioGroup` parent that owns the selected value. The variant attributes shown on the card come from the required `selectedOptions` array (each entry has `name` and `value`); pass the image as a `Media` object through the `image` prop, the `price` as a `Money` value, and an optional `savingPercentage` to drive the built-in savings flag, which renders `Save {percent}%` (or `Spare {percent}%` per locale) through the `variantSelectionCard.saving` key.

For single-axis variants (color, size), use [`OptionTileImage`](/laioutr-ui/ui-kit/form/option-tile-image) or [`OptionTileText`](/laioutr-ui/ui-kit/form/option-tile-text) instead.

## Key Business & UX Benefits

- The built-in savings indicator turns bundle and upgrade economics into a single visual cue, which lifts attach rate on higher-tier variants.
- Combining image, option attributes, and price in one tile gives subscription and bundle pickers the density they need without forcing shoppers to read fine print.
- The locale-driven `Save {percent}%` string keeps the savings message localized for every market without per-country template work.

## Usage

::component-code
---
:name: LVariantSelectionCard
:story-height: 150px
story-id: ui-kit-organisms-variantselectioncard--default
title: VariantSelectionCard Default
---
```vue-template
<RadioGroup v-model="selectedPlanId">
    <VariantSelectionCard
      v-for="plan in plans"
      :key="plan.id"
      :id="plan.id"
      :image="plan.image"
      :price="plan.price"
      :selected-options="plan.options"
      :saving-percentage="plan.savings"
      @selected="(payload) => onPlanSelected(payload)"
    />
  </RadioGroup>
```
::

## Feature List

::features
---
items:
  - "Card-shaped tile combining image, the `selectedOptions` attributes, price, and a savings indicator, sized for subscription plans, bundles, and upgrade tiers"
  - "`RadioGroupItem` under the hood: wrap a set of cards in a `RadioGroup` v-model and the kit handles selection state; cards emit `selected` with the picked card's full props"
  - "Built-in savings indicator driven by `variantSelectionCard.saving` locale key (`Save {percent}%` / `Spare {percent}%`) localized per market"
  - "Used by `VariantSelectorMultiple`, so the same tile powers PDP multi-axis selectors and stand-alone bundle pickers"
  - "Pair with `OptionTileImage` or `OptionTileText` when the choice is a single axis (color or size) and the card density is overkill"
  - "`savingPercentage` is opt-in: omit it for variants without a saving, and the tile collapses the badge automatically"
---
::


## API Reference

::component-meta{:name="VariantSelectionCard"}
::
