---
title: Badge
changelogKeys:
  - Badge
description: Small label or count for status, notifications, and categories in headers, navigation, and cards.
playground:
  name: Badge
  base: ui-kit-atoms-badge
  defaultStory: default
  height: 460px
links: []
seo:
  title: Badge
  description: Badges of different kind to be used for several purposes.
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/badge
  lastmod: 2026-08-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Badge is a compact label for status, counts, and category tags. It works as a cart count, a "new" marker, a discount indicator (via `leftIcon` plus slot text), or any other inline annotation that needs to read at a glance. Toggle `rounded` for pill versus rectangular shape depending on the surrounding chrome.

## Variants

`variant` picks the colour role:

| `variant` | Use for |
| --- | --- |
| `default` | Neutral annotation, the baseline |
| `primary` | The brand accent |
| `accent` | A secondary highlight, such as "New" |
| `positive` | Success and in-stock states |
| `pale` | A muted badge for low-emphasis metadata |
| `plain` | Text and icon only, no chip background |
| `glass-black` | Badges sitting over arbitrary media |

### Over media

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

`glass-black` is the variant for a badge placed over a photo or video, where no solid colour can be guaranteed legible against the pixels behind it. It draws a translucent dark chip with a backdrop blur, so the text keeps its contrast whatever the media does underneath.

::component-code
---
:name: LBadge
story-height: 100px
story-id: ui-kit-atoms-badge--glass-black
---
```vue-template
<LBadge rounded variant="glass-black">Limited</LBadge>
```
::

It is what [`MediaFeed`](/laioutr-ui/publishers/media-feed) renders its item badges as, for exactly that reason.

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
  - "Seven `variant` values ('default', 'primary', 'accent', 'positive', 'pale', 'plain', 'glass-black') drive separate text and icon color tokens per role"
  - "`glass-black` stays legible over arbitrary media with a translucent chip and a backdrop blur"
  - "`rounded` boolean toggles between pill and rectangular shape, so the same primitive fits header chrome and card chrome"
  - "`iconLeft` and `iconRight` props place small icons either side of the slot text, useful for status badges and discount tags"
  - "Built-in xs subline typography keeps cart counts and category tags legible at small sizes on mobile"
  - "Per-variant token bindings (`--badge-{variant}-text`, `--badge-{variant}-icon`) give themes precise color hooks"
---
::

## API Reference

::component-meta{:name="Badge"}
::
