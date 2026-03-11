---
title: BlogPost
description: Blog post page with rich content, social sharing, breadcrumbs, and related posts section.
jiraIssueId: LUI-116
---

## Overview

The Blog Post Page template delivers a complete article reading experience optimized for both engagement and conversion. It renders full post content through the RichContent component with blockquote support, responsive images with lazy loading, and custom content slots for embedded media. The SocialShare molecule opens native share dialogs for each platform using their respective web intents and APIs. Semantic HTML structure with proper heading hierarchy combined with BlogPosting schema markup ensures strong search engine visibility while canonical URL tags prevent duplicate content penalties.

## Key Business & UX Benefits

- One template for blog posts with rich content, sharing, and related posts.
- Social sharing and related posts keep readers engaged and discovering content.
- SEO-optimized structure and schema support discoverability.
- Previous/next navigation and breadcrumbs keep context clear.

:::tip
Pro-Tip from Larry: Use the Blog Post template so articles have consistent structure and SEO.
:::

## Usage

::component-code{:name="LuiBlogPost" story-id="ui-kit-richcontent--blog-post"}
::

## Feature List

::features
---
items:
  - Social sharing buttons for Facebook, X, Pinterest, and Email
  - Related posts section for content discovery
  - Previous and next post navigation links
  - SEO-optimized with BlogPosting schema structured data
---
::

## API Reference

::component-meta{:name="LuiBlogPost"}
::
