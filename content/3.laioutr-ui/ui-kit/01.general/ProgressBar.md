---
title: Progress Bar
description: A progress indicator displaying task or operation completion status.
playground:
  name: ProgressBar
  base: ui-kit-atoms-progressbar
  defaultStory: default
  height: 460px
jiraIssueId: LUI-133
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=1-32
    target: _blank
seo:
  title: Progress Bar
  description: A progress indicator displaying task or operation completion status.
sitemap:
  loc: /laioutr-ui/ui-kit/general/progressbar
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

ProgressBar visualizes how far along a task is with a horizontal bar. It accepts a `value` and a `max`; the indicator width is `value / max`, clamped to `[0,100]`, so it works for percentage progress and for non-percentage scales like file size in bytes or step counts.

Useful for uploads, checkout steps, free-shipping thresholds, and any linear process where seeing the remaining distance reduces anxiety.

## Key Business & UX Benefits

- Free-shipping progress bars are one of the highest-impact AOV levers in ecommerce; this primitive ships them without bespoke styling.
- Visible checkout progress reduces cart abandonment by showing shoppers how close they are to finishing the flow.
- Configurable `max` makes the bar work for percentages, byte counts, and step counters with the same primitive and the same accessibility behavior.

:::tip
Pro-Tip from Larry: Set `:max` for non-percentage progress (e.g. file size in bytes) so the bar scales to your domain values.
:::

## Usage

```vue-template
<LProgressBar :value="42" :max="100" />
```

## Feature List

::features
---
items:
  - "`value` and `max` (default 100) drive the fill, clamped to `[0,100]` so passing 150 of 100 still renders a full bar"
  - "Built on reka-ui's `ProgressRoot`, so `aria-valuenow` and `aria-valuemax` are emitted for screen readers"
  - "Non-percentage scales work directly: pass byte counts or step counts as `value` and `max` without normalizing"
  - "Single `.progress-bar` root class anchors theme overrides for fill color, height, and radius"
  - "Stateless prop surface keeps the bar a pure indicator, leaving completion logic in the consumer"
---
::

## API Reference

::component-meta{:name="ProgressBar"}
::
