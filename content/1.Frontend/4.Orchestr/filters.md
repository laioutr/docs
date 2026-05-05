---
title: Filters
description: Request and response shapes for filters in query handlers and link handlers, including faceted search and well-known filter names.
seo:
  title: Filters | Laioutr
  description: Request and response shapes for filters in query handlers and link handlers, including faceted search and well-known filter names.
sitemap:
  loc: /frontend/orchestr/filters
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9
---

A customer narrows a product listing by color, picks a price range, and toggles "in stock". Two things have to line up for that to work: your handler needs to know which filters the customer selected, and the response needs to describe which filters and values are still available so the UI can render the next round of choices.

This page documents both sides of that contract: the **request** shape your handler receives in its `filter` argument, and the **response** shape your handler returns under `availableFilters`. The same shapes apply to query handlers and link handlers; the filter contract is identical for both.

## Request format

When a multi-query or multi-link runs, the handler receives the user's selected filters as a record from filter id to value:

```ts twoslash
import type { QueryWireRequestFilter } from '@laioutr-core/orchestr/types';
// ---cut---
const filter: QueryWireRequestFilter = {
  color: ['red', 'blue'],
  inStock: true,
  price: { min: 1000, max: 5000 },
};
```

Filter values use one of three shapes:

| Type    | TypeScript                       | Example          |
| ------- | -------------------------------- | ---------------- |
| List    | `string[]`                       | `['red', 'blue']` |
| Boolean | `boolean`                        | `true`           |
| Range   | `{ min?: number, max?: number }` | `{ min: 1000 }`  |

Range filters can have `min`, `max`, or both. The other side stays `undefined` when only one bound is set.

### Detecting range filters

Filter values are a discriminated union by shape rather than by tag, so use the `isRangeFilter` helper from `@laioutr-core/orchestr/types` to narrow safely:

```ts twoslash
import type { QueryWireRequestFilter } from '@laioutr-core/orchestr/types';
import { isRangeFilter } from '@laioutr-core/orchestr/types';
// ---cut---
function mapFilters(filter: QueryWireRequestFilter) {
  for (const id in filter) {
    const value = filter[id];
    if (isRangeFilter(value)) {
      // value: { min?: number, max?: number }
    } else if (typeof value === 'boolean') {
      // boolean filter
    } else {
      // list filter (string[])
    }
  }
}
```

