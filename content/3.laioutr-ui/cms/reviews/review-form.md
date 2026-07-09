---
title: Review Form
description: Form for submitting product ratings and written reviews, with star rating, short summary, and full review fields.
playground:
  name: ReviewForm
  base: ui-blocks-reviewform
  defaultStory: default
  height: 460px
seo:
  title: Review Form
  description: Form for submitting product ratings and written reviews.
sitemap:
  loc: /laioutr-ui/cms/reviews/review-form
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/reviews/ratingform
---

## Overview

`ReviewForm` is the customer-facing form for star rating and written review submission. It fits inside `Review` (the section wrapper) or stands alone for dedicated review pages. The form bundles a product preview (image, brand, title), a `InputRating` widget, a short-summary input (capped at 120 characters with a live counter), and a longer review field. It emits `submit` with the captured `ReviewFormData` and `cancel` for the dialog dismiss path.

Field labels and placeholders are rendered from `$tl()` translation keys (for example `review.shortSummaryLabel`, `review.titlePlaceholder`), so localization happens at the translation layer rather than via props.

## Key Business & UX Benefits

- Capturing reviews inline on PDP raises submission rates compared to email-driven flows, growing the review base that drives future sales.
- Translation-key labels keep the form natural in every market, with copy living next to the rest of the storefront's locale strings.
- A short-summary field with a live character count nudges shoppers toward scannable headlines, which boosts read-through later on PDP.
- Editors place the form inside a review section or on a dedicated page in Studio, opening collection points where the audience already is.

:::tip
Pro-Tip from Larry: Use `ReviewForm` inside `Review` on PDPs so customers can submit reviews without leaving the product page.
:::

## Feature List

::features
---
items:
  - "Star rating, short summary (max 120 chars with live counter), and full review field in one form"
  - "Product preview header shows image, brand, and product title for context"
  - "Field labels and placeholders come from $tl() translation keys, so localization is locale-driven, not prop-driven"
  - "Emits submit with ReviewFormData (rating, shortSummary, yourReview) and cancel for dismissal"
  - "Fits inside Review (the section wrapper) or stands alone for dedicated review pages"
---
::

## API Reference

::component-meta{:name="ReviewForm"}
::
