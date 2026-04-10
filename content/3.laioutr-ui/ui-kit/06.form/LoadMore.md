---
title: Load More
description: Pagination component combining infinite scroll with Load More button.
jiraIssueId: LUI-70
seo:
  title: Load More | Laioutr
  description: Pagination component combining infinite scroll with Load More button.
sitemap:
  loc: /laioutr-ui/ui-kit/form/loadmore
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The LoadMore component implements a hybrid pagination strategy for product listing pages. Automatic lazy loading continues until reaching 80 products, then pauses for explicit user action via the Load More button. This prevents runaway data loading on large catalogs while maintaining smooth browsing. The progress indicator helps users understand their position within the product set, and the component gracefully hides itself when all products are displayed.

## Key Business & UX Benefits

- Balances infinite scroll with a Load More control so catalogs don’t overload.
- Progress indicator shows how much is loaded and when more is available.
- Back-to-top and auto-hide keep the list usable and predictable.
- Configurable batch sizes fit different catalog and performance needs.

:::tip
Pro-Tip from Larry: Use Load More after initial lazy load so users can choose when to load more.
:::

## Usage

::component-code
---
:name: LoadMore
story-id: ui-kit-loadmore--default
---
::

## Feature List

::features
---
items:
  - "Hybrid lazy loading with configurable batch sizes"
  - "Visual progress bar showing loaded vs total count"
  - "Smooth back-to-top scrolling functionality"
  - "Auto-hide when all products are loaded"
---
::

## API Reference

::component-meta{:name="LoadMore"}
::
