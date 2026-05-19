---
title: Switch
description: Toggle switch for binary on/off choices in forms and settings.
jiraIssueId: LUI-4
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3880-37284&t=FoBBvGt4bI9KoJwB-4
    target: _blank
seo:
  title: Switch | Laioutr
  description: Toggle switch for binary on/off choices in forms and settings.
sitemap:
  loc: /laioutr-ui/ui-kit/form/switch
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Switch is a binary on/off toggle for forms, settings, and inline preferences. Wrap it in `<LField>` to pick up shared `disabled`, `required`, and error state without prop-drilling. Pair `invalid` with `Field`'s `errorMessage` for accessible error styling.

## Key Business & UX Benefits

- Clear on/off affordance signals that a change applies immediately, which is what users expect for preferences and notification settings.
- Field integration covers required, disabled, and error states without extra wiring, so toggles in checkout (gift wrap, paper-free billing) stay accessible.
- Consistent sizing (s/m) and motion make every Switch on the site feel like the same control, which reduces the learning curve across account, settings, and forms.

:::tip
Pro-Tip from Larry: Use Switch for state that takes effect immediately (a setting). For confirm-then-apply choices in a form, reach for Checkbox.
:::

## Usage

### Different Sizes

::component-code
---
:name: LSwitch
:story-height: 75px
story-id: ui-kit-atoms-switch--small
title: Switch Small
---
```vue-template
<LSwitch v-model="enabled" size="s" />
```
::

::component-code
---
:name: LSwitch
:story-height: 75px
story-id: ui-kit-atoms-switch--medium
title: Switch Medium
---
```vue-template
<LSwitch v-model="enabled" size="m" />
```
::

### Checked State

::component-code
---
:name: LSwitch
:story-height: 75px
story-id: ui-kit-atoms-switch--checked
title: Switch checked
---
```vue-template
<LSwitch v-model="enabled" />
```
::

### Disabled State

::component-code
---
:name: LSwitch
:story-height: 75px
story-id: ui-kit-atoms-switch--disabled
title: Switch Unchecked Disabled
---
```vue-template
<LSwitch v-model="enabled" disabled />
```
::

::component-code
---
:name: LSwitch
:story-height: 75px
story-id: ui-kit-atoms-switch--disabled-checked
title: Switch Checked Disabled
---
```vue-template
<LSwitch v-model="enabled" disabled />
```
::

## Feature List

::features
---
items:
  - "Two sizes ('s', 'm') keep the toggle in proportion with form, settings, and inline preference rows"
  - "Boolean v-model with checked/unchecked plus disabled and `:focus-visible` states, so the control fits accessibility audits without extra wiring"
  - "Inherits `<LField>` `disabled`, `required`, and `invalid` state so wrapped switches pick up form chrome automatically"
  - "Used internally by `HighlightToggle`, so promotional toggles stay consistent with regular preference switches"
  - "Plain semantic toggle: pairs cleanly with Label for click-to-toggle association on the entire row"
---
::

## API Reference

::component-meta{:name="Switch"}
::
