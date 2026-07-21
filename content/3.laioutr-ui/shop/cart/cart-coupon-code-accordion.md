---
title: Cart Coupon Code Accordion
description: Collapsible coupon-code input inside the cart.
playground:
  name: CartCouponCodeAccordion
  base: ui-blocks-cartcouponcodeaccordion
  defaultStory: default
  height: 460px
seo:
  title: Cart Coupon Code Accordion
  description: Collapsible coupon-code input inside the cart.
sitemap:
  loc: /laioutr-ui/shop/cart/cart-coupon-code-accordion
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`CartCouponCodeAccordion` is the collapsible coupon-code input shown inside the cart. It keeps the input out of sight until a shopper expands it, then exposes a single field with an apply button. Props are `couponCode?: string` (an optional initial value) and `disabled?: boolean`. The component emits `applyCouponCode` with the submitted code string; the parent owns the apply call, validation, and any feedback. The standalone input primitive is `CartCouponCodeAccordionInput`; reach for it when you need just the field without the accordion wrapper.

Active codes themselves render in [`CartSummaryBox`](/laioutr-ui/shop/cart/cart-summary-box), which exposes a remove control via its `removeDiscount` emit.

Auto-import tag: `<LCartCouponCodeAccordion>`.

## Key Business & UX Benefits

- Tucks the coupon input behind an accordion so promo hunters can find it while regular shoppers stay focused on checkout.
- A single `applyCouponCode` emit keeps validation and cart mutations in your store, so feedback matches your backend exactly.
- The `disabled` prop lets the parent lock the input during an in-flight apply call without re-rendering the accordion.
- Reusable input primitive lets you place coupon entry on cart, checkout, or any custom flow without duplicating field logic.

## Feature List

::features
---
items:
  - "Collapsed by default so the coupon entry stays out of the way of shoppers who arrived without a code"
  - "applyCouponCode emit fires with the submitted code so the parent owns the cart mutation and any feedback"
  - "Optional couponCode prop seeds the input, useful for restoring a code that has not been applied yet"
  - "disabled prop lets the parent lock the input during an in-flight apply call"
  - "Standalone CartCouponCodeAccordionInput primitive available when you need just the field outside the accordion shell"
---
::

### LCartCouponCodeAccordion

::component-meta{:name="CartCouponCodeAccordion"}
::

### LCartCouponCodeAccordionInput

::component-meta{:name="CartCouponCodeAccordionInput"}
::
