---
title: Icon List
description: A icon list component
playground:
  name: IconList
  base: ui-kit-molecules-iconlist
  defaultStory: nested-x-small-style
  height: 460px
links: []
seo:
  title: Icon List | Laioutr
  description: A icon list component
sitemap:
  loc: /laioutr-ui/ui-kit/typography/iconlist
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0

---

## Overview

IconList renders a list of items with a leading icon on each row. It keeps feature lists, step lists, and bullet-style content scannable and visually aligned, and supports nesting for hierarchical content. Sizes are `'xs'`, `'s'`, and `'m'` (default `'m'`) so the same component fits dense secondary lists, body content, and large feature blocks.

Stick to one icon style per list so the list reads as a single unit instead of competing rows.

## Key Business & UX Benefits

- Feature lists with icons scan faster than plain bullets, so shoppers retain the value props that drive add-to-cart decisions.
- Three sizes cover dense secondary lists, body content, and large feature blocks with the same primitive, keeping spacing consistent.
- Nesting support lets product teams build hierarchical content like spec lists or comparison tables without bespoke list markup.

:::tip
Pro-Tip from Larry: Use one icon style per list so the list reads as a single unit.
:::

## Usage

```vue-template
<LIconList size="s">
  <LIconListItem icon="actions/check">Fast checkout</LIconListItem>
  <LIconListItem icon="actions/check">Free returns</LIconListItem>
</LIconList>
```

## Feature List

::features
---
items:
  - "Three sizes ('xs', 's', 'm') drive both row padding and font-size tokens, so dense secondary lists and large feature blocks share one component"
  - "Parent `icon` prop publishes a default via Vue provide; child `IconListItem` can override per row"
  - "Default icon (`arrows/arrow-right`) ensures rows never render iconless even when consumers forget to set one"
  - "`<ul>` and `<li>` markup keeps lists semantic for screen readers and SEO"
  - "Nesting supported because the context only provides the icon, not list state, so nested lists stay independent"
---
::

### LIconList

::component-meta{:name="IconList"}
::

### LIconListItem

::component-meta{:name="IconListItem"}
::
