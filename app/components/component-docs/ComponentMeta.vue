<script setup lang="ts">
import ComponentProps from './ComponentProps.vue';
import componentMeta, { type NuxtComponentMetaNames } from '@laioutr-core/ui-component-meta';
import type { ComponentData } from 'nuxt-component-meta';

const props = defineProps<{
  name: string;
}>();

const component = componentMeta[props.name as NuxtComponentMetaNames] as ComponentData | undefined;

const { data: didYouMeanThing } = await useAsyncData(`didYouMean-${props.name}`, async () => {
  if (component) {
    return null;
  }
  const didYouMean = await import('didyoumean2').then((m) => m.default);
  const similar = didYouMean(props.name, Object.keys(componentMeta));
  return similar;
});
</script>

<template>
  <div v-if="component">
    <ComponentProps :component="component" />
    <ComponentSlots :component="component" />
    <ComponentEmits :component="component" />
  </div>
  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No component metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode
      >?</template
    >
  </ProseCallout>
</template>
