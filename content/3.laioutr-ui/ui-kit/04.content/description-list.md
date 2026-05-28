---
title: Description List
description: Two-column label/value list built on CSS Grid subgrid. Pairs a `DescriptionList` parent with `DescriptionListItem` rows for opening hours, spec sheets, and key/value summaries.
playground:
  name: DescriptionList
  base: ui-kit-molecules-descriptionlist
  defaultStory: outlined
  height: 460px
seo:
  title: Description List | Laioutr
  description: Two-column label/value list built on CSS Grid subgrid. Pairs a `DescriptionList` parent with `DescriptionListItem` rows for opening hours, spec sheets, and key/value summaries.
sitemap:
  loc: /laioutr-ui/ui-kit/content/description-list
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/general/description-list
---

## Overview

`DescriptionList` is a two-column key/value list. The parent is a CSS Grid with `auto 1fr` columns, and each `DescriptionListItem` row uses `grid-template-columns: subgrid` so labels align across rows even when their widths vary. The `variant` prop picks between two visual treatments: `outlined` (the default) wraps the list in a bordered box with dividers between rows, while `plain` drops the chrome and keeps consistent row spacing.

Each item exposes a `label` prop for the text-only case and a `#label` slot for the rich case (icons, badges). The default slot is the value cell.

[`OpeningHoursWeeklyTable`](/laioutr-ui/ui-kit/general/opening-hours-weekly-table) uses this primitive to render its weekly schedule.

## Key Business & UX Benefits

- Subgrid column alignment keeps labels lined up even when one row has a long label and the next has a short one, so the list reads as a single scannable column.
- Two variants cover the two common contexts: a bordered list for spec-style content (opening hours, product attributes) and a plain list for inline detail panels.
- Slot-based item content means rows can carry icons, badges, or formatted values without a fork of the component.

## Usage

::component-code{:name="LDescriptionList" story-id="ui-kit-molecules-descriptionlist--outlined"}
::

## Feature List

::features
---
items:
  - "Two variants (`outlined`, `plain`) cover bordered spec lists and plain inline detail panels"
  - "CSS Grid subgrid keeps labels aligned across rows even when widths vary"
  - "`label` prop for text rows; `#label` slot for icons, badges, or rich label content"
  - "Default slot is the value cell, so rows can render formatted prices, dates, or pill clusters"
  - "Used by `OpeningHoursWeeklyTable` to render weekly schedules with grouped consecutive days"
---
::

## API Reference

### DescriptionList

::component-meta{:name="DescriptionList"}
::

### DescriptionListItem

::component-meta{:name="DescriptionListItem"}
::

## Related

- [`OpeningHoursWeeklyTable`](/laioutr-ui/ui-kit/general/opening-hours-weekly-table): renders a weekly schedule with consecutive same-hours days grouped into a single row.
