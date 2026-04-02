---
title: Swatch Preview
description: Utility component for rendering swatch previews including colors, gradients, and thumbnails.
jiraIssueId: LUI-121
seo:
  title: Swatch Preview | Laioutr
  description: Utility component for rendering swatch previews including colors, gradients, and thumbnails.
---

## Overview

SwatchPreview is a foundational atom component that renders visual representations of product variant attributes without any decorative styling. It handles multiple swatch types: single colors, multi-color combinations, CSS gradients rendered at a diagonal angle, and thumbnail images at 1:1 aspect ratio. The component intentionally omits borders and border-radius, delegating visual treatment to consuming parent components for maximum reusability across different UI contexts including buybox variant selectors, product cards, and filter interfaces.

## Key Business & UX Benefits

- One component for colors, gradients, and thumbnails across the app.
- Stays flexible so parents control borders and layout.
- Fits buybox, cards, and filters with consistent behavior.
- Keeps implementation simple with minimal styling.

:::tip
Pro-Tip from Larry: Let the parent add borders and radius so SwatchPreview stays reusable everywhere.
:::

## Usage

::component-code
---
:name: Swatch Preview
story-height: 140px
story-id: ui-kit-swatchpreview--swatch-colors
---
::

## Feature List

::features
---
items:
  - "Single color and multi-color swatch rendering"
  - "Gradient display at bottom-left to top-right angle"
  - "Image thumbnails with 1:1 aspect ratio"
  - "Flexible sizing controlled by parent CSS"
---
::

## API Reference

::component-meta{:name="SwatchPreview"}
::
