---
title: Orchestr Changelog
description: Changelog for @laioutr-core/orchestr following Keep a Changelog and Semantic Versioning.
seo:
  title: Orchestr Changelog
  description: Changelog for @laioutr-core/orchestr following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/orchestr-changelog
  lastmod: 2026-05-27
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Orchestr** (`@laioutr-core/orchestr`), the Laioutr data-fetching and query orchestration layer, will be documented in this file.

## [0.61.0] - 2026-09-26

### Minor Changes

- Every cache read is counted as OpenTelemetry metrics: `orchestr.cache.reads` by layer and hit or miss, plus `orchestr.cache.stale` and `orchestr.cache.invalidated`, each by cache namespace. Until now these counts existed only in a request's execution summary. They cost nothing without an OTel metrics SDK, and `cacheMetrics: false` or `NUXT_ORCHESTR_CACHE_METRICS=false` turns them off. (DEV-575)

## [0.60.0] - 2026-09-25

### Minor Changes

- `pageIndex.locate` handlers receive `languages`: every language the project's markets serve, drafts included, each paired with a market that serves it. A connector can now return a complete `locales` map, which feeds hreflang alternates and the language switcher.

## [0.58.0] - 2026-09-21

### Minor Changes

- A render that something else stores now skips the in-process tier on its own. That tier holds a value for up to 30 seconds that no invalidation reaches, so a response cached for longer would bake the short window into the long one.

  Orchestr reads the route's own rules to decide, so a project that already configured `routeRules` writes no server code for it. Any of three counts: `cache` or `swr`, which Nitro serves itself; `isr`, which the Vercel and Netlify presets act on; and a `cache-control` header naming a shared cache, which is how a project behind a CDN says it — on Cloudflare that header is the only signal there is.

  For a cache Nuxt has no rule for — a CDN configured outside the project, a reverse proxy in front of it — the new server import `setResponseCachedDownstream(event)` says so for one request.

  **Breaking:** `event.context.orchestrBypassL1` is gone, and setting it now does nothing.

  ```ts
  // before
  event.context.orchestrBypassL1 = true;

  // after — nothing at all, when the route already declares `isr`, `swr` or `cache`.
  // Otherwise, for a cache Nuxt cannot see:
  setResponseCachedDownstream(event);
  ```

## [0.57.0] - 2026-09-18

### Minor Changes

- Cache entries can be invalidated by tag instead of waiting out their TTL. An invalidated entry is served and refreshed behind the response, so it costs no latency and cannot start a stampede.

  **Nothing to author for entities.** Component and link entries carry the entity they describe, so `invalidateTags([entityTag('Product', id)])` reaches every cached component and link for that product, in every market and language.

  A link handler declares tags the same way. Its entries each carry the tag of the source entity they answer for, derived from the key, and a declared tag is added beside that one — for naming what the whole set came from, such as the menu a category tree was read from.

  **Query handlers declare what cannot be derived** — which list a result belongs to, including when that list came back empty:

  ```ts
  cache: {
    ttl: '5 min',
    tags: (args) => [args.categorySlug],
  }
  ```

  Without one, `queryTokenTag` still reaches the entry, along with every other entry of that token.

  A tag name carries one of three prefixes, so a name you mint can never collide with an entity id: `entity:` for one entity, `list:` for a name a handler declared, `query:` for a query token. An app minting its own should use its package segment — `app-myapp:stock-feed`.

  **A component resolver can opt out** with `autoInvalidate: false`. An app-owned value — a view counter, a locally computed score — has no relationship to the upstream entity, so refetching it on every unrelated upstream change costs the app's own origin and buys nothing.

  **An invalidated entry follows its own stale policy.** A handler that set a stale window serves the entry and refreshes it behind the response, so a bulk change costs background work rather than a wall of blocking reads. A handler that set none is refetched instead: it asked not to be served past its freshness, and a bumped counter is stronger evidence than age — age only suspects a value is old, where a counter says it is wrong. This is what Drupal, Fastly and bentocache all do.

  New server imports: `invalidateTags`, plus `entityTag`, `listTag` and `queryTokenTag` to name what it bumps. One `INCR` per distinct name, whose cost does not change with how many entries carry the tag; nothing is scanned or deleted, and the effect lands on the next read. One call takes the whole batch, so naming an entity and its children costs one round trip rather than one each. It needs a shared cache backend; without one it warns and does nothing.

  One call bumps at most `INVALIDATION_BATCH_CAP` distinct counters — 10,000 — and drops the rest with a warning rather than failing. The client pipelines a batch into one round trip, so the limit is server-side work: a burst of that size leaves a concurrent reader's median untouched, and its tail only moves an order of magnitude higher. Refusing instead would answer whatever carried the batch with an error, and for a webhook an unsuccessful answer eventually costs the subscription.

  Counters never expire. One that lapsed under an entry still referencing it would read as `0`, mismatch, and discard a warm cache for nothing — and an entry's window has no upper bound, so no fixed TTL can be proven longer than it. The cost is one integer per distinct tag. Counters live inside the project's own key scope, so two storefronts sharing one Redis — a staging and a production one fronting the same store, say — cannot invalidate each other despite seeing identical entity ids.

  **A request whose output is cached downstream should set `event.context.orchestrBypassL1 = true`.** The in-process tier holds a value for up to 30 seconds that no invalidation reaches, so a render that skips it keeps that staleness out of the longer downstream window.

  **Breaking:** the stored cache version moves to `v2`. Every entry written by a previous deploy is orphaned and expires under its own TTL, so the first requests after the upgrade miss.

### Patch Changes

- Two requests asking for different entity components no longer evict each other from the query and link caches. A cached entry recorded which components it was resolved for, and a request wanting one it lacked was a miss that overwrote it — so a page asking for `[base, media]` and another asking for `[base, price]` refilled the same key in turn, and the handler ran every time. The component set is now part of the cache key, so each set keeps its own entry.

  Entries for a handler declaring `provides`, or setting `includePassthrough`, are keyed differently and are never read again. They expire under their own TTL, and the first requests after the upgrade miss.

