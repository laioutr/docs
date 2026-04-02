---
title: Top Bar
description: Optional top bar above header with locale switching and dark mode toggle.
jiraIssueId: LUI-60
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13096-120401&t=mlUfKppRhGmTxkMG-4
    target: _blank
seo:
  title: Top Bar | Laioutr
  description: Optional top bar above header with locale switching and dark mode toggle.
---

## Overview

The TopBar component provides international shoppers with quick access to essential site-wide controls above the main header. It enables locale switching with currency and language updates, plus dark mode toggling with persistent preferences. Two visual styles (default and black) accommodate different header designs. On mobile devices, these functions relocate to the off-canvas menu for a compact mobile header. Optional for single-locale stores.

## Key Business & UX Benefits

- Locale and dark mode in one bar keep the main header focused on nav and search.
- Persisted preferences keep language and theme across sessions.
- Optional info links support store locator, contact, or help.
- Mobile relocation to off-canvas keeps the header clean on small screens.

:::tip
Pro-Tip from Larry: Use Top Bar for locale and dark mode so the main header stays focused on navigation.
:::

## Usage

::component-code
---
name: LuiTopBar
story-id: molecules-topbar--dark
---
::

## Feature List

::features
---
items:
  - "Language/locale selector with cookie persistence"
  - "Dark mode toggle with saved preference"
  - "Up to 3 configurable informational links per locale"
  - "Desktop-only with mobile functions in off-canvas menu"
---
::

## API Reference

::component-meta{:name="TopBar"}
::
