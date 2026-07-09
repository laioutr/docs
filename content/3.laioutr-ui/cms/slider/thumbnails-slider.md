---
title: Thumbnails Slider
description: Thumbnail slider that pairs with a primary slider, used by `ProductImageGallery` and the `Lightbox`.
playground:
  name: ThumbnailsSlider
  base: ui-kit-molecules-thumbnailsslider
  defaultStory: default
  height: 460px
seo:
  title: Thumbnails Slider
  description: Thumbnail slider that pairs with a primary slider.
sitemap:
  loc: /laioutr-ui/cms/slider/thumbnails-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`ThumbnailsSlider` is the small-thumbnail strip that pairs with a primary slider. It accepts a flat `thumbnails` array, a required `orientation` (`horizontal` or `vertical`), and an optional `selectedIndex` controlled by the parent. When a thumbnail is clicked or hovered the component emits `select` with the new index, leaving the parent to update `selectedIndex` and drive the primary slider. Pass `centered` to align the active thumbnail in the middle of the strip.

It's used by `ProductImageGallery` for product-image navigation and inside `MediaGallery` for cross-image navigation.

## Key Business & UX Benefits

- Thumbnails on PDP help shoppers preview every angle before deciding, raising buyer confidence and lowering return rates.
- The `centered` option keeps the active thumbnail in view as customers browse, removing the disorientation of off-screen position.
- One thumbnail strip powers both product galleries and lightboxes, so the navigation feel is identical across surfaces.
- Editors swap product imagery in Studio and the thumbnail strip updates automatically, with no per-product styling work.

## Feature List

::features
---
items:
  - "Flat thumbnails array drives the strip; required orientation prop picks horizontal or vertical layout"
  - "Parent controls the active thumbnail via selectedIndex; the component emits select with the clicked index"
  - "centered option keeps the active thumbnail in view as customers browse"
  - "Used by ProductImageGallery for PDP image navigation and inside MediaGallery for cross-image navigation"
  - "Editors swap product imagery in Studio and the thumbnail strip updates automatically with no per-product styling"
---
::

## API Reference

::component-meta{:name="ThumbnailsSlider"}
::