- `POST /api/laioutr/orchestr/clear-cache` now actually clears a Redis-backed cache. It was shredding every key it enumerated into single characters, then deleting those, so it reported success and removed nothing — a project on Redis could not clear its cache at all, and a shortened TTL never took effect on entries already written.

  Cache key enumeration was affected the same way, so anything reading keys back got characters instead of keys.

## [0.56.0] - 2026-09-17

### Minor Changes

- Adds `useEntityQuery`, a composable that runs an Orchestr query from a component with an input the component decides itself. The result lands in the Orchestr store like a page query's does, so the entities are cached and shared, and the query runs once on the server and hydrates on the client. Sections whose data source is configured through static props use it where an agent cannot edit a page's queries.

## [0.55.0] - 2026-09-15

### Minor Changes

- Add hooks around an action request. On the client, `orchestr:action:request:prepare` is awaited before the request goes out and can add request headers or cancel the call by throwing. `orchestr:action:request:retry` runs after a request fails and can ask for it to be sent once more. On the server, `orchestr:action:handler:guard` runs before the handler and can end the request by throwing an h3 error. Its `readInput()` returns the validated input without reading the body twice.

  An action request whose body fails validation now fires `orchestr:action:handler:error` and `orchestr:action:handler:finally`, like every other failed action. The client receives it as `Action failed` with status 400, with the validation error as its data.

- The link cache stores one entry per source entity instead of one per source-id set. An entry serves every later request whose set contains that source, so a listing that scrolls, re-sorts or searches resolves only the sources it has not seen — 49% to 89% fewer source ids reach the handler on those patterns, at no extra round trips. A source the handler answers nothing for is stored as such, so it is asked for once rather than on every request.

  Link entries written before this are keyed differently and are never read again. They expire under their own TTL, and the first requests after the upgrade miss.

  **Breaking:** `buildCacheKey` and `validate` run once per source entity rather than once per request.

  `buildCacheKey` receives `entityIds` holding the one source its key is for. A handler that keyed on the entity ids can drop that key: the runner already names the source, so the handler's segment repeats it.

  ```ts
  // before
  cache: {
    ttl: '1 hour',
    swr: true,
    staleMaxAge: '1 day',
    buildCacheKey: (args) => cacheKeys.forEntityIds(args.entityIds),
  }

  // after — the runner keys the source itself
  cache: {
    ttl: '1 hour',
    swr: true,
    staleMaxAge: '1 day',
  }
  ```

  `validate` judges the one source's link, so `links` holds one entry or none:

  ```ts
  // before
  validate: (entry) => entry.value.links.length === args.entityIds.length,

  // after
  validate: (entry) => entry.value.links.length > 0,
  ```

### Patch Changes

- The Orchestr tab runs actions that the project protects from bots. It sends a bypass signed with the project secret key, so these actions no longer fail with a bot-protection rejection.

## [0.54.0] - 2026-09-10

### Minor Changes

- **Breaking:** a query or link cache config is shaped like a component's. `swr` is a boolean, `staleMaxAge` sits beside it and is required, and a handler that should not be cached omits the block rather than declaring a strategy.

  ```ts
  // before
  cache: { strategy: 'ttl', ttl: '1 day' }
  cache: { strategy: 'swr', ttl: '10 minutes' }
  cache: { strategy: 'live' }

  // after
  cache: { ttl: '1 day' }
  cache: { ttl: '10 minutes', swr: true, staleMaxAge: '1 minute' }
  // (no cache block)
  ```

  `ttl` is required too. It was optional under `swr`, and omitting it turned the cache off rather than erroring.

  **A stale window is no longer inherited.** It used to default to 24 hours in silence, so a five-minute cache was really servable for a day and nothing in the config said so. A handler the types cannot reach — JavaScript, or built against an older release — falls back to a minute instead, and its `strategy` keeps working.

### Patch Changes

- A link or query handler that answers with entities keeps their components when the response comes from the cache. A component written as a factory — `base: () => ({ … })` — was dropped on the way in, so a cached breadcrumb or inline category arrived carrying an id and no data.

  An entry records which components it was resolved for, and a request wanting one it lacks re-runs the handler rather than being served a gap. Link entries written before this cannot be read and count as a miss once, on the first read after the upgrade.

- A handler or component that names a `ttl` of `0` alongside `swr` is always stale, so every read is served from the entry while a refresh runs behind the response. It used to be read as no window at all, which turned the cache off:

  ```ts
  cache: { ttl: 0, swr: true, staleMaxAge: '1 hour' }
  ```

  Naming no `ttl` still means no caching. An entry whose whole window — `ttl` plus its stale window — comes to zero is not written, because no read could ever serve it.

## [0.53.0] - 2026-09-10

### Minor Changes

- A cache you own can serve stale and refresh behind the response, the way a query, link or component resolver already does. The pieces were public — `staleMaxAge`, the `stale` list a read reports, the refresh claim — but the loop that joins them was not, so an app had to re-implement it and lost the metrics tracking with it.

  `refreshStale` claims the keys, bounds the fill, releases every claim whatever happens, and warns if the fill throws:

  ```ts
  const hit = await cache.readOne(key, { maxAge: '1 hour', staleMaxAge: '6 hours' });
  if (hit && !hit.absent) {
    if (hit.stale) cache.refreshStaleOne(key, options, () => fetchMenu(key));
    return hit.value;
  }
  ```

  `refreshStaleOne` stores whatever the fill resolves with. `refreshStale` takes a batch, hands the fill only the keys this instance won, and leaves the writing to it — so a set of entries refreshes in one pass.

  **Deprecated:** `claimRefresh` and `releaseRefresh`. A claim taken through them and never released blocks its key for the life of the instance, which is the failure `refreshStale` cannot have. They keep working.

### Patch Changes

