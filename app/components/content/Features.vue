<script setup lang="ts">
defineProps<{
  items?: string[];
}>();
</script>

<template>
  <div v-if="items?.length" class="my-6">
    <ul class="space-y-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-start gap-3">
        <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <UIcon name="i-lucide-check" class="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        </span>
        <span class="text-muted text-base">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>
