---
title: Rating Summary Small
description: A rating summary component
links: []
seo:
  title: Rating Summary Small | Laioutr
  description: A rating summary component
---

## Overview

The Rating Summary Small component displays a compact aggregate rating (e.g. stars and optional count) for tight layouts like product cards or list rows.

## Key Business & UX Benefits

- Shows rating in a small footprint for cards and lists.
- Keeps social proof visible without dominating the layout.
- Fits product cards and compact product rows.
- Accessible with proper semantics for rating.

:::tip
Pro-Tip from Larry: Use Rating Summary Small when space is limited but you still want to show rating.
:::

## Usage

::component-code
---
:name: RatingSummarySmall
story-height: 60px
story-id: ui-kit-ratingsummarysmall--default
---
```vue-template
<RatingSummarySmall :rating="4.5" />
```
::

## Feature List

::features
---
items:
  - "Compact rating display for cards and lists"
  - "Optional review count display"
  - "Theme-aligned styling"
  - "Accessible rating semantics"
---
::

## API Reference

::component-meta{:name="RatingSummarySmall"}
::
