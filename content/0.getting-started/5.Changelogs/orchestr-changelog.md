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
