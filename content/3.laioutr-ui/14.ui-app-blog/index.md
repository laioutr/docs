---
title: BlogPost
description: Blog post page with rich content, social sharing, breadcrumbs, and related posts section.
jiraIssueId: LUI-116
---

## Overview

The Blog Post Page template delivers a complete article reading experience optimized for both engagement and conversion. It renders full post content through the RichContent component with blockquote support, responsive images with lazy loading, and custom content slots for embedded media. The SocialShare molecule opens native share dialogs for each platform using their respective web intents and APIs. Semantic HTML structure with proper heading hierarchy combined with BlogPosting schema markup ensures strong search engine visibility while canonical URL tags prevent duplicate content penalties.

## Usage

::component-code{:name="LuiBlogPost" story-id="ui-kit-richcontent--blog-post"}
::

## Features

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
