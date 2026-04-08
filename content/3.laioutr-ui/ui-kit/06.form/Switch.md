---
title: Switch
description: Toggle switch component for binary on/off choices in forms and settings.
jiraIssueId: LUI-4
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3880-37284&t=FoBBvGt4bI9KoJwB-4
    target: _blank
seo:
  title: Switch | Laioutr
  description: Toggle switch component for binary on/off choices in forms and settings.
sitemap:
  loc: /laioutr-ui/ui-kit/form/switch
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Enables users to compare monthly versus annual pricing options easily. Toggle the entire pricing page between billing views. Display strikethrough prices when annual billing shows discounts. Persists billing preference in localStorage so it remains selected during navigation. Communicates savings visually to encourage annual subscription commitments.

## Key Business & UX Benefits

- Lets users switch between monthly and annual billing in one place.
- Savings display encourages annual commitment without pressure.
- Persisted preference keeps the choice across navigation.
- Small and medium sizes fit headers and pricing blocks.

:::tip
Pro-Tip from Larry: Show savings on the annual option so users see the benefit at a glance.
:::

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

## Feature List

::features
---
items:
  - "Toggle between monthly and annual billing cycles"
  - "Display savings percentage or amount for annual billing"
  - "Synchronized update of all pricing cards when toggled"
  - "Persisted preference via localStorage using useStorage"
---
::

## API Reference

::component-meta{:name="Switch"}
::
