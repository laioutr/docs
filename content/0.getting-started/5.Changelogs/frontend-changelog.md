---
title: Frontend Changelog
description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
seo:
  title: Frontend Changelog | Laioutr
  description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/frontend-changelog
  lastmod: 2026-06-03
  changefreq: monthly
  priority: 1.0

---

All notable changes to the **Laioutr frontend** (Nuxt based storefront, Frontend Core integration, and built in frontend features) will be documented in this file.

## [0.30.3]

### Added

- **Frontend Core**: Render pipeline now supports `RcPropValueEntityProperty`. Seeds are gathered, query paths are resolved via the new shared `resolveEntityPath` helper, and resolved values are coerced through `coerceFieldValue` — so e.g. a string URL bound to a media field becomes a `Media` object. The dynamic-string render branch now also routes through `resolveEntityPath`, unifying the two query-bound paths.
- **Frontend Core**: Reflect endpoint now exposes `installedApps: Record<string, AppRuntimeMeta>` — every `registerLaioutrApp` caller (including frontend-core itself) keyed by name, with its `version` and `pageWrapper`. Backed by a new server-only virtual file `#laioutr/installed-apps`, populated lazily from `laioutrAppRegistry.getAllMetas()` so apps registered later in module setup are still captured.
- **Frontend Core**: `frontend-core:link-resolver:resolve` is now a filter hook. It runs after a link is resolved, with `result.value` pre-seeded with the resolved URL or path. Handlers receive the resolved value and may transform it (e.g. append query params) for any link type, and the value is threaded across multiple handlers. Existing handlers that overwrite `result.value` keep working unchanged.

### Changed

- **Frontend Core**: `rcPropValueToRender` now treats unknown `RcPropValue.type` values as "no value" (returns `undefined`) and emits a deduplicated `console.warn`, instead of leaking the raw value object to downstream renderers. Lets newer studio configs degrade gracefully on older frontend-core deployments rather than crashing.

### Fixed

- **Frontend Core**: `frontend-core:link-resolver:*` and `frontend-core:page-renderer:select-page-variant` hooks now actually take effect — handler-set `result.value` is read synchronously. Previously the result was read before Nuxt's deferred handlers ran, so every registered handler's output was silently dropped.

## [0.30.2]

### Added

- **Frontend Core**: URL redirects configured for the project are now honored at runtime. Visiting a redirect source path — exact match or `:param` pattern — sends the user to the configured target, with `isPermanent: true` returning 301 and `isPermanent: false` returning 302. Works for direct hits, hard reloads, and SPA navigations via `<NuxtLink>` or `router.push`, including on storefronts that define a custom `core/404` page. Query strings are preserved; targets can be absolute URLs for external redirects.

## [0.30.1]

### Added

- **Frontend Core**: New `laioutr:beforeModuleRegister` Nuxt hook fires before the ui-kit module registers each upstream module, with `{ name, key, options }`. Consumers can mutate `options` to override defaults applied by `registerModule`.

### Fixed

- **Frontend Core**: Section `slots` prop now retains structural typing of block props at consumer call sites. The previous wrapper used deep `SimplifyDeep`, which past a certain schema depth tripped TypeScript's 50-level instantiation limit and surfaced as `TS2589: Type instantiation is excessively deep and possibly infinite` in sections that mapped over their slot blocks. Bounded `Simplify` is now applied at the slot-map / block / `props` boundaries. Sections that previously needed an `as unknown as ReadonlyArray<{ props: Record<string, any> }>` cast on `props.slots.*` can drop the cast and access `block.props.<field>` with full type inference. No runtime or API change.

## [0.29.0]

### Added

- **Frontend Core**: 8 missing discriminated event types added to `tracking.types.ts` — `RemoveFromCart`, `AddToWishlist`, `RemoveFromWishlist`, `ViewCart`, `AddShippingInfo`, `AddPaymentInfo`, `Login`, `SignUp`. Trackers in `trackingActions.ts` now construct the correct types instead of falling through to mismatched ones (e.g. `ViewItem` for `ADD_TO_WISHLIST`), which previously broke the `Analytics` discriminated union silently.
- **Frontend Core**: Re-exported the `DefinitionToProps` type from `#frontend/types` so consumers can derive prop types from a section/block definition without reaching into internal paths.

### Fixed

- **Frontend Core**: Reordered the `undefined` check in `validateI18nConfig` to happen before indexing `market.domains`. `FieldDefinitionToProp` generic constraint widened from `StudioFieldDefinition` to `BaseFieldDefinitionBase` so the type-parameter chain is consistent with `FieldDefinitionToType` and `FindFieldWithName`.

### Removed

- **Frontend Core**: Removed the unused `InvisibleBlock` component. It had no source consumers — only auto-generated `.nuxt/components.d.ts` references that regenerate on the next build. Its placeholder UI was leftover from an earlier editor experiment and was not used anywhere in the runtime tree.

## [0.28.14]

