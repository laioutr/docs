---
title: Content Grid
description: Generic responsive grid for cards, tiles, and other slotted content.
seo:
  title: Content Grid | Laioutr
  description: Generic responsive grid for cards, tiles, and other slotted content.
sitemap:
  loc: /laioutr-ui/cms/content-grid
  lastmod: 2026-05-19
  changefreq: monthly
  priority: 1.0
---

## Overview

`ContentGrid` is a generic responsive grid that lays out any slotted children uniformly. Pass cards, tiles, or arbitrary content through the default slot. The grid handles breakpoints, columns, and gaps; the data source is the caller's responsibility.

## Key Business & UX Benefits

- A single responsive grid covers card collections, feature rows, and blog excerpt strips, so teams stop forking grid components per use case.
- Responsive defaults keep cards aligned on every viewport, removing the broken-grid look that erodes trust on small screens.
- A grid that takes any slot content means the same primitive backs hand-curated rows and query-driven rows without per-use-case logic baked into the grid itself.

## Usage

::component-code
---
:name: LContentGrid
:story-height: 400px
story-id: ui-sections-contentgrid--default
title: ContentGrid Default
---
```vue-template
<ContentGrid>
    <Card v-for="card in cards" :key="card.id" v-bind="card" />
  </ContentGrid>
```
::

## Feature List

::features
---
items:
  - "Generic responsive grid hosts any slotted children: cards, tiles, or arbitrary content, without per-use-case forks"
  - "Responsive defaults keep cards aligned on every viewport, avoiding the broken-grid look on small screens"
  - "Same grid covers card collections, feature rows, and blog excerpt strips from one configuration"
---
::

## API Reference

::component-meta{:name="ContentGrid"}
::
