// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    'nuxt-gtag',
  ],
  // ssr: false,
  ssr: true,
  devtools: { enabled: false },

  app: {
    head: {
      title: 'deuk9-blog',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  site: {
    url: 'https://deuk9.github.io/',
    name: 'deuk9 의 개발 블로그',
    trailingSlash: false,
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
          // theme: 'github-light',
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'java', 'kotlin', 'go'],
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      author: 'deuk9',
      comment: 'deuk9 의 공유 공간',
      github: 'https://github.com/deuk9/',
      trailingSlash: false,
    },
  },
  // ui: {
  //   primary: 'blue',
  //   gray: 'cool',
  // },
  alias: {
    '@': resolve(__dirname, '/'),
  },
  compatibilityDate: '2025-01-30',

  nitro: {
    static: true,
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt'],
      // 에러가 발생하는 경로들은 일단 제외하고 크롤링으로만 처리
    },
  },

  eslint: {
    config: {
      stylistic: true, // <---
    },
  },

  fonts: {
    defaults: {
      weights: [400, 700], // 공통 기본 두께
      styles: ['normal', 'italic'], // 공통 스타일
    },
    families: [
      { name: 'Noto Sans KR', provider: 'google' },
      { name: 'Roboto', provider: 'google' },
    ],
    display: 'swap',
  },

  gtag: {
    id: 'G-RG0D48N5J0',
    config: {},
  },

  sitemap: {},

  // icon: {
  // clientBundle: {
  //   // list of icons to include in the client bundle
  //   // scan all components in the project and include icons
  //   // scan: true,
  //   scan: {
  //     // note that when you specify those values, the default behavior will be overridden
  //     globInclude: ['components/**/*.vue', 'pages/**/*.vue'],
  //     globExclude: ['node_modules', 'dist'],
  //   },
  // },
  // },
  // target: 'static',
})