### Fixed

- **Frontend Core**: Fixed `RemoteRender` not caching page data across navigations, preventing redundant data fetches when returning to a previously visited page.

## [0.28.13]

### Fixed

- **Frontend Core**: Fixed `PageRenderer` crashing when the Nuxt instance is unavailable by removing the hook registration guard safely.
- **Frontend Core**: Fixed the page-variant selection hook in `PageRenderer` not correctly resolving the selected variant in all cases.
- **Frontend Core**: Fixed incorrect port displayed in the CLI startup banner.

## [0.28.12]

### Added

- **Frontend Core**: New Nuxt hook for page-variant selection, allowing apps to intercept and override the active page variant during rendering.

## [0.28.11]

### Added

- **Orchestr**: Exported `OrchestrBuilder` types so apps can re-export their builders with correct TypeScript types.

## [0.28.10]

### Added

- **Frontend Core**: Cross-locale redirect middleware that redirects users to the correct locale URL on entry.
- **Frontend Core**: Shared hreflang link utility with fixes for missing `x-default` path prefix.
- **Frontend Core**: Longest-prefix domain matching for multi-market domain resolution.
- **Frontend Core**: Warning logs for host-sharing conflicts and unknown market/locale fallbacks.

### Fixed

- **Frontend Core**: Fixed SSR protocol detection in `linkResolver` to correctly generate absolute URLs.
- **Frontend Core**: Language fallback in `buildI18nConfig` now resolves correctly when a locale has no explicit configuration.

## [0.28.9]

### Fixed

- **Frontend Core**: Fixed duplicate section templates in Studio by switching the template registry from an array to a Map, preventing re-registration on repeated SSR renders.
- **Frontend Core**: Wired mock style tokens into the reflect API so the Studio receives color and icon data instead of empty objects.
- **Frontend Core**: Fixed `useRoute()` returning stale route data in Studio preview. The preview now emits `page:finish` after each navigation to keep `useRoute()` current.

## [0.28.8]

### Fixed

- **Frontend Core**: Fixed `useRoute()` in Studio preview mode.

## [0.28.6]

### Fixed

- **Frontend Core**: Fixed reflect API returning 503 on Vercel by using `globalThis` as the data transport between the SSR plugin and API handler. Adds a persistent cache fallback for cold starts, a dedicated lightweight SSR trigger route (`/_laioutr/reflect`), and improved error logging.

## [0.28.5]

### Fixed

- **Frontend Core**: Fixed "chain is not iterable" crash when no markets are configured by adding the missing `localeChain` to the fallback language object.

## [0.28.4]

### Fixed

- **Frontend Core**: Inlined core-types into Nitro bundle for Vercel compatibility.

## [0.28.3]

### Fixed

- **Frontend Core**: Fixed reflect API route for Vercel deployment.

## [0.28.2]

### Fixed

- **Core Types**: Replaced wildcard package exports with static exports to fix Vercel builds.

## [0.28.1]

### Fixed

- **Frontend Core**: Fixed Orchestr import path.

## [0.28.0]

### Added

- **Frontend Core**: **Field-value coercion** — automatic conversion between field types (text→media, text→link, text→number, number→text).
- **Frontend Core**: Shadow `nuxt-i18n` composables for seamless multi-market integration.
- **Frontend Core**: Route aliases for market domains in Studio preview mode.
- **Frontend Core**: Send proper error 404 responses on not-found pages.
- **Core Types**: Enforce field translatability in Studio `setStaticProp`.
- **Core Types**: Enable JSON Schema meta and replace `zodAs` with `z.ZodType`.
- **Core Types**: Split field definitions into studio and system categories.
- **Core Types**: Make `RcPage.path` optionally non-localized for pages that don't need per-locale paths.

### Changed

- **Frontend Core**: Removed `ALL_LOCALES` wildcard in favor of explicit locale codes throughout the frontend codebase.
- **Frontend Core**: Improved route resolution during navigation.
- Updated Orchestr, Kit and Core Types to `0.28.0`.

### Fixed

- **Frontend Core**: Correct locale-switching behavior in Studio preview.
- **Frontend Core**: Do not assume no-prefix for default-domain in markets.

## [0.27.3]

### Added

- **Frontend Core**: **Multi-market i18n support** using nuxt-i18n:
  - `buildRoutes` with alias generation and collision detection for localized paths.
  - `resolveMarketFromRequest` for host- and path-based market resolution.
  - `buildI18nConfig` transform and `validateI18nConfig` (dangling ref and collision detection).
  - Utilities: `fillParams`, `toDevHost`, `getExonym`.
  - Chain-based `unlocalize` and `resolvePagePath`.
  - Core Types: Render i18n types (RenderLanguage, RenderMarket, RenderI18nConfig, localizedPaths, marketIds).

### Changed

- **Orchestr**: Migrated from async iterable to ChunkStreamer on the server for streaming.

## [0.27.2]

### Added

