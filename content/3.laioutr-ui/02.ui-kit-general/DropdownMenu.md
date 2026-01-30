---
title: Dropdown Menu
description: Reusable select dropdown component for product sorting with custom dropdown UI and active selection indicator.
jiraIssueId: LUI-81
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=606-17197&t=reqgsA9rbH2D4nWh-4
    target: _blank
---

## Overview

Acts like a native select element but uses the custom dropdown component for enhanced styling. Opens via the Sort button on filter bar. Only one option can be selected at a time with immediate product order update. Similar to Nuxt UI select component pattern. Uses LuiDropdownMenu internally.

## Key Business & UX Benefits

- Matches brand and layout with a custom-styled dropdown instead of native select.
- Makes the current sort choice obvious with a clear active indicator.
- Updates results immediately so users see the effect of their choice.
- Supports keyboard use and accessibility with standard patterns.

:::tip
Pro-Tip from Larry: Pair the dropdown with a visible label so users know they're changing sort order.
:::

## Usage

:component-code{name="DropdownMenu" story-id="ui-kit-dropdownmenu--has-indicator"}

## Feature List

::features
---
items:
  - "Single selection with visual active indicator"
  - "v-model support for two-way binding"
  - "Dropdown menu with customizable option list"
  - "Keyboard navigation with arrow keys and Enter"
---
::

## API Reference

### DropdownMenu

::component-meta{:name="DropdownMenu"}
::

### DropdownMenuHeadline

::component-meta{:name="DropdownMenuHeadline"}
::

### DropdownMenuCheckboxItem

::component-meta{:name="DropdownMenuCheckboxItem"}
::

### DropdownMenuIconItem

::component-meta{:name="DropdownMenuIconItem"}
::

### DropdownMenuRadioGroup

::component-meta{:name="DropdownMenuRadioGroup"}
::

### DropdownMenuRadioItem

::component-meta{:name="DropdownMenuRadioItem"}
::

### DropdownMenuSeparator

::component-meta{:name="DropdownMenuSeparator"}
::

### DropdownMenuTextItem

::component-meta{:name="DropdownMenuTextItem"}
::
