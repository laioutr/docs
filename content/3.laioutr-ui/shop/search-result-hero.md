---
title: Search Result Hero
description: Search results hero with the matched search term and a result-count pill.
playground:
  name: SearchResultHero
  base: ui-sections-searchresulthero
  defaultStory: default
  height: 460px
seo:
  title: Search Result Hero | Laioutr
  description: Search results hero with the matched search term and a result-count pill.
sitemap:
  loc: /laioutr-ui/shop/search-result-hero
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/iOpGWO38HkhnTYkEeEq8Oz/Laioutr-Basic?node-id=17-69657
    target: _blank
---

## Overview

`SearchResultHero` is the hero block at the top of a search results page. It echoes the shopper's search term and surfaces the total result count as an `AmountPill`. Required props are `searchTerm: string` and `amount: number`.

Auto-import tag: `<LSearchResultHero>`.

## Key Business & UX Benefits

- Echoing the search term confirms what the engine actually matched, cutting the "did it understand me?" doubt that pushes shoppers back to the search bar.
- The result-count pill sets correct expectations before scrolling, helping shoppers decide between refining the query or filtering down.
- A single hero block anchors the page with the active search context above the listing grid.

## Feature List

::features
---
items:
  - "searchTerm prop echoes the matched query so shoppers see what the engine actually searched for"
  - "amount prop renders as an AmountPill next to the term so the result count reads at a glance"
  - "Hero block sits above the results grid, anchoring the page with the search context"
  - "Pairs with ProductListingGrid and FilterBar below to compose the full search experience"
  - "Two required props keep wiring it up to a search store a one-line job"
---
::

## API Reference

::component-meta{:name="SearchResultHero"}
::
