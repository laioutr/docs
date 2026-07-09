---
title: Container
description: Layout primitive that wraps a backdrop with grid, alignment, and media-sizes configuration.
playground:
  name: Container
  base: ui-sections-container
  defaultStory: default
  height: 460px
seo:
  title: Container
  description: Backdrop + grid + alignment + media-sizes composition.
sitemap:
  loc: /laioutr-ui/cms/container
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/banner/contentwithtextcolumns
---

## Overview

`Container` is the layout primitive that wraps a `Backdrop` with grid, alignment, and media-sizes configuration. It exposes column counts for mobile and desktop independently, configurable sizing and alignment, and three slots (`top`, `default`, `bottom`) so editors can compose arbitrary content inside any backdrop.

Reach for `Container` whenever you need to host slot-based content with a backdrop. Sections that don't need slots can compose `Backdrop` directly.

## Key Business & UX Benefits

- One layout primitive backs every CMS section, keeping spacing, columns, and backdrops consistent across the storefront.
- Independent mobile and desktop column counts protect mobile readability without forcing designers into media-query gymnastics.
- Three slot regions (top, default, bottom) let editors arrange any content inside any backdrop, removing the need for bespoke section components.
- Configurable sizing and alignment match the parent layout, so campaign pages stay on-grid as content evolves.

:::tip
Pro-Tip from Larry: Use `Container` whenever you need to host slot-based content with a backdrop; sections that don't need slots can compose `Backdrop` directly.
:::

## Feature List

::features
---
items:
  - "Independent column counts for mobile and desktop protect mobile readability without media-query gymnastics"
  - "Three slot regions ('top', 'default', 'bottom') let editors arrange any content inside any backdrop"
  - "Wraps a Backdrop with grid, alignment, and media-sizes configuration in one primitive"
  - "Configurable sizing and alignment keep campaign pages on-grid as content evolves"
  - "Hosts slot-based content with a backdrop, removing the need to fork section components per layout"
  - "Sections without slot composition can compose Backdrop directly, keeping the primitive layered"
---
::

## API Reference

::component-meta{:name="Container"}
::
