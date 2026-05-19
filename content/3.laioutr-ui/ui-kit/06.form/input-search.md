---
title: Input Search
description: Search input with a pre-configured search icon, clear button, and searchTerm v-model.
jiraIssueId: LUI-59
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=13084-116873&t=6xBvZNXlqO6bv1Wx-4
    target: _blank
seo:
  title: Input Search | Laioutr
  description: Search input with a pre-configured search icon and clear button.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-search
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/form/inputsearch
---

## Overview

`InputSearch` is the search input atom for header search and any in-page search field. It wraps `InputGroup` and `Input` with a pre-configured search icon and clear-button logic, and exposes its live value via the `searchTerm` v-model channel. Pressing Enter on a non-empty value fires an `@search` event so consumers can run the actual search without listening for every keystroke.

For the autocomplete-driven header search molecule with suggestions, use [`SearchAutoSuggest`](/laioutr-ui/navigation/search-auto-suggest).

## Key Business & UX Benefits

- A dedicated clear button shortens the loop between failed searches and retry, which keeps shoppers exploring instead of bouncing.
- The pre-configured search icon and `searchTerm` v-model channel mean every header and in-page search behaves the same, training customers on one pattern.
- Composing `InputGroup` and `Input` under the hood guarantees the search field inherits the form system's accessibility and theming for free.

:::tip
Pro-Tip from Larry: Place search in the main nav so users can find products without digging through menus.
:::

## Usage

::component-code
---
:name: LInputSearch
story-height: 90px
story-id: ui-kit-molecules-inputsearch--default
---
::

## Feature List

::features
---
items:
  - "Pre-configured search icon and clear-button logic, so every header and in-page search uses the same affordances"
  - "`searchTerm` v-model channel exposes the live value, separating live state from the committed search action"
  - "`@search` event fires on Enter for non-empty values, so consumers run the actual search on commit instead of every keystroke"
  - "Built on `InputGroup` and `Input`, so the field inherits form-kit accessibility and theming"
  - "Pair with `SearchAutoSuggest` when the header search needs suggestion dropdowns"
---
::

## API Reference

::component-meta{:name="InputSearch"}
::
