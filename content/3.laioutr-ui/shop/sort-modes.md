---
title: Sort Modes
description: Sort selector for product listing pages, wrapping a select of named sort modes.
playground:
  name: SortModes
  base: ui-blocks-sortmodes
  defaultStory: default
  height: 460px
seo:
  title: Sort Modes | Laioutr
  description: Sort selector for product listing pages.
sitemap:
  loc: /laioutr-ui/shop/sort-modes
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`SortModes` is the sort selector for product listing pages. It wraps a labeled `Select` of named sort modes (Newest, Price ascending, Price descending, Best sellers) and exposes the current selection through `v-model:active-sorting`. Pass the options array as `available-sortings`. Pair it with [`ProductListingGrid`](/laioutr-ui/shop/product-listing-grid) and [`FilterBar`](/laioutr-ui/shop/filter-bar) to assemble the listing chrome.

Auto-import tag: `<LSortModes>`.

## Key Business & UX Benefits

- Named sort modes (Newest, Price ascending, Price descending, Best sellers) match the way shoppers actually think about listings, lifting the rate at which they re-order results.
- A single select with a clear label is far less error-prone than custom column-header sorting, which protects mobile usability where most shopping now happens.
- Defining sort options as data on `available-sortings` lets merchandising add or rename modes (Editor's pick, Most reviewed) without touching listing code.

## Feature List

::features
---
items:
  - "Named sort modes (Newest, Price ascending, Price descending, Best sellers) match how shoppers actually re-rank listings"
  - "v-model:active-sorting surfaces the current selection so the parent page can fetch fresh results without prop drilling"
  - "available-sortings prop takes the option list as data, so merchandising can add or rename modes (Editor's pick, Most reviewed) without code"
  - "Single labelled Select keeps mobile usability clean compared with column-header sorting"
  - "Pairs with ProductListingGrid and FilterBar to compose the full listing chrome from small parts"
---
::

## API Reference

::component-meta{:name="SortModes"}
::
