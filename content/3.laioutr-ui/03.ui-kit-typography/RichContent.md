---
title: Rich Content
description: A rich content component
links: []
seo:
  title: Rich Content | Laioutr
  description: A rich content component
---

## Overview

The Rich Content component renders HTML or markdown content with consistent typography, links, and lists. It is used for product descriptions, CMS content, and other formatted text blocks.

## Key Business & UX Benefits

- Keeps CMS and dynamic content readable with consistent typography.
- Supports headings, lists, and links without custom markup.
- Reduces risk of XSS by sanitizing and constraining allowed HTML.
- Matches theme so rich content fits the rest of the UI.

:::tip
Pro-Tip from Larry: Use it for product descriptions so formatting stays consistent and safe.
:::

## Usage

::component-code{:name="RichContent" story-id="ui-kit-richcontent--default"}
```vue-template
<RichContent>
  ...
</RichContent>
```
::

## Feature List

::features
---
items:
  - "Renders HTML or markdown with sanitized output"
  - "Consistent typography for headings, lists, and paragraphs"
  - "Styled links and other inline elements"
  - "Theme-aligned styling for light and dark modes"
---
::

## API Reference

::component-meta{:name="RichContent"}
::
