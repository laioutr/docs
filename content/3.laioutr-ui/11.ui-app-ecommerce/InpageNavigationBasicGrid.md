---
title: Inpage Navigation Basic Grid
description: Flexible grid layout for displaying basic category nodes on entry pages with customizable alignment and headings.
jiraIssueId: LUI-37
---

## Overview

Guides users into product categories on homepages and landing pages. Show more link renders as an additional node at the end of the grid. Integrates with CategoryNodeBasic components and LuiText for typography. Responsive breakpoint handling adapts layout for mobile and desktop viewports.

## Key Business & UX Benefits

- Surfaces category links on home and landing pages so users can browse without the main nav.
- Grid layout and optional header keep the section scannable.
- Show more link and flags support promotions and deeper discovery.
- Responsive breakpoints fit mobile and desktop layouts.

:::tip
Pro-Tip from Larry: Use Inpage Navigation Basic Grid on the homepage so categories are visible at a glance.
:::

## Usage

::component-code
---
:name: LuiInpageNavigationBasicGrid
story-id: organisms-inpagenavigationbasicgrid--grid-on-light-background
---
::

## Feature List

::features
---
items:
  - "Multiple color modes: on-light, on-dark, on-bright"
  - "Three alignment options: left, center, and auto spacing"
  - "Optional header, subline, and show more link"
  - "Support for flagged category nodes with promotional badges"
---
::

## API Reference

::component-meta{:name="InpageNavigationBasicGrid"}
::
