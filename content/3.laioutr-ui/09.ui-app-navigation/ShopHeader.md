---
title: Shop Header
description: E-commerce header with mega menus, cart, search, and account functionality.
jiraIssueId: LUI-211
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13254-120608&t=gY1zYbY2NWGSIZKZ-4
    target: _blank
---

## Overview

The Shop Header is a full-featured e-commerce navigation component designed for stores with extensive product catalogs. It supports dynamic menu data from the commerce backend with three submenu display variants: mega menu flyouts with content slots, side-by-side panels, or simple dropdowns. Integrated utility icons provide access to cart, customer account, wishlist, and search. An optional top bar adds secondary links, language selection, and dark mode toggle.

## Key Business & UX Benefits

- One header supports mega menu, side-by-side, or dropdown so nav fits the catalog.
- Cart, account, wishlist, and search in one place reduce header complexity.
- Dynamic menu data keeps nav in sync with the backend without hardcoding.
- Optional top bar keeps locale and dark mode accessible without crowding the main nav.

:::tip
Pro-Tip from Larry: Choose the submenu variant (mega, side-by-side, dropdown) that fits your category depth.
:::

## Usage

::component-code{:name="SectionHeader" story-id="organisms-shop-header--header"}
::

## Feature List

::features
---
items:
  - "Multiple submenu variants (Mega Menu, Side by Side, Dropdown)"
  - "Integrated cart, account, wishlist, and search"
  - "Dynamic menu data source integration"
  - "Optional top bar with language and mode switch"
---
::

## API Reference

::component-meta{:name="SectionHeader"}
::
