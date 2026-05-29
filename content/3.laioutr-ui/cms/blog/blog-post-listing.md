---
title: Blog Post Listing
description: Featured post and paginated grid of blog cards, with an optional title and subline above the listing.
playground:
  name: BlogPostListing
  base: ui-sections-blogpostlisting
  defaultStory: default
  height: 460px
seo:
  title: Blog Post Listing | Laioutr
  description: Featured post and paginated grid of blog cards.
sitemap:
  loc: /laioutr-ui/cms/blog/blog-post-listing
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/iOpGWO38HkhnTYkEeEq8Oz/Laioutr-Basic?node-id=44-112670&t=bEXX3iWukUFWihvM-4
    target: _blank
---

## Overview

`BlogPostListing` is the blog index: a featured post hero on top, then a paginated grid of cards, with an optional `title` and `subline` rendered as a text group above the listing. Pin a featured story per season and `BlogPostListing` surfaces it above the grid with a hero treatment.

The companion article view is [`BlogPostDetail`](/laioutr-ui/cms/blog/blog-post-detail).

## Key Business & UX Benefits

- A featured-post hero gives editors a curated spotlight, lifting click-through on the story marketing wants in front this week.
- Pagination and grid layout scale from a handful of posts to a full archive without restructuring the page.
- An optional title and subline above the grid let one template serve as both content hub and campaign landing surface.
- Editors arrange the listing in Studio and let the data layer fill the grid, so the blog index stays current without manual page edits.

:::tip
Pro-Tip from Larry: Pin a featured story per season; `BlogPostListing` surfaces it above the grid so it gets a clear hero treatment.
:::

## Feature List

::features
---
items:
  - "Featured-post hero pinned above the grid gives editors a curated weekly spotlight"
  - "Paginated card grid scales from a handful of posts to a full archive without restructuring the page"
  - "Optional title and subline (rendered via LTextGroup) above the listing let one template double as a campaign landing surface"
  - "Editors arrange the listing in Studio while the data layer fills the grid automatically"
  - "Pairs with BlogPostDetail for a consistent blog structure from index to article"
---
::

## API Reference

::component-meta{:name="BlogPostListing"}
::
