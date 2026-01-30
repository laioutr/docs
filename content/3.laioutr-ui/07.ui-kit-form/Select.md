---
title: Select
description: A dropdown select component for choosing a single option from a list.
jiraIssueId: LUI-134
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=103-223391&t=wABQtnJ0GubOC0US-4
    target: _blank
---

## Overview

The Select component provides a dropdown interface for choosing a single option from a predefined list. It renders a trigger button that opens a floating options panel with keyboard navigation support. Built with proper ARIA semantics, it's suitable for form fields where users must select exactly one value from a known set of options, such as country selection, sorting preferences, or category filters.

## Key Business & UX Benefits

- One control for single-choice from a list (country, sort, filter).
- Keyboard navigation and ARIA keep it accessible.
- Customizable trigger icon and text fit headers and forms.
- Fits sort dropdowns, country selectors, and filter bars.

:::tip
Pro-Tip from Larry: Use Select for sort and filters so users pick one option without leaving the page.
:::

## Usage

::component-code
---
:name: Select
story-height: 100px
story-id: ui-kit-select--sort
---
```vue-template
<Select
  triggerIcon="actions/sort"
  triggerText="Sort by"
  modelValue="price"
  :items="[
    { label: 'Price', value: 'price' },
    { label: 'Name', value: 'name' },
    { label: 'Date', value: 'date' },
  ]"
/>
```
::

## Feature List

::features
---
items:
  - "Dropdown for single selection from a list"
  - "Customizable trigger icon and text"
  - "Keyboard navigation and ARIA support"
  - "Suitable for sort, country, and filter forms"
---
::

## API Reference

::component-meta{:name="Select"}
::
