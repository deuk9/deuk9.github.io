import { defineCollection, defineContentConfig, z } from '@nuxt/content'

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
  },
})
