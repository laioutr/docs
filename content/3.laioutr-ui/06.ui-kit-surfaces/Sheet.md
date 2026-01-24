---
title: Sheet
description: A slide-in cart drawer for viewing and managing cart items, applying discounts, tracking free shipping progress, and proceeding to checkout.
jiraIssueId: LUI-104
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/Zle03g3Z7ieN700SDq5j77/Component-Examples?node-id=271-42424&t=fmtTWu3hMKpEVBUe-4
    target: _blank
---

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
  - "Coupon code accordion with apply functionality"
  - "Free shipping progress bar with success state"
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
