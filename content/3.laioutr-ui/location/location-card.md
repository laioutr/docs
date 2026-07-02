---
title: Location Card
description: Card for a single store or location with two layouts. A row-style `list` card for store directories, and a square `mapPopup` card for map markers. Wires phone, navigation, and detail actions.
playground:
  name: LocationCard
  base: ui-blocks-locationcard
  defaultStory: list-variant
  height: 460px
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/MveNl6Nnpq76pL6yQqibDl/Location-Finder?node-id=8-3466&t=aS72ws8Ne3LJIvnt-0
    target: _blank
seo:
  title: Location Card | Laioutr
  description: Card for a single store or location with two layouts. A row-style `list` card for store directories, and a square `mapPopup` card for map markers.
sitemap:
  loc: /laioutr-ui/location/location-card
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`LocationCard` is the card for a single physical location. It carries the store name, image, a single-line address, a pre-formatted distance string, an [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status) summary, up to a handful of feature pills (drive-through, accessibility, parking), and up to three action buttons: Navigate, Call, and Details.

The `variant` prop picks the layout:

- `list` is the row layout for store directories and list panels alongside a map. The card body wraps in an anchor pointing at `detailsUrl` (so tapping anywhere on the body opens the detail page), and the action buttons stay outside the wrapping anchor to keep the HTML valid. Set `bodyAsLink={false}` to keep the body clickable for selection only without making it a link.
- `mapPopup` is the square popup that sits inside a map marker's info window. The image renders at a fixed `1/1` aspect ratio and the action buttons stretch to the popup's width.

Every interactive action emits the location's `id` so the parent map or list view can correlate the click without re-deriving identity from props.

## Key Business & UX Benefits

- Two variants from one component keep map popups and list rows visually consistent, so shoppers see the same store information whether they tap a marker or scan the list.
- Tap-anywhere navigation on the `list` body (when `detailsUrl` is set) reduces the tap target precision a shopper needs on mobile, lifting click-through to the detail page.
- Wiring Navigate, Call, and Details directly as anchors (with `tel:` for phone and `target="_blank"` for maps) means iOS and Android handle the actions natively instead of going through JavaScript handlers that can break on slow networks.
- Stable `id` on every event lets the parent map view sync selection state without re-deriving identity from the address string.

## Feature List

::features
---
items:
  - "Two layouts (`list`, `mapPopup`) cover store directories and map popups from one component"
  - "Composes `OpeningStatus` so each card carries the current open/closed state and next state-change time"
  - "Up to three action buttons (Navigate, Call, Details) wired as anchors so iOS and Android handle them natively"
  - "`bodyAsLink` opts the `list` card out of body-wide linking when the parent only wants to handle selection"
  - "Up to three feature pills via `FeaturePillList` for callouts like drive-through, accessibility, or parking"
  - "Every action emits the location `id`, so the parent map or list view can correlate clicks without prop-derived identity"
  - "Image falls back to a flat placeholder when absent, so missing-image stores don't break the row alignment"
---
::

## API Reference

::component-meta{:name="LocationCard"}
::

## Related

- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the open/closed summary rendered inside each card.
- [`TableOpeningHours`](/laioutr-ui/location/table-opening-hours): the full weekly schedule for the detail page this card links to.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape the `openingHours` prop expects.
- [`Media` type](/frontend/api-reference/common-types/media): the shape the `image` prop expects.
