---
title: Product Card
description: Versatile product tile for grids and sliders with pricing and cart.
jiraIssueId: LUI-53
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11271-205258&t=t5p6T6f67QhRVCAN-4
    target: _blank
---

## Overview

The ProductTile component serves as the primary building block for product listings across category pages, search results, and promotional sliders. It maintains consistent height regardless of content variations for grid alignment. Focus order follows accessibility best practices. The tile emits events rather than handling cart logic internally for flexible commerce backend integration. Internationalized price formatting uses the $money helper for proper locale handling.

## Key Business & UX Benefits

- One tile for product image, title, price, and add-to-cart across grids and sliders.
- Consistent height keeps grids aligned and scannable.
- Sale pricing and flags support promotions without extra components.
- Event-based cart integration fits any commerce backend.

:::tip
Pro-Tip from Larry: Use Product Card in grids and sliders so product listings stay consistent everywhere.
:::

## Usage

### ProductCard Vertical

The most popular option for presenting detailed product information in a group.

::component-code
---
:name: LuiProductTileBasic
:story-height: 500px
story-id: organisms-producttilebasic--full-featured
---
::

## Feature List

::features
---
items:
  - "Flexible content: brand, title, pricing, flags, swatches"
  - "Multiple image aspect ratios (1:1 or 3:4)"
  - "Sale pricing with strikethrough original price"
  - "Add-to-cart button with customizable icon variant"
---
::

## API Reference

::component-meta{:name="ProductTileBasic"}
::
