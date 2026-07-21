---
title: Header Basic
description: Compact, slot-based header with a frosted-glass effect on scroll, sticky option, light/dark logo variants, and CTA buttons.
playground:
  name: HeaderBasic
  base: ui-sections-headerbasic
  defaultStory: sticky
  height: 460px
jiraIssueId: LUI-213
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=14605-394163&t=2VdYnJXHqVZcfASo-4
    target: _blank
seo:
  title: Header Basic
  description: Compact, slot-based header with glass effect on scroll, sticky option, and light/dark logo variants.
sitemap:
  loc: /laioutr-ui/navigation/header-basic
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/basicheader
---

## Overview

`HeaderBasic` is the compact navigation header for landing pages and simpler sites. It accepts paired logo assets (`logoLight` and `logoDark`) and swaps between them based on the active color mode and the `textColor` prop, so the wordmark stays legible against both dark hero imagery and a light page background.

Visual options:

- `background`: `'transparent'` (default) or `'solid'` for a flat surface.
- `hasGlassEffect`: when true (default), a backdrop-blurred layer fades in on scroll, giving the on-scroll frosted-glass look.
- `sticky`: toggles between CSS `position: sticky` and `position: fixed`. There is no hide-on-scroll variant; the header stays put once scrolling starts.
- `padding`: `'none' | 's' | 'm' | 'l'` for the vertical block padding.

Action slots in the right-hand cluster:

- `ctaButtons` renders an array of `Button`s with text, variant, and link.
- `hasLanguageSwitcher` mounts `LLanguageSwitcher` bound to `currentLocale` and `availableLocales`; selecting a language emits `localeChange`.
- `hasDarkModeSwitcher` mounts `LDarkModeSwitch`.
- A mobile menu trigger emits `menuClick` for the hosting section to handle.

Composition is slot-based. `HeaderBasic` exposes `desktop` and `mobile` named slots that accept any menu component (typically [`NavigationMenu`](/laioutr-ui/ui-kit/surfaces/navigation-menu) for desktop and [`MobileMenuBasic`](/laioutr-ui/navigation/mobile-menu-basic) for mobile). It does not own menu open state; it emits `menuClick` and lets the consumer coordinate the drawer.

## Key Business & UX Benefits

- Paired light/dark logo assets switch automatically with color mode and text-color context, so a single header config covers dark heroes, bright landing pages, and dark-mode sessions without per-page overrides.
- Frosted-glass-on-scroll keeps the header visible without dominating hero imagery, so landing pages feel premium and on-brand from the first paint.
- CTA buttons, language switcher, and dark-mode toggle plug in via props, so marketing can ship a fresh landing page header from config alone.
- Slot composition lets the same header back marketing sites, docs, and landing pages, so brand teams ship a consistent look across properties without forking code.

:::tip
Pro-Tip from Larry: For landing pages, fill only the `desktop` slot with a `NavigationMenu` and leave the `mobile` slot empty so the hamburger collapses cleanly.
:::

## Usage

::component-code
---
:name: LHeaderBasic
story-id: ui-sections-headerbasic--fixed
---
::

## Feature List

::features
---
items:
  - "Paired `logoLight` and `logoDark` assets swap with color mode and `textColor` so the wordmark stays legible on dark heroes and light backgrounds"
  - "`background` of `'transparent'` or `'solid'` paired with `hasGlassEffect` produces a backdrop-blurred surface that fades in on scroll"
  - "`sticky` prop toggles between CSS `position: sticky` and `position: fixed` once scrolling starts"
  - "`padding` accepts `'none' | 's' | 'm' | 'l'` for vertical block padding"
  - "Right-hand cluster slots in `ctaButtons`, `hasLanguageSwitcher`, and `hasDarkModeSwitcher` from props"
  - "`localeChange` and `menuClick` emits let the hosting section coordinate locale state and the mobile drawer"
  - "`desktop` and `mobile` named slots accept any menu component (typically `NavigationMenu` for desktop and `MobileMenuBasic` for mobile)"
---
::

## API Reference

::component-meta{:name="HeaderBasic"}
::
