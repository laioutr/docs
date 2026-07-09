---
title: Swatch Option
description: Single selectable swatch with selected, hover, and focus states.
playground:
  name: SwatchOption
  base: ui-kit-molecules-swatchoption
  defaultStory: single-color
  height: 460px
seo:
  title: Swatch Option
  description: Single selectable swatch with selected, hover, and focus states.
sitemap:
  loc: /laioutr-ui/ui-kit/general/swatch-option
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`SwatchOption` is the per-item wrapper around [`Swatch`](/laioutr-ui/ui-kit/general/swatch) that adds selected, hover, and focus states. It is the row primitive used directly by filter swatch lists.

For non-interactive listings use [`SwatchChip`](/laioutr-ui/ui-kit/general/swatch-chip) (single chip) or [`SwatchSummary`](/laioutr-ui/ui-kit/general/swatch-summary) (row with overflow).

## Key Business & UX Benefits

- Clear selected, hover, and focus states make multi-step filter flows predictable, which is critical on mobile where mis-taps are common.
- One row primitive across filter UIs and buybox swatches means the interaction model stays consistent wherever shoppers pick a color.
- Keyboard focus states keep filter forms usable for assistive-technology users, protecting accessibility compliance on listing pages.

## Feature List

::features
---
items:
  - "Wraps `Swatch` and adds `selected`, hover, and `:focus-visible` states so multi-step filter flows feel predictable on touch and keyboard"
  - "Automatic light/dark check-mark color via `getSwatchBrightnessClass`, so the tick stays visible on pale and saturated swatches alike"
  - "Auto-applied `__swatch--border` modifier when the swatch luminance crosses the 15 threshold (`doesSwatchNeedBorder`), keeping pale colors visible on white"
  - "`size` modifier ('s') tightens the row for compact filter drawers without changing markup"
  - "`@click` emit leaves selection state in the consumer, so the option works equally inside off-canvas filters and PDP swatch rows"
---
::

## API Reference

::component-meta{:name="SwatchOption"}
::
