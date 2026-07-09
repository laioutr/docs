---
title: Pagination
description: Page navigation control with arrows or numbered jumps for splitting large data sets.
playground:
  name: Pagination
  base: ui-kit-molecules-pagination
  defaultStory: default
  height: 460px
links: []
seo:
  title: Pagination
  description: Page navigation control for splitting large data sets across multiple pages.
sitemap:
  loc: /laioutr-ui/ui-kit/form/pagination
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Pagination lets users move through paged content with previous/next controls. It fits product grids, search results, and any list that needs explicit page navigation.

Pick a variant by how the current position should read:

| `variant`   | What it renders                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `'arrows'`  | Default. Previous/next chevrons with numbered page buttons (and ellipses) between them.        |
| `'numbers'` | Previous/next arrows around a compact `currentPage/totalPages` label (e.g. `7/42`). No numbered jump buttons. |

## Key Business & UX Benefits

- Two variants in one component let merchandisers pick between numbered jump-buttons and the compact `current/total` readout without commissioning a custom alternative.
- Explicit page navigation keeps URLs shareable and crawlable, supporting SEO on category and search pages where infinite scroll hurts indexing.
- Keyboard and screen-reader support is baked in, so traversing a long list stays accessible without per-page accessibility patches.

## Usage

::component-code{:name="LPagination" story-id="ui-kit-molecules-pagination--default"}
::

### Numbered Variant

```vue-template
<LPagination
    v-model:page="page"
    :total="120"
    :items-per-page="20"
    variant="numbers"
  />
```

## Feature List

::features
---
items:
  - "Two `variant` values ('arrows' default, 'numbers') cover numbered jump-buttons with ellipses and the compact `currentPage/totalPages` readout"
  - "`total` plus `itemsPerPage` compute total pages via `Math.ceil`, so consumers pass the data shape they already have"
  - "`hrefTemplate(({ page }) => string)` swaps rendered `<button>` elements for `<a>` with template-driven URLs, keeping pages shareable and crawlable"
  - "`scrollToTop` option scrolls to top on page change, keeping the new page visible without manual handlers"
  - "Surface-tone aware: current-page button switches to 'tertiary' on dark surfaces, 'primary' on light, for legibility"
  - "Named v-model on `page` keeps the active index in sync with the consumer's URL or store state"
---
::

## API Reference

::component-meta{:name="Pagination"}
::
