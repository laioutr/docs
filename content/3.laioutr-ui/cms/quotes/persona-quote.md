---
title: Persona Quote
description: A testimonial component pairing a profile picture with a quote, personal details, and optional company branding.
playground:
  name: PersonaQuote
  base: ui-blocks-personaquote
  defaultStory: default
  height: 460px
jiraIssueId: LUI-24
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=7368-32242&t=WmdxQg1pxxyigx8X-4
    target: _blank
seo:
  title: Persona Quote | Laioutr
  description: A testimonial component pairing a profile picture with a quote and personal details.
sitemap:
  loc: /laioutr-ui/cms/quotes/persona-quote
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/quotes/personalquote
---

## Overview

`PersonaQuote` shows a single testimonial centered on a profile picture, with quote text, persona name and details, and an optional company logo. Three profile-picture styles (speech bubble, round, square) and surface-tone-aware backgrounds adapt the component to any brand.

For multiple testimonials, wrap several `PersonaQuote`s with [`PersonaQuoteSlider`](/laioutr-ui/cms/quotes/persona-quote-slider). If a profile image isn't available, reach for [`QuoteCard`](/laioutr-ui/cms/quotes/quote-card) instead.

## Key Business & UX Benefits

- A face plus a quote is the most credible form of social proof, lifting trust on landing and brand pages where conversion depends on belief.
- Three profile-picture styles (speech bubble, round, square) adapt the testimonial to story-driven or grid layouts without restyling.
- Surface-tone awareness lets the same testimonial sit on light, dark, or photographic backgrounds while staying legible.
- Editors swap quotes per market or campaign in Studio, keeping the social proof locally relevant as the brand expands.

:::tip
Pro-Tip from Larry: Choose the speech-bubble profile style when the testimonial sits inside a story-driven layout; round or square work better in grids.
:::

## Feature List

::features
---
items:
  - "Three profile-picture styles (speech bubble, round, square) adapt the testimonial to story-driven or grid layouts"
  - "Profile picture plus quote, persona name and details, and an optional company logo form a complete credibility unit"
  - "Surface-tone-aware backgrounds keep the testimonial readable on light, dark, and photographic surfaces"
  - "Editors swap quotes per market or campaign in Studio, keeping social proof locally relevant"
  - "Pair with PersonaQuoteSlider when multiple testimonials should rotate in the same slot"
  - "Reach for QuoteCard when a profile image isn't available or a simpler presentation fits better"
---
::

## API Reference

::component-meta{:name="PersonaQuote"}
::
