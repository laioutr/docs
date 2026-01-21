import mermaid from 'mermaid';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('mermaid', () => mermaid);
  nuxtApp.hook('app:beforeMount', () => {
    const colorMode = useColorMode();
    mermaid.initialize({ startOnLoad: false, theme: colorMode.value === 'dark' ? 'dark' : 'default' });

    watch(
      () => colorMode.value,
      (mode) => {
        mermaid.initialize({ startOnLoad: false, theme: mode === 'dark' ? 'dark' : 'default' });
      }
    );
  });
});
