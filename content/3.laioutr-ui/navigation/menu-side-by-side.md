---
title: Menu Side by Side
description: Desktop side-by-side off-canvas category menu with slide-in transitions between hierarchical levels.
playground:
  name: MenuSideBySide
  base: ui-blocks-menusidebyside
  defaultStory: initial
  height: 460px
jiraIssueId: LUI-96
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=24-7307&t=6wm3tnzO3UwBzAin-4
    target: _blank
seo:
  title: Menu Side by Side | Laioutr
  description: Desktop side-by-side off-canvas category menu.
sitemap:
  loc: /laioutr-ui/navigation/menu-side-by-side
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/desktopsidebysidemenu
changelogKeys:
  - MenuSideBySide
---

## Overview

`MenuSideBySide` brings the mobile-app side-by-side category browsing pattern to desktop. The off-canvas panel slides in from the left; tapping a node slides the next level in alongside it. 300ms transitions and a back button keep the hierarchy obvious as users drill in and out. The panel keeps main content visible behind it so shoppers stay oriented while browsing categories.

The compound is `MenuSideBySide` (root) plus `MenuSideBySideRoot`, `MenuSideBySideChild`, and `MenuSideBySideNode` for the individual nodes.

Reuse the same category data on [`MobileMenuShop`](/laioutr-ui/navigation/mobile-menu-shop) so desktop and mobile menus stay in sync.

Each top-level node can override its label color: the `NavigationNode` shape carries an optional `textColor` (`ColorFieldValue`) applied to the node label, falling back to the surface-tone cascade when unset. In Studio, `BlockMenuSideBySide` (and `BlockMenuBasic`) expose a per-item color picker through an `as: 'style'` decorator on author-typed titles; entity-driven CMS items don't expose it.

## Key Business & UX Benefits

- Drill-down with the main page still visible keeps shoppers oriented in deep catalogs, which reduces drop-off compared with full-page or full-overlay category pickers.
- 300ms transitions and a back button make the hierarchy obvious, so even occasional visitors can find a niche category without learning the site first.
- The same category data backs desktop and mobile menus, so a category rename or reorder ships everywhere in one Studio edit instead of two parallel changes.
- Familiar mobile-app browsing pattern on desktop shortens the learning curve for app-first audiences and lifts engagement on deep taxonomies.

:::tip
Pro-Tip from Larry: Pass the same `navigationMenuItems` to `MobileMenuShop` so the desktop drill-down and mobile menu reflect the same catalog.
:::

## Feature List

::features
---
items:
  - "Off-canvas panel slides in from the left and the next level slides in alongside it as users drill into the catalog"
  - "300ms transitions plus a back button keep the hierarchy obvious during drill-in and drill-out"
  - "Main page stays visible behind the panel so shoppers keep their place in the catalog"
  - "Compound splits into `MenuSideBySide`, `MenuSideBySideRoot`, `MenuSideBySideChild`, and `MenuSideBySideNode` for per-level control"
  - "Same `navigationMenuItems` array can be reused by `MobileMenuShop` to keep desktop and mobile catalogs in sync"
  - "Familiar mobile-app browsing pattern on desktop shortens the learning curve for app-first audiences"
---
::

### LMenuSideBySide

::component-meta{:name="MenuSideBySide"}
::

### LMenuSideBySideRoot

::component-meta{:name="MenuSideBySideRoot"}
::

### LMenuSideBySideChild

::component-meta{:name="MenuSideBySideChild"}
::

### LMenuSideBySideNode

::component-meta{:name="MenuSideBySideNode"}
::
