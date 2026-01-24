---
title: Swiper Navigation Compact
description: A compact slider navigation component providing accessible arrow and bullet controls with dark/light mode support.
jiraIssueId: LUI-19
---

## Overview

SwiperNavigationCompact provides an accessible navigation interface for slider components, enabling navigation through arrow buttons and bullet indicators with keyboard and pointer support. The component adapts to its parent slider's background through dark/light mode switching, ensuring controls remain visible regardless of slide content. Viewport-specific visibility controls allow optimizing the navigation experience for each device type.

## Usage

::component-code
---
:name: LuiSwiperNavigationCompact
story-id: molecules-swiper-swipernavigationcompact--swiper-navigation-compact
---
::

## Features

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
