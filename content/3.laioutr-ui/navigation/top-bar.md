---
title: Top Bar
description: Desktop-only utility strip above the header with locale selector, dark-mode toggle, and information links.
playground:
  name: TopBar
  base: ui-sections-topbar
  defaultStory: default
  height: 460px
jiraIssueId: LUI-60
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13096-120401&t=mlUfKppRhGmTxkMG-4
    target: _blank
seo:
  title: Top Bar
  description: Optional top bar above the header.
sitemap:
  loc: /laioutr-ui/navigation/top-bar
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/topbar
---

## Overview

`TopBar` is an optional desktop-only utility strip that sits above the main header. It hosts an `informationLinks` array (store locator, contact, help, etc.), a `LanguageSwitcher`, and a `DarkModeSwitch`. The bar is hidden below the `lg` breakpoint (`hidden lg:flex`); place the same controls inside the off-canvas mobile menu when you need them on phones.

Pick the look with `modeColor`:

| `modeColor` | When to use                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| `'grey'`    | Subtle bar that inherits the surrounding light surface tone (the default).     |
| `'black'`   | High-contrast bar with always-dark tone for headers that ride bright heroes.   |

Toggle `showLocaleSelector` and `showDarkModeToggle` to drop either control. The component emits `localeChange` when the user picks a new locale.

## Key Business & UX Benefits

- A dedicated strip carries service links, locale, and theme, so the main header stays focused on shopping and conversion without crowding.
- Two color modes (subtle grey, high-contrast black) cover most brand needs, so the top bar fits minimal and bold visual identities without custom theming work.
- Desktop-only by design keeps mobile viewport free for shopping, where every pixel above the fold counts.
- The `localeChange` emit gives international storefronts a single entry point for switching markets, instead of wiring up locale state per route.

:::tip
Pro-Tip from Larry: Use `modeColor="grey"` for a subtle top bar that reads as utility chrome; reach for `'black'` only when the header sits over a bright hero and needs the contrast.
:::

## Usage

::component-code
---
name: LTopBar
story-id: ui-sections-topbar--dark
---
::

## Feature List

::features
---
items:
  - "Optional desktop-only utility strip that sits above the main header"
  - "Hidden below the `lg` breakpoint via `hidden lg:flex` so it never crowds mobile viewports"
  - "Hosts an `informationLinks` array for store locator, contact, help, and similar service links"
  - "`modeColor` of `'grey'` or `'black'` picks between a subtle inherited tone and a high-contrast bar over bright heroes"
  - "`showLocaleSelector` and `showDarkModeToggle` toggle either control independently"
  - "`localeChange` emit gives international storefronts a single entry point for market switching"
---
::

## API Reference

::component-meta{:name="TopBar"}
::
