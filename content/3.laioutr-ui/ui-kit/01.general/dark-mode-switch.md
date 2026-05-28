---
title: Dark Mode Switch
description: Light / dark theme toggle for the top bar or header. Persists the preference.
playground:
  name: DarkModeSwitch
  base: ui-kit-molecules-darkmodeswitch
  defaultStory: default
  height: 460px
seo:
  title: Dark Mode Switch | Laioutr
  description: Light / dark theme toggle for the top bar or header.
sitemap:
  loc: /laioutr-ui/ui-kit/general/dark-mode-switch
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/colormodeswitch
---

## Overview

`DarkModeSwitch` toggles the user between light and dark theme. It fits the header or top bar, persists the preference across navigation and return visits, and renders compactly enough to sit next to other utility controls.

The toggle is always rendered on neutral chrome, so `surfaceTone` accepts `'light'` or `'dark'` (no `'bright'`).

## Key Business & UX Benefits

- Persists the user's theme preference across visits, removing a tiny friction point that often becomes a top accessibility complaint.
- Built-in compact form factor fits any header layout, so adding dark mode is a one-line drop-in rather than a layout project.
- Reduces eye strain for shoppers browsing late at night, which correlates with longer session times on content-heavy stores.

:::tip
Pro-Tip from Larry: Place `DarkModeSwitch` in the `TopBar` next to `LanguageSwitcher` so utility controls cluster together.
:::

## Usage

:component-code{name="LDarkModeSwitch" story-id="ui-kit-molecules-darkmodeswitch--default"}

## Feature List

::features
---
items:
  - "Reads and writes through `useColorMode().preference`, so the choice persists across navigation and return visits"
  - "`surfaceTone` accepts only `'light'` or `'dark'` (no `'bright'`) since the toggle always sits on neutral chrome"
  - "BEM modifier class (`dark-mode-switch--{tone}`) applied when an explicit surface tone is set, for per-instance overrides"
  - "Compact form factor fits header and top-bar slots next to other utility controls without layout changes"
  - "One-component drop-in: no separate state, store, or wiring needed beyond Nuxt's color-mode module"
---
::

## API Reference

::component-meta{:name="DarkModeSwitch"}
::
