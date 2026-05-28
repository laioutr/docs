---
title: Tabs
description: Reka-UI-backed tab compound with accessible tab list and panels.
playground:
  name: Tabs
  base: ui-kit-molecules-tabs
  defaultStory: default
  height: 460px
seo:
  title: Tabs | Laioutr
  description: Reka-UI-backed tabs primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/tabs
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`Tabs` is the Reka-UI-backed tab compound: a tab list with matching panels, ARIA semantics handled out of the box. Auto-imports as `<LTabs>`.

## Key Business & UX Benefits

- A single tab pattern covers PDP content sections, account dashboards, and admin views, so shoppers and operators never have to relearn the navigation.
- ARIA roles, roving tabindex, and arrow-key navigation are wired in, satisfying WCAG criteria that procurement and B2B buyers routinely check.
- Default-value support makes deep-linking tabs straightforward, so marketing can drive traffic to a specific section (reviews, shipping) from email and ads.
- Lazy panel content keeps initial render light, protecting Core Web Vitals on PDP and other tab-heavy pages.

## Feature List

::features
---
items:
  - "Two `orientation` values ('horizontal', 'vertical', default 'horizontal') cover top-tabs and side-rail patterns from one component"
  - "Two `activationMode` values ('automatic', 'manual', default 'automatic') control whether arrow keys activate the focused tab or just move focus"
  - "`defaultValue` for uncontrolled use plus `modelValue` and `update:modelValue` for controlled binding, so deep-linked tabs work out of the box"
  - "Built on reka-ui's tabs primitives, so ARIA roles, roving tabindex, and arrow-key navigation ship without per-use wiring"
  - "Four-part composition (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) keeps the structure explicit and lazy-renders inactive panels"
---
::

## API Reference

::component-meta{:name="Tabs"}
::
