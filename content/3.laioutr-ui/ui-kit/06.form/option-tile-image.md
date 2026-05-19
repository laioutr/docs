---
title: Option Tile (Image)
description: Image-driven variant tile for product option selection, typically color or material.
seo:
  title: Option Tile (Image) | Laioutr
  description: Image-driven variant tile for product option selection.
sitemap:
  loc: /laioutr-ui/ui-kit/form/option-tile-image
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`OptionTileImage` is the image-driven variant tile for product option selection. Use it when the variant is best shown by a thumbnail (color swatch, material sample, pattern preview) rather than by text. Pass `unavailable` with an `unavailableTooltip` so customers can still see which variants exist but understand why they can't pick them.

For text-labelled options (sizes, configurations), use the sibling [`OptionTileText`](/laioutr-ui/ui-kit/form/option-tile-text).

## Key Business & UX Benefits

- Thumbnail-driven options let shoppers pick a color or pattern at a glance, which shortens decision time on product pages and raises add-to-cart rate.
- The `unavailable` state with a tooltip preserves the visual catalog while explaining why a variant can't be picked, so customers ask less and convert more.
- One image-tile primitive keeps swatch grids consistent across PDP, search results, and gift guides, which protects the brand's visual rhythm.

## Usage

::component-code
---
:name: LOptionTileImage
:story-height: 150px
story-id: ui-kit-molecules-optiontileimage--default
title: OptionTileImage Default
---
```vue-template
<OptionTileImage
    v-for="option in colorOptions"
    :key="option.id"
    :id="option.id"
    :label="option.label"
    :media="option.media"
    :selected="selected === option.id"
    :unavailable="!option.inStock"
    unavailable-tooltip="Out of stock"
    @select="selected = option.id"
  />
```
::

## Feature List

::features
---
items:
  - "Image-driven variant tile for product options where a thumbnail (color, material, pattern) communicates the choice better than text"
  - "`unavailable` flag plus `unavailableTooltip` keeps unavailable variants visible while explaining why they can't be picked"
  - "`selected` state lights up the active variant on PDP option rows with focus-visible chrome included"
  - "Pair with `OptionTileText` for text-labelled options (sizes, configurations), so the two cover the full variant surface"
  - "Single tile primitive keeps swatch grids consistent across PDP, search, and gift guides"
---
::


## API Reference

::component-meta{:name="OptionTileImage"}
::
