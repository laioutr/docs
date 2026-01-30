---
title: Inpage Navigation Big Grid
description: High-impact grid layout for large category nodes with independent node color modes and multiple format variants.
jiraIssueId: LUI-46
---

## Overview

Ideal for hero sections and prominent homepage placements. Unlike other navigation grids, does not propagate colorMode to child nodes - each CategoryNodeBig determines its own color mode based on image contrast requirements. Supports promotional badges to highlight sale or new categories. Alignment options apply consistently to both section headings and grid layout for visual coherence.

## Key Business & UX Benefits

- Hero-style category grid for home and entry pages so categories stand out.
- Square, landscape, and portrait formats fit different imagery.
- Independent color mode per node keeps contrast readable on each image.
- Optional header and promotional badges support campaigns.

:::tip
Pro-Tip from Larry: Use Inpage Navigation Big Grid for hero category sections so categories are prominent.
:::

## Usage

::component-code
---
:name: LuiInpageNavigationBigGrid
story-id: organisms-inpagenavigationbiggrid--grid-centered-squared
---
::

## Feature List

::features
---
items:
  - "Multiple node format variants: square, landscape, and portrait"
  - "Optional header and subline for section context"
  - "Left or center alignment for headlines and nodes"
  - "Independent color mode per node based on image contrast"
---
::

## API Reference

::component-meta{:name="InpageNavigationBigGrid"}
::
