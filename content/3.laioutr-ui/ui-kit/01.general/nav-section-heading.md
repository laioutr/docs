---
title: Nav Section Heading
description: Generic navigation list heading primitive that renders as a `NuxtLink` when `href` is set.
seo:
  title: Nav Section Heading | Laioutr
  description: Generic navigation list heading primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/general/nav-section-heading
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`NavSectionHeading` is the section-label primitive used inside navigation lists. It renders as a `NuxtLink` when `href` is set, otherwise as a plain `<div>` styled with heading typography. Used by `FooterMenu` and the mobile and side-by-side menus.

## Key Business & UX Benefits

- Letting section labels double as links keeps mega-menus tappable from the top level, which mirrors how mobile shoppers prefer to browse.
- One section-label primitive across footer and menu surfaces keeps typography and weight consistent without per-menu CSS.
- The link-or-static split keeps the right element in the DOM for the role, so navigable labels are real `NuxtLink`s and static ones stay non-interactive.

## Usage

::component-code
---
:name: LNavSectionHeading
:story-height: 200px
story-id: ui-kit-molecules-navsectionheading--default
title: NavSectionHeading Default
---
```vue-template
<NavSectionHeading href="/help">Help</NavSectionHeading>
```
::

## Feature List

::features
---
items:
  - "Renders as `NuxtLink` when `href` is set (with `nav-section-heading--link` modifier) and as a plain `<div>` otherwise"
  - "Default slot wraps the label in a `__text` span, so hover and pressed states color the text not the row"
  - "Heading typography pulled from `--font-family-heading`, `--font-weight-heading`, and `--font-size-m` tokens for cross-menu consistency"
  - "Built-in `:focus-visible` ring uses `--buttons-focus-ring` and `--forms-border-radius` tokens, so keyboard focus matches the rest of the system"
  - "Underpins FooterMenu and the mobile and side-by-side menus, keeping section labels tappable when a link target is available"
---
::


## API Reference

::component-meta{:name="NavSectionHeading"}
::
