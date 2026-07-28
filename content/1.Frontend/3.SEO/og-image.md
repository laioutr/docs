---
title: OG Image
description: Generate social media preview images (og:image) for your Laioutr frontend using Vue templates. Create dynamic, branded preview images that appear when links are shared on social platforms.
seo:
  title: OG Image
  description: Generate social media preview images (og:image) for your Laioutr frontend using Vue templates. Create dynamic, branded…
sitemap:
  loc: /frontend/seo/og-image
  lastmod: 2026-07-28
  changefreq: monthly
  priority: 1.0

---

## Overview

OG Image (Open Graph Image) is the preview image shown when a link is shared on social media or messaging apps. Having a well-designed OG image improves how your links appear when shared on Twitter/X, Facebook, LinkedIn, Slack, and other platforms.

Laioutr projects can use **Nuxt OG Image** to generate these images from Vue templates. It is not bundled with frontend-core and must be installed separately.

## Installation

```bash
npx nuxi module add nuxt-og-image
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

## Example: OG Image from Section Data

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

## Further Reading

For custom templates, renderer options (Satori, Chromium), DevTools integration, and advanced configuration, see the [Nuxt OG Image documentation](https://nuxtseo.com/og-image).
