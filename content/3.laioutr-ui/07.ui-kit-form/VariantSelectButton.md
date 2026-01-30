---
title: Variant Select Button
description: A variant select button component
links: []
---

## Overview

The VariantSelectButton component lets users choose a product variant (e.g. size or color) by tapping a button. It supports selected state and optional disabled state for out-of-stock variants in the buybox.

## Key Business & UX Benefits

- Lets customers pick variants (size, color) with a single tap.
- Selected state makes the current choice obvious.
- Disabled state for out-of-stock keeps the UI honest.
- Fits buybox and product cards for variant selection.

:::tip
Pro-Tip from Larry: Disable out-of-stock variants so customers don’t add unavailable items.
:::

## Usage

::component-code
---
:name: Variant Select Button
story-height: 100px
story-id: ui-kit-variantselectbutton--default
---
::

## Feature List

::features
---
items:
  - "Button-style variant selection for size, color, etc."
  - "Selected and disabled state support"
  - "Theme-aligned styling for light and dark modes"
  - "Suitable for buybox and product cards"
---
::

## API Reference

::component-meta{:name="VariantSelectButton"}
::
