// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],
  devtools: { enabled: false },
  app: {
    head: {
      title: 'deuk9-blog',
    },
  },
  site: {
    url: 'https://deuk9.github.io/',
    name: 'deuk9 의 개발 블로그',
  },
  content: {
    build: {
      markdown: {
        // Object syntax can be used to override default options
        remarkPlugins: {
          // Override remark-emoji options
          'remark-emoji': {
            emoticon: true,
          },
          'remark-gfm': true,
          // Add remark-oembed
          'remark-oembed': {
            // Options
          },
        },
        highlight: {
          // Theme used in all color schemes.
          // theme: 'material-theme-lighter',
          // theme: 'snazzy-light',
          theme: 'github-light',
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'java', 'kotlin', 'go'],
          // OR
          // theme: {
          //   // Default theme (same as single string)
          //   default: 'github-light',
          //   // Theme used if `html.dark`
          //   dark: 'github-dark',
          //   // Theme used if `html.sepia`…
          //   sepia: 'monokai'
          // }
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      author: 'deuk9',
      comment: '성장과 배움, 그리고 공유의 공간입니다.',
      github: 'https://deuk9.github.io/',
    },
  },
  // ui: {
  //   primary: 'blue',
  //   gray: 'cool',
  // },
  alias: {
    '@': resolve(__dirname, '/'),
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    preset: 'github-pages',
  },
  // ssr: false,

  eslint: {
    config: {
      stylistic: true, // <---
    },
  },
  target: 'static',
})
