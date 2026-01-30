---
title: Grid Card Content
description: A responsive card grid layout arranging content cards in 3 or 4 column configurations with consistent spacing.
jiraIssueId: LUI-16
---

## Overview

The Card Grid component enables visitors to browse multiple content options in a visually organized layout, supporting quick comparison and selection. It balances content density with readability through two column configurations: three-column layouts use larger cards for visual impact, while four-column layouts display more items. The component maintains consistent spacing and accessibility standards across different page contexts.

## Key Business & UX Benefits

- One grid for content cards with 3 or 4 columns so layouts stay consistent.
- Responsive column count fits mobile and desktop without custom code.
- Optional section title and alignment keep the section flexible.
- Consistent spacing and accessibility across cards.

:::tip
Pro-Tip from Larry: Use Grid Card Content for category or content grids so cards align and scale with the viewport.
:::

## Usage

:component-code{name="LuiGridCardContent" story-id="molecules-gridcardcontent--with-media"}

## Feature List

::features
---
items:
  - "Responsive grid adapting from 1-4 cards per row based on screen size"
  - "Automatic card sizing (large for 3-column, default for 4-column)"
  - "Optional section title with responsive max-width constraints"
  - "Container-based layout with configurable content alignment"
---
::

## API Reference

::component-meta{:name="LuiGridCardContent"}
::
