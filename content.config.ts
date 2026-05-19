import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '**/*.md',
        schema: z.object({
          aliases: z.array(z.string()).optional(),
        }),
      }),
    ),
  },
})
