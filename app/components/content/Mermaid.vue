<script setup lang="ts">
import type { Mermaid } from 'mermaid';

const show = ref(false);

const $mermaid = useNuxtApp().$mermaid as () => Mermaid;

const mermaidRef = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  show.value = true;
  await nextTick();
  $mermaid().run({ nodes: mermaidRef.value ? [mermaidRef.value] : [] });
});
</script>

<template>
  <div v-if="show" ref="mermaidRef" class="mermaid">
    <slot></slot>
  </div>
</template>
