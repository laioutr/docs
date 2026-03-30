---
title: OG Image
description: Generate social media preview images (og:image) for your Laioutr frontend using Vue templates. Create dynamic, branded preview images that appear when links are shared on social platforms.
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

## Example: OG Image from Page Variant Data

Use `defineOgImage()` with SEO data from `usePageVariant()` to set per-page OG images:

```vue
<script setup lang="ts">
const pageVariant = usePageVariant();

defineOgImage({
  component: 'OgImageDefault',
  title: pageVariant.value.seo.title,
  description: pageVariant.value.seo.description,
});
</script>
```

You can create custom OG image templates as Vue components in `components/OgImage*.vue` and reference them by name in the `component` field.

## Further Reading

For custom templates, renderer options (Satori, Chromium), DevTools integration, and advanced configuration, see the [Nuxt OG Image documentation](https://nuxtseo.com/og-image).