- Frontend Core: Added a Cockpit link to the CLI banner so developers can jump directly from the dev server to the corresponding project in Cockpit.

### Changed

- Updated Orchestr, Kit and Core Types to `0.27.2`.

## [0.27.1]

### Changed

- Frontend Core: Improved types for tracking integrations and added the missing vue-router connection for tracking.
- Updated Orchestr, Kit and Core Types to `0.27.1`.

## [0.27.0]

### Changed

- Orchestr: Queries now respect all query aliases on navigation, ensuring correct query reuse when navigating between pages.
- Frontend Core: Updated dependencies to the `0.27.0` release line (Orchestr, Core Types, Kit).

## [0.26.1]

### Changed

- Frontend Core: Consent adapter quality-of-life improvements (easier integration and better ergonomics for consent adapters).
- Updated Orchestr, Kit and Core Types to `0.26.1`.

## [0.26.0]

### Added

- Frontend Core: Respect `queryReference.link` while resolving query fields so linked queries behave correctly.

### Changed

- Orchestr: Removed input from links and allowed passing entities from links, making link handlers more flexible.
- Updated Core Types and related dependencies to `0.26.0`.

## [0.25.0]

### Changed

- Frontend Core & Orchestr: Dependency updates to align with Core Types `0.25.0` and internal improvements.

## [0.24.0]

### Changed

- Frontend Core & Orchestr: Dependency updates around Core Types `0.24.0` with internal refinements.

## [0.23.1]

### Added

- Frontend Core: Added a CLI banner to improve the developer experience when starting the frontend.

### Changed

- Updated Orchestr, Canonical Types and Kit to `0.19.1` / `0.23.1`.

## [0.23.0]

### Added

- Frontend Core: Respect default query limit coming from `RcQueryLoadSpec`, so frontends honour query default limits defined in RC.

### Changed

- Orchestr: Added a `path` property to error chunks and improved default query limit handling and `shouldLoad` behaviour in query handlers.
- Updated Canonical Types and Kit to match the new query behaviours.

## [0.22.2]

### Added

- Frontend Core: Allowed the link resolver to handle string links, making it easier to work with plain URLs in link fields.

### Changed

- Orchestr & Canonical Types: Internal updates around `0.20.0` / `0.18.0`.

## [0.22.1]

### Fixed

- Frontend Core: Links with references are now case-insensitive to their `type`, preventing subtle bugs when reference types differ only in casing.

## [0.22.0]

### Added

- Frontend Core: Properly implemented the link resolver and moved core page-type registration to a plugin so page types are registered consistently.

### Changed

- Orchestr & Canonical Types: Updated to support the improved link resolver and page-type handling.

## [0.21.1]

### Changed

- Frontend Core & Orchestr: Dependency updates around error handling and tracing to `0.19.0` / `0.16.0`.

## [0.21.0]

### Added

- Frontend Core: Exported i18n formatters so projects can reuse Laioutr’s measurement and money formatting utilities.

### Changed

- Orchestr: Added missing client-side action hooks and `passthrough.require`, improved tracing and component-cache behaviour.

## [0.20.6] – [0.20.1]

### Changed

- Frontend Core & Orchestr: Series of dependency and cache-related improvements (passthrough caching, component cache, cache-key fixes, and Dev-only LRU cache for orchestr-store).

## [0.20.0]

### Added

- Frontend Core: Added `projectSlug` to the frontend-core config and a provisional link-resolver that later evolved into the current link resolver feature.

### Changed

- Orchestr: Introduced a cache-clear API endpoint, the ability to pass components directly from query handlers, and improved passthrough storage by token-string.

## [0.19.x – 0.18.x]

### Added

- Frontend Core: Implemented dynamic-string references in string props and support for queries in array-items and object fields.
- Orchestr: Introduced the initial caching mechanism, stable hashing for the orchestr Pinia store, remote `QueryTemplates`, and basic request tracing / summary support.

### Changed

- Frontend Core & Orchestr: Multiple dependency updates around Canonical Types, Kit and Logger to support the new query/template/caching features.

## [0.17.x – 0.14.x]

### Added

- Frontend Core: Implemented remote `QueryTemplates`, added a catch-all page, and improved Studio refresh compatibility.
- Orchestr: Added support for remote `QueryTemplates`, `extendRequest`, preview flags in `clientEnv`, and better template provider reflection.

### Changed

- Frontend Core & Orchestr: Several internal refactors, type-guard moves, and dependency upgrades to align with Canonical Types and Kit.

## [0.13.0 and earlier]

### Added

- Initial public versions of **Frontend Core** and **Orchestr**, including:\n  - Base page/section rendering pipeline.\n  - Early section definitions and demo setup.\n  - First integration of media library handling and documentation generation from canonical types.\n  - Migration of base components to the UI Kit.\n  - Shopify demo and early ecommerce flows.\n

### Changed

- Iterative improvements to configuration, query handling, and orchestr integration as the frontend product matured towards its current architecture.