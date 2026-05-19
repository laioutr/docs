---
title: USP Banner
description: A slim Swiper-driven trust strip that cycles unique selling propositions across breakpoints.
jiraIssueId: LUI-31
seo:
  title: USP Banner | Laioutr
  description: A slim Swiper-driven trust strip for unique selling propositions.
sitemap:
  loc: /laioutr-ui/cms/banner/usp-banner
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/banner/uspbanner
---

## Overview

`UspBanner` surfaces a row of unique selling propositions (delivery, returns, support guarantees) as a slim trust strip. The layout is always a Swiper, with `slidesPerView` driven by breakpoints: 1 slide on mobile, 2 on MD, and 3 from LG up. Navigation arrows appear when the slide count exceeds what fits.

Items are passed as a flat array via the `usps` prop, so editors author each USP (`text`, `icon`) as data rather than child markup. Position the banner above or below the header so trust signals are visible without scrolling.

## Key Business & UX Benefits

- Surfaces trust signals (delivery, returns, support) above the fold, where they reduce cart abandonment and answer pre-purchase doubts.
- A Swiper-driven strip cycles many USPs through a slim row without stacking on mobile or stretching across the page on desktop.
- Per-item content lives in the `usps` array, so legal or customer service can update guarantees the day a policy changes.
- One configured banner ships across markets and pages, keeping the trust message consistent everywhere a shopper sees it.

:::tip
Pro-Tip from Larry: Position the USP banner above or below the header so trust signals are visible without scrolling.
:::

## Usage

::component-code
---
:name: LUspBanner
:story-height: 200px
story-id: ui-sections-uspbanner--default
title: USP Banner Default
---
```vue-template
<LUspBanner :usps="usps" />
```
::

## Feature List

::features
---
items:
  - "Always a Swiper slider; slidesPerView is 1 on mobile, 2 on MD, 3 from LG up via breakpoint config"
  - "Each USP is authored as a UspBannerItemProps entry in the usps prop (text plus icon)"
  - "Navigation arrows appear automatically once the slide count exceeds what fits"
  - "Icon plus copy pairing keeps trust signals (delivery, returns, support) scannable above the fold"
  - "One configured banner ships across markets and pages, keeping the trust message consistent storefront-wide"
  - "Position above or below the header so the row appears without forcing the shopper to scroll"
---
::

## API Reference

::component-meta{:name="UspBanner"}
::
