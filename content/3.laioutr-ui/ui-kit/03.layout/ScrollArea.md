---
title: Scroll Area
description: A scroll area component
playground:
  name: ScrollArea
  base: ui-kit-organisms-scrollarea
  defaultStory: default
  height: 460px
links: []
seo:
  title: Scroll Area | Laioutr
  description: A scroll area component
sitemap:
  loc: /laioutr-ui/ui-kit/layout/scrollarea
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Scroll Area wraps content in a bounded scrollable region with consistent scrollbar styling, keyboard navigation, and overflow control. Use it for sidebars, modals, navigation panels, and any fixed-height container where the inner content can exceed the visible space.

## Key Business & UX Benefits

- Custom scrollbar styling replaces the inconsistent native scrollbar look across browsers, keeping mini-carts and filter panels on-brand.
- Keyboard navigation comes built in, so filter dialogs and mega-menus stay accessible without per-instance keyboard handlers.
- Bounded scrolling inside modals and sidebars prevents the body-scroll bug that disorients users when they try to close a panel.

:::tip
Pro-Tip from Larry: Set a `max-height` rather than a fixed `height` so the area only scrolls when it actually overflows. A fixed height shows a scrollbar even when content fits.
:::

## Feature List

::features
---
items:
  - "Four `type` modes ('auto', 'scroll', 'hover', 'always', default 'hover') control when the custom scrollbar is visible"
  - "Both axes covered: separate vertical and horizontal `ScrollAreaScrollbar` instances with `data-orientation` styling hooks"
  - "Built on reka-ui's `ScrollAreaRoot`, so keyboard navigation and ARIA semantics ship without per-use wiring"
  - "Themable thumb (`.scroll-area__scrollbar-thumb`) with a 4px `--scrollbar-size` default that consumers can override per surface"
  - "Bounded scrolling inside modals and sidebars prevents the body-scroll bug when users try to close a panel"
---
::

## API Reference

::component-meta{:name="ScrollArea"}
::
