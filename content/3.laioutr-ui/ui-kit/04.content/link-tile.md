---
title: Link Tile
description: Category-promoting tile that routes to a Basic, Compact, or Big internal layout based on the `variant` prop.
playground:
  name: LinkTile
  base: ui-kit-molecules-linktile
  defaultStory: basic
  height: 460px
jiraIssueId: LUI-36
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=10798-228528&t=Ar5LTHJDEX3yaImj-4
    target: _blank
seo:
  title: Link Tile
  description: A category-promoting tile that routes to one of three internal layouts based on the `variant` prop.
sitemap:
  loc: /laioutr-ui/ui-kit/content/link-tile
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/content/linktilebasic
  - /laioutr-ui/ui-kit/content/linktilecompact
  - /laioutr-ui/ui-kit/content/linktilebig
---

## Overview

`LinkTile` promotes a category from anywhere outside the main navigation. It is the entry point that `CategoryCardGrid` and `CategoryCardSlider` render for each item, which is why their `variant` aliases share the `LinkTileVariant` type.

For mixed-media editorial tiles use [`Card`](/laioutr-ui/ui-kit/content/card). For the product-listing tile with pricing and add-to-cart, use [`ProductTileBasic`](/laioutr-ui/shop/product-tile-basic).

Pick a variant by the role the tile plays in the layout:

| `variant`            | Renders                              | Use for                                                  |
| -------------------- | ------------------------------------ | -------------------------------------------------------- |
| `'basic'`            | `LinkTileBasic`                      | Square tiles in standard category grids.                 |
| `'compact'`          | `LinkTileCompact`                    | Dense category grids and sliders with low chrome.        |
| `'compact-bordered'` | `LinkTileCompact` (outline variant)  | Same as compact, with an outline.                        |
| `'big'`              | `LinkTileBig`                        | Hero-scale category tiles on entry pages.                |

The tile accepts a promotional flag that auto-positions per variant. The router itself has no `surfaceTone` field; each sub-component (`LinkTileBasic`, `LinkTileCompact`, `LinkTileBig`) owns its own colouring and reads tone where it matters.

## Key Business & UX Benefits

- A single tile drives every category entry point on the storefront, so the homepage, sliders, and grids all promote categories with the same visual language.
- Built-in promo flag positioning per variant lets merchandisers push timed campaigns from Studio without filing a dev ticket each time.
- Three layouts under one router prop mean designers can swap density between hero and dense grids without rebuilding the page.

:::tip
Pro-Tip from Larry: Reach for `compact` or `compact-bordered` inside dense grids and sliders. Reserve `big` for hero placements where the imagery does the work.
:::

## Usage

### Basic

::component-code
---
:name: LLinkTile
story-id: ui-kit-molecules-linktilebasic--default-with-placeholder
---
::

### Compact

::component-code
---
:name: LLinkTile
story-id: ui-kit-molecules-linktilecompact--solid-light
---
::

### Big

::component-code
---
:name: LLinkTile
story-id: ui-kit-molecules-linktilebig--portrait
---
::

## Feature List

::features
---
items:
  - "Four variants ('basic', 'compact', 'compact-bordered', 'big') route to `LinkTileBasic`, `LinkTileCompact`, or `LinkTileBig` from one component"
  - "Shared `LinkTileVariant` type means `CategoryCardGrid` and `CategoryCardSlider` accept the same value, keeping homepage and slider tiles in sync"
  - "Built-in promotional flag auto-positions per variant, so merchandising can ship timed campaigns from Studio without dev help"
  - "Configurable in Studio (variant, media, copy, flag) so density swaps between hero and dense grid placements are content-only changes"
  - "Single `LinkTile` router prop lets pages swap density between hero and dense grids without rebuilding layout"
---
::

## API Reference

### LLinkTile (router)

::component-meta{:name="LinkTile"}
::

### LLinkTileBasic

::component-meta{:name="LinkTileBasic"}
::

### LLinkTileCompact

::component-meta{:name="LinkTileCompact"}
::

### LLinkTileBig

::component-meta{:name="LinkTileBig"}
::
