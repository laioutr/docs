---
title: Pricing Plans
description: A responsive pricing grid arranging plan cards side-by-side on desktop with mobile swipe carousel.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=4085-62868&t=U5zoMMsDXxVv1RWo-4
    target: _blank
jiraIssueId: LUI-3
seo:
  title: Pricing Plans | Laioutr
  description: A responsive pricing grid arranging plan cards side-by-side on desktop with mobile swipe carousel.
---

## Overview

Provides a responsive container for displaying multiple subscription plans in an easily comparable format. Display three or more pricing tiers in a horizontal grid on desktop for easy side-by-side comparison. On mobile, present cards as a swipeable slider with engaging coverflow animation effects. Synchronizes with billing cycle switches to update all cards simultaneously.

## Key Business & UX Benefits

- One section for multiple pricing cards so comparison is easy.
- Grid on desktop and slider on mobile fit different viewports.
- Billing cycle sync keeps all cards in sync when toggling monthly/annual.
- Navigation bullets and coverflow keep the slider usable.

:::tip
Pro-Tip from Larry: Use Pricing Plans with a billing cycle switch so cards update together.
:::

## Usage

::component-code
---
:name: LuiPricingGrid
:story-height: 800px
story-id: molecules-pricing-pricinggrid--pricing-grid
---
::

## Feature List

::features
---
items:
  - Side-by-side grid layout for comparing multiple pricing tiers
  - Mobile swipe carousel with coverflow animation effects
  - Navigation bullets for slide indication and direct navigation
  - Responsive breakpoint handling between grid and slider modes
---
::

## API Reference

::component-meta{:name="PricingGrid"}
::
