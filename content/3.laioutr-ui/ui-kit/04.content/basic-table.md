---
title: Basic Table
description: Two-column label/value table built on CSS Grid subgrid, rendered as a semantic description list (`<dl>`). Pairs a `BasicTable` parent with `BasicTableRow` rows for opening hours, spec sheets, and key/value summaries.
changelogKeys:
  - BasicTable
playground:
  name: BasicTable
  base: ui-kit-molecules-basictable
  defaultStory: outlined
  height: 460px
seo:
  title: Basic Table | Laioutr
  description: Two-column label/value table built on CSS Grid subgrid, rendered as a semantic description list. Pairs a `BasicTable` parent with `BasicTableRow` rows for opening hours, spec sheets, and key/value summaries.
sitemap:
  loc: /laioutr-ui/ui-kit/content/basic-table
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/content/description-list
  - /laioutr-ui/ui-kit/general/description-list
---

## Overview

`BasicTable` is a two-column key/value table. It renders as a semantic description list — a `<dl>` whose rows carry a `<dt>` label and a `<dd>` value — so label/value pairs are exposed to assistive technology rather than being presentational `<div>`s. The parent is a CSS Grid with `auto 1fr` columns, and each `BasicTableRow` uses `grid-template-columns: subgrid` so labels align across rows even when their widths vary.

The `variant` prop picks between two visual treatments: `outlined` (the default) wraps the list in a bordered box with dividers between rows, while `plain` drops the chrome and keeps consistent row spacing.

Each row exposes a `label` prop for the text-only case and a `#label` slot for the rich case (icons, badges). The default slot is the value cell.

The label column is sized to its content by default. Consumers can widen or clamp it via the public `--basic-table-label-col` custom property (e.g. a fixed track or `clamp(...)`); the value column always fills the remaining space.

[`TableOpeningHours`](/laioutr-ui/location/table-opening-hours) and [`TableProductSpecifications`](/laioutr-ui/shop/product-detail/product-specifications) use this primitive to render their rows.

> **Renamed in 2.5.0.** `BasicTable` was previously `DescriptionList`, and `BasicTableRow` was `DescriptionListItem`. Repoint imports to `#ui-kit/components/BasicTable/BasicTable.vue` and `#ui-kit/components/BasicTable/BasicTableRow.vue`. The public CSS surface (`.basic-table` root class, BEM classes) and the grid/subgrid layout are unchanged.

## Key Business & UX Benefits

- Semantic `<dl>`/`<dt>`/`<dd>` markup exposes each label/value pair to screen readers, so spec sheets and hours read as structured data rather than anonymous boxes.
- Subgrid column alignment keeps labels lined up even when one row has a long label and the next has a short one, so the list reads as a single scannable column.
- Two variants cover the two common contexts: a bordered list for spec-style content (opening hours, product attributes) and a plain list for inline detail panels.
- Slot-based row content means rows can carry icons, badges, or formatted values (prices, dates, pill clusters) without a fork of the component.

## Usage

::component-code{:name="LBasicTable" story-id="ui-kit-molecules-basictable--outlined"}
::

## Feature List

::features
---
items:
  - "Renders as a semantic description list (`<dl>` with `<dt>`/`<dd>` rows) for assistive technology"
  - "Two variants (`outlined`, `plain`) cover bordered spec lists and plain inline detail panels"
  - "CSS Grid subgrid keeps labels aligned across rows even when widths vary"
  - "Label column width is overridable via the public `--basic-table-label-col` custom property"
  - "`label` prop for text rows; `#label` slot for icons, badges, or rich label content"
  - "Default slot is the value cell, so rows can render formatted prices, dates, or pill clusters"
  - "Used by `TableOpeningHours` and `TableProductSpecifications` to render their rows"
---
::

## API Reference

### BasicTable

::component-meta{:name="BasicTable"}
::

### BasicTableRow

::component-meta{:name="BasicTableRow"}
::

## Related

- [`TableOpeningHours`](/laioutr-ui/location/table-opening-hours): renders a weekly schedule with consecutive same-hours days grouped into a single row.
- [`TableProductSpecifications`](/laioutr-ui/shop/product-detail/product-specifications): renders typed, per-locale-formatted product specification rows with optional section grouping.
