---
title: Alphabetical Index
description: A-Z grouped text-link directory for brands, glossaries, and similar indexes.
playground:
  name: AlphabeticalIndex
  base: ui-sections-alphabeticalindex
  defaultStory: with-count
  height: 460px
seo:
  title: Alphabetical Index
  description: A-Z grouped text-link directory for brands, glossaries, and similar indexes.
sitemap:
  loc: /laioutr-ui/cms/alphabetical-index
  lastmod: 2026-06-02
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/brand-list
changelogKeys:
  - AlphabeticalIndex
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/iOpGWO38HkhnTYkEeEq8Oz/Laioutr-Basic?node-id=89-298202&t=WsyhlVHQyGVajZ9T-4
    target: _blank
---

## Overview

`AlphabeticalIndex` renders an A-Z grouped directory of links. Items passed via the `items` prop are sorted with the active locale's collator, then grouped by the first character of each name into alphabetical sections. Each row is a text link with an optional count pill. It suits any "shop by brand", glossary, or partner-directory entry point. Pass an optional `heading` to label the index.

## Key Business & UX Benefits

- Opens a clear browse-by-name path, a high-intent navigation pattern that lifts conversion for multi-brand merchants and content-heavy sites.
- A-Z grouping with locale-aware sorting helps shoppers scan a long list without scrolling endlessly.
- Optional per-item counts hint at catalogue depth, nudging shoppers toward sections with more on offer.
- One component covers brands, glossaries, and similar indexes, so teams stop forking a list component per use case.

## Feature List

::features
---
items:
  - "A-Z grouped directory built from the items array, with locale-aware collation"
  - "Each row is a text link with an optional count pill, sized for dense directories"
  - "Groups appear in alphabetical order with non-alphanumeric entries pushed to the end"
  - "Optional heading labels the index"
  - "Reusable for brand lists, glossaries, partner directories, and similar indexes"
---
::

## API Reference

::component-meta{:name="AlphabeticalIndex"}
::
