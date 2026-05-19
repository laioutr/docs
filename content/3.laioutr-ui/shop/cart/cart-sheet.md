---
title: Cart Sheet
description: Off-canvas mini-cart sheet that composes line items, summary, free-delivery progress, and the coupon accordion.
seo:
  title: Cart Sheet | Laioutr
  description: Off-canvas mini-cart sheet.
sitemap:
  loc: /laioutr-ui/shop/cart/cart-sheet
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`CartSheet` is the off-canvas mini-cart shown when a shopper opens the cart from the header or after an add-to-cart action. It composes `CartListItem`s, a `CartSummaryBox`, a `FreeDeliveryProgress` indicator, and the `CartCouponCodeAccordion`. When the cart is empty, the sheet renders `EmptyStateCart` instead of the line-item list.

Auto-import tag: `<LCartSheet>`.

## Key Business & UX Benefits

- Off-canvas cart keeps shoppers on the page they were browsing, lifting conversion compared to a full cart-page redirect after every add-to-cart.
- Bundles free-delivery progress, coupon entry, and totals in one sheet so shoppers see every lever for raising basket value before they check out.
- Automatic empty-state swap with a shop-now CTA recovers traffic that would otherwise hit a dead-end cart and bounce.
- Single mini-cart contract covers desktop and mobile, removing the need for separate cart UIs and the QA cost that comes with them.

## Usage

::component-code
---
:name: LCartSheet
:story-height: 700px
story-id: ui-features-cartsheet--default
title: CartSheet Default
---
```vue-template
<CartSheet
    v-model:open="cartOpen"
    :cart-content="{
      freeDeliveryProgress: {
        totalPrice: { amount: 42, currency: 'EUR' },
        maxPrice: { amount: 50, currency: 'EUR' },
      },
      cartListItems: cart.lineItems,
      summaryBox: {
        subtotalPrice: { amount: 42, currency: 'EUR' },
        totalPrice: { amount: 42, currency: 'EUR' },
      },
      paymentLogos: cart.paymentLogos,
    }"
    :empty-state="{}"
    @item-delete="onItemDelete"
    @item-quantity-change="onQuantityChange"
    @apply-coupon-code="onApplyCoupon"
    @remove-discount="onRemoveDiscount"
  />
```
::

## Feature List

::features
---
items:
  - "Off-canvas sheet driven by v-model:open so the same header button opens it from any page"
  - "Auto-swaps to EmptyStateCart when the cart-content has no line items, no extra v-if needed"
  - "Bundles CartListItem rows, FreeDeliveryProgress, CartSummaryBox, and CartCouponCodeAccordion in one cart-content shape"
  - "paymentLogos slot renders the accepted payment methods at the bottom so trust signals stay visible at checkout entry"
  - "Single event surface (item-delete, item-quantity-change, apply-coupon-code, remove-discount) keeps cart logic in your store"
  - "One contract drives both desktop and mobile mini-cart, removing the need for separate sheet templates"
---
::

## API Reference

::component-meta{:name="CartSheet"}
::
