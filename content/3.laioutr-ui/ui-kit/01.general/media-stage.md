---
title: Media Stage
description: Bare media + content stage primitive that derives surface tone from the configured background color.
playground:
  name: MediaStage
  base: ui-kit-molecules-mediastage
  defaultStory: default
  height: 460px
seo:
  title: Media Stage | Laioutr
  description: Bare media + content stage primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/general/media-stage
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`MediaStage` is the bare "media on a background, with content overlaid on top" primitive used by `BannerBasic`, `BannerIntegrated`, `BannerShowcase`, and any custom hero. It owns media positioning, the content slot, the background color, and a built-in `ImageContrastOverlay`, but leaves border-radius to the call site (apply the `.radius-contained` utility there).

When `backgroundColor` is a hex value, `MediaStage` runs it through `colorToSurfaceTone` and propagates the result to descendants so text and icons sitting on top stay legible. Non-hex values (CSS vars, `light-dark()`, `rgb()`, `hsl()`, or anything that doesn't parse as hex) short-circuit to the `'light'` tone (same caveat as `Backdrop`). Pass an explicit `surfaceTone` to override the derived value.

## Inheritable props and overlay

`MediaStage` exposes a set of inheritable props for components that want a brightness-aware surface as their root:

- `backgroundImage` renders a `<Media>` behind the content slot. `backgroundImageSizes` and `backgroundImageFit` (`'cover'` or `'contain'`) tune how it's sized.
- The `fallbackBackgroundImageDefault`, `fallbackBackgroundImageDark`, and `fallbackBackgroundImageBright` trio kicks in when `backgroundImage` is absent: the resolved surface tone selects which fallback renders, so a single component can ship per-tone artwork.
- `overlay` accepts an `ImageContrastOverlay` prop bag and is forwarded to the built-in overlay element (rendered above the media, below the content).
- `surfaceTone` is the manual override; without it the tone derives from `backgroundColor` via `colorToSurfaceTone` (hex only).

## Key Business & UX Benefits

- One primitive powers every hero and banner variant, so a brand refresh changes the look in one place instead of touching each banner type.
- Automatic surface-tone derivation keeps headline and CTA text legible when marketing recolors a banner background mid-campaign.
- Clean separation of media, content slot, and chrome lets product teams compose custom heroes without rewriting positioning logic.

## Feature List

::features
---
items:
  - "`backgroundColor` hex values run through `colorToSurfaceTone` and propagate the resolved tone to descendants for legible text and icons"
  - "Non-hex backgrounds (CSS vars, `light-dark()`, `rgb()`, `hsl()`) short-circuit to `'light'`; pass `surfaceTone` to override"
  - "`backgroundImage` with `backgroundImageSizes` and `backgroundImageFit` ('cover' or 'contain') renders a typed `<Media>` behind the content slot"
  - "Three fallback slots (`fallbackBackgroundImageDefault`, `fallbackBackgroundImageDark`, `fallbackBackgroundImageBright`) let one component ship per-tone artwork"
  - "Built-in `ImageContrastOverlay` accepts a forwarded prop bag via `overlay`, sitting between media and content"
  - "Border radius left to the call site (`.radius-contained` utility), keeping the primitive composable inside cards, banners, and heros"
---
::

## API Reference

::component-meta{:name="MediaStage"}
::
