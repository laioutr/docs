---
title: Mobile Menu (Shop)
description: Mobile off-canvas drawer paired with `HeaderShop`, hosting a root grid plus a drill-in child menu, login, and locale.
seo:
  title: Mobile Menu (Shop) | Laioutr
  description: Mobile off-canvas drawer for the shop header.
sitemap:
  loc: /laioutr-ui/navigation/mobile-menu-shop
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`MobileMenuShop` is the catalog-aware off-canvas drawer that pairs with [`HeaderShop`](/laioutr-ui/navigation/header-shop). It renders a root menu (grid + nav links + locale/dark-mode) plus a drill-in child menu animated via a slide transition; child menus rely on the `mobileMenuNavigationKey` provide/inject context exposed by the root. The drawer also surfaces login state and a locale-change emit without crowding the main header.

Pass items, social links, locale select, and the mode switcher as props on `MobileMenuShop`. Reuse the same `navigationMenuItems` on [`MenuSideBySide`](/laioutr-ui/navigation/menu-side-by-side) so the catalog stays in lockstep between desktop and mobile.

## Key Business & UX Benefits

- Tappable category grid on entry gives mobile shoppers a fast lane to top-selling sections, lifting conversion on the surface where most ecommerce traffic now lands.
- Drill-in child menus with slide transitions handle deep catalogs without a wall of nested lists, so even large stores keep the mobile menu fast to scan and quick to use.
- Login, locale, and dark mode live inside the drawer, which keeps the visible header lean and protects ad-driven first impressions on mobile.
- Shared category data with `BlockMenuSideBySide` keeps desktop and mobile in sync, so a single catalog edit does not require parallel mobile work.

:::tip
Pro-Tip from Larry: Share `navigationMenuItems` across `MenuSideBySide` (desktop) and `MobileMenuShop` (mobile) so a category change ships to both breakpoints at once.
:::

## Usage

::component-code
---
:name: LMobileMenuShop
story-id: ui-features-mobilemenushop--default
---
::

## Feature List

::features
---
items:
  - "Root view combines a tappable category grid with nav links and locale/dark-mode controls for fast top-level access"
  - "Drill-in child menus animate via a slide transition for deep catalogs without nested-list overload"
  - "Child menus rely on the `mobileMenuNavigationKey` provide/inject context exposed by the root"
  - "Login state and a `localeChange` emit sit inside the drawer, keeping the visible header lean on phones"
  - "Pairs with `HeaderShop` — mount it inside the header's `mobile` slot"
  - "Shares `navigationMenuItems` with `MenuSideBySide` so a single catalog edit ships to both breakpoints"
---
::

## API Reference

::component-meta{:name="MobileMenuShop"}
::

::component-meta{:name="MobileMenuShopContentItem"}
::
