---
title: Input Radio
description: Group of radio buttons where exactly one option can be selected at a time.
links: []
seo:
  title: Input Radio | Laioutr
  description: Group of radio buttons where exactly one option can be selected.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-radio
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/ui-kit/form/radioselect
---

## Overview

`InputRadio` lets users choose exactly one option from a small, fully visible list. It supports vertical and horizontal layouts so it can sit alongside other fields in a form or as a row of options on a checkout step.

## Key Business & UX Benefits

- All options visible at once means customers compare shipping or payment choices side by side, so a slow second-guess in a dropdown doesn't stall checkout.
- Vertical and horizontal layouts let one component fit narrow checkout columns and wide settings panes, removing the need for a separate radio variant per layout.
- Built-in keyboard semantics let screen-reader and keyboard users move through options the way they already expect, supporting accessibility compliance for regulated markets.

:::tip
Pro-Tip from Larry: Use `InputRadio` when the user must pick exactly one option from a known set. For many options or filterable lists reach for [`Select`](/laioutr-ui/ui-kit/form/select).
:::

## Usage

::component-code
---
:name: LInputRadio
story-height: 160px
story-id: ui-kit-molecules-inputradio--vertical
---
::

::component-code
---
:name: LInputRadio
story-height: 100px
story-id: ui-kit-molecules-inputradio--horizontal
---
::

## Feature List

::features
---
items:
  - "Two `orientation` values ('vertical', 'horizontal', default 'vertical') cover narrow checkout columns and wide settings rows"
  - "v-model holds the selected option's string value, keeping the binding shape simple for shipping or payment pickers"
  - "Built on reka-ui radio primitives, so roving tabindex and arrow-key navigation ship without per-use wiring"
  - "Field-aware: reads `disabled`, `required`, and `invalid` from `<LField>` context, adding `--invalid` modifier when validation fails"
  - "Paired `InputRadioItem` per option lets consumers compose markup, badges, and helper copy inside each row"
  - "BEM modifiers (`input-radio--{orientation}`, `--{variant}`, `--invalid`) give per-state theme hooks"
---
::

## API Reference

### LInputRadio

::component-meta{:name="InputRadio"}
::

### LInputRadioItem

::component-meta{:name="InputRadioItem"}
::
