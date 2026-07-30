---
title: Page Types
description: Page types define the kinds of pages customers can add in Studio (Home, Product Detail, Landing Page, etc.) and control routing, data loading, and link resolution.
seo:
  title: Page Types
  description: Page types define the kinds of pages customers can add in Studio (Home, Product Detail, Landing Page, etc.) and…
sitemap:
  loc: /frontend/features/pagetypes
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1
---

::callout{icon="i-lucide-list"}
For a reference of all built-in page types, see the [Page Types API reference](/frontend/api-reference/page-types).
::

## Overview

Every page in Laioutr has a **page type**: a named kind of page that defines its URL shape, what data it loads, and how it appears in Studio. Customers add pages of a given type in Studio; developers define page types with `definePageTypeToken`:

```ts [ProductBySlug.query.ts] twoslash
import { z } from 'zod/v4';
import { defineQueryToken } from '@laioutr-core/core-types/orchestr';
export const ProductBySlugQuery = defineQueryToken('ecommerce/product/by-slug', {
  entity: 'Product', type: 'single', label: 'Product by slug',
  input: z.object({ slug: z.string() }),
});
// @filename: index.ts
// ---cut---
import { definePageTypeToken } from '@laioutr-core/core-types/frontend'
import { ProductBySlugQuery } from './ProductBySlug.query'

export const ProductDetailPage = definePageTypeToken('ecommerce/product-detail-page', {
  kind: 'dynamic',
  studio: {
    label: 'Product Detail Page',
    group: 'Shop',
    icon: 'tag',
  },
  requiredQueries: [
    {
      alias: 'product',
      entityType: 'Product',
      default: {
        label: 'Page Product',
        urlAlias: '_',
        token: ProductBySlugQuery,
        inputRules: { slug: { join: ['/', { var: 'route.params.slug' }] } },
      },
    },
  ],
  pathConstraints: {
    requiredParams: ['slug'],
    default: '/products/:slug+',
  },
  resolveFor: [{ referenceType: 'Product' }],
})
```

The token is a branded string (e.g. `'ecommerce/product-detail-page'`) that carries its metadata at the type level. Registration happens at import time when `definePageTypeToken` runs.

## Metadata fields

### `kind`: static vs dynamic

- **`static`**: the customer can create **multiple pages** of this type (e.g. Landing Page, Content Page). Each page has its own ID and path.
- **`dynamic`**: typically **one page** per project, driven by a route with params (e.g. Home at `/`, Product Detail at `/products/:slug`).

### `pathConstraints`

Controls the URL shape for this page type:

- **`exact`**: a fixed path (e.g. `'/'` for Home).
- **`default`**: default path pattern that Studio suggests when adding a new page (e.g. `/products/:slug+`).
- **`requiredParams`**: route param names (e.g. `['slug']`) so Studio generates paths that include them.

If you omit these, the platform derives a path from the page type name and required params.

### `requiredQueries`

Declares data the page needs from the current route:

- **`alias`**: name used in page templates to reference the query result (e.g. `'product'`).
- **`entityType`**: the entity type for Studio and Orchestr (e.g. `'Product'`).
- **`default`**: a query template with a **token** (the query to execute) and **inputRules** that bind route params to query input. For example, `{ slug: { join: ['/', { var: 'route.params.slug' }] } }` passes the route's `:slug` param to the product query.

### `resolveFor`

