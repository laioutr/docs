---
title: Breadcrumb
description: Breadcrumb navigation displaying user location in site hierarchy with expandable dropdown menus for subcategory access.
jiraIssueId: LUI-69
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=14145-361398&t=aARHqzA1E7J0jGbx-4
    target: _blank
---

## Overview

Reflects canonical navigation path with each level (except current page) as a clickable link. On PDPs, current category remains clickable while product title is excluded. On small mobile screens, shows only current category with truncation for long names. Supports RTL languages and dynamically generates paths based on page taxonomy. Uses LuiText, LuiNavigationMenuTextItem, and LuiDropdown for rendering.

## Usage

::component-code
---
:name: LuiBreadcrumb
story-id: organisms-breadcrumbs--four-levels-deep-third-dropdown
---
::

## Features

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