- **Breaking:** `POST /api/orchestr/query` and `POST /api/orchestr/action/<token>` answer with `Content-Type: text/plain; charset=utf-8` instead of `text/x-script`, so a CDN compresses them. Both routes shipped raw bytes on every request before, because a CDN picks what to compress from a content-type allowlist and `text/x-script` is on none of them. On the reference storefront a 473 KB category query drops to roughly 44 KB on the wire.

  The body is the same turbo-stream encoding as before. A client that reads the response as a stream, which the built-in one does, needs no change. A client that picks its decoder from the content type must stop keying on `text/x-script`.

## [0.52.0] - 2026-09-09

### Minor Changes

- A project can add its own dimension to every cache key. The key carries a digest of locale, currency, market and published/preview, so a response that varied on anything else — a customer group, a price list, a store selection — collided with one that did not.

  Contribute a segment from a nitro plugin, and it reaches queries, links, component resolvers and the page index at once:

  ```ts
  export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('orchestr:client-env-key:build', ({ clientEnv, parts }) => {
      const group = clientEnv.custom?.customerGroup;
      if (group) parts.push(`cg:${group}`);
    });
  });
  ```

  Handlers run synchronously, so resolve the value into `clientEnv.custom` earlier in the request rather than awaiting one here. Contributions are sorted and joined to the four base values: two plugins key the same entry whichever registers first, and no handler can drop the market and let two of them collide. Registering the first handler rotates that project's cache keys once.

- Orchestr's query, link and component caches run on a new cache layer, with an in-process tier in front of the shared one.

  **Stale-while-revalidate works.** A stale entry was served once, deleted by the reader, and never revalidated — so the next request took a full miss. It now serves immediately and refreshes behind the response, and a failed refresh keeps the last good value until its window closes. Two concurrent readers of one stale key schedule one refresh. `staleMaxAge` on a query, link or component cache config sets how long that window lasts, and defaults to 24 hours.

  **Absence is cached deliberately.** A resolver that legitimately has no value for a component is remembered, instead of being asked the same unanswerable question on every render.

  **Freshness follows the current configuration.** Shortening a TTL takes effect on entries that are already stored.

  **A cache on a local driver honours its TTL.** unstorage's `memory`, `lru-cache`, `fs` and `fs-lite` drivers accept a TTL and drop it, so an entry stored through one never expired — in development a cached value outlived dev-server restarts. Orchestr stores in its own bounded in-process cache instead of those four, and an entry leaves when its window closes. A `null` mount still caches nothing.

  **A `cacheBatchWrite: 'msetex'` module option writes a batch in one command instead of a pipeline.** Valkey 9.1 and later only; the default is unchanged.

  **`useRedis()` hands you the cache's own Redis connection** for commands the cache API does not cover — counters, sets, locks. It answers `undefined` unless the internal cache resolved a Redis mount. Being the cache's connection, it suits ordinary commands and not `subscribe` or blocking reads, which take a connection over and stop the cache working on that instance.

  **`clear-cache` reports what it achieved.** On a backend that cannot enumerate its keys it answers `{ success: false }` with a reason, rather than a success it never achieved.

  **Breaking:** `useUserlandCache()` returns a cache store rather than an unstorage `Storage`. `readOne` and `writeOne` take one key; `read` and `write` take a batch, and cost one round trip for the whole set. Every entry carries its freshness window. The value type goes on the call as it did, and pins the namespace — a read and a write cannot disagree about the shape stored under one key.

  ```ts
  // before
  const cache = useUserlandCache<string>('my-app/ids');
  const id = await cache.getItem(handle);
  await cache.setItem(handle, id, { ttl: 3600 });

  // after
  const cache = useUserlandCache<string>('my-app/ids');
  const hit = await cache.readOne(handle, { maxAge: 3600 });
  const id = hit && !hit.absent ? hit.value : undefined;

  // Fire-and-forget: the write lands behind the response.
  cache.writeOne(handle, id, { maxAge: 3600 });
  ```

  `maxAge` takes seconds as a number, or a string such as `'1 day'`. Add `staleMaxAge` for a window in which the entry stays servable while it refreshes. `@laioutr-core/orchestr/types` exports `CacheStore`, `TypedCacheStore`, `EntryOptions` and `ABSENT`, so a helper that takes the cache as a parameter can name what it receives.

## [0.49.1] - 2026-09-03

### Patch Changes

- A failed action names its cause in the server log. An action that threw without an HTTP status became a bare 500 whose message reached the browser and nowhere else, so the request's own log stayed empty and a Shopify outage was indistinguishable from a crash, an out-of-memory kill or a timeout. The action route now logs those failures the way the query plane already logs its own. An action that throws a status-carrying error, such as a variant that is out of stock, still logs nothing.

  Shopify transport failures carry the HTTP status Shopify answered with. The message came from `statusText` alone, which does not separate a Shopify 5xx from a throttled request from a request that never reached Shopify.

## [0.45.0] - 2026-08-26

### Minor Changes

- `cacheKeys` reaches the pieces orchestr builds its own cache keys from, for code that has to build one by hand.

  `useUserlandCache` hands back a bare storage with no prefixing at all. A key built there carries the environment itself or it serves one storefront's data to another, and it escapes any id holding a `/` or a `:` or unstorage rewrites it into a different key.

  ```ts
  const key = `${cacheKeys.forClientEnv(clientEnv)}:${cacheKeys.escape(productId)}`;
  ```

  `cacheKeys.forEntityIds` turns a set of entity ids into a short, fixed-length segment, so a hand-built key stops growing with the page size. A handler that joined ids instead produced over two thousand characters for 48 products — past the 255 bytes a filesystem allows for one path segment, and into the request-size limit of a hosted Redis. The ids are sorted before hashing, so the same set keys the same entry however it arrives.

  Query and link handlers no longer need it. Orchestr keys a link's source ids itself.

