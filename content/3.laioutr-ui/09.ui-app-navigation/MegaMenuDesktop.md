---
title: Mega Menu Desktop
description: Desktop mega menu flyout displaying second/third navigation levels in multi-column masonry layout with promotional content slots.
jiraIssueId: LUI-66
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13944-50374&t=4gWdGg1GDlnYog3D-4
    target: _blank
---

## Overview

Uses @yeger/vue-masonry-wall for efficient category distribution. Layout rules adapt based on column count: 4 columns allow 2 content tiles, 3 columns allow 1 or 3 tiles with masonry, and 2 columns allow 3 tiles. Category headers are clickable links, with main categories represented as See all links. Includes slot for promotional content on the right side with configurable row/column layout.

## Key Business & UX Benefits

- Mega menu shows many categories and promo content without leaving the header.
- Masonry layout uses space well and keeps flyouts scannable.
- Promo slots support campaigns and featured links in the nav.
- Light and dark modes fit different header designs.

:::tip
Pro-Tip from Larry: Use promo slots in the mega menu to highlight campaigns without leaving the nav.
:::

## Usage

::component-code
---
:name: LuiMegaMenuDesktop
story-id: organisms-megamenudesktop--four-columns-two-grid
---
::

## Feature List

::features
---
items:
  - "Multi-column masonry layout supporting up to 5 category columns"
  - "Promotional content slots (up to 3) with row or column layout options"
  - "Smooth transitions for multilevel subcategory navigation"
  - "Light and dark color mode support"
---
::

## API Reference

::component-meta{:name="MegaMenuDesktop"}
::
