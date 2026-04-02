---
title: Scrollbar
description: Proportional scrollbar indicator showing content visibility and scroll position, with optional Swiper integration.
jiraIssueId: LUI-39
seo:
  title: Scrollbar | Laioutr
  description: Proportional scrollbar indicator showing content visibility and scroll position, with optional Swiper integration.
---

## Overview

Split into Atom (rendering) and Molecule (Swiper integration) components for reusability. Bar width calculated proportionally based on visible items versus total items. Uses CSS transforms for smooth, performant position updates. Emits onChange event for external scroll control.

## Key Business & UX Benefits

- Shows how much content is visible and how far the user has scrolled.
- Gives a clear, familiar control for horizontal and vertical sliders.
- Keeps interaction smooth with CSS-based updates.
- Integrates with Swiper so scroll position stays in sync.

:::tip
Pro-Tip from Larry: Use the scrollbar with Swiper so users see scroll progress and can drag to scroll.
:::

## Usage

### Horizontal

::component-code
---
:name: LuiScrollbar
:story-height: 75px
story-id: ui-kit-scrollbar--on-bright-horizontal
title: Scrollbar Horizontal
---
```vue-template
<LuiScrollbar />
```
::

### Vertical

::component-code
---
:name: LuiScrollbar
:story-height: 500px
story-id: ui-kit-scrollbar--on-dark-vertical
title: Scrollbar Vertical
---
```vue-template
<LuiScrollbar />
```
::

## Feature List

::features
---
items:
  - "Horizontal and vertical orientations with light and dark color modes"
  - "Dynamic progress indicator proportional to visible content"
  - "Swiper integration via dedicated SwiperScrollbar molecule component"
  - "Accessible 24px minimum clickable touch target area"
---
::

## API Reference

::component-meta{:name="Scrollbar"}
::
