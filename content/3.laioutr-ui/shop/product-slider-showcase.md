---
title: Product Slider Showcase
description: Premium product slider paired with a banner.
playground:
  name: ProductSliderShowcase
  base: ui-sections-productslidershowcase
  defaultStory: default
  height: 460px
seo:
  title: Product Slider Showcase | Laioutr
  description: Premium product slider paired with a banner.
sitemap:
  loc: /laioutr-ui/shop/product-slider-showcase
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=12175-374053&t=kWl7opPn708GdN7H-4
    target: _blank
---

## Overview

`ProductSliderShowcase` is the premium tier of [`ProductSlider`](/laioutr-ui/shop/product-slider). It pairs the same horizontally scrollable product collection with a `BannerBasic` panel anchored on the side. Reach for it on campaign placements where the slider needs to carry brand imagery, not just product tiles.

The component accepts a `banner: BannerBasicProps` object that drives the side panel, a `products: ProductTileBasicProps[]` array for the tiles, and an optional `background` of `'light' | 'dark'` to set the surface tone explicitly when the surrounding context cannot resolve it. Per-tile chrome (swatch position, title length, element toggles) lives on [`ProductTileBasic`](/laioutr-ui/shop/product-tile-basic), so configure those there rather than on the slider.

Auto-import tag: `<LProductSliderShowcase>`.

## Key Business & UX Benefits

- Banner panel lets seasonal campaigns and brand stories anchor the slider, so commercial real estate works harder than a plain product strip.
- Same horizontal-scroll mechanics as the base slider mean shoppers transfer the gesture from listing pages to campaign sliders without relearning.
- Drop-in upgrade from `ProductSlider` for campaign blocks, so teams ship promotional content without forking the product-collection pattern.
- Surface-tone awareness keeps the slider legible on light and dark campaign backgrounds.

## Feature List

::features
---
items:
  - "banner prop accepts a BannerBasicProps object so campaign visuals anchor the strip alongside the products"
  - "products prop takes a ProductTileBasicProps array, the same shape used by ProductSlider"
  - "Optional background prop ('light' or 'dark') overrides the inherited surface tone for campaign blocks"
  - "Same horizontal-scroll mechanics as ProductSlider so shoppers transfer the gesture across listings and campaigns"
  - "Drop-in upgrade path from ProductSlider on promo blocks, no fork of the product-collection pattern"
---
::

## API Reference

::component-meta{:name="ProductSliderShowcase"}
::
