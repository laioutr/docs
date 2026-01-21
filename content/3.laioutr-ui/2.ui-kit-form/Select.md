---
title: Select
description: Displays a list of options for the user to pick from—triggered by a button.
links: []
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

## API Reference

::component-meta{:name="Select"}
::
