---
title: Checkbox
description: Checkbox control for single-choice consent and multi-select groups, with tri-state support.
playground:
  name: Checkbox
  base: ui-kit-atoms-checkbox
  defaultStory: unchecked
  height: 460px
jiraIssueId: LUI-126
seo:
  title: Checkbox | Laioutr
  description: Checkbox control for single-choice consent and multi-select groups, with tri-state support.
sitemap:
  loc: /laioutr-ui/ui-kit/form/checkbox
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Checkbox is the bare-bones control used for single-checkbox consent (terms, opt-ins) and multi-select groupings (filters, preferences). It supports a tri-state value: pass `'indeterminate'` to render the mixed state used in parent/child checkbox patterns.

Checkbox picks up its `id` from a surrounding `Label`'s `forIdFromLabel` injection, but it does not read the wider Field context: `disabled`, `required`, and validation state must be passed as props directly. For a checkbox that integrates with `<LField>` label / description / error association, use [`InputCheckbox`](/laioutr-ui/ui-kit/form/input-checkbox) instead.

## Key Business & UX Benefits

- Tri-state support handles parent/child grouping out of the box, so filter trees and "select all" patterns stay coherent for shoppers and admins alike.
- One control covers consent rows, multi-select filters, and preference grids, so teams ship new flows without commissioning a new checkbox treatment each time.
- Pairs cleanly with `<Label>` for accessible labelling, and stays small enough that consumers compose validation around it however the form demands.

:::tip
Pro-Tip from Larry: For a labelled, Field-aware checkbox with built-in error wiring, reach for [`InputCheckbox`](/laioutr-ui/ui-kit/form/input-checkbox) and keep `Checkbox` for the bare control.
:::

### Indeterminate

```vue-template
<LCheckbox v-model="state" :default-checked="'indeterminate'" />
```

## Feature List

::features
---
items:
  - "Tri-state value: pass `'indeterminate'` to render the mixed state for parent/child checkbox patterns"
  - "Picks up `id` from a surrounding `Label`'s `forIdFromLabel` injection, so wrapping with `<LLabel>` is the simplest wiring"
  - "Deliberately bare: ignores Field context so consumers can compose validation, layout, and error wiring however the form demands"
  - "Pairs with `InputCheckbox` when full `<LField>` label, description, and error association is wanted"
  - "v-model with two-way value type makes the tri-state usable as a normal Vue model without external state machines"
---
::

## API Reference

::component-meta{:name="Checkbox"}
::
