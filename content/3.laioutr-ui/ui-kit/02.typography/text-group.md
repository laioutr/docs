---
title: Text Group
description: Caption, heading, and subline composition with configurable semantic tags, size tiers, alignment, and optional icon.
playground:
  name: TextGroup
  base: ui-kit-molecules-textgroup
  defaultStory: default
  height: 460px
seo:
  title: Text Group | Laioutr
  description: Caption, heading, and subline composition.
sitemap:
  loc: /laioutr-ui/ui-kit/typography/text-group
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`TextGroup` pairs a caption, heading, and subline into the typographic shape used inside hero banners, page heroes, section headers, and content cards. Semantic tags for each line are configurable via `captionTag`, `headingTag`, and `sublineTag` so the same visual composition can render as `<h1>`-led on a page hero and `<h3>`-led inside a card without rewriting markup.

For one-off campaign treatments, the `captionColor`, `headingColor`, `sublineColor`, and `iconColor` props accept any CSS color string and inline it onto the matching element, so a single hero can repaint a heading or caption without touching tokens.

## Key Business & UX Benefits

- One composition covers hero, page header, section header, and card text, so editorial hierarchy stays consistent without bespoke layout per surface.
- Configurable semantic tags keep the SEO outline correct: hero stays `<h1>`-led, cards stay `<h3>`-led, without rewriting visual markup.
- Per-line color override props give marketing a precise repaint hook for seasonal banners without touching theme tokens.

## Feature List

::features
---
items:
  - "Three configurable semantic tags (`captionTag`, `headingTag`, `sublineTag`) keep the SEO outline correct as the same composition moves between hero and card"
  - "Global `size` tier maps to canonical per-element Text sizes; per-line overrides (`captionSize`, `headingSize`, `sublineSize`) fine-tune density"
  - "`align` controls horizontal alignment of all three lines together, so left-rail and centered hero patterns share one prop"
  - "Optional `icon` plus `iconSize` and `iconColor` overrides render an icon above the caption for status-led intros"
  - "Freeform `captionColor`, `headingColor`, and `sublineColor` props accept any CSS color string and inline it per line for one-off campaign treatments"
  - "`gap` prop ('xs', 's', 'sm', 'm', 'l') tunes vertical rhythm between the caption, heading, and subline"
---
::

## API Reference

::component-meta{:name="TextGroup"}
::
