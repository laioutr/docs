---
title: Label
description: Form label with an optional required indicator, accessibly linked to its control.
playground:
  name: Label
  base: ui-kit-atoms-label
  defaultStory: small
  height: 460px
jiraIssueId: LUI-91
seo:
  title: Label | Laioutr
  description: Form label with an optional required indicator.
sitemap:
  loc: /laioutr-ui/ui-kit/form/label
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Label displays a form label and an optional required indicator, linked to its control via `for` so screen readers and click-to-focus work as expected. Most forms get labels for free through `<LField>`; reach for Label directly when you need a label outside a Field (e.g. above a custom composite control).

## Key Business & UX Benefits

- Explicit `for` association makes labels click-to-focus targets, expanding the tap area on mobile and lifting form completion on small screens.
- A single label primitive keeps required indicators and typography consistent across the product, so users learn the visual language once.
- Pairing with `<LField>` covers most forms automatically; the standalone control is there for the edge cases without forcing a fork of the styling.

### Different sizes

::component-code
---
:name: LLabel
:story-height: 80px
story-id: ui-kit-atoms-label--medium
title: Label Medium
---
```vue-template
<LLabel size="m">First name</LLabel>
```
::

### With required mark

::component-code
---
:name: LLabel
:story-height: 80px
story-id: ui-kit-atoms-label--required-small
title: Label Small Required
---
```vue-template
<LLabel size="s" required>First name</LLabel>
```
::

::component-code
---
:name: LLabel
:story-height: 80px
story-id: ui-kit-atoms-label--required-medium
title: Label Medium Required
---
```vue-template
<LLabel size="m" required>First name</LLabel>
```
::

## Feature List

::features
---
items:
  - "Two sizes ('s', 'm', default 's') match the Input and Field typography scale"
  - "`required` boolean appends a `*` indicator with its own `.label__required` styling hook"
  - "`forId` prop sets the `for` attribute, so click-to-focus works as a wider tap target on mobile"
  - "Reads `<LField>` `disabled` and `invalid` state, adding `label--disabled` and `label--invalid` modifier classes"
  - "Renders a semantic `<label>`, so screen readers announce the association automatically"
  - "Used inside `<LField>` for most forms; reach for it directly when labelling custom composite controls"
---
::

## API Reference

::component-meta{:name="Label"}
::
