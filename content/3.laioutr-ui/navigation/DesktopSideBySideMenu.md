---
title: Desktop Side By Side Menu
description: A desktop navigation menu that slides in from the left as an off-canvas panel, displaying hierarchical category navigation with smooth slide-in transitions between levels.
jiraIssueId: LUI-96
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=24-7307&t=6wm3tnzO3UwBzAin-4
    target: _blank
seo:
  title: Desktop Side By Side Menu | Laioutr
  description: A desktop navigation menu that slides in from the left as an off-canvas panel, displaying hierarchical category…
---

## Overview

The Desktop Side by Side Menu provides desktop users with an intuitive, mobile-inspired navigation experience for browsing product categories. The side-by-side sliding pattern brings familiar mobile app navigation to desktop, providing a consistent mental model across devices. Smooth 300ms animations create a polished feel while maintaining performance. The off-canvas approach keeps the main content visible with an overlay, allowing users to maintain context during navigation.

## Key Business & UX Benefits

- Familiar side-by-side pattern works on desktop like mobile category menus.
- Slide animations and back button make hierarchy clear and easy to follow.
- Off-canvas keeps main content visible while browsing categories.
- Keyboard and focus trap keep navigation accessible.

:::tip
Pro-Tip from Larry: Use Side by Side Menu on desktop so category navigation feels consistent with mobile.
:::

## Usage

::component-code
---
name: LuiDesktopSideBySideMenu
story-id: organisms-sidebysidemenu-desktopsidebysidemenu--initial
---
::

## Feature List

::features
---
items:
  - "Multi-level category navigation with slide animations"
  - "Back button for parent navigation"
  - "Category nodes with images and chevrons"
  - "Keyboard navigation and focus trap"
---
::

## API Reference

::component-meta{:name="DesktopSideBySideMenu"}
::
