---
title: Editorial Grid
description: Editorial-style grid of cards with optional featured-card emphasis, driven by a cards array.
playground:
  name: EditorialGrid
  base: ui-sections-editorialgrid
  defaultStory: default
  height: 460px
seo:
  title: Editorial Grid
  description: Editorial-style grid of cards with featured emphasis.
sitemap:
  loc: /laioutr-ui/cms/editorial-grid
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`EditorialGrid` is the magazine-style grid for marketing collections, content rows, and curated lookbooks. Cards are passed via the `cards` prop as an array of `CardProps`; the first N cards (controlled by `featuredCount`, default 2) render as a featured row, and the rest fill a secondary grid below.

An optional grid-level header (`caption`, `heading`, `subline`) sits above the rows for editorial context. Card content itself is driven by the data in each `CardProps` entry.

## Key Business & UX Benefits

- The magazine-style grid signals editorial quality, lifting perceived brand value on lookbooks and curated collections.
- `featuredCount` gives editors a built-in spotlight for hero stories, so the top picks always get the visual weight they need.
- A single `cards` array drives the whole layout, so editors stage rotations in Studio without authoring per-card markup.
- The grid-level header pairs a caption, heading, and subline with the row layout, providing editorial context without a separate section.

## Feature List

::features
---
items:
  - "Cards driven by a flat cards array (CardProps[]) rather than child markup"
  - "featuredCount splits the array into a featured first row plus a secondary row"
  - "Optional caption, heading, and subline render as a grid-level header above the rows"
  - "Magazine-style grid signals editorial quality on lookbooks and curated collections"
  - "Editors curate the cards array in Studio while the responsive layout handles breakpoints automatically"
---
::

## API Reference

::component-meta{:name="EditorialGrid"}
::
