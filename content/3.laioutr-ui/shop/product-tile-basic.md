---
title: Product Tile (Basic)
description: Versatile product tile for grids and sliders with brand, title, pricing, flags, swatches, and add-to-cart.
jiraIssueId: LUI-53
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11271-205258&t=t5p6T6f67QhRVCAN-4
    target: _blank
seo:
  title: Product Tile (Basic) | Laioutr
  description: Versatile product tile for grids and sliders.
sitemap:
  loc: /laioutr-ui/shop/product-tile-basic
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/shop/productcard
---

## Overview

`ProductTileBasic` is the building block for product listings: category pages, search results, and promotional sliders. It maintains a consistent height so grid columns line up, follows an accessible focus order, and emits an event instead of running cart logic itself, so it composes with any commerce backend. Price values are formatted through the [`$money`](/frontend/api-reference/common-types/money#formatting-with-money) helper for locale-aware output.

For editorial cards with mixed media, use [`Card`](/laioutr-ui/ui-kit/content/card). For category-promoting tiles, use [`LinkTile`](/laioutr-ui/ui-kit/content/link-tile).

Drive `add-to-cart-loading` from your cart store so the spinner shows during an optimistic update.

Auto-import tag: `<LProductTileBasic>`.

## Key Business & UX Benefits

- One tile spec powers category, search, and slider placements, so every listing surface tells the same product story without per-page tile work.
- Consistent tile height keeps grids visually calm, which raises scan speed and the rate at which shoppers click into a PDP.
- Flag, swatch, and add-to-cart slots give merchandising room to highlight promos and color options on the tile, lifting conversion before the PDP visit.
- Locale-aware pricing via `$money` keeps every listing currency-correct, so the same tile ships across markets without per-country forks.

:::tip
Pro-Tip from Larry: Drive `add-to-cart-loading` from your cart store so the spinner shows during the optimistic update.
:::

## Usage

::component-code
---
:name: LProductTileBasic
:story-height: 500px
story-id: ui-blocks-producttilebasic--full-featured
---
::

## Feature List

::features
---
items:
  - "Consistent tile height locks grid columns into clean rows so listings scan fast"
  - "Slots for flags, swatches, and add-to-cart give merchandising room to highlight promos and color options inline"
  - "Locale-aware pricing through the $money helper so every market gets the right currency and decimal format"
  - "add-to-cart-loading prop drives the spinner during optimistic cart updates, removing the double-tap risk"
  - "Emits cart events instead of mutating state directly, so analytics, A/B tests, and custom flows hook in cleanly"
  - "Accessible focus order tested across grids and sliders, so keyboard shoppers reach every tile predictably"
---
::

## API Reference

::component-meta{:name="ProductTileBasic"}
::
