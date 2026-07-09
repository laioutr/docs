---
title: Opening Status Detail
description: One-line "closes at HH:mm" or "opens on Monday at HH:mm" detail atom for opening-hours surfaces. Picks the right message from the next state-change event.
playground:
  name: OpeningStatusDetail
  base: ui-kit-atoms-openingstatusdetail
  defaultStory: opens-today
  height: 200px
seo:
  title: Opening Status Detail
  description: One-line "closes at HH:mm" or "opens on Monday at HH:mm" detail atom for opening-hours surfaces. Picks the right message from the next state-change event.
sitemap:
  loc: /laioutr-ui/ui-kit/general/opening-status-detail
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`OpeningStatusDetail` is the next-event one-liner. It takes an [`OpeningHours`](/frontend/api-reference/common-types/opening-hours) value, reads the next state-change event from `useOpeningStatus`, and renders the matching localized message:

- When open: `Closes at 18:00`.
- When closed today and opening later the same day: `Opens today at 14:00`.
- When closed and opening the next calendar day: `Opens tomorrow at 09:00`.
- When closed and opening within the next week: `Opens Monday at 09:00`.
- When closed and the next opening is more than a week out: `Opens on May 20 at 10:00`.
- When the schedule is empty and the location is currently closed: a neutral `Currently closed` fallback.
- When 24/7 open or the schedule has no upcoming event in the next 30 days: nothing renders.

Times come from the `$timeOfDay` formatter and respect the schedule's IANA timezone. Weekday and date formatting use the active locale via `Intl.DateTimeFormat`.

## Key Business & UX Benefits

- Picking the right phrasing for each event kind (today, tomorrow, this week, future date) avoids the awkward "Opens in 14 days" that pure-relative renderers produce for far-future openings.
- A neutral `Currently closed` fallback for empty schedules keeps the surface from going blank when a location has no opening hours configured yet.
- Times respect the schedule's IANA timezone, so a London shopper looking at a Paris store sees Paris's wall-clock times without manual conversion.

## Feature List

::features
---
items:
  - "Picks one of five message kinds (closes-at, opens-today, opens-tomorrow, opens-on-weekday, opens-on-date) from the next state-change event"
  - "Empty-schedule fallback to `openingStatus.currentlyClosed` keeps the surface filled when a location has no hours configured"
  - "Times formatted via `$timeOfDay` in the schedule's IANA timezone; weekday and date formatted via `Intl.DateTimeFormat` in the active locale"
  - "Reactive against the shared `useNow()` clock so the message updates when the next state-change time passes"
  - "Optional `now` prop overrides the clock for tests and Storybook"
---
::

## API Reference

::component-meta{:name="OpeningStatusDetail"}
::

## Related

- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the indicator paired with this detail one-liner.
- [`OpeningStatusIndicator`](/laioutr-ui/ui-kit/general/opening-status-indicator): the open/closed pill on its own.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the component consumes.
