---
title: Plan Comparison Table
description: A feature-by-feature comparison table for subscription plans, with sticky headers and differences-only filtering.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=4230-79346&t=N1ryeUXidyl6cq2O-4
    target: _blank
jiraIssueId: LUI-5
seo:
  title: Plan Comparison Table | Laioutr
  description: A feature-by-feature comparison table for subscription plans, with sticky headers and differences-only filtering.
sitemap:
  loc: /laioutr-ui/saas/plan-comparison-table
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/saas/pricingtable
---

## Overview

Plan Comparison Table presents every feature of every subscription plan in a structured, scannable grid. Features can be grouped into sections, anchor-linked to detailed documentation, and filtered to show only the differences between plans. The header row is sticky and carries a CTA per plan so the user can act without scrolling back to the top.

The component is composed from five primitives that you can use directly when you need finer control: `PlanComparisonTableHeader`, `PlanComparisonTableSectionHeader`, `PlanComparisonTableRowHeader`, and `PlanComparisonTableRowValue`.

## Key Business & UX Benefits

- A "show differences only" filter cuts the table down to the rows that drive the decision, which keeps prospects from drowning in shared features.
- Sticky headers with a CTA per plan let prospects sign up the moment they spot the right tier, without scrolling back through dozens of rows.
- Anchor-linked feature names give sales and marketing a place to deep-link into specific capabilities from external collateral, supporting outbound campaigns.
- Composing the table from named primitives lets teams ship pricing experiments or vertical-specific layouts without forking the whole table.

:::tip
Pro-Tip from Larry: Pair the comparison table with a `PlanCardSlider` near the top of the page. The cards give a quick-glance comparison; the table is for prospects who want to scan every feature.
:::

## Usage

::component-code
---
:name: LPlanComparisonTable
story-id: ui-sections-plancomparisontable--default
---
::

## Feature List

::features
---
items:
  - "Rows expose a hasDifference flag so a 'show differences only' filter can hide shared rows without rebuilding the dataset"
  - "Section objects carry a title, description, icon, and optional anchor so feature groups can be deep-linked from marketing pages"
  - "Each row supports sub-features rendered as boolean check icons per plan, perfect for nested capability matrices"
  - "Sticky header row keeps the per-plan ctaLink button reachable while scrolling long comparison lists"
  - "Row values can carry a linkText and linkHref so individual features open into documentation or sales pages"
  - "Composed from named primitives (Header, SectionHeader, RowHeader, RowValue) for teams that need to assemble custom layouts"
  - "highlight flag on a row value renders the title as rainbow gradient text to call out flagship capabilities"
---
::

## API Reference

### LPlanComparisonTable

::component-meta{:name="PlanComparisonTable"}
::

### LPlanComparisonTableHeader

::component-meta{:name="PlanComparisonTableHeader"}
::

### LPlanComparisonTableRowHeader

::component-meta{:name="PlanComparisonTableRowHeader"}
::

### LPlanComparisonTableRowValue

::component-meta{:name="PlanComparisonTableRowValue"}
::

### LPlanComparisonTableSectionHeader

::component-meta{:name="PlanComparisonTableSectionHeader"}
::
