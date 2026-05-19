---
title: Swiper Arrows
description: Previous and next arrow controls for sliders, with optional fadeout backgrounds.
seo:
  title: Swiper Arrows | Laioutr
  description: Previous and next arrow controls for sliders.
sitemap:
  loc: /laioutr-ui/cms/slider/swiper-arrows
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`SwiperArrows` is the previous and next arrow control strip for sliders. Drop it inside any `CommonSwiper` to get standard slide navigation; the optional fadeout background keeps the arrows visible over busy slide content.

## Key Business & UX Benefits

- Standardizes slider navigation across every carousel on the site, so shoppers learn the pattern once and trust it everywhere.
- The fadeout background keeps arrows visible over busy slide imagery, removing the "where are the controls" moment that breaks engagement.
- A reusable control drops into any `CommonSwiper`, saving engineering from re-skinning arrow controls per slider type.
- Keyboard-reachable navigation supports power users and assistive tech, broadening the audience the slider serves.

## Usage

::component-code
---
:name: LSwiperArrows
:story-height: 400px
story-id: ui-kit-molecules-swiperarrows--default
title: SwiperArrows Default
---
```vue-template
<CommonSwiper>
    <!-- slides -->
    <SwiperArrows :fadeout="true" />
  </CommonSwiper>
```
::

## Feature List

::features
---
items:
  - "Previous and next arrow control strip for sliders, drops inside any CommonSwiper"
  - "Optional fadeout background keeps arrows visible over busy slide imagery"
  - "One reusable control standardizes slider navigation across every carousel on the site"
  - "Keyboard-reachable navigation supports power users and assistive tech"
  - "Saves engineering from re-skinning arrow controls per slider type"
---
::

## API Reference

::component-meta{:name="SwiperArrows"}
::
