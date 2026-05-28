---
title: Category Card Grid
description: Responsive grid of category tiles for entry pages and category browsing.
playground:
  name: CategoryCardGrid
  base: ui-sections-categorycardgrid
  defaultStory: basic
  height: 460px
jiraIssueId: LUI-37
seo:
  title: Category Card Grid | Laioutr
  description: Responsive grid of category tiles for entry pages and category browsing.
sitemap:
  loc: /laioutr-ui/shop/category-card-grid
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/shop/inpagenavigationbasicgrid
  - /laioutr-ui/shop/inpagenavigationbiggrid
  - /laioutr-ui/shop/inpagenavigationcompactgrid
---

## Overview

`CategoryCardGrid` renders a responsive grid of [`LinkTile`](/laioutr-ui/ui-kit/content/link-tile)s for category navigation on home and landing pages. The `variant` prop picks the per-tile layout:

| `variant`            | When to use                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `'basic'`            | Standard category tile for general grids.                                         |
| `'compact'`          | Dense layouts where many categories share the page.                               |
| `'compact-bordered'` | Compact tile with a border for stronger visual separation on busy backgrounds.    |
| `'big'`              | Hero placements where imagery carries the page.                                   |

Drive the tiles from the `nodes` prop, or place `CategoryCard` children in the default slot (the slot wins when both are present). The block can also render an optional heading, caption, and subline through its text-group props.

Auto-import tag: `<LCategoryCardGrid>`.

## Key Business & UX Benefits

- Strong category browsing entry points raise click-through to listing pages, the first conversion step for shoppers who arrive without a specific product in mind.
- Four variants from compact to hero scale gracefully from dense subcategory pages to brand-led landing pages, all from one component.
- A heading, subline, and caption sit above the grid so editors can frame a section without a separate block.
- Default slot accepts custom `CategoryCard` children when a tile needs more than the `nodes` shape offers.

:::tip
Pro-Tip from Larry: Use `variant="big"` on hero placements where imagery does the work; reach for `compact` inside dense category lists.
:::

## Feature List

::features
---
items:
  - "Four variants ('basic', 'compact', 'compact-bordered', 'big') for everything from dense subcategory grids to hero landing pages"
  - "nodes prop drives the tiles, or pass CategoryCard children in the default slot when a tile needs more than the node shape"
  - "Heading, subline, and caption render above the grid for editor-driven section framing"
  - "Built on LinkTile so each category card carries its own accessible link target and focus state"
  - "Responsive column logic keeps tiles aligned across breakpoints, so the grid feels intentional from phone to desktop"
  - "Aliases preserve legacy URL paths (inpagenavigationbasicgrid, biggrid, compactgrid) so existing campaigns keep working"
---
::

## API Reference

::component-meta{:name="CategoryCardGrid"}
::
