---
title: Separator
description: Visually divides content sections, so that a clear visual hierarchy is generated and improves content readability.
playground:
  name: Separator
  base: ui-kit-atoms-separator
  defaultStory: horizontal-separator
  height: 460px
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

Separator draws a horizontal or vertical line between content sections to create visual hierarchy. Use a horizontal separator between content blocks, and a vertical one inside tight inline groups (utility rows, breadcrumbs, sidebars) where you need to divide items without adding margin.

## Key Business & UX Benefits

- Clear visual boundaries between sections help shoppers parse dense pages like checkout, account, and product detail at a glance.
- Vertical separators replace ad-hoc bullet characters in utility rows and breadcrumbs, keeping the chrome typography clean.
- One token-driven line color updates across the whole storefront when the brand palette changes, instead of dozens of bespoke borders.

:::tip
Pro-Tip from Larry: Don't use a separator where margin would do. They're for cases where two related sections need a visible boundary, not for every gap between blocks.
:::

## Usage

::component-code
---
:name: Separator Vertical
story-height: 75px
story-id: ui-kit-atoms-separator--vertical-separator
---
```vue-template
<Separator orientation="vertical" />
```
::

## Feature List

::features
---
items:
  - "`orientation` of `'horizontal'` (default) or `'vertical'` covers section dividers and inline utility-row dividers from one component"
  - "Emits semantic `<hr>` with `role=\"separator\"` and matching `aria-orientation`, keeping the divider announceable when relevant"
  - "BEM modifier (`separator--{orientation}`) anchors per-orientation theme overrides for length, thickness, and color"
  - "Token-driven line color updates across the storefront when brand palette tokens change, no per-divider edits"
  - "Replaces ad-hoc bullet characters in breadcrumbs and utility rows, keeping chrome typography clean"
---
::

## API Reference

::component-meta{:name="Separator"}
::
