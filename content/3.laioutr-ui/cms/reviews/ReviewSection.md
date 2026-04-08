---
title: Review Section
description: Product review section with rating summaries, sorting, filtering, and review management.
jiraIssueId: LUI-153
seo:
  title: Review Section | Laioutr
  description: Product review section with rating summaries, sorting, filtering, and review management.
sitemap:
  loc: /laioutr-ui/cms/reviews/reviewsection
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Review Section provides a comprehensive area for displaying and managing customer reviews on product detail pages. Users can browse reviews with sorting and filtering by star rating using interactive progress bar charts that double as filter buttons. The 'Write a Review' button triggers a submission modal. For merchants, the component supports moderation workflows including customer service responses and pre-publication approval to maintain review quality.

## Key Business & UX Benefits

- One section for review list, summary, sort, filter, and write-a-review so PDP stays consistent.
- Star filters and sort options help users find relevant reviews.
- Write a Review modal keeps submission on the same page.
- Moderation and response support keep review quality high.

:::tip
Pro-Tip from Larry: Use Review Section on PDP so customers can read and write reviews in one place.
:::

## Usage

::component-code
---
:name: LuiReviewSection
story-id: organisms-reviewsection--default
---
::

## Feature List

::features
---
items:
  - "Multiple star style options (Accent, Primary, Yellow, Black)"
  - "Sorting options (Newest, Oldest, Rating high/low)"
  - "Star rating filters with clickable progress bars"
  - "Review modal and management with publishing approval"
---
::

## API Reference

::component-meta{:name="ReviewSection"}
::
