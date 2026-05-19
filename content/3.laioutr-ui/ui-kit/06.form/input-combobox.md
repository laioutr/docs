---
title: Input Combobox
description: Single or multi-select combobox with a custom display formatter for the chosen value.
seo:
  title: Input Combobox | Laioutr
  description: Single or multi-select combobox.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-combobox
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`InputCombobox` is the data-driven combobox for single- and multi-select picker UIs. Pass `multiple` to allow picking more than one option, and `displayValue` to control how the chosen value(s) render in the trigger (e.g. `"3 tags"` instead of `"red, blue, green"`).

Wrap it in `<LField>` to inherit `id`, `disabled`, `required`, `invalid`, and `errorMessage`. For simple single-select autocomplete without a custom display formatter, use [`InputAutocomplete`](/laioutr-ui/ui-kit/form/input-autocomplete).

## Key Business & UX Benefits

- The `displayValue` formatter keeps the trigger readable when ten tags are selected (`"10 tags"` vs a comma-separated wall of text), so dense filter UIs stay scannable.
- One combobox primitive handles both single and multi-select, which means the same component can ship customer-facing pickers and admin tooling without divergence.
- Field-driven validation means a required tag picker surfaces its error inline, preventing the silent failures that frustrate users mid-form.

## Usage

::component-code
---
:name: LInputCombobox
:story-height: 150px
story-id: ui-kit-molecules-inputcombobox--default
title: InputCombobox Default
---
```vue-template
<Field label="Tags">
    <InputCombobox v-model="tags" multiple :options="tagOptions" />
  </Field>
```
::

## Feature List

::features
---
items:
  - "`multiple` boolean toggles single- and multi-select picker behavior from one component"
  - "`displayValue` formatter controls how the chosen value(s) render in the trigger, so 10 tags can show as `\"10 tags\"` instead of a comma-separated wall"
  - "Typed `options` array (`{ value, label, disabled? }`) keeps the data shape compatible with `InputAutocomplete`"
  - "Inherits `id`, `disabled`, `required`, `invalid`, and `errorMessage` from `<LField>` context"
  - "v-model carries a single value or an array depending on `multiple`, so consumers don't switch components for the two modes"
---
::


## API Reference

::component-meta{:name="InputCombobox"}
::
