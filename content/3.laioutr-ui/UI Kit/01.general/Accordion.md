---
title: Accordion
description: A group of togglable entries
seo:
  title: Accordion | Laioutr
  description: A group of togglable entries
---

## Overview

The Accordion component lets users expand and collapse sections of content, keeping the layout compact while allowing access to detailed information on demand.

## Key Business & UX Benefits

- Reduces visual clutter by showing only one or a few sections at a time.
- Improves scannability so users can jump to the section they need.
- Familiar pattern that matches user expectations and reduces learning effort.
- Keeps users on the page by revealing content in place instead of navigating away.

:::tip
Pro-Tip from Larry: Use accordions for FAQ or long specs so the page stays short and easy to scan.
:::

## Usage

::component-code{name="LuiAccordion" story-id="ui-kit-accordion--simple-style"}
```vue-template
<LuiAccordion>
  <LuiAccordionItem title="Hello, world!">
    Lorem Ipsum dolor
  </LuiAccordionItem>
  <LuiAccordionItem title="This is a headline!">
    And this might be the greatest content ever!
  </LuiAccordionItem>
</LuiAccordion>
```
::

## Feature List

::features
---
items:
  - "Expandable and collapsible content sections"
  - "Single or multiple sections open at once"
  - "Clear visual state for expanded vs collapsed"
  - "Accessible keyboard and screen reader support"
---
::

## API Reference

### LuiAccordion

::component-meta{:name="Accordion"}
::

### LuiAccordionItem

::component-meta{:name="AccordionItem"}
::
