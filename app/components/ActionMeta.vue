<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';

import { useDidYouMean } from '../composables/useDidYouMean';

const props = defineProps<{
  name: string;
}>();

const action = computed(() => reflected.actions.find((action) => action.name === props.name));

const exportName = computed(() => tokenToExportName(props.name, 'Action'));
const importLine = computed(() => importSnippet(exportName.value, actionImportPackage(props.name)));

const didYouMeanThing = useDidYouMean(
  props.name,
  'action',
  action,
  computed(() => reflected.actions.map((action) => action.name))
);
</script>

<template>
  <MetaCard v-if="action" :title="exportName" :token="action.name" :import-line="importLine">
    <template v-if="$slots.default" #description>
      <MDCSlot unwrap="p" />
    </template>
    <template #sections>
      <MetaCardSection label="Input">
        <JsonSchemaFields :schema="action.input" />
      </MetaCardSection>
      <MetaCardSection label="Output">
        <JsonSchemaFields :schema="action.output" />
      </MetaCardSection>
    </template>
  </MetaCard>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No action metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode>?
    </template>
  </ProseCallout>
</template>
