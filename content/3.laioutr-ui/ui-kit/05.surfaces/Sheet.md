---
title: Sheet
description: Slide-in panel surface for overlaying content such as carts, filters, or detail views without leaving the page.
playground:
  name: Sheet
  base: ui-kit-organisms-sheet
  defaultStory: default
  height: 460px
jiraIssueId: LUI-104
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=271-42424&t=fmtTWu3hMKpEVBUe-4
    target: _blank
seo:
  title: Sheet
  description: Slide-in panel surface for overlaying content such as carts, filters, or detail views without leaving the page.
sitemap:
  loc: /laioutr-ui/ui-kit/surfaces/sheet
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

Sheet is a slide-in overlay surface for carts, filters, detail views, and any flow that should not yank the user off the page. Pair it with `SheetHeader`, `SheetContent`, and `SheetFooter` for a predictable three-part layout. The whole sheet body scrolls as one region; header and footer use sticky positioning inside it.

Pick the slide direction with the `position` prop (`'left'`, `'right'`, `'top'`, `'bottom'`; default `'right'`). On left/right sheets, `menuWidth` overrides the desktop width (the value goes into the `--sheet-width-sm` CSS variable). The component renders inside a Reka dialog portal with focus trap and `Escape`-to-close handling out of the box.

Accessibility is wired through `a11yTitle` and `a11yDescription`: both feed visually hidden `DialogTitle` and `DialogDescription` nodes so screen readers announce the sheet correctly even when the visible header is purely visual. Always pass `a11yTitle` on every sheet.

When the body scrolls past `scrollThreshold` pixels (default `10`), the sheet card gains a `--fixed` modifier class. Style your `SheetHeader::before` against `.sheet__card--fixed .sheet-header::before` to fade in a blurred backdrop on the sticky header as the user scrolls.

## Key Business & UX Benefits

- Slide-in surfaces keep shoppers on the page during cart, filter, and detail flows, protecting scroll position and lifting conversion versus full-page transitions.
- Header and footer slots enforce a predictable three-part layout, so every sheet on the site (mini-cart, filters, quick view) feels part of the same product.
- Scroll-threshold-driven sticky-header blur tells users the header is pinned without bespoke scroll listeners on the call site.
- Built-in focus trap and `a11yTitle`/`a11yDescription` slots make every sheet accessible by default, which compliance audits reward and screen-reader users rely on.

## Usage

::component-code{:name="LSheet" story-id="ui-kit-organisms-sheet--default"}
```vue-template
<LButton variant="primary" @click="toggleSheet">Open Sheet</LButton>
<LSheet
  v-model:open="isOpen"
  position="right"
  a11y-title="Cart"
  a11y-description="Items in your shopping cart"
>
  <LSheetHeader>
    <h2>Sheet Title</h2>
    <LSheetClose />
  </LSheetHeader>
  <LSheetContent>
    <p>Some random content here...</p>
    <p style="height: 1000px;">More content...</p>
  </LSheetContent>
  <LSheetFooter>
    <p>Footer content</p>
  </LSheetFooter>
</LSheet>
```
::

## Feature List

::features
---
items:
  - "Four `position` values ('left', 'right', 'top', 'bottom', default 'right') pick the slide direction without separate components"
  - "Three-part composition (`SheetHeader`, `SheetContent`, `SheetFooter`) gives a predictable scroll region with sticky chrome"
  - "Required `a11yTitle` feeds visually hidden `DialogTitle`, with optional `a11yDescription` for `DialogDescription`, so screen readers announce every sheet"
  - "Built on reka-ui dialog portal with focus trap and Escape-to-close out of the box"
  - "Scroll-threshold modifier (`sheet__card--fixed`) toggles past `scrollThreshold` pixels (default 10), so consumers can fade in a blurred backdrop on the sticky header"
  - "`menuWidth` overrides the desktop width on left/right sheets via `--sheet-width-sm`, so cart drawers and filter rails get distinct widths"
---
::

## API Reference

### LSheet

::component-meta{:name="Sheet"}
::

### LSheetClose

::component-meta{:name="SheetClose"}
::

### LSheetContent

::component-meta{:name="SheetContent"}
::

### LSheetHeader

::component-meta{:name="SheetHeader"}
::

### LSheetFooter

::component-meta{:name="SheetFooter"}
::
