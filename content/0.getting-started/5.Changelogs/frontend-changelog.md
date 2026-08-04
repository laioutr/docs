---
title: Frontend Changelog
description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
seo:
  title: Frontend Changelog
  description: Changelog for the Laioutr frontend product following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/frontend-changelog
  lastmod: 2026-06-03
  changefreq: monthly
  priority: 1.0

---

All notable changes to the **Laioutr frontend** (Nuxt based storefront, Frontend Core integration, and built in frontend features) will be documented in this file.

## [0.39.0] - 2026-08-04

### Minor Changes

- Add a `laioutr://` resource locator for addressing a single field inside a project's configuration tree.

  `@laioutr-core/core-types/locator` exports `formatLocator`/`parseLocator` plus the supporting types (`StudioLocator`, `LaioutrLocator`, `StudioContainerKind`, `LocatorPathStep`, `StudioLocatorView`, `LocatorParseResult`) and the `STUDIO_CONTAINER_KINDS` constant. A locator names a namespace (`studio` is the only one today), a container (`pageVariant`, `section`, `sectionRef`, `globalSection`, or `block`) by id, a path of object-key or array-item-by-id steps into its props, and optional view coordinates (`locale`, `market`, `ref`) — for example `laioutr://studio/block/blk_C3/slides[itm_E5]/heading?locale=de`.

  Both directions also handle a relative form that omits the `laioutr://studio/` base: `formatLocator(loc, { relative: 'studio' })` emits it and `parseLocator(input, { relative: 'studio' })` accepts it. Without that option `parseLocator` takes absolute input only — a body with no scheme names no namespace, so the caller has to say which one it means. `parseLocator` never throws: it returns `{ ok: true, value } | { ok: false, error }` for every input, including an unsupported namespace, malformed percent-encoding, or empty path segments.

## [0.38.3] - 2026-08-03

### Patch Changes

- Stop the reflect endpoint from serving a previous deployment's section and block
  catalog. Its cached reflection is now keyed by build id, so a redeploy is a cache
  miss instead of inheriting whatever the last build left behind, and two frontends
  sharing one Redis no longer overwrite each other's entry. Cached entries expire
  after 12 hours.

  Previously the cache entry outlived the deployment that wrote it: a frontend whose
  cache driver is Redis could hand Studio the old build's component definitions,
  templates, page types and style tokens after a deploy, and a failed SSR trigger
  would keep re-persisting that entry rather than refreshing it.

## [0.38.2] - 2026-07-31

### Patch Changes

- **Breaking:** Stop installing `@nuxtjs/robots`. `robots.txt`, the `X-Robots-Tag` header and the
  route-rule `robots` value now come from the `@laioutr/app-essentials-seo` app —
  install it to keep them, and configure them through its app config instead of
  `nuxt.options.robots`.

  A frontend with neither that app nor its own `@nuxtjs/robots` install serves no
  `/robots.txt` (a 404 tells crawlers to crawl everything, which is what the previous
  default content said), and any `robots` key in `nuxt.config` or in a route rule is
  silently inert.

  Page-level `robots` meta tags are unaffected — they come from the page variant's SEO
  settings, not from the module.

## [0.38.1] - 2026-07-30

### Patch Changes

- Add `aiDisclosure` to `Media`, recording whether an asset was fully AI-generated
  (`'generated'`) or altered by generative AI (`'modified'`). Available on images,
  videos and audio; a video's `poster` and an audio's `cover` carry their own value
  independently of the parent.

  Media-library providers and component resolvers may set it from an authoritative
  backend signal, and should omit it otherwise: absent means no disclosure is known,
  not that the asset is human-made. An unrecognised value fails the canonical `Media`
  parse, so the item is dropped with a server-side warning.

  The `<Media>` component does not render the field.

## [0.38.0] - 2026-07-29

### Minor Changes

