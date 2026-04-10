import { defineCollection, defineContentConfig } from '@nuxt/content'
import { schema as sitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

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
