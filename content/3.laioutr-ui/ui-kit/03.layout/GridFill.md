---
title: Grid Fill
description: A grid fill component
playground:
  name: GridFill
  base: ui-kit-atoms-gridfill
  defaultStory: default
  height: 460px
links: []
changelogKeys:
  - GridFill
seo:
  title: Grid Fill
  description: A grid fill component
sitemap:
  loc: /laioutr-ui/ui-kit/layout/gridfill
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Grid Fill lays out items in a flex row and lets one cell grow to absorb the remaining space. Set the `--cols` CSS custom property (per breakpoint if needed) so the component knows how many columns to size against; `--gap` (or the explicit `--gap-x` and `--gap-y`) controls spacing. Pick the sizing mode by which item should claim the slack:

| `sizing`         | When to use                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| `'fixed'`        | Default. Every cell gets the same width based on `--cols`.                           |
| `'greedy-first'` | First-row items expand via flex-grow with `order` reversal. Hard cap of 20 items.    |
| `'greedy-last'`  | Last item expands. Useful when the trailing tile is a "view all" or summary.         |

`greedy-first` is the special case: it flips flex order so the first row of items expands instead of the last, but the CSS hard-caps at 20 items. Beyond that, extra items fall outside the order chain and the visual layout breaks.

### Item alignment

`justify` (main axis) and `align` (cross axis) position items within the grid; both take `'start' | 'center' | 'end'` and default to `'start'`. State them logically — under `sizing="greedy-first"` the component reverses its axis internally to pack growing items into the first row and un-mirrors the alignment, so `start` / `end` still resolve to the physical direction you asked for (`center` stays symmetric). `Container` maps its 2D `alignment` prop onto these two props, which is what keeps Container's alignment from mirroring under "Greedy First".

## Key Business & UX Benefits

- Greedy sizing lets the hero or "view all" tile take visual priority without bespoke CSS for every grid variant.
- Three sizing modes cover the common merchandising patterns: even grid, feature-led, and summary-led, without flexbox math at the call site.
- One layout primitive replaces dozens of hand-rolled grids, so brand refreshes update spacing once instead of touching each section.

:::tip
Pro-Tip from Larry: Use `greedy-first` or `greedy-last` so the hero or featured item gets the extra space, instead of distributing whitespace evenly across cells.
:::

## Usage

::component-code
---
name: GridFill Greedy First
story-height: 430px
story-id: ui-kit-atoms-gridfill--greedy-first
---
```vue-template
<GridFill sizing="greedy-first" />
```
::

::component-code
---
name: GridFill Greedy Last
story-height: 430px
story-id: ui-kit-atoms-gridfill--greedy-last
---
```vue-template
<GridFill sizing="greedy-last" />
```
::

## Feature List

::features
---
items:
  - "Three sizing modes ('fixed', 'greedy-first', 'greedy-last') cover even grids, hero-led grids, and trailing summary tiles from one component"
  - "Requires a `--cols` CSS custom property (per-breakpoint via utility classes) to drive the flex-basis math"
  - "`gapX` and `gapY` numeric props bind to `--gap-x` and `--gap-y` CSS custom properties so consumers can also override with utility classes per breakpoint"
  - "`--cols` and `--gap` custom-property layering lets templates set defaults on a parent and override per breakpoint without prop drilling"
  - "Greedy modes use `flex-grow` to pull slack into the first or last cell; `greedy-first` flips `order` with a hard cap of 20 items"
  - "Single layout primitive replaces hand-rolled grids, so brand refreshes update spacing in one place"
---
::

## API Reference

::component-meta{name="GridFill"}
::
