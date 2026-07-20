---
title: Glossary Detail
description: The reading view for a single glossary entry — its term and definition — rendered through the shared ArticleDetail component.
seo:
  title: Glossary Detail | Laioutr
  description: The reading view for a single glossary entry, rendered through the shared ArticleDetail component.
sitemap:
  loc: /laioutr-ui/cms/glossary/glossary-detail
  lastmod: 2026-06-23
  changefreq: monthly
  priority: 1.0
changelogKeys:
  - SectionGlossaryDetail
---

## Overview

:since-version{changelog="ui" packages="@laioutr-app/ui" version="2.4.0"}

`SectionGlossaryDetail` is the reading view for a single glossary entry. It binds a `Glossary` data source as a single entity and renders it through the shared [`ArticleDetail`](/laioutr-ui/cms/blog/article-detail) component:

- the entry's **title** comes from the `Glossary` entity's `base` component (`title`),
- the **definition** comes from the entity's `content` component (`content`), an `HtmlFragment` rendered through `RichContent`.

Unlike the Blog Post Detail section, it renders no hero media and leaves the social-share row off — a glossary entry is reference text, not a shareable article.

It is the destination behind each row of the [Glossary Listing](/laioutr-ui/cms/glossary/glossary-listing).

## Key Business & UX Benefits

- A focused term + definition layout keeps reference content clean and readable, with no media or share chrome competing for attention.
- Reuses the same `ArticleDetail` reading view as the blog, so glossary entries and articles stay visually consistent without a forked component.
- The definition accepts the rich HTML editors already produce in their CMS, so content teams ship formatted entries without bespoke templates.

## Feature List

::features
---
items:
  - "Renders a single glossary entry through the shared ArticleDetail component"
  - "Title from the Glossary entity's base component; definition from its content component (HtmlFragment via RichContent)"
  - "No hero media and no social-share row — reference text, not a shareable article"
  - "The detail destination behind each Glossary Listing row"
---
::

## Related

- [Glossary Listing](/laioutr-ui/cms/glossary/glossary-listing) — the A–Z index that links into these entries.
- [Article Detail](/laioutr-ui/cms/blog/article-detail) — the shared reading view this section renders.
