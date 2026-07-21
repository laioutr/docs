---
title: Brand Hero
description: Hero section that surfaces a brand identity with background media, brand name, description, and optional logo.
playground:
  name: BrandHero
  base: ui-sections-brandhero
  defaultStory: default
  height: 460px
seo:
  title: Brand Hero
  description: Hero section that surfaces a brand identity.
sitemap:
  loc: /laioutr-ui/cms/brand-hero
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/iOpGWO38HkhnTYkEeEq8Oz/Laioutr-Basic?node-id=89-298202&t=WsyhlVHQyGVajZ9T-4
    target: _blank
---

## Overview

`BrandHero` is the hero section for surfacing a single brand identity: a `background` image, the brand `name`, an optional `description`, and an optional brand `logo`. The `colorMode` prop (`on-dark`, `on-light`, `plain`) picks the right text and chrome treatment for the backdrop. Apply the `.radius-contained` utility on a padded parent to round the hero inside a container; leave it off for a flat, edge-to-edge layout.

## Key Business & UX Benefits

- Gives every brand page a distinct, high-impact entry point, reinforcing brand equity across multi-brand and partner catalogues.
- One configurable hero ships across every brand landing page, so marketing scales coverage without commissioning bespoke designs.
- The `colorMode` switch keeps the brand name and description readable on light, dark, and plain backdrops without re-cutting assets per brand.
- Editors swap hero media and copy per brand in Studio, freeing the design team for higher-impact work.

## Feature List

::features
---
items:
  - "Background media, brand name, optional description, and optional brand logo in one hero block"
  - "colorMode (on-dark, on-light, plain) picks the matching text and chrome treatment per backdrop"
  - "Theme-driven default background art kicks in when no background image is provided"
  - "Editors swap hero media and copy per brand in Studio without engineering involvement"
  - "Apply .radius-contained on a padded parent for rounded corners, or leave it off for an edge-to-edge layout"
---
::

## API Reference

::component-meta{:name="BrandHero"}
::
