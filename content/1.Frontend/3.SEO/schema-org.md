---
title: Schema.org
description: Generate JSON-LD structured data for your Laioutr frontend to enable rich snippets in Google search results. Add structured data for products, organizations, breadcrumbs, and more.
---

## What is Schema.org?

**Schema.org** is a vocabulary of structured data that helps search engines understand the content and context of your pages. By adding Schema.org markup (typically as JSON-LD), you enable **rich snippets** in Google search results—enhanced displays that can show:

- **Star ratings** for products or reviews
- **FAQ accordions** with expandable questions and answers
- **Recipe cards** with cooking time, ingredients, and ratings
- **Product information** with price, availability, and images
- **Breadcrumbs** showing the page's location in your site hierarchy
- **Organization** details for your business

Rich snippets can increase **click-through rates by up to 30%** and provide users with more information before they visit your site.

Laioutr can use **[Nuxt Schema.org](https://nuxtseo.com/docs/schema-org/getting-started/introduction)** (part of Nuxt SEO) to automatically generate JSON-LD structured data for your pages. Unlike robots.txt (which is included by default), **Schema.org is optional** and needs to be added to your project.

## How it works

Nuxt Schema.org provides a simple API to define structured data using **30+ Schema.org node types** (Organization, Product, BreadcrumbList, FAQPage, etc.). The module:

- **Automatically generates JSON-LD** and injects it into your page's `<head>`
- **Handles relations** between nodes (e.g. Product → Organization → WebSite)
- **Resolves dates and URLs** automatically
- **Integrates with robots.txt** – Pages marked as `noindex` skip Schema.org rendering
- **Optimized for SSR** and tree-shaking

You define structured data using composables (e.g. `useSchemaOrg`) in your pages or components, and the module handles the rest.

## Installation

To enable Schema.org structured data, add **@nuxtjs/schema-org** to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@laioutr-core/frontend-core',
    '@nuxtjs/schema-org', // Add this
    // ... other modules
  ],
});
```

Then install the package:

```bash
pnpm add @nuxtjs/schema-org
# or
npm install @nuxtjs/schema-org
```

## Basic configuration

Set global defaults in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    // Your site URL
    host: 'https://yourstore.com',
    // Default language
    defaultLanguage: 'en',
  },
});
```

### Global site metadata

Define your organization and website once, and it will be included on all pages:

```ts
// nuxt.config.ts or a plugin
import { useSchemaOrg } from '#imports';

useSchemaOrg({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Your Store',
  url: 'https://yourstore.com',
  logo: 'https://yourstore.com/logo.png',
  sameAs: [
    'https://twitter.com/yourstore',
    'https://facebook.com/yourstore',
  ],
});
```

## Common use cases

### Product pages

Add Product structured data to product detail pages:

```ts
// In a product detail page component or section
import { useSchemaOrg } from '#imports';

const product = await useOrchestr().executeQuery(ProductBySlugQuery, { slug });

useSchemaOrg([
  {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.media.map(m => m.sources[0].src),
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.prices.price,
      priceCurrency: product.prices.currency,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
    } : undefined,
  },
]);
```

### Breadcrumbs

Add breadcrumb navigation for better search result display:

```ts
// In PageRenderer or a breadcrumb component
import { useSchemaOrg } from '#imports';

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Category', url: '/categories/electronics' },
  { name: 'Product', url: '/products/laptop' },
];

useSchemaOrg({
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});
```

### Organization and WebSite

Define your organization and website structure:

```ts
// In a plugin or app.vue
import { useSchemaOrg } from '#imports';

useSchemaOrg([
  {
    '@type': 'Organization',
    name: 'Your Store',
    url: 'https://yourstore.com',
    logo: 'https://yourstore.com/logo.png',
  },
  {
    '@type': 'WebSite',
    name: 'Your Store',
    url: 'https://yourstore.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yourstore.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
]);
```

### FAQ pages

Add FAQ structured data for FAQ pages:

