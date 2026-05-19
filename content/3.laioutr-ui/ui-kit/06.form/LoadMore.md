---
title: Load More
description: Explicit-click pagination control that pairs a Load More button with a loaded-vs-total progress indicator and a back-to-top link.
jiraIssueId: LUI-70
seo:
  title: Load More | Laioutr
  description: Explicit-click pagination control combining a Load More button with progress indicator.
sitemap:
  loc: /laioutr-ui/ui-kit/form/loadmore
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

LoadMore is an explicit-click pagination control for product listing pages. It renders `loadedCount` of `totalCount`, a progress bar tracking that ratio, an action button that emits `load-more` when clicked, and a back-to-top link below. There is no scroll listener and no auto-load: the consumer wires the click event to its own fetch logic.

The button and progress bar hide automatically when `loadedCount >= totalCount`.

## Key Business & UX Benefits

- An explicit click button keeps the footer reachable, so links to support, policies, and trust signals stay discoverable on long catalogs.
- A visible progress indicator gives customers a sense of how much catalog remains, reducing the "no end in sight" feeling of infinite scroll.
- The back-to-top link in the same control lets shoppers reset to the top of the listing without scrolling manually.
- Leaving fetch logic in the consumer (via the `load-more` event) keeps the component reusable across product, review, and order-history listings without forking.

:::tip
Pro-Tip from Larry: Wire `@load-more` to your store's fetch action and pass `loading` through to disable the button while the request is in flight.
:::

## Usage

::component-code
---
:name: LLoadMore
story-id: ui-kit-molecules-loadmore--default-case
---
::

## Feature List

::features
---
items:
  - "`loadedCount` and `totalCount` props drive a built-in `ProgressBar`, so the indicator stays in sync with the data without extra wiring"
  - "`@load-more` event fires when the user clicks the action button, leaving fetch logic in the consumer's store"
  - "Auto-hides the button and progress bar when `loadedCount >= totalCount`, so the control disappears at the end of the list"
  - "Built-in back-to-top link lets shoppers jump to the top of the listing without a separate component"
  - "`buttonVariant` (typed as `ButtonVariant`) and `buttonText` let consumers match the kit's CTA style and copy"
  - "`loading` flag forwards to the button's spinner state, so consumers can disable retries while a fetch is in flight"
  - "Optional `entityName` localizes the displayed entity ('products', 'reviews', etc.) without forking the component"
---
::

## API Reference

::component-meta{:name="LoadMore"}
::
