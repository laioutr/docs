---
title: Option Tile (Text)
description: Text-labelled variant tile for product option selection with selected and unavailable states.
playground:
  name: OptionTileText
  base: ui-kit-molecules-optiontiletext
  defaultStory: default
  height: 460px
links: []
seo:
  title: Option Tile (Text)
  description: Text-labelled variant tile for product option selection.
sitemap:
  loc: /laioutr-ui/ui-kit/form/option-tile-text
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/form/variantselectbutton
---

## Overview

`OptionTileText` is the text-labelled variant tile for product option selection (size, configuration, fit). It exposes `selected` and `unavailable` states; combine `unavailable` with `unavailableTooltip` so customers see which variants exist and learn why they can't pick them.

For image-driven variant choices (color, material), use the sibling [`OptionTileImage`](/laioutr-ui/ui-kit/form/option-tile-image).

## Key Business & UX Benefits

- Showing out-of-stock variants as `unavailable` with a tooltip keeps customers informed about what exists, so they can request restocks instead of assuming you don't carry their size.
- Text labels make sizing and configuration scannable on dense PDPs, which lifts confidence at the moment of decision.
- Pairing with `OptionTileImage` lets a product page mix swatches and sizes without two different tile styles competing for attention.

:::tip
Pro-Tip from Larry: Mark out-of-stock variants `unavailable` with an explanatory tooltip instead of hiding them. Customers can still see which variants exist and know what to ask for.
:::

## Feature List

::features
---
items:
  - "Text-labelled variant tile sized for sizing rows, configuration grids, and fit pickers on PDP option rails"
  - "`selected` and `unavailable` states share visual rhythm with `OptionTileImage`, so mixed PDP option rows feel uniform"
  - "`unavailableTooltip` explains why a variant can't be picked, keeping out-of-stock sizes visible instead of hidden"
  - "Pair with `OptionTileImage` to mix swatches and sizes on the same product without two different tile styles"
  - "Renders as a button under the hood, so keyboard focus and screen-reader semantics ship without per-use wiring"
---
::

## API Reference

::component-meta{:name="OptionTileText"}
::