- An execution summary carries a request-level cache report next to its per-query summaries. It answers questions the query summaries could not — whether a component read arrives as one batched call or many single ones, what a given component's hit rate is, and whether a background write was lost when the isolate froze.

  The counters are gathered only for a request that set `options.dev.enableSummary`. Every other request pays nothing, including the payload measurement.

  **Breaking:** `ExecutionSummary` is a union now, so narrow on `type` before reading a query's fields.

  ```ts
  // before
  summary.linkSummaries;

  // after
  if (summary.type === 'query') summary.linkSummaries;
  ```

- A query or link cache config accepts `validate`, called with the handler's result before it is written. Return false and the result is served but not stored.

  `buildCacheKey` already decides cacheability from the request, before the handler runs. This decides it from the outcome — a degraded fallback that must not be served for the rest of its TTL, or a result that cost nothing to produce and would be re-derived just as cheaply next time.

  ```ts
  cache: {
    ttl: '1 day',
    strategy: 'ttl',
    buildCacheKey: ({ input }) => input.categorySlug,
    validate: ({ value }) => (value?.ids.length ?? 0) > 0,
  }
  ```

  It gates the write only. An entry already in the cache keeps serving until its TTL lapses, so adding `validate` stops a bad result being stored again but does not evict the one already there.

  It receives a `CacheEntry` wrapping the value rather than the value itself, and is consulted only for a request that would have been cached anyway — a preview request or a handler returning no key never reaches it.

- **Concurrent resolution.** A request's queries, a query's links, and the component resolvers for one entity type now resolve concurrently instead of one after another. A page waits for its longest strand rather than for the sum of its work. A storefront home page's server render fell from about 724 ms to about 322 ms. A cold product page's six component resolvers finished in 378 ms — run one after another they total 937 ms.

  Chunks now interleave. A client that routes them by `path`, and merges entity chunks by id as it always had to, is unaffected. One that depends on chunks arriving grouped in request order is not.

  **A failing link no longer discards its query.** A link handler that threw collapsed the whole query into one error chunk, taking the query result and every entity chunk its sibling links had already streamed. It now reports an error at its own path, `[queryId, linkToken]`, and the rest of the query completes. Where several parts of one query fail, each reports its own error rather than only the first.

  **Passthrough is scoped to the handler that writes it.** Every handler in a query used to share one `passthrough` store. A handler now reads every token its callers set, and writes where only the handlers beneath it can read.

  So a link handler can hand data to its own component resolvers without it reaching the rest of the query. In exchange, two links that set the same token no longer see each other's value — each reads its own, and a handler that read a sibling's token now gets its own default.

- A query or link handler enables its cache with a TTL and a strategy, and nothing else. Orchestr builds the whole key — the token, the environment, the requested slice, the sorting, the filters, and the token's input.

  ```ts
  cache: { ttl: '1 day', strategy: 'ttl' }
  ```

  **Which requests are cached.** The first slice of a listing, unfiltered, is cached by default. The tail of a listing is cold and a filter combination is unbounded, so both are opted into rather than out of. `filters` also takes an allowlist, for a filter whose value set is small enough to be worth keying.

  ```ts
  cache: { ttl: '1 day', strategy: 'ttl', pages: 'all', filters: ['filter.v.availability'] }
  ```

  `shouldBypassCache` refuses a request the declarative options would admit. It runs after them and can only narrow them, so widening them can never serve one request's result to another — the runner keys the full request shape either way.

  **Breaking:** `buildCacheKey` is now optional and supplies one trailing segment rather than the whole key. A handler that keeps it keeps working, and returning `null` from it still refuses the cache. Every key changes shape, so existing entries are never read again and expire under their own TTL. The first deploy runs on a cold cache.

  **Fixed:** the requested offset was absent from every query and link key, so `?offset=5&limit=24` was served the `offset=0` result. A component resolver's `getKeySuffix` replaced the environment digest instead of extending it, which would have let two markets collide on one entry.

- Cache keys are roughly 45% shorter. Measured across two live storefronts: a component key fell from 144 bytes to 84 on one and from 121 to 66 on the other, a product-variants link key from 136 to 82, and a page-index key by 17%. The key was a third of what a component entry cost to store, and every key is sent again on each batched read, so the saving lands on stored size and on request payload alike.

  Three things got shorter. The namespace a key carries. The escaping, which now spends two bytes on the four characters unstorage would otherwise rewrite rather than three bytes on every character `encodeURIComponent` recognises — a Shopify GID paid 15 bytes for 5 characters. And the environment segment, where locale, currency, market and preview stage become one 8-character digest, being identical for every key in a request. Entity type, id, component and page type stay readable.

  All four layers use that digest now, page index included, so a handler no longer has to fold the market or the pagination limit into a key of its own — both are already there.

  **Breaking:** the storage namespaces moved. A project mounting one driver at `cache` covers both and needs no change. A project mounting at the full path does.

  ```ts
  // Before
  storage: { 'cache:orchestr:internal': { driver: 'redis' /* … */ } }

  // After
  storage: { 'cache:orch:i': { driver: 'redis' /* … */ } }
  ```

  A driver left at an old path receives nothing, and the cache falls back to whatever serves `cache` — in the worst case a per-isolate memory driver, which reports no error and holds nothing between requests.

  Existing entries are addressed the old way and are never read again. They expire under their own TTL, so the first deploy runs on a cold cache.

### Patch Changes

- A project that points its cache at a real backend now keeps it in development. Orchestr mounted an in-memory LRU over its own cache namespace on every dev boot, and that mount is more specific than the `cache` mount a project configures, so it won.

  The effect was that dev never ran the path production runs: no round trips, no serialization limits, and a configured Redis that received nothing. The LRU still mounts when no backend is configured.

- A `pageIndex.locate` lookup no longer serves one locale's page metadata to another. The cached result carries `meta` resolved in the locale the lookup was made in, but the entry was keyed on the market alone. Two locales of one market collide whenever they share a route param — which is every product whose slug is a SKU, a brand name or an untranslated model number — so whichever locale filled the cache first supplied the title and description for both.

  The key now covers the locale, and preview and published results no longer share an entry either.

