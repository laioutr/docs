---
title: Listbox
description: Reka-UI-backed listbox primitive for single or multi-select option lists.
playground:
  name: Listbox
  base: ui-kit-molecules-listbox
  defaultStory: default
  height: 460px
seo:
  title: Listbox | Laioutr
  description: Reka-UI-backed listbox primitive.
sitemap:
  loc: /laioutr-ui/ui-kit/form/listbox
  lastmod: 2026-05-19
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/surfaces/listbox
---

## Overview

`Listbox` is the Reka-UI-backed primitive for single or multi-select option lists. Auto-imports as `<LListbox>`.

## Key Business & UX Benefits

- Single and multi-select share one component, so filter panels, size pickers, and admin tables stay visually consistent across the app.
- ARIA roles and arrow-key navigation come from Reka UI, removing a common accessibility gap that blocks enterprise procurement.
- Predictable v-model binding lets product teams wire complex selection flows without writing custom state machines.
- A shared listbox visual style means filter UX feels the same on PLP, search, and checkout, which reduces shopper friction at every step of the funnel.

## Feature List

::features
---
items:
  - "`multiple` boolean (default false) toggles between single and multi-select with the same component"
  - "`modelValue` typed as `string | string[]`, so v-model carries either a single value or an array depending on `multiple`"
  - "Two `orientation` values ('horizontal', 'vertical', default 'vertical') cover stacked filters and inline chip rows"
  - "Built on reka-ui, so arrow-key navigation and ARIA roles ship without per-use wiring"
  - "Auto-imports as `<LListbox>`, paired with `<LListboxItem>` for each option"
  - "Field-aware `aria-required` and `aria-invalid` plumbing means listboxes work inside `<LField>` with no extra props"
---
::

## API Reference

::component-meta{:name="Listbox"}
::

::component-meta{:name="ListboxItem"}
::
