---
title: Core Types Changelog
description: Changelog for Laioutr Core Types (@laioutr-core/core-types) following Keep a Changelog and Semantic Versioning.
seo:
  title: Core Types Changelog | Laioutr
  description: Changelog for Laioutr Core Types (@laioutr-core/core-types) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/core-types-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr Core Types** (`@laioutr-core/core-types`, the shared TypeScript types for the Laioutr platform) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.31.0]

### Added

- `CalendarDate` value type — an ISO `YYYY-MM-DD` calendar date (no time, no timezone), exported from `@laioutr-core/core-types/common`. Use it for whole-day values such as a location's opening/reopening date.

### Changed

- Aligned `RcGlobalSection` slots and queries to `RcDictionary`, and added an optional `studio.description`.

## [0.30.3]

### Added

- `RcPropValueEntityProperty` for query-bound prop values — a new variant on the `RcPropValue` union that lets a single prop read its value from a property of a query-result entity (e.g. `{ type: 'entity-property', queryId: 'q1', path: ['components', 'base', 'image'] }`). The composite `path` uses the same `components.*` / `links.*` form as string-template references.
- `installedApps: Record<string, AppRuntimeMeta>` on `ProjectFrontendContext` — apps registered in the deployed frontend via `registerLaioutrApp` (including frontend-core itself). Used by the cockpit to gate features that require a specific framework/app version.

### Changed

- Lifted `RenderQueryReference.queryPath` from `string` to `string[]` and added an `entity-property` variant to the `RenderQueryReference` and `RenderQueryLoadSpecSeed` unions (internal render-pipeline types, consumed only by `@laioutr-core/frontend-core`).

### Fixed

- Fixed silent registry eviction in `applyZodFix` that caused id-less reflection output (e.g. `MediaImage`, `MoneyAmount`, `Link`) on Vercel-deployed Nuxt apps. `applyZodFix` previously evicted the existing registry entry when a schema with the same id was registered a second time; in the dual-bundle case (server bundle + `@vercel/nft`-traced copy of `@laioutr-core/core-types`) this left `zodToJSONSchema` unable to find the schema's metadata, so reflection inlined canonical schemas without an `id` or `$ref` and Studio consumers misclassified Media/Money/Link properties as plain `object`. New behavior: merge the new meta into the existing entry and store the merged record against both schema instances. HMR additive edits to `description`/`title`/`examples` still take effect; removing a meta field requires a dev-server restart (rare).

## [0.30.1]

### Added

- Expanded the `Media` type family with audio support and richer video metadata:
  - `MediaAudio` (`type: 'audio'`) — new variant of `Media` for playable audio assets, with `sources: MediaSourceAudio[]`, optional `cover?: MediaImage` (album art / podcast cover), and optional `tracks?: MediaTextTrack[]` (chapters, transcripts).
  - `MediaSourceAudio` — single audio source with `provider`, `src`, optional `format` (MIME), `length`, and `streaming`.
  - `MediaTextTrack` — timed text track (subtitles, captions, descriptions, chapters, metadata) for `MediaVideo` and `MediaAudio`, mapping to the HTML `<track>` element.
  - `MediaSourceVideo.streaming?: 'progressive' | 'hls' | 'dash'` — delivery-format discriminator. `progressive` is assumed when omitted.
  - `MediaVideo.tracks?: MediaTextTrack[]` — subtitle/caption/chapter tracks for the video.
  - Studio `media` fields can now use `allowedTypes: ['audio']`, which narrows the field value to `MediaAudio`.

### Changed

- **Breaking:** `MediaVideo.preview` renamed to `MediaVideo.poster`, matching the HTML `<video poster="…">` attribute and the customer-facing terminology used in Studio.

  ```ts
  // Before
  const video: MediaVideo = {
    type: 'video',
    sources: [...],
    preview: posterImage,
  };

  // After
  const video: MediaVideo = {
    type: 'video',
    sources: [...],
    poster: posterImage,
  };
  ```

- **Breaking:** the `Media` union was widened to include `MediaAudio`. Code that exhaustively switches on `media.type` without a default branch will need to handle `'audio'`:

  ```ts
  switch (media.type) {
    case 'image':
      return renderImage(media);
    case 'video':
      return renderVideo(media);
    case 'audio':
      return renderAudio(media); // new — handle or fall through to default
  }
  ```

## [0.30.0]

### Added

- Optional `if?: SchemaCondition` on `StudioFieldDefinition` and `StudioFieldsetDefinition`. `SchemaCondition` is a JSON expression (typed via `@laioutr/expression`) that conditionally hides a field or fieldset in the Studio sidebar based on the section/block's current values. Example: `customBackgroundField` is hidden unless `['==', ['get', 'background'], 'custom']`.

## [0.29.0]

### Changed

- **Breaking:** Updated `Media`, `Swatch`, and `coerceFieldValue` to align with the surface-tone type changes in the UI family (`BackgroundBrightness` → `SurfaceTone`). Consumers reading these types should treat the colour-mode field as `'light' | 'dark' | 'bright'`.

## [0.28.15]

### Changed

- Use `z.object({ ...base.shape, ... })` instead of `base.extend({ ... })` for schema composition so the JSDoc zod-meta plugin resolves field descriptions correctly.

## [0.28.14]

### Changed

- Wired `urlAlias` and `isRoot` end-to-end from RC page config through the orchestr store to client-side URL generation. Refactored `QueryParams` so `isRoot` is the single source of truth for root-level URL params — callers no longer need to pass an empty prefix.

## [0.28.2]

### Fixed

- Replaced the wildcard `./*` exports pattern with explicit subpath exports. The wildcard pattern was not properly traced by `@vercel/nft`, causing `ERR_MODULE_NOT_FOUND` for `dist/orchestr/index.js` at runtime on Vercel even though the build succeeded.

## [0.28.0]

### Added

- Multi-market render types: `RenderLanguage`, `RenderMarket`, `RenderI18nConfig`, plus `localizedPaths` and `marketIds` on `MetaPage`.

### Changed

- **Breaking:** Removed the `ALL_LOCALES` (`'*'`) wildcard. The `localeChain` no longer includes `'*'` as a tail element, and `normalizeLocalizedPaths` no longer prefers the `'*'` key as fallback. All localized values must use concrete BCP 47 locale codes.

## [0.27.0]

### Added

- `createEntityComponentTokenFactory` helper.

## [0.26.0]

### Added

- JSON field type.

### Changed

- Implemented the most common types as proper TypeScript types.

## [0.25.0]

### Added

- Optional `description` field on `pageTypeToken`.
- `WellKnownComponentTag` value `'Blog'`.

## [0.24.0]

### Changed

- Separated `core-types` from the `canonical-types` package.
