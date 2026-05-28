---
title: Select
description: Dropdown select for choosing a single option from a predefined list.
playground:
  name: Select
  base: ui-kit-molecules-select
  defaultStory: default
  height: 460px
jiraIssueId: LUI-134
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/L5EsT6m0VoOXsqqDHXtCe3/laioutr-SHOP?node-id=103-223391&t=wABQtnJ0GubOC0US-4
    target: _blank
seo:
  title: Select | Laioutr
  description: Dropdown select for choosing a single option from a predefined list.
sitemap:
  loc: /laioutr-ui/ui-kit/form/select
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Select renders a trigger button that opens a floating panel of options with keyboard navigation. Use it when the user must pick exactly one value from a known set: country, sort key, category filter, currency. For short, fully visible lists (three or four options), [`InputRadio`](/laioutr-ui/ui-kit/form/input-radio) usually reads better.

Trigger styling lives on the nested `trigger` config rather than a top-level prop, so set the size with `:trigger="{ size: 's' }"`. Pass `prioritizePosition` to keep the dropdown anchored to a specific edge of the trigger.

## Key Business & UX Benefits

- A single dropdown primitive covers country, sort, currency, and filter pickers, so every "choose one" surface in the product behaves the same way.
- Keyboard navigation and typeahead are built in, which keeps power users (and accessibility audits) happy without per-screen tuning.
- Position pinning prevents the floating panel from flipping over critical content, protecting visibility of the option list on dense layouts.
- A single trigger styling contract keeps catalog tools and account screens visually coherent, reducing the bespoke select treatments that creep in over time.

:::tip
Pro-Tip from Larry: Set the trigger size via `:trigger="{ size: 's' }"`.
:::

## Usage

::component-code
---
:name: LSelect
story-height: 250px
story-id: ui-kit-molecules-select--sort
---
```vue-template
<LSelect
  trigger-icon="actions/sort"
  trigger-text="Sort by"
  v-model="value"
  :trigger="{ size: 's' }"
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
  - "`items` accepts `{ label, value }` objects, so country, sort, currency, and filter pickers all share one data shape"
  - "Nested `trigger` config (e.g. `:trigger=\"{ size: 's' }\"`) sets trigger styling without flooding the top-level prop list"
  - "`triggerIcon` and `triggerText` configure the resting state separately from the selected value, useful for 'Sort by' patterns"
  - "`prioritizePosition` anchors the dropdown to a specific edge of the trigger, so panels don't flip over critical content"
  - "Built on reka-ui, so keyboard navigation, typeahead, and focus return ship with the primitive"
  - "v-model holds the option's `value`, so consumers store a plain string instead of the option object"
---
::

## API Reference

::component-meta{:name="Select"}
::
