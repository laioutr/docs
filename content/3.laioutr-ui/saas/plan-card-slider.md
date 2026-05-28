---
title: Plan Card Slider
description: A responsive grid of Plan Cards on desktop with a mobile swipe carousel.
playground:
  name: PlanCardSlider
  base: ui-sections-plancardslider
  defaultStory: default
  height: 800px
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=4085-62868&t=U5zoMMsDXxVv1RWo-4
    target: _blank
jiraIssueId: LUI-3
seo:
  title: Plan Card Slider | Laioutr
  description: A responsive grid of Plan Cards on desktop with a mobile swipe carousel.
sitemap:
  loc: /laioutr-ui/saas/plan-card-slider
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/saas/pricingplans
---

## Overview

Plan Card Slider arranges multiple `PlanCard`s in a responsive layout. On desktop, tiers sit side-by-side for direct comparison. On smaller breakpoints they collapse into a swipeable carousel with coverflow animation and navigation bullets.

Wrap the slider with a `HighlightToggle` so the user can flip every card between monthly and annual pricing at once.

## Key Business & UX Benefits

- Side-by-side desktop layout makes plans easy to compare at a glance, which is the comparison pattern that closes the most deals on pricing pages.
- A swipeable mobile carousel keeps every plan reachable on small screens without truncating any tier, protecting conversion for the growing share of mobile sign-ups.
- One layout primitive handles two or six plans, so pricing experiments and new-tier launches don't need a re-skin of the grid.
- Pairing with `HighlightToggle` for monthly/annual switching keeps all cards in sync, so customers never see mixed pricing while they decide.

:::tip
Pro-Tip from Larry: Put the `HighlightToggle` above the slider, not inside it, so the control stays visible while the user pans through cards on mobile.
:::

## Feature List

::features
---
items:
  - "Desktop layout pins three plans side by side; smaller breakpoints (xs through md) collapse into a Swiper with fractional slidesPerView"
  - "Coverflow effect on touch breakpoints adds depth so the focused card stands out without hiding adjacent tiers"
  - "Pagination bullets render at the bottom of the mobile carousel so shoppers always know where they are in the lineup"
  - "Works directly with HighlightToggle through the shared isAnnualBilling localStorage key, so one toggle drives every card"
  - "Pass any number of plans through the plans prop (PlanCardProps[]) to fit two-tier comparisons or six-tier ladders without changing the slider config"
---
::

## API Reference

::component-meta{:name="PlanCardSlider"}
::
