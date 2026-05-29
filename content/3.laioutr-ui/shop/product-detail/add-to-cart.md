---
title: Add to Cart
description: Add-to-cart button with quantity, loading, and disabled states.
playground:
  name: AddToCart
  base: ui-blocks-addtocart
  defaultStory: default
  height: 460px
seo:
  title: Add to Cart | Laioutr
  description: Add-to-cart button with quantity, loading, and disabled states.
sitemap:
  loc: /laioutr-ui/shop/product-detail/add-to-cart
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/QgRgNtTxBTCAxpTe1rriHM/Studio-v1.0?node-id=925-101184&t=lyLXOO9i864GgV9v-4
    target: _blank
---

## Overview

`AddToCart` is the primary add-to-cart button on a product detail page. It owns the click affordance, the quantity, and the loading state; cart logic stays on your side via the `add-to-cart` event. Pass `productId` and `variantId` so the emitted payload is enough to drive your cart store without extra lookups.

Auto-import tag: `<LAddToCart>`.

## Key Business & UX Benefits

- Prominent quantity-plus-CTA pattern is the single most important interaction on a PDP, and the component owns it consistently across every product type.
- Built-in loading state prevents double-submits and matches optimistic cart updates, removing a common source of duplicate-line complaints.
- Disabled when `isSoldOut` so shoppers don't click into a dead-end. Missing `variantId` makes the click a no-op rather than visually disabling the button.
- Event-only contract keeps cart logic in your store, so analytics, A/B tests, and custom checkout flows hook in without forking the button.

## Feature List

::features
---
items:
  - "Built-in loading prop suppresses double-submits while the cart store finishes an optimistic update"
  - "isSoldOut prop disables the CTA so shoppers can't click into an out-of-stock dead end"
  - "Missing variantId turns the click into a no-op instead of disabling the button, surfacing 'pick a variant first' inline"
  - "Quantity stepper is part of the component so the PDP's most important interaction lives in one place"
  - "Emits the add-to-cart event with productId and variantId in the payload so wiring up a cart store is one handler"
  - "Stays a pure UI surface, so analytics, A/B tests, and custom checkout flows hook in without forking the button"
---
::

## API Reference

::component-meta{:name="AddToCart"}
::
