---
title: Alert Dialog
description: Modal dialog for confirming critical actions with focus trap and keyboard navigation.
jiraIssueId: LUI-107
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=557-224630&t=7pkty4hsIeaPuKYa-4
    target: _blank
seo:
  title: Alert Dialog | Laioutr
  description: Modal dialog for confirming critical actions with focus trap and keyboard navigation.
---

## Overview

The Alert Dialog intercepts user workflows when critical or irreversible actions require explicit confirmation. Built on Reka UI's dialog primitive, it implements proper ARIA attributes including role="alertdialog" with labelledby and describedby associations. The component supports multiple concurrent dialogs managed through a global store stack, allowing complex confirmation workflows. Configurable dismiss behaviors (Escape key, overlay click) can be disabled during async operations when the loading state prevents premature closure, ensuring data integrity during server communications.

## Key Business & UX Benefits

- Reduces accidental destructive actions by requiring explicit confirmation.
- Keeps focus and keyboard use inside the dialog for accessible flows.
- Loading state on confirm prevents double-submit and premature close.
- Stackable dialogs support multi-step or nested confirmations.

:::tip
Pro-Tip from Larry: Use the loading state on confirm so users can’t close the dialog during async actions.
:::

## Usage

:component-code{name="AlertDialog" story-id="ui-kit-alertdialog--manual-dialog"}

## Feature List

::features
---
items:
  - "Neutral, success, warning, and danger styling variants"
  - "Focus trap and keyboard navigation support"
  - "Loading state on confirm button for async operations"
  - "Stackable dialogs with global state management"
---
::

## API Reference

### AlertDialog

::component-meta{:name="AlertDialog"}
::
