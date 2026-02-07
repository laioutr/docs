---
title: Caching
description: How Orchestr caches API data — query cache, link cache, and component cache. Configure strategies and cache keys for your own integrations.
---

Orchestr caches data from queries, links, and component resolvers so repeated requests can be served from storage instead of calling external APIs every time. This reduces latency and load on your backends. The cache layer lives in **@laioutr-core/orchestr** and is built on **unstorage** (Nitro’s storage abstraction), so you can use in-memory, Redis, or other drivers in production.

This page gives a **broad overview** of the three cache layers, the strategies and options each supports, and **how you can use them** when building your own query, link, and component resolver handlers for custom API integrations.

## Overview: the three cache layers

| Layer | What is cached | Where it’s used | Configured on |
|-------|----------------|-----------------|---------------|
| **Query cache** | Result of a **query handler** (e.g. product search, category listing). | Before/after `runQuery()` in the query runner. | Query handler’s `cache` option. |
| **Link cache** | Result of a **link handler** (e.g. product variants, menu items). | Before/after `runLink()` in the link runner. | Link handler’s `cache` option. |
| **Component cache** | Resolved **entity components** per entity and component (e.g. product prices, product media). | Inside `executeComponentResolvers()`: batch get, then resolve only missing entity/component pairs, then set. | Component resolver’s `cache` option (and per-component overrides). |

All three layers use the same **internal** storage namespace (`cache:orchestr:internal`) with different prefixes (`queries`, `links`, `components`). There is also a **userland** namespace (`cache:orchestr:userland`) for app-level cached helpers (e.g. `defineCachedFunction`), which you can use for things like image metadata or other non-orchestr API results.

**Cache key shape:**

- **Query cache:** `token:buildCacheKey(args)` — you define `buildCacheKey(args)` so the key reflects query input (e.g. category slug, sort, filter, pagination).
- **Link cache:** Same idea — `token:buildCacheKey(args)`.
- **Component cache:** `entityType:entityId:component:keySuffix` — built from the requested entities and components; optional `getKeySuffix()` per component for things like locale or channel.

If you **don’t** configure cache on a handler, or you use strategy **`live`**, that handler is **not cached** and runs on every request.

## Storage: internal vs userland, dev vs production

- **useInternalCache(prefix)** — Used by the three layers above. Prefixes: `queries`, `links`, `components`. Keys are namespaced under `cache:orchestr:internal`.
- **useUserlandCache(prefix)** — For your own cached data (e.g. `defineCachedFunction` with `base: ORCHESTR_CACHE_KEY_USERLAND`). Cleared together with internal cache by the clear-cache endpoint.

In **development**, the orchestr package mounts **LRU in-memory** drivers for both namespaces (max 5000 entries each) so caching works out of the box. In **production**, Nitro’s default storage is used unless you configure something else (e.g. Redis via Nitro/unstorage). For durable or shared cache across instances, configure a persistent storage driver for `cache:orchestr:internal` and optionally for `cache:orchestr:userland`.

**Clearing the cache:** A dedicated endpoint clears both internal and userland caches: `POST .../api/laioutr/orchestr/clear-cache`. Use it after content deploys or when debugging. Restrict access in production.

## Cache strategies (query and link)

Query and link handlers share the same strategy types. You set **strategy** and optionally **ttl** and **buildCacheKey**.

| Strategy | Meaning | When to use |
|----------|--------|-------------|
| **`live`** | No caching. Every request runs the handler. | Real-time or user-specific data, or when you explicitly don’t want cache. |
| **`ttl`** | Cache for a fixed time. After TTL the entry is invalid; next request runs the handler again. | Catalog data that can be stale for a few minutes or hours (e.g. category listing, menu). |
| **`swr`** | Stale-while-revalidate: store with an expiry; implementation may serve stale and revalidate. | Data where serving slightly stale is acceptable (e.g. product list, variants). |

