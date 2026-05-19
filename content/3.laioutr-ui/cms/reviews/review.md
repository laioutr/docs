---
title: Review
description: Product review display section with rating summary, sort and filter controls, and a Write a Review dialog.
jiraIssueId: LUI-153
seo:
  title: Review | Laioutr
  description: Product review display section with rating summary, sort and filter controls.
sitemap:
  loc: /laioutr-ui/cms/reviews/review
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/reviews/reviewsection
---

## Overview

`Review` is the review-display section used on product detail pages. It bundles a rating summary, a rating progress-bar filter, sort and filter dropdowns, the per-review list (rendered via `ReviewItem`), pagination, and a "Write a Review" button that opens a `ReviewForm` dialog.

Sort options cover Newest, Oldest, Rating low-to-high, and Rating high-to-low. Filter options narrow the list by star count. The component emits `pageChange`, `sortChange`, and `filterChange` so the parent can fetch the matching review page from its backend.

## Key Business & UX Benefits

- A populated review section on PDP is one of the strongest conversion levers in commerce, and this component ships the whole display experience as a unit.
- Star-count filters and four sort orders help shoppers find the review that resolves their specific objection, cutting cart abandonment.
- The "Write a Review" entry point opens a form dialog inline, so reading and writing happen on the same page rather than via a separate flow.
- Pagination and emitted events keep the section compatible with any review API, so backend swaps don't require redesign.

:::tip
Pro-Tip from Larry: Use `Review` on PDP so customers can read and write reviews in one place.
:::

## Usage

::component-code
---
:name: LReview
:story-height: 500px
story-id: ui-sections-review--default
title: Review Default
---
::

## Feature List

::features
---
items:
  - "Bundles rating summary, rating progress-bar filter, sort and filter dropdowns, ReviewItem list, and pagination"
  - "Sort options: Newest, Oldest, Rating low-to-high, Rating high-to-low; filter by star count"
  - "'Write a Review' button opens a ReviewForm dialog so writing happens on the same page as reading"
  - "Emits pageChange, sortChange, and filterChange so the parent fetches matching pages from its review API"
  - "ReviewItem renders each review with consistent layout and metadata"
---
::

## API Reference

### LReview

::component-meta{:name="Review"}
::

### LReviewItem

::component-meta{:name="ReviewItem"}
::
