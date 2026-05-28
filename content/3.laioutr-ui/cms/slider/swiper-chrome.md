---
title: Swiper Chrome
description: Composition that pairs a text group with Swiper-chrome controls (navigation, scrollbar, action buttons).
playground:
  name: SwiperChrome
  base: ui-kit-molecules-swiperchrome
  defaultStory: default
  height: 460px
seo:
  title: Swiper Chrome | Laioutr
  description: Text and Swiper-chrome composition.
sitemap:
  loc: /laioutr-ui/cms/slider/swiper-chrome
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`SwiperChrome` is the composition that pairs a text group (caption, heading, subline, plus text size and alignment) with Swiper-chrome controls: navigation position, scrollbar and navigation toggles, and action buttons. It renders its own `CommonSwiper` internally, so slides go directly into the default slot and the Swiper config is passed via the `swiper-config` prop.

## Key Business & UX Benefits

- Gives every slider an editorial header, lifting the perceived quality of content rows from "carousel" to "curated".
- Configurable navigation position and toggles let designers tune the chrome per section without writing per-slider code.
- Caption, heading, and subline pair with action buttons to drive readers from a rotation into a deeper landing page.
- One chrome composition wraps any `CommonSwiper`, removing the drift that creeps in when each slider styles its own header.

## Feature List

::features
---
items:
  - "Pairs a text group (caption, heading, subline, plus size and alignment) with Swiper-chrome controls in one composition"
  - "Configurable navigation position plus scrollbar and navigation toggles tune the chrome per section"
  - "Action buttons inside the chrome drive readers from a rotation into a deeper landing page"
  - "Renders its own CommonSwiper internally; slides go in the default slot and Swiper config flows through swiper-config"
  - "Removes the drift that creeps in when each slider styles its own header"
---
::

## API Reference

::component-meta{:name="SwiperChrome"}
::
