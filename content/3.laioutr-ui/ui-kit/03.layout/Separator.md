---
title: Separator
description: Visually divides content sections, so that a clear visual hierarchy is generated and improves content readability.
seo:
  title: Separator | Laioutr
  description: Visually divides content sections, so that a clear visual hierarchy is generated and improves content readability.
sitemap:
  loc: /laioutr-ui/ui-kit/layout/separator
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Separator component draws a horizontal or vertical line between content sections to create clear visual hierarchy and improve readability.

## Key Business & UX Benefits

- Divides sections clearly so users can scan and find content faster.
- Keeps spacing and alignment consistent without custom borders.
- Supports horizontal and vertical orientation for lists and sidebars.
- Uses theme styling so separators match the rest of the UI.

:::tip
Pro-Tip from Larry: Use horizontal separators between sections and vertical ones in tight lists or sidebars.
:::

## Usage

::component-code
---
:name: Separator Horizontal
story-height: 75px
story-id: ui-kit-separator--horizontal-separator
---
```vue-template
<Separator />
```
::

::component-code
---
:name: Separator Vertical
story-height: 75px
story-id: ui-kit-separator--vertical-separator
---
```vue-template
<Separator orientation="vertical" />
```
::

## Feature List

::features
---
items:
  - "Horizontal and vertical orientation"
  - "Theme-aligned color and thickness"
  - "Accessible with decorative role when non-interactive"
  - "Consistent spacing for section division"
---
::

## API Reference

::component-meta{:name="Separator"}
::
