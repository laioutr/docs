---
title: Swiper Navigation Compact
description: A compact slider navigation component providing accessible arrow and bullet controls with dark/light mode support.
jiraIssueId: LUI-19
seo:
  title: Swiper Navigation Compact | Laioutr
  description: A compact slider navigation component providing accessible arrow and bullet controls with dark/light mode support.
---

## Overview

SwiperNavigationCompact provides an accessible navigation interface for slider components, enabling navigation through arrow buttons and bullet indicators with keyboard and pointer support. The component adapts to its parent slider's background through dark/light mode switching, ensuring controls remain visible regardless of slide content. Viewport-specific visibility controls allow optimizing the navigation experience for each device type.

## Key Business & UX Benefits

- Arrows and bullets in one compact control so sliders stay usable.
- Dark/light mode keeps controls visible on any slide background.
- Viewport-specific visibility (mobile/desktop) fits different layouts.
- Keyboard and pointer support keep navigation accessible.

:::tip
Pro-Tip from Larry: Use Swiper Navigation Compact so arrows and bullets adapt to the slider background.
:::

## Usage

::component-code
---
:name: LuiSwiperNavigationCompact
story-id: molecules-swiper-swipernavigationcompact--swiper-navigation-compact
---
::

## Feature List

::features
---
items:
  - "Dark and light mode support for different background contexts"
  - "Configurable arrow visibility per viewport (mobile/desktop/both/none)"
  - "Configurable bullet indicator visibility per viewport"
  - "Integrates with Swiper via useSwiper() composable"
---
::

## API Reference

::component-meta{:name="SwiperNavigationCompact"}
::
