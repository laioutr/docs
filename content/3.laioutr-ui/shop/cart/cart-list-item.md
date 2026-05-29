---
title: Cart List Item
description: Single line item row inside the cart with image, title, quantity picker, price, and remove action.
playground:
  name: CartListItem
  base: ui-blocks-cartlistitem
  defaultStory: default
  height: 460px
seo:
  title: Cart List Item | Laioutr
  description: Single line item row inside the cart.
sitemap:
  loc: /laioutr-ui/shop/cart/cart-list-item
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`CartListItem` is the line-item row used inside `CartSheet` and any cart detail view. It renders the product image, brand, title, optional subtitle, a `QuantityPicker`, the line price (with optional strikethrough and unit price), and applied discount or voucher badges.

Props are flat rather than wrapped in a `line` object: `itemId`, `image`, `title`, `price`, plus optional `brand`, `brandHref`, `subtitle`, `strikethroughPrice`, `unitPrice`, `quantity`, `quantityLoading`, `quantityPicker`, `discount`, `voucher`, `flags`, and `href`. The component emits `itemQuantityChange` with the new quantity number when the picker changes, and `itemDelete` when the row's delete control fires.

Auto-import tag: `<LCartListItem>`.

## Key Business & UX Benefits

- Inline quantity picker lets shoppers adjust orders in place, reducing the drop-off that comes from cart edits feeling slow.
- Strikethrough and unit-price slots help shoppers confirm exactly what they're paying for, lowering returns from misread prices.
- Single row component slots into mini-cart sheets, dedicated cart pages, and order summaries, so cart UI stays consistent everywhere shoppers see it.
- Inline discount and voucher badges show applied promotions on the line itself, keeping the savings story attached to the product.

## Feature List

::features
---
items:
  - "Flat prop surface (itemId, image, title, price, quantity, ...) so the row plugs directly into any cart-store shape"
  - "Inline QuantityPicker emits itemQuantityChange with the new quantity number, ready for optimistic cart updates"
  - "itemDelete event fires when the row's delete control is hit, leaving the actual removal call to the parent store"
  - "Inline discount and voucher badges keep applied promotions visible on the line they affect"
  - "Themed via design tokens and a BEM root class for per-row overrides on dark or branded backgrounds"
---
::

## API Reference

::component-meta{:name="CartListItem"}
::
