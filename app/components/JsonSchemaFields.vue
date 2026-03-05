<script setup lang="ts">
import type { JSONSchema } from '@laioutr-core/core-types/common';
import type { SchemaMode } from '../lib/json-schema/introspection';
import {
  getConstraints,
  getExpandableVariants,
  getFieldDescriptionHtml,
  getTypeName,
  getTypeSummary,
  isFieldDescriptionFromObject,
} from '../lib/json-schema/introspection';
import { nullOrEmpty } from '../lib/json-schema/nullOrEmpty';
import { resolveSchema } from '../lib/json-schema/resolveSchema';
import { ProseCode, UCollapsible, UIcon } from '#components';

const SCHEMA_MODE_KEY = Symbol('schemaMode') as InjectionKey<SchemaMode>;

const props = defineProps<{
  schema: JSONSchema;
  /** Internal: skip dereferencing for recursive children. */
  dereferenced?: boolean;
  /** Display mode: 'json' shows JSON types, 'javascript' maps formats to JS types (e.g. Date). */
  mode?: SchemaMode;
}>();

const mode = props.mode ?? inject(SCHEMA_MODE_KEY, 'javascript');
provide(SCHEMA_MODE_KEY, mode);

/** Resolved once: deref + unwrap allOf. All helpers work on this. */
const schema = computed(() => resolveSchema(props.schema, { dereferenced: props.dereferenced }));

/** Pre-resolve all property fields so the template works with clean schemas. */
const resolvedProperties = computed(() => {
  if (schema.value.type !== 'object' || !schema.value.properties) return [];
  return Object.entries(schema.value.properties)
    .filter((entry): entry is [string, JSONSchema] => typeof entry[1] === 'object')
    .map(([name, field]) => ({ name, field: resolveSchema(field, { dereferenced: true }) }));
});
</script>

<template>
  <template v-if="nullOrEmpty(schema)">
    <UIcon name="lucide:minus" class="text-gray-400" />
  </template>
  <template v-else>
    <!-- Object with properties -->
    <ProseFieldGroup v-if="schema.type === 'object'" class="border-default !my-0 border-l-2 pl-4">
      <template v-for="{ name: fieldName, field } in resolvedProperties" :key="fieldName">
        <!-- Expandable field -->
        <UCollapsible v-if="getExpandableVariants(field)" class="my-5">
          <template #default="{ open }">
            <div>
              <JsonSchemaFieldRow
                :name="fieldName"
                :type="getTypeSummary(field, { expanded: open, mode })"
                :required="schema.required?.includes(fieldName)"
                :deprecated="field.deprecated"
                expandable
                :open="open"
              />
              <!-- Property-level description: always visible -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p
                v-if="getFieldDescriptionHtml(field) && !isFieldDescriptionFromObject(field)"
                class="text-muted mt-1 text-sm"
                v-html="getFieldDescriptionHtml(field)"
              />
              <div v-if="getConstraints(field, mode).length" class="mt-1.5 flex flex-wrap gap-1">
                <span
                  v-for="c in getConstraints(field, mode)"
                  :key="c.label"
                  class="border-default text-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-tight"
                >
                  <span :class="c.value ? 'opacity-60' : ''">{{ c.label }}</span>
                  <span v-if="c.value">{{ c.value }}</span>
                </span>
              </div>
            </div>
          </template>
          <template #content>
            <div class="pl-6">
              <!-- Single variant: expand directly -->
              <template v-if="getExpandableVariants(field)!.length === 1">
                <!-- Object-level description: only when expanded -->
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p
                  v-if="getFieldDescriptionHtml(field) && isFieldDescriptionFromObject(field)"
                  class="text-muted mt-2 text-sm"
                  v-html="getFieldDescriptionHtml(field)"
                />
                <div class="mt-2">
                  <JsonSchemaFields :schema="getExpandableVariants(field)![0]!.schema" dereferenced />
                </div>
              </template>

              <!-- Multiple variants -->
              <JsonSchemaVariantList v-else :variants="getExpandableVariants(field)!" />
            </div>
          </template>
        </UCollapsible>

        <!-- Simple field -->
        <div v-else class="my-5">
          <JsonSchemaFieldRow :name="fieldName" :type="getTypeSummary(field, { mode })" :required="schema.required?.includes(fieldName)" :deprecated="field.deprecated" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-if="getFieldDescriptionHtml(field)" class="text-muted mt-1 text-sm" v-html="getFieldDescriptionHtml(field)" />
          <div v-if="getConstraints(field, mode).length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="c in getConstraints(field, mode)"
              :key="c.label"
              class="border-default text-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-tight"
            >
              <span class="opacity-60">{{ c.label }}</span>
              <span>{{ c.value }}</span>
            </span>
          </div>
        </div>
      </template>
    </ProseFieldGroup>

    <!-- Root-level array: chip legend on the border -->
    <template v-else-if="schema.type === 'array'">
      <div>
        <span class="bg-primary/10 text-primary dark:bg-primary/15 mb-2 inline-block rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium">
          array
        </span>
        <div v-if="getConstraints(schema, mode).length" class="mb-2 flex flex-wrap gap-1">
          <span
            v-for="c in getConstraints(schema, mode)"
            :key="c.label"
            class="border-default text-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-tight"
          >
            <span :class="c.value ? 'opacity-60' : ''">{{ c.label }}</span>
            <span v-if="c.value">{{ c.value }}</span>
          </span>
        </div>
        <template v-if="getExpandableVariants(schema)?.length === 1">
          <JsonSchemaFields :schema="getExpandableVariants(schema)![0]!.schema" dereferenced />
        </template>
        <JsonSchemaVariantList v-else-if="getExpandableVariants(schema)" :variants="getExpandableVariants(schema)!" />
        <template v-else-if="typeof schema.items === 'object' && !Array.isArray(schema.items)">
          <JsonSchemaFields :schema="schema.items" dereferenced />
        </template>
      </div>
    </template>

    <!-- Root-level single expandable variant (non-array): render its properties directly -->
    <template v-else-if="getExpandableVariants(schema)?.length === 1">
      <JsonSchemaFields :schema="getExpandableVariants(schema)![0]!.schema" dereferenced />
    </template>

    <!-- Root-level union with multiple expandable variants (non-array) -->
    <JsonSchemaVariantList v-else-if="getExpandableVariants(schema)" :variants="getExpandableVariants(schema)!" />

    <!-- Primitive type -->
    <div v-else>
      <ProseCode>{{ getTypeName(schema, mode) }}</ProseCode>
      <div v-if="getConstraints(schema, mode).length" class="mt-1.5 flex flex-wrap gap-1">
        <span
          v-for="c in getConstraints(schema, mode)"
          :key="c.label"
          class="border-default text-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-tight"
        >
          <span :class="c.value ? 'opacity-60' : ''">{{ c.label }}</span>
          <span v-if="c.value">{{ c.value }}</span>
        </span>
      </div>
    </div>
  </template>
</template>
