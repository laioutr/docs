---
title: Breadcrumb
description: Breadcrumb navigation displaying user location in site hierarchy with expandable dropdown menus for subcategory access.
jiraIssueId: LUI-69
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=14145-361398&t=aARHqzA1E7J0jGbx-4
    target: _blank
seo:
  title: Breadcrumb | Laioutr
  description: Breadcrumb navigation displaying user location in site hierarchy with expandable dropdown menus for subcategory access.
sitemap:
  loc: /laioutr-ui/navigation/breadcrumb
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Reflects canonical navigation path with each level (except current page) as a clickable link. On PDPs, current category remains clickable while product title is excluded. On small mobile screens, shows only current category with truncation for long names. Supports RTL languages and dynamically generates paths based on page taxonomy. Uses LuiText, LuiNavigationMenuTextItem, and LuiDropdown for rendering.

## Key Business & UX Benefits

- Shows where the user is in the site so they can jump back up the hierarchy.
- Clickable levels reduce clicks to reach category or home.
- Mobile truncation keeps breadcrumb useful on small screens.
- RTL and dynamic paths support international and CMS-driven sites.

:::tip
Pro-Tip from Larry: Use breadcrumbs on PDP so users can quickly go back to category or home.
:::

## Usage

::component-code
---
:name: LuiBreadcrumb
story-id: organisms-breadcrumbs--four-levels-deep-third-dropdown
---
::

## Feature List

::features
---
items:
  - "Full navigation path with clickable links reflecting category hierarchy"
  - "Dropdown menus showing subcategories on hover (desktop)"
  - "Mobile-optimized collapsible display with expandable navigation"
  - "CSS-only responsive layout to prevent layout shifts"
---
::

## API Reference

::component-meta{:name="LuiBreadcrumbs"}
::
