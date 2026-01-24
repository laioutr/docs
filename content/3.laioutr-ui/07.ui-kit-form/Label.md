---
title: Label
description: An EU energy label component for products that displays a clickable preview image opening a fullscreen lightbox with the full energy label and datasheet link.
jiraIssueId: LUI-91
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

## Features

::features
---
items:
  - "Thumbnail preview on product page"
  - "Fullscreen lightbox modal for detailed view"
  - "Optional datasheet link"
---
::

## API Reference

::component-meta{:name="Label"}
::
