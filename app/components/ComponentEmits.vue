<script setup lang="ts">
import type { ComponentData } from 'nuxt-component-meta';
import { componentEventsToJsonSchema } from '../lib/json-schema/component-meta-adapter';

const props = defineProps<{
  component: ComponentData;
}>();

const events = computed(() => props.component?.meta?.events ?? []);
const schema = computed(() => componentEventsToJsonSchema(events.value));
</script>

<template>
  <JsonSchemaPropTable
    v-if="events.length"
    :schema="schema"
    name-label="Event"
  />
</template>
