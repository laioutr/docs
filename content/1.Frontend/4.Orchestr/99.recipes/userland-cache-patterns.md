---
title: Userland cache patterns
description: Pre-warm caches without blocking responses, and isolate cache entries across tenants and locales using cache key composition. Two patterns the built-in connectors hit constantly.
seo:
  title: Userland cache patterns
  description: Pre-warm caches without blocking responses, and isolate cache entries across tenants and locales using cache key composition.
sitemap:
  loc: /frontend/orchestr/recipes/userland-cache-patterns
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9
---

A category page issues 50 product queries that each return a variant ID. For your storefront's product page to render, each variant has to map back to its parent product, which means another API call per variant. Doing it inline blocks every category page on 50 round-trips.

A different problem: your Shopware connector caches the storefront's currency and language IDs, but you run two Shopware instances behind the same Nuxt deployment (staging and prod, or a B2C and a B2B store). The cached "EUR" currency ID from one instance silently serves the other's requests, and prices come out wrong.

Both are `useUserlandCache` problems. The first wants a write that doesn't block; the second wants entries that don't collide. Two patterns, one cache primitive.

## Background writes that don't block the response

When a handler wants to cache data as a side effect of its main work (a variant-to-parent-product map you happened to compute, an aggregated count you can answer cheaply), `await`-ing the cache write holds the response back for no functional reason. Dropping the `await` returns immediately but is unsafe on serverless runtimes: the moment the response is flushed, the runtime is free to terminate the in-flight promise.

[`event.waitUntil`](https://nitro.build/docs/tasks#waituntil) is the right tool. It tells Nitro to keep the request context alive until the passed promise resolves while letting the response stream out immediately. On Cloudflare Workers and Lambda it's the only way to detach work safely; on persistent Node hosts it simply means the response doesn't block on the cache acknowledgement.

```ts [server/composable/useGetProductParentId.ts]
import { useEvent, useUserlandCache } from '#imports';

const PARENT_ID_TTL = 60 * 60 * 24 * 7; // 7 days

export const cacheProductParentIds = (entries: [productId: string, parentId: string][]) => {
  const event = useEvent();
  const cache = useUserlandCache<string>('shopware/product-parent-id');

  event.waitUntil(
    cache.setItems(
      entries.map(([key, value]) => ({ key, value })),
      { ttl: PARENT_ID_TTL },
    ),
  );
};
```

A query handler calls this after it has fetched its data, letting the cache write happen alongside the response stream instead of in front of it:

```ts [server/orchestr/Product/byCategorySlug.query.ts]
const products = await context.storefrontClient.invoke('readProduct ...', { /* ... */ });

cacheProductParentIds(products.map((p) => [p.id, p.parentId])); // fire-and-forget
return { ids: products.map((p) => p.id), total: products.length };
```

When *not* to use this pattern: the next request depends on the write completing. If `cacheProductParentIds` fails (Lambda freezes the container, the Nitro process restarts), the write is lost. That's fine when the next request can fetch the data fresh and try again, and it's broken when the next request needs the cache to be populated to function.

## Cache key composition for multi-tenant safety

Userland cache instances live in a global namespace (`cache:orchestr:userland:<prefix>`). When the same connector serves multiple tenants, locales, or storefronts in one deployment, you have to fold the differentiating value into either the prefix or the key. Skipping this is the single highest-impact bug in connector code: rotating credentials silently serves stale data from the previous tenant, and locale-specific data leaks across markets.

There are two valid placements, with different lifecycle properties.

### In the prefix: invalidate as a unit

Put the differentiator in the prefix when its change should evict every entry under it. Credential rotation is the canonical case: when an access token rotates, all cached data tied to the old token's identity space becomes inaccessible, so making the token part of the prefix means the new token's prefix starts empty by definition.

```ts [server/shopware-helper/system/getSystemEntities.ts]
const accessToken = useRuntimeConfig()['@laioutr-app/shopware'].accessToken;
const cache = useUserlandCache<SwSystemEntities>(
  `shopware:${accessToken}:system-entities`,
);
```

After the rotation, `useUserlandCache` returns a fresh cache instance for the new prefix. The old prefix's entries hang around until their TTL expires, but they're dead weight, not stale reads.

### In the key: isolate within a shared prefix

Put the differentiator in the cache key when entries differ along a data dimension but share the cache's lifecycle. Locale-keyed SEO URL lookups are the canonical case: every language has its own slug-to-ID map, but they all evict, deploy, and clear together.

```ts [server/shopware-helper/useSeoResolver.ts]
const cache = useUserlandCache<SeoEntry>('shopware/seo-urls');

const resolve = async (type, slug) => {
  const languageId = storefrontClient.defaultHeaders['sw-language-id'] ?? 'default';
  const cacheKey = `${languageId}:${type}-${slug}`;

  const cached = await cache.getItem(cacheKey);
  // ...
};
```

This shape lets you `getKeys()` or iterate all SEO URLs across languages from one cache instance, which would be awkward if each language had its own prefix.

### Picking between them

If a change to the value would invalidate every entry, put it in the prefix. If a change just selects which entry you want among siblings that should coexist, put it in the key. When in doubt, prefix is the safer default; you can always merge prefixes later, but splitting an over-keyed cache requires reading every entry.

## The anti-pattern to avoid

```ts
// Wrong if the deployment serves more than one storefront.
const cache = useUserlandCache<number>('shopify/categoryTotal');
const cached = await cache.getItem(categoryId);
```

This reads correctly when there's exactly one Shopify connection per deployment. The moment a second Shopify instance ships behind the same Nuxt (a multi-brand operator, a staging-on-prod environment), category totals from one shop bleed into the other. Add the access token to the prefix or the shop ID to the key; pick whichever matches the lifecycle question above.

## Related

- [Caching: Userland cache](/frontend/orchestr/caching#userland-cache): the primitive both patterns build on.
- [System bootstrap in extendRequest](./system-bootstrap) (recipe): another core use of `useUserlandCache`, with the access-token-in-prefix pattern in context.
