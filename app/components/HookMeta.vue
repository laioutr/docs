<script lang="ts" setup>
import { UCollapsible, UIcon, UTooltip } from '#components';

interface PayloadField {
  field: string;
  type: string;
  description?: string;
  optional?: boolean;
}
interface RelatedLink {
  label: string;
  to: string;
}

const props = defineProps<{
  name: string;
  /** Human-readable title. Omit to promote the hook name to the headline. */
  title?: string;
  surface: 'client' | 'server';
  register: 'nuxt-plugin' | 'nitro-plugin';
  /** How handlers are called. Independent of `kind` — authored per hook. */
  dispatch: 'sync' | 'async';
  kind: 'filter' | 'override' | 'modify' | 'lifecycle';
  payload?: PayloadField[];
  whenItFires: string;
  firedBy?: string[];
  related?: RelatedLink[];
}>();

const headingTitle = computed(() => props.title || props.name);
const badgeToken = computed(() => (props.title ? props.name : ''));

const surfaceLabel = computed(() => (props.surface === 'server' ? 'Server' : 'Client'));
const registerLabel = computed(() => (props.register === 'nitro-plugin' ? 'Nitro plugin' : 'Nuxt plugin'));
const dispatchLabel = computed(() => (props.dispatch === 'async' ? 'Asynchronous' : 'Synchronous'));

const kindLabel = computed(() => {
  const labels = { filter: 'Filter', override: 'Override', modify: 'Modify', lifecycle: 'Lifecycle' } as const;
  return labels[props.kind];
});

const kindTip = computed(() => {
  switch (props.kind) {
    case 'filter':
      return 'Filter hook — runs after the default with result.value pre-seeded. Transform, replace, or pass it through; chained across plugins.';
    case 'override':
      return 'Override hook — runs before the default with result.value empty. Set it to take over, or leave it unset to fall back.';
    case 'modify':
      return 'Modify hook — mutate the passed object in place. There is no result slot.';
    default:
      return 'Lifecycle hook — a before / success / error / finally sequence around an operation.';
  }
});

const dispatchTip = computed(() =>
  props.dispatch === 'async'
    ? 'Handlers may be async and are awaited.'
    : "Handlers run synchronously and aren't awaited — set values inline; a returned promise won't be picked up.",
);

// Nuxt UI tooltips default to a fixed-height, single-line, truncated content
// slot. Relax the wrapper so multi-sentence hints wrap within a sane width.
const tooltipUi = { content: 'h-auto max-w-xs items-start py-1.5 leading-snug' };
</script>

<template>
  <MetaCard :title="headingTitle" :token="badgeToken">
    <template #after-header>
      <div class="hook-kindline">
        <UTooltip :ui="tooltipUi">
          <NuxtLink :to="`/frontend/features/hooks#hook-mechanics`" class="hook-kind" :class="`hook-kind--${kind}`">
            {{ kindLabel }}
          </NuxtLink>
          <template #content>{{ kindTip }}</template>
        </UTooltip>
      </div>
    </template>

    <template v-if="$slots.default" #description>
      <MDCSlot unwrap="p" />
    </template>

    <template #sections>
      <p class="hook-when"><strong class="hook-when__label">When it fires:</strong> {{ whenItFires }}</p>

      <div class="hook-facets">
        <span class="hook-facet">
          <span class="hook-facet__label">Runs on</span>
          <span class="hook-facet__value">{{ surfaceLabel }}</span>
        </span>
        <span class="hook-facet__sep" aria-hidden="true">·</span>
        <span class="hook-facet">
          <span class="hook-facet__label">Register in</span>
          <span class="hook-facet__value">{{ registerLabel }}</span>
        </span>
        <span class="hook-facet__sep" aria-hidden="true">·</span>
        <span class="hook-facet">
          <span class="hook-facet__label">Dispatch</span>
          <UTooltip :ui="tooltipUi">
            <span class="hook-facet__value hook-facet__value--hint">{{ dispatchLabel }}</span>
            <template #content>{{ dispatchTip }}</template>
          </UTooltip>
        </span>
      </div>

      <MetaCardSection v-if="payload?.length" label="Payload">
        <div class="hook-fields">
          <div v-for="f in payload" :key="f.field" class="hook-field">
            <JsonSchemaFieldRow :name="f.field" :type="f.type" :optional="f.optional" />
            <p v-if="f.description" class="text-muted mt-1 text-sm">{{ f.description }}</p>
          </div>
        </div>
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

      <div v-if="$slots.example" class="hook-example-section">
        <UCollapsible>
          <template #default="{ open }">
            <button type="button" class="usage-trigger" :class="{ 'usage-trigger--open': open }">
              <UIcon name="lucide:chevron-right" class="usage-trigger__chevron" />
              <span>Example</span>
            </button>
          </template>
          <template #content>
            <div class="hook-example">
              <MDCSlot name="example" />
            </div>
          </template>
        </UCollapsible>
      </div>
    </template>
  </MetaCard>
