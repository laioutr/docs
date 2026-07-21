---
title: Swatch Summary
description: Compact swatch summary for product tiles with overflow indicator.
playground:
  name: SwatchSummary
  base: ui-kit-molecules-swatchsummary
  defaultStory: default
  height: 460px
seo:
  title: Swatch Summary
  description: Compact swatch summary for product tiles.
sitemap:
  loc: /laioutr-ui/ui-kit/general/swatch-summary
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`SwatchSummary` is the compact swatch summary used on product tiles. It renders up to N visible [`SwatchChip`](/laioutr-ui/ui-kit/general/swatch-chip) items plus an overflow indicator when the variant count exceeds the limit.

For the underlying single-color primitive, see [`Swatch`](/laioutr-ui/ui-kit/general/swatch). For an interactive picker row with selected and focus states, use [`SwatchOption`](/laioutr-ui/ui-kit/general/swatch-option).

## Key Business & UX Benefits

- Visible color options on listing tiles lift click-through to PDPs, helping shoppers identify products that match what they are looking for.
- Overflow indicator means a product with twenty colors still fits neatly inside a tile without breaking grid alignment.
- Configurable visible count lets merchandising tune density per breakpoint without bespoke styling on each listing variant.

## Feature List

::features
---
items:
  - "`swatches` accepts a typed `SwatchChipProps[]`, so consumers pass the same color tuples used by the chip primitive"
  - "`limit` prop (default 4) slices the visible set and computes the `+n` overflow count via `Math.max(swatches.length - limit, 0)`"
  - "Configurable per-breakpoint density: tune `limit` for tighter rows on mobile and wider ones on desktop without bespoke styles"
  - "Reuses `SwatchChip` for each visible item, so chip styling and tone awareness carry through unchanged"
  - "Overflow indicator keeps grid alignment clean on products with 20+ variants, where listing layouts otherwise break"
---
::

## API Reference

::component-meta{:name="SwatchSummary"}
::
