---
title: Swatch
aliases:
  - /laioutr-ui/ui-kit/general/swatchpreview
description: Bare swatch primitive for rendering colors, gradients, and thumbnails.
seo:
  title: Swatch | Laioutr
  description: Bare swatch primitive for rendering colors, gradients, and thumbnails.
sitemap:
  loc: /laioutr-ui/ui-kit/general/swatch
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1
  videos: []
  images: []
jiraIssueId: LUI-121
---

## Overview

Swatch is the bare primitive that renders the visual representation of a product variant: a single color, a multi-color combination, a diagonal gradient, or a thumbnail at 1:1. It intentionally ships without border, border-radius, or padding so the parent ([`SwatchChip`](/laioutr-ui/ui-kit/general/swatch-chip), [`SwatchOption`](/laioutr-ui/ui-kit/general/swatch-option), filter UIs, buybox, etc.) can apply whatever chrome fits its context.

For the row-of-chips with overflow used on product tiles, use [`SwatchSummary`](/laioutr-ui/ui-kit/general/swatch-summary).

## Key Business & UX Benefits

- One primitive renders solid, multi-color, gradient, and thumbnail swatches, so variant data from any connector maps to a single visual model.
- Chromeless design lets each context (filter, listing, buybox) define its own chrome, keeping bespoke design work contained at the parent level.
- A consistent variant visual across filters, tiles, and PDPs reduces shopper confusion when matching the color they picked in the filter.

::tip
Pro-Tip from Larry: Let the parent add borders and radius so Swatch stays reusable everywhere.
::

## Usage

::component-code
---
:name: LSwatch
story-height: 140px
story-id: ui-kit-atoms-swatch--swatch-colors
---
::

## Feature List

::features
---
items:
  - "Single typed `Swatch` tuple covers four fill modes: 'color' (solid string),
    'colors' (multi-color strips), 'gradient' (diagonal linear-gradient),
    'image' (Media thumbnail at 1:1)"
  - "Chromeless by design: no border, radius, or padding, so parents
    (`SwatchChip`, `SwatchOption`, buybox) own the surrounding chrome"
  - Image swatches render through `<LMedia>` at 64x64 with `sizes="64px"`, so
    connector thumbnails ship the right variant
  - Renders an empty `.swatch` placeholder when `swatch` is undefined, keeping
    grid alignment stable while data loads
  - Gradient mode joins the value array into a `linear-gradient(to top right,
    ...)`, so multi-stop palettes need no string preprocessing
---
::

## API Reference

::component-meta{:name="Swatch"}
::
