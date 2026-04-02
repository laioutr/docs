---
title: Link Checker
description: Automatically scan your Laioutr frontend for broken links and SEO issues during development and build time.
seo:
  title: Link Checker | Laioutr
  description: Automatically scan your Laioutr frontend for broken links and SEO issues during development and build time.
---

## Overview

Nuxt Link Checker scans your site for broken links, missing anchors, and URL best-practice violations during development and at build time. It helps you catch 404s, malformed URLs, and accessibility issues before they reach production.

It is not bundled with frontend-core and must be installed separately.

## Installation

```bash
npx nuxi module add nuxt-link-checker
```

## Laioutr Integration

Nuxt Link Checker scans your rendered HTML during development. Since Laioutr pages are standard Nuxt routes, the checker validates all links in your sections and blocks automatically.

No special configuration is needed. The module works out of the box once installed.

## Further Reading

For configuration options, inspection types, build-time reports, and DevTools integration, see the [Nuxt Link Checker documentation](https://nuxtseo.com/link-checker).
