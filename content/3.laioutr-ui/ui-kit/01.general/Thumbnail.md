---
title: Thumbnail
description: A thumbnail component
links: []
seo:
  title: Thumbnail | Laioutr
  description: A thumbnail component
sitemap:
  loc: /laioutr-ui/ui-kit/general/thumbnail
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Thumbnail displays a small square image for use in product lists, galleries, and media grids. The aspect ratio is fixed at 1:1, and the rendered size is owned by the consumer via CSS (the component defaults to 52x52 on mobile and 96x96 from the `xl` breakpoint). It renders as a `<button>` and emits `click` and `hover`, so PDP galleries can swap the main image on tap and pre-fetch on hover.

## Key Business & UX Benefits

- Fixed 1:1 aspect keeps thumbnail grids visually aligned regardless of source-asset dimensions, so editorial collections stay tidy.
- Built-in `click` and `hover` events plug straight into PDP gallery patterns, so swap-on-tap and pre-fetch-on-hover are wire-ups, not rewrites.
- Sizing owned in CSS lets designers tune density per breakpoint without touching component props.

:::tip
Pro-Tip from Larry: Use thumbnails in product grids so customers scan many options quickly.
:::

## Usage

::component-code
---
:name: LThumbnail
story-height: 100px
story-id: ui-kit-atoms-thumbnail--default
--- 
::

## Feature List

::features
---
items:
  - "Renders as a `<button>` and emits `click` and `hover`, so PDP galleries can swap the main image on tap and pre-fetch on hover"
  - "Typed `media` prop drives a square `<LMedia>` at 100x100 with `sizes=\"100px\"`, so the right CDN variant ships per device"
  - "`selected` modifier (`thumbnail--selected`) applies the active-border token across default, hover, pressed, and focus-visible states"
  - "Border tokens (`--pdp-image-gallery-thumbnail-selected-*`) let themes match the brand without touching consumer code"
  - "Fixed 1:1 aspect ratio keeps thumbnail grids aligned regardless of source-asset dimensions"
  - "Sizing owned by the consumer via CSS, so density tunes per breakpoint without touching component props"
---
::

## API Reference

::component-meta{:name="Thumbnail"}
::
