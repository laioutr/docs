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
