---
title: Opening Status Indicator
description: The open/closed pill atom on its own. Reads the shared `useNow()` clock and an `OpeningHours` value to color the label green or red.
playground:
  name: OpeningStatusIndicator
  base: ui-kit-atoms-openingstatusindicator
  defaultStory: open-now
  height: 200px
seo:
  title: Opening Status Indicator | Laioutr
  description: The open/closed pill atom on its own. Reads the shared `useNow()` clock and an `OpeningHours` value to color the label green or red.
sitemap:
  loc: /laioutr-ui/ui-kit/general/opening-status-indicator
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`OpeningStatusIndicator` is the open/closed atom. It takes an [`OpeningHours`](/frontend/api-reference/common-types/opening-hours) value and renders a small bold label colored by the `--success-11` token when open or `--red-11` when closed. The label text comes from the `openingStatus.open` and `openingStatus.closed` i18n keys.

The component subscribes to the shared `useNow()` clock under the hood, so the label flips automatically when the next state-change time passes. Pass `now` to override the clock for tests and Storybook.

Use it on its own when only the open/closed state matters (a row of store badges on a category page, an inline indicator next to a header logo). Reach for [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status) when you also want the next state-change one-liner.

## Key Business & UX Benefits

- Token-driven success and red colors keep "open" and "closed" semantically consistent across light, dark, and brand themes.
- One atom shared across location-card lists, store badges, and headers stops each surface from drawing its own pill with slightly different colors.
- Reactive against the shared clock, so a store list rendered before opening time flips to "Open" the second the schedule says so, without a page refresh.

## Feature List

::features
---
items:
  - "Open vs. closed driven entirely by the `OpeningHours` value and the shared `useNow()` clock"
  - "Token-driven colors (`--success-11` open, `--red-11` closed) stay semantic across themes"
  - "Text comes from the `openingStatus.open` and `openingStatus.closed` i18n keys, so localization works without per-instance overrides"
  - "Respects the schedule's IANA timezone, so wall-clock comparisons stay correct across shopper locales"
  - "Optional `now` prop overrides the clock for tests and Storybook"
---
::

## API Reference

::component-meta{:name="OpeningStatusIndicator"}
::

## Related

- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the indicator paired with the next state-change one-liner.
- [`OpeningStatusDetail`](/laioutr-ui/ui-kit/general/opening-status-detail): the detail one-liner on its own.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the component consumes.
