---
title: Badge
description: Small label or count for status, notifications, and categories in headers, navigation, and cards.
playground:
  name: Badge
  base: ui-kit-atoms-badge
  defaultStory: default
  height: 460px
links: []
seo:
  title: Badge | Laioutr
  description: Badges of different kind to be used for several purposes.
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/badge
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Badge is a compact label for status, counts, and category tags. It works as a cart count, a "new" marker, a discount indicator (via `leftIcon` plus slot text), or any other inline annotation that needs to read at a glance. Toggle `rounded` for pill versus rectangular shape depending on the surrounding chrome.

## Key Business & UX Benefits

- One badge primitive handles cart counts, status pills, and category tags, so every small label across the app shares the same look and tone.
- The pill versus rectangular toggle adapts to surrounding chrome (header, card, nav), keeping visual hierarchy clean without bespoke variants per location.
- A clear cart count badge is a proven conversion lever; the built-in styling ensures it always reads at a glance, even at small sizes on mobile.
- Icon-plus-text composition lets teams build discount, status, or attention indicators without reaching for a second component.

## Usage

::component-code
---
:name: LBadge
:story-height: 100px
story-id: ui-kit-atoms-badge--accent
---
::

```vue-template
<LBadge rounded variant="accent">New</LBadge>
```

## Feature List

::features
---
items:
  - "Four `variant` values ('default', 'primary', 'accent', 'positive') drive separate text and icon color tokens per role"
  - "`rounded` boolean toggles between pill and rectangular shape, so the same primitive fits header chrome and card chrome"
  - "`iconLeft` and `iconRight` props place small icons either side of the slot text, useful for status badges and discount tags"
  - "Built-in xs subline typography keeps cart counts and category tags legible at small sizes on mobile"
  - "Per-variant token bindings (`--badge-{variant}-text`, `--badge-{variant}-icon`) give themes precise color hooks"
---
::

## API Reference

::component-meta{:name="Badge"}
::
