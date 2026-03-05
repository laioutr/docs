<script lang="ts" setup>
defineProps<{
  title: string;
  token: string;
  importLine: string;
}>();

const copied = ref(false);
let copyTimeout: ReturnType<typeof setTimeout>;
function copyImport(text: string) {
  navigator.clipboard.writeText(text);
  copied.value = true;
  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <div class="meta-card">
    <!-- Header: title + token badge -->
    <div class="meta-card__header">
      <h3 :id="title.toLowerCase()" class="meta-card__title">{{ title }}</h3>
      <code class="meta-card__token">{{ token }}</code>
    </div>

    <!-- After header (pills, badges, etc.) -->
    <slot name="after-header" />

    <!-- Description -->
    <div v-if="$slots.description" class="meta-card__desc">
      <slot name="description" />
    </div>

    <!-- Import snippet -->
    <button class="meta-card__snippet" type="button" @click="copyImport(importLine)">
      <code class="meta-card__snippet-code">{{ importLine }}</code>
      <UIcon
        :name="copied ? 'lucide:check' : 'lucide:copy'"
        class="meta-card__snippet-icon"
        :class="{ 'meta-card__snippet-icon--done': copied }"
      />
    </button>

    <!-- Sections (schema fields, etc.) -->
    <slot name="sections" />
  </div>
</template>

<style scoped>
.meta-card {
  position: relative;
  margin-block: 1.5rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1.25rem 1.5rem;
}

:root.dark .meta-card {
  border-color: var(--color-gray-800);
}

/* ---- Header ---- */
.meta-card__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-gray-900);
}

:root.dark .meta-card__title {
  color: var(--color-gray-100);
}

.meta-card__token {
  font-size: 0.8125rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-gray-800);
  background: var(--color-gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  line-height: 1.5;
}

:root.dark .meta-card__token {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}

/* ---- Description ---- */
.meta-card__desc {
  margin-top: 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-gray-600);
}

:root.dark .meta-card__desc {
  color: var(--color-gray-400);
}

/* ---- Import snippet ---- */
.meta-card__snippet {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  min-width: 0;
  max-width: 100%;
}

.meta-card__snippet:hover .meta-card__snippet-icon {
  opacity: 1;
}

.meta-card__snippet-code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-gray-400);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.dark .meta-card__snippet-code {
  color: var(--color-gray-500);
}

.meta-card__snippet-icon {
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  color: var(--color-gray-400);
  opacity: 0;
  transition: opacity 0.15s;
}

.meta-card__snippet-icon--done {
  opacity: 1;
  color: var(--color-emerald-500);
}
</style>
