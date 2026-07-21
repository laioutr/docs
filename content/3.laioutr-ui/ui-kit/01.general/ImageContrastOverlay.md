---
title: Image Contrast Overlay
description: Gradient or solid overlay that keeps text readable over images.
playground:
  name: ImageContrastOverlay
  base: ui-kit-atoms-imagecontrastoverlay
  defaultStory: no-overlay
  height: 460px
jiraIssueId: LUI-22
seo:
  title: Image Contrast Overlay
  description: Gradient or solid overlay that keeps text readable over images.
sitemap:
  loc: /laioutr-ui/ui-kit/general/imagecontrastoverlay
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

ImageContrastOverlay darkens the area behind a headline or CTA so text stays readable on bright or busy background images. It is the overlay used by banners, hero slides, and cards.

Pick `gradient` for a top-to-bottom fade, `gradient-bottom` for a bottom-heavy fade that focuses the wash on the lower portion of the image, `color` for a constant tint, or `off` to disable the overlay without removing the markup. Opacity is configurable so the overlay matches the design.

## Key Business & UX Benefits

- Keeps headlines and CTAs readable over user-uploaded campaign imagery, so marketing can ship banners without per-asset retouching.
- Protects WCAG contrast compliance on hero areas where the background varies by campaign, market, or season.
- One overlay primitive covers banners, hero slides, and cards, so contrast behavior stays consistent across every featured placement.

:::tip
Pro-Tip from Larry: Use the gradient overlay so text pops without fully hiding the image.
:::

## Usage

::component-code
---
:name: LImageContrastOverlay
story-id: ui-kit-atoms-imagecontrastoverlay--gradient-overlay
---
::

## Feature List

::features
---
items:
  - "Four variants ('off', 'gradient', 'gradient-bottom', 'color') cover full hero washes, bottom-heavy fades, flat tints, and a no-op disable state"
  - "`opacity` prop (default 0.4) binds straight to CSS, so designers tune intensity per placement without writing styles"
  - "Variant 'off' returns nothing, so the same component can be left in markup and toggled off when imagery already has built-in contrast"
  - "Built on `--overlay-always-black-alpha-*` tokens so the overlay reads identically across themes and brand refreshes"
  - "`aria-hidden=\"true\"` keeps the decorative layer out of screen-reader output"
---
::

## API Reference

::component-meta{:name="ImageContrastOverlay"}
::
