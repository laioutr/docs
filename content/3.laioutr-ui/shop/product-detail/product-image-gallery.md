---
title: Product Image Gallery
description: Product detail image gallery with main stage, thumbnail strip, and fullscreen lightbox.
playground:
  name: ProductImageGallery
  base: ui-sections-productimagegallery
  defaultStory: default
  height: 460px
seo:
  title: Product Image Gallery
  description: Product detail image gallery with main stage, thumbnails, and fullscreen lightbox.
sitemap:
  loc: /laioutr-ui/shop/product-detail/product-image-gallery
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=134-218700&t=wABQtnJ0GubOC0US-4
    target: _blank
---

## Overview

`ProductImageGallery` is the PDP gallery. It pairs a main image stage with a `ThumbnailsSlider` for quick navigation between media, and opens the cross-image `Lightbox` for fullscreen viewing.

Auto-import tag: `<LProductImageGallery>`.

## Key Business & UX Benefits

- Rich media exploration with thumbnail strip and fullscreen lightbox raises shopper engagement on the PDP, the single strongest predictor of add-to-cart.
- Cross-image lightbox lets shoppers compare details (texture, fit, color shifts) without leaving the page, which lowers returns from wrong-look purchases.
- The `images` prop accepts any commerce backend's `Media[]` shape, so onboarding new catalogs needs no UI rework.

## Feature List

::features
---
items:
  - "Main image stage paired with a ThumbnailsSlider so shoppers jump between media without scrolling"
  - "Cross-image Lightbox opens to fullscreen for close-up inspection of texture, fit, or color"
  - "Accepts an images Media[] prop so any commerce backend's media shape plugs straight in"
  - "Drops into the ProductDetail gallery slot or any custom PDP layout from the same component"
  - "Handles mixed media (images and videos) in one collection without per-type wiring"
---
::

## API Reference

::component-meta{:name="ProductImageGallery"}
::
