---
title: Locale Select
description: A language switcher component
---

## Overview

The Locale Select component lets users switch language (and optionally currency or region). It fits in the top bar or header and persists the choice so the site stays in the selected locale.

## Key Business & UX Benefits

- Supports international stores with one language/region switcher.
- Persisted preference keeps the choice across navigation and return visits.
- Compact dropdown fits top bar and header without crowding.
- Accessible with keyboard and screen reader support.

:::tip
Pro-Tip from Larry: Place Locale Select in the top bar so users can change language without digging into menus.
:::

## Usage

::component-code
---
:name: LuiLanguageSwitcher
story-id: molecules-languageswitcher--dark-story
---
::

## Feature List

::features
---
items:
  - "Language and optional currency/region switching"
  - "Persisted preference (e.g. cookie or localStorage)"
  - "Dropdown or list display for locale options"
  - "Accessible keyboard and focus support"
---
::

## API Reference

::component-meta{:name="LanguageSwitcher"}
::
