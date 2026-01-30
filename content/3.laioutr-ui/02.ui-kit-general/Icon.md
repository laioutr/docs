---
title: Icon
description: Size-optimized icon variants with automatic resolution ensuring recognizability at small, medium, and large sizes.
jiraIssueId: LUI-41
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=74-715&m=dev
    target: _blank
---

## Overview

Addresses icon clarity issues when standard 24px icons are scaled down. Icon.vue resolves names by replacing icon set prefixes with extension folder paths and appending size suffixes. SVGs stored in packages/ui/src/runtime/assets/icons with -s, -m, -l suffixes. Backward compatible with existing icon usage when size prop is unset or medium.

## Key Business & UX Benefits

- Keeps icons sharp and readable at every size with dedicated assets.
- Ensures consistent look and behavior across the app with one icon system.
- Reduces guesswork for designers and devs with clear size options.
- Stays compatible with existing usage while supporting new sizes.

:::tip
Pro-Tip from Larry: Pick the size that matches your context so icons stay crisp and recognizable.
:::

## Usage

### Icons

::component-code
---
:name: Icon
:story-height: 500px
story-id: ui-kit-icon--all-icons
title: Icons
---
```vue-template
<Icon name="icon-name" />
```
::

## Feature List

::features
---
items:
  - "Custom-designed icon variants optimized for each display size"
  - "Three size options: small (16px), medium (20px), and large (32px)"
  - "Automatic size suffix resolution in Icon component"
  - "Support for hugeicons and solar icon sets with extension folders"
---
::

## API Reference

::component-meta{:name="Icon"}
::
