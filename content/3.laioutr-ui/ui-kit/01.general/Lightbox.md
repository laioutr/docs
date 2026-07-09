---
title: Lightbox
description: Modal media viewer with zoom, pan, and cross-image navigation.
playground:
  name: Lightbox
  base: ui-kit-organisms-lightbox
  defaultStory: default
  height: 460px
seo:
  title: Lightbox
  description: Modal media viewer with zoom, pan, and cross-image navigation.
sitemap:
  loc: /laioutr-ui/ui-kit/general/lightbox
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`Lightbox` is the modal media viewer used by `MediaPreview`, `MediaGallery`, and `ProductImageGallery`. Zoom and keyboard navigation come from Swiper's Zoom module (max ratio 3); cross-image swiping uses Swiper's loop mode with the lightbox store as the registration point so any image opted in on the page is reachable from any other. Focus management comes from reka-ui Dialog semantics.

Most pages drive the lightbox indirectly through `MediaPreview` or `MediaGallery` rather than mounting it themselves.

## Key Business & UX Benefits

- Zoom and pan let shoppers inspect fabric, fit, and detail at the same level they would in-store, reducing return rates on high-detail products.
- Cross-image navigation keeps customers exploring the gallery instead of bouncing back to the listing after viewing one shot.
- Focus management from reka-ui Dialog semantics protects accessibility compliance on every product page that uses the gallery.

## Feature List

::features
---
items:
  - "Zoom and pan powered by Swiper's Zoom module with a max ratio of 3, matching in-store inspection of fabric and detail"
  - "Cross-image swiping uses Swiper loop mode against a shared lightbox store, so any opted-in image on the page is reachable from any other"
  - "Focus management via reka-ui Dialog semantics ships keyboard and screen-reader behavior with no per-page wiring"
  - "Driven indirectly by `MediaPreview`, `MediaGallery`, and `ProductImageGallery` so consumers rarely mount it themselves"
  - "Keyboard navigation from Swiper covers arrow-key paging, escape to close, and zoom controls"
---
::

## API Reference

::component-meta{:name="Lightbox"}
::
