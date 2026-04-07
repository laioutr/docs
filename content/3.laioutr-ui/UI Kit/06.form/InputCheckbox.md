---
title: Input Checkbox
description: A control that allows the user to toggle between checked and not checked.
links: []
seo:
  title: Input Checkbox | Laioutr
  description: A control that allows the user to toggle between checked and not checked.
---

## Overview

InputCheckbox combines a Checkbox control with a Label in one component, so you get a labelled checkbox without wiring them manually. Supports required indicator and fits forms and filter panels.

## Key Business & UX Benefits

- Single component for labelled checkbox reduces markup and errors.
- Required indicator and accessible label association built in.
- Matches Field and other form components for consistent layout.
- Fits consent checkboxes, filters, and preference toggles.

:::tip
Pro-Tip from Larry: Use InputCheckbox when you need a labelled checkbox so the label is always associated.
:::

## Usage

Combines Checkbox component with Label component.

::component-code
---
name: InputCheckbox
story-height: 60px
story-id: ui-kit-inputcheckbox--unchecked
---
```vue-template
<InputCheckbox label="Label" isRequired />
```
::

## Feature List

::features
---
items:
  - "Checkbox with integrated label"
  - "Required indicator support"
  - "Accessible label-to-control association"
  - "Consistent styling with other form controls"
---
::

## API Reference

::component-meta{:name="InputCheckbox"}
::
