---
title: Opening Status
description: Open/closed pill plus a one-line "closes at HH:mm" or "opens on Monday at HH:mm" detail. Reactive against the shared `useNow()` clock.
playground:
  name: OpeningStatus
  base: ui-kit-molecules-openingstatus
  defaultStory: open
  height: 240px
seo:
  title: Opening Status
  description: Open/closed pill plus a one-line "closes at HH:mm" or "opens on Monday at HH:mm" detail. Reactive against the shared `useNow()` clock.
sitemap:
  loc: /laioutr-ui/ui-kit/general/opening-status
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`OpeningStatus` is the combined opening-hours summary for a single location. It takes an [`OpeningHours`](/frontend/api-reference/common-types/opening-hours) value and renders an open/closed pill next to a localized one-liner that names the next state change (closing time when open, next opening when closed). Internally it composes [`OpeningStatusIndicator`](/laioutr-ui/ui-kit/general/opening-status-indicator) and [`OpeningStatusDetail`](/laioutr-ui/ui-kit/general/opening-status-detail) on a single baseline.

Both atoms read the shared `useNow()` clock, so all opening-status surfaces on the page tick together. The optional `now` prop overrides the clock for tests and Storybook.

## Key Business & UX Benefits

- Open/closed status combined with the next state-change time answers the most common shopper question on a location page without forcing a click into details.
- Reading from a shared clock means every store on a list view ticks in sync, so the page never shows one store as "Closing soon" and the next still labeled "Open" past the same minute.
- Schedule timezone is respected, so a Berlin shopper looking at a New York store sees "Closes at 18:00" in the store's wall-clock time without the timezone math leaking into the UI.

## Feature List

::features
---
items:
  - "Combines `OpeningStatusIndicator` and `OpeningStatusDetail` on a single inline baseline"
  - "Localized one-liner picks the right message (closes-at, opens-today, opens-tomorrow, opens-on-weekday, opens-on-date) from the next state-change event"
  - "Reactive against the shared `useNow()` clock so all opening-status surfaces on the page tick together"
  - "Respects the schedule's IANA timezone, so wall-clock times stay correct across shopper locales"
  - "Optional `now` prop overrides the clock for tests and Storybook"
---
::

## API Reference

::component-meta{:name="OpeningStatus"}
::

## Related

- [`OpeningStatusIndicator`](/laioutr-ui/ui-kit/general/opening-status-indicator): the open/closed pill atom on its own.
- [`OpeningStatusDetail`](/laioutr-ui/ui-kit/general/opening-status-detail): the next state-change one-liner on its own.
- [`OpeningHoursWeeklyTable`](/laioutr-ui/ui-kit/general/opening-hours-weekly-table): full weekly schedule for the detail panel under this summary.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the component consumes.
