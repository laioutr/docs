---
title: Pricing Table
description: A feature comparison table for side-by-side plan comparison with sticky headers and differences filtering.
jiraIssueId: LUI-5
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=4230-79346&t=N1ryeUXidyl6cq2O-4
    target: _blank
---

## Overview

Provides a detailed, structured comparison of all features across subscription plans. Present all plan features organized into logical categories with section headers and icons. Link feature names to detailed documentation or anchor points. Highlight premium values with rainbow text styling. CTA buttons in headers provide convenient subscription access from anywhere in the table.

## Usage

::component-code
---
:name: LuiPricingTable
story-id: organisms-pricingtable--default
---
::

## Features

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
