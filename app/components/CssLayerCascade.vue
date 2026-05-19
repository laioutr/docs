<script setup lang="ts">
const layers = [
  { name: 'lui-components', desc: 'Your component styles', role: 'yours' as const },
  { name: 'lui-overridable', desc: 'Icon, Text base; UnoCSS shortcuts' },
  { name: 'lui-global', desc: 'OnSurface, section isolation, z-index' },
  { name: 'lui-externals', desc: 'Third-party CSS (Swiper)' },
  { name: 'lui-reset', desc: 'UnoCSS Tailwind reset' },
  { name: 'lui-tokens', desc: 'Theme files (colors, typography, spacing)' },
];
</script>

<template>
  <figure class="lcc" aria-label="CSS layer cascade diagram">
    <div class="lcc__stack">
      <div class="lcc__row lcc__row--customer">
        <code class="lcc__name">(unlayered)</code>
        <span class="lcc__desc">Customer CSS. Wins against every layer below.</span>
      </div>

      <div class="lcc__gap" aria-hidden="true" />

      <div
        v-for="layer in layers"
        :key="layer.name"
        class="lcc__row"
        :class="{ 'lcc__row--yours': layer.role === 'yours' }"
      >
        <code class="lcc__name">@layer {{ layer.name }}</code>
        <span class="lcc__desc">{{ layer.desc }}</span>
        <span v-if="layer.role === 'yours'" class="lcc__badge">your layer</span>
      </div>
    </div>

    <div class="lcc__axis" aria-hidden="true">
      <span class="lcc__axis-label-top">wins</span>
      <svg
        class="lcc__axis-svg"
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d="M6 98 L6 6 M2 10 L6 4 L10 10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <span class="lcc__axis-label-bottom">specificity</span>
    </div>
  </figure>
</template>

<style scoped>
.lcc {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: stretch;
  margin: 1.5rem 0;
}

.lcc__stack {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.lcc__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  border-radius: 0.375rem;
}

.lcc__row + .lcc__row {
  margin-top: 0.25rem;
}

.lcc__row--customer {
  border-color: var(--color-violet-300);
  background: var(--color-violet-50);
}

.lcc__row--yours {
  border-color: var(--color-emerald-400);
  background: var(--color-emerald-50);
  border-width: 2px;
}

.lcc__gap {
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lcc__gap::before {
  content: "";
  width: 1px;
  height: 100%;
  border-left: 1px dashed var(--color-gray-300);
}

.lcc__name {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-gray-800);
  flex-shrink: 0;
  min-width: 11rem;
}

.lcc__row--customer .lcc__name {
  color: var(--color-violet-800);
}

.lcc__row--yours .lcc__name {
  color: var(--color-emerald-800);
}

.lcc__desc {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  flex: 1;
  min-width: 0;
}

.lcc__row--customer .lcc__desc {
  color: var(--color-violet-700);
}

.lcc__badge {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--color-emerald-100);
  color: var(--color-emerald-800);
  border: 1px solid var(--color-emerald-300);
  white-space: nowrap;
}

.lcc__axis {
  width: 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-gray-500);
}

.lcc__axis-svg {
  flex: 1;
  width: 0.75rem;
  min-height: 4rem;
  margin: 0.25rem 0;
}

.lcc__axis-label-top {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
}

.lcc__axis-label-bottom {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

/* ---- Dark mode ---- */
:root.dark .lcc__row {
  border-color: var(--color-gray-800);
  background: var(--color-gray-900);
}

:root.dark .lcc__row--customer {
  border-color: var(--color-violet-800);
  background: color-mix(in oklab, var(--color-violet-950) 60%, transparent);
}

:root.dark .lcc__row--yours {
  border-color: var(--color-emerald-700);
  background: color-mix(in oklab, var(--color-emerald-950) 60%, transparent);
}

:root.dark .lcc__name {
  color: var(--color-gray-200);
}

:root.dark .lcc__row--customer .lcc__name {
  color: var(--color-violet-200);
}

:root.dark .lcc__row--yours .lcc__name {
  color: var(--color-emerald-200);
}

:root.dark .lcc__desc {
  color: var(--color-gray-400);
}

:root.dark .lcc__row--customer .lcc__desc {
  color: var(--color-violet-300);
}

:root.dark .lcc__badge {
  background: var(--color-emerald-950);
  color: var(--color-emerald-200);
  border-color: var(--color-emerald-800);
}

:root.dark .lcc__axis {
  color: var(--color-gray-500);
}

:root.dark .lcc__axis-label-top {
  color: var(--color-gray-200);
}

:root.dark .lcc__axis-label-bottom {
  color: var(--color-gray-400);
}

:root.dark .lcc__gap::before {
  border-left-color: var(--color-gray-700);
}

/* ---- Narrow viewports ---- */
@media (max-width: 40rem) {
  .lcc {
    grid-template-columns: 1fr;
  }

  .lcc__axis {
    display: none;
  }

  .lcc__row {
    flex-wrap: wrap;
  }

  .lcc__name {
    min-width: 0;
  }
}
</style>
