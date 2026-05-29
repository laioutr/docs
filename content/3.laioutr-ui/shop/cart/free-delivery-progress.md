---
title: Free Delivery Progress
description: Progress bar showing how close the cart is to the free-delivery threshold.
playground:
  name: FreeDeliveryProgress
  base: ui-blocks-freedeliveryprogress
  defaultStory: in-progress
  height: 460px
seo:
  title: Free Delivery Progress | Laioutr
  description: Progress bar showing how close the cart is to the free-delivery threshold.
sitemap:
  loc: /laioutr-ui/shop/cart/free-delivery-progress
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`FreeDeliveryProgress` shows how far the cart is from the free-delivery threshold ("$X away from free shipping"). It fills as the subtotal grows and switches to a completed state once the threshold is met.

Both prices are passed as `Money` objects (`{ amount, currency }`), where `amount` is in the smallest unit of the currency (cents, pence). The component computes the remaining amount as `maxPrice.amount - totalPrice.amount` and renders the "free delivery reached" state once `totalPrice.amount >= maxPrice.amount`.

Auto-import tag: `<LFreeDeliveryProgress>`.

## Key Business & UX Benefits

- Visible "x away from free shipping" prompt is one of the strongest known levers for raising average order value with no discount cost to the merchant.
- Animated fill state and completed milestone give shoppers a small win at the moment they cross the threshold, reinforcing the buy decision.
- One configurable threshold per market means promotions and shipping zones can shift without touching cart UI code.
- Inline placement inside the cart sheet keeps the upsell prompt right where shoppers decide whether to add one more item or check out.

## Feature List

::features
---
items:
  - "Both inputs typed as Money so currency and minor-unit math stay consistent with the rest of the cart"
  - "Computes the remaining amount as maxPrice.amount minus totalPrice.amount and shows a 'free delivery reached' state once the cart clears the threshold"
  - "Fill animation tracks the subtotal so shoppers see the bar advance with every line they add"
  - "Drops into CartSheet next to CartListItem so the upsell prompt sits where the next-add decision happens"
  - "One threshold prop per market makes shipping promotions and zone changes a data update, not a code change"
---
::

## API Reference

::component-meta{:name="FreeDeliveryProgress"}
::
