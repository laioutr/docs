---
title: Banner Integrated
description: A horizontal call-to-action banner with an optional icon and up to two CTA buttons.
jiraIssueId: LUI-20
seo:
  title: Banner Integrated | Laioutr
  description: A horizontal call-to-action banner with an optional icon and up to two CTA buttons.
sitemap:
  loc: /laioutr-ui/cms/banner/banner-integrated
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/content/ctabannerintegrated
---

## Overview

`BannerIntegrated` is a horizontal call-to-action banner with caption, heading, subline, an optional icon, and up to two CTA buttons. On mobile the layout stacks vertically; from MD+ the icon sits left of the copy and the buttons hug the trailing edge.

Both CTAs render as `BackgroundAwareButton`, so they pick up standard button variants (`primary`, `secondary`, and so on). Apply `.radius-contained` on a padded parent to round corners inside a container.

## Key Business & UX Benefits

- A single banner pattern carries promotional copy plus up to two CTAs, so editors do not need to choose between a single heavy button and dropping the secondary path.
- The icon-plus-copy pairing keeps the promo visually light, fitting into content rows without overpowering the surrounding editorial.
- Surface-tone-aware chrome reads against light and dark backdrops alike, so the same banner ships across themed sections.
- Icon, copy, and CTA edits land through Studio, freeing marketing teams to refresh promos on their own cadence.

:::tip
Pro-Tip from Larry: Reserve the secondary CTA for the lower-commitment option (for example, "Learn more") so the primary stays the obvious next step.
:::

## Usage

::component-code
---
:name: LBannerIntegrated
story-id: ui-sections-bannerintegrated--default
---
::

## Feature List

::features
---
items:
  - "Caption, heading, subline, optional icon, and up to two CTA buttons in one horizontal banner"
  - "Mobile stacks vertically; MD+ lays the icon left of the copy with buttons hugging the trailing edge"
  - "Both CTAs render as BackgroundAwareButton, picking up standard variants such as primary and secondary"
  - "Surface-tone-aware chrome reads against light and dark backdrops"
  - "Studio-editable icon, copy, and CTAs so marketing teams refresh promos without dev work"
  - "Apply .radius-contained on a padded parent for rounded corners inside a container"
---
::

## API Reference

::component-meta{:name="BannerIntegrated"}
::
