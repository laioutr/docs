---
title: Brand List
description: A-Z grouped text-link directory of brands for "shop by brand" entry points.
playground:
  name: BrandList
  base: ui-sections-brandlist
  defaultStory: default
  height: 460px
seo:
  title: Brand List | Laioutr
  description: A-Z grouped text-link directory of brands.
sitemap:
  loc: /laioutr-ui/cms/brand-list
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/iOpGWO38HkhnTYkEeEq8Oz/Laioutr-Basic?node-id=89-298202&t=WsyhlVHQyGVajZ9T-4
    target: _blank
---

## Overview

`BrandList` renders an A-Z grouped directory of brand links. Brands passed via the `brands` prop are sorted with the active locale's collator, then grouped by the first character of each name into alphabetical sections. Each row is a text link with an optional count pill, suited to "shop by brand" entry points and partner directories.

## Key Business & UX Benefits

- Opens a clear "shop by brand" path, a high-intent navigation pattern that lifts conversion for multi-brand merchants.
- A-Z grouping with locale-aware sorting helps shoppers scan a long brand list without scrolling endlessly.
- Optional per-brand counts hint at catalogue depth, nudging shoppers toward brands with more on offer.
- Editors maintain the brand array in Studio, so directories stay current as partnerships evolve.

## Feature List

::features
---
items:
  - "A-Z grouped directory built from the brands array, with locale-aware collation"
  - "Each row is a text link with optional product count, sized for dense partner registries"
  - "Groups appear in alphabetical order with non-alphanumeric entries pushed to the end"
  - "Opens a 'shop by brand' navigation path, a high-intent pattern for multi-brand merchants"
  - "Editors maintain the brands list in Studio as partnerships evolve"
---
::

## API Reference

::component-meta{:name="BrandList"}
::
