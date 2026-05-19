---
title: Rating Summary
description: Aggregate review rating (stars plus count) for product cards and product detail pages.
links: []
seo:
  title: Rating Summary | Laioutr
  description: A rating summary component
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/ratingsummary
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Rating Summary displays an aggregate review score (stars plus review count) so shoppers get social proof at a glance. Use it on product cards in listings and at the top of a product detail page.

Related rating components:

- [`StarsRating`](/laioutr-ui/ui-kit/indicators/starsrating) — the standalone star graphic without the count.
- [`InputRating`](/laioutr-ui/ui-kit/form/input-rating) — the input form for capturing new ratings.
- [`RatingProgressBarFilter`](/laioutr-ui/ui-kit/general/rating-progress-bar-filter) — the per-star distribution bars used inside the review section.

## Key Business & UX Benefits

- Social proof at a glance on PLP and PDP is one of the highest-impact conversion levers, and this component standardizes how it appears across the funnel.
- Showing the count alongside the score is what makes the rating credible; the component bakes in that pairing so individual teams cannot ship a half-version.
- A consistent rating treatment from category page through product detail builds trust through familiarity, reducing drop-off on the path to add-to-cart.
- One component for ratings means changes to star style or review-count formatting roll out everywhere at once, with no per-page audit.

## Usage

### Horizontal

::component-code
---
:name: LRatingSummary
:story-height: 100px
story-id: ui-kit-molecules-ratingsummary--medium
title: Rating Summary Horizontal
---
```vue-template
<LRatingSummary :reviews-count="100" :rating="4.5" />
```
::

### Vertical

::component-code
---
:name: LRatingSummary
:story-height: 150px
story-id: ui-kit-molecules-ratingsummary--vertical-center
title: Rating Summary Vertical
---
```vue-template
<LRatingSummary :reviews-count="100" :rating="4.5" orientation="vertical" align="center" />
```
::

## Feature List

::features
---
items:
  - "Combines `StarsRating` with numeric rating text and a localized review-count line via `$tl('ratingSummary.basedOn')`"
  - "Two sizes ('s', 'm', default 'm') keep the summary in proportion with PLP tiles and PDP headers"
  - "Configurable `orientation` and `align` props (vertical or horizontal stacking, with alignment) cover compact tile and hero-style placements"
  - "Pair with `RatingButton` (`showButton`) to make the review count an active link that opens the review section"
  - "Reuses `StarsRating` for the graphic, so star color and size stay in sync across the indicator family"
---
::

## API Reference

::component-meta{:name="RatingSummary"}
::
