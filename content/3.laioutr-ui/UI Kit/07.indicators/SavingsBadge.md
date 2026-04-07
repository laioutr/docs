---
title: Savings Badge
description: A savings badge component
links: []
seo:
  title: Savings Badge | Laioutr
  description: A savings badge component
---

## Overview

The Savings Badge component displays a discount or savings message (e.g. “-10%” or “Save 20%”) on product tiles or pricing to highlight promotional value.

## Key Business & UX Benefits

- Surfaces savings so customers see the deal at a glance.
- Themed variants (e.g. sale) keep badges consistent.
- Compact display fits product cards and pricing blocks.
- Supports percentage or fixed amount display.

:::tip
Pro-Tip from Larry: Use Savings Badge on product tiles so customers see the discount before clicking.
:::

## Usage

::component-code
---
:name: SavingsBadge
story-height: 60px
story-id: ui-kit-savingsbadge--default
---
```vue-template
<SavingsBadge :savingPercentage="10" badgeVariant="sale" />
```
::

## Feature List

::features
---
items:
  - "Savings percentage or amount display"
  - "Themed variants (e.g. sale) for consistency"
  - "Compact display for product tiles and pricing"
  - "Configurable badge variant and styling"
---
::

## API Reference

::component-meta{:name="SavingsBadge"}
::
