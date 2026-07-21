---
title: Article Detail
description: Shared article reading view rendering an optional hero media, title, rich body, and an optional social-share row.
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

Use the same reading view for blog articles, glossary entries, and other long-form content by choosing which optional elements to provide. For example, a glossary entry can omit both `media` and the social-share row. `ArticleDetail` replaces the former `BlogPostDetail` component — see the [UI changelog](/getting-started/changelogs/ui-changelog#_240).

Pair article content with [`BlogPostListing`](/laioutr-ui/cms/blog/blog-post-listing), which renders a blog index.

## Key Business & UX Benefits

- A focused article layout (media, title, body, share) keeps readers in the story without sidebar noise pulling attention away.
- The rich-content body accepts the HTML editors already produce in their CMS, so writers ship richer stories without ad-hoc templates.
- One shared reading view supports articles, glossary entries, and other long-form content without component forks.
- The optional `SocialShare` row amplifies reach on the channels that drive referral traffic back to the storefront, and stays off where sharing isn't wanted (such as glossary entries).

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
  - "showSocialShare (default false) toggles the SocialShare row independently of the article content"
  - "Body accepts a raw HTML string or HtmlFragment and renders through RichContent for safe inline HTML"
  - "Reusable for blog articles, glossary entries, and other long-form content"
---
::

## API Reference

::component-meta{:name="ArticleDetail"}
::