- Cache writes survive on Vercel. Orchestr writes to the cache after responding, through `event.waitUntil`, and on Vercel's Node runtime nothing was keeping the function alive to finish them — Nitro's Vercel preset never sets the `event.context.waitUntil` that Nitro itself looks for, so the write was left as a floating promise and died with the invocation.

  Measured against a deployed probe on a cold instance: the deferred write was lost in four trials out of four, and the immediate write in two of them — the response flushed while the Redis connection was still being established. A warm instance kept both, which is why the cache filled at all.

  A Nitro plugin now supplies that hook from Vercel's own request context, so every deferred write — query, link, component and page-index caches alike — is completed before the function is frozen. It needs no extra dependency, does nothing off Vercel, and defers to any platform that already provides one.

## [0.44.1] - 2026-08-24

### Patch Changes

- Fix a `TypeError: Cannot read properties of undefined (reading 'length')` that failed any query whose link handler answers with `entity`, `entities`, or a single `targetId`. Telemetry added in 0.44.0 counted a link's targets by reading `targetIds` on the handler's raw response, which only the `targetIds` shape carries — the other three are converted a step later. The failing query returned no data and reported an error chunk, so a page built on it rendered without its products.

## [0.44.0] - 2026-08-24

### Minor Changes

- OpenTelemetry tracing. A storefront that sets `OTEL_EXPORTER_OTLP_ENDPOINT` at build time exports traces of its server-side work through the standard `OTEL_*` configuration; without it nothing is installed. Queries, links and component resolvers each become spans nested under the Nitro request span, and an upstream API call made while a resolver runs nests under that resolver — so a trace attributes upstream time to the work that caused it.

  **What spans carry.** Attributes are counts and names a backend can group by: how many entities a resolver asked for, a token name, the app a handler comes from. Entity-id lists, link payloads and handler metadata stay in the local dev tree that feeds devtools, because a span over a backend's payload ceiling is dropped whole — which would lose the slowest requests first.

  **Cache behaviour.** Every cache read carries `orchestr.cache.verdict`, which answers whether a warmer cache would have helped: `hit`, `miss`, `partial`, `skip` for a read that never consults the cache, and `uncacheable` for one blocked by a component configured never to cache. Reads against a hosted cache are `CLIENT` spans and in-process ones `INTERNAL`, detected from the mounted unstorage driver rather than configured.

  **Which page.** A server-rendered request tags its span with the page type, market slug and locale, since a product page and a listing page share one wildcard route. A query request tags its root span with the market, the locale and the query names it ran, so a client-side navigation is identifiable too.

  **Richer local traces.** The `orchestr` module option `exportDevAttributes` exports the diagnostic values that otherwise stay in the dev tree. Point it at a local collector only.

- A request's top-level queries now resolve concurrently, up to six at a time, instead of one after another. Each query fans out to its own links and component resolvers, so a page whose sections issue several independent queries waited for the sum of them; it now waits for the slowest. Measured on a storefront home page against a warm cache, a server render fell from about 724 ms to about 322 ms.

  Response chunks are addressed by query id, so a client that reads them by `path` is unaffected. One that depends on chunks arriving grouped by query, in request order, is not: chunks from different queries now interleave. Errors are unchanged — a failing query still reports its own error chunk and no longer blocks its siblings, which previously waited behind it.

### Patch Changes

- Devtools traces and execution summaries describe what actually happened. A completed query reported `unknown` for its id and token, a component resolver's missing entity ids were dropped, and spans started concurrently appeared as a chain — initwares running under `Promise.all` rendered as each one nested inside the last rather than side by side.

## [0.43.1] - 2026-08-24

### Patch Changes

- Query, link and entity-component caches now key on the market, and query and link caches also key on the pagination limit. Two markets that share a language and a currency no longer read each other's cached results, and a request for 24 items no longer receives the slice a different page size cached.

  The key format changed, so existing cache entries become unreachable on upgrade and expire on their own TTL. Expect one cold period after the deploy.

- A query's configured sorting is now applied. The value stored on the query was dropped while the request was built, so a sorting set in the studio, or returned as `defaultSorting` from a `queryTemplateProvider`, never reached the query handler. It is now sent as the query's `sort`. An `s` URL parameter still takes precedence, so the configured value sets the default order rather than a fixed one. Links are unaffected and continue to resolve their own sorting from the URL.

## [0.41.1] - 2026-08-13

### Patch Changes

- Render a streamed query result once it has settled, rather than once per response chunk

  On a server-rendered page, the first client-side navigation that ran a query re-rendered on every
  chunk of the streamed response — including the window where a link's entity ids have arrived but
  the entities themselves still report no components. Sections reading those components rendered
  against that half-loaded state and threw, which read as intermittent because a retry usually landed
  after the response had finished.

  A streamed response is now published once, complete, and a query started from a server-rendered
  page keeps the data already on screen until it finishes.

## [0.38.2] - 2026-07-31

### Patch Changes

- Report `listPagesFrom`'s `endCursor` at any stopping position, not only at the `take` boundary.

  A consumer that stopped iterating early — on a wall-clock budget, say — read `endCursor` as
  `undefined` and could not distinguish that from an exhausted enumeration, so a partial walk was
  recorded as complete. The resume point is now computed from the walk's live position, which
  `paginate` has always tracked.

  Two fields make the outcome of a pass unambiguous. `exhausted` is the termination signal for an
  accumulation loop; `endCursor` is only ever "where the next pass starts", `undefined` meaning the
  beginning both going in and coming out. `progressed` reports whether the pass durably advanced —
  false when it took nothing and false when it threw, in both of which cases `endCursor` is the token
  the pass was given. A loop must stop on `!progressed` as well as on `exhausted`, or a pass that takes
  nothing repeats forever.

  The token names the position _after_ the last entry handed over, so collect an entry before breaking
  out of the loop. A pass that throws reports the token it started from rather than the position it
  died at, so retrying it loses nothing.

  `toArray()` callers see no change: draining to `take` reports the same token as before, and draining
  to exhaustion still reports `undefined`.

