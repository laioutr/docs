---
title: Input
description: A text input component
links: []
---

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
