---
title: Input Rating
description: Star rating input for capturing review scores and ratings.
playground:
  name: InputRating
  base: ui-kit-molecules-inputrating
  defaultStory: default
  height: 460px
seo:
  title: Input Rating
  description: Star rating input.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-rating
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`InputRating` is the star-rating input used inside `ReviewForm` and any rating-capture flow. Wrap it in `<LField>` to surface validation messages when the user submits without a rating.

For display-only ratings, reach for [`StarsRating`](/laioutr-ui/ui-kit/indicators/starsrating) (graphic only) or [`RatingSummary`](/laioutr-ui/ui-kit/indicators/ratingsummary) (graphic plus review count). For the per-star distribution bars in a review section, see [`RatingProgressBarFilter`](/laioutr-ui/ui-kit/general/rating-progress-bar-filter).

## Key Business & UX Benefits

- A familiar star pattern lets shoppers leave a rating in one tap, which drives the volume of UGC needed to lift product page conversion.
- Wrapping in `<LField>` surfaces the parent Field's `errorMessage` when a rating is missing, so customers see why the form failed instead of guessing.
- Reusing the same control inside `ReviewForm` and standalone rating flows keeps the visual signal consistent everywhere shoppers see ratings.

## Feature List

::features
---
items:
  - "`maxRating` prop (default 5) sets the number of stars, so 5-, 10-, or N-star scales come from one component"
  - "`size` prop drives both star icon and label size, keeping the rating proportional to the surrounding form chrome"
  - "Numeric v-model from 0 to `maxRating`, so consumers store the score as a plain number"
  - "Localized helper text via `$tl('inputRating.label')` keeps the field's accessible label correct in every market"
  - "Wraps cleanly in `<LField>`, so 'rating required' errors surface inline rather than failing silently"
---
::

## API Reference

::component-meta{:name="InputRating"}
::
