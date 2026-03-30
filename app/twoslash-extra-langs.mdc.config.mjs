import { defineConfig } from '@nuxtjs/mdc/config';

export default defineConfig({
  shiki: {
    async setup(shiki) {
      await shiki.loadLanguage(import('shiki/langs/tsx.mjs'));
    },
  },
});
