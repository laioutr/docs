---
title: Toast
description: Non-intrusive toast notification component for displaying transient messages with auto-dismiss and queue management.
jiraIssueId: LUI-106
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-40
    target: _blank
---

## Overview

Delivers lightweight, non-blocking notifications about application events. Uses global state store pattern with createGlobalState for centralized queue management, enabling programmatic triggering from anywhere. Supports rich content through HTML or component slots. Includes ARIA roles (status/alert), aria-live regions, and keyboard navigation for accessibility. Transition animations match positioning direction with smooth 200-300ms timing.

## Usage

::component-code
---
:name: Toast
story-height: 200px
story-id: ui-kit-toaster--neutral
---
::

## Features

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
