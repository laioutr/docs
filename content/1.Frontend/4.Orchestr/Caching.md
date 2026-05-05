---
title: Caching
description: How Orchestr caches API data — query cache, link cache, and component cache. Configure strategies and cache keys for your own integrations.
links: []
seo:
  title: Caching | Laioutr
  description: How Orchestr caches API data — query cache, link cache, and component cache. Configure strategies and cache keys for…
sitemap:
  loc: /frontend/orchestr/caching
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

Orchestr caches results from query handlers, link handlers, and component resolvers so repeated requests skip external API calls. The cache layer is built on [unstorage](https://unstorage.unjs.io) (Nitro's storage abstraction), so you can swap drivers (in-memory, Redis, etc.) per environment.

By default, handlers are **not cached**. You opt in per handler by adding a `cache` property.

## Cache layers

Orchestr maintains three separate cache layers, all stored under the `cache:orchestr:internal` namespace with different prefixes:

| Layer          | Cached data                                                        | Key shape                                          | Configured on              |
| -------------- | ------------------------------------------------------------------ | -------------------------------------------------- | -------------------------- |
| **Queries**    | Query handler results (IDs, totals, filters, optional passthrough) | `{token}:{buildCacheKey(args)}`                    | Query handler `cache`      |
| **Links**      | Link handler results (source/target ID mappings)                   | `{token}:{buildCacheKey(args)}`                    | Link handler `cache`       |
| **Components** | Resolved entity components (per entity, per component)             | `{entityType}:{entityId}:{component}:{keySuffix?}` | Component resolver `cache` |

## Strategies for queries and links

Query and link handlers use the same cache config shape:

```ts
cache: {
  strategy: 'ttl' | 'swr' | 'live',
  ttl: '10 minutes',  // HumanTtl: number (seconds) or string ('1 day', '2h')
  buildCacheKey: (args) => string | null | undefined,
  includePassthrough?: boolean,  // queries only
}
```

| Strategy | Behavior                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `live`   | No caching. Handler runs on every request.                                                                                                               |
| `ttl`    | Cached for a fixed duration using the storage driver's native TTL. Entry is evicted after expiry.                                                        |
| `swr`    | Cached with an application-level expiry timestamp. On read, expired entries are removed and the handler runs again. The `ttl` field is optional for SWR. |

`buildCacheKey` receives the handler arguments and must return a unique string. Return `null` or `undefined` to skip caching for that particular request.

### Query cache example

```ts
export default defineMyAppQuery({
  implements: ProductsByCategorySlugQuery,
  cache: {
    strategy: 'ttl',
    ttl: '1 day',
    buildCacheKey({ input, pagination, filter, sorting }) {
      // Only cache unfiltered first page
      if (filter || (pagination && pagination.offset > 0)) return null;
      return `${input.categorySlug}:${sorting ?? 'default'}`;
    },
  },
  run: async (args) => { /* ... */ },
});
```

### Link cache example

```ts
export default defineMyAppLink({
  implements: ProductVariantsLink,
  cache: {
    strategy: 'ttl',
    ttl: '1 day',
    buildCacheKey({ entityIds }) {
      return entityIds.sort().join(',');
    },
  },
  run: async (args) => { /* ... */ },
});
```

### Passthrough and query cache

When a query handler stores data in `passthrough` that component resolvers depend on, set `includePassthrough: true`. The cache then stores and restores the passthrough dump alongside the query result. If a cached entry was stored without passthrough but the current request needs it, the cache returns a miss so the handler re-runs.

## Component cache

The component cache stores resolved entity components per entity ID and component name. On each request, Orchestr:

1. Checks the cache for all requested `(entityId, component)` pairs
2. Runs component resolvers only for missing pairs
3. Writes newly resolved components back to the cache

This means different components can have different TTLs (e.g. product names cached for a day, prices for 15 minutes).

### Configuration

```ts
export default defineMyAppComponentResolver({
  entityType: 'Product',
  provides: [ProductBase, ProductPrices, ProductMedia],
  cache: {
    ttl: '1 day',
    swr: false,         // optional: use SWR semantics
    getKeySuffix: () => useRuntimeConfig().public.locale ?? 'default',
    components: {
      prices: { ttl: '15 minutes' },
    },
  },
  resolve: async (args) => { /* ... */ },
});
```

| Option         | Description                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ttl`          | Default TTL for all components from this resolver.                                                                                                                                   |
| `swr`          | When `true`, uses application-level expiry instead of storage driver TTL.                                                                                                            |
| `getKeySuffix` | Returns a suffix appended to cache keys (e.g. locale, channel). Same entity cached separately per suffix. Must not reference handler arguments; use `useRuntimeConfig()` or similar. |
| `components`   | Per-component overrides. Keys are component names (e.g. `'prices'`), values override `ttl` and `swr`.                                                                                |
| `enabled`      | Set to `false` to disable caching for this resolver.                                                                                                                                 |

## Storage and drivers

Orchestr registers two storage namespaces:

- `cache:orchestr:internal`: used by the three cache layers above
- `cache:orchestr:userland`: for app-level cached helpers (see below)

In development, both use **LRU in-memory** drivers (max 5000 entries). In production, configure a persistent driver (e.g. Redis) via Nitro storage config for durable or shared caching across instances.

### Clearing the cache

```text
POST /api/laioutr/orchestr/clear-cache
```

Clears both internal and userland caches. Restrict access in production.

## Userland cache

For data outside query/link/component results (e.g. aggregated counts, resolved SEO URLs, system config), use `useUserlandCache` so the data is cleared together with the orchestr cache. It returns a typed unstorage instance scoped to `cache:orchestr:userland:{prefix}`.

```ts
import { useUserlandCache } from '#imports';

export const getCategoryTotal = async (
  adminClient: AdminApiClient,
  categoryId: string
): Promise<number | undefined> => {
  const cache = useUserlandCache<number>('shopify/categoryTotal');

  const cached = await cache.getItem(categoryId);
  if (typeof cached === 'number') {
    return cached;
  }

  const total = await fetchTotalFromApi(adminClient, categoryId);
  if (total !== undefined) {
    await cache.setItem(categoryId, total);
  }

  return total;
};
```

The cache prefix keeps keys organized per app and concern. Since this is a standard unstorage instance, you have access to `getItem`, `setItem`, `removeItem`, `getKeys`, and all other [unstorage methods](https://unstorage.unjs.io/usage).

For function-level caching with automatic key management, you can also use Nitro's `defineCachedFunction` with `base: ORCHESTR_CACHE_KEY_USERLAND`.

::tip
For two patterns that come up across every connector (fire-and-forget background writes via `event.waitUntil`, and multi-tenant cache key composition), see the [Userland cache patterns](/frontend/orchestr/recipes/userland-cache-patterns) recipe.
::
