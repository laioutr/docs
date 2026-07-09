---
title: Filter Bar
description: Inline filter strip for product listing pages with current filters, sort, count, and an open-all-filters trigger.
playground:
  name: FilterBar
  base: ui-blocks-filterbar
  defaultStory: default
  height: 460px
seo:
  title: Filter Bar
  description: Inline filter strip for product listing pages.
sitemap:
  loc: /laioutr-ui/shop/filter-bar
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/shop/filters
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=82-217205&m=dev
    target: _blank
---

## Overview

`FilterBar` is the inline filter chrome that sits above (or below) a `ProductListingGrid`. It surfaces the current filters as removable chips, the result count, the sort selector, and a button that opens the full [`FilterOffCanvas`](/laioutr-ui/shop/filter-off-canvas) sheet. Set `sticky` so the bar stays in reach while shoppers scroll long lists.

Pair `FilterBar` with `FilterOffCanvas` so casual filtering happens inline (chip removal, sort change) while deep filtering happens inside the sheet.

Auto-import tag: `<LFilterBar>`.

## Key Business & UX Benefits

- Active-filter chips with one-click remove keep the current search context visible, helping shoppers refine results instead of starting over.
- Sticky mode keeps sort and filter controls reachable on long listing pages, which is where shoppers typically narrow results before clicking into a PDP.
- Inline result count gives instant feedback on every filter change so shoppers know whether they're zeroing in or filtering too tightly.
- Pairs cleanly with the off-canvas sheet so casual chip-removal stays inline and deep filtering moves to a focused surface.

:::tip
Pro-Tip from Larry: Pair `FilterBar` (inline summary) with `FilterOffCanvas` (the off-canvas sheet) so casual filtering happens inline and deep filtering happens in the sheet.
:::

## Feature List

::features
---
items:
  - "Active-filter chips with one-click remove so shoppers refine the search without retyping or backing out"
  - "Inline result count updates with every filter change, giving instant feedback before shoppers commit to a click"
  - "Sticky mode keeps sort and filter controls within reach on long listing pages where most refinement happens"
  - "Open-all-filters trigger hands off to FilterOffCanvas for deep faceting, so the bar stays uncluttered"
  - "Sort selector integrated alongside the chips so sort and filter share one chrome rather than two separate strips"
---
::

## API Reference

::component-meta{:name="FilterBar"}
::
