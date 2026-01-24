---
title: Product Tile Flag
description: A visual flag component for product tiles highlighting promotional labels like sale, promo, or new items.
jiraIssueId: LUI-52
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11179-50563&t=t5p6T6f67QhRVCAN-4
    target: _blank
---

## Overview

Draws customer attention to special product attributes by displaying prominent visual badges on product tiles. Supports use cases including highlighting discounted products during promotional periods, marking newly added items, and displaying special offer badges. Uses predefined variants to ensure consistent visual hierarchy across the storefront while allowing theming customization. The slot-based content approach enables merchants to customize label text while maintaining established visual treatment.

## Usage

::component-code
---
:name: ProductTileFlag
story-height: 100px
story-id: ui-kit-producttileflag--sale-flag
---
```vue-template
<ProductTileFlag variant="sale">
  -25%
</ProductTileFlag>
```
::

## Features

::features
---
items:
  - "Multiple variant styles: promo, sale, and new"
  - "Global theming for background and text colors"
  - "Customizable content via slot"
  - "Configurable styling through Figma variables"
---
::

## API Reference

::component-meta{:name="ProductTileFlag"}
::
