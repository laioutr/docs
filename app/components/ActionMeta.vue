<script lang="ts" setup>
import JsonSchemaFields from './JsonSchemaFields.vue';
import reflected from '@laioutr-core/canonical-types/reflection';

import { useDidYouMean } from '../composables/useDidYouMean';
import { canonicalErrors } from '#shared/utils/canonical-errors';
import { UCollapsible, UIcon } from '#components';

const props = defineProps<{
  name: string;
}>();

const action = computed(() => reflected.actions.find((action) => action.name === props.name));

const exportName = computed(() => tokenToExportName(props.name, 'Action'));
const importLine = computed(() => importSnippet(exportName.value, actionImportPackage(props.name)));

const actionErrors = computed(() =>
  canonicalErrors
    .filter((e) => e.thrownBy.includes(props.name))
    .map((e) => ({
      className: e.className,
      code: e.code,
      domain: e.domain,
    }))
);

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
      <MetaCardSection v-if="actionErrors.length" label="Throwables">
        <div class="action-meta__errors">
          <NuxtLink
            v-for="err in actionErrors"
            :key="err.code"
            :to="`/frontend/api-reference/${err.domain}/errors#${err.code.toLowerCase()}`"
            class="action-meta__error-link"
          >
            <UIcon name="lucide:alert-triangle" class="size-3 shrink-0" />
            <span class="action-meta__error-text">{{ err.className }}</span>
            <UIcon name="lucide:arrow-right" class="action-meta__error-arrow size-3 shrink-0" />
          </NuxtLink>
        </div>
      </MetaCardSection>
      <div class="meta-card-section">
        <UCollapsible>
          <template #default="{ open }">
            <button type="button" class="usage-trigger" :class="{ 'usage-trigger--open': open }">
              <UIcon name="lucide:chevron-right" class="usage-trigger__chevron" />
              <span>Usage examples</span>
            </button>
          </template>
          <template #content>
            <ActionUsageExamples
              :token="action.name"
              :export-name="exportName"
              :import-package="actionImportPackage(action.name)"
              :input-schema="action.input"
              :output-schema="action.output"
            />
          </template>
        </UCollapsible>
      </div>
    </template>
  </MetaCard>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No action metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode
      >?
    </template>
  </ProseCallout>
</template>

<style scoped>
.meta-card-section {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-gray-200);
}

:root.dark .meta-card-section {
  border-top-color: var(--color-gray-800);
}

.usage-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
  transition: color 0.15s;
}

.usage-trigger:hover {
  color: var(--color-gray-600);
}

:root.dark .usage-trigger {
  color: var(--color-gray-500);
}

:root.dark .usage-trigger:hover {
  color: var(--color-gray-300);
}

.usage-trigger__chevron {
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.15s;
}

.usage-trigger--open .usage-trigger__chevron {
  transform: rotate(90deg);
}

/* ---- Errors ---- */
.action-meta__errors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.action-meta__error-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  text-decoration: none;
  background: var(--color-red-100);
  color: var(--color-red-700);
  transition: background 0.15s;
}

.action-meta__error-text {
  text-decoration: underline;
  text-decoration-color: color-mix(in oklch, currentColor 35%, transparent);
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
}

.action-meta__error-arrow {
  opacity: 0.5;
  transition:
    opacity 0.15s,
    translate 0.15s;
}

.action-meta__error-link:hover {
  background: var(--color-red-200);
}

.action-meta__error-link:hover .action-meta__error-arrow {
  opacity: 1;
  translate: 2px 0;
}

:root.dark .action-meta__error-link {
  background: color-mix(in oklch, var(--color-red-500) 20%, transparent);
  color: var(--color-red-300);
}

:root.dark .action-meta__error-link:hover {
  background: color-mix(in oklch, var(--color-red-500) 30%, transparent);
}
</style>
