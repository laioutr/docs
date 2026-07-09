---
title: Card
description: Flexible content card with mixed media and text for marketing tiles, editorial highlights, and feature callouts.
playground:
  name: Card
  base: ui-kit-molecules-card
  defaultStory: default
  height: 460px
jiraIssueId: LUI-253
seo:
  title: Card
  description: Flexible content card with mixed media and text for marketing tiles, editorial highlights, and feature callouts.
sitemap:
  loc: /laioutr-ui/ui-kit/content/card
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Card is a content container that pairs an image (or any media slot) with text: caption, heading, subline, description, icon, and an optional call-to-action. When you set `href`, the whole tile becomes a single click target.

Pick a variant by the role the card plays in the layout:

| `variant`   | When to use                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `'plain'`   | Borderless layout for editorial grids and mixed-media collections.                                   |
| `'outline'` | Soft border that gains a gradient ring on hover or focus. The standard interactive card.             |
| `'haptic'`  | Elevated card with a shadow that deepens on hover. Best for hero placements that should feel tappable. |

Pass `aspectRatio` (`'16/9'`, `'4:3'`, or a numeric ratio) so card grids stay aligned across cards with different image dimensions.

Related content tiles:

- [`LinkTile`](/laioutr-ui/ui-kit/content/link-tile) — category-promoting tile with basic, compact, and big layouts.
- [`ProductTileBasic`](/laioutr-ui/shop/product-tile-basic) — the product-listing tile with pricing, swatches, and add-to-cart.

## Key Business & UX Benefits

- One component covers marketing tiles, feature callouts, and editorial highlights without per-block CSS or bespoke layouts.
- Three visual variants and a single `aspectRatio` prop keep card grids aligned and on-brand across breakpoints, even when imagery comes from different sources.
- Full-card click target with built-in hover and focus states improves usability on touch, mouse, and keyboard alike.
- Editors compose card blocks in Studio without dev help, so marketing teams ship campaigns faster.

:::tip
Pro-Tip from Larry: Set `aspectRatio` on every card in a grid so columns line up even when the images come from different sources.
:::

## Usage

::component-code{name="LCard" story-id="ui-kit-molecules-card--default" story-height="500px"}
::

## Feature List

::features
---
items:
  - "Three variants ('plain', 'outline', 'haptic') for editorial grids, standard tiles, and tappable hero placements"
  - "Single aspectRatio prop keeps every card in a grid aligned across mixed-media sources"
  - "Full-card click target with built-in hover and focus states when href is set"
  - "Inline CardCta with its own variant, size, and icon props for tailored call-to-action treatment"
  - "Configurable in Studio (variants, copy, CTA, media) so marketing teams swap content without dev help"
  - "Themed via design tokens and a BEM root class for per-card overrides"
---
::

## API Reference

::component-meta{:name="Card"}
::
