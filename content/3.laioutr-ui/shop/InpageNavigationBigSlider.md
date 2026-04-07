---
title: Inpage Navigation Big Slider
description: High-impact horizontal slider for large category nodes with independent color modes and configurable navigation.
jiraIssueId: LUI-47
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=10862-246843&t=Ar5LTHJDEX3yaImj-4
    target: _blank
seo:
  title: Inpage Navigation Big Slider | Laioutr
  description: High-impact horizontal slider for large category nodes with independent color modes and configurable navigation.
---

## Overview

Ideal for hero sections and prominent homepage placements. Does not propagate colorMode to child nodes - each CategoryNodeBig determines its own color mode based on image contrast. Supports promotional badges and optional CTA buttons with selectable variants. Uses LuiCommonSwiper for smooth navigation with optional scrollbar display.

## Key Business & UX Benefits

- Hero-style category slider for home and entry pages so categories stand out.
- Square, landscape, and portrait formats fit different imagery.
- Independent color mode per node keeps contrast readable on each image.
- Auto-hiding navigation and optional scrollbar keep the slider clean.

:::tip
Pro-Tip from Larry: Use Inpage Navigation Big Slider for hero category sliders so categories are prominent.
:::

## Usage

::component-code
---
:name: LuiInpageNavigationBigSlider
story-id: organisms-inpagenavigationbigslider--square-light-node-on-light
---
::

## Feature List

::features
---
items:
  - "Multiple node formats: square, landscape, and portrait"
  - "Navigation position options: top or bottom"
  - "Auto-hiding navigation when all nodes fit on screen"
  - "Independent color mode per node based on image contrast"
---
::

## API Reference

::component-meta{:name="InpageNavigationBigSlider"}
::
