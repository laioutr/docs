<script setup lang="ts">
import { WELL_KNOWN_TYPES } from '../lib/well-known-types';

const props = defineProps<{
  type: string;
}>();

interface Token {
  text: string;
  href?: string;
}

const tokens = computed<Token[]>(() => {
  const parts = props.type.split(/(\b[A-Za-z_$][A-Za-z0-9_$]*\b)/);
  return parts
    .filter((p) => p.length > 0)
    .map((p) => {
      const href = WELL_KNOWN_TYPES[p];
      return href ? { text: p, href } : { text: p };
    });
});
</script>

<template>
  <template v-for="(t, i) in tokens" :key="i">
    <NuxtLink
      v-if="t.href"
      :to="t.href"
      class="underline decoration-dotted underline-offset-2 transition-colors hover:text-primary"
      @click.stop
    >
      {{ t.text }}
    </NuxtLink>
    <template v-else>{{ t.text }}</template>
  </template>
</template>
