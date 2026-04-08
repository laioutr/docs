---
title: Grid Fill
description: A grid fill component
links: []
seo:
  title: Grid Fill | Laioutr
  description: A grid fill component
sitemap:
  loc: /laioutr-ui/ui-kit/layout/gridfill
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Grid Fill component lays out items in a grid and lets one or more cells grow to fill remaining space. Sizing modes control whether the first or last item expands, so product grids and dashboards stay aligned.

## Key Business & UX Benefits

- Fills available space so grids look balanced on any viewport.
- Keeps one primary item (e.g. hero or featured) flexible while others stay fixed.
- Reduces custom CSS for common fill patterns.
- Works for product grids, dashboards, and card layouts.

:::tip
Pro-Tip from Larry: Use greedy-first or greedy-last so the hero or featured item gets the extra space.
:::

## Usage

::component-code
---
name: GridFill Fixed
story-height: 430px
story-id: ui-kit-gridfill--default
---
```vue-template
<GridFill />
```
::

::component-code
---
name: GridFill Greedy First
story-height: 430px
story-id: ui-kit-gridfill--greedy-first
---
```vue-template
<GridFill sizing="greedy-first" />
```
::

::component-code
---
name: GridFill Greedy Last
story-height: 430px
story-id: ui-kit-gridfill--greedy-last
---
```vue-template
<GridFill sizing="greedy-last" />
```
::

## Feature List

::features
---
items:
  - "Fixed grid with equal cell sizing"
  - "Greedy-first: first item expands to fill remaining space"
  - "Greedy-last: last item expands to fill remaining space"
  - "Configurable columns and gap for responsive layouts"
---
::

## API Reference

::component-meta{name="GridFill"}
::
