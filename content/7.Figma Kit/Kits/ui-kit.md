---
title: UI Kit
description: Core library with tokens (Figma Variables) and foundational components used by all other kits.
seo:
  title: UI Kit | Laioutr
  description: Core library with tokens (Figma Variables) and foundational components used by all other kits.
---

## Purpose

The **UI Kit** is the foundational library. It contains the **design tokens** (as Figma Variables) and the base components that everything else builds on. Publish this kit first.

## What’s inside

- **Variables / design tokens**
  - Typography (type scale, line heights)
  - Colors (incl. light/dark modes)
  - Spacing & sizing scales
  - Radii, borders, shadows, effects
  - Mode switches (e.g. mobile/desktop scaling)
- **Foundation components**
  - Buttons, inputs, selects, checkboxes, radio, toggles
  - Surfaces (cards, modals, drawers)
  - Feedback (badges, alerts, loaders)
  - Layout primitives used by higher-level components

## How other kits depend on it

- **SHOP**, **CMS**, and **Inpage Navigation** reuse variables from the UI Kit.
- If variables appear “missing” after import/publish, use Figma’s **Swap library** to re-link the dependency by name match.

## Best practices

- **Do not rename existing variables or components**: names are part of the design-to-code contract.
- Create additions by **extending** (new variables/components) rather than modifying the existing naming scheme.

