---
title: Input Autocomplete
description: Single-select autocomplete input driven by an options array.
playground:
  name: InputAutocomplete
  base: ui-kit-molecules-inputautocomplete
  defaultStory: default
  height: 460px
seo:
  title: Input Autocomplete | Laioutr
  description: Single-select autocomplete input.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-autocomplete
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`InputAutocomplete` is the data-driven, single-select autocomplete. Pass an `options` array of `{ value, label, disabled? }` and the component handles filtering, keyboard navigation, and selection. Wrap it in `<LField>` to inherit `id`, `disabled`, `required`, `invalid`, and `errorMessage` from the surrounding form chrome.

For multi-select pickers and custom display formatters, use [`InputCombobox`](/laioutr-ui/ui-kit/form/input-combobox) instead.

## Key Business & UX Benefits

- Typeahead filtering cuts the number of taps to pick a country, city, or category, which shortens checkout and signup flows on mobile.
- Disabled-option support lets the picker show what exists but is currently unavailable, so customers self-serve answers like "ships to my country?" without contacting support.
- Field integration keeps label, required, and error state in one place, so a misspelled country code surfaces inline rather than failing silently on submit.

## Feature List

::features
---
items:
  - "`options` accepts an array of `{ value, label, disabled? }`, keeping the data shape simple while supporting unavailable picks"
  - "Built-in typeahead filtering and keyboard navigation, so country and category pickers cut taps on mobile"
  - "Inherits `id`, `disabled`, `required`, `invalid`, and `errorMessage` from `<LField>` context, removing per-control ARIA wiring"
  - "Single-select v-model with the option's `value`, so consumers store a plain string or id instead of a custom object"
  - "Pair with `InputCombobox` when multi-select or custom display formatters are needed"
---
::

## API Reference

::component-meta{:name="InputAutocomplete"}
::
