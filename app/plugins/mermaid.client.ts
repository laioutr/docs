import mermaid from 'mermaid';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('mermaid', () => mermaid);
  nuxtApp.hook('app:beforeMount', () => {
    mermaid.initialize({ startOnLoad: false });
  });
});
