---
title: Avatar
description: Avatar component for displaying user images, initials, or icons with size and color variants.
jiraIssueId: LUI-122
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=20345-6874&t=d3lxzSvfCLvDJbv-4
    target: _blank
seo:
  title: Avatar | Laioutr
  description: Avatar component for displaying user images, initials, or icons with size and color variants.
sitemap:
  loc: /laioutr-ui/ui-kit/general/avatar
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Avatar represents a user through a profile image, auto-generated initials, or an icon fallback. The `fallbackVariant` prop (default `'initials'`) picks which fallback shows when no image is available; `'icon'` swaps in the glyph named by `fallbackIcon` (default `essentials/user`), and `'image'` falls through to the theme placeholder. Initials are pulled from the first letter of the first and last word of the name (e.g. "Sebastian Kurt Langer" becomes "SL"), and each theme ships its own placeholder image so the fallback chain never lands on a broken state.

Pass a `media` value when you have a `Media` object; it renders through the `<LMedia>` pipeline so video posters and image variants behave consistently with the rest of the system. Without `media`, the component walks `src`, then the configured fallback chain.

## Key Business & UX Benefits

- Layered fallbacks (image, initials, themed placeholder) mean account areas never render a broken icon, even when a profile photo fails to load.
- Personalized account chrome makes returning customers feel recognized, which lifts repeat-visit engagement on logged-in pages.
- Initials are derived automatically from the name, so customer service tools and member areas show consistent avatars without extra data.
- The `<LMedia>` pipeline serves the right image variant for each viewport, keeping account pages fast on mobile.

:::tip
Pro-Tip from Larry: Pass a `media` value when you have a Media object so it goes through `<LMedia>` for free.
:::

## Usage

:component-code{name="LAvatar" story-height="100px" story-id="ui-kit-atoms-avatar--medium-fallback-icon"}

## Feature List

::features
---
items:
  - "Four sizes ('s', 'm', 'l', 'xl') with icon size auto-derived per avatar size"
  - "`fallbackVariant` ('icon', 'initials', 'image', default 'initials') and `fallbackIcon` (default 'essentials/user') let consumers pick the fallback shape per surface"
  - "Three-step fallback chain (media or src, then name-derived initials, then themed placeholder image) keeps account chrome from breaking"
  - "Initials auto-computed from first letter of first and last word of `name`, no extra data needed"
  - "`media` prop renders through `<LMedia>` so video posters and image variants stay consistent with the rest of the system"
  - "Localized alt text via i18n keys `avatar.namedAlt` and `avatar.defaultAlt` covers screen readers in every market"
  - "BEM root class (`avatar--{size}`, `avatar--{color}`) gives instance-level theming hooks"
---
::

## API Reference

### LAvatar

::component-meta{:name="Avatar"}
::
