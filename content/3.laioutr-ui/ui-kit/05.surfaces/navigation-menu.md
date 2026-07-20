---
title: Navigation Menu
description: Compound navigation primitive with text-link triggers, content columns, headlines, separators, and an optional logo or icon item.
playground:
  name: NavigationMenu
  base: ui-kit-organisms-navigationmenu
  defaultStory: single-text-dark
  height: 460px
seo:
  title: Navigation Menu | Laioutr
  description: Compound navigation primitive with content columns and headlines.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/navigation-menu
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/navigation/headerwithtextlinks
changelogKeys:
  - NavigationMenuTextItem
---

## Overview

`NavigationMenu` is the Reka-UI-backed primitive for header-style nav with text-link triggers and content panels. It is a compound:

- `NavigationMenu` is the root.
- `NavigationMenuTextItem` (and `NavigationMenuTextItemWrapper`) render top-level text links.
- `NavigationMenuIconItem` renders icon-only top-level items.
- `NavigationMenuContentColumn`, `ContentList`, `ContentLink`, `ContentHeadline`, and `ContentSeparator` compose the panel.

It is typically used inside [`HeaderBasic`](/laioutr-ui/navigation/header-basic)'s `desktop` slot. The hover panel anchors to the trigger `<li>` with `top: 100%; left: 0; z-index: var(--z-index-popover)` so it sits naturally below the header rather than at a fixed pixel offset. Text-item surface tones are restricted to `Exclude<SurfaceTone, 'bright'>` because the triggers live on neutral header chrome.

`NavigationMenuTextItem` also takes an optional `textColor` prop — a resolved CSS color string. Set it to override the surface-tone label color for a single item (for example, a "Sale" link in the brand accent); leave it unset and the item inherits the surrounding surface tone.

Reach for `NavigationMenu` when the header needs simple text links with optional flyouts. For catalog-driven mega menus, use the dedicated `MegaMenu` compound instead.

## Key Business & UX Benefits

- Compound parts (text items, icon items, content columns, headlines, separators) give marketing a kit to build editorial flyouts without bespoke header code per campaign.
- Hover panels anchor to the trigger position rather than fixed pixel offsets, so the menu still lines up when the header height or branding changes.
- Surface-tone constraints keep text triggers legible on every header treatment, protecting brand consistency on international and seasonal skins.
- Pairs cleanly with `MegaMenu` for catalog-driven flows, so teams can grow from a simple link header to a full mega menu without swapping components mid-project.

## Usage

::component-code
---
:name: LNavigationMenu
story-id: ui-kit-organisms-navigationmenu--combined-menu-items
---
::

## Feature List

::features
---
items:
  - "Compound primitive: root plus `NavigationMenuTextItem`, `IconItem`, `ContentColumn`, `ContentList`, `ContentLink`, `ContentHeadline`, and `ContentSeparator`"
  - "Hover panels anchor to the trigger `<li>` with `top: 100%; left: 0; z-index: var(--z-index-popover)`, so flyouts line up when header height changes"
  - "Text-item `surfaceTone` typed as `Exclude<SurfaceTone, 'bright'>`, restricting triggers to the neutral header chrome they're designed for"
  - "Typically used inside `HeaderBasic`'s desktop slot, so the same primitive backs every basic header"
  - "Pairs with `MegaMenu` for catalog-driven flyouts, so teams can grow from simple links to a full mega menu without swapping components"
  - "Built on reka-ui, so keyboard navigation, focus management, and ARIA semantics ship out of the box"
---
::

## API Reference

### LNavigationMenu

::component-meta{:name="NavigationMenu"}
::

### LNavigationMenuContentColumn

::component-meta{:name="NavigationMenuContentColumn"}
::

### LNavigationMenuContentHeadline

::component-meta{:name="NavigationMenuContentHeadline"}
::

### LNavigationMenuContentLink

::component-meta{:name="NavigationMenuContentLink"}
::

### LNavigationMenuContentList

::component-meta{:name="NavigationMenuContentList"}
::

### LNavigationMenuContentSeparator

::component-meta{:name="NavigationMenuContentSeparator"}
::

### LNavigationMenuIconItem

::component-meta{:name="NavigationMenuIconItem"}
::

### LNavigationMenuTextItem

::component-meta{:name="NavigationMenuTextItem"}
::

### LNavigationMenuTextItemWrapper

::component-meta{:name="NavigationMenuTextItemWrapper"}
::
