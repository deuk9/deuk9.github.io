import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      // schema: z.object({
      //   title: z.string(),
      // }),
    }),
    paths: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        id: z.string(),
        path: z.string(),
        tags: z.string().array(),
      }),
    }),
  },
})
