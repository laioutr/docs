export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nuxt-studio', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],

  site: {
    name: 'Laioutr Docs',
  },

  llms: {
    domain: 'https://docs.laioutr.io',
    title: 'Laioutr Docs',
  },

  ogImage: {
    defaults: {
      component: 'Laioutr',
    },
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'laioutr',
      repo: 'docs',
      branch: 'main',
    },
    auth: {
      github: {
        clientId: process.env.DOCS_GITHUB_CLIENT_ID,
        clientSecret: process.env.DOCS_GITHUB_CLIENT_SECRET,
      },
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          // Force enable syntax-highlighting for HighlightInlineType component.
          // See https://github.com/nuxt-content/mdc/issues/449
          noApiRoute: false,
        } as any,
      },
    },
  },

  nitro: {
    // Exclude component-meta.mjs from server build
    // These files contain JSON-like data with JS code strings that Rollup can't parse
    rollupConfig: {
      external: ['@laioutr-core/ui-component-meta'],
    },
  },
});
