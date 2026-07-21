---
title: Quantity Picker
description: Stepper input for product quantity with increment / decrement buttons and direct keyboard entry.
playground:
  name: QuantityPicker
  base: ui-kit-molecules-quantitypicker
  defaultStory: increment-value-one
  height: 460px
jiraIssueId: LUI-92
seo:
  title: Quantity Picker
  description: Stepper input for product quantity with increment / decrement buttons and direct entry.
sitemap:
  loc: /laioutr-ui/ui-kit/form/quantitypicker
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

QuantityPicker is the quantity stepper used in the buybox and cart. It offers two ways to set a value: increment / decrement buttons for small adjustments, and direct keyboard entry for larger jumps (typing `12` is faster than tapping `+` twelve times). The component defaults to `1` and clamps to `minimumValue` / `maximumValue` (bind those to stock when you know it). Use `incrementValue` for bulk stepping (e.g. case packs of `6`).

Set `withDeleteButton` to swap the decrement icon to a trash icon once the value reaches the minimum, and listen for `@delete` to remove the line item entirely. That's the cart "remove last item" affordance.

## Key Business & UX Benefits

- Direct keyboard entry alongside +/- buttons removes friction for B2B and bulk buyers, who can grow average order value without rage-tapping the increment button.
- `maximumValue` tied to live stock stops customers from ordering quantities you can't fulfil, which protects the post-purchase experience and reduces refund volume.
- `withDeleteButton` plus the `@delete` event turns the cart row's quantity control into the line-item remove control too, so customers don't hunt for a separate "remove" button.
- `incrementValue` covers case-pack and bulk-order workflows in one component, so B2B and DTC storefronts share the same stepper.

:::tip
Pro-Tip from Larry: Bind `maximumValue` to available stock so the picker physically prevents customers from ordering more than inventory allows, and listen for `@delete` to remove the line item when the user clicks decrement at the minimum.
:::

## Feature List

::features
---
items:
  - "Two entry modes: increment/decrement buttons for small bumps and direct keyboard entry for fast bulk jumps"
  - "`minimumValue` and `maximumValue` clamp the value, so binding `maximumValue` to live stock physically prevents over-ordering"
  - "`incrementValue` lets case-pack and bulk workflows step in 6s or 12s instead of 1s, covering B2B and DTC from one stepper"
  - "`withDeleteButton` swaps the decrement icon to a trash icon when the value reaches `minimumValue`"
  - "`@delete` event lets the same control double as the cart row's remove affordance, so customers don't hunt for a separate button"
  - "Default value of 1 keeps drop-in cart and buybox use trivial, no setup required"
---
::

## API Reference

::component-meta{:name="QuantityPicker"}
::
