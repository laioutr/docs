<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';

import { useDidYouMean } from '../composables/useDidYouMean';
import { tokenToExportName } from '../lib/tokens/tokenToExportName';
import { ProseCode, ProseH3, ProseH4 } from '#components';

const props = defineProps<{
  name: string;
}>();

const action = computed(() => reflected.actions.find((action) => action.name === props.name));

const didYouMeanThing = useDidYouMean(
  props.name,
  'action',
  action,
  computed(() => reflected.actions.map((action) => action.name))
);
</script>

<template>
  <div v-if="action">
    <ProseH3>
      {{ tokenToExportName(props.name, 'Action') }}
      <ProseCode>{{ action.name }}</ProseCode>
    </ProseH3>

    <ProseH4>Input</ProseH4>
    <JsonSchemaFields :schema="action.input" />

    <ProseH4>Output</ProseH4>
    <JsonSchemaFields :schema="action.output" />
  </div>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No action metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode
      >?</template
    >
  </ProseCallout>
</template>
