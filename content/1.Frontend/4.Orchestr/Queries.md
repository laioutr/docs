---
title: Queries & Links
description: Queries fetch entities by input (e.g. a slug or search term). Links resolve relationships between entities (e.g. product → variants). Together they form the read-side of Orchestr.
---

A product page needs to load a product by its URL slug. A category page needs to list products belonging to that category. A cart needs to show the items it contains. **Queries** and **links** are how you teach Orchestr to fetch this data from your backend.

```mermaid
flowchart LR
    FE["Frontend"]
    O["Orchestr"]
    Q["Query Handler<br/>(by-slug)"]
    CR["Component Resolver(s)<br/>(base, prices, media)"]
    L["Link Handler<br/>(variants)"]

    FE -->|"product/by-slug<br/>{ slug: 'sneaker-pro' }"| O
    O --> Q
    Q -->|"id: 'product-123'"| O
    O --> CR
    O --> L
    CR -->|"component data"| O
    L -->|"variant ids"| O
    O -->|"assembled response"| FE
```

## Queries

A **query** takes structured input and returns one or more entity IDs. Orchestr then passes those IDs to [component resolvers](/frontend/orchestr/component-resolvers) to fetch the actual data.

### Defining a Query Token

Every query starts with a **token** — the contract between your app and the frontend. It declares the query name, entity type, input schema, and whether it returns a single entity or a list.

```ts
// src/runtime/shared/tokens/store-locator.ts
import { z } from 'zod/v4';
import { defineQueryToken } from '@laioutr-core/core-types/orchestr';

export const StoreBySlugQuery = defineQueryToken('store-locator/store/by-slug', {
  entity: 'StoreLocation',
  type: 'single',
  label: 'Store by slug',
  input: z.object({
    slug: z.string(),
  }),
});
```

For queries that return lists, set `type: 'multi'` and optionally provide a `defaultLimit` for pagination:

```ts
export const StoreSearchQuery = defineQueryToken('store-locator/store/search', {
  entity: 'StoreLocation',
  type: 'multi',
  label: 'Store search',
  input: z.object({
    query: z.string(),
    radius: z.number().optional(),
  }),
  defaultLimit: 20,
});
```

#### Query token fields

| Field          | Required | Description                                                                                     |
| -------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `entity`       | yes      | The entity type this query returns (e.g. `'Product'`, `'Category'`).                            |
| `type`         | yes      | `'single'` for one result, `'multi'` for paginated lists.                                       |
| `label`        | yes      | Human-readable name, shown in Orchestr DevTools and Studio.                                     |
| `input`        | no       | Zod schema for the query input. Omit for queries with no parameters.                            |
| `defaultLimit` | no       | Default page size for `multi` queries. When set, `pagination` is always defined in the handler. |
| `description`  | no       | Longer description for documentation and tooling.                                               |

### Writing a Query Handler

A query handler is a file in your app's `orchestr/` directory. It implements a query token and returns entity IDs.

Here is a single-entity query:

```ts
// src/runtime/server/orchestr/StoreLocation/by-slug.query.ts
import { StoreBySlugQuery } from '../../shared/tokens/store-locator';
import { defineMyAppQuery } from '../../middleware/defineMyApp';

export default defineMyAppQuery(
  StoreBySlugQuery,
  async ({ input, context }) => {
    const store = await context.storeApi.getBySlug(input.slug);

    if (!store) {
      throw createError({ statusCode: 404, message: `Store not found: ${input.slug}` });
    }

    return { id: store.id };
  },
);
```

And a multi-entity query with pagination, sorting, and filters:

```ts
// src/runtime/server/orchestr/StoreLocation/search.query.ts
import { StoreSearchQuery } from '../../shared/tokens/store-locator';
import { defineMyAppQuery } from '../../middleware/defineMyApp';

export default defineMyAppQuery({
  implements: StoreSearchQuery,
  run: async ({ input, context, pagination, sorting, filter }) => {
    const result = await context.storeApi.search({
      query: input.query,
      radius: input.radius,
      limit: pagination.limit,
      offset: pagination.offset,
      sorting,
      filter,
    });

    return {
      ids: result.stores.map((store) => store.id),
      total: result.total,
      availableSortings: [
        { key: 'distance', label: 'Distance' },
        { key: 'name', label: 'Name A-Z' },
      ],
      sorting: sorting ?? 'distance',
    };
  },
});
```

