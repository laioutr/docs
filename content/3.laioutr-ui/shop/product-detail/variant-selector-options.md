---
title: Variant Selector Options
description: Multi-attribute variant selector that picks the right option tile per attribute (text tiles for size and material, image grid or slider for color).
playground:
  name: VariantSelectorOptions
  base: ui-blocks-variantselectoroptions
  defaultStory: default
  height: 460px
seo:
  title: Variant Selector Options
  description: Multi-attribute variant selector with per-attribute option tiles.
sitemap:
  loc: /laioutr-ui/shop/product-detail/variant-selector-options
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`VariantSelectorOptions` is the inline variant picker for a product detail page. It walks every entry in `options` and renders one row per attribute (size, material, color, finish), so a single component handles products with any number of configurable dimensions.

For text attributes it renders `OptionTileText` per value. When an option's name is `"color"` (case-insensitive), it auto-mounts `VariantSelectorOptionsImageGrid` on desktop and `VariantSelectorOptionsImageSlider` on mobile so swatches show their media thumbnails. Availability is computed per option from the `variants` list, so a value disabled by the current selection is shown as unavailable rather than hidden. If a single value is the only remaining choice for an option, it's selected automatically on mount.

Selection is exposed through a `Record<string, string>` v-model keyed by option name, which plugs straight into a `Field` wrapper for required-variant validation.

When the buy-box gets crowded, hand the variant picker off to a sheet with [`VariantSelectorMultiple`](/laioutr-ui/shop/product-detail/variant-selector-multiple). For high-consideration purchases that benefit from one-decision-at-a-time accordions, use [`VariantSelectorConfigurator`](/laioutr-ui/shop/product-detail/variant-selector-configurator).

Auto-import tag: `<LVariantSelectorOptions>`.

## Key Business & UX Benefits

- One component covers products with any number of attributes (size only, size + color, size + color + material), so the PDP layout stays consistent as the catalog grows.
- Automatic swap to image grid (desktop) or slider (mobile) for the `color` attribute gives swatches the visual treatment shoppers expect, without extra wiring.
- Unavailable values stay visible and clearly marked, so shoppers see the full attribute set and understand why a combination is blocked instead of seeing options disappear.
- `v-model` plus `Field` wrapper plays nicely with form validation, so required-variant errors surface inline before the add-to-cart click fails.

## Feature List

::features
---
items:
  - "Walks every entry in options and renders one row per attribute (size, material, color, finish) so a single component handles any number of dimensions"
  - "Auto-mounts VariantSelectorOptionsImageGrid on desktop and VariantSelectorOptionsImageSlider on mobile when the option name is 'color' (case-insensitive)"
  - "Text attributes render OptionTileText per value; color attributes use swatch media thumbnails"
  - "Availability computed per option from the variants list, so values blocked by the current selection show as unavailable instead of disappearing"
  - "When a single value is the only remaining option, it's selected automatically on mount so shoppers don't repeat trivial picks"
  - "Selection exposed as Record<string, string> v-model keyed by option name, which plugs straight into a Field wrapper for required-variant validation"
---
::

## API Reference

::component-meta{:name="VariantSelectorOptions"}
::
