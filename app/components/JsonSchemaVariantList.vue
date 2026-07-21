<script setup lang="ts">
import type { ExpandableVariant } from '../lib/json-schema/introspection';
import { UCollapsible } from '#components';

const props = defineProps<{
  variants: ExpandableVariant[];
  array?: boolean;
  /** HTML description shown above the "Accepts one of …" line — typically the parent union's own description. */
  descriptionHtml?: string;
}>();
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <p v-if="props.descriptionHtml" class="text-muted mt-2 text-sm" v-html="props.descriptionHtml" />
  <p class="text-muted mt-2 text-xs">{{ props.array ? 'Accepts an array of the following:' : 'Accepts one of the following:' }}</p>
  <ProseFieldGroup class="border-default !my-0 border-l-2 border-dashed pl-4">
    <template v-for="(variant, i) in variants" :key="i">
      <UCollapsible v-if="variant.expandable" class="my-5">
        <template #default="{ open }">
          <JsonSchemaFieldRow
            :name="variant.label"
            :type="open ? (variant.openPlaceholder ?? '{ }') : variant.summary"
            expandable
            :open="open"
          />
        </template>
        <template #content>
          <div class="pl-6">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-if="variant.descriptionHtml" class="text-muted mt-2 text-sm" v-html="variant.descriptionHtml" />
            <div class="mt-2">
              <JsonSchemaFields :schema="variant.schema" dereferenced />
            </div>
          </div>
        </template>
      </UCollapsible>
      <div v-else class="my-5">
        <span class="bg-elevated text-toned rounded-sm px-1.5 py-0.5 font-mono text-xs">
          <LinkedTypeName :type="variant.label" />
        </span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="variant.descriptionHtml" class="text-muted mt-2 text-sm" v-html="variant.descriptionHtml" />
      </div>
    </template>
  </ProseFieldGroup>
</template>
