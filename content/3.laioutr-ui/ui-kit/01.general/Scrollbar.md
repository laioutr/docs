---
title: Scrollbar
description: Proportional scrollbar indicator showing content visibility and scroll position, with optional Swiper integration.
jiraIssueId: LUI-39
seo:
  title: Scrollbar | Laioutr
  description: Proportional scrollbar indicator showing content visibility and scroll position, with optional Swiper integration.
sitemap:
  loc: /laioutr-ui/ui-kit/general/scrollbar
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Scrollbar is a presentational scrollbar primitive: the parent computes `thumbSize` and `thumbPosition` (both in pixels) and passes them in, and the component renders the track plus a translated thumb. Drag and track-click interactions surface as `drag-start` and `track-click` events for the parent to translate back into scroll updates.

Use it as a styled indicator for native overflow scrolling, custom carousels, or Swiper integrations. The component is surface-tone aware so the track and thumb stay legible on light, dark, and bright surfaces.

## Key Business & UX Benefits

- A custom scrollbar signals "there is more to see" on touch carousels, lifting engagement with off-screen products on listing rows.
- Drag-to-scroll gives desktop shoppers a fast way through long product rows without hunting for next-slide arrows.
- One styled scrollbar across native overflow and Swiper carousels keeps the brand look consistent regardless of the underlying scroll source.

:::tip
Pro-Tip from Larry: Use the scrollbar with Swiper so users see scroll progress and can drag to scroll.
:::

## Usage

### Horizontal

::component-code
---
:name: LScrollbar
:story-height: 75px
story-id: ui-kit-atoms-scrollbar--on-bright-horizontal
title: Scrollbar Horizontal
---
```vue-template
<LScrollbar />
```
::

### Vertical

::component-code
---
:name: LScrollbar
:story-height: 500px
story-id: ui-kit-atoms-scrollbar--on-dark-vertical
title: Scrollbar Vertical
---
```vue-template
<LScrollbar />
```
::

## Feature List

::features
---
items:
  - "`orientation` of `'horizontal'` (default) or `'vertical'` covers carousel rows and tall content panels from one component"
  - "Required `thumbSize` and `thumbPosition` props let the parent drive geometry directly, keeping the component purely presentational"
  - "Thumb position updates via CSS `transform: translateX/Y(...)`, keeping scroll smooth without layout thrash"
  - "`drag-start` and `track-click` events surface user input so the parent owns scroll state and momentum"
  - "`aria-orientation` and `aria-controls` emitted when `forId` is set, so the scrollbar pairs accessibly with the content it drives"
  - "Surface-tone aware (`scrollbar--{tone}`), so the indicator stays legible on light, dark, and bright sections"
---
::

## API Reference

::component-meta{:name="Scrollbar"}
::
