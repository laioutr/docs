---
title: Caching
description: How Orchestr caches API data — query cache, link cache, and component cache. Configure strategies and cache keys for your own integrations.
links: []
seo:
  title: Caching
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

Orchestr maintains four separate cache layers, all stored under the `cache:orch:i` namespace with different prefixes (`q`, `l`, `c`, `pi`):

| Layer           | Cached data                                                        | Key shape                                          | Configured on              |
| --------------- | ------------------------------------------------------------------ | -------------------------------------------------- | -------------------------- |
| **Queries**     | Query handler results (IDs, totals, filters, optional passthrough) | `{token}:{env}:{offset}-{limit}:{sort}:{filters}:{input}` | Query handler `cache` |
| **Links**       | Link handler results, one entry per source entity                  | `{sourceType}:{sourceId}:{token}:{env}:{offset}-{limit}:{sort}:{filters}` | Link handler `cache` |
| **Components**  | Resolved entity components (per entity, per component)             | `{entityType}:{entityId}:{component}:{env}:{keySuffix?}` | Component resolver `cache` |
| **Page index**  | Enumerated pages, search results, counts, locate results           | `{tier}:{pageType}:{market}:{locale}:…`            | Page index `cache`         |

The page-index layer follows its own rules: it is on by default, keys itself from the resolved market and locale rather than from a `buildCacheKey`, and serves stale while refreshing. See [Page Index caching](/frontend/orchestr/page-index#caching).

## The automatic client-env segment

Every cache key carries a segment derived from the [client environment](/frontend/orchestr/client-env), so a multi-language storefront can never serve cross-locale data:

```
{locale}:{currency}:{market}:{published|preview}
```

Those four values are digested into one short segment. It deliberately does **not** widen as `ClientEnv` grows, because a field added for some other reason would silently rotate every cache key.

### Adding a dimension of your own

When your responses vary on something those four do not cover — a customer group, a price list, a store selection — contribute a segment from a Nitro plugin:

```ts
// server/plugins/cacheKey.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('orchestr:client-env-key:build', ({ clientEnv, parts }) => {
    const group = clientEnv.custom?.customerGroup;
    if (group) parts.push(`cg:${group}`);
  });
});
```

One handler reaches every cache layer, because queries, links, component resolvers and the page index all digest the same segment.

Three things to know:

- **Handlers run synchronously.** A handler cannot await. Resolve the value into `clientEnv.custom` earlier in the request and read it here.
- **Contributions are sorted, then joined to the four base values.** Two plugins key the same entry whichever registers first, and no handler can drop the market and let two of them share an entry.
- **Registering a handler rotates every cache key** for that project at the next deploy. That is correct, because the responses now vary on a dimension they did not before, but the first requests after the deploy all miss.

Contribute only what the response actually varies on. Push a request id and every request keys its own entry, which is a cache that never hits.

### Per-handler suffixes

A handler that varies on something no other handler does appends a scalar instead — `buildCacheKey` for queries and links, `getKeySuffix` for component resolvers:

```ts
getKeySuffix: (clientEnv) => clientEnv.market.slug,
```

`getKeySuffix` **extends** the environment segment rather than replacing it, so a resolver can never accidentally drop the market and let two storefronts share an entry.

Return a scalar, never `clientEnv` itself: `market` and `language` are cyclic, so `JSON.stringify(clientEnv)` throws.

::caution
[Content preview](/frontend/features/content-preview) bypasses all three cache layers entirely — a preview request behaves as if every handler were `strategy: 'live'`, reading nothing and writing nothing. Unpublished content is never stored and can never be served to a shopper.
::

## Strategies for queries and links

Query and link handlers use the same cache config shape:

```ts
cache: {
  strategy: 'ttl' | 'swr' | 'live',
  ttl: '10 minutes',          // HumanTtl: number (seconds) or string ('1 day', '2h')
  staleMaxAge?: '2 hours',    // swr only; defaults to '24 hours'

  pages?: 'first' | 'all',            // default 'first'
  filters?: boolean | string[],       // default false

  buildCacheKey?: (args) => string | null | undefined,
  shouldBypassCache?: (args) => boolean,
  includePassthrough?: boolean,       // queries only
}
```

| Strategy | Behavior                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `live`   | No caching. Handler runs on every request.                                                                                                               |
| `ttl`    | Cached for a fixed duration using the storage driver's native TTL. Entry is evicted after expiry.                                                        |
| `swr`    | Cached for `ttl`, then served stale for `staleMaxAge` while the handler re-runs behind the response. A refresh that fails keeps the last good value until the stale window closes. |

An entry occupies storage for `ttl` plus `staleMaxAge`, so a long stale window trades footprint for a cache that survives an upstream outage. Two concurrent readers of one stale entry schedule a single refresh.

### Which requests are cached

Orchestr caches the first slice of a listing, unfiltered, and nothing else. The tail of a listing is cold, and a filter combination is unbounded, so both are opted into rather than out of.

| Option | Default | Widen it with |
| ------ | ------- | ------------- |
| `pages` | `'first'` — only `offset === 0` | `'all'` |
| `filters` | `false` — unfiltered requests only | `true`, or an allowlist of filter ids |

An allowlist entry asserts that the filter's value set is **bounded**. A boolean availability filter is a good candidate. A price range is not — every bracket a shopper drags would mint an entry.

`shouldBypassCache` refuses a request the two options above would admit. It runs after them and can only narrow them. Widening them is always safe: Orchestr keys the full request shape either way, so a wider gate changes *whether* an entry is written, never *what* it is keyed by.

### Building the key yourself

You usually should not. Orchestr keys the token, the environment, the requested slice, the sorting, the filters, and — for queries — the token's input. A token declaring a single property keys on that property's value, so a `by-slug` key stays readable.

`buildCacheKey` replaces only the trailing input segment. Returning `null` or `undefined` still refuses the cache, but prefer `shouldBypassCache` for that — it says so without also claiming to build a key.

For a **link**, `buildCacheKey` runs once per source entity, and `args.entityIds` holds the one source its key is for. So returning `cacheKeys.forEntityIds(args.entityIds)` names that source rather than the request, and returning `null` refuses the cache for that source alone while its siblings stay cached.

### Query cache example

```ts
export default defineMyAppQuery({
  implements: ProductsByCategorySlugQuery,
  cache: {
    strategy: 'ttl',
    ttl: '1 day',
    filters: ['filter.v.availability'],
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
  },
  run: async (args) => { /* ... */ },
});
```

### One link entry per source entity

A link handler is called with a set of source ids, but the cache stores **one entry per source**. An
entry therefore serves every later request whose set contains that source, so a listing that scrolls,
re-sorts or searches asks the handler only for the sources it has not seen. A partial hit costs one
batch read and one handler call, exactly as a full miss does.

The key opens with the source entity's type and id — the same address the component cache uses — so
one prefix reaches everything cached about an entity in either layer.

Three consequences for a handler author:

- **Your handler never builds the id segment.** The runner keys the source itself.
- **A subset call is normal.** `entityIds` holds what the cache could not answer, which is often
  fewer ids than the request carried. Resolve those and return links for them.
- **`validate` judges one source.** The response it receives holds that source's link, so `links`
  has one entry or none.

A source your handler returns no link for is stored as an absence, so it is asked for once rather
than on every request. Downstream it still arrives as `{ sourceId, targetIds: [] }`.

::warning
**A cached link handler's `passthrough` writes reach a consumer only on a cache miss.** A hit skips
the handler, so the writes never happen, and a partial hit makes them cover only the sources it had
to resolve. A consumer reading the token cannot tell either case from a handler that wrote nothing.

That is fine where the consumer resolves the data itself and treats the token as a shortcut. It is
silently wrong where the token is the consumer's **only** source — that consumer returns nothing on
every hit. If a resolver depends on a link's passthrough, the link cannot be cached.

Orchestr warns once per link in development. Reading from `passthrough` is unaffected.
::

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
    swr: false,               // optional: serve stale while refreshing
    staleMaxAge: '2 hours',   // swr only; defaults to '24 hours'
    getKeySuffix: (clientEnv) => clientEnv.market.slug,
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
| `swr`          | When `true`, the entry stays servable past `ttl` while the resolver re-runs behind the response.                                                                                     |
| `staleMaxAge`  | How long that stale window lasts. Read only when `swr` is on. Defaults to `'24 hours'`.                                                                                             |
| `getKeySuffix` | Receives the resolved [`ClientEnv`](/frontend/orchestr/client-env) and returns a suffix appended to cache keys (e.g. market slug, channel). Same entity cached separately per suffix. Must not reference handler arguments, and must return a scalar. |
| `components`   | Per-component overrides. Keys are component names (e.g. `'prices'`), values override `ttl` and `swr`.                                                                                |
| `enabled`      | Set to `false` to disable caching for this resolver.                                                                                                                                 |

## Storage and drivers

Orchestr registers two storage namespaces:

- `cache:orch:i`: used by the three cache layers above
- `cache:orch:u`: for app-level cached helpers (see below)

Both are namespaces below `cache`, so a project that mounts one driver at `cache` covers them.
Mounting at the full path works too, and the paths are short deliberately: every key carries its
namespace, so a longer one is paid on every read and every write.

In development, both use **LRU in-memory** drivers (max 5000 entries). In production, configure a persistent driver (e.g. Redis) via Nitro storage config for durable or shared caching across instances.

### Clearing the cache

```text
POST /api/laioutr/orchestr/clear-cache
```

Clears both internal and userland caches. Restrict access in production.

## Userland cache

For data outside query/link/component results (e.g. aggregated counts, resolved SEO URLs, system config), use `useUserlandCache` so the data is cleared together with the orchestr cache. It returns a typed unstorage instance scoped to `cache:orch:u:{prefix}`.

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

Because the storage is unprefixed beyond that, a key you build here carries the environment or it does not distinguish one storefront's data from another's. The auto-imported `cacheKeys` gives you the same segments orchestr uses for its own keys; see [Userland cache patterns](/frontend/orchestr/recipes/userland-cache-patterns#building-the-segments-with-cachekeys).

For function-level caching with automatic key management, you can also use Nitro's `defineCachedFunction` with `base: ORCHESTR_CACHE_KEY_USERLAND`.

::tip
For two patterns that come up across every connector (fire-and-forget background writes via `event.waitUntil`, and multi-tenant cache key composition), see the [Userland cache patterns](/frontend/orchestr/recipes/userland-cache-patterns) recipe.
::
