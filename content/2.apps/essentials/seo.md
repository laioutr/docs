---
title: SEO
description: SEO essentials for Laioutr frontends — robots.txt, sitemap, OG image, Schema.org, link checker, and per-page SEO. Built on Nuxt SEO modules and integrated with Studio.
seo:
  title: SEO
  description: SEO essentials for Laioutr frontends — robots.txt, sitemap, OG image, Schema.org, link checker, and per-page SEO.
sitemap:
  loc: /apps/essentials/seo
  lastmod: 2026-07-28
  changefreq: monthly
  priority: 1.0

---

The Laioutr frontend includes **SEO features** to help you optimize your storefront for search engines. These features are built on top of Nuxt SEO modules and integrated with the platform so you can configure them globally and per-page via Studio.

## What's included

- **Robots.txt** – Control which pages search engines can crawl and index. Configure globally and per-page via Studio. Included by default.
- **Sitemap** – Generate XML sitemaps to help search engines discover and index your pages. Optional module that integrates with robots.txt.
- **OG Image** – Generate social media preview images (og:image) using Vue templates. Optional module for better link previews when sharing.
- **Schema.org** – Generate JSON-LD structured data to enable rich snippets in search results. Optional module with 30+ schema types.
- **Link Checker** – Automatically scan for broken links, SEO issues, and accessibility problems during development and build. Optional module.
- **Per-page SEO** – Each page variant can set title, description, and robots directives that are rendered as meta tags and headers.

All SEO features follow the same pattern: what the feature does, how to enable and configure it, and how to extend it when needed.

## Robots.txt

Control how search engines and crawlers interact with your Laioutr frontend using robots.txt, meta tags, and X-Robots-Tag headers. Configure globally and per-page via Studio.

### What is robots.txt?

**robots.txt** is a file that tells search engine crawlers (like Googlebot) which parts of your site they can and cannot access. It helps you:

- **Prevent indexing** of pages you don't want in search results (e.g. checkout, admin, staging environments).
- **Control crawling** to avoid wasting crawl budget on duplicate or low-value pages.
- **Avoid duplicate content issues** by ensuring non-production environments (dev, staging) are not indexed.

Laioutr uses the **@nuxtjs/robots** module (part of Nuxt SEO) to manage robots.txt and robots directives. The module is automatically installed with **@laioutr-core/frontend-core** (see [Platform Dependencies](/apps/app-development/platform-dependencies)), so every Laioutr frontend has robots.txt support out of the box.

### How it works

The robots.txt feature works at **two levels**:

1. **Global robots.txt file** – A `/robots.txt` endpoint that lists which paths crawlers can and cannot access. This is the traditional robots.txt file that crawlers check first.
2. **Per-page robots directives** – Each page can set a **robots** directive (e.g. `noindex`, `nofollow`) via the page variant's **SEO** settings in Studio. This is rendered as both:

  - A `<meta name="robots" content="...">` tag in the HTML
  - An `X-Robots-Tag` HTTP header

