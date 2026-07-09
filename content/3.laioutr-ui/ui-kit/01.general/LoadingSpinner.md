---
title: Loading Spinner
description: An animated spinner indicating loading or processing state.
playground:
  name: LoadingSpinner
  base: ui-kit-atoms-loadingspinner
  defaultStory: primary-loader-spinner
  height: 460px
links: []
seo:
  title: Loading Spinner
  description: An animated spinner indicating loading or processing state.
sitemap:
  loc: /laioutr-ui/ui-kit/general/loadingspinner
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

LoadingSpinner is the loading indicator used inside buttons, on top of pending content, and as a full-page loader. `variant` picks the shape (row or round), `colorScheme` matches the spinner color to the button tone it sits inside, and `size` is the canonical `'s'` / `'l'` scale with `'l'` as the default.

The component renders pure visual chrome; the consumer is responsible for any `role="status"` or `aria-live` wrapper that announces the loading state to assistive tech.

## Key Business & UX Benefits

- Inline feedback on add-to-cart and checkout buttons prevents double-submits, the single biggest source of duplicate-order support tickets.
- Color schemes that match button tones keep brand consistency on every action surface, from primary CTAs to secondary utilities.
- One indicator covers inline, overlay, and full-page loading patterns, so perceived wait time stays consistent across the flow.

:::tip
Pro-Tip from Larry: Match `colorScheme` to the surrounding action so a primary button's inline spinner reads as primary too.
:::

### Secondary

::component-code
---
:name: LLoadingSpinner
:story-height: 75px
story-id: ui-kit-atoms-loadingspinner--secondary-loader-spinner
title: Loading Spinner Secondary
---
```vue-template
<LLoadingSpinner variant="round" color-scheme="secondary" size="l" />
```
::

## Feature List

::features
---
items:
  - "Two variants ('row', 'round') cover inline-text spinners and full-area loaders from one component"
  - "`colorScheme` typed as `ButtonVariant`, so the spinner inside a Button picks up the matching tone automatically"
  - "Two sizes ('s', 'l') with 'l' as the default for full-area placements and 's' for inline-text use"
  - "BEM token-driven dots and circles (`round-spinner__small-dots--{variant}--{size}`) expose hooks for per-tone overrides"
  - "Renders pure SVG and CSS so it stays responsive to button width without layout shift"
---
::

## API Reference

::component-meta{:name="LoadingSpinner"}
::