- Fill hreflang alternates, `og:locale:alternate`, `x-default` and the locale switcher with each locale's own route params instead of the current locale's.

  On a page whose slug is translated per locale, the alternate URLs and the locale-switch target previously reused the current locale's params — pointing at URLs that do not exist in the target locale. Where the page type's `pageIndex` registration implements `locate` and reports a complete per-locale map, each locale now gets its own slug, and locales the page does not exist in are omitted from the alternates rather than guessed at.

  Omission follows only from that complete map. A `locate` that resolves just the locale it was called in omits the map entirely, and its pages keep filling every alternate from the current locale's params — a partial map cannot distinguish "no page in this locale" from "did not look", so nothing is dropped on its word.

  The lookup runs alongside the page queries and is bounded by a 2s SSR budget. If it breaches, that render falls back to the previous behaviour — every alternate filled from the current locale's params — while the request completes and warms the server cache, so the next render is correct. Page types whose connector provides no `locate` are unchanged, as are single-language projects and pages without dynamic params — neither performs a lookup.

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

- Force `noindex, nofollow` on content-preview page renders. Preview URLs serve unpublished, secret-gated content and carry the preview token in the URL, so they must never be indexed. `PageRenderer` now overrides the page's configured `robots` (and any `page-head:resolve` hook) whenever a request carries a preview token — whether preview is pending, active, or rejected.

- Consent-store consumers registered via `onConsentChange` now receive updates. The store mutated its state ref in place while watching it without `deep`, so the watcher never fired and consumers reacting to consent changes were never notified. Consent updates now reassign the state, triggering the watcher.

## [0.37.0] - 2026-07-23

### Minor Changes

