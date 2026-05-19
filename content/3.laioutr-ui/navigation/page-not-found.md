---
title: Page Not Found
description: 404 page composition with illustration, heading, subline, and a back-to-home call to action.
seo:
  title: Page Not Found | Laioutr
  description: 404 page composition.
sitemap:
  loc: /laioutr-ui/navigation/page-not-found
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PageNotFound` is the 404 page composition. It renders a theme-aware background illustration (or a custom `media` prop), the supplied `headline` and `subline`, and an optional `cta` button. `headline` and `subline` are required; the component does not fall back to default 404 copy. Pass `surfaceTone` (`'light' | 'dark'`) to match the page background.

## Key Business & UX Benefits

- A dead-end becomes a recovery path, with a clear back-to-home CTA that pulls otherwise-lost traffic back into the funnel instead of bouncing.
- Branded illustration and copy turn an error state into an on-brand moment, softening a frustrating experience for the visitor.
- `surfaceTone` matches the page background, so the 404 reads correctly inside dark themes, light themes, and seasonal campaigns without one-off styling.

## Usage

::component-code
---
:name: LPageNotFound
:story-height: 600px
story-id: ui-sections-pagenotfound--default-background-images
title: PageNotFound Default
---
```vue-template
<PageNotFound
  headline="Page not found"
  subline="The page you were looking for has moved or never existed."
  surface-tone="light"
  :cta="{ text: 'Back to home', href: '/' }"
/>
```
::

## Feature List

::features
---
items:
  - "Pre-composed 404 layout with illustration, heading, subline, and a back-to-home CTA"
  - "`surfaceTone` prop matches the page background so the screen reads correctly on dark and light themes"
  - "Back-to-home call to action recovers traffic that would otherwise bounce from the dead-end"
  - "Branded illustration and copy turn the error state into an on-brand recovery moment"
  - "Drop-in composition that ships as a single section without per-page wiring"
---
::

## API Reference

::component-meta{:name="PageNotFound"}
::