**TTL (time-to-live)** is expressed as **HumanTtl**: either a number of **seconds** or a string parseable by [ms](https://github.com/vercel/ms), e.g. `'10 minutes'`, `'1 day'`, `'1h'`.

- For **`ttl`**, the backend uses the storage driver’s TTL so entries are removed after that time.
- For **`swr`**, the value is stored with an `expires` timestamp; on get, expired entries are removed and the caller gets a miss (so the handler runs again).

**buildCacheKey(args)** — Function that returns a string key from the handler arguments (e.g. `input`, `pagination`, `sorting`, `filter`). Return `null` or `undefined` to **disable caching** for that call. The key must uniquely represent the request; same key → same cached result.

---

### Using the query cache in your API integration

Attach a **cache** object to your query handler. You must implement **buildCacheKey** so the key reflects whatever makes the result unique (e.g. category slug, sort, filters, pagination). If you omit **buildCacheKey** or the token’s strategy is **live**, the query is not cached.

Example: cache a category listing only for “landing” requests (e.g. first page, no filter), with TTL 1 day:

```ts
import { defineMyAppQuery } from '../middleware/defineMyApp';
import { ProductsByCategorySlugQuery } from '@laioutr-core/canonical-types/ecommerce';

export default defineMyAppQuery({
  implements: ProductsByCategorySlugQuery,
  cache: {
    strategy: 'ttl',
    ttl: '1 day',
    buildCacheKey({ pagination, filter, sorting, input }) {
      return isLandingPage({ pagination, filter })
        ? `${input.categorySlug}:${sorting ?? 'default'}`
        : null; // don't cache filtered/paginated views
    },
  },
  run: async ({ input, context, requestedComponents, ... }) => {
    // ... call your API, return ids/total/entities
  },
});
```

Example: cache a menu by alias for 10 minutes:

```ts
cache: {
  strategy: 'ttl',
  ttl: '10 minutes',
  buildCacheKey({ input }) {
    return input.alias;
  },
},
```

**Query cache and passthrough:** Query results can optionally store **passthrough** data (e.g. raw API responses shared with component resolvers in the same request). If your handler sets **includePassthrough: true**, the cache will store and restore that dump; a later request that needs passthrough will get a cache miss if the stored entry has no passthrough. Use this when resolvers depend on the same query’s passthrough.

---

### Using the link cache in your API integration

Same idea as the query cache: add **cache** to your link handler with **strategy**, **ttl**, and **buildCacheKey(args)**.

Example: cache product variants for 1 day, keyed by product ID (from link args):

```ts
export default defineMyAppLink({
  implements: ProductVariantsLink,
  cache: {
    strategy: 'ttl',
    ttl: '1 day',
    buildCacheKey({ input }) {
      return input.productId;
    },
  },
  run: async ({ input, context, ... }) => {
    // ... fetch variants from your API, return { links: [...] }
  },
});
```

Use **strategy: 'swr'** when you’re fine with occasionally stale link data and want to reduce load on your API.

---

## Component cache

The **component cache** stores resolved **entity components** (e.g. product base, product prices, product media) per **entity type**, **entity ID**, and **component name**. When the frontend requests a set of entities and components, the orchestr:

1. Builds cache keys for all (entityId, component) pairs that have cache config.
2. Batch-gets from the component cache.
3. Determines which entity/component combinations are **missing** (or partially missing).
4. Runs component resolvers **only for those**.
5. Writes new/partial results back into the cache.

So you avoid re-fetching the same entity components on every request, and you can give **different TTLs per component** (e.g. prices 15 minutes, base 1 day).

**Configuration** is on the **component resolver**: a root **cache** object and optionally **cache.components** to override per component.

| Option | Meaning |
|--------|--------|
| **cache.enabled** | Omit or `true` to enable; `false` to disable. |
| **cache.ttl** | HumanTtl for this resolver (or per component). |
| **cache.swr** | If true, use SWR semantics for this resolver (or per component). |
| **cache.components** | Map of component name → `{ ttl?, swr? }` to override the root ttl/swr for specific components. |
| **cache.getKeySuffix()** | Optional function returning a string (e.g. locale, channel). Appended to the cache key so the same entity/component can be cached separately per suffix. |

---

### Using the component cache in your API integration

Attach **cache** to your component resolver. All requested components from this resolver will use the root cache config unless you override in **components**.

Example: cache product resolver with 1 day default, but prices for 15 minutes (e.g. Shopify/Shopware-style):

```ts
export default defineMyAppComponentResolver({
  label: 'My API Product Connector',
  entityType: 'Product',
  provides: [ProductBase, ProductPrices, ProductMedia],
  cache: {
    ttl: '1 day',
    components: {
      prices: { ttl: '15 minutes' },
    },
  },
  resolve: async ({ entityIds, context, requestedComponents, passthrough }) => {
    // ... fetch from your API, return { entities: [...] }
  },
});
```

If your API response depends on locale or channel, implement **getKeySuffix** so different contexts get different cache entries:

```ts
cache: {
  ttl: '1 day',
  getKeySuffix() {
    return context.locale ?? 'default';
  },
},
```

The cache key will then include that suffix (e.g. `Product:abc123:prices:en`), so en and de don’t share the same entry.

---

## Userland cache for your own API or helpers

For data that is **not** the direct result of a query/link/resolver (e.g. image metadata, computed lookups), use the **userland** namespace so it’s still part of the same “orchestr cache” and gets cleared with the clear-cache endpoint.

Example: cache image metadata by URL for 7 days (e.g. app-adobe-commerce pattern):

```ts
import { defineCachedFunction, ORCHESTR_CACHE_KEY_USERLAND } from '#imports';

export const getImageMetadataForURL = defineCachedFunction(
  async (url: string | null | undefined) => {
    if (!url) return fallback;
    const result = await probe(url, { signal });
    return { width: result.width, height: result.height, ... };
  },
  {
    base: ORCHESTR_CACHE_KEY_USERLAND,
    name: 'getImageMetadataForURL',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
);
```

Use **useUserlandCache(prefix)** if you need direct get/set instead of a cached function.

---

## Summary: how to use the layers for your API

- **Query handlers:** Add **cache: { strategy, ttl?, buildCacheKey(args), includePassthrough? }**. Use **live** to disable cache, **ttl** or **swr** with a safe **buildCacheKey** (and optional **includePassthrough**) to cache API responses.
- **Link handlers:** Same **cache** shape: **strategy**, **ttl**, **buildCacheKey(args)**. Key by whatever identifies the link result (e.g. product ID, menu alias).
- **Component resolvers:** Add **cache: { ttl, swr?, components?: { [component]: { ttl?, swr? } }, getKeySuffix? }**. Use **components** to give cheaper or more volatile components (e.g. prices) a shorter TTL.
- **Other API or helpers:** Use **userland** (e.g. **defineCachedFunction** with **ORCHESTR_CACHE_KEY_USERLAND** or **useUserlandCache**) so your cached data is still cleared with the rest of the orchestr cache.

Together, these layers let you cache at the right granularity (full query result, link result, or per-entity per-component) and control freshness per handler and per component with TTL and optional SWR.
