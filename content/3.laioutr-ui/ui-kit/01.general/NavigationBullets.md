---
title: Navigation Bullets
description: A navigation bullets component
playground:
  name: NavigationBullets
  base: ui-kit-molecules-navigationbullets
  defaultStory: primary
  height: 460px
seo:
  title: Navigation Bullets | Laioutr
  description: A navigation bullets component
sitemap:
  loc: /laioutr-ui/ui-kit/general/navigationbullets
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

NavigationBullets shows a row of bullet indicators for carousels, steppers, and multi-step flows. Users see where they are and can jump to any step or slide by clicking the matching bullet.

The bullets do not animate on initial mount; an `--animating` modifier gates the keyframes so the tick only fires when the user actually moves between slides.

## Key Business & UX Benefits

- Showing total slide count and current position encourages shoppers to view every carousel item instead of stopping after the first.
- Bullets are clickable jump targets, which is faster than swiping through long product carousels and lifts engagement on hero sliders.
- Gated entry animation prevents the distracting tick on page load, keeping the first impression of campaign hero carousels calm.

:::tip
Pro-Tip from Larry: Use bullets with carousels so users see how many slides there are and can jump to one.
:::

## Feature List

::features
---
items:
  - "`count` plus `activeIndices` props drive the bullet row, supporting single-active carousels and multi-select stepper UIs from one component"
  - "`@click` emits the clicked index, leaving slide selection in the parent so it stays in sync with Swiper or external state"
  - "`useSurfaceTone()` picks the matching tone variant automatically, so bullets read on light, dark, and white chrome without manual swaps"
  - "Animating modifier (`navigation-bullets__item--animating`) is gated to actual index changes, so bullets don't tick on initial mount"
  - "Localized `aria-label` per bullet via `navigationBullets.navigateToItem`, keeping screen-reader output sensible in every market"
---
::

## API Reference

::component-meta{:name="NavigationBullets"}
::
