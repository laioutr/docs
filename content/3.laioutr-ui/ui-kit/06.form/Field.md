---
title: Field
description: Form field wrapper that adds label, description, and error message around any input control.
jiraIssueId: LUI-132
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-48
    target: _blank
seo:
  title: Field | Laioutr
  description: Form field wrapper that adds label, description, and error message around any input control.
sitemap:
  loc: /laioutr-ui/ui-kit/form/field
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Field wraps a form control with a label, optional description, and error message. It provides consistent layout and accessibility (label-to-control association, error announcement) for inputs, selects, and custom controls.

Pass `errorMessage` and Field will derive `invalid` for you, so error styling stays in sync with the displayed message. Pass `invalid` explicitly only when you need the error state without a message.

Descendants pick up Field state (`id`, `disabled`, `readonly`, `required`, `invalid`, `errorMessage`) via context, so you can set `disabled` once on the Field instead of on every nested control.

## Key Business & UX Benefits

- Centralising label, description, and error association in one wrapper cuts the time to ship new forms and keeps accessibility audits clean across the whole product.
- Auto-derived `invalid` state from `errorMessage` keeps validation visuals and announced text in sync, so customers see and hear the same problem and recover faster.
- Setting `disabled` once on the Field instead of every child eliminates a common class of bugs where one nested control stays interactive during a submit.
- Consistent error layout reduces visual noise on sign-up and checkout forms, which protects conversion when users hit a validation issue.

:::tip
Pro-Tip from Larry: Pass `errorMessage` and let Field derive `invalid` for you; no need to bind both.
:::

## Usage

::component-code
---
name: LField
story-height: 140px
story-id: ui-kit-molecules-field--label-and-description
---
```vue-template
<LField label="Label And Description" description="This is a default description.">
  <LInput placeholder="Input placeholder" />
</LField>
```
::

### With Error Message

```vue-template
<LField label="Email" error-message="Please enter a valid email address">
  <LInput type="email" />
</LField>
```

## Feature List

::features
---
items:
  - "Wraps any control with consistent label-to-control association and error announcement, no per-control ARIA wiring needed"
  - "Auto-derives `invalid` from `errorMessage`, so validation visuals and announced text stay in sync"
  - "Publishes `id`, `disabled`, `readonly`, `required`, `invalid`, and `errorMessage` to descendants via context, so child controls inherit field state"
  - "Setting `disabled` once on the Field disables every nested control, removing a common bug where one input stays interactive during submit"
  - "Optional `description` prop adds helper copy with its own ARIA association, so screen readers announce help text alongside the label"
  - "Pass `invalid` explicitly without `errorMessage` for the error visual without a displayed message"
---
::

## API Reference

::component-meta{:name="Field"}
::
