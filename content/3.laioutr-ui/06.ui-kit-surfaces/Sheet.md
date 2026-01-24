---
title: Sheet
description: Slide-in cart drawer for managing items, discounts, and checkout without leaving the page.
jiraIssueId: LUI-104
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=271-42424&t=fmtTWu3hMKpEVBUe-4
    target: _blank
---

## Overview

The Cart Sheet provides shoppers a non-disruptive way to review and modify their cart contents through a slide-in overlay triggered by cart interactions. It consolidates essential cart management features including real-time quantity adjustments with optimistic updates, coupon code application via an expandable accordion, and a dynamic free shipping progress indicator. The component displays a complete cost breakdown with localized currency formatting and prominently shows accepted payment methods, enabling confident purchase decisions without navigating away from the current browsing context.

## Usage

::component-code{:name="Sheet" story-id="ui-kit-sheet--default"}
```vue-template
<Button variant="primary" @click="toggleSheet">Open Sheet</Button>
<Sheet v-bind="args" v-model:open="isOpen">
  <SheetHeader>
    <h2>Sheet Title</h2>
    <SheetClose />
  </SheetHeader>
  <SheetContent>
    <p>Some random content here...</p>
    <p style="height: 1000px;">More content...</p>
  </SheetContent>
  <SheetFooter>
    <p>Footer content</p>
  </SheetFooter>
</Sheet>
```
::

## Features

::features
---
items:
  - "Line item display with quantity selector and remove action"
  - "Free shipping progress bar with success state"
  - "Coupon code accordion with apply functionality"
  - "Payment method logos and checkout button"
---
::

## API Reference

### Sheet

::component-meta{:name="Sheet"}
::

### SheetClose

::component-meta{:name="SheetClose"}
::

### SheetContent

::component-meta{:name="SheetContent"}
::

### SheetHeader

::component-meta{:name="SheetHeader"}
::

### SheetFooter

::component-meta{:name="SheetFooter"}
::
