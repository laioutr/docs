---
title: Banner Basic
aliases:
  - /laioutr-ui/ui-kit/content/ctabannerbasic
  - /laioutr-ui/cms/banner/basicbannerwithimageandtext
description: A foundational call-to-action banner with background imagery, headline, subline, and configurable action button.
playground:
  name: BannerBasic
  base: ui-sections-bannerbasic
  defaultStory: default
  height: 460px
seo:
  title: Banner Basic
  description: A foundational call-to-action banner with background imagery, headline, subline, and configurable action button.
sitemap:
  loc: /laioutr-ui/cms/banner/banner-basic
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1
jiraIssueId: LUI-18
---

## Overview

`BannerBasic` is the primary promotional banner for driving traffic to landing pages, product details, or signup forms. It pairs a background image with a headline, subline, and call-to-action button, and uses a gradient or solid overlay to keep text readable on any image.

Sizing modes (S, M, L) fit different slots without custom code. Apply the `.radius-contained` utility on a padded parent to round the banner inside a container; leave it off for an edge-to-edge full-bleed treatment.

## Key Business & UX Benefits

- Drives traffic to landing pages and product details with a single, configurable block that marketing can update without engineering tickets.
- Gradient and solid overlays guarantee readable headlines on any image, removing the contrast risk that kills conversion on hero placements.
- Three sizing modes cover hero, mid-page, and footer slots so brand teams stay on one component instead of forking layouts.
- Studio editors swap copy, image, and CTA in minutes, cutting campaign turnaround from days to hours.

::tip
Pro-Tip from Larry: Wrap the banner in `.ecommerce-container` (or any padded container) and let `.radius-contained` round the corners only when there's whitespace beside the banner.
::

## Feature List

::features
---
items:
  - Three sizing modes (S, M, L) with heading that auto-scales one step above
    body text for hero, mid-page, and footer slots
  - Optional caption, heading, and subline composed via LTextGroup with
    per-element color overrides
  - Content alignment ('left', 'center', 'right') drives both column position
    and text alignment
  - Optional aspectRatio prop (e.g. '16/9', '21/9') locks banner height when
    imagery needs a fixed crop
  - Configurable solid background color, gradient or solid overlay, and
    surface-tone-aware chrome that keeps text legible on any image
  - Studio-editable copy, image, CTA, and overlay so marketing ships campaign
    banners without engineering tickets
  - Themed via design tokens with the .radius-contained utility for rounded
    corners inside padded containers
---
::

## API Reference

::component-meta{:name="BannerBasic"}
::
