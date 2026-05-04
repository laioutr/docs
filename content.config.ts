import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '**/*.md',
      }),
    ),
  },
})
