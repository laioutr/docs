---
title: Input
description: Styled text input for forms and search with optional icon or button addons and variant support.
jiraIssueId: LUI-136
---

## Overview

The Input component provides a styled text field for forms and search. It supports optional addons (icons or buttons) on the left or right via slots, outline and other variants, and integrates with Field for labels and validation.

## Key Business & UX Benefits

- Consistent look and behavior for text fields across the app.
- Addon slots support search icons, clear buttons, and custom actions.
- Works with Field for labels and errors so forms stay accessible.
- Outline and other variants fit different layouts and emphasis.

:::tip
Pro-Tip from Larry: Use addon slots for search icon and clear button so the input is self-contained.
:::

## Usage

### Regular Input

::component-code
---
:name: Input
story-height: 90px
story-id: ui-kit-input--outline
---
```vue-template
<Input placeholder="Optional placeholder" />
```
::

### Input with Addons

::component-code
---
:name: LuiInputGroup
story-height: 90px
story-id: ui-kit-input--with-addons
---
```vue-template
<Input placeholder="Input placeholder">
  <template #addon-left>
    <InputGroupAddon>
      <Icon name="actions/zoom-out" />
    </InputGroupAddon>
  </template>
  <template #addon-right>
    <InputGroupButton>
      <Icon name="actions/zoom-in" />
    </InputGroupButton>
  </template>
</Input>
```
::

## Feature List

::features
---
items:
  - "Styled text input with outline and other variants"
  - "Optional addon slots for icons or buttons left and right"
  - "Integration with Field for label and error display"
  - "Placeholder and disabled state support"
---
::

## API Reference

### Input

::component-meta{:name="Input"}
::

### InputGroupAddon

::component-meta{:name="InputGroupAddon"}
::

### InputGroupButton

::component-meta{:name="InputGroupButton"}
::
