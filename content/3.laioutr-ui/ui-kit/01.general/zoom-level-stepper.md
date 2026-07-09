---
title: Zoom Level (Stepper)
description: Stepper control for image zoom level on desktop, typically inside `Lightbox`.
playground:
  name: ZoomLevelStepper
  base: ui-kit-molecules-zoomlevelstepper
  defaultStory: default
  height: 460px
seo:
  title: Zoom Level (Stepper)
  description: Stepper control for image zoom level on desktop.
sitemap:
  loc: /laioutr-ui/ui-kit/general/zoom-level-stepper
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`ZoomLevelStepper` is the stepper control for fine-grained image zoom on desktop, used inside `Lightbox` for click-by-click zoom adjustment.

## Key Business & UX Benefits

- Click-by-click zoom on desktop helps shoppers inspect detail (weave, stitching, finish) the way they would in store, lifting buying confidence.
- Discrete steps make it predictable how far the next click will zoom, which avoids the overshoot frustration of free-form zoom controls.
- Shares the lightbox shell with the mobile segmented variant, so the experience stays cohesive when shoppers move between devices.

## Feature List

::features
---
items:
  - "Two variants ('white', 'black') match light and dark lightbox chrome with token-driven active states"
  - "`minLevel` and `maxLevel` props bound the stepper range, so callers control zoom resolution per image"
  - "Plus and minus buttons rendered as 'subtle' variant icon buttons, keeping the control unobtrusive over the image"
  - "Discrete step increments avoid the overshoot frustration of free-form zoom on trackpad and mouse"
  - "Shares the lightbox shell with the mobile segmented variant, so desktop and phone shoppers see a cohesive experience"
---
::

## API Reference

::component-meta{:name="ZoomLevelStepper"}
::
