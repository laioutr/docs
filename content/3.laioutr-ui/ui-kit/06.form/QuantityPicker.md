---
title: Quantity Picker
description: A stepper input for selecting product quantities with increment/decrement buttons, direct input, and stock validation.
jiraIssueId: LUI-92
seo:
  title: Quantity Picker | Laioutr
  description: A stepper input for selecting product quantities with increment/decrement buttons, direct input, and stock validation.
---

## Overview

Enables customers to select product quantity before adding to cart with dual-input approach accommodating different user preferences. Default value of 1 aligns with typical single-item purchase patterns while supporting multi-quantity bulk orders when needed.

## Key Business & UX Benefits

- Lets users change quantity with buttons or direct input.
- Min/max and stock validation prevent invalid quantities.
- Clear increment/decrement keeps the control familiar and accessible.
- Fits buybox and cart for single and bulk orders.

:::tip
Pro-Tip from Larry: Set max to stock so users can’t add more than available.
:::

## Usage

::component-code
---
:name: QuantityPicker
story-height: 100px
story-id: ui-kit-quantitypicker--increment-value-one
---
```vue-template
<QuantityPicker />
```
::

## Feature List

::features
---
items:
  - "Increment and decrement buttons"
  - "Direct number input via text field"
  - "Stock limit validation"
  - "Minimum and maximum value constraints"
---
::

## API Reference

::component-meta{:name="QuantityPicker"}
::
