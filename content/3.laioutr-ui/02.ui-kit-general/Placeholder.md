---
title: Placeholder
description: A placeholder component
links: []
---

## Overview

The Placeholder component reserves space in the layout while content is loading or missing. Sizing is controlled via CSS so it fits grids, cards, or custom layouts without extra markup.

## Key Business & UX Benefits

- Reduces layout shift by reserving space before content loads.
- Keeps grids and lists aligned while images or data load.
- Gives designers a simple block to size and style with CSS.
- Works as a fallback when content is missing or failed to load.

:::tip
Pro-Tip from Larry: Match placeholder size to the final content so the layout does not jump when it loads.
:::

## Usage

Use css for sizing the placeholder.

::component-code
---
:name: Placeholder
story-height: 110px
story-id: ui-kit-placeholder--default
---
```vue-template
<Placeholder class="w-100px h-100px" />
```
::

## Feature List

::features
---
items:
  - "CSS-controlled sizing for flexible layouts"
  - "Reserves space to prevent layout shift"
  - "Theme-aligned background and styling"
  - "Suitable for images, cards, or custom blocks"
---
::

## API Reference

::component-meta{:name="Placeholder"}
::
