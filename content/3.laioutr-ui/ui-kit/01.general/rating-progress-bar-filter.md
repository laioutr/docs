---
title: Rating Progress Bar Filter
description: Star-rating progress bar that doubles as a clickable filter control inside the `Review` section.
seo:
  title: Rating Progress Bar Filter | Laioutr
  description: Star-rating progress bar / filter.
sitemap:
  loc: /laioutr-ui/ui-kit/general/rating-progress-bar-filter
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`RatingProgressBarFilter` renders all five star rows inside the `Review` section: each row is a progress bar showing how many reviews fall into a given star count, and a click target that filters the review list down to that rating. Pass the full `ratingLevels` array (one entry per star tier) and the `totalCount`; the component handles the row layout itself. Clicking the "5 stars" row emits `setFilterOption` with `5`.

For the aggregate score above the bars, use [`RatingSummary`](/laioutr-ui/ui-kit/indicators/ratingsummary). For the standalone star graphic, see [`StarsRating`](/laioutr-ui/ui-kit/indicators/starsrating). For capturing a new rating, use [`InputRating`](/laioutr-ui/ui-kit/form/input-rating).

## Key Business & UX Benefits

- Lets shoppers drill into low-star reviews quickly, which actually builds trust because customers see the brand is not hiding criticism.
- Two-in-one display and filter pattern saves vertical space on PDPs, where review density already competes with conversion-critical content.
- Visual rating distribution at a glance helps users gauge product quality without reading every review, speeding up purchase decisions.

## Usage

::component-code
---
:name: LRatingProgressBarFilter
:story-height: 200px
story-id: ui-kit-molecules-ratingprogressbarfilter--default
title: RatingProgressBarFilter Default
---
```vue-template
<RatingProgressBarFilter
    :rating-levels="ratingLevels"
    :total-count="totalReviews"
    @set-filter-option="(rating) => setRatingFilter(rating)"
  />
```
::

## Feature List

::features
---
items:
  - "`stars` typed as `1 | 2 | 3 | 4 | 5`, so consumers cannot pass an invalid rating row by mistake"
  - "Each row pairs the star label with a `ProgressBar` (`value=level.count`, `max=Math.max(1, totalCount)`), avoiding divide-by-zero on empty review sets"
  - "`@setFilterOption` emits the selected rating so the review list query stays in the consumer's store"
  - "Localized star label via `ratingProgressBarFilter.starsLabel` keeps copy correct in singular and plural forms"
  - "BEM child classes (`__level-stars`, `__level-count`) expose hooks to restyle individual rows without touching the bar"
---
::


## API Reference

::component-meta{:name="RatingProgressBarFilter"}
::
