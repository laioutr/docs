---
title: Language Switcher
description: Locale (and optionally currency/region) switcher for the top bar or header. Persists the selection.
playground:
  name: LanguageSwitcher
  base: ui-kit-molecules-languageswitcher
  defaultStory: default
  height: 460px
seo:
  title: Language Switcher | Laioutr
  description: Locale switcher for the top bar or header.
sitemap:
  loc: /laioutr-ui/ui-kit/general/language-switcher
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/localeselect
---

## Overview

`LanguageSwitcher` lets shoppers switch the active locale. Pass `availableLocales` (an array of `AvailableLocale`) and `currentLocale`, then listen for the `change` event with the picked locale id. The component renders nothing when fewer than two locales are available, so it can sit unconditionally in chrome. It accepts a `surfaceTone` of `'light'` or `'dark'`, since chrome and navigation live on neutral surfaces by design.

## Key Business & UX Benefits

- Lets international shoppers switch locale from any page, lifting conversion in cross-border markets.
- The prop-plus-emit contract keeps locale state in the consumer, so the component drops cleanly into apps that already manage market data themselves.
- Returning the trigger as a no-op when fewer than two locales are available means consumers can place it unconditionally in chrome.

:::tip
Pro-Tip from Larry: Place `LanguageSwitcher` in the `TopBar` so users can change language without digging into the menu.
:::

## Feature List

::features
---
items:
  - "`availableLocales` prop accepts a typed `AvailableLocale[]`; the component renders nothing when fewer than two locales are passed"
  - "`change` event emits the picked locale id, leaving navigation, persistence, and refresh wiring in the consumer"
  - "`surfaceTone` accepts only `'light'` or `'dark'` (no `'bright'`), matching the neutral chrome the switcher is designed for"
  - "Optional `side` ('bottom' default, 'top'), `fontSize`, `iconSize`, and `inTopbar` props tune the trigger and dropdown placement"
  - "Paired `LanguageSwitcherDisplay` subcomponent renders the trigger so the switcher composes inside menus or top bars"
---
::

### LLanguageSwitcher

::component-meta{:name="LanguageSwitcher"}
::

### LLanguageSwitcherDisplay

::component-meta{:name="LanguageSwitcherDisplay"}
::
