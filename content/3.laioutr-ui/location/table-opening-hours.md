---
title: Table Opening Hours
description: Weekly opening-hours schedule rendered as a `BasicTable`. Groups consecutive same-hours days into a single row (e.g. "Monday - Wednesday 09:00 - 18:00").
changelogKeys:
  - TableOpeningHours
playground:
  name: TableOpeningHours
  base: ui-blocks-tableopeninghours
  defaultStory: default
  height: 460px
seo:
  title: Table Opening Hours | Laioutr
  description: Weekly opening-hours schedule rendered as a `BasicTable`. Groups consecutive same-hours days into a single row.
sitemap:
  loc: /laioutr-ui/location/table-opening-hours
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/general/opening-hours-weekly-table
---

## Overview

`TableOpeningHours` renders an [`OpeningHours`](/frontend/api-reference/common-types/opening-hours) schedule as a [`BasicTable`](/laioutr-ui/ui-kit/content/basic-table). It groups consecutive weekdays that share the same opening windows into a single row, so a Monday-to-Friday `09:00-18:00` schedule shows as one row labeled `Monday - Friday` rather than five identical lines. Days that share the same hours but aren't consecutive (e.g. Monday and Wednesday) join with `&` into the same label (`Monday & Wednesday`).

Closed days collapse into a row whose value cell reads `Closed` (or its localized equivalent via the `openingHoursWeeklyTable.closed` i18n key). Window times go through `$timeOfDay` so wall-clock formatting respects the schedule's IANA timezone, and weekday names come from `Intl.DateTimeFormat` in the active locale.

The `variant` prop (`outlined` default, or `plain`) is forwarded to the underlying `BasicTable`. Use this in the detail panel under an [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status) summary, or inside a location-detail layout that needs the full weekly view.

> **Moved in 2.5.0.** `TableOpeningHours` was previously `OpeningHoursWeeklyTable` in `ui-kit`. It now lives in `@laioutr-core/ui` (built on the `BasicTable` primitive) and gains the `variant` prop. Repoint imports to `#ui/components/TableOpeningHours/TableOpeningHours.vue`.

## Key Business & UX Benefits

- Grouping consecutive same-hours days into one row matches how store signage usually presents hours, so the table reads as the same information shoppers are used to seeing on the door.
- Closed days stay on the list (rather than disappearing), so shoppers can confirm at a glance that Sunday actually is closed and the data isn't simply missing.
- Wall-clock times respect the schedule's timezone, so a shopper in a different timezone sees the store's hours, not their own offset.

## Usage

::component-code{:name="LTableOpeningHours" story-id="ui-blocks-tableopeninghours--default"}
::

## Feature List

::features
---
items:
  - "Consecutive weekdays with identical windows collapse into one row labeled `Start - End` (e.g. `Monday - Friday`)"
  - "Non-consecutive days that share the same windows join with `&` (e.g. `Monday & Wednesday`)"
  - "Closed days stay visible as a row with a localized `Closed` value so the schedule never looks incomplete"
  - "Times rendered via `$timeOfDay` in the schedule's IANA timezone; weekday names via `Intl.DateTimeFormat` in the active locale"
  - "Multiple windows per day join with `, ` so split shifts (e.g. lunch closing) render cleanly"
  - "`outlined` / `plain` variant forwarded to the underlying `BasicTable`"
---
::

## API Reference

::component-meta{:name="TableOpeningHours"}
::

## Related

- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the open/closed summary that usually appears above this table.
- [`BasicTable`](/laioutr-ui/ui-kit/content/basic-table): the underlying two-column primitive.
- [`TableProductSpecifications`](/laioutr-ui/shop/product-detail/product-specifications): the sibling table for product specification rows.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the table consumes.
