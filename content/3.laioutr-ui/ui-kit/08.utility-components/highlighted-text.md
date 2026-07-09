---
title: Highlighted Text
description: Renders a string with substring matches wrapped in `<mark>`. Diacritic-insensitive, finds every occurrence, and accepts a custom highlight class.
playground:
  name: HighlightedText
  base: ui-kit-atoms-highlightedtext
  defaultStory: default
  height: 240px
seo:
  title: Highlighted Text
  description: Renders a string with substring matches wrapped in `<mark>`. Diacritic-insensitive, finds every occurrence, and accepts a custom highlight class.
sitemap:
  loc: /laioutr-ui/ui-kit/utility-components/highlighted-text
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0
---

## Overview

`HighlightedText` is the shared atom for search-suggest surfaces. Pass a `text` string and a `query` substring and it renders the text with each match wrapped in a `<mark class="highlighted-text__match">`. The match is diacritic-insensitive (so a query of `mude` lights up `Müde`) and finds every occurrence, not just the first. `InputAutocomplete` and `SearchAutoSuggestItem` both use it under the hood.

By default the `<mark>` element keeps the surrounding text color and a transparent background. Pass a `highlightClass` to apply a custom highlight treatment per instance (for example, a yellow background for an auto-suggest dropdown).

## Key Business & UX Benefits

- Diacritic-insensitive matching means a French shopper typing `cafe` still sees `Café` highlighted, lifting search-recall for accented product names.
- Highlighting every occurrence (not just the first) helps shoppers spot which result actually matches their intent in long titles like "Pappardelle al Ragu Pappardella".
- One shared primitive replaces the `v-for` over `highlightMatch` that previously lived in each search-suggest component, so visual treatment stays consistent.
- The optional `highlightClass` lets each surface pick its own treatment (subtle for inline auto-suggest, bold for full-page search) without forking the matching logic.

## Usage

::component-code{:name="LHighlightedText" story-id="ui-kit-atoms-highlightedtext--default"}
::

## Feature List

::features
---
items:
  - "Diacritic-insensitive matching (NFD fold + combining-mark strip) so `cafe` lights up `Café`"
  - "Highlights every occurrence of the query, not just the first"
  - "Wraps matches in `<mark class=\"highlighted-text__match\">` for native browser semantics"
  - "Optional `highlightClass` lets each consumer style the matched segments per instance"
  - "Used by `InputAutocomplete` and `SearchAutoSuggestItem`, so the treatment stays consistent across search surfaces"
---
::

## API Reference

::component-meta{:name="HighlightedText"}
::

## Related

- [`SearchAutoSuggest`](/laioutr-ui/navigation/search-auto-suggest): consumes `HighlightedText` to highlight the typed query in each suggestion.
