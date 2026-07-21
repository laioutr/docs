---
title: Consuming Query Fields
description: How blocks and sections read interactive state from a resolved query field and update the URL when the user changes filters, sorting, or pagination.
seo:
  title: Consuming Query Fields
  description: How blocks and sections read interactive state from a resolved query field and update the URL when the user changes filters, sorting, or pagination.
sitemap:
  loc: /apps/app-development/consuming-query-fields
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9
---

A block declares a `query`-type schema field; Frontend Core resolves it through Orchestr and hands the result to the component as a prop. That prop carries more than just the entities to render: it also exposes the available filters and sortings, the user's current selection, and the URL identity needed to navigate when something changes. This page covers reading that interactive state and updating it.

For declaring the schema field itself (`type: 'query'`, `singleEntity`, `components`, `links`), see [Schema fields → query](/apps/app-development/schema-fields#query). For how the same shapes are produced server-side, see [Queries](/frontend/orchestr/queries) and [Filters](/frontend/orchestr/filters).

## What's on the resolved prop

A `query` field (without `singleEntity`) resolves to a `ClientEntitySet`. The display side (`entities`, nested `links`) is documented under [schema fields](/apps/app-development/schema-fields#query); the parts relevant for interactive UI are:

::field-group{title="ClientEntitySet properties"}
  :::field{name="availableFilters" type="AvailableFilter[]"}
  Facets the handler offers for the current result set. See [Filters](/frontend/orchestr/filters) for the four variants.
  :::

  :::field{name="availableSortings" type="Array<{ key: string, label?: string }>"}
  Sort options the handler offers. The `key` is what comes back in `sorting` when selected.
  :::

  :::field{name="filter" type="QueryWireRequestFilter"}
  The filter values currently applied (parsed from the URL). Same shape as `availableFilters` ids mapped to selected values.
  :::

  :::field{name="sorting" type="string"}
  The currently active sort key, if any.
  :::

  :::field{name="pagination" type="ClientResponsePagination"}
  Current page state: `current` (1-based page), `offset` (0-based entity offset), `limit`, `total`, `pages`, `next`, `previous`.
  :::

  :::field
  ---
  name: urlQueryPrefix / urlQueryAcceptedPrefixes / isRoot
  type: string / string[] / boolean
  ---
  URL identity. You normally do not read these directly; pass the entity set to `buildQueryUrl` and they are used implicitly.
  :::
::

## Reading current state

Treat the prop as `undefined`-tolerant: it is `undefined` while the query is loading or has errored. Wrap reads in computeds so they recompute when the URL changes:

```vue
<script setup lang="ts">
import type { ClientEntitySet } from '@laioutr-core/orchestr/types';
import { computed } from 'vue';
const { products } = defineProps<{ products: ClientEntitySet | undefined }>();
// ---cut---
const filters = computed(() => products?.availableFilters ?? []);
const sortings = computed(() => products?.availableSortings ?? []);
const activeFilters = computed(() => products?.filter ?? {});
const activeSorting = computed(() => products?.sorting);
const total = computed(() => products?.pagination.total ?? 0);
const currentPage = computed(() => products?.pagination.current ?? 1);
</script>
```

`activeFilters` and `activeSorting` reflect what the user already picked; use them to render selected state in the UI (highlighted chips, checked checkboxes, the current option in a sort dropdown).

## Updating state

State changes go through the URL. The flow is always: build a new URL with `buildQueryUrl`, then navigate with the router. The router push triggers a re-fetch with the new params, and the prop re-resolves with the new state.

Pass the entity set itself to `buildQueryUrl`; it carries the URL identity, so you do not construct a `QueryUrlIdentity` manually:

```vue
<script setup lang="ts">
import type { ClientEntitySet, QueryWireRequestFilter } from '@laioutr-core/orchestr/types';
import { buildQueryUrl, useRouter } from '#imports';
const { products } = defineProps<{ products: ClientEntitySet | undefined }>();
// ---cut---
const router = useRouter();

const onSortingChange = (key: string) => {
  if (products) router.push(buildQueryUrl(products, { sort: key }));
};

const onAddFilter = (id: string, values: string[]) => {
  if (products) router.push(buildQueryUrl(products, { addFilter: { [id]: values } }));
};

const onRemoveFilter = (id: string) => {
  if (products) router.push(buildQueryUrl(products, { removeFilter: id }));
};

const onResetFilters = () => {
  if (products) router.push(buildQueryUrl(products, { resetFilters: true }));
};

// Pagination typically uses an href builder so links render as proper <a> tags
const pageHref = (page: number) => (products ? buildQueryUrl(products, { page }) : '/');
</script>
```

Sort, limit, and filter changes automatically reset the page to 1; you do not need to pass `page: 1` explicitly. For the full modifier reference (range filters, partial filter replacement, page-reset opt-out), see [URL Query Parameters → Building URLs](/frontend/orchestr/url-query-params#building-urls-with-buildqueryurl).

::tip
Pagination controls usually want anchor semantics (right-click → open in new tab, no JS needed for SSR), so pass an href-builder rather than an imperative `router.push`. The Laioutr [`Pagination`](/laioutr-ui/ui-kit/form/pagination) component takes an `href-template` prop for this:

```vue
<Pagination
  v-if="products"
  :total="products.pagination.total"
  :items-per-page="products.pagination.limit"
  :page="products.pagination.current"
  :href-template="({ page }) => (products ? buildQueryUrl(products, { page }) : '/')"
/>
```
::

## Worked example

A minimal filter-and-sort block that reads its state and dispatches changes through the router:

```vue
<script lang="ts">
import { defineBlock } from '#imports';

export const definition = defineBlock({
  component: 'BlockProductFiltersDemo',
  schema: [
    {
      label: 'Content',
      fields: [
        { type: 'query', entityType: 'Product', name: 'products', components: [] },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
import { buildQueryUrl, computed, definitionToProps, useRouter } from '#imports';
import type { QueryWireRequestFilter } from '@laioutr-core/orchestr/types';

const props = defineProps(definitionToProps(definition));
const router = useRouter();

const sortings = computed(() => props.products?.availableSortings ?? []);
const filters = computed(() => props.products?.availableFilters ?? []);
const activeFilters = computed(() => props.products?.filter ?? {});
const activeSorting = computed(() => props.products?.sorting);
const total = computed(() => props.products?.pagination.total ?? 0);

const onSortingChange = (sort: string) => {
  if (props.products) router.push(buildQueryUrl(props.products, { sort }));
};

const onFiltersChange = (next: QueryWireRequestFilter) => {
  if (props.products) router.push(buildQueryUrl(props.products, { resetFilters: true, addFilter: next }));
};
</script>

<template>
  <div v-if="props.products">
    <p>{{ total }} results</p>

    <select :value="activeSorting" @change="(e) => onSortingChange((e.target as HTMLSelectElement).value)">
      <option v-for="sort in sortings" :key="sort.key" :value="sort.key">{{ sort.label }}</option>
    </select>

    <FilterBar
      :filters="filters"
      :active="activeFilters"
      @update:active="onFiltersChange"
    />
  </div>
</template>
```

The Laioutr UI library ships ready-made `FilterBar` and `SortModes` components that consume these shapes directly, so most blocks do not implement the inputs themselves.

## Related

::card-group
  :::card{title="Schema fields" to="/apps/app-development/schema-fields#query"}
  Declaring a `query`-type field in a block or section schema.
  :::

  :::card{title="Filters" to="/frontend/orchestr/filters"}
  The shape of `availableFilters` and the request `filter` argument.
  :::

  :::card{title="URL Query Parameters" to="/frontend/orchestr/url-query-params"}
  Full reference for `buildQueryUrl` modifiers and URL mapping.
  :::

  :::card{title="Queries" to="/frontend/orchestr/queries"}
  How handlers produce the data that lands in `props.products`.
  :::
::
