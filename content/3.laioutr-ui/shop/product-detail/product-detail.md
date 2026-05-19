---
title: Product Detail
description: Two-column gallery and content layout for product detail pages.
seo:
  title: Product Detail | Laioutr
  description: Two-column gallery + content layout for product detail pages.
sitemap:
  loc: /laioutr-ui/shop/product-detail/product-detail
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`ProductDetail` is the two-column PDP layout: gallery on one side, content on the other. Drop the gallery into the `#gallery` slot and assemble the right-hand buy-box yourself from atomic blocks like `ProductTitle`, `PriceInfo`, `BenefitsBox`, and `AddToCart` so each PDP can mix and match the blocks it needs.

Auto-import tag: `<LProductDetail>`.

## Key Business & UX Benefits

- Two-column gallery-and-content layout matches the PDP pattern shoppers expect across major retailers, so the page feels familiar from the first second.
- Slot-based composition lets each PDP mix the right blocks (gallery, title, price, benefits, add-to-cart) per category without forking the layout.
- Responsive structure scales the same blocks from mobile single-column to desktop two-column, removing the cost of running separate templates.
- Backend-agnostic shell composes with any commerce data source, so PDPs for ecommerce, marketplace, and B2B variants share one layout system.

## Usage

::component-code
---
:name: LProductDetail
:story-height: 400px
story-id: ui-sections-productdetail--default
title: ProductDetail Default
---
```vue-template
<ProductDetail>
    <template #gallery>
      <ProductImageGallery :media="product.media" />
    </template>
    <template #content>
      <ProductTitle v-bind="product" />
      <PriceInfo :price="product.price" />
      <BenefitsBox :benefits="product.benefits" />
      <AddToCart :loading="addLoading" @add-to-cart="add" />
    </template>
  </ProductDetail>
```
::

## Feature List

::features
---
items:
  - "Two named slots ('#gallery' and '#content') for the classic PDP split, so each side is freely composed"
  - "Content slot accepts any mix of ProductTitle, PriceInfo, BenefitsBox, AddToCart, and category-specific blocks"
  - "Responsive layout collapses to a single column on mobile, no separate template required"
  - "Backend-agnostic shell so the same layout drives ecommerce, marketplace, and B2B PDPs"
  - "Works with any gallery component, including ProductImageGallery, in the gallery slot"
---
::

## API Reference

::component-meta{:name="ProductDetail"}
::
