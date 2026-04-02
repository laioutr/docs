---
title: Rating Summary
description: A rating summary component
links: []
seo:
  title: Rating Summary | Laioutr
  description: A rating summary component
---

## Overview

The Rating Summary component displays aggregate review rating (e.g. stars and count) so customers see overall product quality at a glance. It fits product cards and product detail pages.

## Key Business & UX Benefits

- Shows overall rating and review count to build trust.
- Familiar star display helps customers compare products.
- Fits product cards and PDP without extra layout.
- Accessible with proper semantics for rating and count.

:::tip
Pro-Tip from Larry: Use Rating Summary on product cards so customers see social proof before clicking.
:::

## Usage

::component-code
---
:name: RatingSummary
story-height: 100px
story-id: ui-kit-ratingsummary--medium
---
```vue-template
<RatingSummary :reviewsCount="100" :rating="4.5" />
```
::

## Feature List

::features
---
items:
  - "Aggregate rating display with star graphic and count"
  - "Configurable size variants for cards and PDP"
  - "Theme-aligned styling"
  - "Accessible rating and count semantics"
---
::

## API Reference

::component-meta{:name="RatingSummary"}
::
