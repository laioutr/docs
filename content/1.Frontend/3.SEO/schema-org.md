---
title: Schema.org
description: Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add structured data for products, organizations, breadcrumbs, and more.
seo:
  title: Schema.org | Laioutr
  description: Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add…
---

## Overview

Schema.org is a vocabulary of structured data that helps search engines understand the content of your pages. Adding Schema.org markup (as JSON-LD) can enable rich snippets in search results — star ratings, product prices, breadcrumbs, and more.

Laioutr projects can use **Nuxt Schema.org** to generate JSON-LD automatically. It is not bundled with frontend-core and must be installed separately.

## Installation

```bash
npx nuxi module add @nuxtjs/schema-org
```

## Configuration

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

## Example: Product Structured Data

In a product detail section, use `defineProduct()` with data from `usePageVariant()`:

```vue
<script setup lang="ts">
const pageVariant = usePageVariant();

useSchemaOrg([
  defineProduct({
    name: pageVariant.value.seo.title,
    description: pageVariant.value.seo.description,
    image: pageVariant.value.seo.image,
    offers: [
      defineOffer({
        price: pageVariant.value.data.price,
        priceCurrency: pageVariant.value.data.currency,
        availability: pageVariant.value.data.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      }),
    ],
  }),
]);
</script>
```

Other helpers like `defineBreadcrumb()`, `defineOrganization()`, and `defineWebSite()` work the same way. The module provides 30+ typed helpers for different schema types.

## Further Reading

For configuration options, available schema types, and advanced usage, see the [Nuxt Schema.org documentation](https://unhead.unjs.io/schema-org/getting-started/setup).
