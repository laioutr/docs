---
title: Scrollbar
description: Visual progress indicator for sliders showing content visibility and scroll position with Swiper integration.
jiraIssueId: LUI-39
---

## Overview

Split into Atom (rendering) and Molecule (Swiper integration) components for reusability. Bar width calculated proportionally based on visible items versus total items. Uses CSS transforms for smooth, performant position updates. Emits onChange event for external scroll control.

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

## Features

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
