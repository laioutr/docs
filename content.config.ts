import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { schema as sitemapSchema } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        sitemap: sitemapSchema.shape.sitemap,
      }),
    }),
  },
})
