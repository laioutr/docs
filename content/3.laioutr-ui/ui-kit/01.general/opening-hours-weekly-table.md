---
title: Opening Hours Weekly Table
description: Weekly opening-hours schedule rendered as a `DescriptionList`. Groups consecutive same-hours days into a single row (e.g. "Monday - Wednesday 09:00 - 18:00").
playground:
  name: OpeningHoursWeeklyTable
  base: ui-kit-molecules-openinghoursweeklytable
  defaultStory: default
  height: 460px
seo:
  title: Opening Hours Weekly Table
  description: Weekly opening-hours schedule rendered as a `DescriptionList`. Groups consecutive same-hours days into a single row.
sitemap:
  loc: /laioutr-ui/ui-kit/general/opening-hours-weekly-table
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`OpeningHoursWeeklyTable` renders an [`OpeningHours`](/frontend/api-reference/common-types/opening-hours) schedule as a [`DescriptionList`](/laioutr-ui/ui-kit/general/description-list). It groups consecutive weekdays that share the same opening windows into a single row, so a Monday-to-Friday `09:00-18:00` schedule shows as one row labeled `Monday - Friday` rather than five identical lines. Days that share the same hours but aren't consecutive (e.g. Monday and Wednesday) join with `&` into the same label (`Monday & Wednesday`).

Closed days collapse into a row whose value cell reads `Closed` (or its localized equivalent via the `openingHoursWeeklyTable.closed` i18n key). Window times go through `$timeOfDay` so wall-clock formatting respects the schedule's IANA timezone, and weekday names come from `Intl.DateTimeFormat` in the active locale.

Use this in the detail panel under an [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status) summary, or inside a location-detail layout that needs the full weekly view.

## Key Business & UX Benefits

- Grouping consecutive same-hours days into one row matches how store signage usually presents hours, so the table reads as the same information shoppers are used to seeing on the door.
- Closed days stay on the list (rather than disappearing), so shoppers can confirm at a glance that Sunday actually is closed and the data isn't simply missing.
- Wall-clock times respect the schedule's timezone, so a shopper in a different timezone sees the store's hours, not their own offset.

## Feature List

::features
---
items:
  - "Consecutive weekdays with identical windows collapse into one row labeled `Start - End` (e.g. `Monday - Friday`)"
  - "Non-consecutive days that share the same windows join with `&` (e.g. `Monday & Wednesday`)"
  - "Closed days stay visible as a row with a localized `Closed` value so the schedule never looks incomplete"
  - "Times rendered via `$timeOfDay` in the schedule's IANA timezone; weekday names via `Intl.DateTimeFormat` in the active locale"
  - "Multiple windows per day join with `, ` so split shifts (e.g. lunch closing) render cleanly"
  - "Built on `DescriptionList`, so visual treatment stays consistent with other spec-style lists"
---
::

## API Reference

::component-meta{:name="OpeningHoursWeeklyTable"}
::

## Related

- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the open/closed summary that usually appears above this table.
- [`DescriptionList`](/laioutr-ui/ui-kit/content/description-list): the underlying two-column primitive.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the table consumes.
