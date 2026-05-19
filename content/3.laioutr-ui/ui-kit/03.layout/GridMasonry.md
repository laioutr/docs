---
title: Grid Masonry
description: A grid masonry component
links: []
seo:
  title: Grid Masonry | Laioutr
  description: A grid masonry component
sitemap:
  loc: /laioutr-ui/ui-kit/layout/gridmasonry
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Grid Masonry arranges items in a Pinterest-style layout: every column shares the same width, but items keep their natural height and flow into the shortest available column. Pass the data through the `items` prop and render each tile inside the default scoped slot, which exposes `item`, `column`, `row`, and `index`. Use it for image galleries, card walls, and editorial collections where item heights vary and you don't want big gaps under shorter content.

## Key Business & UX Benefits

- Editorial collections look intentional even when content arrives in mixed heights, so curated stories on the homepage stay visually polished.
- Removing big gaps under shorter content keeps shoppers scrolling, which lifts engagement with discovery sections and lookbooks.
- The same layout adapts from two columns on mobile to many on desktop, so merchandisers ship one block configuration for every breakpoint.

:::tip
Pro-Tip from Larry: Reach for [`GridFill`](/laioutr-ui/ui-kit/layout/gridfill) when every row should align horizontally. Use masonry only when staggered heights are the point.
:::

## Usage

::component-code
---
name: GridMasonry
story-height: 430px
story-id: ui-kit-atoms-gridmasonry--default
---
```vue-template
<GridMasonry :items="cards" :column-width="240" :gap="16">
  <template #default="{ item, column, row, index }">
    <Card :data="item" :data-row="row" :data-column="column" :data-index="index" />
  </template>
</GridMasonry>
```
::

## Feature List

::features
---
items:
  - "Typed generic `items: T[]` lets callers stay strongly typed; the default slot exposes `item`, `column`, `row`, and `index` for keyed rendering"
  - "`columnWidth` accepts a number or a `NonEmptyArray<number>` for per-breakpoint target widths"
  - "`minColumns` (default 1) and `maxColumns` bracket the layout so masonry stays sensible across mobile, tablet, and desktop"
  - "Numeric `gap` (default 0) controls horizontal and vertical spacing without an extra wrapper"
  - "Locale-aware `rtl` flag piped from `useLocale().dir`, so right-to-left markets get correct column ordering"
  - "`keyMapper` callback exposes column, row, and index for stable keys across reflows, useful for hydration-sensitive lists"
---
::

## API Reference

::component-meta{:name="GridMasonry"}
::
