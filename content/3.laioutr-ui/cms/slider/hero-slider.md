---
title: Hero Slider
description: A flexible hero that works as a static block or an interactive slider with full-width backgrounds.
jiraIssueId: LUI-11
seo:
  title: Hero Slider | Laioutr
  description: A flexible hero, static block or interactive slider.
sitemap:
  loc: /laioutr-ui/cms/slider/hero-slider
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/slider/heroslider
---

## Overview

`HeroSlider` is the flexible hero component. It works as a static hero block when there's only one slide, or as an interactive slider when there are multiple. Each `HeroSlide` carries its own media (separate mobile and desktop images), copy, and up to two CTA buttons, with a gradient or full-color overlay at adjustable opacity.

Each slide's chrome and text colors stay legible against its background via an `<OnSurface :tone="activeSlideTone">` wrapper that tracks the active slide.

## Key Business & UX Benefits

- The hero slot drives top-of-funnel attention, and this component covers both single-message heroes and multi-message rotations from one config.
- Separate mobile and desktop images per slide remove the cropping compromises that hurt mobile conversion on hero placements.
- Per-slide tone tracking keeps headlines and buttons legible against every background, eliminating the "white text on snow" failure.
- Up to two CTAs per slide support layered narratives ("shop the drop" plus "learn more"), giving editors finer control over the customer journey.

:::tip
Pro-Tip from Larry: Use the `<OnSurface>` wrapper so each slide's chrome and text colors stay legible against its background.
:::

## Usage

::component-code
---
:name: LHeroSlider
:story-height: 600px
story-id: ui-sections-heroslider--multiple-slides
title: Hero Slider Default
---
::

## Feature List

::features
---
items:
  - "Works as a static hero with one slide or an interactive slider when multiple HeroSlides are present"
  - "Separate mobile and desktop images per slide remove cropping compromises on hero placements"
  - "Up to two CTA buttons per slide support layered narratives like 'shop the drop' plus 'learn more'"
  - "Gradient or full-color overlays at adjustable opacity keep headlines readable over any background"
  - "Per-slide tone tracking via <OnSurface :tone='activeSlideTone'> keeps chrome legible against each background"
  - "Editors swap slides, media, and CTAs in Studio so seasonal heroes ship without engineering"
---
::

## API Reference

### LHeroSlider

::component-meta{:name="HeroSlider"}
::

### LHeroSlide

::component-meta{:name="HeroSlide"}
::
