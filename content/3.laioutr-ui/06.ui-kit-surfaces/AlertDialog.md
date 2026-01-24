---
title: Alert Dialog
description: Modal dialog for confirming critical actions with focus trap and keyboard navigation.
jiraIssueId: LUI-107
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=557-224630&t=7pkty4hsIeaPuKYa-4
    target: _blank
---

## Overview

The Alert Dialog intercepts user workflows when critical or irreversible actions require explicit confirmation. Built on Reka UI's dialog primitive, it implements proper ARIA attributes including role="alertdialog" with labelledby and describedby associations. The component supports multiple concurrent dialogs managed through a global store stack, allowing complex confirmation workflows. Configurable dismiss behaviors (Escape key, overlay click) can be disabled during async operations when the loading state prevents premature closure, ensuring data integrity during server communications.

## Usage

:component-code{name="AlertDialog" story-id="ui-kit-alertdialog--manual-dialog"}

## Features

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
