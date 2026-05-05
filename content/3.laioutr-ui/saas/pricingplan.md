---
title: Pricing Plan
description: A pricing card component displaying subscription plan details with strikethrough pricing for discounts.
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3795-21654&t=FoBBvGt4bI9KoJwB-4
    target: _blank
jiraIssueId: LUI-2
seo:
  title: Pricing Plan | Laioutr
  description: A pricing card component displaying subscription plan details with strikethrough pricing for discounts.
sitemap:
  loc: /laioutr-ui/saas/pricingplan
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

Enables potential customers to understand and compare subscription options through a clear card layout. Display individual tiers with respective pricing, show discounted annual pricing with strikethrough formatting, and present included features with checkmarks and excluded features with visual indicators. Supports transparent pricing presentation without hidden costs to strengthen customer confidence.

## Key Business & UX Benefits

- One card for plan details and pricing so comparison is clear.
- Strikethrough and feature lists support annual discounts and inclusions.
- Localized pricing and CTA keep the card on-brand and actionable.
- Transparent presentation builds trust and reduces support.

:::tip
Pro-Tip from Larry: Use Pricing Plan cards so customers can compare tiers at a glance.
:::

## Usage

::component-code
---
:name: LuiPricingCard
story-id: molecules-pricing-pricingcard--enterprise-plan-offer
---
::

## Feature List

::features
---
items:
  - Strikethrough pricing for annual billing discounts
  - Included and excluded feature lists with icon indicators
  - Localized money formatting via the [`$money`](/frontend/api-reference/common-types/money#formatting-with-money) helper
  - CTA button with customizable text and link
---
::

## API Reference

::component-meta{:name="PricingCard"}
::
