---
title: Color Swatch
description: Color swatch components for displaying product color variants on product tiles, supporting single or multi-color swatches with interactive states.
jiraIssueId: LUI-51
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11078-216549
    target: _blank
---

## Features

- Our Color Swatch can be used for single and multiple colors.

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

## Features

::features
---
items:
  - "Displays up to two colors per swatch using linear-gradient"
  - "Shows color name tooltip on hover"
  - "Active state indicator for selected variant"
  - "Overflow handling with '+n' indicator for more than 4 variants"
---
::

## API Reference

::component-meta{:name="ColorSwatch"}
::
