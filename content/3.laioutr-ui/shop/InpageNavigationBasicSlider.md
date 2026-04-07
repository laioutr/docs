---
title: Inpage Navigation Basic Slider
description: Space-efficient horizontal slider for displaying subcategory nodes with configurable rows and navigation positioning.
jiraIssueId: LUI-38
seo:
  title: Inpage Navigation Basic Slider | Laioutr
  description: Space-efficient horizontal slider for displaying subcategory nodes with configurable rows and navigation positioning.
---

## Overview

Commonly used under listing page titles for subcategory display. Uses LuiCommonSwiper, LuiSwiperNavigationCompact, and LuiSwipperScrollbar for slider functionality. CTA button automatically positions navigation to bottom. Multiple color modes support light, dark, and bright backgrounds with optional header and subline text.

## Key Business & UX Benefits

- Surfaces subcategories under listing titles so users can narrow or browse.
- One or two rows and optional CTA fit different space and emphasis.
- Auto-hiding navigation keeps the slider clean when all nodes fit.
- Promotional flags support sale and featured categories.

:::tip
Pro-Tip from Larry: Use Inpage Navigation Basic Slider under listing titles so subcategories are visible without scrolling.
:::

## Usage

::component-code
---
:name: InpageNavigationBasicSlider
story-id: organisms-inpagenavigationbasicslider--light-one-row-navigationtop-scrollbar
---
::

## Feature List

::features
---
items:
  - "One or two row slider options (two-row collapses to single on desktop)"
  - "Auto-hiding navigation when all nodes are visible on screen"
  - "Optional CTA button with variant selection"
  - "Support for promotional flags on category nodes"
---
::

## API Reference

::component-meta{name="InpageNavigationBasicSlider"}
::
