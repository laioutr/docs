---
title: Footer Menu
description: Single column of footer links with a heading and an ordered link list.
seo:
  title: Footer Menu | Laioutr
  description: Single column of footer links.
sitemap:
  loc: /laioutr-ui/navigation/footer-menu
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`FooterMenu` is one column inside the site footer. On desktop it renders a `NavSectionHeading` followed by a list of `NavLinkItem` rows. On mobile it collapses into an `Accordion` so each column expands on tap, keeping the footer compact on small screens. Compose several `FooterMenu` columns inside a `Footer` to build out the full footer navigation.

Props are `title: string`, optional `titleHref?: string`, and `items: NavLinkItems[]`.

## Key Business & UX Benefits

- A single column primitive backs every footer group, so help, legal, and company sections stay visually aligned without bespoke CSS per market.
- Editors add and rearrange links in Studio without touching code, which means policy changes and seasonal links ship the same day they are decided.
- Consistent heading and row spacing across every column protects the brand on a page that search engines crawl heavily for site structure.

## Usage

::component-code
---
:name: LFooterMenu
:story-height: 400px
story-id: ui-blocks-footermenu--default
title: FooterMenu Default
---
```vue-template
<FooterMenu title="Help" :items="helpLinks" />
```
::

## Feature List

::features
---
items:
  - "Single column primitive composed of a `NavSectionHeading` plus an ordered list of `NavLinkItem` rows on desktop"
  - "Mobile breakpoints swap the column for an `Accordion` so each section expands on tap, keeping the footer compact on small screens"
  - "Drops into the `Footer` default slot so several `FooterMenu` columns line up across help, legal, and company sections"
  - "Editors add, rename, and reorder links in Studio without touching code"
  - "Shared heading and row spacing keep every footer column visually aligned without bespoke CSS per market"
  - "Items prop accepts a flat link list, so the same column backs policy links, support links, and discovery sections alike"
---
::

## API Reference

::component-meta{:name="FooterMenu"}
::
