---
title: Glossary Listing
description: An alphabetically grouped index of glossary entries, sourced from a bound Glossary data source or a manually authored list.
seo:
  title: Glossary Listing | Laioutr
  description: An alphabetically grouped index of glossary entries, sourced from a bound Glossary data source or a manually authored list.
sitemap:
  loc: /laioutr-ui/cms/glossary/glossary-listing
  lastmod: 2026-06-23
  changefreq: monthly
  priority: 1.0
changelogKeys:
  - SectionGlossaryListing
---

## Overview

:since-version{changelog="ui" packages="@laioutr-app/ui" version="2.4.0"}

`SectionGlossaryListing` renders an A–Z index of glossary entries — each row a term and a link — through the shared [`AlphabeticalIndex`](/laioutr-ui/cms/alphabetical-index) component. It is the glossary counterpart to the Blog Post Listing: the index page that links into individual [Glossary Detail](/laioutr-ui/cms/glossary/glossary-detail) entries.

It draws its entries from one of two sources:

- **Bound data source** — bind a `Glossary` data source (any app that registers a `Glossary` entity) via the section's **Glossary** query. Entries come from the entity's `base` component (`slug`, `title`), so the list stays current as the underlying content changes.
- **Manual items** — author a fallback list of `name` + `href` entries directly on the section. Used when no data source is bound.

The `heading` field labels the index. Leave it empty and it falls back to the locale-aware default (`sectionGlossaryListing.heading` — "Glossary" in English, "Glossar" in German).

::callout{icon="i-lucide-history"}
`SectionGlossaryListing` was named `SectionGlossaryList` before UI 2.4.0. The Studio component string changed and no data migration shipped, so a section stored under the old name must be re-added. See the [UI changelog](/getting-started/changelogs/ui-changelog#_240).
::

## Key Business & UX Benefits

- Opens a browse-by-term path into reference content, a navigation pattern that helps shoppers and search crawlers reach deep glossary pages.
- A bound data source keeps the index in sync with the underlying content, so new terms appear without a manual edit.
- The manual-items fallback lets a small glossary ship without standing up a data source first.
- Reuses the same `AlphabeticalIndex` component as the Brand List, so glossaries and brand directories stay visually consistent.

## Feature List

::features
---
items:
  - "Renders an A–Z grouped index of term + link entries via the shared AlphabeticalIndex component"
  - "Sources entries from a bound Glossary data source (entity base component: slug, title) or a manually authored items array"
  - "heading field falls back to the locale-aware sectionGlossaryListing.heading default ('Glossary' / 'Glossar') when left empty"
  - "Links each entry into its Glossary Detail reading view"
---
::

## Related

- [Glossary Detail](/laioutr-ui/cms/glossary/glossary-detail) — the reading view for a single entry.
- [Alphabetical Index](/laioutr-ui/cms/alphabetical-index) — the shared A–Z component this section renders.
