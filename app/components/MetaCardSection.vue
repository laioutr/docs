<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="meta-card-section">
    <div class="meta-card-section__label">{{ label }}</div>
    <slot />
  </div>
</template>

<style scoped>
.meta-card-section {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-gray-200);
}

:root.dark .meta-card-section {
  border-top-color: var(--color-gray-800);
}

.meta-card-section__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
  margin-bottom: 0.5rem;
}

:root.dark .meta-card-section__label {
  color: var(--color-gray-500);
}
</style>
