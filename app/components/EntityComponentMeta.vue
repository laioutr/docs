<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';

const props = defineProps<{
  entity: string;
  component: string;
}>();

const componentData = computed(() =>
  reflected.components.find((component) => component.entityType === props.entity && component.name === props.component)
);

const exportName = computed(() => entityComponentExportName(props.entity, props.component));
const importLine = computed(() => importSnippet(exportName.value, entityComponentImportPath(props.entity)));
</script>

<template>
  <MetaCard v-if="componentData" :title="exportName" :token="component" :import-line="importLine">
    <template v-if="$slots.default" #description>
      <MDCSlot unwrap="p" />
    </template>
    <template #sections>
      <MetaCardSection label="Schema">
        <JsonSchemaFields :schema="componentData.schema" />
      </MetaCardSection>
    </template>
  </MetaCard>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No component metadata found for {{ props.entity }} {{ props.component }}.
  </ProseCallout>
</template>
