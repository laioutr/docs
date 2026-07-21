---
title: Category Card Slider
description: Horizontal slider of category tiles for listing pages and category browsing.
playground:
  name: CategoryCardSlider
  base: ui-sections-categorycardslider
  defaultStory: basic
  height: 460px
jiraIssueId: LUI-38
seo:
  title: Category Card Slider
  description: Horizontal slider of category tiles for listing pages and category browsing.
sitemap:
  loc: /laioutr-ui/shop/category-card-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/shop/inpagenavigationbasicslider
  - /laioutr-ui/shop/inpagenavigationbigslider
  - /laioutr-ui/shop/inpagenavigationcompactslider
---

## Overview

`CategoryCardSlider` is the swipeable counterpart to [`CategoryCardGrid`](/laioutr-ui/shop/category-card-grid). It renders a horizontal strip of [`LinkTile`](/laioutr-ui/ui-kit/content/link-tile)s, typically used under a listing-page title to surface subcategories without crowding the page. Navigation chrome stays visible across breakpoints (`watchOverflow` is off in the swiper config) so shoppers always have a reach for the next tile.

The `variant` prop picks the per-tile layout:

| `variant`            | When to use                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `'basic'`            | Standard subcategory strip.                                              |
| `'compact'`          | Dense strips under listing titles.                                       |
| `'compact-bordered'` | Compact tile with a border for visual separation on busy backgrounds.    |
| `'big'`              | Hero-grade tiles on landing pages.                                       |

Auto-import tag: `<LCategoryCardSlider>`.

## Key Business & UX Benefits

- Horizontal strip surfaces subcategories without crowding the page, keeping the listing grid above the fold where shoppers expect it.
- Same four variants as the grid component let merchandising switch between strip and grid presentations without rewriting templates.
- Touch-first swipe behavior matches the gesture shoppers already use on mobile, which is now the majority of commerce traffic.
- `navigationPosition` and `hasScrollbar` props let teams tune the chrome around the strip without touching the swiper config.

:::tip
Pro-Tip from Larry: Use `compact` for dense subcategory strips under listing titles; `big` for hero-grade tiles on landing pages.
:::

## Feature List

::features
---
items:
  - "Same four variants as CategoryCardGrid ('basic', 'compact', 'compact-bordered', 'big') so layouts swap between strip and grid with no template rewrite"
  - "Navigation chrome stays visible across breakpoints so the next tile is always one tap away"
  - "Touch-first swipe behavior matches the gesture shoppers already use on mobile listing pages"
  - "Built on LinkTile so every tile is an accessible link with its own focus state"
  - "Aliases preserve legacy URL paths (inpagenavigationbasicslider, bigslider, compactslider) so existing campaigns stay live"
---
::

## API Reference

::component-meta{:name="CategoryCardSlider"}
::
