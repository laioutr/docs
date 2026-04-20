---
title: Z-Ordering
description: Keep overlays and sticky elements predictable across sections — without z-index leaks that create visual bugs when pages change.
seo:
  title: Z-Ordering | Laioutr
  description: Keep overlays and sticky elements predictable across sections — without z-index leaks that create visual bugs when pages change.
sitemap:
  loc: /frontend/features/z-ordering
  lastmod: 2026-04-20
  changefreq: monthly
  priority: 0.6
---

## Predictable layering across a composable storefront

In a composable storefront, pages are assembled from independent sections that can be reordered frequently — especially by non-technical users in Studio. Without guardrails, a small styling choice inside one section (like a `z-index` on navigation arrows) can accidentally overlap or hide content in another section after a reorder. These regressions are hard to spot in review and expensive to debug once they reach production.

Laioutr’s **z-ordering approach** is designed to keep visual layering **stable and predictable**, so teams can iterate on page layout without introducing accidental “UI collisions”.

## What you get

- **Safer content changes**: Reordering sections doesn’t suddenly cause UI elements from one section to paint over another.
- **Fewer visual production bugs**: Layering issues (hidden CTAs, overlapping menus, broken modals) are reduced because layering rules are consistent.
- **Consistent overlays across teams**: Sticky bars, dropdowns, modals, and tooltips follow a shared z-index scale instead of ad-hoc numbers.

## When this matters most

- **Editor-driven pages**: Landing pages, campaigns, and homepages that change weekly.
- **Mixed ownership**: Multiple teams shipping sections independently.
- **Overlay-heavy UIs**: Filters, sticky headers, drawers, dialogs, dropdown menus, tooltips, and toasts.

## Technical reference

The implementation details (section isolation, stacking contexts, and the z-index token scale) are documented in the Laioutr UI technical guide:

- [Z-Ordering (Laioutr UI)](/laioutr-ui/getting-started/z-ordering)