## [0.38.1] - 2026-07-30

### Patch Changes

- Add `listPagesFrom` for page-index enumerations that cannot finish in one request.

  `paginate` takes an optional `startCursor` and exposes `cursor` / `consumedSinceCursor`, so a walk can
  report where it stopped. `listPagesFrom(token, { take, resumeFrom })` builds on that: it returns a
  stream with an `endCursor` the caller persists to continue later. Collecting each pass's `endCursor`
  yields independently servable shards, which is what a sharded sitemap needs.

  It is cursor-addressed and never touches the page-index chunk cache, so no TTL bounds a consumer's
  progress across visits. `listPages` is unchanged and keeps serving the cached enumeration exactly as
  before.

  Page-index handlers receive an optional `startCursor`; pass it to `paginate` to become resumable.
  Ignoring it keeps today's behaviour, but `listPagesFrom` throws for such a handler rather than
  silently restarting at entry 0 on every pass. Both shipped product connectors are resumable.

## [0.38.0] - 2026-07-29

### Minor Changes

- Add the `pageIndex` orchestr handler kind — one registration per page type that owns that page type's whole page-space.

  `defineOrchestr.pageIndex({ for, label?, batchSize?, list, search?, count?, locate?, cache?, order? })`:

  - `list` walks the whole page-space in stable order, returning one `PageIndexEntry` per concrete page (`{ params, subject?, meta }`) as an array or async iterable; the new `paginate()` helper turns a cursor-paged platform API into one. It is called with `batchSize` — how many entries the platform serves in a single request, declared once on the registration and defaulting to 100 — and never with a bound, so a walk always caches a complete enumeration.
  - `search` answers a search term with a relevance-ordered top-N, receiving the `term` plus a `take` already clamped to `batchSize`. It is optional: without it a page type still answers search terms, because the runner scans the first 1000 enumerated entries and matches them on title and route params. Implementing `search` buys relevance ordering and coverage past that scan rather than the capability itself.
  - `count` supplies a cheap total for chunked sitemaps and picker totals; consumers degrade when it is absent.
  - `locate` is a point lookup returning `PageIndexLocateResult` (`{ subject?, meta?, locales? }`) — a page's route params in every locale it exists in, plus the located page's metadata in the locale the lookup was made in. `locales` carries a deliberate distinction: present, it is the **complete** set, and a locale missing from it means the page has no counterpart there, so consumers drop that alternate rather than guess a URL. Absent, it means the connector resolved only the locale it was called in, and consumers fall back to that locale's params. A registration that can answer for one locale must omit `locales` rather than return a single-key map, which would assert absence for every locale it never looked up.
  - `cache` tunes the enumerate, search and locate tiers independently; walks are cached in cursor-page chunks with stale-while-revalidate and a subject tag index.
  - `order` breaks ties between registrations, higher wins.

  Every handler receives the resolved `clientEnv`, so a connector scopes its platform reads to the active market with `clientEnv.market.id` — the same value the runner keys its caches by.

  Consumer surface is auto-imported server utils: `listPages()` enumerates a page type in stable order and `searchPages()` returns a relevance-ordered top-N, both as a `PageIndexEntryStream` (`for await`, `.toArray()`); `countPages()` returns a page type's cheap total; `locatePage()` performs the point lookup; and `invalidateEntity()` drops cached chunks referencing an entity.

  The `page-index/list` and `page-index/locate` endpoints serve these to editor clients under the secret-protected `/api/laioutr/` namespace. `locate` is also served ungated at `POST /api/orchestr/page-index/locate`, which the frontend itself calls to resolve a page's per-locale slugs — that lookup runs during client-side navigation as well as SSR, so it can never hold the project secret, and it discloses only the route params the rendered hreflang tags publish anyway. Reverse proxies or edge rules that restrict the app's API paths must allow it. The `page-index/list` endpoint validates each enumerated entry on its own and drops the ones that fail with a warning, so a single malformed entry costs one page rather than the whole enumeration. Reflection gains a `pageIndex` map keyed by page-type token: a key means the type is enumerable, `locate` marks the point-lookup capability, and `label`/`appLabel`/`logoUrl` carry the providing app's identity for editor pickers.

  `PageIndexEntry`, `PageIndexLocateResult`, `ReflectedPageIndex` and the endpoint request/response schemas are exported from `@laioutr-core/core-types/orchestr`; `PageSubjectRef` from `@laioutr-core/core-types/common`.

  Page types without a registration behave exactly as before — an empty stream and one warning. Providers are never required to implement this.

- **Breaking:** Type the `clientEnv` field of the `query-templates` and `page-index` request schemas as `WireClientEnv` rather than `unknown`.

  **Breaking:** `WireClientEnv` now lives in `@laioutr-core/core-types/orchestr`, alongside the request schemas that carry it, and is no longer exported from `@laioutr-core/orchestr`. A handler for the `orchestr:client-env:modify` hook takes it from there instead:

  ```ts
  // before
  import type { WireClientEnv } from '#orchestr/types';

  // after
  import type { WireClientEnv } from '@laioutr-core/core-types/orchestr';
  ```

  The resolved `ClientEnv` that handlers receive is unaffected and stays in `@laioutr-core/orchestr`.

  Editor clients build the wire payload by hand. While it was `unknown`, any object satisfied the type — and because every field of `WireClientEnv` is optional, a misspelled key such as `marketid` for `marketId` also passed validation, so the request resolved against the default market with no error anywhere. Such a key is now a compile error at the call site, and a request carrying a malformed `clientEnv` is rejected with `400` naming the offending path instead of failing further in as a `500`.

## [0.37.1] - 2026-07-25

### Patch Changes

