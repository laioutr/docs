---
title: Location Detail
description: Single-location detail layout with a top-of-page Google Maps view and a slot for header, info list, and any other store-detail content.
playground:
  name: LocationDetail
  base: ui-features-locationdetail
  defaultStory: default
  height: 720px
seo:
  title: Location Detail | Laioutr
  description: Single-location detail layout with a top-of-page Google Maps view and a slot for header, info list, and any other store-detail content.
sitemap:
  loc: /laioutr-ui/location/location-detail
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`LocationDetail` is the page-level layout for a single store. It renders a Google Maps view at the top (pinned to the store's coordinates) and exposes a default slot for the body content. Apps fill the slot with [`LocationHeader`](#locationheader), [`LocationInfoList`](#locationinfolist), and any other content (gallery, related stores, embedded forms) the page needs.

The map height adapts per breakpoint via two CSS custom properties: `--location-detail-map-height` (default `200px`) at mobile, and `--location-detail-map-height-lg` (default `172px`) at desktop.

## Key Business & UX Benefits

- The top-of-page map anchors the shopper visually before they scan address, hours, or services, matching the mental model of "I'm looking at where this store is" rather than "I'm reading a list of facts about it."
- A single default slot keeps composition open: apps can drop in extra cards (gallery, current offers, return policy) without forking the layout.
- The shared `LocationFinderMap` under the hood means a click on a marker in the finder leads to a detail page that visually matches the finder's map.

## API Reference

### LocationDetail

::component-meta{:name="LocationDetail"}
::

Required props are `mapLocation` (the single pin to render), the Google Maps `apiPromise`, and the `mapId`. The slot receives no props. Compose the body using the helper components below.

### LocationHeader

Top section of the detail body: back link, store name, [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status), feature pills, and a row of `Navigate` / `Call` / `Email` action buttons.

::component-meta{:name="LocationHeader"}
::

Each action button emits a parameterless event (`navigate`, `call`, `email`) so the page can wire up routing, telephony, or mailto handling per app.

### LocationInfoList

Vertical list shell for icon-led info rows (address, hours, payment methods, services). It's a thin `<ul>` wrapper with consistent spacing. Compose rows with `LocationInfoListItem` (icon + content) and `LocationInfoListOpeningHours` (a collapsible row that expands to show the weekly schedule via [`OpeningHoursWeeklyTable`](/laioutr-ui/ui-kit/general/opening-hours-weekly-table)).

::component-meta{:name="LocationInfoList"}
::

## Composition

A typical detail page composes these pieces inside the `LocationDetail` slot:

```vue
<LocationDetail :map-location="store.coords" :api-promise="gmaps" map-id="...">
  <LocationHeader
    :name="store.name"
    :opening-hours="store.openingHours"
    :features="store.features"
    :navigate-url="store.mapsLink"
    :phone="store.phone"
    @navigate="trackNavigate"
    @call="trackCall"
  />
  <LocationInfoList>
    <LocationInfoListItem icon="essentials/location">{{ store.address }}</LocationInfoListItem>
    <LocationInfoListOpeningHours :opening-hours="store.openingHours" />
    <LocationInfoListItem icon="essentials/wallet">
      <PaymentMethodList :methods="store.paymentMethods" />
    </LocationInfoListItem>
  </LocationInfoList>
</LocationDetail>
```

## Related

- [`LocationFinder`](/laioutr-ui/location/location-finder): the directory listing this page links from.
- [`LocationCard`](/laioutr-ui/location/location-card): the card representation used in the finder.
- [`OpeningStatus`](/laioutr-ui/ui-kit/general/opening-status): the open/closed summary rendered inside the header.
- [`OpeningHoursWeeklyTable`](/laioutr-ui/ui-kit/general/opening-hours-weekly-table): the weekly schedule rendered inside the collapsed `LocationInfoListOpeningHours` row.
