---
title: Toast
description: Non-intrusive notification component for transient messages with auto-dismiss and queue management.
jiraIssueId: LUI-106
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-40
    target: _blank
seo:
  title: Toast | Laioutr
  description: Non-intrusive toast notification component for displaying transient messages with auto-dismiss and queue management.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/toast
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

Toast surfaces lightweight, non-blocking feedback (success, warning, error, neutral) without interrupting the flow. A global state store created with `createGlobalState` owns the queue, so any part of the app can trigger a toast without prop drilling. Each toast auto-dismisses on a timer with a progress bar that pauses on hover.

Toasts ship the accessibility pieces you would expect: `role="status"` or `role="alert"` depending on severity, an `aria-live` region, and keyboard access for dismissal.

## Key Business & UX Benefits

- Non-blocking feedback lets shoppers continue browsing after "Added to cart" or "Saved for later", protecting session length and AOV.
- Global queue management prevents toast pile-ups when several actions resolve at once, so the screen never turns into an alert dump.
- Hover-to-pause and progress-bar timing give users a real chance to read longer messages, which reduces "wait, what just happened" support tickets.
- ARIA live regions and severity-aware roles route the right message to screen readers, keeping the experience inclusive without extra dev work.

## Usage

::component-code
---
:name: LToast
story-height: 200px
story-id: ui-kit-organisms-toaster--neutral
---
::

```vue-template
<LToast :open="visible" variant="success">Saved!</LToast>
```

## Feature List

::features
---
items:
  - "Four `variant` values ('neutral', 'success', 'warning', 'error') drive role, aria-live, icon, and gradient color tokens together"
  - "`role` and `aria-live` switch on severity ('error' uses `role=\"alert\"` and assertive; others use `role=\"status\"` and polite)"
  - "Built-in progress bar tied to `duration` (default 5000ms) with per-variant gradient tokens (`--toast-{variant}-progress-timer-gradient-color-{1,2}`)"
  - "`ctas` array (text plus typed `ToastAwareButtonVariant` plus `href`) renders inline action buttons resolved through `theme.toastAwareButtonVariants`"
  - "Six `position` values cover top-left through bottom-right placements, configurable per toast"
  - "Two `orientation` values ('vertical', 'horizontal') swap the title-subline-action layout for compact and stacked toasts"
---
::

## API Reference

::component-meta{:name="Toast"}
::
