---
title: Plan Card
description: A pricing card displaying subscription plan details with strikethrough pricing for discounts.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3795-21654&t=FoBBvGt4bI9KoJwB-4
    target: _blank
jiraIssueId: LUI-2
seo:
  title: Plan Card | Laioutr
  description: A pricing card displaying subscription plan details with strikethrough pricing for discounts.
sitemap:
  loc: /laioutr-ui/saas/plan-card
  lastmod: 2026-05-11
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/saas/pricingplan
---

## Overview

Plan Card is a pricing tile for a single subscription tier. It shows the plan name, price (with optional strikethrough for annual discounts), included and excluded features, and a primary call-to-action that points to the sign-up flow.

Prices format through the [`$money`](/frontend/api-reference/common-types/money#formatting-with-money) helper, so currency and locale follow the active market without per-card overrides.

## Key Business & UX Benefits

- Strikethrough pricing makes annual discounts obvious, which is one of the highest-impact nudges for moving prospects from monthly to annual billing.
- Included and excluded feature rows answer the most common pre-sign-up question (what's actually in this plan) without forcing visitors to open a separate comparison page.
- Locale-aware price formatting through `$money` ships every market with the right currency and number format, so international launches don't need bespoke pricing tiles.
- A single CTA per tile keeps the path to sign-up unambiguous, which protects conversion on the page that matters most for revenue.

:::tip
Pro-Tip from Larry: Pair Plan Cards with a `HighlightToggle` so the monthly/annual price toggle updates every card at once.
:::

## Usage

::component-code
---
:name: LPlanCard
story-id: ui-blocks-plancard--enterprise-plan-offer
---
::

## Feature List

::features
---
items:
  - "Optional annualPrice flips the headline to the discounted figure with the monthly price struck through when annual billing is active"
  - "includedSeats accepts a number or the literal 'unlimited' string, which renders a gradient-filled label to spotlight enterprise tiers"
  - "Per-additional-seat pricing slot built in, formatted with $money so currency and locale follow the active market"
  - "Separate includedFeatures and excludedFeatures arrays render two icon lists (check and minus) so the gap between tiers is obvious"
  - "Pricing values typed as Money so amounts stay currency-aware end to end and never drift from the storefront's locale rules"
  - "Themed via the .plan-card BEM root with design-token shadows and borders for per-card overrides"
---
::

## API Reference

::component-meta{:name="PlanCard"}
::
