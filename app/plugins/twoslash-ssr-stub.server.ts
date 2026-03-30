// floating-vue's VMenu is registered by nuxt-content-twoslash as a client-only
// plugin. During SSR Vue warns "Failed to resolve component: VMenu". Register a
// stub that renders its default slot inside a <span> so the warning is suppressed.
import { defineNuxtPlugin } from '#app';
import { defineComponent, h, useSlots } from 'vue';

const VMenuStub = defineComponent({
  name: 'VMenu',
  inheritAttrs: true,
  setup(_, { attrs }) {
    const slots = useSlots();
    return () => h('span', attrs, slots.default?.());
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VMenu', VMenuStub);
});
