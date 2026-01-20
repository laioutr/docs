---
title: Button
description: A button element that can act as a link or trigger an action.
---

## Features

- Buttons are themed components and are available in three sizes: small, medium, large
- Button states: default, hovered, pressed, focus, deactivated, loading
- Loading animation: Simple spinner with dots

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

## API Reference

::component-meta{:name="Button"}
::
