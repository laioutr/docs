---
title: Search Auto-Suggest
description: Responsive header search with real-time autocomplete suggestions, mounted once via `HeaderShop`.
playground:
  name: SearchAutoSuggest
  base: ui-features-searchautosuggest
  defaultStory: default
  height: 460px
jiraIssueId: LUI-109
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/proto/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=641-133307
    target: _blank
seo:
  title: Search Auto-Suggest | Laioutr
  description: Responsive header search with real-time autocomplete suggestions.
sitemap:
  loc: /laioutr-ui/navigation/search-auto-suggest
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/searchoverlayinput
---

## Overview

`SearchAutoSuggest` powers rapid product discovery from the site header. It builds on reka-ui's Popover primitive plus a hand-rolled listbox (`role="listbox"` / `role="option"`) with keyboard handling for ArrowUp, ArrowDown, Enter, and Escape. The typed substring is bolded inside each suggestion so users can spot the right result at a glance.

Suggestion data is supplied externally, so the component composes cleanly with any backend (Google Retail API, Algolia, in-house search). `HeaderShop` mounts the component once for the whole site, so you do not need to wire it up on every page. Pair `LSearchAutoSuggest` with `LSearchAutoSuggestItem` for the per-row primitive.

## Key Business & UX Benefits

- Real-time suggestions shorten time-to-product, which is the single biggest lever on search-driven conversion in commerce.
- Bolded substring inside each suggestion lets users confirm the match at a glance, reducing mis-clicks and the back-button drop-offs that follow.
- Backend-agnostic data input means the same UI works with Algolia, Google Retail API, or an in-house search service, so swapping providers does not require a UI rebuild.
- Mounted once by `HeaderShop`, so the search box behaves the same on every page without per-route wiring or duplicated state.

:::tip
Pro-Tip from Larry: Treat `SearchAutoSuggest` as the single header search entry point. `HeaderShop` mounts it once, so you do not need to recompose it per page.
:::

## Feature List

::features
---
items:
  - "Built on reka-ui's Popover plus a hand-rolled listbox with `role=\"listbox\"` and `role=\"option\"`"
  - "Keyboard handling covers ArrowUp, ArrowDown, Enter, and Escape for full keyboard discovery flow"
  - "Typed substring is bolded inside each suggestion so users spot the right match at a glance"
  - "Suggestion data is supplied externally, so the same UI works with Algolia, Google Retail API, or in-house search"
  - "`HeaderShop` mounts the component once for the whole site, removing per-route wiring"
  - "Pairs `LSearchAutoSuggest` with `LSearchAutoSuggestItem` for per-row composition"
---
::

### LSearchAutoSuggest

::component-meta{:name="SearchAutoSuggest"}
::

### LSearchAutoSuggestItem

::component-meta{:name="SearchAutoSuggestItem"}
::
