<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';

import { useDidYouMean } from '../composables/useDidYouMean';
import { entityPagePath } from '../lib/entityPagePath';

const props = defineProps<{
  name: string;
}>();

const query = computed(() => reflected.queries.find((query) => query.name === props.name));

const exportName = computed(() => tokenToExportName(props.name, 'Query'));
const importLine = computed(() => importSnippet(exportName.value, actionImportPackage(props.name)));

const didYouMeanThing = useDidYouMean(
  props.name,
  'query',
  query,
  computed(() => reflected.queries.map((query) => query.name))
);
</script>

<template>
  <MetaCard v-if="query" :title="exportName" :token="query.name" :import-line="importLine">
    <template #after-header>
      <div class="query-meta__pills">
        <NuxtLink :to="entityPagePath(query.entity)" class="query-meta__pill query-meta__pill--entity">
          <UIcon name="lucide:box" class="size-3 shrink-0" />
          <span class="query-meta__pill-text">{{ query.entity }}</span>
          <UIcon name="lucide:arrow-right" class="query-meta__pill-arrow size-3 shrink-0" />
        </NuxtLink>
        <span class="query-meta__pill query-meta__pill--type">
          <UIcon :name="query.type === 'single' ? 'lucide:locate' : 'lucide:rows-3'" class="size-3 shrink-0" />
          {{ query.type }}
        </span>
      </div>
    </template>

    <template v-if="$slots.default || query.label || query.description" #description>
      <MDCSlot v-if="$slots.default" unwrap="p" />
      <template v-else>{{ query.description || query.label }}</template>
    </template>

    <template #sections>
      <MetaCardSection label="Input">
        <JsonSchemaFields :schema="query.input" />
      </MetaCardSection>
    </template>
  </MetaCard>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No query metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode>?
    </template>
  </ProseCallout>
</template>

<style scoped>
/* ---- Pills (QueryMeta-specific) ---- */
.query-meta__pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
}

.query-meta__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  text-decoration: none;
}

.query-meta__pill--entity {
  background: var(--color-purple-100);
  color: var(--color-purple-700);
  transition:
    background 0.15s,
    gap 0.15s;
}

.query-meta__pill-text {
  text-decoration: underline;
  text-decoration-color: color-mix(in oklch, currentColor 35%, transparent);
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
}

.query-meta__pill-arrow {
  opacity: 0.5;
  transition:
    opacity 0.15s,
    translate 0.15s;
}

.query-meta__pill--entity:hover {
  background: var(--color-purple-200);
}

.query-meta__pill--entity:hover .query-meta__pill-arrow {
  opacity: 1;
  translate: 2px 0;
}

:root.dark .query-meta__pill--entity {
  background: color-mix(in oklch, var(--color-purple-500) 20%, transparent);
  color: var(--color-purple-300);
}

:root.dark .query-meta__pill--entity:hover {
  background: color-mix(in oklch, var(--color-purple-500) 30%, transparent);
}

.query-meta__pill--type {
  background: var(--color-gray-200);
  color: var(--color-gray-600);
}

:root.dark .query-meta__pill--type {
  background: var(--color-gray-800);
  color: var(--color-gray-400);
}
</style>
