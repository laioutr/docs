---
title: Scroll Area
description: A scroll area component
links: []
---

## Overview

The Scroll Area component wraps content in a scrollable region with consistent scrollbar styling and optional overflow control. It is used for sidebars, modals, and fixed-height panels.

## Key Business & UX Benefits

- Keeps long content in a bounded area so the rest of the layout stays stable.
- Applies consistent scrollbar styling across the app.
- Works with keyboard and focus for accessible scrolling.
- Fits sidebars, modals, and panels with a fixed height.

:::tip
Pro-Tip from Larry: Use it in sidebars and modals so long content scrolls inside a clear boundary.
:::

## Usage

::component-code
---
:name: ScrollArea
story-height: 600px
story-id: ui-kit-scrollarea--default
---
::

## Feature List

::features
---
items:
  - "Scrollable region with configurable height or max-height"
  - "Consistent scrollbar styling for light and dark themes"
  - "Keyboard and focus support for accessible scrolling"
  - "Suitable for sidebars, modals, and fixed-height panels"
---
::

## API Reference

::component-meta{:name="ScrollArea"}
::
