---
title: Product Listing Grid
description: Responsive grid of product tiles for category, search, and brand listing pages.
playground:
  name: ProductListingGrid
  base: ui-blocks-productlistinggrid
  defaultStory: default
  height: 460px
seo:
  title: Product Listing Grid | Laioutr
  description: Responsive grid of product tiles.
sitemap:
  loc: /laioutr-ui/shop/product-listing-grid
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=14795-155216&t=D15GraY4m5o14KTa-4
    target: _blank
---

## Overview

`ProductListingGrid` is the responsive grid of [`ProductTileBasic`](/laioutr-ui/shop/product-tile-basic)s for category, search, and brand listing pages. It owns the responsive column counts so tiles stay aligned across breakpoints. Pair it with [`FilterBar`](/laioutr-ui/shop/filter-bar) above the grid and [`SortModes`](/laioutr-ui/shop/sort-modes) for sort controls.

Auto-import tag: `<LProductListingGrid>`.

## Key Business & UX Benefits

- Responsive column logic keeps tiles aligned from phone to wide desktop, so the listing always feels intentional rather than reflowed.
- One grid powers category, search, and brand pages, removing the cost of running three near-identical listing templates.
- Pairs directly with filter and sort components, so the full listing chrome composes from a small set of well-defined building blocks.

## Feature List

::features
---
items:
  - "Responsive column logic scales from phone to wide desktop without per-page layout overrides"
  - "Built on ProductTileBasic so every grid stays consistent with cross-sell and slider placements"
  - "Drives category, search, and brand listing pages from one component, removing parallel templates"
  - "Pairs directly with FilterBar above and SortModes alongside to assemble the full listing chrome"
  - "Accepts the products array shape from any commerce backend, so onboarding catalogs needs no tile rewrite"
---
::

## API Reference

::component-meta{:name="ProductListingGrid"}
::
