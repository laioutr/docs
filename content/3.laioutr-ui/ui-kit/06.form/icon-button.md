---
title: Icon Button
description: Icon-only button atom with a required accessible label rendered as aria-label.
seo:
  title: Icon Button | Laioutr
  description: Icon-only button atom.
sitemap:
  loc: /laioutr-ui/ui-kit/form/icon-button
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`IconButton` is the icon-only button atom. The required `label` prop is rendered as `aria-label`, so screen readers always announce what the button does even though no text is visible. Use it for close, expand, more, and other compact controls.

`IconButton` owns shape chrome only and delegates variant and state styling to the underlying [`Button`](/laioutr-ui/ui-kit/form/button), so the same `variant` values apply. The loading spinner uses the round style to fit the square footprint.

## Key Business & UX Benefits

- A required `label` prop forces every compact control to announce its purpose to screen readers, removing a common accessibility gap on toolbars and modals.
- Inheriting variants from the main Button keeps icon and text actions visually paired, so a close button next to a save button reads as one toolbar.
- Square-footprint loading spinner prevents the layout shift that the round spinner would cause, which protects dense UI from jumping during async actions.

:::tip
Pro-Tip from Larry: Set `label="Close"` (not `"X"`) so screen readers announce intent rather than the glyph.
:::

## Usage

::component-code
---
:name: LIconButton
:story-height: 150px
story-id: ui-kit-atoms-iconbutton--default
title: IconButton Default
---
```vue-template
<IconButton label="Close" icon="x-mark" variant="ghost-black" />
```
::

## Feature List

::features
---
items:
  - "Required `label` prop rendered as `aria-label`, so every compact control announces its purpose to screen readers"
  - "Delegates variant and state styling to the underlying `Button`, so the same `variant` values (primary, secondary, ghost-*, glass-*, danger) apply"
  - "Round-style loading spinner fits the square footprint without resizing, so toolbars don't jump during async actions"
  - "Inherits Button's `loading` and `disabled` behavior, so submit-style icon controls block double-clicks consistently"
  - "Pair with `Tooltip` for hover hints, so the on-screen label complements the announced `aria-label`"
---
::


## API Reference

::component-meta{:name="IconButton"}
::
