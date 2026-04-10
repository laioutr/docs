---
title: Card
description: Flexible content card block with multiple styles and media support.
jiraIssueId: LUI-253
seo:
  title: Card | Laioutr
  description: Flexible content card block with multiple styles and media support.
sitemap:
  loc: /laioutr-ui/ui-kit/content/card
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The Card block provides a versatile content container in Studio for displaying mixed media and text. It offers three visual styles (plain, outline, haptic) to match different design contexts. Image display settings control the ratio and orientation independently of the source media, allowing consistent card layouts. Content areas include heading, body text, optional button, and text link. When any interactive element is added, the entire card surface becomes clickable for improved usability.

## Key Business & UX Benefits

- Presents mixed media and text in a consistent, scannable block.
- Three styles (plain, outline, haptic) fit different layouts and emphasis.
- Configurable image ratio keeps card grids aligned across content.
- Full-card click target improves usability when a link or button is present.

:::tip
Pro-Tip from Larry: Add a button or link so the whole card is clickable and easier to tap.
:::

## Usage

:component-code{name="Card" story-id="ui-kit-card--default-plain-card-1-to-1" story-height="500px"}

## Feature List

::features
---
items:
  - "Multiple style options (plain, outline, haptic)"
  - "Configurable image ratio (1:1, 4:3, 16:9) and orientation"
  - "Media support with fallback color"
  - "Entire card becomes clickable when button or link added"
---
::

## API Reference

::component-meta{:name="Card"}
::
