---
title: Sitemap
description: Generate XML sitemaps for your Laioutr frontend to help search engines discover and index your pages. Automatically includes pages from your runtime config and integrates with robots.txt.
---

## What is a sitemap?

A **sitemap** is an XML file (typically `/sitemap.xml`) that lists all the pages on your site and helps search engines discover and index your content more efficiently. While not required, sitemaps are especially useful for:

- **Large sites** with many pages
- **Sites with complex structures** (e.g. e-commerce with products, categories, content pages)
- **New sites** that need faster initial indexing
- **Sites with frequently changing content**

Laioutr can use **[Nuxt Sitemap](https://nuxtseo.com/docs/sitemap/getting-started/introduction)** (part of Nuxt SEO) to automatically generate sitemaps based on your site's pages. Unlike robots.txt (which is included by default), **sitemap is optional** and needs to be added to your project.

## How it works

Nuxt Sitemap automatically generates a sitemap.xml file based on your site's routes. For a Laioutr frontend, this means:

- **Pages from runtime config** – Pages defined in your project (RC) are automatically included in the sitemap
- **Automatic lastmod dates** – The module tracks when pages were last modified
- **Image discovery** – Images from your pages can be included in the sitemap
- **i18n support** – If you use multi-language, the sitemap includes all language variants
- **Integration with robots.txt** – Pages marked as `noindex` in Studio are automatically excluded from the sitemap

So once configured, the sitemap stays up-to-date with your pages without manual maintenance.

## Installation

To enable sitemap generation, add **@nuxtjs/sitemap** to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@laioutr-core/frontend-core',
    '@nuxtjs/sitemap', // Add this
    // ... other modules
  ],
});
```

Then install the package:

```bash
pnpm add @nuxtjs/sitemap
# or
npm install @nuxtjs/sitemap
```

After installation, the module will automatically generate `/sitemap.xml` based on your site's routes.

## Basic configuration

The module works with **zero configuration** out of the box, but you can customize it in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    // Your site URL (required for absolute URLs in sitemap)
    hostname: 'https://yourstore.com',
    // Exclude specific routes from sitemap
    exclude: ['/checkout/**', '/cart', '/account/**'],
    // Or include only specific routes
    // include: ['/products/**', '/categories/**'],
  },
});
```

### Integration with robots.txt

If you're using **@nuxtjs/robots** (which is included by default with frontend-core), Nuxt Sitemap automatically **excludes pages marked as `noindex`** from the sitemap. This means:

- Pages with `robots: 'noindex'` set in Studio won't appear in the sitemap
- Pages disallowed in robots.txt won't appear in the sitemap
- You don't need to manually maintain both lists

So your sitemap and robots.txt stay in sync automatically.

## Advanced configuration

### Multiple sitemaps

For large sites, you can split the sitemap into multiple files:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    hostname: 'https://yourstore.com',
    sitemaps: {
      pages: {
        include: ['/**'],
        exclude: ['/products/**', '/categories/**'],
      },
      products: {
        include: ['/products/**'],
      },
      categories: {
        include: ['/categories/**'],
      },
    },
  },
});
```

This generates `/pages-sitemap.xml`, `/products-sitemap.xml`, and `/categories-sitemap.xml`, plus a sitemap index at `/sitemap.xml`.

### Dynamic URLs from external sources

If you need to include URLs that aren't part of your Nuxt routes (e.g. from an API or database), you can use **sitemap sources**:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    hostname: 'https://yourstore.com',
    sources: [
      // Fetch URLs from an API endpoint
      '/api/sitemap-urls',
      // Or use a function
      async () => {
        const urls = await fetchUrlsFromYourBackend();
        return urls.map(url => ({ loc: url, lastmod: new Date() }));
      },
    ],
  },
});
```

### Customizing sitemap entries

You can customize how each URL appears in the sitemap using **route rules**:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/products/**': {
      sitemap: {
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
    },
    '/categories/**': {
      sitemap: {
        changefreq: 'weekly',
        priority: 0.7,
      },
    },
  },
});
```

### Image sitemaps

To include images in your sitemap (for Google Image Search), enable image discovery:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    hostname: 'https://yourstore.com',
    // Automatically discover images from pages
    discoverImages: true,
  },
});
```

## How it integrates with Laioutr

### Pages from runtime config

Since Laioutr pages are defined in the **runtime config** (RC) and registered as routes, Nuxt Sitemap automatically discovers them. Each page from your RC becomes an entry in the sitemap with:

- **URL** – The page's path (localized if using i18n)
- **lastmod** – Based on the page's `updatedAt` timestamp from RC
- **Exclusion** – If the page variant has `robots: 'noindex'` in Studio, it's excluded

### Studio integration

When editors set **robots** directives in Studio (page variant SEO → robots), those settings affect the sitemap:

- Pages with `noindex` are **excluded** from the sitemap
- Pages with `index` (or no robots setting) are **included** in the sitemap

So editors can control both indexing and sitemap inclusion from the same place.

### Multi-language support

If your frontend uses **@nuxtjs/i18n** (which frontend-core includes), Nuxt Sitemap automatically includes all language variants of each page in the sitemap, with proper `hreflang` tags.

## Summary

- **Sitemap** is an **optional** feature that can be added by installing **@nuxtjs/sitemap**.
- It automatically generates `/sitemap.xml` based on your Laioutr pages (from runtime config).
- **Integrates with robots.txt** – Pages marked as `noindex` in Studio are automatically excluded.
- **Zero config** works, but you can customize: exclude/include routes, multiple sitemaps, dynamic URLs, image discovery, and per-route sitemap metadata.
- **Studio integration** – Editors control sitemap inclusion via the same robots settings that control indexing.

For detailed configuration options and advanced usage, see the [Nuxt Sitemap documentation](https://nuxtseo.com/docs/sitemap/getting-started/introduction).
