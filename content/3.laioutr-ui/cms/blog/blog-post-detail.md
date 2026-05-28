---
title: Blog Post Detail
description: Blog article view rendering a hero media, title, rich body, and a social-share row.
playground:
  name: BlogPostDetail
  base: ui-sections-blogpostdetail
  defaultStory: default
  height: 460px
jiraIssueId: LUI-116
seo:
  title: Blog Post Detail | Laioutr
  description: Blog article view with hero media, title, rich body, and social-share row.
sitemap:
  loc: /laioutr-ui/cms/blog/blog-post-detail
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/blog/blogpost
---

## Overview

`BlogPostDetail` renders an article reading experience built from four parts: an optional hero `media`, the post `title`, a rich-content `body`, and a `SocialShare` row at the foot. The body accepts either a raw HTML string or an `HtmlFragment`, and renders through the `RichContent` component for safe inline HTML.

Pair with [`BlogPostListing`](/laioutr-ui/cms/blog/blog-post-listing), which renders the index.

## Key Business & UX Benefits

- A focused article layout (media, title, body, share) keeps readers in the story without sidebar noise pulling attention away.
- The rich-content body accepts the HTML editors already produce in their CMS, so writers ship richer stories without ad-hoc templates.
- The trailing `SocialShare` row amplifies reach on the channels that drive referral traffic back to the storefront.
- Editors place hero media and copy in Studio, so each article ships without a developer round-trip.

:::tip
Pro-Tip from Larry: Pair `BlogPostDetail` (the article view) with `BlogPostListing` (the index) so the blog has a consistent structure end-to-end.
:::

## Usage

::component-code{:name="LBlogPostDetail" story-id="ui-kit-organisms-richcontent--blog-post"}
::

## Feature List

::features
---
items:
  - "Renders four parts: optional hero media, title, rich-content body, and a trailing SocialShare row"
  - "Body accepts a raw HTML string or HtmlFragment and renders through RichContent for safe inline HTML"
  - "Pairs with BlogPostListing for a consistent blog structure from index to article"
  - "Editors place hero media and copy in Studio, shipping articles without a developer round-trip"
---
::

## API Reference

::component-meta{:name="BlogPostDetail"}
::
