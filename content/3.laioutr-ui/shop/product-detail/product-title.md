---
title: Product Title
description: PDP product title block with brand line, product name, and optional brand logo.
seo:
  title: Product Title | Laioutr
  description: PDP product title block with brand and product name.
sitemap:
  loc: /laioutr-ui/shop/product-detail/product-title
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`ProductTitle` is the title block at the top of the PDP content column. It renders the brand line, the product name, and an optional brand logo image. Props are `brandTitle?: string`, `title: string`, and `brandLogo?: Media`.

Auto-import tag: `<LProductTitle>`.

## Key Business & UX Benefits

- Brand line and clear product name match the way shoppers scan PDPs, putting the recognizable signal above the line where it earns trust.
- Optional brand logo lets premium and licensed catalogues show provenance at a glance, supporting conversion on branded categories.
- Heading hierarchy is tuned for SEO and screen readers, so the same component handles search ranking and accessibility together.

## Usage

::component-code
---
:name: LProductTitle
:story-height: 400px
story-id: ui-blocks-producttitle--default
title: ProductTitle Default
---
```vue-template
<ProductTitle :brand-title="product.brand" :title="product.title" :brand-logo="product.brandLogo" />
```
::

## Feature List

::features
---
items:
  - "brandTitle prop renders the brand line above the product name so the recognizable signal earns trust before the title scans"
  - "Optional brandLogo prop surfaces the brand mark next to the title for licensed and premium catalogues"
  - "Heading hierarchy tuned for SEO and screen readers, so search ranking and accessibility share one component"
  - "Drops into the PDP content column above PriceInfo and BenefitsBox, completing the buy-box top section"
  - "Pure data-driven render so swapping titles for A/B tests needs no template change"
---
::

## API Reference

::component-meta{:name="ProductTitle"}
::
