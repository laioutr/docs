import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '**/*.md',
        schema: z
          .object({
            aliases: z.array(z.string()).optional(),
            links: z
              .array(
                z.object({
                  label: z.string(),
                  to: z.string(),
                  icon: z.string().optional(),
                  target: z.string().optional(),
                  color: z.string().optional(),
                  variant: z.string().optional(),
                }).passthrough()
              )
              .optional(),
            playground: z
              .object({
                name: z.string(),
                base: z.string(),
                defaultStory: z.string(),
                height: z.string().optional(),
              })
              .optional(),
          })
          .passthrough(),
      }),
    ),
  },
})
