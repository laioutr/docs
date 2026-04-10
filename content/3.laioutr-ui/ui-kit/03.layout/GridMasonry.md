---
title: Grid Masonry
description: A grid masonry component
links: []
seo:
  title: Grid Masonry | Laioutr
  description: A grid masonry component
sitemap:
  loc: /laioutr-ui/ui-kit/layout/gridmasonry
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Grid Masonry component arranges items in a masonry layout so columns have equal width but variable height. Content of different heights flows without large gaps, which suits image galleries and cards.

## Key Business & UX Benefits

- Uses vertical space well so short and tall items sit together without gaps.
- Suits image galleries, pins, and card layouts with mixed heights.
- Keeps column widths consistent for a clean, predictable grid.
- Reduces manual layout code for masonry-style UIs.

:::tip
Pro-Tip from Larry: Use it for image galleries or cards so content flows without big empty spaces.
:::

## Usage

::component-code
---
name: GridMasonry
story-height: 430px
story-id: ui-kit-gridmasonry--default
---
```vue-template
<GridMasonry>
  <div>Item 1</div>
  <div>Item 2</div>
  [...]
</GridMasonry>
```
::

## Feature List

::features
---
items:
  - "Masonry layout with equal-width columns"
  - "Variable-height items without large gaps"
  - "Configurable column count for responsive breakpoints"
  - "Suitable for image galleries, pins, and card grids"
---
::

## API Reference

::component-meta{:name="GridMasonry"}
::
