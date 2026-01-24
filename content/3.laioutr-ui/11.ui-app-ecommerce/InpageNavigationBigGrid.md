---
title: Inpage Navigation Big Grid
description: High-impact grid layout for large category nodes with independent node color modes and multiple format variants.
jiraIssueId: LUI-46
---

## Overview

Ideal for hero sections and prominent homepage placements. Unlike other navigation grids, does not propagate colorMode to child nodes - each CategoryNodeBig determines its own color mode based on image contrast requirements. Supports promotional badges to highlight sale or new categories. Alignment options apply consistently to both section headings and grid layout for visual coherence.

## Usage

::component-code
---
:name: LuiInpageNavigationBigGrid
story-id: organisms-inpagenavigationbiggrid--grid-centered-squared
---
::

## Features

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
