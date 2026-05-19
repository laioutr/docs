---
title: Backdrop
description: Painted background surface that publishes its surface tone to descendants.
links: []
seo:
  title: Backdrop | Laioutr
  description: Painted background surface that publishes its surface tone to descendants.
sitemap:
  loc: /laioutr-ui/ui-kit/general/backdrop
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Backdrop paints a background behind sections, dialogs, and content blocks, then publishes the matching surface tone so typography, icons, and chrome inside it resolve to the right colors.

Pass `:background` as a preset name or CSS color. When you give it a hex value, `colorToSurfaceTone` derives the tone for you. Non-hex inputs (`var(...)`, `rgb(...)`, `hsl(...)`, `light-dark(...)`) fall back to `'light'`, so set `:surface-tone` explicitly in those cases.

## Key Business & UX Benefits

- Automatic surface-tone propagation prevents the most common visual bug in seasonal campaigns: white-on-white text on a freshly recolored background.
- Marketing can recolor a section with a single hex value and the surrounding typography, icons, and chrome stay legible without dev follow-up.
- One primitive backs every painted section, so brand refreshes change tokens in one place rather than dozens of bespoke CSS rules.

:::tip
Pro-Tip from Larry: Pass `:background` with a hex and let the tone derive itself; only set `:surface-tone` when you need to override.
:::

## Usage

::component-code
---
:name: LBackdrop
story-id: ui-kit-atoms-backdrop--full-width-default
---
::

```vue-template
<LBackdrop background="#0f1115" surface-tone="dark">
  <!-- content -->
</LBackdrop>
```

## Feature List

::features
---
items:
  - "`background` prop takes a preset name or any CSS color; hex values derive surface tone automatically via `colorToSurfaceTone`"
  - "Publishes the resolved surface tone through Vue's provide so descendants pick the right text and icon colors with no per-section overrides"
  - "Explicit `surfaceTone` prop overrides the derived tone when non-hex inputs (`var(...)`, `rgb(...)`, `light-dark(...)`) need a manual choice"
  - "Custom backgrounds expose a `--backdrop-custom-bg` CSS custom property for ad-hoc theming in seasonal campaigns"
  - "BEM root class (`backdrop--{colorName}`) keys CSS overrides to the active preset"
---
::

## API Reference

::component-meta{:name="Backdrop"}
::
