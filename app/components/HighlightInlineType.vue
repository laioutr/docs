<script setup lang="ts">
import { hash } from 'ohash';

const props = defineProps<{
  type: string;
}>();

const type = computed(() => {
  let type = props.type;
  if (type.includes(', "as" | "asChild" | "forceMount">')) {
    type = type.replace(`, "as" | "asChild" | "forceMount">`, ``).replace('Omit<', '');
  }
  if (type.includes(', "as" | "asChild">')) {
    type = type.replace(', "as" | "asChild">', '').replace('Omit<', '');
  }
  if (type.startsWith('undefined |')) {
    type = type.replace('undefined |', '');
  }
  if (type.endsWith('| undefined')) {
    type = type.replace('| undefined', '');
  }

  return type;
});

const cacheKey = computed(() => hash(type.value).slice(0, 10));
const value = computed(() => `\`${type.value}\`{lang="ts-type"}`);
</script>

<template>
  <MDC :cache-key="cacheKey" :value="value" />
</template>