- `ClientEnv` now includes a `domain` field — the market domain (host, path, language) the current request resolved to. Read it for the request's canonical host instead of assuming `market.defaultDomain`.

  The i18n config check now warns when two domains in the same market use the same language, which makes the resolved domain ambiguous — give them region-qualified locales (e.g. `de-DE` vs `de-AT`).

## [0.37.0] - 2026-07-23

### Minor Changes

- **Breaking:** Make `clientEnv.isPreview` a server-verified fact instead of a browser claim, so a handler can safely return unpublished content when it is set.

  The client env is now two types. `WireClientEnv` is what the browser sends (`isPreview`, `previewToken`, `marketId`, `languageId`, `custom`) and is untrusted. It no longer carries `locale` or `currency` — the server derives both from the market and language it resolves, and a request that still sends them has them ignored. `ClientEnv` is what handlers receive, and it is produced only by `resolveClientEnv()`. That function verifies the presented preview token, drops it before handlers can see it, and turns the wire's `marketId`/`languageId` into full `market`/`language` objects validated against the project's i18n config — so the language a handler serves can never disagree with the market it reads. `isPreview` is true only when the client asked for preview **and** the server verified the token; a middleware can no longer override `market`, `language` or `isPreview`.

  Query, link and component caches are preview-aware: keys carry the preview stage, and caching is bypassed entirely while previewing, so unpublished content is never stored and can never be served to a shopper.

  Adds `invalidateOrchestrQueries()` (auto-imported) to drop every stored query result at once, for changes that are not part of a query's cache key — entering or leaving content preview being the motivating case.

  **Breaking:** `ClientEnv` now carries required `market` and `language`. Handlers keep reading it as before, but anything that builds one by hand must supply them, or go through `resolveClientEnv()`.

  Before:

  ```ts
  await runQuery(Token, args, { locale: 'de-DE', currency: 'EUR', isPreview: false }, event);
  ```

  After:

  ```ts
  await runQuery(Token, args, resolveClientEnv(event, rawClientEnvFromRequest), event);
  ```

  `ClientEnv.locale` and `ClientEnv.currency` are deprecated. They keep resolving, but they are flat copies of fields the resolved objects already carry, and the resolved objects also carry the region codes, fallback chain and domains the strings drop.

  Before:

  ```ts
  const { locale, currency } = clientEnv;
  ```

  After:

  ```ts
  const locale = clientEnv.language.code;
  const currency = clientEnv.market.currency;
  ```

  If your handler's output varies by market, append a scalar such as `clientEnv.market.slug` in your own `getKeySuffix` — the default cache key deliberately does not widen with `ClientEnv`, and `market`/`language` are cyclic, so `JSON.stringify(clientEnv)` throws.

  Cache keys now include the preview stage, so entries written by earlier versions are orphaned. Expect one cold-cache window against a shared cache after deploying; nothing has to be flushed by hand.

## [0.35.0] - 2026-07-14

### Minor Changes

- **Breaking:** Media libraries are now connected as an Orchestr integration facet. A connector declares static capabilities (search, tags, folders, sorts, upload transfer) and uses opaque-cursor pagination, explicit type/tag filtering, optional folder navigation, and proxied or staged upload with per-file results. Define one on the app's Orchestr builder instead of the standalone factory:

  ```ts
  // Before
  export default defineMediaLibraryProvider({ name, label, iconSrc, list, upload });

  // After
  export default defineShopify.mediaLibrary({
    capabilities: { search: true, folders: false, sorts, upload: { transfer: 'staged' } },
    list,
    createUploadTargets,
    finalizeUploads,
  });
  ```

  `defineMediaLibraryProvider()` still works as a **deprecated shim** — existing connectors keep registering without a rewrite, in a degraded mode (no folders, no staged upload, no declared sorts). `ProjectFrontendContext.mediaLibraries` now carries descriptors `{ id, label, iconSrc, capabilities }`.

  The Shopify connector uploads via staged targets and blocks until each file is `READY` before returning it (one failed file no longer sinks the batch). The Shopware connector gains folder browsing over the real media-folder tree.

  This frontend-core version is the threshold for the Cockpit `mediaLibraryV2` capability gate; the Cockpit media picker is updated separately to speak the new contract.

  Folder browsing is folded into the single `list` method: `MediaListResult.folders` carries the
  queried location's subfolders on the first (cursorless) page; the separate `browseFolders`
  method and `media-folders` route are removed. Every media source now carries an optional
  `origin` (`{ libraryId, externalId? }`), stamped by the `.mediaLibrary()` wrapper, which also
  validates all adapter output at the trust boundary (canonical Zod parse, URL-scheme guard —
  including nested poster/cover images — capability/response agreement) and logs a server-side
  warning for every dropped item. Browse items may carry a transient `status`
  (`processing`/`failed`) surfaced in the picker grid.

  Media-library handlers now receive the per-request context built by the app's `extendRequest`
  initwares as their second argument — `list(query, ctx)` — so adapters use the initware-provided
  clients instead of constructing their own. `MediaQuery` gains `scope: 'folder' | 'all'` to
  distinguish a whole-library search from browsing the root level (on Shopware, root holds only
  unfiled assets), and both bundled adapters now honor `MediaQuery.type` server-side.

## [0.34.0] - 2026-07-13

### Minor Changes