For how these values arrive in the URL, see [URL Query Parameters](/frontend/orchestr/url-query-params#filter-types).

## Response format

A multi-query or multi-link handler describes the facets available for the current result set under `availableFilters`. Each entry is one of four variants, distinguished by `type`:

| Type        | When to use                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `list`      | A discrete set of values, optionally with counts and swatches.         |
| `boolean`   | A single yes/no toggle (in stock, on sale, free shipping).             |
| `range`     | A continuous numeric range with `min` and `max` bounds.                |
| `intervals` | Pre-bucketed ranges with counts (e.g. price brackets).                 |

### Common fields

All variants share the same base:

::field-group
  :::field{name="id" :required="true" type="string"}
  Stable identifier for this filter. Used as the key in the `filter` request and in URL query params.
  :::

  :::field{name="label" :required="true" type="string"}
  Human-readable name for the filter, shown in the UI.
  :::

  :::field
  ---
  name: type
  required: true
  type: "'list' | 'boolean' | 'range' | 'intervals'"
  ---
  Discriminator for the variant.
  :::

  :::field{name="wellKnownName" type="WellKnownFilterName"}
  Optional cosmetic hint. See [Well-known filter names](#well-known-filter-names).
  :::
::

### List filters

A list filter offers a fixed set of choices the user can multi-select.

```ts twoslash
import type { AvailableFilter } from '@laioutr-core/orchestr/types';
// ---cut---
const colorFilter: AvailableFilter = {
  type: 'list',
  id: 'color',
  label: 'Color',
  wellKnownName: 'color',
  presentation: 'swatch',
  values: [
    { id: 'red', label: 'Red', count: 12, swatch: ['color', '#ff0000'] },
    { id: 'blue', label: 'Blue', count: 8, swatch: ['color', '#0000ff'] },
  ],
};
```

::field-group
  :::field
  ---
  name: presentation
  required: true
  type: "'text' | 'swatch'"
  ---
  Rendering hint: text labels or visual swatches. Values without a `swatch` field are allowed but may render blank.
  :::

  :::field{name="values" :required="true" type="AvailableFilterListValue[]"}
  The selectable values.
  :::
::

Each list value has the following shape:

::field-group
  :::field{name="values[].id" :required="true" type="string"}
  The value passed back in the `filter` request when selected.
  :::

  :::field{name="values[].label" :required="true" type="string"}
  The label shown in the UI.
  :::

  :::field{name="values[].count" type="number"}
  How many results match if this value is selected. May be approximate.
  :::

  :::field{name="values[].swatch" type="Swatch"}
  Visual representation: a single color, multiple colors, a gradient, or an image. See `Swatch` in `@laioutr-core/core-types/common`.
  :::
::

### Boolean filters

A boolean filter is a single on/off toggle.

```ts twoslash
import type { AvailableFilter } from '@laioutr-core/orchestr/types';
// ---cut---
const inStockFilter: AvailableFilter = {
  type: 'boolean',
  id: 'inStock',
  label: 'Availability',
  wellKnownName: 'in-stock',
  trueLabel: 'In stock',
  falseLabel: 'Out of stock',
  trueCount: 142,
  falseCount: 18,
};
```

::field-group
  :::field{name="trueLabel" type="string"}
  Label for the true state, when "yes" needs different wording than the filter's main label.
  :::

  :::field{name="falseLabel" type="string"}
  Label for the false state.
  :::

  :::field{name="trueCount" type="number"}
  Result count if the filter is set to `true`. May be approximate.
  :::

  :::field{name="falseCount" type="number"}
  Result count if the filter is set to `false`. May be approximate.
  :::
::

### Range filters

A range filter offers a continuous numeric range. The `min` and `max` bounds describe the range itself, not the selected window. The selected window comes back in the `filter` request as `{ min?, max? }`.

```ts twoslash
import type { AvailableFilter } from '@laioutr-core/orchestr/types';
// ---cut---
const priceFilter: AvailableFilter = {
  type: 'range',
  id: 'price',
  label: 'Price',
  wellKnownName: 'price',
  min: { amount: 0, currency: 'EUR' },
  max: { amount: 99900, currency: 'EUR' },
};
```

::field-group
  :::field
  ---
  name: min
  required: true
  type: "number | Money | Measurement"
  ---
  Lower bound of the range. Use `Money` for currency-denominated ranges and `Measurement` for physical quantities (weight, length, volume).
  :::

  :::field
  ---
  name: max
  required: true
  type: "number | Money | Measurement"
  ---
  Upper bound of the range. Same shape as `min`.
  :::
::

The request side is always plain numbers, so when responding with `Money` or `Measurement` your handler is responsible for matching the user's selected `{ min, max }` (in plain numbers) against the right unit or currency. For `Money`, the request numbers are interpreted in the smallest unit of currency (`Money.amount`), so a `{ min: 1000, max: 5000 }` selection against an EUR price filter means 10.00 EUR to 50.00 EUR.

### Intervals filters

An intervals filter is a pre-bucketed range. Use it when you want to show "0 to 25", "25 to 50", "50 to 100" with counts rather than a continuous slider.

```ts twoslash
import type { AvailableFilter } from '@laioutr-core/orchestr/types';
// ---cut---
const priceBucketsFilter: AvailableFilter = {
  type: 'intervals',
  id: 'price',
  label: 'Price',
  wellKnownName: 'price',
  intervals: [
    { min: 0, max: 25, count: 42 },
    { min: 25, max: 50, count: 31 },
    { min: 50, max: 100, count: 18 },
  ],
};
```

::field-group
  :::field
  ---
  name: intervals
  required: true
  type: "Array<{ min: number | Money | Measurement, max: number | Money | Measurement, count?: number }>"
  ---
  Each interval has the same `min`/`max` shape as a range filter, plus an optional `count` of matching results.
  :::
::

The user's selection still arrives in the `filter` request as a `{ min, max }` range, so handlers can treat the request side identically whether they responded with `range` or `intervals`.

## Well-known filter names

Some filter ids are common across catalogs (color, price, size, brand). The optional `wellKnownName` field lets the UI apply consistent icons or grouping without your handler having to use a specific id.

::warning
`wellKnownName` is **cosmetic only**. It does not imply the filter's `type` or `presentation`. A filter with `wellKnownName: 'color'` could be a `list` of swatches, a `list` of text labels, or any other variant.
::

The exported enum lists the well-known names:

```ts twoslash
import { WellKnownFilterName } from '@laioutr-core/orchestr/types';
// ---cut---
WellKnownFilterName.color;       // 'color'
WellKnownFilterName.price;       // 'price'
WellKnownFilterName.inStock;     // 'in-stock'
WellKnownFilterName.bestSeller;  // 'best-seller'
```

The `wellKnownName` field accepts any string, so you can use names outside this list. Stick to the well-known set when possible so frontends can recognize them without app-specific configuration. When picking new names, the [Shopify product taxonomy](https://shopify.github.io/product-taxonomy/releases/unstable/attributes/) is a useful reference for sensible attribute identifiers.

## Mapping example

A typical search handler maps facet data from an upstream API into the response shape, and selected filters into the upstream API's request shape. The pattern from the battery-included integration:

```ts
import type { AvailableFilter, QueryWireRequestFilter } from '@laioutr-core/orchestr/types';
import { isRangeFilter } from '@laioutr-core/orchestr/types';

export const mapFacetsToAvailableFilters = (facets: Facet[]): AvailableFilter[] => {
  return facets.map((facet) => {
    if (facet.type === 'select') {
      return {
        type: 'list',
        id: facet.field_name,
        label: facet.field_label,
        presentation: 'text',
        values: facet.counts.map((c) => ({ id: c.value, label: c.value, count: c.count })),
      };
    }
    return {
      type: 'range',
      id: facet.field_name,
      label: facet.field_label,
      min: facet.stats.min,
      max: facet.stats.max,
    };
  });
};

export const mapSelectedFiltersToApi = (filters: QueryWireRequestFilter) => {
  const params: Record<string, unknown> = {};
  for (const id in filters) {
    const value = filters[id];
    if (isRangeFilter(value)) {
      params[`f[${id}][from]`] = value.min ?? Number.MIN_SAFE_INTEGER;
      params[`f[${id}][till]`] = value.max ?? Number.MAX_SAFE_INTEGER;
    } else {
      params[`f[${id}]`] = value;
    }
  }
  return params;
};
```

The query handler then wires both sides together:

```ts
return {
  ids: data.hits.map((hit) => hit.id),
  total: data.found,
  availableFilters: mapFacetsToAvailableFilters(data.facet_counts),
};
```

## Consuming in a block or section

For how blocks and sections read `availableFilters` / `availableSortings` and update the URL when the user picks one, see [Consuming Query Fields](/apps/app-development/consuming-query-fields).

## Related

::card-group
  :::card{title="Queries" to="/frontend/orchestr/queries"}
  How query handlers and link handlers receive filters and return results.
  :::

  :::card{title="URL Query Parameters" to="/frontend/orchestr/url-query-params"}
  How the request `filter` shape maps to URL query strings.
  :::

  :::card{title="Wire Format" to="/frontend/orchestr/wire-format"}
  Where `availableFilters` appears in the streamed `queryResult` chunk.
  :::
::
