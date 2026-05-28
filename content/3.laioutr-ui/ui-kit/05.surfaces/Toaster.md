---
title: Toaster
description: Root-level container that renders Toast notifications driven by the global toaster store.
playground:
  name: Toaster
  base: ui-kit-organisms-toaster
  defaultStory: neutral
  height: 460px
links: []
seo:
  title: Toaster | Laioutr
  description: A toaster component
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/toaster
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Toaster is the container that renders [Toast](/laioutr-ui/ui-kit/surfaces/toast) notifications. Mount it once at the app root and any component can trigger toasts through the global store without passing props.

The viewport carries a `.toaster__viewport` class with position modifiers (`--top-right`, `--bottom-center`, etc.) so you can theme placement from CSS.

## Key Business & UX Benefits

- One mount at the root means any component (cart, checkout, account) can fire a toast, so feedback never depends on prop drilling or per-page wiring.
- CSS-driven viewport placement lets brand teams adjust toast location for each market or campaign without touching application code.
- A single global queue prevents stacked toasts from competing for attention, keeping the screen readable during multi-action flows like bulk operations.
- The toaster pattern frees product engineers from rebuilding notification plumbing on every feature, shortening time-to-ship for new flows.

:::tip
Pro-Tip from Larry: Mount Toaster once at the root so toasts always appear in the same spot, regardless of which route triggered them.
:::

## Usage

::component-code
---
:name: LToaster
story-height: 400px
story-id: ui-kit-organisms-toaster--toaster-with-store
---
::

## Feature List

::features
---
items:
  - "Reads from a global toaster store, so any component fires toasts without prop drilling or page-level wiring"
  - "`.toaster__viewport` carries position modifiers (`--top-right`, `--bottom-center`, etc.), so consumers theme placement from CSS"
  - "Single mount at the app root is the only setup, the rest is just calling the store"
  - "Renders each store entry as a `Toast` instance, so per-toast variant, duration, and ctas come through unchanged"
  - "Queue management prevents stacked toasts from competing for attention during multi-action flows"
---
::

## API Reference

::component-meta{:name="Toaster"}
::
