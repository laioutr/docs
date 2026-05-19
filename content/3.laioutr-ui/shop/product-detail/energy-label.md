---
title: Energy Label
description: EU energy efficiency label image with lightbox preview and data-sheet link.
seo:
  title: Energy Label | Laioutr
  description: EU energy efficiency label image with lightbox and data-sheet link.
sitemap:
  loc: /laioutr-ui/shop/product-detail/energy-label
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`EnergyLabel` renders the EU energy-efficiency label artwork supplied by the manufacturer, alongside a link to the official product data sheet. The label thumbnail opens a fullsize image in the shared lightbox, and the data-sheet link is a direct download.

Required prop is `labelPreview: Media` for the thumbnail and `labelFullsize: Media` for the lightbox view. Pass `dataSheetLink: string` to render the data-sheet download link beside the thumbnail.

Auto-import tag: `<LEnergyLabel>`.

## Key Business & UX Benefits

- Renders the regulator-supplied label artwork rather than a re-rendered grade widget, so there is no risk of drift from the official mark.
- Lightbox preview lets shoppers read the full label without leaving the PDP, which keeps energy-conscious shoppers engaged at the decision point.
- Direct link to the product data sheet keeps regulatory artifacts one click away, so shoppers and auditors find them without contacting support.
- Drop-in placement on any PDP means new markets entering EU energy scope can ship without a custom integration per product.

## Usage

::component-code
---
:name: LEnergyLabel
:story-height: 400px
story-id: ui-blocks-energylabel--default
title: EnergyLabel Default
---
```vue-template
<EnergyLabel
  :label-preview="product.energyLabelPreview"
  :label-fullsize="product.energyLabelFullsize"
  :data-sheet-link="product.energyDataSheetUrl"
/>
```
::

## Feature List

::features
---
items:
  - "labelPreview renders the official EU label thumbnail next to the buy box"
  - "labelFullsize drives the shared lightbox so shoppers can read the full label without leaving the PDP"
  - "dataSheetLink renders an external download link for the regulatory data sheet"
  - "Drop-in placement on any PDP, so new markets entering EU energy scope ship without per-product integration work"
  - "Self-contained widget that does not require a separate compliance microsite to stay current"
---
::

## API Reference

::component-meta{:name="EnergyLabel"}
::
