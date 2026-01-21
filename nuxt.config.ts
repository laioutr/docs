export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nuxt-studio', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],

  site: {
    name: 'Laioutr Docs',
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

  nitro: {
    // Exclude component-meta.mjs from server build
    // These files contain JSON-like data with JS code strings that Rollup can't parse
    rollupConfig: {
      external: ['@laioutr-core/ui-component-meta'],
    },
  },
});
