---
title: Field
description: A number input field component for entering numeric values with optional increment/decrement controls.
jiraIssueId: LUI-132
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-48
    target: _blank
---

## Overview

The Field component wraps form controls with a label, optional description, and error message. It provides consistent layout and accessibility (e.g. linking label to control) for inputs, selects, and custom controls.

## Key Business & UX Benefits

- Keeps labels, descriptions, and errors aligned and accessible.
- One wrapper for any control so forms look and behave consistently.
- Clear error display improves completion and reduces support.
- Required indicator and description support complex forms.

:::tip
Pro-Tip from Larry: Use Field for every form control so labels and errors are always linked correctly.
:::

## Usage

::component-code
---
name: Field
story-height: 140px
story-id: ui-kit-field--label-and-description
---
```vue-template
<Field label="Label And Description" description="This is a default description.">
  <Input placeholder="Input placeholder" />
</Field>
```
::

## Feature List

::features
---
items:
  - "Label and optional description for form controls"
  - "Error message display with accessible association"
  - "Required indicator support"
  - "Consistent layout for inputs, selects, and custom controls"
---
::

## API Reference

::component-meta{:name="Field"}
::
