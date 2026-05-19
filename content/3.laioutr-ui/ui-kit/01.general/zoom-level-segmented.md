---
title: Zoom Level (Segmented)
description: Segmented control for image zoom level on mobile, typically inside `Lightbox`.
seo:
  title: Zoom Level (Segmented) | Laioutr
  description: Segmented control for image zoom level on mobile.
sitemap:
  loc: /laioutr-ui/ui-kit/general/zoom-level-segmented
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`ZoomLevelSegmented` is the segmented control for picking an image zoom level on mobile, used inside `Lightbox` for tap-to-zoom selection.

## Key Business & UX Benefits

- Tap-targets sized for mobile let shoppers inspect product detail with a single thumb, the way customers actually shop on phones.
- Discrete zoom levels are easier to use than free-form pinch on small screens, especially for older devices and assistive-touch users.
- Pairs with the lightbox primitive so PDPs get the same inspection experience across the entire catalog without per-product wiring.

## Usage

::component-code
---
:name: LZoomLevelSegmented
:story-height: 200px
story-id: ui-kit-molecules-zoomlevelsegmented--default
title: ZoomLevelSegmented Default
---
```vue-template
<ZoomLevelSegmented
    v-model:current-zoom-level="zoomLevel"
    :levels="3"
    variant="white"
  />
```
::

## Feature List

::features
---
items:
  - "Two variants ('white', 'black') match light and dark lightbox chrome with token-driven active and pressed states"
  - "`levels` prop sets the discrete count, rendering each as a tap target labeled `{level}x`"
  - "`aria-pressed` per segment exposes which level is active to screen readers"
  - "Built-in `:focus-visible` ring on every segment, so keyboard users see selection clearly inside the lightbox"
  - "Designed for one-thumb operation inside `Lightbox`, providing predictable zoom on phones where pinch is unreliable"
---
::


## API Reference

::component-meta{:name="ZoomLevelSegmented"}
::
