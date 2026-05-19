---
title: Media Gallery
description: Fullscreen lightbox dialog for multi-image viewing with zoom, navigation, and a thumbnail strip.
seo:
  title: Media Gallery | Laioutr
  description: Fullscreen lightbox dialog for multi-image viewing.
sitemap:
  loc: /laioutr-ui/cms/media-gallery
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/blog/lightboxgallery
---

## Overview

`MediaGallery` is a fullscreen lightbox dialog for multi-image viewing. The component is itself the dialog: open it with `v-model:open`, pass the image array via `medias`, and a required `title` for the dialog heading. Inside the dialog, a Swiper-driven image stage handles slide navigation, optional zoom (controlled via `zoomLevel`), and a `ThumbnailsSlider` strip for jumping between images.

Use it from a parent component (article view, brand page, product gallery) that opens the lightbox in response to a click on a representative image.

## Key Business & UX Benefits

- A dedicated fullscreen dialog lets shoppers and readers inspect imagery in detail without leaving the article or product page.
- Optional zoom plus pan reveals fine detail on textiles, materials, and editorial photography, raising buyer confidence.
- The thumbnail strip inside the dialog keeps orientation across long image sets, so readers do not lose their place mid-browse.
- Editors maintain the image array in Studio, so creative teams refresh galleries on launch day without code changes.

## Usage

::component-code
---
:name: LMediaGallery
:story-height: 400px
story-id: ui-features-mediagallery--default
title: MediaGallery Default
---
```vue-template
<MediaGallery
    v-model:open="open"
    title="Spring lookbook"
    :medias="postImages"
  />
```
::

## Feature List

::features
---
items:
  - "The component is itself the fullscreen lightbox dialog; open it with v-model:open"
  - "medias prop drives a Swiper image stage with slide navigation and optional zoom (via zoomLevel)"
  - "ThumbnailsSlider strip inside the dialog jumps between images and tracks the active slide"
  - "Required title prop sets the dialog heading; optional brand prop adds a secondary label"
  - "Closes via Escape or overlay click by default (toggle via closeOnEsc and closeOnOverlayClick)"
  - "Editors maintain the image array in Studio so creative teams refresh galleries on launch day"
---
::

## API Reference

::component-meta{:name="MediaGallery"}
::
