---
title: Label
description: Renders an accessible label associated with controls.
links: []
---

## Features

- Different sizes
- With required and non required flags

## Usage

### Different sizes

::component-code
---
:name: Label
:story-height: 80px
story-id: ui-kit-label--small
title: Label Small
---
```vue-template
<Label />
```
::

::component-code
---
:name: Label
:story-height: 80px
story-id: ui-kit-label--medium
title: Label Medium
---
```vue-template
<Label size="medium" />
```
::

### With required mark

::component-code
---
:name: Label
:story-height: 80px
story-id: ui-kit-label--required-small
title: Label Small Required
---
```vue-template
<Label isRequired />
```
::

::component-code
---
:name: Label
:story-height: 80px
story-id: ui-kit-label--required-medium
title: Label Medium Required
---
```vue-template
<Label size="medium" isRequired />
```
::

## API Reference

::component-meta{:name="Label"}
::
