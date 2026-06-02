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
            changelogKeys: z.array(z.string()).optional(),
          })
          .passthrough(),
      }),
    ),
    // Per-API changelog entries, keyed by API identifier (component / composable /
    // helper / action name). A single YAML file whose top-level keys spread onto
    // one data document — see shared/changelog.ts for the entry shape.
    changelog: defineCollection({
      type: 'data',
      source: 'changelog.yml',
      schema: z.object({}).passthrough(),
    }),
  },
})
