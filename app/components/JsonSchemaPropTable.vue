<script setup lang="ts">
import type { JSONSchema } from '@laioutr-core/core-types/common';
import {
  getExpandableVariants,
  getTypeSummary,
} from '../lib/json-schema/introspection';
import { resolveSchema } from '../lib/json-schema/resolveSchema';
import { UCollapsible, UIcon } from '#components';

const route = useRoute();

const props = withDefaults(
  defineProps<{
    schema: JSONSchema;
    /** Show a Default column. */
    showDefault?: boolean;
    /** Column label for the name column. Defaults to "Name". */
    nameLabel?: string;
    /** Column label for the type column. Defaults to "Type". */
    typeLabel?: string;
    /** Property names to omit from the table. */
    ignore?: string[];
  }>(),
  { showDefault: false, nameLabel: 'Name', typeLabel: 'Type', ignore: () => [] },
);

interface Row {
  name: string;
  field: JSONSchema;
  defaultValue: string | undefined;
  required: boolean;
  deprecated: boolean;
  description: string | undefined;
}

const formatDefault = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};

const rows = computed<Row[]>(() => {
  const root = resolveSchema(props.schema, { dereferenced: true });
  if (root.type !== 'object' || !root.properties) return [];
  return Object.entries(root.properties)
    .filter((entry): entry is [string, JSONSchema] => typeof entry[1] === 'object')
    .filter(([name]) => !props.ignore.includes(name))
    .map(([name, raw]) => {
      const field = resolveSchema(raw, { dereferenced: true });
      return {
        name,
        field,
        defaultValue: formatDefault(field.default),
        required: !!root.required?.includes(name),
        deprecated: !!field.deprecated,
        description: field.description,
      };
    });
});
</script>

<template>
  <ProseTable v-if="rows.length">
    <ProseThead>
      <ProseTr>
        <ProseTh>{{ nameLabel }}</ProseTh>
        <ProseTh v-if="showDefault">Default</ProseTh>
        <ProseTh>{{ typeLabel }}</ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="row in rows" :key="row.name">
        <ProseTd class="align-top">
          <ProseCode>{{ row.name }}</ProseCode>
          <span v-if="row.required" class="ml-1 inline-block rounded-sm bg-error/10 px-1 py-0.5 text-[10px] text-error">required</span>
          <span v-if="row.deprecated" class="ml-1 inline-block rounded-sm bg-warning/10 px-1 py-0.5 text-[10px] text-warning">deprecated</span>
        </ProseTd>
        <ProseTd v-if="showDefault" class="align-top">
          <ProseCode v-if="row.defaultValue && row.defaultValue !== 'undefined' && row.defaultValue !== 'void 0'">
            <LinkedTypeName :type="row.defaultValue" />
          </ProseCode>
          <UIcon v-else name="lucide:minus" class="text-gray-400" />
        </ProseTd>
        <ProseTd class="align-top">
          <UCollapsible v-if="getExpandableVariants(row.field)">
            <template #default="{ open }">
              <div class="group/typecell flex w-full cursor-pointer items-center gap-1.5">
                <UIcon
                  name="lucide:chevron-right"
                  class="size-3 shrink-0 text-muted transition-transform"
                  :class="{ 'rotate-90': open }"
                />
                <ProseCode>
                  <LinkedTypeName :type="getTypeSummary(row.field, { expanded: open, mode: 'javascript' })" />
                </ProseCode>
              </div>
            </template>
            <template #content>
              <div class="mt-2 pl-4">
                <JsonSchemaFields :schema="row.field" mode="javascript" dereferenced />
              </div>
            </template>
          </UCollapsible>
          <ProseCode v-else>
            <LinkedTypeName :type="getTypeSummary(row.field, { mode: 'javascript' })" />
          </ProseCode>
          <MDC
            v-if="row.description"
            :value="row.description"
            class="mt-1 text-toned"
            :cache-key="`${route.path}-${row.name}-description`"
          />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
