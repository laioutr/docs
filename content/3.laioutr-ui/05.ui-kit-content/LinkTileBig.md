---
title: Link Tile Big
description: Large-format category node with multiple aspect ratios, text overlay options, and gradient overlays for prominent in-page navigation.
jiraIssueId: LUI-45
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=10798-228528&t=Ar5LTHJDEX3yaImj-4
    target: _blank
---

## Overview

Ideal for hero-style category navigation on homepages and entry pages. Supports promotional badges like "Sale" or "New" with themed flag positioning. Full interaction states (default, hover, pressed, focus) provide clear feedback. Gradient opacity is adjustable to balance image visibility with text readability, and the component uses LuiImageContrastOverlay for dark image variants.

## Key Business & UX Benefits

- Hero-style category tiles draw attention on home and entry pages.
- Square, landscape, and portrait ratios fit different layouts and imagery.
- Text on image or below image supports flexible content and readability.
- Gradient overlay and badges (Sale, New) support promotions and clarity.

:::tip
Pro-Tip from Larry: Use portrait or landscape for hero category tiles so they stand out on the page.
:::

## Usage

::component-code
---
:name: LinkTileBig
story-id: ui-kit-linktilebig--portrait
---

::

## Feature List

::features
---
items:
  - "Three image aspect ratios: square (1:1), landscape, and portrait"
  - "Text positioning options: on image or below image"
  - "Optional gradient overlay for improved text readability on dark images"
  - "Customizable background color per node"
---
::

## API Reference

::component-meta{:name="LinkTileBig"}
::
