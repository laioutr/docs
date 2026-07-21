---
title: Media Preview
description: Responsive image block with optional lightbox, custom aspect ratios, and device-specific sizing.
playground:
  name: MediaPreview
  base: ui-kit-molecules-mediapreview
  defaultStory: single-without-lightbox
  height: 460px
jiraIssueId: LUI-28
seo:
  title: Media Preview
  description: Responsive image block with optional lightbox, custom aspect ratios, and device-specific sizing.
sitemap:
  loc: /laioutr-ui/ui-kit/general/media-preview
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`MediaPreview` is the canonical primitive for rendering responsive images with optional lightbox interaction. It takes a [`Media`](/frontend/api-reference/common-types/media) value (the discriminated union returned by connectors and produced by the `media` schema field), reads its sources via [nuxt-image](https://image.nuxt.com/), and picks the right variant for the current viewport. Set separate aspect ratios and heights for mobile and desktop, pass an optional visible description rendered below the media, and opt into the cross-image lightbox when shoppers should be able to zoom and pan.

`orientation` (`'portrait'` or `'landscape'`) changes how `aspectRatio` is interpreted: in portrait mode the mobile and desktop ratios are flipped (width and height are swapped) before being applied. The `rounded` prop applies a contained border radius; the `height` prop accepts separate `mobile` and `desktop` CSS values to override the aspect-ratio-driven sizing.

`MediaPreview` reads the parent surface tone via `useSurfaceTone(props)`, so chrome and overlays stay legible whether it sits on light, dark, or bright backgrounds.

For the low-level primitive without the lightbox shell, see [`Media`](/laioutr-ui/ui-kit/general/media).

## Key Business & UX Benefits

- Device-specific aspect ratios prevent the mobile-crop disasters that hurt PDP conversion when desktop hero shots get squeezed into portrait.
- Built on nuxt-image, so product photography ships in the right variant for each viewport, protecting Core Web Vitals and mobile load times.
- Optional lightbox lets shoppers inspect detail without leaving the page, lifting time-on-PDP and reducing pre-purchase returns.
- Surface-tone awareness means overlays and captions remain legible whether the gallery sits on a light, dark, or bright section.

:::tip
Pro-Tip from Larry: Set separate mobile and desktop aspect ratios so images look great on every screen.
:::

## Usage

::component-code{:name="LMediaPreview" story-id="ui-kit-atoms-media--default"}
::

## Feature List

::features
---
items:
  - "Takes a typed `Media` value (the discriminated union from connectors and the `media` schema field), so video and image sources flow through one prop"
  - "Reads sources via nuxt-image and picks the right variant for the current viewport, protecting Core Web Vitals"
  - "Separate mobile and desktop `aspectRatio` and `height` props prevent the mobile-crop disasters that hurt PDP conversion"
  - "`orientation` of `'portrait'` flips the mobile and desktop ratios (width and height swap) before they apply"
  - "Optional `lightbox` opt-in plugs into the shared lightbox store for cross-image zoom and pan"
  - "`useSurfaceTone(props)` reads the parent surface so overlays and captions stay legible on light, dark, and bright sections"
  - "`rounded` prop applies a contained border radius for editorial card placements"
---
::

## API Reference

::component-meta{:name="MediaPreview"}
::
