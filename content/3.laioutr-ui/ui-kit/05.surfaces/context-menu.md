---
title: Context Menu
description: Reka-UI-backed primitive for right-click and long-press menus.
playground:
  name: ContextMenu
  base: ui-kit-molecules-contextmenu
  defaultStory: default
  height: 460px
seo:
  title: Context Menu
  description: Reka-UI-backed context menu primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/context-menu
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`ContextMenu` is the Reka-UI-backed primitive for right-click and long-press menus. The `update:open` event fires for observation; there is no controlled `open` prop because Reka UI manages the state internally. Auto-imports as `<LContextMenu>`.

The kit ships the `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, and `ContextMenuItem` parts. Item-level selection lives on `ContextMenuItem`'s `@select`; there is no root-level `select` event.

## Key Business & UX Benefits

- Right-click and long-press parity means power-user shortcuts on desktop translate directly to touch, raising productivity on admin and merchandising surfaces.
- Reka UI handles open and close state internally, so teams avoid the usual bugs around stuck menus and lost focus when shipping fast.
- Per-item `disabled` and `textValue` props give the keyboard-typeahead and dimmed-state behaviour teams expect from a native context menu, without extra wiring.
- One consistent contextual pattern across the app reduces the learning curve for new operators and shortens onboarding for support teams.

## Feature List

::features
---
items:
  - "Four-part composition: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem` keeps the menu structure explicit at the call site"
  - "Reka UI owns open/close state internally; `update:open` fires for observation but there is no controlled `open` prop"
  - "Right-click on desktop and long-press on touch trigger the same menu, so power-user shortcuts work across input modes"
  - "Per-item `@select`, `disabled`, and `textValue` props ship typeahead and dimmed-state behavior consumers expect from native context menus"
  - "Auto-imports as `<LContextMenu>`, so no manual import boilerplate per page"
---
::

## API Reference

::component-meta{:name="ContextMenu"}
::
