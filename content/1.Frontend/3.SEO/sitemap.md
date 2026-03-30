---
title: Sitemap
description: Generate XML sitemaps for your Laioutr frontend to help search engines discover and index your pages. Automatically includes pages from your runtime config and integrates with robots.txt.
---

## Overview

A sitemap is an XML file (`/sitemap.xml`) that lists all pages on your site, helping search engines discover and index your content efficiently. Sitemaps are especially useful for large sites, new sites, and sites with frequently changing content.

Laioutr projects can use **Nuxt Sitemap** to generate sitemaps automatically. It is not bundled with frontend-core and must be installed separately.

## Installation

```bash
npx nuxi module add @nuxtjs/sitemap
```

## Configuration

Set your site URL using [Nuxt Site Config](https://nuxtseo.com/docs/site-config/getting-started/introduction):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: 'https://yourstore.com',
  },
});
```

After installation, the module generates `/sitemap.xml` from your site's routes automatically.

## Laioutr Integration

Pages registered via your runtime config are standard Nuxt routes — Nuxt Sitemap discovers them automatically. No special integration is needed.

If you use `@nuxtjs/robots` (included by default with frontend-core), pages marked as `noindex` in Studio are automatically excluded from the sitemap.

## Further Reading

For multi-sitemap configuration, dynamic URL sources, route rules, and i18n support, see the [Nuxt Sitemap documentation](https://nuxtseo.com/sitemap).
