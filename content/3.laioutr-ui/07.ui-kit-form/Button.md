---
title: Button
description: An enhancement to the Gallery Content Slider that adds an optional CTA button for linking to additional pages.
jiraIssueId: LUI-54
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=8174-149288&p=f&m=dev
    target: _blank
---

## Overview

The Button component provides themed call-to-action controls in primary, secondary, and other variants. It supports three sizes (small, medium, large), loading state with spinner, and optional leading or trailing icons for forms, navigation, and CTAs.

## Key Business & UX Benefits

- Clear primary and secondary variants guide users to the main action.
- Loading state prevents double-submit and gives feedback during async actions.
- Themed sizes and icons fit forms, headers, and cards consistently.
- Accessible focus and keyboard support for all interactive states.

:::tip
Pro-Tip from Larry: Use the loading state on submit buttons so users know the action is in progress.
:::

## Usage

### Primary Button

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--primary
title: Primary Button
---
```vue-template
<LButton />
```
::

### Primary Secondary

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--secondary
title: Primary Secondary
---
```vue-template
<LButton />
```
::

### Button Sizes

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--small
title: Button Primary Small
---
```vue-template
<LButton />
```
::

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--medium
title: Button Primary Medium
---
```vue-template
<LButton />
```
::

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--large
title: Button Primary Medium
---
```vue-template
<LButton />
```
::

### Button Variants

TODO

### Button with Icons

A button can have icons of different kind on both sides.

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--both-icons
title: Button with both icons
---
```vue-template
<LButton />
```
::

### Button with Loading Animation

Submitting a Button can force a loading state. An Icon Button can have a loader as well.

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--loading
title: Button with loading Animation
---
```vue-template
<LButton />
```
::

::component-code
---
:name: Button
:story-height: 100px
story-id: ui-kit-button--loading-icon
title: Icon Button with loading Animation
---
```vue-template
<LButton />
```
::

## Feature List

::features
---
items:
  - "Pre-selected button styles for color variants"
  - "Customizable button variant"
  - "Linkable call-to-action button"
  - "Loading state and optional leading or trailing icons"
---
::

## API Reference

::component-meta{:name="Button"}
::
