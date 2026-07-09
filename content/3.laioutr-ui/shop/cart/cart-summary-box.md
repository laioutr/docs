---
title: Cart Summary Box
description: Subtotal, shipping, and total summary block for the cart.
playground:
  name: CartSummaryBox
  base: ui-blocks-cartsummarybox
  defaultStory: default
  height: 460px
seo:
  title: Cart Summary Box
  description: Subtotal, shipping, and total summary block.
sitemap:
  loc: /laioutr-ui/shop/cart/cart-summary-box
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`CartSummaryBox` is the totals block at the bottom of `CartSheet` and the standalone cart page. It shows the subtotal, optional applied discount, shipping, and total, plus a "VAT included" label and a primary checkout button. Values are formatted through the active locale so currency symbols and decimal separators stay correct across markets.

Props are flat: `subtotalPrice`, `totalPrice` (both required), plus optional `discount`, `shippingPrice`, `isShippingFree`, `cartHref`, and `loading`. The component emits `removeDiscount` when the shopper hits the remove control on the applied coupon row.

Auto-import tag: `<LCartSummaryBox>`.

## Key Business & UX Benefits

- Transparent breakdown of subtotal, discount, and shipping sets correct expectations before checkout, cutting the unexpected-cost surprise that drives roughly half of cart abandonment.
- "VAT included" label sits next to the total so shoppers in tax-inclusive markets see at a glance that the price is final.
- Locale-aware formatting renders the right currency symbol and decimal separator per market without per-country code paths.
- Shared totals component keeps the mini-cart, cart page, and checkout in sync, removing the risk of a price mismatch that erodes trust at the final step.

## Feature List

::features
---
items:
  - "Renders subtotal, applied discount, shipping, and total so shoppers see the full price breakdown before checkout"
  - "isShippingFree prop swaps the shipping line for a 'free' tag, matching how promotions are usually framed"
  - "Locale-aware formatting via the active market's currency and decimal separator with no per-country code paths"
  - "removeDiscount emit lets the parent store handle coupon removal, keeping cart mutations server-side"
  - "Primary checkout button is built in, with a loading state for in-flight cart-to-checkout calls"
---
::

## API Reference

::component-meta{:name="CartSummaryBox"}
::
