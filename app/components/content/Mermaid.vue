<script setup lang="ts">
import type { Mermaid } from 'mermaid';

const show = ref(false);

const $mermaid = useNuxtApp().$mermaid as () => Mermaid;

const mermaidRef = ref<HTMLDivElement | null>(null);
const orgCode = ref<string>('');
const renderId = `mermaid-${useId()}`;

const reset = () => {
  if (!mermaidRef.value) {
    return;
  }
  mermaidRef.value.textContent = orgCode.value;
  delete mermaidRef.value.dataset.processed;
};

const render = async () => {
  if (!mermaidRef.value || !orgCode.value.trim()) {
    return;
  }
  reset();
  await nextTick();
  const el = mermaidRef.value;
  try {
    const { svg, bindFunctions } = await $mermaid().render(renderId, orgCode.value, el);
    el.innerHTML = svg;
    bindFunctions?.(el);
  } catch (err) {
    console.error('[mermaid] render failed', err);
  }
};

onMounted(async () => {
  show.value = true;
  await nextTick();
  orgCode.value = mermaidRef.value?.textContent ?? '';
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
