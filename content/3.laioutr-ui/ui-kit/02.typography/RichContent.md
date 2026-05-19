---
title: Rich Content
description: Renders HTML or markdown coming from a CMS or product description with the theme's typography applied.
links: []
seo:
  title: Rich Content | Laioutr
  description: Renders HTML or markdown coming from a CMS or product description with the theme's typography applied.
sitemap:
  loc: /laioutr-ui/ui-kit/typography/richcontent
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0

---

## Overview

RichContent renders HTML or markdown coming from a CMS, product description, or any other source of formatted text. It applies the theme's typography to headings, lists, paragraphs, blockquotes, tables, and inline elements so CMS markup blends with the rest of the storefront without per-page CSS.

Pass HTML through the `html` prop (or a slot for static content). The component renders the value with `v-html` and does **not** sanitize it.

:::warning
RichContent does not sanitize input. Treat the `html` prop as a trust boundary: only pass content you have already sanitized server-side or that comes from a source you control. Passing raw user-submitted HTML opens an XSS vector.
:::

## Key Business & UX Benefits

- Theme typography applied to CMS markup automatically, so product descriptions and editorial content never visually clash with the rest of the storefront.
- Content editors paste rich descriptions from the CMS, Notion, or Word and the output stays on-brand without manual cleanup.
- One typography surface for every long-form block means brand refreshes update spacing, heading scale, and link color once instead of touching every CMS template.

:::tip
Pro-Tip from Larry: Sanitize on the server (DOMPurify, sanitize-html, or your CMS's renderer) before the markup reaches RichContent. The component will render whatever you give it.
:::

## Usage

::component-code{:name="LRichContent" story-id="ui-kit-organisms-richcontent--default"}
```vue-template
<LRichContent>
  ...
</LRichContent>
```
::

## Feature List

::features
---
items:
  - "`html` prop rendered via `v-html`, so any sanitized HTML or CMS output drops in without a per-tag mapping"
  - "Default slot accepts static markup, so the same component works for inline templates and CMS-driven content"
  - "Theme typography applied to headings, lists, paragraphs, blockquotes, tables, and inline elements via scoped selectors"
  - "Explicit non-sanitization is documented as a trust boundary: consumers sanitize server-side (DOMPurify, sanitize-html, or CMS renderer)"
  - "Single surface for long-form blocks, so brand refreshes update spacing and heading scale in one place"
---
::

## API Reference

::component-meta{:name="RichContent"}
::
