---
title: Sizer
description: Headless primitive that resolves a flat sizing config (fixed height, aspect ratio, or fill) into the right CSS, with responsive mobile/desktop variants.
playground:
  name: Sizer
  base: ui-kit-atoms-sizer
  defaultStory: aspect-ratio
  height: 460px
seo:
  title: Sizer
  description: Headless primitive that resolves a flat sizing config (fixed height, aspect ratio, or fill) into the right CSS, with responsive mobile/desktop variants.
sitemap:
  loc: /laioutr-ui/ui-kit/utility-components/sizer
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`Sizer` is the shared primitive for outer-box sizing. It takes a flat `sizing` config object and resolves it to the right CSS height or aspect ratio, with separate mobile and desktop branches when needed. Banner blocks, `BlockMedia`, and `BlockIframe` route their sizing through it instead of carrying bespoke height/aspect-ratio props of their own. The shape maps 1:1 to the `sizingField` shared schema field in `ui-app`, so editor input flows straight through.

It renders as a `<div>` by default and accepts an `as` prop to render as any element or component. Pass `as-child` to merge the sizer class onto the single child instead of wrapping it.

## Key Business & UX Benefits

- One shared sizing surface means every banner, media block, and iframe answers editor height changes the same way.
- Separate mobile and desktop branches for both fixed heights and aspect ratios stop mobile crops from breaking hero layouts.
- The `dvh` unit option accounts for mobile browser chrome, so a "60% of viewport height" hero stays correct when the address bar collapses.
- Maps 1:1 to the `sizingField` schema, so editor changes in Studio reach the storefront without bespoke per-block wiring.

## Usage

::component-code{:name="LSizer" story-id="ui-kit-atoms-sizer--aspect-ratio"}
::

## Sizing modes

The `mode` field on the `sizing` object picks how the height is computed. Only the fields relevant to that mode are read.

| Mode | Reads | Result |
| --- | --- | --- |
| `auto` | (nothing) | Intrinsic content height. Same as omitting `sizing`. |
| `fill` | (nothing) | `height: 100%`. The parent must give a definite height. |
| `fixed` | `value`, `unit` | `height: <value><unit>`. |
| `responsive-fixed` | `valueMobile`, `valueDesktop`, `unit` | Mobile and desktop heights below and above the `md` breakpoint. |
| `aspect-ratio` | `aspectRatio` | CSS `aspect-ratio` (e.g. `'16/9'`). |
| `responsive-aspect-ratio` | `aspectRatioMobile`, `aspectRatioDesktop` | Mobile and desktop aspect ratios. |

`unit` is `'px'` (default) or `'dvh'`. The `dvh` choice tracks the dynamic viewport so the height stays right when mobile browser chrome shows or hides.

## Feature List

::features
---
items:
  - "Six sizing modes (auto, fill, fixed, responsive-fixed, aspect-ratio, responsive-aspect-ratio) cover the height patterns banners and media blocks need"
  - "Flat config object maps 1:1 to the `sizingField` shared schema, so editor input flows straight to the storefront"
  - "Separate mobile and desktop branches for both heights and aspect ratios prevent mobile-crop disasters on hero layouts"
  - "`dvh` unit option tracks the dynamic viewport so percentage heights stay correct as mobile browser chrome appears and disappears"
  - "Renders as `<div>` by default; pass `as` to render any element or component, or `as-child` to merge onto the single child"
  - "Reka `Primitive` under the hood, so prop merging and ref forwarding behave like the rest of the kit"
---
::

## API Reference

::component-meta{:name="Sizer"}
::

## Related

- [`MediaPreview`](/laioutr-ui/ui-kit/general/media-preview): wrap in `Sizer` when the media needs a definite height or aspect ratio.
- [`Placeholder`](/laioutr-ui/ui-kit/general/placeholder): the dev-time stand-in shown in the Sizer stories.
