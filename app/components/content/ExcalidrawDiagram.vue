<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt?: string;
}>();

const name = props.src.split('/').pop()!.replace(/\.(excalidraw|svg)$/, '');

let svgContent: string | null = null;
let loadError: unknown = null;
try {
  const mod = await import(`../../assets/diagrams/${name}.svg?raw`);
  svgContent = prepareInlineSvg(mod.default as string);
} catch (e) {
  loadError = e;
}
</script>

<template>
  <figure class="excalidraw-diagram" role="img" :aria-label="alt">
    <div v-if="svgContent" class="excalidraw-svg" v-html="svgContent" />
    <div v-else-if="loadError" class="excalidraw-error">
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
</style>

<style>
:root.dark .excalidraw-svg {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
