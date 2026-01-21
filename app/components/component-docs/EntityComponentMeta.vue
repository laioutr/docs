<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import { ProseCode, ProseH3, ProseH4 } from '#components';
import reflected from '@laioutr-core/canonical-types/reflection';

const props = defineProps<{
  entity: string;
  component: string;
}>();

const component = computed(() =>
  reflected.components.find((component) => component.entityType === props.entity && component.name === props.component)
);
</script>

<template>
  <div v-if="component">
    <ProseH3>
      {{ component.entityType }} {{ component.name }}
      <ProseCode>{{ component.name }}</ProseCode>
    </ProseH3>

    <ProseH4>Schema</ProseH4>
    <JsonSchemaFields :schema="component.schema" />
  </div>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No component metadata found for {{ props.entity }} {{ props.component }}.
  </ProseCallout>
</template>
