<script lang="ts" setup>
interface LifecyclePhase {
  phase: 'before' | 'success' | 'error' | 'finally';
  name: string;
  when: string;
  payload?: string;
}

defineProps<{
  family: string;
  description?: string;
  surface: 'client' | 'server';
  register: 'nuxt-plugin' | 'nitro-plugin';
  firedBy?: string[];
  phases: LifecyclePhase[];
  diagram?: string;
}>();
</script>

<template>
  <section class="hook-lc">
    <header class="hook-lc__head">
      <h3 :id="family.toLowerCase().replace(/[^a-z0-9]+/g, '-')" class="hook-lc__title">{{ family }}</h3>
      <p v-if="description" class="hook-lc__desc">{{ description }}</p>
      <div v-if="firedBy?.length" class="hook-lc__firedby">
        <span class="hook-lc__firedby-label">Fired by</span>
        <code v-for="f in firedBy" :key="f">{{ f }}</code>
      </div>
    </header>

    <ol class="hook-lc__rail">
      <li v-for="p in phases" :key="p.name" class="hook-phase" :class="`hook-phase--${p.phase}`">
        <span class="hook-phase__dot" aria-hidden="true" />
        <div class="hook-phase__body">
          <div class="hook-phase__name">
            <strong>{{ p.phase }}</strong>
            <code>{{ p.name }}</code>
          </div>
          <p class="hook-phase__when">{{ p.when }}</p>
          <div v-if="p.payload" class="hook-phase__payload">{{ p.payload }}</div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.hook-lc {
  margin-block: 1.5rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
}
:root.dark .hook-lc {
  border-color: var(--color-gray-800);
}

.hook-lc__head {
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid var(--color-gray-200);
}
:root.dark .hook-lc__head {
  border-bottom-color: var(--color-gray-800);
}
.hook-lc__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hook-lc__desc {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}
:root.dark .hook-lc__desc {
  color: var(--color-gray-400);
}
.hook-lc__firedby {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
}
.hook-lc__firedby-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
}
.hook-lc__firedby code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  padding: 0.125rem 0.4375rem;
  border-radius: 0.375rem;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
}
:root.dark .hook-lc__firedby code {
  color: var(--color-gray-300);
  background: var(--color-gray-800);
}

.hook-lc__rail {
  list-style: none;
  margin: 0;
  padding: 0.5rem 1.5rem 0.75rem;
}
.hook-phase {
  position: relative;
  display: flex;
  gap: 0.875rem;
  padding: 0.75rem 0;
}
.hook-phase:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 0.3125rem;
  top: 1.75rem;
  bottom: -0.75rem;
  width: 2px;
  background: var(--color-gray-200);
}
:root.dark .hook-phase:not(:last-child)::before {
  background: var(--color-gray-800);
}
.hook-phase__dot {
  width: 0.75rem;
  height: 0.75rem;
  flex: none;
  margin-top: 0.25rem;
  border-radius: 9999px;
}
.hook-phase--before .hook-phase__dot {
  background: var(--color-gray-400);
}
.hook-phase--success .hook-phase__dot {
  background: var(--color-green-500);
}
.hook-phase--error .hook-phase__dot {
  background: var(--color-red-500);
}
.hook-phase--finally .hook-phase__dot {
  background: var(--color-primary-500, var(--color-indigo-500));
}
.hook-phase__body {
  min-width: 0;
}
.hook-phase__name {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.hook-phase__name strong {
  font-size: 0.875rem;
}
.hook-phase__name code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  padding: 0.0625rem 0.4375rem;
  border-radius: 0.3125rem;
}
:root.dark .hook-phase__name code {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}
.hook-phase__when {
  margin: 0.1875rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}
:root.dark .hook-phase__when {
  color: var(--color-gray-400);
}
.hook-phase__payload {
  margin-top: 0.375rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-400);
}
</style>
