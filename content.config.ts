import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'

export default defineContentConfig({
  collections: {
    contents: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        tags: z.array(z.string()),
        date: z.string(),
      }),
    }),
    sitemap: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'blog/**/*.md',
      }),
    ),
    robots: defineCollection(
      asRobotsCollection({
        type: 'page',
        source: 'blog/**/*.md',
      }),
    ),
  },
})
