---
title: Pricing Table
description: A feature comparison table for side-by-side plan comparison with sticky headers and differences filtering.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=4230-79346&t=N1ryeUXidyl6cq2O-4
    target: _blank
jiraIssueId: LUI-5
seo:
  title: Pricing Table | Laioutr
  description: A feature comparison table for side-by-side plan comparison with sticky headers and differences filtering.
sitemap:
  loc: /laioutr-ui/saas/pricingtable
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Provides a detailed, structured comparison of all features across subscription plans. Present all plan features organized into logical categories with section headers and icons. Link feature names to detailed documentation or anchor points. Highlight premium values with rainbow text styling. CTA buttons in headers provide convenient subscription access from anywhere in the table.

## Key Business & UX Benefits

- One table for feature comparison across plans so differences are clear.
- Sticky header and difference toggle keep the table scannable.
- Checkmarks and x-marks make availability obvious.
- Category sections and anchor links support long tables and docs.

:::tip
Pro-Tip from Larry: Use Pricing Table for detailed plan comparison so customers see all features side by side.
:::

## Usage

::component-code
---
:name: LuiPricingTable
story-id: organisms-pricingtable--default
---
::

## Feature List

::features
---
items:
  - Clear feature availability indicators using checkmarks and x-marks
  - Sticky header row with plan names and CTA buttons
  - Toggle to show only feature differences between plans
  - Categorized feature sections with icons and anchor links
---
::

## API Reference

### LuiPricingTable

::component-meta{:name="PricingTable"}
::

### LuiPricingTableHeader

::component-meta{:name="PricingTableHeader"}
::

### LuiPricingTableRowHeader

::component-meta{:name="PricingTableRowHeader"}
::

### LuiPricingTableRowValue

::component-meta{:name="PricingTableRowValue"}
::

### LuiPricingTableSectionHeader

::component-meta{:name="PricingTableSectionHeader"}
::
