---
title: Article Detail
description: Shared article reading view rendering an optional hero media, title, rich body, and an optional social-share row. Powers the Blog Post and Glossary sections.
playground:
  name: ArticleDetail
  base: ui-sections-articledetail
  defaultStory: with-social-share
  height: 460px
jiraIssueId: LUI-116
seo:
  title: Article Detail | Laioutr
  description: Shared article reading view with optional hero media, title, rich body, and an optional social-share row.
sitemap:
  loc: /laioutr-ui/cms/blog/article-detail
  lastmod: 2026-06-23
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/blog/blogpost
  - /laioutr-ui/cms/blog/blog-post-detail
changelogKeys:
  - ArticleDetail
---

## Overview

`ArticleDetail` renders a long-form reading experience built from three parts: an optional hero `media`, the `title`, and a rich-content `body`. The body accepts either a raw HTML string or an `HtmlFragment`, and renders through the `RichContent` component for safe inline HTML. An optional trailing `SocialShare` row is toggled with `showSocialShare` (default `false`).

It is the shared reading view behind two sections: `SectionBlogPostDetail` (the blog article view, which enables social share) and the [Glossary Detail](/laioutr-ui/cms/glossary/glossary-detail) section (`SectionGlossaryDetail`, which omits both the media and the share row). It replaces the former `BlogPostDetail` component — see the [UI changelog](/getting-started/changelogs/ui-changelog#_240).

Pair the blog usage with [`BlogPostListing`](/laioutr-ui/cms/blog/blog-post-listing), which renders the index.

## Key Business & UX Benefits

- A focused article layout (media, title, body, share) keeps readers in the story without sidebar noise pulling attention away.
- The rich-content body accepts the HTML editors already produce in their CMS, so writers ship richer stories without ad-hoc templates.
- One shared reading view powers both blog articles and glossary entries, so the two content types stay visually consistent without a forked component.
- The optional `SocialShare` row amplifies reach on the channels that drive referral traffic back to the storefront, and stays off where sharing isn't wanted (such as glossary entries).
- Editors place hero media and copy in Studio, so each article ships without a developer round-trip.

:::tip
Pro-Tip from Larry: Pair the blog's `ArticleDetail` view with `BlogPostListing` (the index) so the blog has a consistent structure end-to-end.
:::

## Usage

::component-code{:name="LArticleDetail" story-id="ui-sections-articledetail--with-social-share"}
::

## Feature List

::features
---
items:
  - "Renders three parts: optional hero media, title, and a rich-content body, with an optional trailing SocialShare row"
  - "showSocialShare (default false) toggles the SocialShare row; the blog section enables it, the glossary detail leaves it off"
  - "Body accepts a raw HTML string or HtmlFragment and renders through RichContent for safe inline HTML"
  - "Shared reading view behind both SectionBlogPostDetail and SectionGlossaryDetail"
  - "Editors place hero media and copy in Studio, shipping articles without a developer round-trip"
---
::

## API Reference

::component-meta{:name="ArticleDetail"}
::
