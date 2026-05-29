---
title: Quote Card
description: Compact testimonial card with optional star rating, author info, and company logo, with left or center alignment.
playground:
  name: QuoteCard
  base: ui-blocks-quotecard
  defaultStory: default
  height: 460px
jiraIssueId: LUI-25
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=7409-40884&m=dev
    target: _blank
seo:
  title: Quote Card | Laioutr
  description: Compact testimonial card for sliders, grids, or inline content.
sitemap:
  loc: /laioutr-ui/cms/quotes/quote-card
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/reviews/quotecard
---

## Overview

`QuoteCard` presents a customer testimonial in a compact, visually clean format for sliders, grids, or inline content blocks. The `align` prop (`left` or `center`) controls the layout: left aligns the avatar next to the text, center stacks avatar above text. Optional star rating (with themed colors), author avatar, and company logo add credibility.

Reach for `QuoteCard` when profile pictures aren't available or when a simpler presentation than [`PersonaQuote`](/laioutr-ui/cms/quotes/persona-quote) is preferred. For multiple testimonials in a slider, wrap with [`QuoteCardSlider`](/laioutr-ui/cms/quotes/quote-card-slider).

## Key Business & UX Benefits

- A compact testimonial card slots into product grids, sliders, and inline blocks, so social proof shows up where shoppers decide.
- The optional star rating turns a soft quote into a hard signal, which lifts conversion on PDP and category pages.
- The `align` switch lets the same card sit naturally inside left-aligned editorial copy or centered hero rows without restyling.
- Editors compose review rotations in Studio without engineering, keeping the freshest customer voices visible at any moment.

:::tip
Pro-Tip from Larry: Use `QuoteCard` for review sliders (`QuoteCardSlider`); use `PersonaQuote` when the testimonial benefits from a large profile image.
:::

## Feature List

::features
---
items:
  - "Single align prop (left or center) controls whether the avatar sits beside or above the text"
  - "Optional star rating with themed colors turns a soft quote into a hard signal"
  - "Author avatar and company logo add credibility while keeping the card compact"
  - "Per-element color overrides (text, quote, position, company, avatar info) let the card match themed sections"
  - "Editors compose review rotations in Studio without engineering, keeping fresh customer voices visible"
  - "Pair with QuoteCardSlider for review rotations; pair with PersonaQuote when a large profile image is available"
---
::

## API Reference

::component-meta{:name="QuoteCard"}
::
