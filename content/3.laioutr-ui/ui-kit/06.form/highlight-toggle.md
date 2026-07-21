---
title: Highlight Toggle
description: Two-way toggle with label and optional badge for binary choices where one side carries emphasis.
playground:
  name: HighlightToggle
  base: ui-kit-molecules-highlighttoggle
  defaultStory: default
  height: 460px
links: []
seo:
  title: Highlight Toggle
  description: Two-way toggle with label and optional badge for binary choices.
sitemap:
  loc: /laioutr-ui/ui-kit/form/highlight-toggle
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/saas/billingcycleswitch
---

## Overview

Highlight Toggle is a generic two-way `v-model` switch with a label and an optional badge. Reach for it when one side of a binary choice carries a savings, recommendation, or emphasis: billing cycle, currency, unit, or any A/B preference where you want to nudge users toward one option.

## Key Business & UX Benefits

- The built-in `badge` text prop surfaces "Save 20%" or "Recommended" right next to the choice, which lifts annual billing adoption on pricing pages.
- One toggle drives every dependent card on the page, so monthly/annual switches stay in sync across the layout without per-card state plumbing.
- The label-plus-badge layout reads instantly on mobile, where a plain switch would force the user to guess which side carries the savings.
- Generic v-model means the same control handles billing cycle, unit (kg vs lb), and currency without forking the component for each use case.

:::tip
Pro-Tip from Larry: For pricing pages, render a `Save 20%` badge on the annual side so the benefit is visible at a glance.
:::

## Feature List

::features
---
items:
  - "Required `label` plus optional `badge` text places a savings or recommendation pill right next to the binary choice"
  - "`v-model` typed as `boolean` (default false), so the same control handles billing cycle, unit, and currency toggles without forking"
  - "Built on `Switch` internally, so the underlying touch target stays consistent with the rest of the form kit"
  - "Field-aware: reads `disabled` and `invalid` from `<LField>` context, so wrapped instances inherit form state without prop drilling"
  - "BEM state modifiers (`highlight-toggle--on`/`--off`/`--invalid`) and a dedicated `__badge` element give per-state theming hooks"
  - "`aria-label` falls back to `label`, so a custom label still gets a sensible default announcement"
---
::

## API Reference

::component-meta{:name="HighlightToggle"}
::