Tells the [link resolver](/frontend/features/multi-language-support#language-switcher) which entity **reference links** should resolve to this page type. For example, Product Detail Page declares `resolveFor: [{ referenceType: 'Product' }]`, so a link of type `reference` pointing to a Product entity resolves to this page's route with the product's slug.

It also marks the page type as entity-resolved, which is what gates the per-locale slug lookup behind [translated slugs](/frontend/features/multi-language-support#translated-slugs). A page type without `resolveFor` never performs that lookup, because its path comes from the page configuration rather than from an entity.

### `studio`

Controls how the page type appears in Studio's "Add page" UI:

- **`label`**: display name (e.g. "Product Detail Page").
- **`group`**: groups pages in the page list (e.g. "Shop", "General").
- **`icon`** / **`variantIcon`**: [icons](/apps/app-development/studio-icons) for the page type and its variants.
- **`groupBy`**: optional grouping key (e.g. `'year'` for landing pages).
- **`description`**: optional description shown in Studio.

## Adding a custom page type

### 1. Define the token

Create a file that calls `definePageTypeToken`. The token registers itself globally at import time.

```ts twoslash
// @filename: queries/RecipeBySlug.query.ts
import { z } from 'zod/v4';
import { defineQueryToken } from '@laioutr-core/core-types/orchestr';
export const RecipeBySlugQuery = defineQueryToken('my-app/recipe/by-slug', {
  entity: 'Recipe', type: 'single', label: 'Recipe by slug',
  input: z.object({ slug: z.string() }),
});
// @filename: pageTypes/index.ts
// ---cut---
// runtime/shared/pageTypes/recipe-detail.pagetype.ts
import { definePageTypeToken } from '@laioutr-core/core-types/frontend'
import { RecipeBySlugQuery } from '../queries/RecipeBySlug.query'

export const RecipeDetailPage = definePageTypeToken('my-app/recipe-detail', {
  kind: 'dynamic',
  studio: {
    label: 'Recipe Detail',
    group: 'Content',
    icon: 'utensils',
  },
  requiredQueries: [
    {
      alias: 'recipe',
      entityType: 'Recipe',
      default: {
        label: 'Page Recipe',
        urlAlias: '_',
        token: RecipeBySlugQuery,
        inputRules: { slug: { join: ['/', { var: 'route.params.slug' }] } },
      },
    },
  ],
  pathConstraints: {
    requiredParams: ['slug'],
    default: '/recipes/:slug',
  },
  resolveFor: [{ referenceType: 'Recipe' }],
})
```

For a **static** page type (e.g. a custom landing page kind), you can omit `requiredQueries` and `resolveFor`:

```ts twoslash
import { definePageTypeToken } from '@laioutr-core/core-types/frontend';
// ---cut---
export const PromotionPage = definePageTypeToken('my-app/promotion', {
  kind: 'static',
  studio: {
    label: 'Promotion Page',
    group: 'Marketing',
    icon: 'megaphone',
  },
})
```

### 2. Ensure the module is imported

Registration happens when `definePageTypeToken` executes, so the module must be imported before the link resolver or Studio needs it. A Nuxt plugin that imports the tokens and references them is the standard pattern — this prevents the bundler from tree-shaking the imports away:

```ts
// plugins/pagetypes.ts
import { defineNuxtPlugin } from '#app'
import { pageTypeTokenRegistry } from '@laioutr-core/core-types/frontend'
import { RecipeDetailPage } from '../shared/pageTypes/recipe-detail.pagetype'
import { PromotionPage } from '../shared/pageTypes/promotion.pagetype'

export default defineNuxtPlugin(() => {
  [RecipeDetailPage, PromotionPage].forEach((token) => pageTypeTokenRegistry.getMetadata(token))
})
```

### 3. Create pages in Studio

Once the token is registered, Studio picks it up automatically. When a customer adds a new page of your type, Studio uses `pathConstraints` to suggest a default path and shows the page under the configured `studio.group`.

Routes are generated from RC pages at build time. Each RC page has a `type` string that matches the token name (e.g. `'my-app/recipe-detail'`). The link resolver uses the page type's `resolveFor` metadata to map reference links to the correct route.

### 4. Make its pages listable (optional)

A `dynamic` page type describes a route shape, not the pages behind it. Studio can show `/recipes/:slug` but has no way to know which slugs exist, so an editor linking to one recipe has to type the slug by hand.

Register a [page index](/frontend/orchestr/page-index) for the token to close that gap. One registration enumerates the page type's pages, searches them, and resolves a URL back to the entity it renders, which is what fills the link menu, the preview-data selector, and locale-correct hreflang alternates.

::note
Page types without a registration keep working exactly as before. Nothing about a page index is required.
::
