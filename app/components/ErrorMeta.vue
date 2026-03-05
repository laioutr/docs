<script lang="ts" setup>
import { canonicalErrors } from '#shared/utils/canonical-errors';

const props = defineProps<{
  code: string;
}>();

const error = computed(() => canonicalErrors.find((e) => e.code === props.code));

const importLine = computed(() => {
  if (!error.value) return '';
  return importSnippet(error.value.className, `@laioutr-core/canonical-types/${error.value.domain}`);
});

const actionLinks = computed(() => {
  if (!error.value) return [];
  return error.value.thrownBy.map((token) => {
    const exportName = tokenToExportName(token, 'Action');
    return {
      token,
      exportName,
      anchor: exportName.toLowerCase(),
    };
  });
});
</script>

<template>
  <div v-if="error" class="error-meta">
    <div class="error-meta__header">
      <h3 :id="error.code.toLowerCase()" class="error-meta__title">{{ error.className }}</h3>
      <code class="error-meta__code">{{ error.code }}</code>
      <span v-if="error.httpStatus" class="error-meta__pill error-meta__pill--status">{{ error.httpStatus }}</span>
    </div>

    <p class="error-meta__desc">{{ error.description }}</p>

    <button class="error-meta__snippet" type="button" @click="navigator.clipboard.writeText(importLine)">
      <code class="error-meta__snippet-code">{{ importLine }}</code>
    </button>

    <!-- Data fields -->
    <div v-if="error.data?.length" class="error-meta__section">
      <div class="error-meta__section-label">Error Data</div>
      <div class="error-meta__fields">
        <div v-for="field in error.data" :key="field.name" class="error-meta__field">
          <code class="error-meta__field-name">{{ field.name }}</code>
          <code class="error-meta__field-type">{{ field.type }}</code>
          <span v-if="field.description" class="error-meta__field-desc">{{ field.description }}</span>
        </div>
      </div>
    </div>

    <!-- Reason values -->
    <div v-if="error.reasonValues?.length" class="error-meta__section">
      <div class="error-meta__section-label">Reason Values</div>
      <div class="error-meta__reasons">
        <code v-for="reason in error.reasonValues" :key="reason" class="error-meta__reason">{{ reason }}</code>
      </div>
    </div>

    <!-- Thrown by -->
    <div v-if="actionLinks.length" class="error-meta__section">
      <div class="error-meta__section-label">Thrown by</div>
      <div class="error-meta__thrown-by">
        <NuxtLink
          v-for="action in actionLinks"
          :key="action.token"
          :to="`/frontend/api-reference/${error.domain}/actions#${action.anchor}`"
          class="error-meta__action-link"
        >
          {{ action.exportName }}
        </NuxtLink>
      </div>
    </div>
  </div>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No error found for code <ProseCode>{{ props.code }}</ProseCode>.
  </ProseCallout>
</template>

<style scoped>
.error-meta {
  position: relative;
  margin-block: 1.5rem;
  border: 1px solid var(--color-gray-200);
  border-left: 3px solid var(--color-red-400);
  border-radius: 0.5rem;
  padding: 1.25rem 1.5rem;
}

:root.dark .error-meta {
  border-color: var(--color-gray-800);
  border-left-color: var(--color-red-500);
}

/* ---- Header ---- */
.error-meta__header {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.error-meta__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-gray-900);
}

:root.dark .error-meta__title {
  color: var(--color-gray-100);
}

.error-meta__code {
  font-size: 0.8125rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-red-700);
  background: var(--color-red-50);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  line-height: 1.5;
}

:root.dark .error-meta__code {
  color: var(--color-red-300);
  background: color-mix(in oklch, var(--color-red-500) 15%, transparent);
}

.error-meta__pill--status {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  padding: 0.125rem 0.4rem;
  border-radius: 0.25rem;
}

:root.dark .error-meta__pill--status {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}

/* ---- Description ---- */
.error-meta__desc {
  margin-top: 0.625rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-gray-600);
}

:root.dark .error-meta__desc {
  color: var(--color-gray-400);
}

/* ---- Import snippet ---- */
.error-meta__snippet {
  display: flex;
  margin-top: 0.625rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.error-meta__snippet-code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-gray-400);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.dark .error-meta__snippet-code {
  color: var(--color-gray-500);
}

/* ---- Sections ---- */
.error-meta__section {
  margin-top: 0.875rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-200);
}

:root.dark .error-meta__section {
  border-top-color: var(--color-gray-800);
}

.error-meta__section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
  margin-bottom: 0.5rem;
}

:root.dark .error-meta__section-label {
  color: var(--color-gray-500);
}

/* ---- Data fields ---- */
.error-meta__fields {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.error-meta__field {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.error-meta__field-name {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.8125rem;
  color: var(--color-gray-700);
}

:root.dark .error-meta__field-name {
  color: var(--color-gray-300);
}

.error-meta__field-type {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

:root.dark .error-meta__field-type {
  color: var(--color-gray-500);
}

.error-meta__field-desc {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
}

/* ---- Reason values ---- */
.error-meta__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.error-meta__reason {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
}

:root.dark .error-meta__reason {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}

/* ---- Thrown by ---- */
.error-meta__thrown-by {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.error-meta__action-link {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary-600);
  text-decoration: none;
}

.error-meta__action-link:hover {
  text-decoration: underline;
}

:root.dark .error-meta__action-link {
  color: var(--color-primary-400);
}
</style>
