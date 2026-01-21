<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';
import { tokenToExportName } from '../lib/tokens/tokenToExportName';
import { ProseBadge, ProseCode, ProseH3, ProseH4, ProseP } from '#components';

const props = defineProps<{
  name: string;
}>();

const query = computed(() => reflected.queries.find((query) => query.name === props.name));

const { data: didYouMeanThing } = await useAsyncData(`didYouMean-query-${props.name}`, async () => {
  if (query) {
    return null;
  }
  const didYouMean = await import('didyoumean2').then((m) => m.default);
  const similar = didYouMean(
    props.name,
    reflected.queries.map((query) => query.name)
  );
  return similar;
});
</script>

<template>
  <div v-if="query">
    <ProseH3>
      {{ tokenToExportName(props.name, 'Query') }}
      <ProseCode>{{ query.name }}</ProseCode>
      <ProseBadge>{{ query.entity }}</ProseBadge>
      <ProseBadge>{{ query.type }}</ProseBadge>
    </ProseH3>

    <ProseP>{{ query.label }}</ProseP>
    <ProseP>{{ query.description }}</ProseP>

    <ProseH4>Input</ProseH4>
    <JsonSchemaFields :schema="query.input" />
  </div>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No action metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode
      >?</template
    >
  </ProseCallout>
</template>
