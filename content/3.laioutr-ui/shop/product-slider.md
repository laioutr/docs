---
title: Product Slider
description: Section-level horizontally scrollable product collection with optional headline, scrollbar, and CTA.
playground:
  name: ProductSlider
  base: ui-sections-productslider
  defaultStory: default
  height: 460px
jiraIssueId: LUI-200
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=12175-374053&t=kWl7opPn708GdN7H-4
    target: _blank
seo:
  title: Product Slider | Laioutr
  description: Section-level horizontally scrollable product collection.
sitemap:
  loc: /laioutr-ui/shop/product-slider
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/shop/productslider
---

## Overview

`ProductSlider` presents a product collection as a horizontally scrollable strip. It is the workhorse for cross-sells, related products, recently-viewed lists, and category highlights on home and landing pages. The content header carries a heading, a subline, and a single CTA button. Navigation buttons can sit at the top or the bottom of the strip, and an optional scrollbar gives shoppers extra browsing feedback on long collections.

For premium placements that need a banner image and richer per-tile chrome, reach for [`ProductSliderShowcase`](/laioutr-ui/shop/product-slider-showcase) instead.

Auto-import tag: `<LProductSlider>`.

## Key Business & UX Benefits

- Cross-sells, related products, and recently-viewed strips are proven AOV and discovery levers, all from one slider component.
- Horizontal strip surfaces a full collection without consuming the vertical real estate a grid demands, keeping more content above the fold.
- Top or bottom nav placement and the optional scrollbar let merchandising tune browsing feedback per page without code changes.
- Heading, subline, and single CTA give campaign teams a clear narrative slot above each strip, so collections sell themselves as a story.

:::tip
Pro-Tip from Larry: Use `ProductSlider` for cross-sells and related products so collections are visible without a full grid.
:::

## Feature List

::features
---
items:
  - "Horizontal strip layout shows a full collection without consuming the vertical space a grid demands"
  - "Content header carries a heading, subline, and single CTA so each strip reads as a campaign story"
  - "Navigation buttons can sit at the top or bottom of the strip, tuned per page without touching code"
  - "Optional scrollbar gives shoppers extra browsing feedback when collections run long"
  - "Drop-in for cross-sells, related products, recently-viewed lists, and home-page category highlights"
  - "Step up to ProductSliderShowcase when a placement needs a banner image and richer per-tile chrome"
---
::

## API Reference

::component-meta{:name="ProductSlider"}
::
