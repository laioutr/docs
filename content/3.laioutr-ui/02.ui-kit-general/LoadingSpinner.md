---
title: Loading Spinner
description: An animated spinner indicating loading or processing state.
links: []
---

## Overview

The Loading Spinner component shows an accessible loading indicator so users know that content or an action is in progress. It supports different sizes and can be used for buttons, cards, or full-page loading states.

## Key Business & UX Benefits

- Reduces uncertainty by showing that the system is working.
- Keeps interactions accessible with proper labels and semantics.
- Fits different contexts with configurable sizes.
- Matches common patterns so users recognize loading at a glance.

:::tip
Pro-Tip from Larry: Use the right size for the context so the spinner is visible but not distracting.
:::

## Usage

### Primary

::component-code
---
:name: LoadingSpinner
:story-height: 75px
story-id: ui-kit-loaderspinner--primary-loader-spinner
title: Loading Spinner Primary
---
```vue-template
<LoadingSpinner />
```
::

### Primary

::component-code
---
:name: LoadingSpinner
:story-height: 75px
story-id: ui-kit-loaderspinner--secondary-loader-spinner
title: Loading Spinner Primary
---
```vue-template
<LoadingSpinner />
```
::

## Feature List

::features
---
items:
  - "Different sizes for buttons, cards, or full-page use"
  - "Accessible with proper ARIA and label support"
  - "Optional required and non-required flags for forms"
  - "Theme-aligned styling for light and dark modes"
---
::

## API Reference

::component-meta{:name="LoadingSpinner"}
::
