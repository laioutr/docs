---
title: Product Tile Flag
description: A visual flag component for product tiles that highlights promotional labels like sale, promo, or new items with themed styling.
jiraIssueId: LUI-52
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11179-50563&t=t5p6T6f67QhRVCAN-4
    target: _blank
---

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
  - "Consistent styling matching category node flags"
---
::

## API Reference

::component-meta{:name="ProductTileFlag"}
::
