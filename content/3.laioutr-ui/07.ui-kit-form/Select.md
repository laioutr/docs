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

## API Reference

::component-meta{:name="Select"}
::
