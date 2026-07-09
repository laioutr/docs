---
title: Popover
description: Reka-UI-backed anchored panel for filter dropdowns, profile menus, and focused interactions tied to a trigger.
playground:
  name: Popover
  base: ui-kit-molecules-popover
  defaultStory: default
  height: 460px
seo:
  title: Popover
  description: Reka-UI-backed popover primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/popover
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`Popover` is the Reka-UI-backed anchored panel. Use it for filter dropdowns, profile menus, and any focused interaction that should appear next to its trigger. Auto-imports as `<LPopover>`.

The wrapper forwards `defaultOpen`, `open`, and `modal` to Reka's `PopoverRoot`. Positioning is not automatic: collision avoidance is configured per call site through `PopoverContent` props from Reka UI (for example `:side-offset`, `:collision-padding`, `:avoid-collisions`). Tune those on the content element when you need a panel to stay on-screen.

## Key Business & UX Benefits

- One anchored panel handles filter dropdowns, profile menus, and quick actions, so every floating UI on the storefront behaves the same on hover, focus, and dismissal.
- Reka's collision props on `PopoverContent` give per-surface control to keep panels on-screen, so teams can tune mobile vs. desktop without forking the primitive.
- Reka UI ships keyboard and click-outside dismissal, so teams skip the bug class around stuck overlays and ship faster.
- Drop-in trigger and content composition lets product teams attach a contextual panel to almost any element without restructuring the surrounding layout.

## Feature List

::features
---
items:
  - "Forwards `defaultOpen`, `open`, and `modal` to reka-ui's `PopoverRoot`, so both uncontrolled and controlled use are first-class"
  - "Per-call positioning via `PopoverContent` props like `side-offset`, `collision-padding`, and `avoid-collisions` for surface-specific tuning"
  - "Three-part composition (`Popover`, `PopoverTrigger`, `PopoverContent`) keeps the floating-panel structure explicit at the call site"
  - "Reka UI ships keyboard dismissal (escape) and outside-click handling, so panels never get stuck open"
  - "Auto-imports as `<LPopover>`, paired with `<LPopoverTrigger>` and `<LPopoverContent>` for each instance"
---
::

## API Reference

::component-meta{:name="Popover"}
::

::component-meta{:name="PopoverTrigger"}
::

::component-meta{:name="PopoverContent"}
::
