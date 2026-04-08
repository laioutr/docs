---
title: Empty State
description: Empty state component for product listing pages with friendly messaging when no products are available.
jiraIssueId: LUI-82
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=15272-139031&t=KBarTgaq8f4rSg2p-4
    target: _blank
seo:
  title: Empty State | Laioutr
  description: Empty state component for product listing pages with friendly messaging when no products are available.
sitemap:
  loc: /laioutr-ui/ui-kit/general/emptystate
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Occupies the main content area where products are normally listed. Best practice is to display additional content outside the message such as recommendation sliders, top categories, newly arrived products, or products from the supercategory. Image variant recommends transparent backgrounds. Default color uses theme/colors/grey 3 but is customizable. Designed to keep users in the flow and avoid dead ends.

## Key Business & UX Benefits

- Turns empty results into a clear, friendly message instead of a blank page.
- Keeps users engaged with suggestions like categories or recommendations.
- Reduces confusion and support questions by explaining why nothing is shown.
- Keeps users in the flow with next steps instead of dead ends.

:::tip
Pro-Tip from Larry: Add a recommendation slider or category links below the message so users have somewhere to go.
:::

## Usage

::component-code
---
:name: EmptyState
story-id: ui-kit-emptystate--icon-empty-state
---
::

## Feature List

::features
---
items:
  - "Three display variants: icon, image, or text-only"
  - "Customizable icons, emojis, or illustrations"
  - "Configurable text alignment and background color"
  - "Integration points for recommendation sliders and category links"
---
::

## API Reference

::component-meta{:name="EmptyState"}
::
