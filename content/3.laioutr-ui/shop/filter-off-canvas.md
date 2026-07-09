---
title: Filter Off Canvas
description: Off-canvas filter sheet for product listing pages with accordion-grouped checkbox lists, swatch lists, range sliders, and switches.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=15055-191628&t=JdNx9y5r0PDJX6eC-4
    target: _blank
playground:
  name: FilterOffCanvas
  base: ui-features-filteroffcanvas
  defaultStory: default-filter-off-canvas
  height: 460px
seo:
  title: Filter Off Canvas
  description: Off-canvas filter sheet for product listing pages.
sitemap:
  loc: /laioutr-ui/shop/filter-off-canvas
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`FilterOffCanvas` is the full filter sheet that opens from [`FilterBar`](/laioutr-ui/shop/filter-bar). It composes a stack of `FilterOffCanvasAccordionItem`s, each rendering one typed inner control based on the shape of the filter you pass in:

| Inner control                       | Filter type                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `FilterOffCanvasSwitchItem`         | Boolean filters (rendered at the accordion level, not inside an accordion item).  |
| `FilterOffCanvasCheckboxList`       | List filters with `presentation: 'text'` (rendered with `*ListItem` rows).        |
| `FilterOffCanvasSwatchList`         | List filters with `presentation: 'swatch'`; binds `SwatchOption` directly.        |
| `FilterOffCanvasRangeSlider`        | Numeric range filters with optional `step` and `formatLabel`.                     |

Define your filter shape once via the `AvailableFilter` union and `FilterOffCanvas` mounts the right inner control per filter type.

The sheet's primary CTA reads "Show N products" from the `filteredCount` prop, so the count of matching products needs to be passed in alongside the filter definitions. A secondary "Delete all" button resets every selection to its empty value in one click.

Auto-import tag: `<LFilterOffCanvas>`.

## Key Business & UX Benefits

- Typed inner controls (checkbox lists, swatches, range sliders, switches) match each filter to the right input pattern, which raises filter-use rate and shortens time-to-product.
- Accordion grouping keeps long filter lists scannable, so shoppers can find size or color without scrolling past every facet.
- Single `AvailableFilter` shape drives the whole sheet, so adding a new facet in your data model needs no extra UI code.
- Off-canvas presentation reclaims the listing grid behind it, letting shoppers see filter results in context rather than on a separate page.

:::tip
Pro-Tip from Larry: Define your filter shape once via the `AvailableFilter` union; `FilterOffCanvas` picks the right inner control automatically per filter type.
:::

## Feature List

::features
---
items:
  - "Single AvailableFilter union picks the right inner control per filter (checkbox list, swatch list, range slider, or switch)"
  - "List filters honour a 'presentation' value of 'text' or 'swatch' to switch between rows and SwatchOption tiles"
  - "Range sliders accept optional step and formatLabel props so price, weight, and size facets render with the right unit"
  - "Primary CTA reads 'Show N products' from the filteredCount prop so shoppers see impact before applying the filter set"
  - "Secondary 'Delete all' button resets every selection to its empty value in one click"
  - "Accordion grouping keeps long facet lists scannable while keeping every filter one tap away"
  - "Composable from named inner primitives (AccordionItem, CheckboxList, SwatchList, RangeSlider, SwitchItem) for custom sheets"
---
::

### LFilterOffCanvas

::component-meta{:name="FilterOffCanvas"}
::

### LFilterOffCanvasAccordionItem

::component-meta{:name="FilterOffCanvasAccordionItem"}
::

### LFilterOffCanvasCheckboxList

::component-meta{:name="FilterOffCanvasCheckboxList"}
::

### LFilterOffCanvasCheckboxListItem

::component-meta{:name="FilterOffCanvasCheckboxListItem"}
::

### LFilterOffCanvasSwatchList

::component-meta{:name="FilterOffCanvasSwatchList"}
::

### LFilterOffCanvasRangeSlider

::component-meta{:name="FilterOffCanvasRangeSlider"}
::

### LFilterOffCanvasSwitchItem

::component-meta{:name="FilterOffCanvasSwitchItem"}
::