So you can control crawling **globally** (via robots.txt rules) and **per-page** (via the page variant's SEO robots field).

### Per-page robots directives (Studio)

In **Cockpit** (Studio), when you edit a page variant, you can set a **robots** value in the **SEO** section. This value is stored in the page variant's `seo.robots` field and used by **PageRenderer** to set the robots meta tag and header for that page.

Common values:

- **index, follow** – Allow indexing and following links (default for most pages).
- **noindex, follow** – Don't index this page, but follow links on it.
- **index, nofollow** – Index this page, but don't follow links.
- **noindex, nofollow** – Don't index and don't follow links (e.g. for checkout, account pages).

If you don't set a robots value in Studio, the page uses the **default** (typically `index, follow` unless overridden in your Nuxt config).

### Global robots.txt configuration

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

The module also **automatically disables indexing for non-production environments** (based on Nuxt's site config), so your dev and staging sites won't be indexed by search engines. This helps avoid duplicate content issues.

For more configuration options, see the [Nuxt Robots documentation](https://nuxtseo.com/docs/robots/getting-started/introduction).

### Advanced configuration

#### Route rules

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

#### Nitro hooks

For dynamic configuration (e.g. based on request headers or runtime conditions), you can use **Nitro hooks** to modify robots rules at runtime. See the [Nuxt Robots Nitro API documentation](https://nuxtseo.com/docs/robots/nitro-api/nitro-hooks) for details.

#### Integration with other SEO modules

The **@nuxtjs/robots** module integrates with other Nuxt SEO modules:

- **Nuxt Sitemap** – Pages marked as `noindex` are automatically excluded from the sitemap.
- **Nuxt Schema.org** – Schema.org data is not rendered for pages marked as excluded from indexing.

So if you add these modules to your frontend, they will respect your robots directives automatically.

## Sitemap

Generate XML sitemaps for your Laioutr frontend to help search engines discover and index your pages. Automatically includes pages from your runtime config and integrates with robots.txt.

### Overview

A sitemap is an XML file (`/sitemap.xml`) that lists all pages on your site, helping search engines discover and index your content efficiently. Sitemaps are especially useful for large sites, new sites, and sites with frequently changing content.

Laioutr projects can use **Nuxt Sitemap** to generate sitemaps automatically. It is not bundled with frontend-core and must be installed separately.

### Installation

```bash
npx nuxi module add @nuxtjs/sitemap
```

### Configuration

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

### Laioutr integration

Pages registered via your runtime config are standard Nuxt routes — Nuxt Sitemap discovers them automatically. No special integration is needed.

If you use `@nuxtjs/robots` (included by default with frontend-core), pages marked as `noindex` in Studio are automatically excluded from the sitemap.

For multi-sitemap configuration, dynamic URL sources, route rules, and i18n support, see the [Nuxt Sitemap documentation](https://nuxtseo.com/sitemap).

## OG Image

Generate social media preview images (og:image) for your Laioutr frontend using Vue templates. Create dynamic, branded preview images that appear when links are shared on social platforms.

### Overview

OG Image (Open Graph Image) is the preview image shown when a link is shared on social media or messaging apps. Having a well-designed OG image improves how your links appear when shared on Twitter/X, Facebook, LinkedIn, Slack, and other platforms.

Laioutr projects can use **Nuxt OG Image** to generate these images from Vue templates. It is not bundled with frontend-core and must be installed separately.

### Installation

```bash
npx nuxi module add nuxt-og-image
```

### Configuration

Set your site URL using [Nuxt Site Config](https://nuxtseo.com/docs/site-config/getting-started/introduction):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: 'https://yourstore.com',
  },
});
```

### Example: OG image from section data

Call `defineOgImage()` from the section that renders the page's main entity, and feed it that entity's data. A product detail section declares a `singleEntity` query field and receives the resolved [Product](/frontend/api-reference/entities/product) as a prop — see [Consuming Query Fields](/apps/app-development/consuming-query-fields).

```vue [app/sections/ProductDetail.vue]
<script setup lang="ts">
import type { ClientEntity } from '@laioutr-core/orchestr/types';

// Resolved from the section's query field. Undefined while the query loads.
const { product } = defineProps<{ product: ClientEntity | undefined }>();

defineOgImage({
  component: 'OgImageDefault',
  title: product?.components.base.name,
  description: product?.components.seo?.description,
});
</script>
```

You can create custom OG image templates as Vue components in `components/OgImage*.vue` and reference them by name in the `component` field.

::note
The page's `title` and `description` in the head already come from the page variant's Studio SEO fields, applied by Frontend Core. Use the `frontend-core:page-head:resolve` [hook](/frontend/features/hooks) if you need to read or override those, rather than reconstructing them in a section.
::

For custom templates, renderer options (Satori, Chromium), DevTools integration, and advanced configuration, see the [Nuxt OG Image documentation](https://nuxtseo.com/og-image).

## Schema.org

Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add structured data for products, organizations, breadcrumbs, and more.

### Overview

Schema.org is a vocabulary of structured data that helps search engines understand the content of your pages. Adding Schema.org markup (as JSON-LD) can enable rich snippets in search results — star ratings, product prices, breadcrumbs, and more.

Laioutr projects can use **Nuxt Schema.org** to generate JSON-LD automatically. It is not bundled with frontend-core and must be installed separately.

### Installation

```bash
npx nuxi module add @nuxtjs/schema-org
```

### Configuration

Set your site URL and name using [Nuxt Site Config](https://nuxtseo.com/docs/site-config/getting-started/introduction):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: 'https://yourstore.com',
    name: 'Your Store',
  },
});
```

Nuxt Schema.org reads these values automatically. No additional module-level config is needed for basic usage.

### Example: product structured data

Structured data is built from the entity the section renders, not from the page's SEO fields. A product detail section declares a `singleEntity` query field, and Frontend Core hands the resolved [Product](/frontend/api-reference/entities/product) to the component as a prop — see [Consuming Query Fields](/apps/app-development/consuming-query-fields).

```vue [app/sections/ProductDetail.vue]
<script setup lang="ts">
import type { ClientEntity } from '@laioutr-core/orchestr/types';
import { computed } from 'vue';

// Resolved from the section's query field. Undefined while the query loads.
const { product } = defineProps<{ product: ClientEntity | undefined }>();

useSchemaOrg(
  computed(() => {
    if (!product) return [];
    const { base, seo, prices, media } = product.components;

    return [
      defineProduct({
        name: base.name,
        description: seo?.description,
        image: media?.images[0]?.sources[0]?.src,
        offers: [
          defineOffer({
            // Money.amount is in the smallest currency unit; schema.org expects a decimal.
            price: prices.price.amount / 100,
            priceCurrency: prices.price.currency,
          }),
        ],
      }),
    ];
  })
);
</script>
```

::note
Stock status lives on [ProductVariant](/frontend/api-reference/entities/product-variant), not on Product — read it from the linked variant if you want to emit `availability` on the offer.
::

Other helpers like `defineBreadcrumb()`, `defineOrganization()`, and `defineWebSite()` work the same way. The module provides 30+ typed helpers for different schema types.

The page's `title`, `description`, and `robots` come from the SEO fields on the page variant in Studio, and Frontend Core already applies them to the head. Don't re-derive them in a section. To read or override them, use the `frontend-core:page-head:resolve` [hook](/frontend/features/hooks), which receives the current `page` and `pageVariant`.

For configuration options, available schema types, and advanced usage, see the [Nuxt Schema.org documentation](https://unhead.unjs.io/schema-org/getting-started/setup).

## Link Checker

Automatically scan your Laioutr frontend for broken links and SEO issues during development and build time.

### Overview

Nuxt Link Checker scans your site for broken links, missing anchors, and URL best-practice violations during development and at build time. It helps you catch 404s, malformed URLs, and accessibility issues before they reach production.

It is not bundled with frontend-core and must be installed separately.

### Installation

```bash
npx nuxi module add nuxt-link-checker
```

### Laioutr integration

Nuxt Link Checker scans your rendered HTML during development. Since Laioutr pages are standard Nuxt routes, the checker validates all links in your sections and blocks automatically.

No special configuration is needed. The module works out of the box once installed.

For configuration options, inspection types, build-time reports, and DevTools integration, see the [Nuxt Link Checker documentation](https://nuxtseo.com/link-checker).

## Summary

- **robots.txt** is automatically available in every Laioutr frontend via **@nuxtjs/robots** (installed with frontend-core).
- **Sitemap**, **OG Image**, **Schema.org**, and **Link Checker** are optional modules that integrate with the rest of the SEO stack.
- **Per-page SEO** values (title, description, robots) are set in **Studio** on the page variant and rendered as meta tags and headers.
- **Non-production environments** are automatically excluded from indexing to avoid duplicate content.
