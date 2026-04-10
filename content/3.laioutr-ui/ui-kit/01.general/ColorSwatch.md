---
title: Color Swatch
description: Color swatch components for displaying product color variants on tiles.
jiraIssueId: LUI-51
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11078-216549
    target: _blank
seo:
  title: Color Swatch | Laioutr
  description: Color swatch components for displaying product color variants on tiles.
sitemap:
  loc: /laioutr-ui/ui-kit/general/colorswatch
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The ColorSwatch component provides compact visual representation of product color options, enabling customers to browse variants without leaving product listings. Implemented as a single HTML element for optimal performance, it uses CSS linear-gradients to display multi-color swatches. Maximum of 4 visible swatches prevents visual clutter while the '+n' overflow indicator communicates additional options. Interactive states including hover tooltips improve color name discoverability.

## Key Business & UX Benefits

- Speeds up variant discovery so customers find the right color quickly.
- Keeps product lists clean with compact, recognizable swatches.
- Improves accessibility with tooltips and clear selection states.
- Reduces layout shift and load with lightweight CSS-based rendering.

:::tip
Pro-Tip from Larry: Use the hover tooltip so customers see the exact color name before clicking.
:::

## Usage

### Single Color

::component-code
---
:name: LuiColorSwatch
:story-height: 50px
story-id: ui-kit-colorswatch--single-color
title: Color Swatch Single Color
---
```vue-template
<LuiColorSwatch />
```
::

### Multiple Colors

::component-code
---
:name: LuiColorSwatch
:story-height: 50px
story-id: ui-kit-colorswatch--multiple-colors
title: Color Swatch Multiple Colors
---
```vue-template
<LuiColorSwatch />
```
::

## Feature List

::features
---
items:
  - "Displays up to two colors per swatch using linear-gradient"
  - "Shows color name tooltip on hover"
  - "Overflow handling with '+n' indicator for 5+ variants"
  - "Accessible with proper ARIA labels"
---
::

## API Reference

::component-meta{:name="ColorSwatch"}
::
