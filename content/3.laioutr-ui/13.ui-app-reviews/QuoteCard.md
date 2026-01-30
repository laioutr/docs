---
title: Quote Card
description: Quote card component for displaying customer reviews and testimonials.
jiraIssueId: LUI-25
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=7409-40884&m=dev
    target: _blank
---

## Overview

The Quote Card component presents customer testimonials in a compact, visually appealing format ideal for sliders, grids, or inline content. It offers five visual style variants to match different page designs. Optional elements include star ratings (with themed colors matching the card style), author avatars, and company logos with standardized sizing constraints. Content can be left or center aligned. Use this when profile pictures are unavailable or when a simpler presentation than the Persona Quote is preferred.

## Key Business & UX Benefits

- Compact testimonial card for sliders and grids so social proof is visible without a full block.
- Five style variants and optional star rating fit different designs.
- Author info and company logo add credibility.
- Left or center alignment fits different layouts.

:::tip
Pro-Tip from Larry: Use Quote Card for review sliders so testimonials are scannable at a glance.
:::

## Usage

::component-code
---
:name: LuiQuoteCard
story-id: molecules-quote-quotecard--default-center-with-stars
---
::

## Feature List

::features
---
items:
  - "Five card style variants (default, dark, bright, outline, haptic)"
  - "Optional star rating with themed variants"
  - "Author info with profile picture and additional details"
  - "Company logo support with standardized sizing"
---
::

## API Reference

::component-meta{:name="QuoteCard"}
::
