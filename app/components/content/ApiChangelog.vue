<script lang="ts" setup>
import type { Collections } from '@nuxt/content';
import { ProseCodeGroup, ProsePre } from '#components';
// `ChangelogEntryType`, `changelogHref`, `resolveChangelogEntries` are auto-imported from app/utils/changelog.ts

// The standalone `<MDC>` renderer needs prose components passed explicitly so
// fenced code blocks inside `note` / `migration` resolve (e.g. ProsePre).
const mdcComponents = {
  'prose-pre': ProsePre,
  'prose-code-group': ProseCodeGroup,
  ProsePre,
  ProseCodeGroup,
  pre: ProsePre,
  'code-group': ProseCodeGroup,
};

const props = defineProps<{
  keys: string[];
}>();

const route = useRoute();

// One data document holds the whole `{ [key]: entries[] }` map. Undeclared
// top-level YAML keys land under `meta` (the collection schema is open), so the
// map lives at `doc.meta`.
const { data: doc } = await useAsyncData('changelog-data', () =>
  queryCollection('changelog' as keyof Collections).first(),
);

const entries = computed(() =>
  resolveChangelogEntries((doc.value as { meta?: Record<string, unknown> } | null)?.meta, props.keys),
);

const showKey = computed(() => props.keys.length > 1);

const typeLabel: Record<ChangelogEntryType, string> = {
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  removed: 'Removed',
  deprecated: 'Deprecated',
};
</script>

<template>
  <section v-if="entries.length" class="api-changelog">
    <ProseH2 id="changelog">Changelog</ProseH2>

    <div class="cl-rail not-prose">
      <div v-for="(entry, index) in entries" :key="`${entry.key}-${entry.version}-${index}`" class="cl-row">
        <div class="cl-head">
          <NuxtLink
            v-if="changelogHref(entry)"
            :to="changelogHref(entry)!"
            class="cl-ver cl-ver--link text-highlighted"
          >
            v{{ entry.version.replace(/^v/, '') }}
          </NuxtLink>
          <span v-else class="cl-ver text-highlighted">v{{ entry.version.replace(/^v/, '') }}</span>

          <span v-if="entry.type || entry.breaking" class="cl-type text-muted">
            <template v-if="entry.type">{{ typeLabel[entry.type] }}</template>
            <template v-if="entry.type && entry.breaking"> · </template>
            <span v-if="entry.breaking" class="cl-breaking text-error">Breaking</span>
          </span>

          <span v-if="showKey" class="cl-key text-muted">{{ entry.key }}</span>
        </div>

        <MDCCached
          :value="entry.note"
          :components="mdcComponents"
          class="cl-note text-toned"
          :cache-key="`${route.path}-${entry.key}-${entry.version}-${index}-note`"
        />

        <details v-if="entry.migration" class="cl-migration">
          <summary class="text-primary">Show migration</summary>
          <MDCCached
            :value="entry.migration"
            :components="mdcComponents"
            class="cl-migration-body text-toned"
            :cache-key="`${route.path}-${entry.key}-${entry.version}-${index}-migration`"
          />
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Timeline rail running through the version-marker gutter. Both the rail line
   and the per-row dots are centered on the same x (`--rail-x`) via
   translateX(-50%), so they stay aligned regardless of their widths. */
.cl-rail {
  --rail-pad: 1.75rem; /* gutter width = .cl-row's left offset within .cl-rail */
  --rail-x: 7px; /* rail center, measured from .cl-rail's left edge */
  position: relative;
  padding-left: var(--rail-pad);
}
.cl-rail::before {
  content: '';
  position: absolute;
  left: var(--rail-x);
  transform: translateX(-50%);
  top: 0.9rem;
  bottom: 0.9rem;
  width: 2px;
  background: var(--ui-border);
  border-radius: 2px;
}

.cl-row {
  position: relative;
  padding: 1rem 0;
}
.cl-row + .cl-row {
  border-top: 1px solid var(--ui-border);
}
.cl-row::before {
  content: '';
  position: absolute;
  /* .cl-row's left edge sits at --rail-pad from .cl-rail's left, so offset back
     to put the dot center on --rail-x. */
  left: calc(var(--rail-x) - var(--rail-pad));
  transform: translateX(-50%);
  top: 1.4rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--ui-bg);
  border: 2.5px solid var(--ui-primary);
}

.cl-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.625rem;
  margin-bottom: 0.25rem;
}
.cl-ver {
  font-weight: 700;
}
.cl-ver--link {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
}
.cl-type {
  font-size: 0.8rem;
}
.cl-breaking {
  font-weight: 600;
}
.cl-key {
  margin-left: auto;
  font-family: var(--ui-font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
}

.cl-migration {
  margin-top: 0.5rem;
}
.cl-migration summary {
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  list-style: none;
  user-select: none;
  width: fit-content;
}
.cl-migration summary::-webkit-details-marker {
  display: none;
}
.cl-migration-body {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
