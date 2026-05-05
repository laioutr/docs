<script setup lang="ts">
import { UIcon } from '#components';

withDefaults(
  defineProps<{
    name: string;
    type: string;
    required?: boolean;
    deprecated?: boolean;
    expandable?: boolean;
    open?: boolean;
  }>(),
  { expandable: false, open: false },
);
</script>

<template>
  <div
    class="flex items-center font-mono text-sm"
    :class="expandable ? 'group/field -ml-7 w-full cursor-pointer gap-2' : 'gap-3'"
  >
    <span v-if="expandable" class="flex size-5 shrink-0 items-center justify-center rounded-sm bg-white dark:bg-gray-950">
      <UIcon
        name="lucide:chevron-right"
        class="size-3 text-muted transition-all duration-200 group-hover/field:text-default"
        :class="open && 'rotate-90'"
      />
    </span>
    <span class="font-semibold text-primary">{{ name }}</span>
    <div class="flex min-w-0 flex-1 items-center gap-1.5 text-xs">
      <span class="truncate rounded-sm bg-elevated px-1.5 py-0.5 text-toned">
        <LinkedTypeName :type="type" />
      </span>
      <span v-if="required" class="shrink-0 rounded-sm bg-error/10 px-1.5 py-0.5 text-error">required</span>
      <span v-if="deprecated" class="shrink-0 rounded-sm bg-warning/10 px-1.5 py-0.5 text-warning">deprecated</span>
    </div>
  </div>
</template>
