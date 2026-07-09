---
title: Amount Pill
description: Compact numeric pill for cart counts, notification badges, and inline counters.
playground:
  name: AmountPill
  base: ui-kit-atoms-amountpill
  defaultStory: small-number
  height: 460px
seo:
  title: Amount Pill
  description: Compact numeric pill for cart counts and notification badges.
sitemap:
  loc: /laioutr-ui/ui-kit/general/amount-pill
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`AmountPill` is the compact numeric pill that sits next to cart icons, inbox icons, and any inline counter in headers and tabs. Three variants (`default`, `accent`, `subtle`) each bind to a fixed token set, so the pill reads consistently wherever you drop it.

## Key Business & UX Benefits

- Persistent cart count keeps shoppers aware of items in their basket, nudging them back to checkout from anywhere on the site.
- Three named variants align the pill with filter chips, cart badges, and variant-selection counters without per-call CSS.
- One small primitive covers cart badges, inbox counts, and filter tags, so chrome reads consistently across the storefront.

## Feature List

::features
---
items:
  - "Three variants ('default', 'accent', 'subtle') match filter chips, cart badges, and variant-selection counters"
  - "Numeric amount prop with built-in xs Text renders the count without a wrapper component"
  - "Default slot overrides the rendered amount when you need an icon, glyph, or custom markup instead"
  - "Design-token-driven background and text color per variant adapts to light, dark, and brand surfaces"
  - "BEM root class (`amount-pill--{variant}`) exposes a per-pill theming hook for chrome overrides"
---
::

## API Reference

::component-meta{:name="AmountPill"}
::
