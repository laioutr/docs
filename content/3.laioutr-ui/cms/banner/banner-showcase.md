---
title: Banner Showcase
description: A side-by-side promotional banner pairing a media image with a copy block and a single CTA.
playground:
  name: BannerShowcase
  base: ui-sections-bannershowcase
  defaultStory: default
  height: 460px
jiraIssueId: LUI-21
seo:
  title: Banner Showcase | Laioutr
  description: A side-by-side promotional banner pairing a media image with a copy block and a single CTA.
sitemap:
  loc: /laioutr-ui/cms/banner/banner-showcase
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/content/ctabannershowcase
---

## Overview

`BannerShowcase` lays a media image alongside a copy block (caption, heading, description) and a single CTA. On narrow viewports the image stacks above the content; from the MD container breakpoint, the image and content sit side-by-side.

The `mediaAspectRatio` prop picks a single ratio for the image (`16/9`, `4/3`, or `1/1`) that applies across all breakpoints. Text and chrome are surface-tone aware via the surrounding `MediaStage`, so the banner stays legible on themed backdrops. Apply `.radius-contained` on a padded parent to round corners inside a container.

## Key Business & UX Benefits

- A clear image-plus-copy split frames the product or campaign next to its pitch, so shoppers grasp the offer in one glance.
- A single configurable aspect ratio keeps the image proportion predictable across breakpoints, which protects layout from device to device.
- Surface-tone-aware chrome keeps the headline readable on any backdrop, so brand teams style sections without commissioning a second design pass.
- Editors swap the image, copy, and CTA per drop, so merchants run rapid seasonal storytelling without dev involvement.

:::tip
Pro-Tip from Larry: Pick the aspect ratio that matches your asset library so the media never crops awkwardly between breakpoints.
:::

## Feature List

::features
---
items:
  - "Side-by-side image and copy block (caption, heading, description) with a single CTA"
  - "Mobile stacks the image above the content; MD+ shifts to a horizontal layout"
  - "Single mediaAspectRatio (16/9, 4/3, or 1/1) applied across breakpoints for predictable cropping"
  - "Surface-tone-aware chrome via MediaStage keeps headlines readable on light, dark, and bright backdrops"
  - "Editors swap the image, copy, and CTA per drop for fast seasonal storytelling"
  - "Apply .radius-contained on a padded parent to round corners inside a container"
---
::

## API Reference

::component-meta{:name="BannerShowcase"}
::
