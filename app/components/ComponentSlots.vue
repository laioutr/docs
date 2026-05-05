<script setup lang="ts">
import type { ComponentData } from 'nuxt-component-meta';
import { componentSlotsToJsonSchema } from '../lib/json-schema/component-meta-adapter';

const props = defineProps<{
  component: ComponentData;
}>();

const slots = computed(() => props.component?.meta?.slots ?? []);
const schema = computed(() => componentSlotsToJsonSchema(slots.value));
</script>

<template>
  <JsonSchemaPropTable
    v-if="slots.length"
    :schema="schema"
    name-label="Slot"
  />
</template>
