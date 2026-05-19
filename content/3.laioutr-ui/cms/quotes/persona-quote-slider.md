---
title: Persona Quote Slider
description: Slider wrapping multiple `PersonaQuote` items.
seo:
  title: Persona Quote Slider | Laioutr
  description: Slider wrapping multiple PersonaQuote items.
sitemap:
  loc: /laioutr-ui/cms/quotes/persona-quote-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PersonaQuoteSlider` wraps multiple [`PersonaQuote`](/laioutr-ui/cms/quotes/persona-quote) items in a slider. Use it for testimonial walls and "what our customers say" sections.

When profile imagery isn't available or the layout calls for a more compact card, use [`QuoteCardSlider`](/laioutr-ui/cms/quotes/quote-card-slider) instead.

## Key Business & UX Benefits

- Rotates multiple customer stories in the same screen space, multiplying social proof without crowding the layout.
- Pairs face-led testimonials with smooth slide transitions, building trust on landing and brand pages that drive consideration.
- One slider component covers homepage walls and category-level "what customers say" sections from a single configuration.
- Editors order and curate testimonials in Studio, keeping the rotation fresh as new reviews come in.

## Usage

::component-code
---
:name: LPersonaQuoteSlider
:story-height: 400px
story-id: ui-sections-personaquoteslider--default
title: PersonaQuoteSlider Default
---
```vue-template
<PersonaQuoteSlider :persona-quotes="testimonials" />
```
::

## Feature List

::features
---
items:
  - "Wraps multiple PersonaQuote items in a slider for testimonial walls and 'what our customers say' sections"
  - "Rotates customer stories in the same screen space, multiplying social proof per pixel of layout"
  - "Pairs face-led testimonials with smooth slide transitions to build trust on landing and brand pages"
  - "A single configuration covers homepage walls and category-level proof rows"
  - "Editors order and curate testimonials in Studio so the rotation stays fresh as new reviews come in"
---
::

## API Reference

::component-meta{:name="PersonaQuoteSlider"}
::
