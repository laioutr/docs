<script setup lang="ts">
import type { ComponentData } from 'nuxt-component-meta';
import { componentPropsToJsonSchema } from '../lib/json-schema/component-meta-adapter';

const props = withDefaults(
  defineProps<{
    component: ComponentData;
    ignore?: string[];
  }>(),
  {
    ignore: () => [
      'activeClass',
      'inactiveClass',
      'exactActiveClass',
      'ariaCurrentValue',
      'rel',
      'noRel',
      'prefetch',
      'prefetchOn',
      'noPrefetch',
      'prefetchedClass',
      'replace',
      'exact',
      'exactQuery',
      'exactHash',
      'external',
      'onClick',
      'viewTransition',
    ],
  },
);

const visibleProps = computed(() => {
  const all = props.component?.meta?.props ?? [];
  return all.filter((p) => !props.ignore.includes(p.name));
});

const orderedProps = computed(() => {
  // Keep current ordering: `as` first, `ui` last, otherwise stable.
  return [...visibleProps.value].sort((a, b) => {
    if (a.name === 'as') return -1;
    if (b.name === 'as') return 1;
    if (a.name === 'ui') return 1;
    if (b.name === 'ui') return -1;
    return 0;
  });
});

const schema = computed(() => componentPropsToJsonSchema(orderedProps.value));
</script>

<template>
  <JsonSchemaPropTable
    v-if="orderedProps.length"
    :schema="schema"
    show-default
    name-label="Prop"
  />
</template>
