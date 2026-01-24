---
title: Inpage Navigation Big Slider
description: High-impact horizontal slider for large category nodes with independent color modes and configurable navigation.
jiraIssueId: LUI-47
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=10862-246843&t=Ar5LTHJDEX3yaImj-4
    target: _blank
---

## Overview

Ideal for hero sections and prominent homepage placements. Does not propagate colorMode to child nodes - each CategoryNodeBig determines its own color mode based on image contrast. Supports promotional badges and optional CTA buttons with selectable variants. Uses LuiCommonSwiper for smooth navigation with optional scrollbar display.

## Usage

::component-code
---
:name: LuiInpageNavigationBigSlider
story-id: organisms-inpagenavigationbigslider--square-light-node-on-light
---
::

## Features

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
