---
title: Sheet
description: A sheet component
links: []
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
