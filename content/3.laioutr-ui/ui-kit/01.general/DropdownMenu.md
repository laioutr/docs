---
title: Dropdown Menu
description: Dropdown menu component with custom trigger, selectable items, and active selection indicator.
jiraIssueId: LUI-81
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=606-17197&t=reqgsA9rbH2D4nWh-4
    target: _blank
seo:
  title: Dropdown Menu | Laioutr
  description: Dropdown menu component with custom trigger, selectable items, and active selection indicator.
sitemap:
  loc: /laioutr-ui/ui-kit/general/dropdownmenu
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

DropdownMenu is a custom-styled menu surface for sort, filter, and contextual-action UIs. It opens from a configurable trigger and supports text items, checkbox items, icon items, radio groups, and separators.

Set `position` (`'left'` / `'right'` / `'top'` / `'bottom'`) to anchor the menu against the trigger. On viewports below the `sm` breakpoint, position auto-switches to `'bottom'` so the menu doesn't get cut off on phones. `width` and `maxHeight` control the panel size and overflow scroll.

Pair the dropdown with a visible label (e.g. "Sort by") so users understand what the menu controls.

## Key Business & UX Benefits

- One menu handles sort, filter, account actions, and contextual menus, so the storefront only ships one tested surface for every dropdown interaction.
- Auto-switch to bottom placement on mobile prevents the off-screen menu bug that drops mobile-tablet conversion on listing pages.
- Checkbox, radio, icon, and text item types make complex sort and filter UIs declarative, with keyboard and screen-reader support handled by the primitive.
- Type-safe item composition lets product teams add new sort options in minutes without re-implementing the menu shell.

:::tip
Pro-Tip from Larry: Pair the dropdown with a visible label so users know they're changing sort order.
:::

## Usage

:component-code{name="LDropdownMenu" story-id="ui-kit-molecules-dropdownmenu--has-indicator"}

## Feature List

::features
---
items:
  - "Four positions ('left', 'right', 'top', 'bottom') anchor the panel against the trigger"
  - "Below the `sm` breakpoint position auto-switches to `'bottom'` so the panel never clips off-screen on phones"
  - "`width` and `maxHeight` control panel size and overflow scroll for long sort or filter lists"
  - "Six item subcomponents (Headline, TextItem, CheckboxItem, IconItem, RadioGroup, RadioItem, Separator) cover text, multi-select, single-select, and grouped menus"
  - "Configurable trigger slot adapts the same menu to sort buttons, icon buttons, and user-account chrome"
  - "Keyboard navigation and screen-reader semantics ship with the primitive, no per-use wiring"
---
::

## API Reference

### LDropdownMenu

::component-meta{:name="DropdownMenu"}
::

### LDropdownMenuHeadline

::component-meta{:name="DropdownMenuHeadline"}
::

### LDropdownMenuCheckboxItem

::component-meta{:name="DropdownMenuCheckboxItem"}
::

### LDropdownMenuIconItem

::component-meta{:name="DropdownMenuIconItem"}
::

### LDropdownMenuRadioGroup

::component-meta{:name="DropdownMenuRadioGroup"}
::

### LDropdownMenuRadioItem

::component-meta{:name="DropdownMenuRadioItem"}
::

### LDropdownMenuSeparator

::component-meta{:name="DropdownMenuSeparator"}
::

### LDropdownMenuTextItem

::component-meta{:name="DropdownMenuTextItem"}
::
