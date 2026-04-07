---
title: Checkbox
description: Checkbox group wrapper managing state, validation, and ARIA grouping for multiple related checkbox inputs.
jiraIssueId: LUI-126
seo:
  title: Checkbox | Laioutr
  description: Checkbox group wrapper managing state, validation, and ARIA grouping for multiple related checkbox inputs.
---

## Overview

Checkbox Group provides a wrapper component that manages the state and behavior of multiple related checkbox inputs. It handles value collection, validation, and accessibility requirements like proper ARIA grouping. Commonly used for multi-select filter options, preference settings, or any form context requiring selection of multiple non-exclusive options.

## Key Business & UX Benefits

- Lets users select multiple options without excluding others (e.g. filters).
- ARIA grouping and labels keep checkboxes accessible and understandable.
- Single component manages value collection and validation for the group.
- Fits filter panels, preferences, and any multi-select form context.

:::tip
Pro-Tip from Larry: Use Checkbox Group for filters so users can select multiple options at once.
:::

## Usage

::component-code
---
name: Checkbox
story-height: 60px
story-id: ui-kit-checkbox--unchecked
---
```vue-template
<Checkbox />
```
::

## Feature List

::features
---
items:
  - "Manages state and value collection for multiple checkboxes"
  - "Proper ARIA grouping and labelling for accessibility"
  - "Validation support for form integration"
  - "Suitable for multi-select filters and preference settings"
---
::

## API Reference

::component-meta{:name="Checkbox"}
::
