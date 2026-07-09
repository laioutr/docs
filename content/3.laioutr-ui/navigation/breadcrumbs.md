---
title: Breadcrumbs
aliases:
  - /laioutr-ui/navigation/breadcrumb
description: Hierarchical breadcrumb navigation with clickable levels and per-item dropdowns.
playground:
  name: Breadcrumbs
  base: ui-sections-breadcrumbs
  defaultStory: default
  height: 460px
seo:
  title: Breadcrumbs
  description: Hierarchical breadcrumb navigation with clickable levels.
sitemap:
  loc: /laioutr-ui/navigation/breadcrumbs
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1
  videos: []
  images: []
jiraIssueId: LUI-69
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=14145-361398&t=aARHqzA1E7J0jGbx-4
    target: _blank
---

## Overview

`Breadcrumbs` renders a hierarchical path from a list of `items` you pass through the `items` prop. Each level renders as a clickable `BreadcrumbsItem` except the last, which is marked as the current page (`aria-disabled="true"`, no link). If no item carries `isCurrentPage: true`, the last item is flagged automatically.

A home button sits at the start of the trail. Point it at any URL with the `homeHref` prop (defaults to `/`).

On viewports below the `md` breakpoint, the trail collapses to the home button plus the last two items, with the middle hidden behind an expand/collapse toggle. Long labels in the collapsed view truncate to 18-24 characters with an ellipsis, so titles don't break the layout on narrow screens.

Each `BreadcrumbsItem` can carry a `subitems` array. When present, hovering the item surfaces a `NavigationMenu` content slot with the subitems rendered as links. Use it to offer one-click lateral navigation to related categories or pages from the trail.

Pair `LBreadcrumbs` with `LBreadcrumbsItem` for the per-row primitive. Items can be passed directly through the `items` prop or composed manually inside a `<LBreadcrumbs>` wrapper.

## Key Business & UX Benefits

- Shoppers move back up the category tree in one click, reducing support tickets about "how do I get back to X" and keeping sessions on-site.
- Per-item subitem dropdowns turn the trail into a lateral discovery tool, lifting cross-category browsing without an extra navigation surface.
- Mobile collapse keeps long product names from breaking the header on narrow screens while leaving the home button and current page reachable.
- Configurable `homeHref` and freely-shaped `items` data make the same component fit catalog pages, search result pages, and content/editorial pages without forks.

::tip
Pro-Tip from Larry: Use breadcrumbs on product detail pages so shoppers can back out to the category or home in a single click. Add `subitems` to the parent category to offer sideways navigation without a full mega-menu open.
::

## Usage

::component-code
---
:name: LBreadcrumbs
story-id: ui-sections-breadcrumbs--with-dropdown
---
::

## Feature List

::features
---
items:
  - Home button at the start of the trail with a configurable `homeHref`
    (defaults to `/`)
  - 'Last item auto-flagged as the current page with `aria-disabled="true"` when
    no item carries `isCurrentPage: true`'
  - Mobile collapse below the `md` breakpoint hides the middle of long trails
    behind an expand toggle
  - Long labels in the collapsed view truncate to 18-24 characters so titles do
    not break narrow layouts
  - Per-item `subitems` array surfaces a `NavigationMenu` content panel on hover
    for lateral category links
  - Pairs `LBreadcrumbs` with `LBreadcrumbsItem`, accepting items through the
    `items` prop or composed manually
---
::

## API Reference

### LBreadcrumbs

::component-meta{:name="Breadcrumbs"}
::

### LBreadcrumbsItem

::component-meta{:name="BreadcrumbsItem"}
::
