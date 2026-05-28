---
title: Tooltip
description: Reka-UI-backed tooltip primitive with a configurable arrow width and side offset.
playground:
  name: Tooltip
  base: ui-kit-molecules-tooltip
  defaultStory: default
  height: 460px
seo:
  title: Tooltip | Laioutr
  description: Reka-UI-backed tooltip primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/general/tooltip
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`Tooltip` is the reka-ui-backed primitive for short hover (or focus) hints. Arrow width and side offset are configurable; there is no tooltip-content-width prop, the content sizes to its label. The underlying reka-ui implementation handles keyboard, focus, and aria semantics out of the box.

## Key Business & UX Benefits

- Reka-ui handles keyboard, focus, and aria semantics, so adding helpful hints does not introduce accessibility regressions.
- Surfacing icon-button labels on hover and focus keeps the dense chrome (mini-cart, filters, account utility row) discoverable for new users.
- Configurable arrow width, side offset, and delay duration let designers tune the tooltip per surface without forking the primitive.

## Feature List

::features
---
items:
  - "Required `label` string keeps content text-only, so the tooltip stays announceable to screen readers"
  - "Tunable `sideOffset` (default 5), arrow `width` (default 8), and `delayDuration` (default 100ms) cover dense chrome and roomy hero placements"
  - "Auto-placed arrow on top, right, bottom, or left via reka-ui `[data-side]` selectors, so a single primitive handles every edge case"
  - "Built on reka-ui's `TooltipProvider`/`TooltipContent`, ships keyboard, focus, and aria semantics with no per-use wiring"
  - "Hoverable content disabled (`disable-hoverable-content`), so the tip dismisses when the trigger loses hover, matching native chrome"
---
::

## API Reference

::component-meta{:name="Tooltip"}
::
