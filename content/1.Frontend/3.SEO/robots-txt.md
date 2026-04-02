---
title: Robots.txt
description: Control how search engines and crawlers interact with your Laioutr frontend using robots.txt, meta tags, and X-Robots-Tag headers. Configure globally and per-page via Studio.
seo:
  title: Robots.txt | Laioutr
  description: Control how search engines and crawlers interact with your Laioutr frontend using robots.txt, meta tags, and…
---

## What is robots.txt?

**robots.txt** is a file that tells search engine crawlers (like Googlebot) which parts of your site they can and cannot access. It helps you:

- **Prevent indexing** of pages you don’t want in search results (e.g. checkout, admin, staging environments).
- **Control crawling** to avoid wasting crawl budget on duplicate or low-value pages.
- **Avoid duplicate content issues** by ensuring non-production environments (dev, staging) are not indexed.

Laioutr uses the **[@nuxtjs/robots](https://nuxtseo.com/docs/robots/getting-started/introduction)** module (part of Nuxt SEO) to manage robots.txt and robots directives. The module is automatically installed with **@laioutr-core/frontend-core** (see [Platform Dependencies](/apps/app-development/platform-dependencies)), so every Laioutr frontend has robots.txt support out of the box.

## How it works

The robots.txt feature works at **two levels**:

1. **Global robots.txt file** – A `/robots.txt` endpoint that lists which paths crawlers can and cannot access. This is the traditional robots.txt file that crawlers check first.
2. **Per-page robots directives** – Each page can set a **robots** directive (e.g. `noindex`, `nofollow`) via the page variant’s **SEO** settings in Studio. This is rendered as both:
   - A `<meta name="robots" content="...">` tag in the HTML
   - An `X-Robots-Tag` HTTP header

So you can control crawling **globally** (via robots.txt rules) and **per-page** (via the page variant’s SEO robots field).

## Per-page robots directives (Studio)

In **Cockpit** (Studio), when you edit a page variant, you can set a **robots** value in the **SEO** section. This value is stored in the page variant’s `seo.robots` field and used by **PageRenderer** to set the robots meta tag and header for that page.

Common values:

- **`index, follow`** – Allow indexing and following links (default for most pages).
- **`noindex, follow`** – Don’t index this page, but follow links on it.
- **`index, nofollow`** – Index this page, but don’t follow links.
- **`noindex, nofollow`** – Don’t index and don’t follow links (e.g. for checkout, account pages).

If you don’t set a robots value in Studio, the page uses the **default** (typically `index, follow` unless overridden in your Nuxt config).

## Global robots.txt configuration

To configure the **global robots.txt file** (which paths are allowed/disallowed), you can set options for the **@nuxtjs/robots** module in your **nuxt.config.ts**:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  robots: {
    // Disallow specific paths globally
    disallow: ['/checkout', '/cart', '/account'],
    // Allow specific paths (if you want to be explicit)
    allow: ['/'],
    // User agents (defaults to all: '*')
    // You can also set rules per user agent
  },
});
```

The module also **automatically disables indexing for non-production environments** (based on Nuxt’s site config), so your dev and staging sites won’t be indexed by search engines. This helps avoid duplicate content issues.

For more configuration options, see the [Nuxt Robots documentation](https://nuxtseo.com/docs/robots/getting-started/introduction).

## Advanced configuration

### Route rules

You can use **Nuxt route rules** to set robots directives for specific routes:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/checkout/**': {
      robots: 'noindex, nofollow',
    },
    '/account/**': {
      robots: 'noindex, nofollow',
    },
  },
});
```

Route rules take precedence over the global robots.txt config, so you can fine-tune per route pattern.

### Nitro hooks

For dynamic configuration (e.g. based on request headers or runtime conditions), you can use **Nitro hooks** to modify robots rules at runtime. See the [Nuxt Robots Nitro API documentation](https://nuxtseo.com/docs/robots/nitro-api/nitro-hooks) for details.

### Integration with other SEO modules

The **@nuxtjs/robots** module integrates with other Nuxt SEO modules:

- **[Nuxt Sitemap](https://nuxtseo.com/docs/sitemap/getting-started/introduction)** – Pages marked as `noindex` are automatically excluded from the sitemap.
- **[Nuxt Schema.org](https://nuxtseo.com/docs/schema-org/getting-started/introduction)** – Schema.org data is not rendered for pages marked as excluded from indexing.

So if you add these modules to your frontend, they will respect your robots directives automatically.

## Summary

- **robots.txt** is automatically available in every Laioutr frontend via **@nuxtjs/robots** (installed with frontend-core).
- **Global robots.txt** is configured in **nuxt.config.ts** under the `robots` key (or via route rules).
- **Per-page robots directives** are set in **Studio** (page variant SEO → robots field) and rendered as meta tags and headers.
- **Non-production environments** are automatically excluded from indexing to avoid duplicate content.
- The module integrates with other Nuxt SEO modules (Sitemap, Schema.org) so they respect your robots settings.

For detailed configuration options and advanced usage, see the [Nuxt Robots documentation](https://nuxtseo.com/docs/robots/getting-started/introduction).