```ts
// In an FAQ page component
import { useSchemaOrg } from '#imports';

const faqs = [
  { question: 'What is your return policy?', answer: 'We offer 30-day returns...' },
  { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide...' },
];

useSchemaOrg({
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
```

## How it integrates with Laioutr

### Per-page structured data

Since Laioutr pages are rendered via **PageRenderer**, you can add structured data per page type:

1. **Create composables or utilities** for each page type (e.g. `useProductSchema`, `useCategorySchema`)
2. **Call them in page components or sections** based on the page's data

For example, in a product detail section:

```vue
<!-- sections/ProductDetail.vue -->
<script setup lang="ts">
import { useSchemaOrg } from '#imports';

const props = defineProps<{
  product: Product;
}>();

// Add Product structured data
useSchemaOrg({
  '@type': 'Product',
  name: props.product.name,
  description: props.product.description,
  // ... other product fields
});
</script>
```

### Using Orchestr data

Since pages fetch data via **Orchestr** (products, categories, etc.), you can use that data to generate structured data:

```ts
// After fetching product data
const product = await useOrchestr().executeQuery(ProductBySlugQuery, { slug });

useSchemaOrg({
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.media?.map(m => m.sources[0]?.src).filter(Boolean),
  offers: {
    '@type': 'Offer',
    price: product.prices.price,
    priceCurrency: product.prices.currency,
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  },
});
```

### Integration with robots.txt

If you're using **@nuxtjs/robots** (which is included by default), Nuxt Schema.org automatically **skips rendering structured data for pages marked as `noindex`**. This ensures that pages excluded from search results don't send conflicting signals to search engines.

### Page variant SEO data

You can combine Schema.org with the page variant's SEO settings from Studio:

```ts
// In PageRenderer or a page component
const pageVariant = computed(() => props.page.variants[0]);

useSchemaOrg({
  '@type': 'WebPage',
  name: pageVariant.value.seo.title || props.page.type,
  description: pageVariant.value.seo.description,
  url: currentUrl,
});
```

## Advanced usage

### Multiple schema types

You can add multiple schema types to a single page:

```ts
useSchemaOrg([
  { '@type': 'Product', /* ... */ },
  { '@type': 'BreadcrumbList', /* ... */ },
  { '@type': 'Organization', /* ... */ },
]);
```

### Conditional structured data

Add structured data conditionally based on page type or data:

```ts
// In PageRenderer or a page component
if (props.page.type === 'ecommerce/product-detail-page') {
  useSchemaOrg({
    '@type': 'Product',
    // ... product data
  });
} else if (props.page.type === 'ecommerce/product-listing-page') {
  useSchemaOrg({
    '@type': 'CollectionPage',
    // ... collection data
  });
}
```

### Custom schema types

Nuxt Schema.org supports 30+ built-in types, but you can also define custom schema if needed:

```ts
useSchemaOrg({
  '@context': 'https://schema.org',
  '@type': 'CustomType',
  // ... your custom properties
});
```

## Testing and validation

Use the [Schema.org Validator](https://nuxtseo.com/tools/schema-validator) to test your JSON-LD markup and find errors. You can also:

- **Check page source** – View the generated JSON-LD in your page's `<head>` section
- **Google Rich Results Test** – Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to see how your structured data appears in search results
- **Nuxt DevTools** – Preview structured data in Nuxt DevTools integration

## Summary

- **Schema.org** is an **optional** feature that can be added by installing **@nuxtjs/schema-org**.
- It generates **JSON-LD structured data** to enable rich snippets in Google search results (ratings, FAQs, product info, breadcrumbs, etc.).
- **30+ Schema.org node types** available with automatic relation handling, date/URL resolution, and SSR optimization.
- **Laioutr integration** – Use Orchestr query results and page variant SEO data to generate structured data per page type.
- **Integration with robots.txt** – Pages marked as `noindex` skip Schema.org rendering automatically.
- **Testing** – Validate structured data using Schema.org Validator and Google Rich Results Test.

For detailed configuration options, available schema types, and advanced usage, see the [Nuxt Schema.org documentation](https://nuxtseo.com/docs/schema-org/getting-started/introduction).
