---
title: Accordion
description: A group of togglable entries
seo:
  title: Accordion | Laioutr
  description: A group of togglable entries
sitemap:
  loc: /laioutr-ui/ui-kit/general/accordion
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

The Accordion component lets users expand and collapse sections of content, keeping the layout compact while letting them reach detail on demand. Drive the open panels from outside with `v-model`, or react to `@select` for analytics and persistence hooks.

Set `type="single"` for one panel open at a time, or `type="multiple"` to allow several. The `v-model` value is a string for single mode and an array for multiple.

## Key Business & UX Benefits

- Shorter pages mean shoppers reach pricing, shipping, and product details without scrolling past FAQs they did not want to read.
- Reduces support tickets by letting customers self-serve answers to common questions directly on PDPs and help pages.
- One component handles both single-open and multi-open patterns, so product detail tabs and FAQ lists share the same accessible behavior.
- External `v-model` and `@select` make it easy to wire analytics on which sections shoppers actually open, feeding content decisions.

:::tip
Pro-Tip from Larry: Use `v-model` to drive the active panel from outside, or react to `@select` for analytics.
:::

## Usage

::component-code{name="LAccordion" story-id="ui-kit-molecules-accordion--simple-style"}
```vue-template
<LAccordion v-model="open" type="single" variant="simple">
  <LAccordionItem value="hello" title="Hello, world!">
    Lorem Ipsum dolor
  </LAccordionItem>
  <LAccordionItem value="headline" title="This is a headline!">
    And this might be the greatest content ever!
  </LAccordionItem>
</LAccordion>
```
::

## Feature List

::features
---
items:
  - "Three variants ('simple', 'boxed-buttons', 'buttons') cover FAQ lists, PDP detail tabs, and chunky CTA stacks from one component"
  - "Type prop switches between 'single' (string v-model) and 'multiple' (string[] v-model) without changing markup"
  - "External v-model lets parent state drive open panels, useful for deep links and URL-synced sections"
  - "@select event fires the active value(s) so analytics can track which panels shoppers actually expand"
  - "AccordionItem accepts title plus default slot, keeping panel content composable with any markup"
  - "BEM root class (`accordion--{variant}`) gives per-instance theming hooks without prop sprawl"
---
::

## API Reference

### LAccordion

::component-meta{:name="Accordion"}
::

### LAccordionItem

::component-meta{:name="AccordionItem"}
::
