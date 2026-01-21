<script setup lang="ts">
import Pre from '#ui/components/prose/Pre.vue';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
});

const isMermaid = ref<boolean>(props.language === 'mermaid');
</script>

<template>
  <Pre v-if="isMermaid" v-bind="props" class="mermaid-pre">
    <Mermaid>
      {{ code }}
    </Mermaid>
  </Pre>

  <Pre v-else v-bind="props"><slot /></Pre>
</template>

<style>
pre code .line {
  display: block;
}
</style>
