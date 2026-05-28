---
title: Media
description: Low-level responsive image primitive backed by `nuxt-image`.
playground:
  name: Media
  base: ui-kit-atoms-media
  defaultStory: default
  height: 460px
seo:
  title: Media | Laioutr
  description: Low-level responsive image primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/general/media
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`Media` is the low-level responsive image primitive. It takes a [`Media`](/frontend/api-reference/common-types/media) value and uses `nuxt-image` to pick the right variant for the current viewport, handling `<picture>` source selection, custom `aspectRatio` (boolean, string, or number), and breakpoint-aware `sizes` strings. The bonus `cmw` (content-max-width) unit makes `sizes` strings inside constrained containers easier to write.

Reach for [`MediaPreview`](/laioutr-ui/ui-kit/general/media-preview) when you also want lightbox interaction, surface-tone awareness, and cross-image navigation. Use `Media` directly only when you do not want the lightbox shell.

## Key Business & UX Benefits

- Backed by nuxt-image, so every storefront image ships in the right format and size for the device, cutting bandwidth costs and load times.
- A single discriminated `Media` value covers images, video posters, and CDN variants, so connector code stays simple as new sources are added.
- The `cmw` unit makes `sizes` strings inside constrained containers easy to write, so the layout engine picks the smallest correct asset.

## Feature List

::features
---
items:
  - "Backed by nuxt-image, so every storefront asset ships in the right format and size for the current device"
  - "Single typed `Media` value (discriminated union) covers images, video posters, and CDN variants from connectors"
  - "`aspectRatio` accepts boolean, string, or number, so callers pick between intrinsic, square, and named ratios from the same prop"
  - "Breakpoint-aware `sizes` strings hint the browser to pick the smallest correct variant, cutting bandwidth on mobile"
  - "Custom `cmw` (content-max-width) unit in `sizes` strings is honored inside constrained containers"
  - "Handles `<picture>` source selection so AVIF, WebP, and JPEG fallbacks are emitted correctly"
---
::

## API Reference

::component-meta{:name="Media"}
::