- Add content preview: a CMS editor opening a storefront URL with `?preview_token=<token>` now sees unpublished content, server-rendered, instead of the published page.

  The token is verified server-side against the project's `previewToken` with a timing-safe compare, and the verdict is what reaches connectors as `clientEnv.isPreview`. A wrong token renders published content and never throws. Any response rendered for a presented token — granted or rejected — is sent as `private, no-store`, which keeps it out of a _shared_ cache such as a CDN or reverse proxy.

  New auto-imported composable:

  ```ts
  const { enabled, status, state } = useContentPreview();
  // status: 'off' | 'pending' | 'active' | 'rejected'
  // enabled: true only once the server has verified the token — safe for `v-if`
  // enabled is writable, so `enabled.value = false` still exits preview
  ```

  Two new hooks:

  - `frontend-core:content-preview:resolve-token` — a bail hook over the token source. Set `result.value` to drive preview from a cookie or request header instead of the query parameter. Handlers must be synchronous and registered from a plugin with `enforce: 'pre'`.
  - `frontend-core:content-preview:changed` — fires after a preview transition with the new `enabled` value. frontend-core already refreshes Nuxt data and the orchestr store; use this to invalidate your own caches.

  Adds `POST /api/frontend/preview-verify`, an unauthenticated endpoint that answers `{ granted: boolean }` for a presented token. It is a UI hint only — authorization for real data is the gate that runs on every orchestr request regardless.

  Media-library requests (Cockpit's asset browser) now run with the project's default market and language instead of a placeholder `{ locale: 'en', currency: '' }`. Providers that relied on the empty currency triggering their own fallback will now receive the default market's real currency. Media requests are never preview.

- Add the content-preview token to the two contracts that carry it.

  `RcProject.laioutr.previewToken?: string` is the project's content-preview token, read from `laioutrrc` by every deployed frontend. It is separate from `projectSecretKey` and separately rotatable, because it is pasted into CMS preview-URL templates. It reaches a frontend at deploy time, so rotating it in Cockpit has no effect until the project redeploys.

  `EditorChildProps.previewToken?: string` lets Cockpit push the token to the Studio iframe when an editor turns content preview on. Absent or `undefined` means preview is off.

## [0.36.0] - 2026-07-20

### Minor Changes

- **Breaking:** The `ai` metadata on section and block definitions is now a typed `AiComponentMetadata` object with exactly two optional fields — `description` (agent-facing facts that don't fit the picker-facing `studio.description`) and `examples` (a worked slot/block composition for complex multi-block sections). The previous free-form `{ label, description }` shape, the co-located `ai-descriptions/*.md` files, and the `aiDescription()` helper are removed. An absent `ai` object is the normal state: `studio.description` plus the field/slot schema carry the load for agents, and all built-in section/block descriptions have been enriched with the facts that previously lived in `ai` metadata. Prescriptive guidance fields (`useWhen`, `avoidWhen`, `constraints`, `neverWith`, `pairsWellWith`, `typicallyFollowedBy`, `supports`, …) are gone — evals showed they measurably degrade agent page composition.

  ```ts
  // before
  ai: { label: 'Button', description: aiDescription('BlockButton') }

  // after — most definitions:
  // (no ai key at all; put facts in studio.description)

  // after — only where a fact doesn't fit the picker text or an assembly is non-obvious:
  ai: {
    description: 'Currently a progress display only — it does not yet fetch the next batch.',
    examples: 'gallery slot: BlockProductMediaGallery; content column: BasicInfo, PriceInfo, CartButton in on-page order.',
  }
  ```

- Add the `DateTime` common value type — a timezone-qualified ISO 8601 instant (`z.iso.datetime({ offset: true })`), completing the temporal set next to `CalendarDate`, `Time`, and `Duration`.

- Add optional `studio.package`, `studio.kit`, and top-level `ai` metadata to section and block definitions.

## [0.35.1] - 2026-07-14

### Patch Changes

- Fix legacy media-library providers being omitted from Cockpit by registering their v2 provider and descriptor with the correct registry arguments.

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

- Add the `@laioutr-app/cms` media-library connector and the `RcProject.config.cdn`
  container it reads. The connector implements the shipped media-library interface
  against `apps/cdn-api`: cursor browse with folders, staged upload, and baseURL-free
  Cloudflare providers (image + video poster) on the per-project delivery host.
  `RcCoreConfig` gains an optional `cdn: { key, deliveryHost }` member (client-stripped
  via the existing `config` sanitisation).

- Video sources now support a `focalPoint`, mirroring image sources. The built-in `MediaVideo` renderer applies it as `object-position` (per viewport, with `center center` as the fallback) so the important region stays in frame when the video is cropped by `object-fit: cover`.

## [0.34.0]

### Changed

- **Breaking:** Media libraries are now connected as an Orchestr integration facet. A connector is declared with `defineX.mediaLibrary(...)` on the app's Orchestr builder instead of the standalone `defineMediaLibraryProvider` factory. Identity (`id`, `label`, `iconSrc`) is derived from the builder's `.meta()`; the connector declares static `capabilities` (search, tags, folders, sorts, upload transfer) and its handlers receive the app's per-request `ctx` as a second argument. Browsing moves to opaque-cursor pagination (`MediaQuery` → `MediaListResult`) with folders folded into `list`, an explicit `type` filter, and a browse-time `status`; upload gains a staged (direct browser→backend) path alongside proxied, both returning per-file results. `ProjectFrontendContext.mediaLibraries` now carries `{ id, label, iconSrc, capabilities }` descriptors. See [Media and Media Library](/frontend/features/media).
- Every `Media` source gained an optional `origin` (`{ libraryId, externalId? }`) recording the producing library and its stable asset id. It is stamped automatically when an asset is picked from a media library, is management-plane only (the renderer never reads it), and is additive — media stored before it existed remain valid. See [Media](/frontend/api-reference/common-types/media#source-origin).

### Deprecated

- `defineMediaLibraryProvider(...)` is deprecated in favour of `defineX.mediaLibrary(...)`. It keeps working as a compatibility shim so existing connectors register without a rewrite, in a degraded mode (no folder navigation, no staged upload, no declared sorts, no server-side type filtering), and logs a one-time warning at registration.

## [0.33.1] - 2026-07-06

### Patch Changes

- `content_alignment` field values that fall outside the field's axis-derived set are now healed when resolving render props, instead of passing through. A value already in the set is unchanged. When a field's `axis` was changed after the value was stored, the stored value is projected onto the new axis rather than discarded:

  - **Restrict** (`both` → single axis): the matching component is kept — `top-left` renders as `top` on a vertical field, `left` on a horizontal field.
  - **Widen** (single axis → `both`): the value is paired with a neutral `center` for the missing axis — `top` becomes `top-center`, `left` becomes `center-left`.

  Only a value with no analog on the new axis (an axis swap, e.g. `top` on a horizontal field) or a malformed value (e.g. `diagonal`) clamps to the field's fallback alignment (`center` / `center-center`). Previously any out-of-range value was discarded and replaced with the fallback, silently losing alignment intent the stored value still carried.

## [0.32.1] - 2026-06-30

### Patch Changes

- Resolve SEO title/description/robots placeholders against a setup-time snapshot of the page's queries instead of the live, route-reactive query map. `useSeoMeta`'s getters are evaluated during SSR head serialization — after render and outside Nuxt's async context — so reading the live map there rebuilt every query's wire request for nothing (the wire request is only a result-lookup key). The head now reads a stable snapshot; sections keep the live map so client-side filter/sort/pagination still re-fetch.

## [0.31.0]

### Added

- **Frontend Core**: Pages now render referenced global sections. A referenced global section is dereferenced into the page, its queries are merged into the page's query set, and its configuration is wired through at render time — so a section shared across pages renders consistently wherever it is referenced.
- **Core Types**: `CalendarDate` value type — an ISO `YYYY-MM-DD` calendar date (no time, no timezone), exported from `@laioutr-core/core-types/common`. Use it for whole-day values such as a location's opening/reopening date.

### Changed

- **Core Types**: Aligned `RcGlobalSection` slots and queries to `RcDictionary`, and added an optional `studio.description`.

## [0.30.3]

### Added

- **Frontend Core**: Render pipeline now supports `RcPropValueEntityProperty`. Seeds are gathered, query paths are resolved via the new shared `resolveEntityPath` helper, and resolved values are coerced through `coerceFieldValue` — so e.g. a string URL bound to a media field becomes a `Media` object. The dynamic-string render branch now also routes through `resolveEntityPath`, unifying the two query-bound paths.
- **Frontend Core**: Reflect endpoint now exposes `installedApps: Record<string, AppRuntimeMeta>` — every `registerLaioutrApp` caller (including frontend-core itself) keyed by name, with its `version` and `pageWrapper`. Backed by a new server-only virtual file `#laioutr/installed-apps`, populated lazily from `laioutrAppRegistry.getAllMetas()` so apps registered later in module setup are still captured.
- **Frontend Core**: `frontend-core:link-resolver:resolve` is now a filter hook. It runs after a link is resolved, with `result.value` pre-seeded with the resolved URL or path. Handlers receive the resolved value and may transform it (e.g. append query params) for any link type, and the value is threaded across multiple handlers. Existing handlers that overwrite `result.value` keep working unchanged.
- **Core Types**: `RcPropValueEntityProperty` for query-bound prop values — a new variant on the `RcPropValue` union that lets a single prop read its value from a property of a query-result entity (e.g. `{ type: 'entity-property', queryId: 'q1', path: ['components', 'base', 'image'] }`). The composite `path` uses the same `components.*` / `links.*` form as string-template references.
- **Core Types**: `installedApps: Record<string, AppRuntimeMeta>` on `ProjectFrontendContext` — apps registered in the deployed frontend via `registerLaioutrApp` (including frontend-core itself). Used by the cockpit to gate features that require a specific framework/app version.

### Changed

- **Frontend Core**: `rcPropValueToRender` now treats unknown `RcPropValue.type` values as "no value" (returns `undefined`) and emits a deduplicated `console.warn`, instead of leaking the raw value object to downstream renderers. Lets newer studio configs degrade gracefully on older frontend-core deployments rather than crashing.
- **Core Types**: Lifted `RenderQueryReference.queryPath` from `string` to `string[]` and added an `entity-property` variant to the `RenderQueryReference` and `RenderQueryLoadSpecSeed` unions (internal render-pipeline types, consumed only by `@laioutr-core/frontend-core`).

### Fixed

- **Frontend Core**: `frontend-core:link-resolver:*` and `frontend-core:page-renderer:select-page-variant` hooks now actually take effect — handler-set `result.value` is read synchronously. Previously the result was read before Nuxt's deferred handlers ran, so every registered handler's output was silently dropped.
- **Core Types**: Fixed silent registry eviction in `applyZodFix` that caused id-less reflection output (e.g. `MediaImage`, `MoneyAmount`, `Link`) on Vercel-deployed Nuxt apps. `applyZodFix` previously evicted the existing registry entry when a schema with the same id was registered a second time; in the dual-bundle case (server bundle + `@vercel/nft`-traced copy of `@laioutr-core/core-types`) this left `zodToJSONSchema` unable to find the schema's metadata, so reflection inlined canonical schemas without an `id` or `$ref` and Studio consumers misclassified Media/Money/Link properties as plain `object`. New behavior: merge the new meta into the existing entry and store the merged record against both schema instances. HMR additive edits to `description`/`title`/`examples` still take effect; removing a meta field requires a dev-server restart (rare).

## [0.30.2]

### Added

- **Frontend Core**: URL redirects configured for the project are now honored at runtime. Visiting a redirect source path — exact match or `:param` pattern — sends the user to the configured target, with `isPermanent: true` returning 301 and `isPermanent: false` returning 302. Works for direct hits, hard reloads, and SPA navigations via `<NuxtLink>` or `router.push`, including on storefronts that define a custom `core/404` page. Query strings are preserved; targets can be absolute URLs for external redirects.

## [0.30.1]

### Added

- **Frontend Core**: New `laioutr:beforeModuleRegister` Nuxt hook fires before the ui-kit module registers each upstream module, with `{ name, key, options }`. Consumers can mutate `options` to override defaults applied by `registerModule`.
- **Common Types**: `Media` gained an `audio` variant. `MediaAudio` carries `sources: MediaSourceAudio[]`, an optional `cover` (album art / podcast cover), and optional `tracks`. The new `MediaTextTrack` type backs timed text tracks (subtitles, captions, chapters) for both audio and video, and `MediaVideo` now accepts `tracks` plus a `streaming` delivery format (`progressive | hls | dash`). Studio `media` fields can restrict to audio with `allowedTypes: ['audio']`.

### Changed

- **Common Types** (breaking): `MediaVideo.preview` was renamed to `MediaVideo.poster`, matching the HTML `<video poster>` attribute. Rename the field on every `MediaVideo` you construct or read.
- **Common Types** (breaking): the `Media` union now includes `MediaAudio`, so `media.type` can be `'audio'`. Exhaustive `switch (media.type)` blocks without a `default` branch must add an `'audio'` case.

### Fixed

- **Frontend Core**: Section `slots` prop now retains structural typing of block props at consumer call sites. The previous wrapper used deep `SimplifyDeep`, which past a certain schema depth tripped TypeScript's 50-level instantiation limit and surfaced as `TS2589: Type instantiation is excessively deep and possibly infinite` in sections that mapped over their slot blocks. Bounded `Simplify` is now applied at the slot-map / block / `props` boundaries. Sections that previously needed an `as unknown as ReadonlyArray<{ props: Record<string, any> }>` cast on `props.slots.*` can drop the cast and access `block.props.<field>` with full type inference. No runtime or API change.

## [0.30.0]

### Added

- **Common Types**: Studio field and fieldset definitions accept an optional `if: SchemaCondition` — a JSON expression (typed via `@laioutr/expression`) that hides the control in the Studio sidebar when it evaluates to a falsy value. The stored value is kept and still passed to your component at render time; only the sidebar control disappears. Example: `if: ['==', ['get', 'background'], 'custom']`.

## [0.29.0]

### Added

- **Frontend Core**: 8 missing discriminated event types added to `tracking.types.ts` — `RemoveFromCart`, `AddToWishlist`, `RemoveFromWishlist`, `ViewCart`, `AddShippingInfo`, `AddPaymentInfo`, `Login`, `SignUp`. Trackers in `trackingActions.ts` now construct the correct types instead of falling through to mismatched ones (e.g. `ViewItem` for `ADD_TO_WISHLIST`), which previously broke the `Analytics` discriminated union silently.
- **Frontend Core**: Re-exported the `DefinitionToProps` type from `#frontend/types` so consumers can derive prop types from a section/block definition without reaching into internal paths.

### Changed

- **Core Types** (breaking): Updated `Media`, `Swatch`, and `coerceFieldValue` to align with the surface-tone type changes in the UI family (`BackgroundBrightness` → `SurfaceTone`). Consumers reading these types should treat the colour-mode field as `'light' | 'dark' | 'bright'`.

### Fixed

- **Frontend Core**: Reordered the `undefined` check in `validateI18nConfig` to happen before indexing `market.domains`. `FieldDefinitionToProp` generic constraint widened from `StudioFieldDefinition` to `BaseFieldDefinitionBase` so the type-parameter chain is consistent with `FieldDefinitionToType` and `FindFieldWithName`.

### Removed

- **Frontend Core**: Removed the unused `InvisibleBlock` component. It had no source consumers — only auto-generated `.nuxt/components.d.ts` references that regenerate on the next build. Its placeholder UI was leftover from an earlier editor experiment and was not used anywhere in the runtime tree.

## [0.28.15]

### Changed

- **Core Types**: Use `z.object({ ...base.shape, ... })` instead of `base.extend({ ... })` for schema composition so the JSDoc zod-meta plugin resolves field descriptions correctly.

## [0.28.14]

### Changed

- **Core Types**: Wired `urlAlias` and `isRoot` end-to-end from RC page config through the orchestr store to client-side URL generation. Refactored `QueryParams` so `isRoot` is the single source of truth for root-level URL params — callers no longer need to pass an empty prefix.

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
- **Kit**: Fixed `useRoute()` returning stale route data in studio preview. In preview mode there is no `<NuxtPage>`, so the `page:finish` hook that syncs Nuxt's internal route ref never fired. The preview now emits `page:finish` after each navigation to keep `useRoute()` current.

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
- **Core Types**: Multi-market render types: `RenderLanguage`, `RenderMarket`, `RenderI18nConfig`, plus `localizedPaths` and `marketIds` on `MetaPage`.

### Changed

- **Frontend Core**: Removed `ALL_LOCALES` wildcard in favor of explicit locale codes throughout the frontend codebase.
- **Frontend Core**: Improved route resolution during navigation.
- **Core Types** (breaking): Removed the `ALL_LOCALES` (`'*'`) wildcard. The `localeChain` no longer includes `'*'` as a tail element, and `normalizeLocalizedPaths` no longer prefers the `'*'` key as fallback. All localized values must use concrete BCP 47 locale codes.
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

### Added

- **Core Types**: `createEntityComponentTokenFactory` helper.

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
- **Core Types**: JSON field type.

### Changed

- Orchestr: Removed input from links and allowed passing entities from links, making link handlers more flexible.
- **Core Types**: Implemented the most common types as proper TypeScript types.
- Updated Core Types and related dependencies to `0.26.0`.

## [0.25.0]

### Added

- **Core Types**: Optional `description` field on `pageTypeToken`.
- **Core Types**: `WellKnownComponentTag` value `'Blog'`.

### Changed

- Frontend Core & Orchestr: Dependency updates to align with Core Types `0.25.0` and internal improvements.

## [0.24.0]

### Changed

- Frontend Core & Orchestr: Dependency updates around Core Types `0.24.0` with internal refinements.
- **Core Types**: Separated `core-types` from the `canonical-types` package.

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
- **Kit**: Media Library upload handling, and improved documentation generation from canonical-types.

### Changed

- Iterative improvements to configuration, query handling, and orchestr integration as the frontend product matured towards its current architecture.
