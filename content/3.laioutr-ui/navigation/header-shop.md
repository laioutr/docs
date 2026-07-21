---
title: Header Shop
aliases:
  - /laioutr-ui/navigation/shopheader
description: E-commerce header with mega-menu, side-by-side, or dropdown navigation plus cart, account, wishlist, and search.
playground:
  name: HeaderShop
  base: ui-sections-headershop
  defaultStory: default
  height: 460px
seo:
  title: Header Shop
  description: E-commerce header with mega menu / side-by-side / dropdown navigation, cart, account, wishlist, and search.
sitemap:
  loc: /laioutr-ui/navigation/header-shop
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1
  videos: []
  images: []
jiraIssueId: LUI-211
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13254-120608&t=gY1zYbY2NWGSIZKZ-4
    target: _blank
---

## Overview

`HeaderShop` is the full-featured e-commerce header for stores with sizeable catalogs. The utility row carries the logo, an inline desktop search bar (`SearchAutoSuggest`), and icon buttons for customer account, wishlist, cart, and the mobile menu trigger. Cart and wishlist icons render a numeric badge driven by the `cartCount` and `wishlistCount` props.

Composition is slot-based. The `desktop` and `mobile` named slots accept any menu component; typical fills are [`MenuSideBySide`](/laioutr-ui/navigation/menu-side-by-side) or [`MegaMenu`](/laioutr-ui/navigation/mega-menu) for desktop and [`MobileMenuShop`](/laioutr-ui/navigation/mobile-menu-shop) for the mobile drawer. The header itself emits `search`, `loginClick`, `cartClick`, and `menuClick`, and exposes a `v-model:searchTerm` for the search input.

When `sticky` is enabled (default), the header uses `useScroll` to track vertical position: after the user scrolls past \~150px it switches into a fixed off-screen state, and on scroll-up it slides back into view via a translate transition. A sentinel reserves the original space so the layout does not jump.

The mobile search input has two variants controlled by `searchBarMobile`:

- `'search-icon'` (default): only a search icon shows in the icon row; tapping it opens the search modal.
- `'visible-search'`: a full-width `InputSearch` renders below the icon row until the header becomes fixed, at which point it collapses back to the icon.

Pick the menu component by catalog shape: `MenuSideBySide` for deep hierarchies, `MegaMenu` for wide breadth.

## Key Business & UX Benefits

- Cart, account, wishlist, and search sit in one utility row, putting the core conversion actions within thumb reach on every page of the store.
- Swappable desktop menu blocks (mega menu, side-by-side) mean the same header fits a fashion retailer with 500 SKUs and a marketplace with 50,000 without rewriting the navigation.
- Sticky reveal-on-scroll-up keeps the header out of the way while customers browse but brings it back the moment they look for it, so the cart and search are always one gesture away.
- Cart and wishlist badge counts bind directly to props, so live cart updates show up in the chrome without bespoke wiring per project.

::tip
Pro-Tip from Larry: Choose the menu block based on category depth. Side-by-side suits deep hierarchies; mega menu suits breadth across categories.
::

## Usage

::component-code{:name="LHeaderShop" story-id="ui-sections-headershop--default"}
::

## Feature List

::features
---
items:
  - Utility row carries logo, inline desktop `SearchAutoSuggest`, plus icon
    buttons for account, wishlist, cart, and mobile menu
  - "`cartCount` and `wishlistCount` props drive numeric badges on the cart and
    wishlist icons"
  - "`desktop` and `mobile` named slots accept any menu component; typical fills are `MenuSideBySide`, `MegaMenu`, or `MobileMenuShop`"
  - Sticky reveal uses `useScroll` to slide the header off after ~150px and back
    into view on scroll-up, with a sentinel reserving space
  - "`searchBarMobile` of `'search-icon'` or `'visible-search'` switches between
    an icon trigger and an inline `InputSearch` on phones"
  - "`v-model:searchTerm` plus `search`, `loginClick`, `cartClick`, and
    `menuClick` emits give the section full control of the chrome"
---
::

## API Reference

::component-meta{:name="HeaderShop"}
::
