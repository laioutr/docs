---
title: Orchestr Changelog
description: Changelog for @laioutr-core/orchestr following Keep a Changelog and Semantic Versioning.
seo:
  title: Orchestr Changelog | Laioutr
  description: Changelog for @laioutr-core/orchestr following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/orchestr-changelog
  lastmod: 2026-04-15
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Orchestr** (`@laioutr-core/orchestr`), the Laioutr data-fetching and query orchestration layer, will be documented in this file.

## [0.28.14]

### Added

- **Orchestr**: Queries now respect URL aliases and the `isRoot` configuration. Root queries use prefix-less URL params (e.g., `?p=2` instead of `?queryId[p]=2`), resulting in cleaner URLs for listing and search pages.

### Fixed

- **Orchestr**: Fixed query results not updating on client-side navigation. A `markRaw` optimization on the orchestr store's `queryResults` prevented Vue from detecting when queries transitioned from loading to resolved; the store now replaces the inner reference after streaming completes to trigger reactivity correctly.
- **Orchestr**: Patch values from valtio state changes are now always plain, serializable objects. Live proxy references and raw valtio targets are no longer leaked into patches, preventing serialization errors via `structuredClone` or `postMessage`.

## [0.28.11]

### Added

- **Orchestr**: Exported `OrchestrBuilder` types so apps can re-export their builders with correct TypeScript types.

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
