---
title: Scrollbar
description: Proportional scrollbar primitive that owns its drag and track-click interaction, driven by a progress and visible-ratio value.
playground:
  name: Scrollbar
  base: ui-kit-atoms-scrollbar
  defaultStory: default
  height: 460px
jiraIssueId: LUI-39
seo:
  title: Scrollbar
  description: Proportional scrollbar primitive that owns its drag and track-click interaction, driven by a progress and visible-ratio value.
sitemap:
  loc: /laioutr-ui/ui-kit/general/scrollbar
  lastmod: 2026-05-26
  changefreq: monthly
  priority: 1.0

---

## Overview

Scrollbar is a self-contained scrollbar primitive. You give it two normalized values — `progress` (0..1, where the thumb sits) and `visibleRatio` (0..1, the fraction of the content currently in view) — and it renders the track, sizes the thumb, and handles all pointer interaction itself. Dragging the thumb and clicking the track both surface as a single `update:progress` event carrying the new progress and whether it came from a `'drag'` or a `'click'`.

The component is decoupled from any specific scroll source: feed it values from native overflow scrolling, a virtual list, or a carousel. For Swiper carousels, use [SwiperScrollbar](/laioutr-ui/ui-kit/general/swiperscrollbar), which computes these values from Swiper state for you. Scrollbar is surface-tone aware, so the track and thumb stay legible on light, dark, and bright surfaces, and it hides itself (via `visibility`, so no layout shift) when `visibleRatio` indicates the content already fits.

## Key Business & UX Benefits

- A visible scrollbar signals "there is more to see" on touch carousels, lifting engagement with off-screen products on listing rows.
- Drag-to-scroll gives desktop shoppers a fast way through long product rows without hunting for next-slide arrows.
- One styled scrollbar across native overflow, virtual lists, and carousels keeps the brand look consistent regardless of the underlying scroll source.
- Auto-hiding without removing the element from layout means no cumulative layout shift when content grows or shrinks past the viewport.

:::tip
Pro-Tip from Larry: keep `progress` reactive to the scroll source so the thumb stays in sync, and let the `source` argument decide animation — animate on `'click'`, track 1:1 on `'drag'`.
:::

## Usage

### Default

::component-code
---
:name: LScrollbar
:story-height: 75px
story-id: ui-kit-atoms-scrollbar--default
title: Scrollbar
---
```vue-template
<LScrollbar :progress="0" :visible-ratio="0.3" />
```
::

`progress` positions the thumb; `visibleRatio` sizes it. A ratio of `0.3` means roughly a third of the content is visible, so the thumb fills about a third of the track.

### Interactive

::component-code
---
:name: LScrollbar
:story-height: 75px
story-id: ui-kit-atoms-scrollbar--interactive
title: Interactive Scrollbar
---
```vue-template
<LScrollbar
  :progress="progress"
  :visible-ratio="0.3"
  @update:progress="(value, source) => (progress = value)"
/>
```
::

Drag the thumb or click the track. The component emits `update:progress` with the new value and its `source` (`'drag'` or `'click'`); the parent writes it back to keep the thumb in sync.

### Vertical

::component-code
---
:name: LScrollbar
:story-height: 500px
story-id: ui-kit-atoms-scrollbar--dark-vertical
title: Scrollbar Vertical
---
```vue-template
<LScrollbar orientation="vertical" :progress="0" :visible-ratio="0.3" surface-tone="dark" />
```
::

### Minimum thumb size

::component-code
---
:name: LScrollbar
:story-height: 75px
story-id: ui-kit-atoms-scrollbar--min-thumb-size
title: Minimum Thumb Size
---
```vue-template
<LScrollbar :progress="0" :visible-ratio="0.02" />
```
::

When the content vastly exceeds the viewport, the thumb is clamped to a minimum grabbable size instead of shrinking to a sliver.

## Feature List

::features
---
items:
  - "`progress` (0..1) positions the thumb; `visibleRatio` (0..1) sizes it — both normalized, so the component is decoupled from the scroll source's units"
  - "Owns drag and track-click interaction internally and emits a single `update:progress` event with a `'drag'` | `'click'` source discriminator"
  - "Auto-hides via `visibility` (no layout shift) when `visibleRatio` is outside `(0, 1)` — i.e. the content already fits"
  - "Thumb clamps to a minimum size so it stays grabbable even when content far exceeds the viewport"
  - "`orientation` of `'horizontal'` (default) or `'vertical'` covers carousel rows and tall content panels"
  - "Thumb position updates via CSS `transform`, with the transition disabled mid-drag so it tracks the cursor 1:1 and animates otherwise"
  - "`aria-orientation` and `aria-controls` emitted when `forId` is set, so the scrollbar pairs accessibly with the content it drives"
  - "Surface-tone aware (`scrollbar--{tone}`), so the indicator stays legible on light, dark, and bright sections"
---
::

## When to Use

- Use Scrollbar when you have a custom scroll source (native overflow, virtual list, bespoke carousel) and can compute `progress` and `visibleRatio` from it.
- Use [SwiperScrollbar](/laioutr-ui/ui-kit/general/swiperscrollbar) instead when the scroll source is a Swiper carousel — it derives both values from Swiper for you.

## When NOT to Use

- Don't use it as a static progress meter — use [ProgressBar](/laioutr-ui/ui-kit/general/progressbar) for non-interactive progress.
- Don't reach for it when the platform scrollbar is acceptable; a custom scrollbar is an interaction surface you now own and must keep in sync.

## API Reference

::component-meta{:name="Scrollbar"}
::
