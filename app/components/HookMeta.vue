<script lang="ts" setup>
interface PayloadField {
  field: string;
  type: string;
  description?: string;
  optional?: boolean;
}
interface HookResultInfo {
  seed: 'pre-seeded' | 'empty';
  type: string;
  description?: string;
}
interface RelatedLink {
  label: string;
  to: string;
}

const props = defineProps<{
  name: string;
  title: string;
  surface: 'client' | 'server';
  register: 'nuxt-plugin' | 'nitro-plugin';
  kind: 'lifecycle' | 'filter' | 'override' | 'modify';
  phase?: 'before' | 'success' | 'error' | 'finally';
  payload?: PayloadField[];
  result?: HookResultInfo;
  whenItFires: string;
  firedBy?: string[];
  related?: RelatedLink[];
}>();

const surfaceLabel = computed(() => (props.surface === 'server' ? 'Server' : 'Client'));
const registerLabel = computed(() => (props.register === 'nitro-plugin' ? 'Nitro plugin' : 'Nuxt plugin'));
const kindLabel = computed(() => {
  const labels = { lifecycle: 'Lifecycle', filter: 'Filter', override: 'Override', modify: 'Modify' } as const;
  const base = labels[props.kind];
  return props.kind === 'lifecycle' && props.phase ? `${base} · ${props.phase}` : base;
});
</script>

<template>
  <MetaCard :title="title" :token="name">
    <template #after-header>
      <div class="hook-pills">
        <span class="hook-pill" :class="`hook-pill--${surface}`">{{ surfaceLabel }}</span>
        <span class="hook-pill hook-pill--plain">{{ registerLabel }}</span>
        <span class="hook-pill" :class="`hook-pill--${kind}`">{{ kindLabel }}</span>
      </div>
    </template>

    <template #sections>
      <MetaCardSection v-if="payload?.length" label="Payload">
        <table class="hook-args">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in payload" :key="f.field">
              <td class="hook-args__k">{{ f.field }}<span v-if="f.optional" class="hook-args__opt">?</span></td>
              <td class="hook-args__t">{{ f.type }}</td>
              <td class="hook-args__d">{{ f.description }}</td>
            </tr>
          </tbody>
        </table>
      </MetaCardSection>

      <MetaCardSection v-if="result" label="result.value">
        <div class="hook-result">
          <div class="hook-result__top">
            <span
              class="hook-result__seed"
              :class="result.seed === 'pre-seeded' ? 'hook-result__seed--pre' : 'hook-result__seed--empty'"
            >
              {{ result.seed === 'pre-seeded' ? 'Pre-seeded' : 'Starts empty' }}
            </span>
            <code class="hook-result__type">{{ result.type }}</code>
          </div>
          <p v-if="result.description" class="hook-result__desc">{{ result.description }}</p>
        </div>
      </MetaCardSection>

      <MetaCardSection label="When it fires">
        <p class="hook-fires">{{ whenItFires }}</p>
      </MetaCardSection>

      <MetaCardSection v-if="firedBy?.length" label="Fired by">
        <div class="hook-chips">
          <code v-for="f in firedBy" :key="f" class="hook-chip">{{ f }}</code>
        </div>
      </MetaCardSection>

      <MetaCardSection v-if="related?.length" label="Related">
        <div class="hook-chips">
          <NuxtLink v-for="r in related" :key="r.to" :to="r.to" class="hook-chip hook-chip--link">{{ r.label }}</NuxtLink>
        </div>
      </MetaCardSection>

      <MetaCardSection v-if="$slots.default" label="Example">
        <slot />
      </MetaCardSection>
    </template>
  </MetaCard>
</template>

<style scoped>
.hook-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.hook-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.hook-pill--client {
  color: var(--color-cyan-700);
  background: var(--color-cyan-100);
}
.hook-pill--server {
  color: var(--color-amber-700);
  background: var(--color-amber-100);
}
.hook-pill--filter {
  color: var(--color-indigo-700);
  background: var(--color-indigo-100);
}
.hook-pill--override {
  color: var(--color-violet-700);
  background: var(--color-violet-100);
}
.hook-pill--modify {
  color: var(--color-teal-700);
  background: var(--color-teal-100);
}
.hook-pill--lifecycle {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}
.hook-pill--plain {
  color: var(--color-gray-500);
  background: transparent;
  border-color: var(--color-gray-300);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 500;
}

:root.dark .hook-pill--client {
  color: var(--color-cyan-300);
  background: color-mix(in oklch, var(--color-cyan-500) 18%, transparent);
}
:root.dark .hook-pill--server {
  color: var(--color-amber-300);
  background: color-mix(in oklch, var(--color-amber-500) 18%, transparent);
}
:root.dark .hook-pill--filter {
  color: var(--color-indigo-300);
  background: color-mix(in oklch, var(--color-indigo-500) 18%, transparent);
}
:root.dark .hook-pill--override {
  color: var(--color-violet-300);
  background: color-mix(in oklch, var(--color-violet-500) 18%, transparent);
}
:root.dark .hook-pill--modify {
  color: var(--color-teal-300);
  background: color-mix(in oklch, var(--color-teal-500) 18%, transparent);
}
:root.dark .hook-pill--lifecycle {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}
:root.dark .hook-pill--plain {
  color: var(--color-gray-400);
  border-color: var(--color-gray-700);
}

/* payload table */
.hook-args {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.hook-args th {
  text-align: left;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-gray-400);
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}
.hook-args td {
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: top;
}
.hook-args__k {
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-gray-800);
  white-space: nowrap;
}
.hook-args__opt {
  color: var(--color-gray-400);
}
.hook-args__t {
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-primary-600, var(--color-indigo-600));
  white-space: nowrap;
}
.hook-args__d {
  color: var(--color-gray-600);
}

:root.dark .hook-args th {
  border-bottom-color: var(--color-gray-800);
  color: var(--color-gray-500);
}
:root.dark .hook-args td {
  border-bottom-color: var(--color-gray-800);
}
:root.dark .hook-args__k {
  color: var(--color-gray-200);
}
:root.dark .hook-args__d {
  color: var(--color-gray-400);
}

/* result callout */
.hook-result {
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
}
.hook-result__top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-gray-50);
}
.hook-result__seed {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.4375rem;
  border-radius: 0.3125rem;
}
.hook-result__seed--pre {
  color: var(--color-indigo-700);
  background: var(--color-indigo-100);
}
.hook-result__seed--empty {
  color: var(--color-violet-700);
  background: var(--color-violet-100);
}
.hook-result__type {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-600);
}
.hook-result__desc {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}

:root.dark .hook-result {
  border-color: var(--color-gray-800);
}
:root.dark .hook-result__top {
  background: var(--color-gray-900);
}
:root.dark .hook-result__desc {
  color: var(--color-gray-400);
}

.hook-fires {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}
:root.dark .hook-fires {
  color: var(--color-gray-400);
}

.hook-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.hook-chip {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  padding: 0.1875rem 0.5rem;
  border-radius: 0.375rem;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  text-decoration: none;
}
.hook-chip--link {
  color: var(--color-primary-600, var(--color-indigo-600));
}
:root.dark .hook-chip {
  color: var(--color-gray-300);
  background: var(--color-gray-800);
}
</style>
