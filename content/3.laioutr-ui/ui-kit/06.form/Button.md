---
title: Button
aliases: []
description: Themed call-to-action control with size, variant, icon, link, and loading state support.
playground:
  name: Button
  base: ui-kit-atoms-button
  defaultStory: default
  height: 460px
seo:
  title: Button
  description: Themed call-to-action control with size, variant, icon, link, and loading state support.
sitemap:
  loc: /laioutr-ui/ui-kit/form/button
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1
  videos: []
  images: []
jiraIssueId: LUI-54
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=8174-149288&p=f&m=dev
    target: _blank
---

## Overview

Button is the standard call-to-action control. Pass `href` to render an anchor (NuxtLink) instead of a `<button>`, and `loading` to show a spinner while a submit is in flight. The loading state sets `aria-busy="true"`, blocks clicks, and hides the label without resizing the button so submits don't double-fire and adjacent layout doesn't shift.

Pick a variant by the role the button plays on the page:

| `variant`     | When to use                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| `'primary'`   | The single most important action in the view (Save, Add to cart, Continue).                  |
| `'secondary'` | Supporting actions that share the primary's emphasis (Cancel next to Save).                  |
| `'tertiary'`  | Low-emphasis actions inside dense UI (filter chips, inline edits).                           |
| `'ghost-*'`   | Transparent control for toolbars and chrome where the button shouldn't compete with content. |
| `'glass-*'`   | Buttons over imagery; the surface tints with the background.                                 |
| `'danger'`    | Destructive actions (Delete, Remove).                                                        |

For icon-only controls, use the dedicated [`IconButton`](/laioutr-ui/ui-kit/form/icon-button) atom.

## Key Business & UX Benefits

- A single CTA component covers every role on the page, so primary, supporting, destructive, and overlay actions stay visually consistent without per-team CSS forks.
- The `loading` prop blocks double-submits and pins the label width, eliminating duplicate orders and the layout shift that erodes trust during checkout.
- Role-based variants (primary, secondary, danger, ghost, glass) make action hierarchy obvious at a glance, lifting click-through on the actions that matter.
- Built-in focus, hover, and `aria-busy` states keep the control accessible to keyboard and screen-reader users without extra accessibility work.

::tip
Pro-Tip from Larry: Use the `loading` prop on submit buttons so users know the action is in progress.
::

### Primary Button

::component-code
---
:name: LButton
:story-height: 100px
story-id: ui-kit-atoms-button--primary
title: Primary Button
---
```vue-template
<LButton variant="primary" size="m">Save</LButton>
```
::

### Secondary Button

::component-code
---
:name: LButton
:story-height: 100px
story-id: ui-kit-atoms-button--secondary
title: Secondary Button
---
```vue-template
<LButton variant="secondary" size="m">Cancel</LButton>
```
::

### Button with Icons

::component-code
---
:name: LButton
:story-height: 100px
story-id: ui-kit-atoms-button--secondary-with-both-icons
title: Button with both icons
---
```vue-template
<LButton variant="primary" icon-left="actions/plus" icon-right="actions/arrow-right">
  Add to cart
</LButton>
```
::

### Button with Loading Animation

::component-code
---
:name: LButton
:story-height: 100px
story-id: ui-kit-atoms-button--loading
title: Button with loading Animation
---
```vue-template
<LButton variant="primary" loading>Saving...</LButton>
```
::

## Feature List

::features
---
items:
  - Variant axis covers 'primary', 'secondary', 'tertiary', 'ghost-*',
    'glass-*', and 'danger' for every action role from a single component
  - Three sizes ('s', 'm', 'l') line up with form, body, and hero placements
    without separate components
  - "`href` prop swaps the rendered tag from `<button>` to NuxtLink, so
    navigation buttons keep prefetch and route-transition support"
  - '`loading` sets `aria-busy="true"`, blocks clicks, and hides the label
    without resizing, so submits never double-fire and layout stays still'
  - "`iconLeft` and `iconRight` props place size-matched icons either side of
    the label, useful for add-to-cart and forward arrows"
  - Glass variants tint over imagery while primary and secondary track the theme
    accent, so the same control fits banners and forms
---
::

## API Reference

::component-meta{:name="Button"}
::