::tip
There are two syntax forms for `defineMyAppQuery`. The short form passes `(token, handlerFn)` directly — use it for simple handlers. The object form with `{ implements, run }` gives you access to additional options like `cache` and `order`.
::

### Handler arguments

| Argument              | Available       | Description                                                                               |
| --------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `input`               | always          | Parsed and validated query input, typed from the token's Zod schema.                      |
| `pagination`          | `multi` queries | `{ limit, offset, page }`. Always defined when the token sets `defaultLimit`.             |
| `sorting`             | `multi` queries | The requested sorting key, if any.                                                        |
| `filter`              | `multi` queries | Selected filters from the frontend.                                                       |
| `requestedComponents` | always          | Which components the frontend needs. Use this to skip expensive API fields.               |
| `requestedLinks`      | always          | Which links (and their nested components) the frontend needs.                             |
| `shouldLoad`          | always          | Helper to check if a component or link path is requested. Accepts a string or path array. |
| `passthrough`         | always          | Store for passing raw data to component resolvers, avoiding duplicate API calls.          |
| `context`             | always          | Middleware-provided context (API clients, config, etc.).                                  |
| `$entity`             | always          | Type-safe entity builder, same as in component resolvers.                                 |

### Returning results

**Single queries** return `{ id }` — the ID of the matching entity:

```ts
return { id: 'store-123' };
```

**Multi queries** return `{ ids, total? }` — an array of entity IDs and optionally the total count for pagination:

```ts
return {
  ids: ['store-1', 'store-2', 'store-3'],
  total: 42,
  availableSortings: [{ key: 'distance', label: 'Distance' }],
  availableFilters: [{ id: 'city', label: 'City', type: 'list', presentation: 'text', values: [{ id: 'berlin', label: 'Berlin', count: 12 }] }],
  sorting: 'distance',
};
```

### Passing data to component resolvers

When your query already fetched detailed data from the backend, pass it to component resolvers via **passthrough** so they don't make redundant API calls:

```ts
import { storeFragmentToken } from '../../const/passthroughTokens';

export default defineMyAppQuery(
  StoreBySlugQuery,
  async ({ input, context, passthrough }) => {
    const store = await context.storeApi.getBySlug(input.slug);

    // Pass the raw data so the component resolver can use it
    passthrough.set(storeFragmentToken, store);

    return { id: store.id };
  },
);
```

