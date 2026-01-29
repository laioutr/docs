---
title: Pricing Plan
description: A pricing card component displaying subscription plan details with strikethrough pricing for discounts.
jiraIssueId: LUI-2
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=3795-21654&t=FoBBvGt4bI9KoJwB-4
    target: _blank
---

## Overview

Enables potential customers to understand and compare subscription options through a clear card layout. Display individual tiers with respective pricing, show discounted annual pricing with strikethrough formatting, and present included features with checkmarks and excluded features with visual indicators. Supports transparent pricing presentation without hidden costs to strengthen customer confidence.

## Usage

::component-code
---
:name: LuiPricingCard
story-id: molecules-pricing-pricingcard--enterprise-plan-offer
---
::

## Features

::features
---
items:
  - Strikethrough pricing for annual billing discounts
  - Included and excluded feature lists with icon indicators
  - Localized money formatting with I18nMoney
  - CTA button with customizable text and link
---
::

## API Reference

::component-meta{:name="PricingCard"}
::
