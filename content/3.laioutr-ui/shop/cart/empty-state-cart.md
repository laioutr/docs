---
title: Empty State Cart
description: Empty-state message for the cart, with icon, copy, and a shop-now call to action.
playground:
  name: EmptyStateCart
  base: ui-blocks-emptystatecart
  defaultStory: default
  height: 460px
seo:
  title: Empty State Cart | Laioutr
  description: Empty-state message for the cart.
sitemap:
  loc: /laioutr-ui/shop/cart/empty-state-cart
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`EmptyStateCart` is the empty-state shown inside `CartSheet` and on the standalone cart page when the user has no line items. It pairs an icon and explanatory copy with a single call-to-action that points back to the shop.

Auto-import tag: `<LEmptyStateCart>`.

## Key Business & UX Benefits

- Turns a dead-end empty cart into a recovery moment with a clear shop-now CTA, pulling shoppers back into the catalog instead of letting them bounce.
- Friendly icon and copy soften the moment shoppers realize their session expired, protecting brand perception at a sensitive touchpoint.
- Customizable copy and CTA target let merchandising route empty-cart traffic to current campaigns without a code change.

## Feature List

::features
---
items:
  - "Pairs an icon, explanatory copy, and a single shop-now CTA so the empty state has one clear next step"
  - "CTA target is configurable, so merchandising can route empty-cart traffic to current campaigns or category pages"
  - "Renders automatically inside CartSheet when the cart has no line items, no extra wiring required"
  - "Works on the standalone cart page and inside the mini-cart sheet from the same component"
  - "Copy and icon driven by props so localized markets and seasonal moments swap content without code changes"
---
::

## API Reference

::component-meta{:name="EmptyStateCart"}
::
