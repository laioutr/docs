---
title: Frontend Changelog
description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
seo:
  title: Frontend Changelog | Laioutr
  description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
---

All notable changes to the **Laioutr frontend** (Nuxt based storefront, Frontend Core integration, and built in frontend features) will be documented in this file.

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