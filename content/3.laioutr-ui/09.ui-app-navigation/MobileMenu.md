---
title: Mobile Menu
description: Mobile off-canvas navigation with category grid and hierarchical menus.
jiraIssueId: LUI-65
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=2899-10340&t=mlUfKppRhGmTxkMG-4
    target: _blank
---

## Overview

The MegaMenuMobile component provides mobile shoppers with a touch-optimized, full-screen navigation experience. It presents the store's category structure in a compact grid format within an off-canvas sheet overlay. The component splits into three parts: MegaMenuMobile (wrapper with sheet and login), RootMenu (main category grid), and ChildMenu (subcategory view). Content slots accept CMS-managed content like CTA banners. Language and dark mode controls are relocated from the desktop top bar.

## Usage

::component-code
---
:name: LuiMobileMenu
story-id: ui-blocks-header--sticky&globals=viewport:xs
---
::

## Features

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
