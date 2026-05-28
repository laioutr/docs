---
title: Edge Glow
description: A edge glow component
playground:
  name: EdgeGlow
  base: ui-kit-atoms-edgeglow
  defaultStory: default
  height: 460px
links: []
seo:
  title: Edge Glow | Laioutr
  description: A edge glow component
sitemap:
  loc: /laioutr-ui/ui-kit/general/edgeglow
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Edge Glow is a decorative top-edge glow: a single static radial gradient pinned to the top of its container that fades into the page below. It is purely visual chrome with no Vue props, used to give hero sections and section-tops a soft brand-coloured halo.

## Key Business & UX Benefits

- A soft top-edge halo gives hero and section tops a finished, branded feel without dropping a full background image into the markup.
- The glow is driven by `--primary-2` and `--primary-4`, so brand recolours flow through with no per-section overrides.
- A zero-prop primitive replaces hand-rolled radial-gradient CSS scattered across hero sections.

:::tip
Pro-Tip from Larry: Drop `LEdgeGlow` into the top of a hero section when you want a subtle brand-tinted halo without a background image.
:::

## Feature List

::features
---
items:
  - "Pure-CSS pseudo-element renders the gradient with no Vue props, keeping the primitive zero-config to drop in"
  - "Theme tokens `--primary-2` and `--primary-4` drive the fade and glow colors so brand refreshes flow through unchanged"
  - "Tunable via `--bg-fadeout-size`, `--bg-glow-size`, `--bg-fadeout-color`, and `--bg-glow-color` CSS custom properties for per-section overrides"
  - "Radial-plus-linear gradient stack produces a centered top glow that fades vertically without dominating the layout"
  - "Standalone `.edge-glow` class composes inside any container, replacing hand-rolled radial-gradient CSS in hero and section tops"
---
::

## API Reference

::component-meta{:name="EdgeGlow"}
::
