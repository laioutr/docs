---
title: Stock Info Summary
description: Compact stock availability indicator with size variants.
playground:
  name: StockInfoSummary
  base: ui-kit-molecules-stockinfosummary
  defaultStory: check-mark-positive
  height: 460px
seo:
  title: Stock Info Summary
  description: Compact stock availability indicator.
sitemap:
  loc: /laioutr-ui/ui-kit/general/stock-info-summary
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`StockInfoSummary` shows a compact stock state ("in stock", "low stock", "out of stock") inline on product tiles, PDPs, and cart rows. Pass the `text` to display, an optional `icon`, a `color` (`'positive'`, `'warning'`, or `'negative'`) that picks the matching `--delivery-and-stock-info-*-text-color` token, and a `size` (`'s'` default, or `'m'`) that scales the icon and text together.

## Key Business & UX Benefits

- "Low stock" cues create gentle urgency that lifts conversion, especially on fast-moving variants where shoppers risk losing their size.
- Showing out-of-stock state on listings, not just PDPs, saves shoppers a wasted click and reduces post-add disappointment.
- The `text` prop is a plain string, so the indicator localizes naturally through the consumer's i18n layer without per-surface forks.

## Feature List

::features
---
items:
  - "Three colors ('positive', 'warning', 'negative') token-bound to `--delivery-and-stock-info-*-text-color` for in-stock, low-stock, and out-of-stock cues"
  - "Two sizes ('s', 'm'), with icon and text scales auto-paired ('s' uses xs text and s icon; 'm' uses s text and sm icon)"
  - "Optional `icon` prop sits before the text and inherits the color token, so check-circle, clock, and alert glyphs follow the status hue"
  - "`text` is a plain string, so the indicator localizes naturally through the consumer's i18n layer"
  - "Compact layout suits product tiles, PDP rows, and cart lines without per-surface overrides"
---
::

## API Reference

::component-meta{:name="StockInfoSummary"}
::
