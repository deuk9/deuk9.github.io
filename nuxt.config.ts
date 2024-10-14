// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/ui'],
  eslint: {
    config: {
      stylistic: true, // <---
    },
  },
  alias: {
    '@': resolve(__dirname, '/'),
  },
  content: {
    highlight: {
      // Theme used in all color schemes.
      theme: 'material-theme-lighter',
      // theme: 'snazzy-light',
      langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'java', 'kotlin', 'go'],
      // OR
      // theme: {
      //   // Default theme (same as single string)
      //   default: 'github-light',
      //   // Theme used if `html.dark`
      //   dark: 'github-dark',
      //   // Theme used if `html.sepia`
      //   sepia: 'monokai'
      // }
    },
    markdown: {
      // Object syntax can be used to override default options
      // remarkPlugins: {
      //   // Override remark-emoji options
      //   'remark-emoji': {
      //     emoticon: true
      //   },
      //   // Disable remark-gfm
      //   'remark-gfm': false,
      //   // Add remark-oembed
      //   'remark-oembed': {
      //     // Options
      //   }
      // },
    },
  },
  ui: {
    primary: 'green',
    gray: 'cool',
  },

})
