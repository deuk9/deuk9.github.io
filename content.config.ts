import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    contents: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        tags: z.string().array(),
        date: z.string(),
        excerpt: z.string(),
      }),
    }),
    sitemap: defineCollection(
      // adds the robots frontmatter key to the collection
      asSitemapCollection({
        type: 'page',
        source: 'blog/**/*.md',
      }),
    ),
  },
})
