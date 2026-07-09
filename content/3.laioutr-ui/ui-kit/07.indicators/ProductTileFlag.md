---
title: Product Tile Flag
description: Visual flag for product tiles that highlights promotional labels like sale, promo, and new.
playground:
  name: ProductTileFlag
  base: ui-kit-atoms-producttileflag
  defaultStory: sale-flag
  height: 460px
jiraIssueId: LUI-52
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=11179-50563&t=t5p6T6f67QhRVCAN-4
    target: _blank
seo:
  title: Product Tile Flag
  description: A visual flag component for product tiles highlighting promotional labels like sale, promo, or new items.
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/producttileflag
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Product Tile Flag is the badge that overlays a product tile to call out a discount, a promo, or a new arrival. Variants share a consistent visual hierarchy across the storefront, and the default slot lets merchants drop in localized text (e.g. "-25%") without breaking the styling. Auto-imports as `<LProductTileFlag>`.

## Key Business & UX Benefits

- A prominent discount or "new" flag on the tile is a well-proven CTR driver on PLPs, and one component keeps every grid card on the same visual rhythm.
- Variants enforce a fixed promo hierarchy, so sale, promo, and new arrivals stay readable side-by-side even when several campaigns run at once.
- The default slot accepts localized text out of the box, so "-25%" or "-25 %" each render correctly in every market without engineering touch-ups.
- Designed-in placement over the tile avoids layout shift and keeps imagery the hero, protecting brand polish on flagship category pages.

## Feature List

::features
---
items:
  - "Three required `variant` values ('promo', 'sale', 'new') drive separate background and text tokens for category-flag chrome"
  - "Default slot accepts localized text, so `-25%` and `-25 %` each render correctly per market"
  - "Per-variant tokens (`--flags-category-node-flags-default-{variant}-bg`, `-text`) let themes match brand palettes precisely"
  - "BEM root class with variant modifier (`product-tile-flag--{variant}`) anchors per-state theme overrides"
  - "Auto-imports as `<LProductTileFlag>`, so listing tiles need no manual import"
---
::

## API Reference

::component-meta{:name="ProductTileFlag"}
::
