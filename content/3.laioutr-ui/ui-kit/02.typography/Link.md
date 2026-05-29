---
title: Link
description: A link component
playground:
  name: Link
  base: ui-kit-atoms-link
  defaultStory: primary
  height: 460px
links: []
seo:
  title: Link | Laioutr
  description: A link component
sitemap:
  loc: /laioutr-ui/ui-kit/typography/link
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Link renders styled, accessible links for navigation and inline actions. It works for internal and external URLs, takes optional leading or trailing icons, and follows the theme's color and hover treatment so links read consistently across pages.

When `href` points to a different origin than the current page, the component auto-injects the `communication/go-to` icon so users see the off-site cue before the click. Pass an explicit `icon` to override that auto-injected glyph.

## Key Business & UX Benefits

- Consistent link styling across the storefront builds trust; shoppers learn what is clickable without scanning for hover cues.
- Auto-injected external-link icon for cross-origin `href`s warns users before they leave the site, reducing accidental nav-aways and protecting on-site conversion paths.
- Optional leading and trailing icons turn ordinary links into clear call-outs, useful for download links and policy navigation.

:::tip
Pro-Tip from Larry: When `href` crosses origins, Link automatically renders the external-link icon, so users see the off-site cue without any extra prop.
:::

## Feature List

::features
---
items:
  - "Seven `color` values ('auto', 'primary', 'white', 'black', 'always-white', 'always-black', 'grey') cover content links and surface-aware chrome"
  - "`color=\"auto\"` reads `useSurfaceTone(props)` and picks the matching tone, so the same link renders correctly on light, dark, and bright sections"
  - "External URLs (different origin from current page) auto-get the `communication/go-to` icon, signalling the new-tab destination before the click"
  - "`iconPosition` ('left' or 'right', default 'right') and `iconSize` ('s', 'sm', 'm', 'l') pair text with download, arrow, or policy glyphs"
  - "Renders as `NuxtLink` when `href` is set (with prefetch) and as a `<button>` otherwise, so action-only links keep proper semantics"
  - "Custom `icon` always overrides the auto external-icon, useful for download or follow-up links that point off-site"
---
::

## API Reference

::component-meta{:name="Link"}
::
