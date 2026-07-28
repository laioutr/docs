---
title: Schema.org
description: Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add structured data for products, organizations, breadcrumbs, and more.
seo:
  title: Schema.org
  description: Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add…
sitemap:
  loc: /frontend/seo/schema-org
  lastmod: 2026-07-28
  changefreq: monthly
  priority: 1.0

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

### Page-level metadata

The page's `title`, `description`, and `robots` come from the SEO fields on the page variant in Studio, and Frontend Core already applies them to the head. Don't re-derive them in a section. To read or override them, use the `frontend-core:page-head:resolve` [hook](/frontend/features/hooks), which receives the current `page` and `pageVariant`.

## Further Reading

For configuration options, available schema types, and advanced usage, see the [Nuxt Schema.org documentation](https://unhead.unjs.io/schema-org/getting-started/setup).
