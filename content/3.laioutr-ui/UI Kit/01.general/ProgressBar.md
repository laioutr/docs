---
title: Progress Bar
description: A progress indicator displaying task or operation completion status.
jiraIssueId: LUI-133
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-32
    target: _blank
seo:
  title: Progress Bar | Laioutr
  description: A progress indicator displaying task or operation completion status.
---

## Overview

The Progress component visualizes completion status of tasks, operations, or goals through a horizontal bar indicator. It accepts a value representing current progress and optionally displays percentage text. Commonly used for file uploads, checkout steps, free shipping thresholds, and any workflow where users benefit from understanding how much progress has been made toward a goal.

## Key Business & UX Benefits

- Shows how much is done so users know how far they are in a flow.
- Reduces anxiety during waits by making progress visible.
- Drives completion for goals like free shipping or checkout steps.
- Works for uploads, steps, and any linear process.

:::tip
Pro-Tip from Larry: Use it for free-shipping thresholds so customers see how close they are to the goal.
:::

## Usage

::component-code
---
:name: Progress Bar
story-height: 100px
story-id: ui-kit-progressbar--default
---
::

## Feature List

::features
---
items:
  - "Horizontal bar with configurable value and max"
  - "Optional percentage or label text"
  - "Theme-aligned styling for light and dark modes"
  - "Accessible with proper ARIA attributes"
---
::

## API Reference

::component-meta{:name="ProgressBar"}
::
