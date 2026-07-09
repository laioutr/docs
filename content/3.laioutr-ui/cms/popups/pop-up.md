---
title: PopUp
description: Reka-UI Dialog wrapper with a media slot and content stack. The shell behind all popup presets.
playground:
  name: PopUp
  base: ui-features-popup
  defaultStory: info
  height: 460px
seo:
  title: PopUp
  description: Reka-UI Dialog wrapper with media slot and content stack.
sitemap:
  loc: /laioutr-ui/cms/popups/pop-up
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PopUp` is the popup shell: a reka-ui Dialog wrapper with a media slot and a default content slot. It's the foundation behind the curated presets `PopUpInfo`, `PopUpNewsletter`, and `PopUpPromotion`, which render their fields into that default slot. Reach for the shell directly when none of the presets fit; otherwise use a preset.

Reka-ui Dialog semantics handle focus management and keyboard interaction.

## Layout and dismiss controls

The shell exposes the dismiss and layout knobs presets inherit:

- `closeOnEsc` (default `true`) decides whether the Escape key closes the popup.
- `closeOnOverlayClick` (default `true`) decides whether clicking the backdrop closes the popup.
- `media` renders on the leading side (top on mobile, left or right on desktop). The `media` slot lets you replace the default `<Media>` rendering with custom markup.
- `backgroundMedia` overlays a full-popup background image behind both the media slot and the content stack.
- `imagePositionDesktop` (`'left'` or `'right'`) flips desktop layout direction when media is present.
- `alignment` (`'left'` or `'center'`) sets the horizontal alignment of the content stack.
- `containerStyle` (`'boxed'` or `'full'`) controls the mobile container; on desktop the popup is always boxed and centered.
- `closeButtonVariantMobile` and `closeButtonVariantDesktop` accept any `Button` variant; the shell renders both close buttons and CSS picks one per viewport.
- `close` event fires when the user dismisses the popup (alongside `update:open`).

## Key Business & UX Benefits

- One popup shell powers every dialog on the site, so brand chrome and motion stay identical from newsletter prompt to terms notice.
- Reka-UI Dialog semantics deliver focus traps, escape handling, and ARIA roles out of the box, removing the accessibility risk that popups usually carry.
- The media slot plus content stack gives designers a clean canvas for custom popups when no preset fits.
- Builds the foundation for `PopUpInfo`, `PopUpNewsletter`, and `PopUpPromotion`, keeping one accessibility audit valid across every variant.

## Feature List

::features
---
items:
  - "Reka-UI Dialog wrapper handles focus traps, escape key, and ARIA roles with no extra accessibility work"
  - "Media slot renders on the leading side (top mobile, left or right desktop) with imagePositionDesktop flipping direction"
  - "backgroundMedia overlays a full-popup image behind both the media slot and content stack for dramatic placements"
  - "Layout knobs: closeOnEsc, closeOnOverlayClick, alignment ('left' or 'center'), and containerStyle ('boxed' or 'full')"
  - "Separate closeButtonVariantMobile and closeButtonVariantDesktop let CSS pick the right close style per viewport"
  - "close event plus update:open hand dismiss handling back to the parent for analytics or persistence"
  - "Foundation behind PopUpInfo, PopUpNewsletter, and PopUpPromotion, so one accessibility audit covers every variant"
---
::

## API Reference

::component-meta{:name="PopUp"}
::
