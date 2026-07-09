---
title: Input
description: Styled text field with optional icon or button addons and Field integration for labels and errors.
playground:
  name: Input
  base: ui-kit-molecules-input
  defaultStory: outline
  height: 460px
jiraIssueId: LUI-136
seo:
  title: Input
  description: Styled text field with optional icon or button addons and Field integration for labels and errors.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Input is the styled text field for forms and search. It accepts optional addons (icons or buttons) on either side via slots, and several visual variants.

Wrap an Input in `<LField>` and pass `errorMessage` on the Field. The Field's `errorMessage` automatically derives `invalid` on the Input, so you rarely need to set `invalid` directly.

For composed groups (currency symbols, action buttons), use [`InputGroup`](/laioutr-ui/ui-kit/form/input-group) with `InputGroupAddon` and `InputGroupButton`.

## Key Business & UX Benefits

- One text-field primitive powers every form on the site, so account, checkout, and search inputs share the exact same look, feel, and error behaviour.
- Addon slots cover currency, units, and inline action buttons without nesting hacks, so teams can launch new pricing or search experiences quickly.
- Field-driven `invalid` state means a single source of truth for validation, reducing the chance that an error message and a field's styling get out of sync mid-flow.
- Consistent focus and error styling matches assistive-tech expectations, supporting accessibility compliance and reducing form abandonment from confused users.

:::tip
Pro-Tip from Larry: Wrap inputs in `<LField>` and pass `errorMessage`; `invalid` is derived automatically.
:::

### Input with Addons

::component-code
---
:name: LInputGroup
story-height: 90px
story-id: ui-kit-molecules-input--with-addons
---
```vue-template
<LInput placeholder="Input placeholder">
  <template #addon-left>
    <LInputGroupAddon>
      <LIcon name="actions/zoom-out" />
    </LInputGroupAddon>
  </template>
  <template #addon-right>
    <LInputGroupButton>
      <LIcon name="actions/zoom-in" />
    </LInputGroupButton>
  </template>
</LInput>
```
::

### Invalid State

```vue-template
<LInput :invalid="hasError" placeholder="Email" />
```

## Feature List

::features
---
items:
  - "Two slot addons (`#addon-left`, `#addon-right`) accept `InputGroupAddon` and `InputGroupButton` for currency, units, and inline actions"
  - "Auto-derives `invalid` from `<LField>`'s `errorMessage`, so callers rarely set `invalid` directly"
  - "Inherits `id`, `disabled`, `readonly`, `required`, and `errorMessage` from the surrounding `<LField>` context"
  - "Single primitive shared by account, checkout, and search inputs, so error and focus chrome stay consistent storefront-wide"
  - "Pair with `InputGroup` plus `InputGroupAddon`/`InputGroupButton` when composed groups need flush-mounted decoration"
---
::

### Input

::component-meta{:name="Input"}
::

### InputGroupAddon

::component-meta{:name="InputGroupAddon"}
::

### InputGroupButton

::component-meta{:name="InputGroupButton"}
::
