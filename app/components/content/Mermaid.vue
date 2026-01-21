<script setup lang="ts">
import type { Mermaid } from 'mermaid';

const show = ref(false);

const $mermaid = useNuxtApp().$mermaid as () => Mermaid;

const mermaidRef = ref<HTMLDivElement | null>(null);
const orgCode = ref<string>('');

const reset = () => {
  if (!mermaidRef.value) {
    return;
  }
  mermaidRef.value.innerHTML = orgCode.value;
  delete mermaidRef.value.dataset.processed;
};

const render = async () => {
  if (!mermaidRef.value) {
    return;
  }
  reset();
  await nextTick();
  $mermaid().run({ nodes: [mermaidRef.value] });
};

onMounted(async () => {
  show.value = true;
  await nextTick();
  orgCode.value = mermaidRef.value?.innerHTML ?? '';
  render();
});

watch(
  () => useColorMode().value,
  async (mode) => {
    await nextTick();
    render();
  }
);
</script>

<template>
  <div v-if="show" ref="mermaidRef" class="mermaid">
    <slot></slot>
  </div>
</template>
