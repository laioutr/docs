<script setup lang="ts">
import type { ExpandableVariant } from '../lib/json-schema/introspection';
import { UCollapsible } from '#components';

const props = defineProps<{
  variants: ExpandableVariant[];
  array?: boolean;
}>();
</script>

<template>
  <p class="text-muted mt-2 text-xs">{{ props.array ? 'Accepts an array of the following:' : 'Accepts one of the following:' }}</p>
  <ProseFieldGroup class="border-default !my-0 border-l-2 border-dashed pl-4">
    <UCollapsible v-for="(variant, i) in variants" :key="i" class="my-5">
      <template #default="{ open }">
        <JsonSchemaFieldRow :name="variant.label" :type="open ? (variant.openPlaceholder ?? '{ }') : variant.summary" expandable :open="open" />
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
  </ProseFieldGroup>
</template>
