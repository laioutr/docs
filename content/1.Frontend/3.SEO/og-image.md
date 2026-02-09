---
title: OG Image
description: Generate social media preview images (og:image) for your Laioutr frontend using Vue templates. Create dynamic, branded preview images that appear when links are shared on social platforms.
---

## What is OG Image?

**OG Image** (Open Graph Image) is the preview image that appears when you share a link on social media platforms (Twitter/X, Facebook, LinkedIn, Slack, etc.) or messaging apps. It's part of the [Open Graph Protocol](https://ogp.me/) that controls how links are "unfurled" or displayed when shared.

When someone shares a link to your storefront, the platform fetches the page's Open Graph meta tags (including `og:image`) and displays a preview card with:
- **Title** (`og:title`)
- **Description** (`og:description`)
- **Image** (`og:image`)

Having a well-designed OG image can significantly improve **click-through rates** when your pages are shared, even if it doesn't directly affect organic search traffic.

Laioutr can use **[Nuxt OG Image](https://nuxtseo.com/docs/og-image/getting-started/introduction)** (part of Nuxt SEO) to automatically generate OG images using Vue templates. Unlike robots.txt (which is included by default), **OG Image is optional** and needs to be added to your project.

## How it works

Nuxt OG Image generates `og:image` meta tags and serves the actual images using one of three renderers:

- **[Satori](https://nuxtseo.com/docs/og-image/renderers/satori)** – Fast, serverless-friendly rendering using Tailwind/UnoCSS, Google Fonts, and emoji support. Good for most use cases.
- **[Takumi](https://nuxtseo.com/docs/og-image/renderers/takumi)** – 2-10x faster than Satori for simple templates. Best for performance-critical scenarios.
- **[Browser](https://nuxtseo.com/docs/og-image/renderers/browser)** – Uses a headless browser (Playwright/Puppeteer) for complex templates with animations or advanced layouts. Can also generate screenshots of actual pages.

You can:
- **Create custom OG images** using Vue components as templates
- **Use built-in templates** for common patterns
- **Generate screenshots** of your pages automatically
- **Design and test** OG images in Nuxt DevTools with hot module reload

Images are generated **on-demand** (when first requested) or **at build time** (prerendered), and cached for performance.

## Installation

To enable OG Image generation, add **nuxt-og-image** to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@laioutr-core/frontend-core',
    'nuxt-og-image', // Add this
    // ... other modules
  ],
});
```

Then install the package:

```bash
pnpm add nuxt-og-image
# or
npm install nuxt-og-image
```

**Note:** v6 is currently in beta. If you want the latest features, install with `nuxt-og-image@beta`. See the [migration guide](https://nuxtseo.com/docs/og-image/migration-guide/v6) for upgrade instructions.

## Basic configuration

The module works with minimal configuration. You can set defaults in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ogImage: {
    // Your site URL (required for absolute image URLs)
    host: 'https://yourstore.com',
    // Default renderer (satori, takumi, or browser)
    defaults: {
      renderer: 'satori',
    },
  },
});
```

### Using built-in templates

Nuxt OG Image includes built-in templates you can use:

```ts
// In a page or component
defineOgImage({
  component: 'NuxtSeo',
  title: 'My Product Page',
  description: 'Check out this amazing product',
});
```

### Creating custom OG images with Vue components

You can create custom OG images using Vue components. Create a component in your project:

```vue
<!-- components/OgImageProduct.vue -->
<template>
  <div class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white p-12">
    <h1 class="text-6xl font-bold mb-4">{{ title }}</h1>
    <p class="text-2xl">{{ description }}</p>
    <div v-if="price" class="mt-8 text-4xl font-bold">
      {{ price }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  price?: string;
}>();
</script>
```

Then use it in your pages:

```ts
// In a page component or PageRenderer
defineOgImage({
  component: 'OgImageProduct',
  title: product.name,
  description: product.description,
  price: product.formattedPrice,
});
```

### Automatic screenshots

For a quick setup, you can generate OG images by taking screenshots of your pages:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ogImage: {
    defaults: {
      renderer: 'browser',
      // Screenshot the page
      screenshot: true,
      // Hide elements you don't want in the OG image
      hideElements: ['.header', '.footer', '.cart-button'],
      // Wait for animations/loading
      waitForSelector: '.product-loaded',
    },
  },
});
```

## How it integrates with Laioutr

### Per-page OG images

Since Laioutr pages are rendered via **PageRenderer**, you can set OG images per page. The most common approach is to:

1. **Create OG image templates** for different page types (e.g. product, category, content page)
2. **Set OG image data** in your page components or sections based on the page's data

For example, in a product detail page section:

```vue
<!-- sections/ProductDetail.vue -->
<script setup lang="ts">
import { defineOgImage } from '#imports';

const props = defineProps<{
  product: {
    name: string;
    description: string;
    image: string;
    price: string;
  };
}>();

// Set OG image for this page
defineOgImage({
  component: 'OgImageProduct',
  title: props.product.name,
  description: props.product.description,
  price: props.product.price,
  image: props.product.image,
});
</script>
```

### Using page variant SEO data

You can combine OG image generation with the page variant's SEO settings (title, description) from Studio:

```ts
// In PageRenderer or a page component
const pageVariant = computed(() => props.page.variants[0]);

defineOgImage({
  component: 'OgImageDefault',
  title: pageVariant.value.seo.title || props.page.type,
  description: pageVariant.value.seo.description,
});
```

### Dynamic OG images from Orchestr data

Since pages fetch data via **Orchestr** (products, categories, etc.), you can use that data to generate dynamic OG images:

```ts
// After fetching product data via Orchestr
const product = await useOrchestr().executeQuery(ProductBySlugQuery, { slug });

defineOgImage({
  component: 'OgImageProduct',
  title: product.name,
  description: product.description,
  image: product.media?.[0]?.sources[0]?.src,
  price: product.prices.formattedPrice,
});
```

## Advanced configuration

### Multiple renderers

You can use different renderers for different pages:

```ts
// Simple product card - use Takumi for speed
defineOgImage({
  component: 'OgImageProduct',
  renderer: 'takumi',
  // ...
});

// Complex layout with animations - use Browser
defineOgImage({
  component: 'OgImageComplex',
  renderer: 'browser',
  // ...
});
```

### Edge deployment

Nuxt OG Image works on edge runtimes (Vercel Edge, Netlify Edge, Cloudflare Workers) when using Satori or Takumi renderers. Browser renderer requires a Node.js runtime or Cloudflare Browser Rendering.

### Testing OG images

Use **Nuxt DevTools** to preview and test your OG images with hot module reload. The OG Image Playground lets you see how images look before deploying.

You can also use the [Social Share Debugger](https://nuxtseo.com/tools/social-share-debugger) to preview how your links appear on different platforms.

## Summary

- **OG Image** is an **optional** feature that can be added by installing **nuxt-og-image**.
- It generates `og:image` meta tags and serves images using Vue templates (Satori, Takumi, or Browser renderer).
- **Custom templates** – Create Vue components for branded OG images that match your storefront design.
- **Automatic screenshots** – Optionally generate OG images by screenshotting your pages.
- **Laioutr integration** – Use page variant SEO data and Orchestr query results to generate dynamic OG images per page.
- **Testing** – Preview OG images in Nuxt DevTools before deploying.

For detailed configuration options, renderer choices, and advanced usage, see the [Nuxt OG Image documentation](https://nuxtseo.com/docs/og-image/getting-started/introduction).
