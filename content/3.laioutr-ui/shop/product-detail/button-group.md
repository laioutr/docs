---
title: Button Group
description: Stacked full-width action buttons for a product detail page that offers more than one next step.
playground:
  name: ProductDetailButtonGroup
  base: growth-kit-b2b-blocks-productbuttongroup
  defaultStory: default
  height: 340px
seo:
  title: Button Group
  description: Stacked full-width action buttons for a product detail page that offers more than one next step.
sitemap:
  loc: /laioutr-ui/shop/product-detail/button-group
  lastmod: 2026-09-08
  changefreq: monthly
  priority: 1.0
---

## Overview

`ProductDetailButtonGroup` renders a list of actions as full-width buttons, stacked in the order you pass them. It is built for product pages whose next step is not a single add-to-cart: requesting a quote, adding to an order list, downloading a data sheet or a manual.

The only prop is `buttons: ProductDetailButton[]`. Each entry needs `text`; `href`, `variant` and `size` are optional and pass straight through to [`Button`](/laioutr-ui/ui-kit/form/button), so the group inherits that component's styling vocabulary rather than defining its own. Every button renders `block`, which is what gives the stack its even full-width rhythm.

Auto-import tag: `<LProductDetailButtonGroup>`.

## Key Business & UX Benefits

- Gives a B2B product page room for several parallel actions without any of them looking like the primary buy button by default.
- Ordering is yours: the array order is the render order, so the same component serves a quote-first page and a datasheet-first page.
- Because `variant` is per entry, one call can express a hierarchy (primary quote request, subtle documentation links) instead of needing separate components.
- Buttons without an `href` stay buttons, so an action that opens a drawer or fires a handler sits in the same stack as one that navigates.

## Feature List

::features
---
items:
  - "buttons takes a list of { text, href?, variant?, size? } and renders one full-width button per entry"
  - "Array order is render order, so the action hierarchy is expressed at the call site"
  - "variant and size pass through to Button, so the group follows the project's existing button styling"
  - "Entries without href render as buttons rather than links, for actions that do not navigate"
  - "Vertical spacing comes from the --spacing-s token, so the stack tracks the project's spacing scale"
---
::

## API Reference

::component-meta{:name="ProductDetailButtonGroup"}
::
