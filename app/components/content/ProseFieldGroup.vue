<script setup lang="ts">
import FieldGroup from '#ui/components/prose/FieldGroup.vue';

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  class: {
    type: [String, Array, Object],
    default: null,
  },
});

const showBorder = computed(() => props.bordered || !!props.title);
</script>

<template>
  <div v-if="showBorder" :class="['rounded-lg my-5 overflow-hidden border border-default']">
    <p v-if="title" class="py-3 px-4 font-semibold text-sm bg-elevated/50 border-b border-default text-left">
      {{ title }}
    </p>
    <FieldGroup :class="['!my-0 *:px-4', props.class]">
      <slot />
    </FieldGroup>
  </div>

  <FieldGroup v-else :class="props.class">
    <slot />
  </FieldGroup>
</template>
