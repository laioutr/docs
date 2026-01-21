<script setup lang="ts">
import type { JSONSchema } from '@laioutr-core/core-types/common';
import { nullOrEmpty } from '../lib/json-schema/nullOrEmpty';
import { ProseCode, UIcon } from '#components';

const props = defineProps<{
  schema: JSONSchema;
}>();

const getFieldType = (field: JSONSchema): string | undefined => {
  if (field.$ref) {
    return field.$ref.replace(/^#\/definitions\//, '');
  }

  if (field.type === 'string' && field.enum) {
    return `"${field.enum.join('" | "')}"`;
  }

  if (field.allOf?.length) {
    return field.allOf.map((val) => getFieldType(val)).join(' & ');
  }

  if (field.anyOf?.length) {
    return field.anyOf.map((val) => getFieldType(val)).join(' | ');
  }

  if (field.type === 'array' && typeof field.items === 'object' && !Array.isArray(field.items)) {
    return `${getFieldType(field.items)}[]`;
  }

  return field.type;
};
</script>

<template>
  <template v-if="nullOrEmpty(schema)">
    <UIcon name="lucide:minus" class="text-gray-400" />
  </template>
  <template v-else>
    <ProseFieldGroup v-if="schema.type === 'object'">
      <template v-for="(field, fieldName) in schema.properties" :key="fieldName">
        <ProseField
          v-if="typeof field === 'object'"
          :name="fieldName"
          :type="getFieldType(field)"
          :required="schema.required?.includes(fieldName)"
        >
          {{ field.description }}
        </ProseField>
      </template>
    </ProseFieldGroup>

    <template v-else-if="schema.type === 'array'">
      <ProseCode>array</ProseCode>
      <template v-if="typeof schema.items === 'object' && !Array.isArray(schema.items)">
        <JsonSchemaFields :schema="schema.items" />
      </template>
      <template v-else>
        {{ schema.items }}
      </template>
    </template>

    <ProseCode v-else-if="schema.type === 'string'">{{ schema.type }}</ProseCode>
    <ProseCode v-else-if="schema.type === 'number'">{{ schema.type }}</ProseCode>
    <ProseCode v-else-if="schema.type === 'boolean'">{{ schema.type }}</ProseCode>
    <ProseCode v-else-if="schema.type === 'integer'">{{ schema.type }}</ProseCode>
    <ProseCode v-else-if="schema.type === 'null'">{{ schema.type }}</ProseCode>
  </template>
</template>
