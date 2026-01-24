---
title: Select
description: An advanced variant selection component for products with many options, using an off-canvas sheet to display variants grouped by color with thumbnails and pricing.
jiraIssueId: LUI-88
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=103-223391&t=wABQtnJ0GubOC0US-4
    target: _blank
---

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

## Features

::features
---
items:
  - "Off-canvas sheet with grouped variant display"
  - "Variant thumbnails with price, stock info, and savings badges"
  - "Color swatch grouping with expandable sections"
  - "Radio group selection with real-time product updates"
---
::

## API Reference

::component-meta{:name="Select"}
::
