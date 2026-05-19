---
title: Content Slider
description: Slot-driven slider for promotional banners and content slides, with touch and keyboard navigation.
seo:
  title: Content Slider | Laioutr
  description: Slot-driven slider for promotional banners and content slides.
sitemap:
  loc: /laioutr-ui/cms/slider/content-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/banner/bannerslider
---

## Overview

`ContentSlider` is the slot-driven slider for hero areas and editorial content rotation: multiple banners, featured posts, campaign slides. All content flows through the default slot, so the slider stays flexible for any content shape. Touch and keyboard navigation work on mobile and desktop.

## Key Business & UX Benefits

- One slider drives hero areas, editorial rotations, and campaign carousels, so brand teams stay on a single motion pattern across the site.
- Hybrid `slot` and `query` data sources let marketing curate the homepage by hand while keeping blog excerpts auto-fresh.
- Touch and keyboard navigation work consistently on mobile, desktop, and assistive tech, protecting accessibility and conversion alike.
- Editors compose slides in Studio, shipping new hero rotations the same hour the creative lands.

:::tip
Pro-Tip from Larry: Use `dataSource: 'query'` for blog excerpt sliders and let the slot mode handle hand-curated campaign content.
:::

## Usage

:component-code{name="LContentSlider" story-id="ui-sections-contentslider--landscape-media"}

## Feature List

::features
---
items:
  - "Slot-driven slider hosts banners, featured posts, and campaign slides through the default slot for flexible content shapes"
  - "Touch and keyboard navigation work consistently on mobile, desktop, and assistive tech"
  - "One slider drives hero areas, editorial rotations, and campaign carousels, keeping one motion pattern across the site"
---
::

## API Reference

::component-meta{:name="ContentSlider"}
::
