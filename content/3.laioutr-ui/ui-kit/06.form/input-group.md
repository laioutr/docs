---
title: Input Group
description: Composes an Input with leading and trailing addons such as icons, text, or action buttons.
seo:
  title: Input Group | Laioutr
  description: Composes an Input with leading and trailing addons.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-group
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

There is no `InputGroup` parent component. The ui-kit ships two atoms (`InputGroupAddon` and `InputGroupButton`) that you place alongside an `Input` inside your own flex wrapper. Use `InputGroupAddon` for static decoration (the dollar sign in `$ 19.99`) and `InputGroupButton` for interactive addons (a clear or submit button).

Addons sit flush against the input through the wrapper's gap settings. Add layout chrome at the call site if you need extra spacing.

## Key Business & UX Benefits

- Currency, unit, and search-action affordances render as part of the field, so customers see what they're entering ("$ 19.99 USD") without scanning helper text below.
- Splitting static decoration from interactive buttons keeps tap targets unambiguous on mobile, which reduces accidental triggers on the dollar sign or unit label.
- Two small atoms drop into any flex row, so consumers compose the grouping that fits their form without inheriting a heavier wrapper component.

## Usage

```vue
<template>
  <div class="flex items-stretch">
    <InputGroupAddon>$</InputGroupAddon>
    <Input v-model="price" />
    <InputGroupAddon>USD</InputGroupAddon>
  </div>
</template>
```

For an interactive trailing button (clear, submit, search), swap one of the addons for `InputGroupButton`, which accepts a required `label` and an optional `disabled` flag:

```vue
<template>
  <div class="flex items-stretch">
    <Input v-model="query" />
    <InputGroupButton label="Search" @click="runSearch">
      <Icon name="essentials/search" />
    </InputGroupButton>
  </div>
</template>
```

## Feature List

::features
---
items:
  - "Two atoms (`InputGroupAddon`, `InputGroupButton`) compose into any flex wrapper, so consumers own the layout and there is no parent component to inherit"
  - "Addons sit flush against the input, so the field reads as a single unit: `$ 19.99 USD`, search field plus submit, quantity plus stepper"
  - "Static `InputGroupAddon` keeps decoration unfocusable, so currency and unit labels can't accidentally absorb taps"
  - "Interactive `InputGroupButton` requires a `label` prop, giving clear and submit affordances proper accessible names for keyboard and screen readers"
  - "Slots accept any markup, so consumers can drop icons, text, or theme-styled chrome into either end without overrides"
---
::

## API Reference

### LInputGroupAddon

::component-meta{:name="InputGroupAddon"}
::

### LInputGroupButton

::component-meta{:name="InputGroupButton"}
::
