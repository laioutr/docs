---
title: Input Checkbox
description: Labelled checkbox combining Checkbox and Label, with built-in required indicator.
playground:
  name: InputCheckbox
  base: ui-kit-molecules-inputcheckbox
  defaultStory: unchecked
  height: 460px
links: []
seo:
  title: Input Checkbox | Laioutr
  description: Labelled checkbox combining Checkbox and Label.
sitemap:
  loc: /laioutr-ui/ui-kit/form/inputcheckbox
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

InputCheckbox combines a Checkbox with a Label in one component, so you get a labelled checkbox without manually wiring them together. Use it for consent rows, single opt-ins, and short form fields where every checkbox needs its own label.

For multi-select groups inside a `Field`, use [`Checkbox`](/laioutr-ui/ui-kit/form/checkbox) directly so the Field's label covers the group.

## Key Business & UX Benefits

- Label-checkbox pairing in one component removes the most common accessibility bug on consent rows, where a missing `for` attribute blocks click-to-toggle for assistive tech.
- Built-in required indicator makes legally mandatory consent (terms, marketing opt-in) visually obvious, supporting compliance without bespoke styling.
- One component per row keeps consent screens fast to ship for legal updates, which matters when regulations change on short notice.

:::tip
Pro-Tip from Larry: Use InputCheckbox when you need a labelled checkbox so the label is always associated.
:::

## Feature List

::features
---
items:
  - "Pairs `Checkbox` with `Label` and wires the `for`/`id` association, so click-to-toggle works for assistive tech"
  - "Built-in required indicator visually marks legally mandatory consents like terms and marketing opt-ins"
  - "Inherits `<LField>` context (`disabled`, `required`, `invalid`, `errorMessage`), so consent rows pick up form state automatically"
  - "v-model passes through to the underlying Checkbox, supporting `'indeterminate'` for parent/child consent grouping"
  - "Drop-in replacement for raw `<input type=\"checkbox\">` plus `<label>` markup, with focus-visible and disabled chrome included"
---
::

## API Reference

::component-meta{:name="InputCheckbox"}
::
