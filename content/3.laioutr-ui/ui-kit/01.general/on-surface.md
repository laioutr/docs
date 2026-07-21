---
title: OnSurface
description: Sets the surface tone (`light` / `dark` / `bright`) for descendant components and rebinds the matching CSS custom properties.
playground:
  name: OnSurface
  base: ui-kit-atoms-onsurface
  defaultStory: light
  height: 460px
seo:
  title: OnSurface
  description: Sets the surface tone for descendant components.
sitemap:
  loc: /laioutr-ui/ui-kit/general/on-surface
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`<OnSurface>` is the only component that sets the surface tone publicly. It wraps a slot, applies the appropriate `.on-light`, `.on-dark`, or `.on-bright` class, and exposes the tone to descendants via context so any `Text`, `Icon`, or chrome component inside resolves to the right colors. A bare `<OnSurface>` (no `tone` prop) inherits from the surrounding tone, which makes wrapping safe and idempotent.

For the conceptual treatment of `SurfaceTone`, the `useSurfaceTone()` composable, and the `colorToSurfaceTone` helper, see [Surface Tone](/laioutr-ui/getting-started/surface-tone).

## Key Business & UX Benefits

- One wrapper guarantees text and icons stay legible inside any colored section, eliminating the WCAG contrast issues that surface in QA right before launch.
- Idempotent wrapping means designers can nest sections freely without each one needing manual tone configuration.
- Decouples component color from the surrounding background, so the same `Card` or `Text` renders correctly on light, dark, and bright surfaces.

### Dark tone

::component-code
---
:name: LOnSurface
:story-height: 200px
story-id: ui-kit-atoms-onsurface--dark
title: OnSurface Dark
---
```vue-template
<OnSurface tone="dark">
  <Text>Dark surface, white text by default.</Text>
</OnSurface>
```
::

## Feature List

::features
---
items:
  - "Three `tone` values ('light', 'dark', 'bright') apply `.on-light`, `.on-dark`, or `.on-bright` and rebind the matching CSS custom properties"
  - "Bare `<OnSurface>` (no `tone` prop) inherits the surrounding tone, keeping wrapping idempotent and safe to nest"
  - "Publishes the tone to descendants via Vue provide so any Text, Icon, or chrome inside resolves to the right colors"
  - "Pairs with `useSurfaceTone()` so component code reads the tone without prop-drilling through the tree"
  - "Single public surface for tone, so QA can audit contrast at the boundary rather than per-component"
---
::

## API Reference

::component-meta{:name="OnSurface"}
::
