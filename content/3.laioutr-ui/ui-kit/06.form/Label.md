---
title: Label
description: Form label component with optional required indicator, linked to a control for accessibility.
jiraIssueId: LUI-91
seo:
  title: Label | Laioutr
  description: Form label component with optional required indicator, linked to a control for accessibility.
sitemap:
  loc: /laioutr-ui/ui-kit/form/label
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Label component displays a form label (and optional required indicator) associated with a control. It ensures the label is linked for accessibility and supports different sizes for compact and standard layouts.

## Key Business & UX Benefits

- Accessible label-to-control association for screen readers and click-to-focus.
- Required indicator makes mandatory fields clear without extra markup.
- Size variants fit compact and standard form layouts.
- Consistent styling with Field and other form components.

:::tip
Pro-Tip from Larry: Use Label with every form control so the label is always associated for accessibility.
:::

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

## Feature List

::features
---
items:
  - "Form label with accessible association to control"
  - "Required indicator support"
  - "Small and medium size variants"
  - "Consistent styling with Field and form components"
---
::

## API Reference

::component-meta{:name="Label"}
::
