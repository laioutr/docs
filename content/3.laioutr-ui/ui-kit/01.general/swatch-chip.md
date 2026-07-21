---
title: Swatch Chip
aliases:
  - /laioutr-ui/ui-kit/general/colorswatch
description: Compact color chip for displaying product color variants on tiles, with multi-color gradients and overflow handling.
playground:
  name: SwatchChip
  base: ui-kit-atoms-swatchchip
  defaultStory: single-color
  height: 460px
seo:
  title: Swatch Chip
  description: Compact color chip for displaying product color variants on tiles.
sitemap:
  loc: /laioutr-ui/ui-kit/general/swatch-chip
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1
  videos: []
  images: []
jiraIssueId: LUI-51
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11078-216549
    target: _blank
---

## Overview

Swatch Chip is the single color chip used inside listings: one HTML element backed by a CSS background, rendering one color, two colors side by side, a multi-stop gradient, or a pattern image. The chip exposes the full color name through the native `title` attribute, which most browsers surface as a hover tooltip.

It builds on the [`Swatch`](/laioutr-ui/ui-kit/general/swatch) primitive and adds the chip chrome (background, radius, tone-aware outline). For the row of chips with a `+n` overflow indicator, use [`SwatchSummary`](/laioutr-ui/ui-kit/general/swatch-summary), which composes `SwatchChip` for each visible item and adds the truncation logic. For the interactive form-input variant with selected, hover, and focus states, see [`SwatchOption`](/laioutr-ui/ui-kit/general/swatch-option).

## Key Business & UX Benefits

- Showing color options directly on listing tiles lifts click-through to PDPs, especially for fashion and home categories where color drives purchase.
- Single-element CSS backing keeps render cost low on large category pages with hundreds of chips, protecting scroll smoothness on mobile.
- Native `title` attribute discloses the full color name on hover, setting accurate expectations before the click without bespoke tooltip plumbing.

::tip
Pro-Tip from Larry: Reach for `SwatchSummary` when you need a row of chips with overflow handling; `SwatchChip` is the single-chip primitive.
::

### Multiple Colors

::component-code
---
:name: LSwatchChip
:story-height: 50px
story-id: ui-kit-atoms-swatchchip--multiple-colors
title: Multiple Colors
---
```vue-template
<LSwatchChip />
```
::

## Feature List

::features
---
items:
  - Single typed `colors` tuple covers 'color' (single value), 'colors' (two
    side by side), 'gradient' (multi-stop), and 'image' (pattern fill)
  - Backed by a single CSS background, so a row of chips stays cheap to render
    on category pages with hundreds of tiles
  - Tone-aware modifiers (`swatch-chip--dark`, `swatch-chip--bright`) keep
    outlines visible on light, dark, and brand chrome
  - Localized `title` text per fill type (`swatchChip.tooltipSingle`,
    `tooltipMultiple`, `tooltipGradient`, `tooltipImage`) sets accurate color
    expectations through the native browser tooltip
  - "`selected` modifier (`swatch-chip--selected`) lights up the active variant
    on PDP swatch rows"
  - Tokenized outline and active opacity (`--swatch-outline-color`,
    `--swatch-active-opacity`) let themes match brand chrome
  - Pair with [`SwatchSummary`](/laioutr-ui/ui-kit/general/swatch-summary) for
    the row-with-overflow pattern used on product tiles
---
::

## API Reference

::component-meta{:name="SwatchChip"}
::
