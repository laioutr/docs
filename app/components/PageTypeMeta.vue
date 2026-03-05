<script lang="ts" setup>
import '@laioutr-core/canonical-types/autoload';
import { pageTypeTokenRegistry } from '@laioutr-core/core-types/frontend';
import { entityPagePath } from '../lib/entityPagePath';
import { useDidYouMean } from '../composables/useDidYouMean';

const props = defineProps<{
  name: string;
}>();

const allPageTypes = pageTypeTokenRegistry.all();
const pageType = computed(() => allPageTypes.find((pt) => pt.name === props.name));

const pageTypeExportNames: Record<string, string> = {
  'core/home': 'Home',
  'core/landingpage': 'Landingpage',
  'core/contentpage': 'Contentpage',
  'core/404': 'NotFoundPage',
  'ecommerce/product-detail-page': 'ProductDetailPage',
  'ecommerce/product-listing-page': 'ProductListingPage',
  'ecommerce/product-search-page': 'ProductSearchPage',
  'blog/post-single': 'BlogPostSinglePage',
  'blog/post-listing': 'BlogPostListingPage',
  'blog/collection': 'BlogPostCollectionPage',
};

const displayTitle = computed(() => pageType.value?.studio.label ?? props.name);
const exportName = computed(() => pageTypeExportNames[props.name] ?? props.name);
const importLine = computed(() => importSnippet(exportName.value, actionImportPackage(props.name)));

const didYouMeanThing = useDidYouMean(
  props.name,
  'page type',
  pageType,
  computed(() => allPageTypes.map((pt) => pt.name))
);
</script>

<template>
  <MetaCard v-if="pageType" :title="displayTitle" :token="pageType.name" :import-line="importLine">
    <template #after-header>
      <div class="pt-meta__pills">
        <span class="pt-meta__pill pt-meta__pill--kind">
          <UIcon :name="pageType.kind === 'static' ? 'lucide:file-text' : 'lucide:route'" class="size-3 shrink-0" />
          {{ pageType.kind }}
        </span>
        <span v-if="pageType.pathConstraints?.default || pageType.pathConstraints?.exact" class="pt-meta__pill pt-meta__pill--path">
          <UIcon name="lucide:link" class="size-3 shrink-0" />
          <code>{{ pageType.pathConstraints.exact || pageType.pathConstraints.default }}</code>
        </span>
      </div>
    </template>

    <template v-if="$slots.default || pageType.studio.description" #description>
      <MDCSlot v-if="$slots.default" unwrap="p" />
      <template v-else>{{ pageType.studio.description }}</template>
    </template>

    <template v-if="pageType.requiredQueries?.length" #sections>
      <MetaCardSection label="Required Queries">
        <div class="pt-meta__queries">
          <div v-for="rq in pageType.requiredQueries" :key="rq.alias" class="pt-meta__query-row">
            <code class="pt-meta__query-alias">{{ rq.alias }}</code>
            <NuxtLink :to="entityPagePath(rq.entityType)" class="pt-meta__entity-link">
              <UIcon name="lucide:box" class="size-3 shrink-0" />
              {{ rq.entityType }}
              <UIcon name="lucide:arrow-right" class="pt-meta__entity-arrow size-3 shrink-0" />
            </NuxtLink>
          </div>
        </div>
      </MetaCardSection>
    </template>
  </MetaCard>

  <ProseCallout v-else color="warning" icon="i-lucide-alert-circle">
    No page type metadata found for {{ props.name }}.
    <template v-if="didYouMeanThing">
      Did you mean <ProseCode>{{ didYouMeanThing }}</ProseCode>?
    </template>
  </ProseCallout>
</template>

<style scoped>
.pt-meta__pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  flex-wrap: wrap;
}

.pt-meta__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
}

.pt-meta__pill--kind {
  background: var(--color-amber-100);
  color: var(--color-amber-700);
}

:root.dark .pt-meta__pill--kind {
  background: color-mix(in oklch, var(--color-amber-500) 20%, transparent);
  color: var(--color-amber-300);
}

.pt-meta__pill--path {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.pt-meta__pill--path code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.6875rem;
}

:root.dark .pt-meta__pill--path {
  background: var(--color-gray-800);
  color: var(--color-gray-400);
}

/* ---- Required Queries ---- */
.pt-meta__queries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pt-meta__query-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pt-meta__query-alias {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  min-width: 5rem;
}

:root.dark .pt-meta__query-alias {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}

.pt-meta__entity-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  text-decoration: none;
  background: var(--color-purple-100);
  color: var(--color-purple-700);
  transition:
    background 0.15s,
    gap 0.15s;
}

.pt-meta__entity-link:hover {
  background: var(--color-purple-200);
}

.pt-meta__entity-arrow {
  opacity: 0.5;
  transition:
    opacity 0.15s,
    translate 0.15s;
}

.pt-meta__entity-link:hover .pt-meta__entity-arrow {
  opacity: 1;
  translate: 2px 0;
}

:root.dark .pt-meta__entity-link {
  background: color-mix(in oklch, var(--color-purple-500) 20%, transparent);
  color: var(--color-purple-300);
}

:root.dark .pt-meta__entity-link:hover {
  background: color-mix(in oklch, var(--color-purple-500) 30%, transparent);
}
</style>
