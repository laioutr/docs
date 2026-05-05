---
title: Media
description: A responsive image block component with optional lightbox functionality, customizable aspect ratios, and device-specific sizing controls.
jiraIssueId: LUI-28
seo:
  title: Media | Laioutr
  description: A responsive image block component with optional lightbox functionality, customizable aspect ratios, and…
sitemap:
  loc: /laioutr-ui/ui-kit/general/media
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Enables content editors to insert and manage responsive images within page layouts. Creates visually engaging content that adapts seamlessly across all device sizes. Display product images, hero banners, or editorial photography with consistent styling. Configure different sizing for mobile versus desktop to optimize visual presentation. Add captions and accessibility descriptions for improved user experience. Leverages Radix Vue Dialog for accessible lightbox implementation.

## Key Business & UX Benefits

- Delivers the right image size per device for fast load and good quality.
- Engages users with lightbox zoom and pan for detailed viewing.
- Gives editors control over aspect ratio and mobile vs desktop sizing.
- Keeps images accessible with captions and descriptions.

:::tip
Pro-Tip from Larry: Set separate mobile and desktop aspect ratios so images look great on every screen.
:::

## Usage

Uses [nuxt-image](https://image.nuxt.com/) to render responsive images. The component takes a [`Media`](/frontend/api-reference/common-types/media) value (the canonical discriminated union returned by connectors and produced by the `media` schema field) and reads its sources to pick the right variant for the current viewport.

::component-code{:name="Media" story-id="ui-kit-media--default"}
::

## Feature List

::features
---
items:
  - "Lightbox with zoom and pan using Radix Vue Dialog and Swiper"
  - "Cross-image navigation in lightbox across all enabled media on the page"
  - "Custom aspect ratios with separate mobile and desktop values"
  - "Fixed height option with responsive values that overrides aspect ratio"
---
::

## API Reference

::component-meta{:name="Media"}
::
