---
title: Social Share
description: Row of platform share buttons that open web intent URLs for Facebook, X, LinkedIn, Pinterest, and email.
playground:
  name: SocialShare
  base: ui-blocks-socialshare
  defaultStory: default
  height: 460px
seo:
  title: Social Share
  description: Row of platform share buttons.
sitemap:
  loc: /laioutr-ui/cms/reviews/social-share
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`SocialShare` is the row of platform share buttons (Facebook, X / Twitter, LinkedIn, Pinterest, email) used inside `ArticleDetail`. Each button opens the platform's web intent URL (for example `sharer.php`, `intent/post`, `share-offsite`, `mailto:`) prefilled with the page URL and title.

## Key Business & UX Benefits

- Encourages readers to amplify content on the channels that drive referral traffic back to the storefront, lifting earned reach.
- Web intent URLs land in each platform's recognizable share UI, so readers complete the action instead of bouncing off a custom widget.
- Web intents work without third-party SDKs, keeping the page light and free of additional consent or privacy review.
- One row covers the major social platforms plus email, so editorial pages get full distribution from a single block.

## Feature List

::features
---
items:
  - "Platform buttons cover Facebook, X / Twitter, LinkedIn, Pinterest, and email in one row"
  - "Each button opens the platform's web intent URL prefilled with the page URL and title"
  - "Web intents work without third-party SDKs, keeping the page light and free of extra consent reviews"
  - "Used inside ArticleDetail for one-click distribution of editorial content"
  - "Defaults the share URL to the current page when none is passed"
---
::

## API Reference

::component-meta{:name="SocialShare"}
::