The component resolver then calls `passthrough.get(storeFragmentToken)` and falls back to its own API call when the data is not available. See [Component Resolvers — Using Passthrough Data](/frontend/orchestr/component-resolvers#using-passthrough-data).

### The `shouldLoad` helper

When your backend supports selective field loading (e.g. GraphQL), use `shouldLoad` to skip fields the frontend did not request:

```ts
const response = await context.queryStorefront(ProductBySlugQuery, {
  handle: input.slug,
  includeMedia: shouldLoad('media'),
  includeDescription: shouldLoad('description'),
  // Check nested link components
  includeVariantPrices: shouldLoad([ProductVariantsLink, ProductVariantPrices]),
});
```

`shouldLoad` accepts either a component name string (`'media'`) or a path array for nested link components (`[LinkToken, ComponentToken]`).

## Links

A **link** defines a relationship between two entity types — for example, a Product has Variants, or a Category has Products. Links resolve to a list of target entity IDs for each source entity.

### Defining a Link Token

```ts
// src/runtime/shared/tokens/store-locator.ts
import { defineLinkToken } from '@laioutr-core/core-types/orchestr';

export const StoreEventsLink = defineLinkToken('store-locator/store/events', {
  label: 'Store Events',
  source: 'StoreLocation',
  target: 'StoreEvent',
  type: 'multi',
  defaultLimit: 10,
});
```

#### Link token fields

| Field          | Required | Description                                                         |
| -------------- | -------- | ------------------------------------------------------------------- |
| `source`       | yes      | The source entity type (e.g. `'Product'`).                          |
| `target`       | yes      | The target entity type (e.g. `'ProductVariant'`).                   |
| `type`         | yes      | `'single'` for one-to-one, `'multi'` for one-to-many relationships. |
| `label`        | yes      | Human-readable name for tooling.                                    |
| `defaultLimit` | no       | Default page size for `multi` links.                                |
| `description`  | no       | Longer description for documentation.                               |
| `nullable`     | no       | Whether the link can be absent for some source entities.            |

### Writing a Link Handler

Link handlers are files in your app's `orchestr/` directory. They receive source entity IDs and return the target IDs for each source.

```ts
// src/runtime/server/orchestr/StoreLocation/events.link.ts
import { StoreEventsLink } from '../../shared/tokens/store-locator';
import { defineMyAppLink } from '../../middleware/defineMyApp';

export default defineMyAppLink(
  StoreEventsLink,
  async ({ entityIds, context, pagination }) => {
    const results = await context.storeApi.getEvents(entityIds, {
      limit: pagination?.limit ?? 10,
    });

    return {
      links: results.map((result) => ({
        sourceId: result.storeId,
        targetIds: result.events.map((event) => event.id),
        entityTotal: result.totalEvents,
      })),
    };
  },
);
```

Like query handlers, link handlers also support the object form with `{ implements, run, cache }` for additional configuration.

### Link handler arguments

| Argument      | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| `entityIds`   | Source entity IDs to resolve links for.                       |
| `pagination`  | `{ limit, offset, page }` when the token sets `defaultLimit`. |
| `sorting`     | Requested sorting key.                                        |
| `filter`      | Selected filters.                                             |
| `passthrough` | Access data passed from query handlers.                       |
| `$entity`     | Type-safe entity builder for inline entity data.              |

### Returning link results

**Multi links** return an array of `{ sourceId, targetIds }` mappings:

```ts
return {
  links: [
    { sourceId: 'store-1', targetIds: ['event-1', 'event-2'], entityTotal: 5 },
    { sourceId: 'store-2', targetIds: ['event-3'], entityTotal: 1 },
  ],
};
```

**Single links** return `{ sourceId, targetId }` (singular) per entry:

```ts
return {
  links: [
    { sourceId: 'product-1', targetId: 'brand-abc' },
  ],
};
```

## Caching

Both query and link handlers support caching with a `cache` property:

```ts
export default defineMyAppQuery({
  implements: StoreSearchQuery,
  cache: {
    strategy: 'ttl',
    ttl: '1 hour',
    buildCacheKey: ({ input, pagination }) =>
      `${input.query}-${pagination.limit}-${pagination.offset}`,
  },
  run: async (args) => { /* ... */ },
});
```

| Strategy | Behavior                                                                      |
| -------- | ----------------------------------------------------------------------------- |
| `ttl`    | Cache the result for a fixed duration.                                        |
| `swr`    | Stale-while-revalidate — serve stale data while refreshing in the background. |
| `live`   | Disable caching (useful to explicitly mark a handler as uncacheable).         |

The `buildCacheKey` function receives the handler arguments and must return a unique string key. Return `null` or `undefined` to skip caching for a specific request.

See [Caching](/frontend/orchestr/caching) for the full reference.

## File Organization

All files inside the `orchestr/` directory registered with [`registerLaioutrApp`](/apps/app-development/app-starter) are auto-loaded — every exported handler (query, link, component resolver, action) is automatically discovered and registered. No special file suffixes or naming conventions are required.

That said, the existing Laioutr apps use a convention of `.query.ts`, `.link.ts`, `.resolver.ts` suffixes to make the handler type obvious at a glance:

```text
src/runtime/server/orchestr/
├── Product/
│   ├── bySlug.query.ts
│   ├── search.query.ts
│   └── base.resolver.ts
├── Category/
│   ├── bySlug.query.ts
│   └── products.link.ts
├── StoreLocation/
│   ├── by-slug.query.ts
│   ├── search.query.ts
│   └── events.link.ts
└── plugins/
    └── zodFix.ts
```

The directory structure and file names are purely organizational — use whatever makes sense for your team.
