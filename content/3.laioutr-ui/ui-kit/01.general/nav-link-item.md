---
title: Nav Link Item
description: Generic navigation list-row link primitive used by footer, mobile, and side-by-side menus.
seo:
  title: Nav Link Item | Laioutr
  description: Generic navigation list-row link primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/general/nav-link-item
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`NavLinkItem` is the generic row primitive for navigation lists. It renders as a `NuxtLink` when `href` is set and takes an optional leading `icon`. `Footer`, `MobileMenuBasic`, `MobileMenuShop`, and `MenuSideBySide` are all built on top of it.

## Key Business & UX Benefits

- One shared primitive backs footer, mobile, and side-by-side menus, so navigation tone and spacing stay aligned across every entry point.
- `NuxtLink` integration means prefetching and route transitions work for free, keeping menu taps fast on the mobile devices that drive most traffic.
- Optional leading icons make help, account, and policy links scannable without bespoke layout work in each menu.

## Usage

::component-code
---
:name: LNavLinkItem
:story-height: 200px
story-id: ui-kit-molecules-navlinkitem--default
title: NavLinkItem Default
---
```vue-template
<NavLinkItem href="/help" icon="question-circle">Help</NavLinkItem>
```
::

## Feature List

::features
---
items:
  - "Renders as `NuxtLink` when `href` is set (with route prefetching) and as a `div` otherwise, keeping non-link rows on the same template"
  - "Typed `icon` prop (uses the `IconName` union) places a leading m-sized LIcon, so help and policy rows stay scannable"
  - "Default slot owns the label, so callers can pass markup, badges, or counts alongside the text"
  - "`hug` modifier (`nav-link-item--hug`) tightens the row, used inside compact menus and footer columns"
  - "Underpins Footer, MobileMenuBasic, MobileMenuShop, and MenuSideBySide so navigation rhythm stays consistent across entry points"
---
::


## API Reference

::component-meta{:name="NavLinkItem"}
::