- **Breaking:** The `@laioutr/logger` nuxt module has been removed. It is no longer installed by `frontend-core` or `orchestr`, and the package itself is no longer published. Internal logging now goes through `consola` (Nuxt's standard logger). This removes the pino dependency chain and prepares for an OpenTelemetry-based observability setup.

  What this means for your project:

  - The auto-imported `useLogger()` composable and server util are gone. Use `consola` instead:

    ```ts
    // Before
    const logger = useLogger('my-scope');

    // After
    import { consola } from 'consola';
    const logger = consola.withTag('my-scope');
    ```

  - The `$logger` global (`globalThis.$logger`, `event.node.req.log`) is no longer provided.
  - The `ltrLogger` config key (`logLevelServer`, `logLevelClient`, `logForDevelopment`, `logNitroRequestsVerbose`, `logNitroResponsesVerbose`) is no longer read — remove it from your `nuxt.config.ts`.
  - Request-id middleware (pino-http request logging, `x-request-id` response header, Sentry request-id tagging) is no longer included.

### Patch Changes

- Component reflection now lists each entity component's resolvers with the effective one first — the resolver `get()` actually selects at runtime (highest `order`, last-registered on ties). They were previously returned in registration order, so tools reading `implementations[0]` to attribute a component to its providing app (e.g. the Studio dynamic-data-source picker) could show the wrong app when several installed apps resolve the same component. The picker now shows the icon of the app that actually provides each value.

## [0.32.1] - 2026-06-30

### Patch Changes

- Fix SSR 500 (`[nuxt] instance unavailable`) on data-bound pages. `renderQueryToWire` resolved the Nuxt app at call time via `callHookSync`, but it runs inside lazily-evaluated computeds (e.g. the SEO head getters), which execute outside Nuxt's async context — there `useNuxtApp()` throws. The Nuxt app is now captured during composable setup and threaded through, so query-to-wire conversion is safe to run from any phase (render, head serialization, watchers).

## [0.28.14]

### Added

- **Orchestr**: Queries now respect URL aliases and the `isRoot` configuration. Root queries use prefix-less URL params (e.g., `?p=2` instead of `?queryId[p]=2`), resulting in cleaner URLs for listing and search pages.

### Fixed

- **Orchestr**: Fixed query results not updating on client-side navigation. A `markRaw` optimization on the orchestr store's `queryResults` prevented Vue from detecting when queries transitioned from loading to resolved; the store now replaces the inner reference after streaming completes to trigger reactivity correctly.
- **Orchestr**: Patch values from valtio state changes are now always plain, serializable objects. Live proxy references and raw valtio targets are no longer leaked into patches, preventing serialization errors via `structuredClone` or `postMessage`.

## [0.28.11]

### Added

- **Orchestr**: Exported `OrchestrBuilder` types so apps can re-export their builders with correct TypeScript types.

## [0.28.9]

### Fixed

- **Orchestr**: Fixed `useRoute()` returning stale route data in studio preview. Preview mode has no `<NuxtPage>`, so the `page:finish` hook that syncs Nuxt's internal route ref never fired. Preview now emits `page:finish` after each navigation to keep `useRoute()` current.

## [0.28.7]

### Added

- **Orchestr**: Cache keys for queries, links, and component resolvers now automatically include `locale:currency` from `ClientEnv`. This prevents multi-language storefronts from serving stale cross-locale cached data. `ComponentResolver.getKeySuffix` now receives `ClientEnv` as an argument.

### Fixed

- **Orchestr**: Fixed loading-state not updating correctly from async watchers.

## [0.27.0]

### Fixed

- **Orchestr**: Queries now correctly respect all query-aliases during navigation.

## [0.26.0]

### Changed

- **Orchestr**: Removed `input` from links. Entities can now be passed directly through links.

## [0.21.0]

### Added

- **Orchestr**: Added `path` property to error chunks for easier error attribution.
- **Orchestr**: Queries now respect the default query limit from `RcQueryLoadSpec`.

### Fixed

- **Orchestr**: Fixed `shouldLoad` behaviour in query-handlers.

## [0.20.0]

### Added

- **Orchestr**: New API endpoint for clearing cache data.
- **Orchestr**: Query-handlers can now pass component overrides that take precedence over regular component data for a specific query.
- **Orchestr**: Passthrough data is now stored by token string instead of token object, fixing issues with restoring passthrough from cache.

## [0.19.0]

### Added

- **Orchestr**: Experimental tracing and summary support. Activate by passing `options: { dev: { enableTracing: true } }` with queries.

## [0.18.0]

### Added

- **Orchestr**: Added missing client-side action hooks.
- **Orchestr**: Added `passthrough.require` for declaring required passthrough data.

### Fixed

- **Orchestr**: Fixed missing `runWithTrace` calls.
- **Orchestr**: `ComponentResolver` no longer double-caches components that are already cached.

## [0.17.0]

### Added

- **Orchestr**: Basic request tracer. Activate by sending queries with `options: { dev: { enableTracing: true } }`.

## [0.16.2]

### Fixed

- **Orchestr**: Fixed crash when accessing an entity that was not received from the pinia store.

## [0.16.1]

### Fixed

- **Orchestr**: Fixed cache-key escaping.

## [0.16.0]

### Added

- **Orchestr**: Implemented passthrough caching.

## [0.15.0]

### Added

- **Orchestr**: Implemented proper component cache.

## [0.14.0]

### Added

- **Orchestr**: Added `isPreview` property to `ClientEnv`.
- **Orchestr**: Introduced `extendRequest` as the replacement for the removed `useOnce` and `extendClientEnv`.

### Changed

- **Orchestr**: Removed `useOnce` and `extendClientEnv`. Use `extendRequest` instead.

## [0.13.0]

### Added

- **Orchestr**: Implemented caching mechanism.

## [0.12.0]

### Added

- **Orchestr**: Added stable-hash for the orchestr pinia-store.
- **Orchestr**: `templateProviders` for queries are now reflected via the reflect API.

---

## Orchestr Devtools (legacy 1.x)

These entries predate the devtools moving onto the Orchestr version line. Devtools changes now appear in the Orchestr versions above, going forward.

### [1.7.0]

### Changed

- **Orchestr Devtools**: Moved to a dedicated Nuxt Devtools tab for a cleaner development experience, replacing the previous standalone overlay panel.

### [1.6.0]

### Added

- **Orchestr Devtools**: Experimental Sankey diagram visualization for query data flow.

### [1.5.0]

### Added

- **Orchestr Devtools**: Added missing component resolver hint to the devtools panel.

### [1.4.16]

### Added

- **Orchestr Devtools**: `projectSecret` protection can now be disabled via configuration.
