---
title: Empty State
description: Empty state component for product listing pages with friendly messaging when no products are available.
playground:
  name: EmptyState
  base: ui-kit-molecules-emptystate
  defaultStory: with-cta
  height: 460px
jiraIssueId: LUI-82
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=15272-139031&t=KBarTgaq8f4rSg2p-4
    target: _blank
seo:
  title: Empty State
  description: Empty state component for product listing pages with friendly messaging when no products are available.
sitemap:
  loc: /laioutr-ui/ui-kit/general/emptystate
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

EmptyState fills the main content area when a product listing or search returns nothing. It pairs a friendly message with icon, image, or text-only variants and keeps users moving forward instead of hitting a blank page.

The image variant works best with transparent assets. Default text uses theme grey 3 but can be overridden. Put a recommendation slider, top categories, or new arrivals below the message so the page still gives the user somewhere to go.

## Key Business & UX Benefits

- Turns dead-end search and listing pages into onward journeys, recovering shoppers who would otherwise bounce after a zero-result query.
- Icon, image, and text-only variants fit every page shape, from compact filter results to full-page no-orders states in account areas.
- A friendly default tone keeps the brand voice intact in the moments where customers are most likely to feel frustrated.

:::tip
Pro-Tip from Larry: Add a recommendation slider or category links below the message so users have somewhere to go.
:::

## Usage

::component-code
---
:name: LEmptyState
story-id: ui-kit-molecules-emptystate--with-icon
---
::

### With a call to action

Pass a `cta` object with `text` and `variant`, then handle `cta-click` to wire the next step:

```vue
<template>
  <EmptyState
    heading="No saved items yet"
    subline="Tap the heart on any product to save it for later."
    icon="essentials/heart"
    :cta="{ text: 'Browse new arrivals', variant: 'primary' }"
    @cta-click="$router.push('/new-arrivals')"
  />
</template>
```

## Feature List

::features
---
items:
  - "Three layout modes (icon, media, plain) driven by which props you pass, no `variant` flag to keep in sync"
  - "Media variant flips to side-by-side at the `sm` breakpoint and aligns text left; icon and plain modes center the content"
  - "`cta` prop accepts text plus button variant and emits `cta-click` so the action wiring stays in the consumer"
  - "Built on `TextGroup` (heading plus subline) so empty pages match the rest of the storefront's typographic rhythm"
  - "Image variant uses `<LMedia>` with a 4:3 aspect ratio, keeping transparent assets aligned across rows"
  - "BEM modifiers (`empty-state--has-media`, `empty-state--plain`) expose per-state hooks for theme overrides"
---
::

## API Reference

::component-meta{:name="EmptyState"}
::
