---
title: Switch
description: A billing cycle switch component that toggles between monthly and annual pricing, updating all pricing cards simultaneously and showing potential savings.
jiraIssueId: LUI-4
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3880-37284&t=FoBBvGt4bI9KoJwB-4
    target: _blank
---

## Features

- Available in different sizes
- Available in all relevant states

## Usage

### Different Sizes

::component-code
---
:name: LuiSwitch
:story-height: 75px
story-id: ui-kit-switch--small
title: Switch Small
---
```vue-template
<LuiSwitch />
```
::

::component-code
---
:name: LuiSwitch
:story-height: 75px
story-id: ui-kit-switch--medium
title: Switch Medium
---
```vue-template
<LuiSwitch />
```
::

### Checked State

::component-code
---
:name: LuiSwitch
:story-height: 75px
story-id: ui-kit-switch--checked
title: Switch checked
---
```vue-template
<LuiSwitch />
```
::

### Disabled State

::component-code
---
:name: LuiSwitch
:story-height: 75px
story-id: ui-kit-switch--disabled
title: Switch Unchecked Disabled
---
```vue-template
<LuiSwitch />
```
::

::component-code
---
:name: LuiSwitch
:story-height: 75px
story-id: ui-kit-switch--disabled-checked
title: Switch Checked Disabled
---
```vue-template
<LuiSwitch />
```
::

## Features

::features
---
items:
  - "Toggle between monthly and annual billing"
  - "Persisted preference via localStorage"
  - "Synchronized update of all pricing cards"
---
::

## API Reference

::component-meta{:name="Switch"}
::
