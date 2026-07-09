---
title: Coupon Box
description: Coupon-code display widget with applied state, copy-to-clipboard, and success toast feedback.
playground:
  name: CouponBox
  base: ui-blocks-couponbox
  defaultStory: discount-text-copy-action
  height: 460px
seo:
  title: Coupon Box
  description: Coupon-code copy / display widget.
sitemap:
  loc: /laioutr-ui/shop/product-detail/coupon-box
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=98-245816&t=edNTmchAoqmIS03q-4
    target: _blank
---

## Overview

`CouponBox` displays a coupon code on PDPs and inside `PopUpPromotion`. Shoppers can copy the code with one click; the component fires a success toast on copy and switches to an "applied" presentation once the code is active on the cart.

The clear icon picks up the surrounding theme via the `--icon-color` CSS custom property, so you can recolor it without overriding component styles.

Auto-import tag: `<LCouponBox>`.

## Key Business & UX Benefits

- One-click copy removes the friction of manually typing a code, lifting redemption rate on PDP and promotion campaigns.
- Applied-state presentation confirms the discount is live, removing the "did it work?" doubt that pushes shoppers to chat or email support.
- Success toast confirms the copy landed in the clipboard, so shoppers know they can paste it into the checkout field.
- Themeable icon color via CSS custom property lets brand teams match the box to seasonal campaign palettes without component overrides.

## Feature List

::features
---
items:
  - "One-click copy-to-clipboard so shoppers never retype a promo code at checkout"
  - "applied prop swaps to a confirmed presentation once the code is active on the cart"
  - "Built-in success toast confirms the copy landed in the clipboard"
  - "Themeable icon color via the --icon-color CSS custom property for seasonal campaign palettes"
  - "Drops into PDPs and PopUpPromotion from the same component, keeping promo treatment consistent"
---
::

## API Reference

::component-meta{:name="CouponBox"}
::
