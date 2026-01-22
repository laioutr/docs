<script setup lang="ts">
import ComponentProps from './ComponentProps.vue';
import componentMeta, { type NuxtComponentMetaNames } from '@laioutr-core/ui-component-meta';
import type { ComponentData } from 'nuxt-component-meta';
import { useDidYouMean } from '../composables/useDidYouMean';

const props = defineProps<{
  name: string;
}>();

const component = componentMeta[props.name as NuxtComponentMetaNames] as ComponentData | undefined;

const didYouMeanThing = useDidYouMean(
  props.name,
  '',
  computed(() => !!component),
  Object.keys(componentMeta)
);
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
