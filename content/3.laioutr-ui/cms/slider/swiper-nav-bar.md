---
title: Swiper Nav Bar
description: Compact slider navigation strip with arrows plus bullets or numbers, surface-tone aware.
jiraIssueId: LUI-19
playground:
  name: SwiperNavBar
  base: ui-kit-molecules-swipernavbar
  defaultStory: default
  height: 460px
seo:
  title: Swiper Nav Bar | Laioutr
  description: Compact slider navigation strip with arrows, bullets or numbers.
sitemap:
  loc: /laioutr-ui/cms/slider/swiper-nav-bar
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/slider/swipernavigationcompact
---

## Overview

`SwiperNavBar` is the compact navigation strip that pairs with sliders. It combines arrow controls with either bullet indicators (`navigationStyle="bullets"`) or a numeric position display (`navigationStyle="numbers"`), and adapts its tone to the parent surface via `useSurfaceTone`.

Reach for `navigationStyle="numbers"` on multi-step flows where slide count carries meaning; default to bullets for purely visual sliders. Arrow visibility can be configured per viewport.

## Key Business & UX Benefits

- A compact nav strip preserves valuable above-the-fold space while still giving shoppers clear control over slider position.
- Switching between bullets and numbers matches the navigation to the content type, raising clarity on multi-step flows and tutorial sliders.
- Per-viewport arrow visibility tunes the touch experience on mobile against the precision experience on desktop.
- Surface-tone awareness keeps controls legible on any slider background, removing the contrast bugs that disable navigation.

:::tip
Pro-Tip from Larry: Use `navigationStyle="numbers"` on multi-step flows where slide count carries meaning; default to bullets for purely visual sliders.
:::

## Feature List

::features
---
items:
  - "Compact strip pairs arrow controls with bullets (navigationStyle='bullets') or a numeric position display (navigationStyle='numbers')"
  - "Per-viewport arrow visibility tunes touch on mobile against precision on desktop"
  - "Adapts tone to the parent surface via useSurfaceTone for any slider backdrop"
  - "Numbers style suits multi-step flows where slide count carries meaning; bullets fit purely visual sliders"
  - "Preserves above-the-fold space while still giving shoppers clear control over slider position"
---
::

## API Reference

::component-meta{:name="SwiperNavBar"}
::