</template>

<style scoped>
/* ---- mechanic tag (in after-header) ---- */
.hook-kindline {
  margin-top: 0.625rem;
}
.hook-kind {
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
  padding: 0.25rem 0.55rem;
  border-radius: 9999px;
  text-decoration: none;
}
.hook-kind--filter {
  color: var(--color-indigo-700);
  background: var(--color-indigo-100);
}
.hook-kind--override {
  color: var(--color-violet-700);
  background: var(--color-violet-100);
}
.hook-kind--modify {
  color: var(--color-teal-700);
  background: var(--color-teal-100);
}
.hook-kind--lifecycle {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}
:root.dark .hook-kind--filter {
  color: var(--color-indigo-300);
  background: color-mix(in oklch, var(--color-indigo-500) 18%, transparent);
}
:root.dark .hook-kind--override {
  color: var(--color-violet-300);
  background: color-mix(in oklch, var(--color-violet-500) 18%, transparent);
}
:root.dark .hook-kind--modify {
  color: var(--color-teal-300);
  background: color-mix(in oklch, var(--color-teal-500) 18%, transparent);
}
:root.dark .hook-kind--lifecycle {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}

/* ---- facet row (below description) ---- */
.hook-facets {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.85rem;
  font-size: 0.8125rem;
  margin-bottom: 0.25rem;
}
.hook-facet {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
}
.hook-facet__label {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
}
.hook-facet__value {
  font-weight: 600;
  color: var(--color-gray-700);
}
.hook-facet__value--hint {
  border-bottom: 1px dotted var(--color-gray-400);
  cursor: help;
}
.hook-facet__sep {
  color: var(--color-gray-300);
}
:root.dark .hook-facet__label {
  color: var(--color-gray-500);
}
:root.dark .hook-facet__value {
  color: var(--color-gray-300);
}
:root.dark .hook-facet__sep {
  color: var(--color-gray-700);
}

/* ---- payload field list — rows via <JsonSchemaFieldRow>, matching the reflected cards ---- */
.hook-fields {
  border-left: 2px dashed var(--color-gray-200);
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
:root.dark .hook-fields {
  border-left-color: var(--color-gray-800);
}

/* ---- when it fires (subtle labelled line under the description) ---- */
.hook-when {
  margin: 0.45rem 0 0.9rem;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
}
.hook-when__label {
  font-weight: 600;
  color: var(--color-gray-700);
}
:root.dark .hook-when {
  color: var(--color-gray-400);
}
:root.dark .hook-when__label {
  color: var(--color-gray-300);
}

/* ---- chips ---- */
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

/* ---- collapsible example (matches ActionMeta) ---- */
.hook-example-section {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-gray-200);
}
:root.dark .hook-example-section {
  border-top-color: var(--color-gray-800);
}
.usage-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
  transition: color 0.15s;
}
.usage-trigger:hover {
  color: var(--color-gray-600);
}
:root.dark .usage-trigger {
  color: var(--color-gray-500);
}
:root.dark .usage-trigger:hover {
  color: var(--color-gray-300);
}
.usage-trigger__chevron {
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.15s;
}
.usage-trigger--open .usage-trigger__chevron {
  transform: rotate(90deg);
}
.hook-example {
  margin-top: 0.5rem;
}
</style>
