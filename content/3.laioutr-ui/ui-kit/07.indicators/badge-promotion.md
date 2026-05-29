---
title: Badge Promotion
description: Promotional badge atom for product tiles and pricing with promo, sale, new, and icon variants.
playground:
  name: BadgePromotion
  base: ui-kit-atoms-badgepromotion
  defaultStory: default
  height: 460px
links: []
seo:
  title: Badge Promotion | Laioutr
  description: Promotional badge atom for product tiles and pricing.
sitemap:
  loc: /laioutr-ui/ui-kit/indicators/badge-promotion
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/indicators/savingsbadge
---

## Overview

`BadgePromotion` is the promotional badge atom for product tiles and pricing. The discriminated `variant` prop picks the visual treatment:

| `variant`  | Use for                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `'promo'`  | Generic promotional callouts (gift-with-purchase, bundle, free shipping).     |
| `'sale'`   | Discount callouts, usually paired with `savingPercentage`.                    |
| `'new'`    | Fresh-stock or new-arrival callouts.                                          |
| `'icon'`   | Icon-only badges driven by the `icon` prop.                                   |

The BEM root class is `.badge-promotion` and the locale namespace is `badgePromotion.*`.

## Key Business & UX Benefits

- One promotional badge covers gift-with-purchase, sale, new arrival, and icon callouts, so storefronts stay visually coherent across every campaign.
- A typed `variant` prop forces merchandisers and engineers onto a fixed set of promo treatments, preventing rogue one-off styles from creeping into PDPs and PLPs.
- Locale namespace `badgePromotion.*` keeps copy translation-ready, so country sites can swap "Sale" for the local term without code changes.
- Pairing `savingPercentage` with `variant="sale"` puts the discount front and center, which lifts click-through on promo grids and supports markdown-driven AOV.

:::tip
Pro-Tip from Larry: Use `variant="sale"` with a `savingPercentage` when you want the discount visible at a glance, and `variant="new"` (no percentage) for fresh-stock callouts.
:::

## Usage

::component-code
---
:name: LBadgePromotion
story-height: 60px
story-id: ui-kit-atoms-badgepromotion--saving-percentage
---
```vue-template
<LBadgePromotion variant="sale" :saving-percentage="10" />
```
::

## Feature List

::features
---
items:
  - "Four discriminated `variant` values ('promo', 'sale', 'new', 'icon') keep merchandising on a fixed set of promo treatments"
  - "`savingPercentage` pairs with `variant=\"sale\"` to put the discount front and center on promo grids"
  - "`variant=\"icon\"` drives icon-only badges through the `icon` prop, so glyph-led promos share the same primitive"
  - "Locale namespace `badgePromotion.*` keeps every variant's copy translation-ready out of the box"
  - "BEM root class `.badge-promotion` anchors per-variant theme overrides without prop sprawl"
---
::

## API Reference

::component-meta{:name="BadgePromotion"}
::
