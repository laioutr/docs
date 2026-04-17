<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt?: string;
}>();

const apiUrl = computed(() => {
  const base = props.src.replace(/\.excalidraw$/, '');
  return `/api/excalidraw${base}.svg`;
});

const { data: svgContent, error } = await useFetch<string>(apiUrl, {
  key: `excalidraw-${props.src}`,
  responseType: 'text',
});
</script>

<template>
  <figure class="excalidraw-diagram" role="img" :aria-label="alt">
    <div v-if="svgContent" v-html="svgContent" class="excalidraw-svg" />
    <div v-else-if="error" class="excalidraw-error">
      Failed to load diagram: {{ src }}
    </div>
  </figure>
</template>

<style scoped>
.excalidraw-diagram {
  margin: 1.5rem 0;
}
.excalidraw-svg :deep(svg) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
:global(.dark) .excalidraw-svg {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
