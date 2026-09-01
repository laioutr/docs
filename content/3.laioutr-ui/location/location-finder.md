---
title: Location Finder
description: Store-locator layout combining search, filters, a list panel, and a Google Maps view. Side-by-side at desktop, tabbed at mobile, with a selected-location bottom sheet over the map.
playground:
  name: LocationFinder
  base: ui-features-locationfinder
  defaultStory: default
  height: 720px
seo:
  title: Location Finder
  description: Store-locator layout combining search, filters, a list panel, and a Google Maps view. Side-by-side at desktop, tabbed at mobile, with a selected-location bottom sheet over the map.
sitemap:
  loc: /laioutr-ui/location/location-finder
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
changelogKeys:
  - LocationFinder
---

## Overview

`LocationFinder` is the composite store-locator. It pairs a sidebar (heading, search input with autocomplete, optional filter sheet, scrollable list) with a Google Maps view of the same locations. The layout shifts between two responsive modes:

- **Desktop (`>= --lg`):** sidebar and map render side-by-side. Selecting a row in the list re-centers the map and pops a Google Maps `InfoWindow` over the marker.
- **Mobile (`< --lg`):** sidebar and map become two tabs (`List` / `Map`). Selecting a row activates the map tab; the selected store renders as a [`LocationCard`](/laioutr-ui/location/location-card) bottom sheet over the map (no `InfoWindow`).

Search filters by name and address. Filters work via the same `AvailableFilter` / `SelectedFilters` shape used by `FilterPanelContent`. Both are state-only: the parent owns the data and the filter definitions.

`LocationFinder` composes [`LocationFinderList`](#locationfinderlist) and [`LocationFinderMap`](#locationfindermap) internally. Both are exported from `@laioutr-core/ui` so you can drop them in independently when you need just the list or just the map.

The `containerStyle` prop (`'full-width' | 'boxed'`, via the shared `containerStyleField` toggle in Studio) controls the desktop framing. In `boxed` mode, `.location-finder--boxed` clamps the finder to `--container-max-width` and centers it with `margin-inline: auto` from the `--lg` breakpoint up, so it sits as a contained card rather than stretching edge-to-edge.

## Google Maps setup

The map needs a Google Maps JavaScript API key and a Map ID.

The key is one option on the `@laioutr-app/ui` app. The Location Finder and Location Detail sections read it and pass the loaded API down.

In a platform project it goes in the app's config, next to `theme`:

```json
{
  "apps": [
    {
      "name": "@laioutr-app/ui",
      "version": "latest",
      "config": {
        "theme": "classic",
        "googleMapsApiKey": "AIza..."
      }
    }
  ]
}
```

A Nuxt app that lists the module itself sets the same option in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/ui'],
  '@laioutr-app/ui': {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
});
```

::warning
The key reaches the browser. Restrict it by HTTP referrer in the Google Cloud Console.
::

The Map ID is a per-section field in Studio ("Google Maps Map ID"). Advanced Markers need one. `DEMO_MAP_ID` works while you develop.

The Maps script loads on the first page that shows a map, not on every page. Without a key the section keeps its search, list and filters, the map area stays empty, and the browser console asks for the option by name.

Outside a Studio section, when you render `LocationFinder` yourself, pass `apiPromise` and `mapId` as props. `apiPromise` resolves to the loaded `google` namespace.

## Key Business & UX Benefits

- Search-by-name and search-by-address from the same input means shoppers can find a store by whatever they remember (the brand of the location, the street it sits on, or the neighborhood).
- The Google Maps view with marker selection lets shoppers visually scan a region and tap the closest store, lifting "find a store" conversion on mobile where typing an address is friction.
- Filter sheet shares the `AvailableFilter` / `SelectedFilters` shape with `FilterOffCanvas`, so the same filter UI works on a category page and a store finder without per-surface forks.
- Tabbed mobile layout keeps the map full-bleed when needed, then collapses cleanly into a list scroll for shoppers who prefer to read text over panning.

## API Reference

### LocationFinder

::component-meta{:name="LocationFinder"}
::

The component takes a `locations: LocationFinderMapItem[]` array (the shape exported from `LocationFinderMap`), a Google Maps `apiPromise` and `mapId` (see [Google Maps setup](#google-maps-setup)), and a set of optional v-models:

- `v-model:selectedLocationId`: the currently focused store; emitted on row click or marker click.
- `v-model:searchQuery`: the text in the search input.
- `v-model:selectedFilters`: the active filter selections.
- `v-model:view`: `'list'` or `'map'`. Only meaningful at mobile breakpoints; ignored at desktop.

Event emits (`navigate`, `call`, `details`) all carry the location `id`. They forward unchanged from the inner `LocationCard` / map InfoWindow / list items, so the parent handles routing in one place.

### LocationFinderList

Standalone list of locations. Use it when you need a list without the map (e.g. a printable directory page, an admin overview).

::component-meta{:name="LocationFinderList"}
::

Each row renders a [`LocationCard`](/laioutr-ui/location/location-card) in the `list` variant. The list emits `select-location` (highlight without navigation), `navigate`, `call`, and `details`.

### LocationFinderMap

Standalone Google Maps view. Use it when you need a map without the surrounding chrome.

::component-meta{:name="LocationFinderMap"}
::

Requires a Google Maps `apiPromise` (a resolved promise of the loaded `google.maps` namespace) and a `mapId` (your Google Cloud Map Style ID) — see [Google Maps setup](#google-maps-setup). The `no-popup` prop suppresses the `InfoWindow` overlay. Set it on mobile when a bottom-sheet card handles the selection UI instead.

## Composition

The default desktop layout is roughly:

```
+--------------------------------+--------------------+
| heading                        |                    |
| search input                   |                    |
| [List | Map]  [Filter]         |                    |
| ------------------------------ |       map          |
| <LocationCard>                 |                    |
| <LocationCard>                 |                    |
| <LocationCard>                 |                    |
| ...                            |                    |
+--------------------------------+--------------------+
```

The sidebar width is themable via `--location-finder-sidebar-width` (default `414px`), and the maximum desktop height via `--location-finder-max-height-lg` (default `740px`).

## Slots

- `#empty`: replaces the default `EmptyState` when no locations match the search/filter combination. Use this to surface a brand-tone empty state ("No bakeries within 25 km. Try expanding the radius.") in place of the generic message.

## Related

- [`LocationCard`](/laioutr-ui/location/location-card): the card rendered for each result row and inside the mobile bottom sheet.
- [`LocationDetail`](/laioutr-ui/location/location-detail): the per-store detail page this component links to via `details`.
- [`OpeningHours` type](/frontend/api-reference/common-types/opening-hours): the shape each location's opening data takes.
