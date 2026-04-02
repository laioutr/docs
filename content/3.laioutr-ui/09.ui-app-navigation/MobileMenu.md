---
title: Mobile Menu
description: Mobile off-canvas navigation with category grid and hierarchical menus.
jiraIssueId: LUI-65
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=2899-10340&t=mlUfKppRhGmTxkMG-4
    target: _blank
seo:
  title: Mobile Menu | Laioutr
  description: Mobile off-canvas navigation with category grid and hierarchical menus.
---

## Overview

The MegaMenuMobile component provides mobile shoppers with a touch-optimized, full-screen navigation experience. It presents the store's category structure in a compact grid format within an off-canvas sheet overlay. The component splits into three parts: MegaMenuMobile (wrapper with sheet and login), RootMenu (main category grid), and ChildMenu (subcategory view). Content slots accept CMS-managed content like CTA banners. Language and dark mode controls are relocated from the desktop top bar.

## Key Business & UX Benefits

- Full-screen mobile nav keeps categories and subcategories easy to browse on small screens.
- Category grid and child menu reduce taps to reach deep categories.
- Content slots support CTA banners and promo content in the menu.
- Login and locale in the sheet keep the main header clean.

:::tip
Pro-Tip from Larry: Use the category grid in the mobile menu so users see all top categories at once.
:::

## Usage

::component-code
---
:name: LuiMobileMenu
story-id: ui-blocks-header--sticky&globals=viewport:xs
---
::

## Feature List

::features
---
items:
  - "Category grid layout using compact node components"
  - "Hierarchical navigation between root and child menus"
  - "User login button in sticky header"
  - "Free content slots for CTA banners or additional nodes"
---
::

## API Reference

### LuiMobileMenu

::component-meta{:name="MobileMenu"}
::

### LuiMobileMenuBanner

::component-meta{:name="MobileMenuBanner"}
::

### LuiMobileMenuButton

::component-meta{:name="MobileMenuButton"}
::

### LuiMobileMenuButtonGrid

::component-meta{:name="MobileMenuButtonGrid"}
::

### LuiMobileMenuList

::component-meta{:name="MobileMenuList"}
::

### LuiMobileMenuListItem

::component-meta{:name="MobileMenuListItem"}
::
