---
title: Quantity Picker
description: A stepper input for selecting product quantities with increment/decrement buttons, direct input, and stock validation.
jiraIssueId: LUI-92
---

## Overview

Enables customers to select product quantity before adding to cart with dual-input approach accommodating different user preferences. Default value of 1 aligns with typical single-item purchase patterns while supporting multi-quantity bulk orders when needed.

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

## Features

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
