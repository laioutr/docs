---
title: Link Tile Basic
description: Classic category node element for promoting categories outside navigation.
jiraIssueId: LUI-36
---

## Overview

The LinkTileBasic component serves as the foundational building block for category promotion outside the main navigation. This is especially important on mobile where the main menu is hidden behind a hamburger. It uses a 1:1 square image ratio with customizable background colors. Flag corner positioning is determined by the node variant to maintain visual harmony. The see-more variant allows linking to supercategory or listing pages with either category IDs or custom URLs.

## Key Business & UX Benefits

- Surfaces categories on mobile and in-content without relying on the main nav.
- 1:1 ratio and background colors keep grids consistent and on-brand.
- Sale and default variants with flags support promotions without extra components.
- See-more variant links to supercategory or listing pages for deeper discovery.

:::tip
Pro-Tip from Larry: Use it on mobile so categories are visible without opening the hamburger menu.
:::

## Usage

::component-code
---
:name: LinkTileBasic
story-id: ui-kit-linktilebasic--default-with-placeholder
---

::

## Feature List

::features
---
items:
  - "Multiple color modes: on-light, on-dark, on-bright"
  - "Default and sale variants with different color schemes"
  - "Optional promotional flag support with auto positioning"
  - "See more variant for linking to supercategory pages"
---
::

## API Reference

::component-meta{:name="LinkTileBasic"}
::
