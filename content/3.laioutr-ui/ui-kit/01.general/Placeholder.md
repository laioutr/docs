---
title: Placeholder
aliases: []
description: A placeholder component
seo:
  title: Placeholder | Laioutr
  description: A placeholder component
sitemap:
  loc: /laioutr-ui/ui-kit/general/placeholder
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1
  videos: []
  images: []
links: []
---

## Overview

Placeholder is a development-time stand-in for missing or in-progress content: a dashed purple border with a centered refresh emoji. Drop it in to mark a slot that needs real content before ship, or to make missing-content states visually obvious during review. It is not a production skeleton, just a debug marker. Sizing is owned by the consumer via CSS.

## Key Business & UX Benefits

- A dashed-purple, refresh-emoji marker is visually loud enough that nobody ships an empty layout slot by accident.
- Zero props and CSS-driven sizing mean designers and developers can drop the marker into any grid, card, or column without scaffolding.
- The marker reads the same on light and dark backgrounds, so it stays obvious during reviews regardless of theme.

::tip
Pro-Tip from Larry: Reach for `LPlaceholder` to mark a slot that still needs real content before ship; it is a debug marker, not a production skeleton.
::

## Usage

Use css for sizing the placeholder.

::component-code
---
:name: LPlaceholder
story-height: 110px
story-id: ui-kit-atoms-placeholder--default
---
```vue-template
<LPlaceholder class="w-100px h-100px" />
```
::

## Feature List

::features
---
items:
  - "Zero props: sizing is owned by the consumer via CSS, so the same marker
    fits any grid, card, or column"
  - Fills 100% of its container by default, so it slots into flex and grid cells
    without dimension props
  - Dashed border (`--laioutr-purple-10`) and centered refresh-emoji icon make
    missing-content slots visually loud during development
  - "Dev-time debug marker, not a production skeleton: ship real content before
    release"
  - "`placeholder` and `placeholder__icon` BEM classes give consumers hooks to
    restyle the marker if the default purple clashes"
---
::

## API Reference

::component-meta{:name="Placeholder"}
::
