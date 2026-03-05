<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';
import { ProseCode, ProseH4, ProseUl } from '#components';

const props = defineProps<{
  entity: string;
  component: string;
}>();

const componentData = computed(() =>
  reflected.components.find((component) => component.entityType === props.entity && component.name === props.component)
);
</script>

<template>
  <div v-if="componentData">
    <ProseUl>
      <ProseLi>
        Component Token: <ProseCode>{{ component }}</ProseCode>
      </ProseLi>
      <ProseLi>
        Token path: <ProseCode>{{ entity }}.{{ component }}</ProseCode>
      </ProseLi>
    </ProseUl>
    <ProseH4>Schema</ProseH4>
    <JsonSchemaFields :schema="componentData.schema" />
  </div>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No component metadata found for {{ props.entity }} {{ props.component }}.
  </ProseCallout>
</template>
