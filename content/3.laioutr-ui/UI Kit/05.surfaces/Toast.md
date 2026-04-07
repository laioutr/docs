---
title: Toast
description: Non-intrusive toast notification component for displaying transient messages with auto-dismiss and queue management.
jiraIssueId: LUI-106
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-40
    target: _blank
seo:
  title: Toast | Laioutr
  description: Non-intrusive toast notification component for displaying transient messages with auto-dismiss and queue management.
---

## Overview

Delivers lightweight, non-blocking notifications about application events. Uses global state store pattern with createGlobalState for centralized queue management, enabling programmatic triggering from anywhere. Supports rich content through HTML or component slots. Includes ARIA roles (status/alert), aria-live regions, and keyboard navigation for accessibility. Transition animations match positioning direction with smooth 200-300ms timing.

## Key Business & UX Benefits

- Surfaces success, warning, or error feedback without blocking the flow.
- Auto-dismiss and progress bar keep notifications from piling up.
- Stackable toasts with queue limit keep the UI from getting noisy.
- Accessible with live regions and keyboard so everyone gets the message.

:::tip
Pro-Tip from Larry: Use semantic variants (success, warning, error) so users understand the message at a glance.
:::

## Usage

::component-code
---
:name: Toast
story-height: 200px
story-id: ui-kit-toaster--neutral
---
::

## Feature List

::features
---
items:
  - "Multiple semantic variants: neutral, success, warning, error with variant-specific icons"
  - "Auto-dismiss with progress bar and pause-on-hover"
  - "Stackable notifications with optional queue limit"
  - "Mobile-responsive positioning and spacing adaptations"
---
::

## API Reference

::component-meta{:name="Toast"}
::
