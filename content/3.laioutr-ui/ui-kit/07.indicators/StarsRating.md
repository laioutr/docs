---
title: Stars Rating
description: Star graphic with optional text for displaying a numeric rating on products, reviews, or any rating context.
playground:
  name: StarsRating
  base: ui-kit-atoms-starsrating
  defaultStory: size-m
  height: 460px
links: []
seo:
  title: Stars Rating
  description: Rating gives you a nice way to display a rating both with graphics and through text. This can be used to show the…
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/starsrating
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Stars Rating renders a numeric rating as stars, with optional text. It supports fractional values (e.g. 4.5) so it reads accurately on review-driven listings.

Related rating components:

- [`RatingSummary`](/laioutr-ui/ui-kit/indicators/ratingsummary) — stars plus a review count for product cards and PDPs.
- [`InputRating`](/laioutr-ui/ui-kit/form/input-rating) — the input form for capturing new ratings.
- [`RatingProgressBarFilter`](/laioutr-ui/ui-kit/general/rating-progress-bar-filter) — the per-star distribution bars used inside the review section.

## Key Business & UX Benefits

- Fractional rendering (4.5, 3.8) gives shoppers an honest read of the score, which keeps trust intact compared to rounded star graphics.
- A standalone star graphic slots into compact contexts like search results, cards, and tooltips where a full rating summary would feel heavy.
- Pairing this with `RatingSummary` on PDPs creates a familiar two-step pattern, so shoppers always know how to interpret review data on the site.
- One shared star primitive means brand teams can adjust the star color or shape in one place and update every rating surface at once.

## Usage

::component-code
---
:name: LStarsRating
:story-height: 100px
story-id: ui-kit-atoms-starsrating--fractional
---
::

## Feature List

::features
---
items:
  - "Fractional rendering driven by `--stars-rating` and `--stars-max-rating` custom properties, so 4.5 or 3.8 read accurately"
  - "`maxRating` (default 5) sets the total stars; the same component handles 5-, 10-, or N-star scales"
  - "Stacked filled and outline icons keep the partial-star fill crisp at every size"
  - "Configurable `color` prop with sensible 'yellow' default plus passthrough for theme colors"
  - "Three sizes drive the icon scale via `--stars-size` and `--sizing-icon-size-*` tokens, so the graphic fits tooltips and PDP headers alike"
  - "Standalone graphic for compact contexts; pair with `RatingSummary` when the review count is also needed"
---
::

## API Reference

::component-meta{:name="StarsRating"}
::
