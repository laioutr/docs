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

## [0.44.0] - 2026-08-24

### Minor Changes

- OpenTelemetry tracing. A storefront that sets `OTEL_EXPORTER_OTLP_ENDPOINT` at build time exports traces of its server-side work through the standard `OTEL_*` configuration; without it nothing is installed. Queries, links and component resolvers each become spans nested under the Nitro request span, and an upstream API call made while a resolver runs nests under that resolver — so a trace attributes upstream time to the work that caused it.

  **What spans carry.** Attributes are counts and names a backend can group by: how many entities a resolver asked for, a token name, the app a handler comes from. Entity-id lists, link payloads and handler metadata stay in the local dev tree that feeds devtools, because a span over a backend's payload ceiling is dropped whole — which would lose the slowest requests first.

  **Cache behaviour.** Every cache read carries `orchestr.cache.verdict`, which answers whether a warmer cache would have helped: `hit`, `miss`, `partial`, `skip` for a read that never consults the cache, and `uncacheable` for one blocked by a component configured never to cache. Reads against a hosted cache are `CLIENT` spans and in-process ones `INTERNAL`, detected from the mounted unstorage driver rather than configured.

  **Which page.** A server-rendered request tags its span with the page type, market slug and locale, since a product page and a listing page share one wildcard route. A query request tags its root span with the market, the locale and the query names it ran, so a client-side navigation is identifiable too.

  **Richer local traces.** The `orchestr` module option `exportDevAttributes` exports the diagnostic values that otherwise stay in the dev tree. Point it at a local collector only.

## [0.43.1] - 2026-08-24

### Patch Changes

- The analytics identity cookies survive on a hosting platform's shared domain. A storefront served from a host such as `acme.vercel.app` or `acme.pages.dev` scoped `laioutr_vid` and `laioutr_sid` to the platform suffix itself, which a browser rejects as an invalid cookie domain — so neither cookie existed on those hosts and no visitor or session token reached an event. The cookie domain now resolves against the private section of the Public Suffix List, the same view a browser applies.

- A query's configured sorting is now applied. The value stored on the query was dropped while the request was built, so a sorting set in the studio, or returned as `defaultSorting` from a `queryTemplateProvider`, never reached the query handler. It is now sent as the query's `sort`. An `s` URL parameter still takes precedence, so the configured value sets the default order rather than a fixed one. Links are unaffected and continue to resolve their own sorting from the URL.

## [0.43.0] - 2026-08-21

### Minor Changes

- `useSectionContext()` and `useRenderPageContext()` are auto-imported.

  Both contexts were already provided at runtime but reachable only through a deep import path. A block never receives its own id, so the section context is the only stable list identity available to one.

### Patch Changes

- The canonical page types and analytics projectors now register in the browser.

  The plugin that pulled them used a dynamic import with `@vite-ignore` and a template-literal specifier, so Vite left the bare specifier alone and the browser could not resolve it. The failure went into an empty `catch`, so nothing registered and every entity in an analytics payload fell back to its id and address. Page types were unaffected, because they resolve on the server where Node handles the specifier.

  The module now checks at build time whether the package is installed and, if it is, emits a plugin that imports it statically. Vite resolves it and picks the browser or server build by its own export conditions. The package stays optional: a storefront without it simply gets no plugin.

- Development-only switches live under `laioutr.dev`, and a production build discards the whole object rather than each flag on its own.

  ```ts
  export default defineNuxtConfig({
    laioutr: {
      laioutrrc,
      dev: { analyticsDebug: true, consentDebug: true },
    },
  });
  ```

  `consentDebug` is new: a debug CMP that grants every purpose without asking. Playgrounds install no consent management app, so nothing ever grants a purpose and the consent-gated paths never run — no visitor identity, no browser-to-server transports, no delivery to a destination. It reports a decision the visitor never made, so it warns on install.

  `analyticsDebug` keeps logging canonical events through the built-in debug destination, and now only takes effect in dev.

- A page no longer runs a query that only an abandoned field still binds. When a section or block drops a field from its schema, the stored value stays in the project configuration, and that value kept its query alive — so every render fetched data no component reads. A header still holding a cart binding this way cost one upstream request on every page of the storefront.

  A query survives as long as any live field, or an SEO placeholder, still references it. A section or block that no registry knows loses its queries as well, so a component that never renders no longer loads data. Each drop warns once and names the component, the field, and the query token.

- Server code reads the visitor's analytics identity off a request with `readAnalyticsIdentity(event)`, returning the visitor and session tokens the browser is already reporting on its events. A server route or a connector can group its own work into the same visit without minting a second identity. The tokens exist only under the `analytics` consent purpose, so an empty result means the visitor has not granted it.

- The Studio preview no longer fails when the handshake secret is absent from the URL. It authorizes off the embed marker the server mints after validating that secret, so a reload or a client-side navigation inside the frame keeps working, and a storefront opened outside Studio renders normally instead of throwing `No secret provided`.

  The marker stays scoped to one project. A request that presents a project secret the storefront rejects clears the marker and renders the storefront, so pointing Studio at a dev server that belongs to another project no longer drives that server's preview.

  The project secret never reaches client JavaScript now, so it no longer appears in the hydration payload of an embedded page.

## [0.42.0] - 2026-08-19

### Minor Changes

- Add the consent-aware analytics system. `useAnalytics()` returns `{ track, register, unregister }`; `track(Token, payload)` emits a typed event whose token carries its own payload schema. `@laioutr-core/core-types/analytics` provides the token factories and the platform's own `web/*` events, `@laioutr-core/canonical-types/analytics` the `ecommerce/*` commerce vocabulary.

  **Breaking:** the specialized tracking composables are removed.

  ```ts
  // Before
  const { trackAddToCart } = useProductInteraction();
  trackAddToCart(payload);

  // After
  const { track } = useAnalytics();
  track(AddToCart, payload);
  ```

  **Destinations and consent.** Register a recipient with `defineAnalyticsDestination`, declaring what it needs as `consent: { purposes: ['analytics'] }`, or `purposeSets` for OR-of-ANDs. Consent is evaluated per recipient at delivery, never at emission, so one emission fans out to exactly the destinations the visitor allowed. Events emitted before the visitor answers are held and replayed in order once they grant. A destination may instead declare `onDenied` to take denied events with the consent state attached, degrading rather than going silent; such an event counts as delivered and is not replayed on a later grant, and revocation leaves that destination running rather than tearing it down.

  **Payloads.** Payloads may carry orchestr entities directly — `track(AddToCart, { products: [{ entity: product, quantity: 2 }] })` — each projected to a flat wire snapshot at emit time, selected by `entityType`. An entity carrying a slug on its `base` component also gets an absolute `url` on the market's production host. `@laioutr-core/core-types/orchestr` gains `getEntityComponent(entity, Token)` and `getLinkedEntities(entity, LinkToken)`. Every payload schema carries an optional `customFields` bag for site- or vendor-specific data; namespace the keys (`'acme:productLine'`).

  **Collection and extension.** The `v-track-click` and `v-track-impression` directives, plus `useTrackImpression`, `useTrackScrollDepth` and `useTrackVideoProgress`. Ambient page, market, session, consent and experiment context attaches to every event; `useAnalyticsContexts()` adds a provider or overrides one of the platform's own. Three synchronous Nuxt hooks — `:emit` as a veto, `:enrich`, and a per-entity `:project` filter — extend the pipeline, with `augmentProjection` typing a `:project` handler.

  **Server side.** The browser posts batches to `POST /api/frontend/signals`, overridable with `analyticsIngestPath` in the module's public runtime config, which moves the server route too. Every event in a batch is judged on its own, so one malformed or oversized event never costs the batch it rode in on. `subscribeToAnalytics` registers a recipient that must not run in the browser; handlers receive `sentAt` and `receivedAt` alongside the event.

  **Identity.** Visitor and session cookies are minted only under the `analytics` purpose and scoped to the market's registrable domain, so an identity survives a hop between subdomains; on platform hostnames they stay host-only. Inside the Studio preview they are written cross-site and partitioned. Withdrawal deletes both, and a later re-grant mints fresh ones without stitching activity retroactively.

- **Breaking:** a `ConsentAdapter` is four members — `name`, `setup`, `openConsentUi` and an optional `hasDecision` — and the store installs one with `setAdapter`. Upgrade the CMP apps alongside `@laioutr-core/frontend-core`: an adapter written against the old contract no longer installs.

  **Adapter authors.** `init`, `getConsentState`, `onConsentChange`, `destroy` and `isActive` collapse into `setup(report)`: report the visitor's verdict at once and again on every change, and return a cleanup if you need one. It runs synchronously inside the installing plugin, so `useHead` and `useCookie` are available, and throwing from it makes the store warn and drop the adapter. `registerAdapter` plus `activateAdapter` become one synchronous `setAdapter`, which returns the handle that drops the adapter; `deactivateAdapter` is gone.

  ```ts
  // Before
  consent.registerAdapter({
    name: 'my-cmp',
    isActive: true,
    init: () => loadCmp(),
    getConsentState: () => read(),
    onConsentChange: (callback) => cmp.on('change', () => callback(read())),
    destroy: () => cmp.off('change'),
    showConsentOverlay: () => cmp.show(),
    renewConsent: () => cmp.renew(),
  });
  await consent.activateAdapter('my-cmp');

  // After
  const stop = consent.setAdapter({
    name: 'my-cmp',
    setup: (report) => {
      loadCmp();
      report(read());
      cmp.on('change', () => report(read()));
      return () => cmp.off('change');
    },
    openConsentUi: (view) => (view === 'preferences' ? cmp.renew() : cmp.show()),
  });
  ```

  **Storefronts.** One `openConsentUi` replaces both overlay calls, and `adapterName` replaces `activeAdapter`.

  ```ts
  // Before
  consentStore.showConsentOverlay();
  consentStore.renewConsent();

  // After
  consentStore.openConsentUi();
  consentStore.openConsentUi('preferences');
  ```

  `hasDecision()` returns `boolean | undefined` rather than `boolean`. `undefined` means no decision signal exists at all — no adapter, or one that cannot tell — which is not the same as a visitor who answered no. Code that read a falsy result as a refusal has to tell the two apart.

- **Breaking:** consent is reported as processing purposes rather than cookie categories. `ConsentManagementState` and `hasCategoryConsent` are gone; a `ConsentAdapter` reports `Partial<ConsentState>` over `necessary`, `functional`, `analytics`, `advertising` and `personalization`, and owns the mapping from its own vendor's vocabulary. A purpose absent from a report counts as denied.

  ```ts
  // Before — Partial<ConsentManagementState>
  { necessary: true, functional: false, statistics: true, marketing: false, unclassified: false }

  // After — Partial<ConsentState>
  { necessary: true, functional: false, analytics: true, advertising: false, personalization: false }
  ```

  An adapter grants a purpose when any of its own that map to it is granted. A visitor who allowed measurement but refused personalisation is now reported to Google Consent Mode as exactly that, rather than as allowing both ad purposes.

- Every way a link can fail to resolve now has a name. `linkResolver.resolve()` still returns an in-page fallback rather than throwing, but that fallback has one shape — `#<code>?<detail>` — drawn from a closed set, and each carries what identifies the offending link (`#unknown-route?pageId=pdp`, `#missing-required-params?params=brand`). Every failure warns in the same format.

  `linkResolver.resolveOrThrow(link, options?)` is the same resolution for a caller that can act on the failure — an analytics projector, a sitemap writer — throwing `LinkResolutionError` carrying `code` and `details` instead of a fallback string the caller would have to sniff for a leading `#`. Pass `{ withOrigin: true }` for an absolute URL rather than an absolute path; the origin comes from the market's own domain, never from `location`, so an address resolved inside the Studio preview or on a dev host still names the site a visitor would land on. A market with no domain warns and yields the resolved path.

  ```ts
  try {
    return linkResolver.resolveOrThrow(link, { withOrigin: true });
  } catch (error) {
    if (error instanceof LinkResolutionError) return undefined;
    throw error;
  }
  ```

  **Breaking:** `fillParams` returns `undefined` when a required param has no value, instead of filling it with a blank. The blank collapsed into the neighbouring separator — `/:brand/p/:slug` became `/p/shoe`, an address that looked resolvable and was not — so a caller synthesizing params from anywhere other than the current route was quietly producing wrong links. Finite-set defaults (`/:page(a|b)`) and optional params (`:lang?`, `:rest*`) are unaffected; `missingRequiredParams(path, params)` names the ones missing.

  ```ts
  // Before
  const path = fillParams(pagePath, params);

  // After
  const path = fillParams(pagePath, params);
  if (path === undefined) return;
  ```

  Downstream: an hreflang or canonical link whose params cannot be filled is omitted rather than emitted truncated, and a language switcher offers the target domain's homepage rather than a broken path.

- Add `menuTreeAtDepth(items, startLevel)`, auto-imported alongside `buildMenuTree`. It builds the menu tree and then descends `startLevel` levels so the nodes at that depth become the top level — for skipping a synthetic upstream root node (e.g. a Magento "Root" category) so the first business-facing level renders as the top level. `startLevel` `0` (the default) keeps the tree as fetched; it descends only, and a value past the deepest node yields an empty list.

### Patch Changes

- Bound the page endpoint's render cache, which grew without limit and could exhaust a storefront's memory.

  The endpoint memoised every rendered page by page, market and language in a map that was never evicted from. Module scope on a serverless host lives for the whole instance, so the map retained the site's entire page config, materialised per locale, for as long as the process ran. It is now capped.

- The consent store is scoped to the Nuxt app rather than the module, so on the server each request gets its own. It was global to the module, which on a server is global to the process: every concurrent render shared one store, the CMP adapter installed by the first request kept serving all later ones with the cookie ref it captured then, and each subsequent request added another consent listener to it.

## [0.41.0] - 2026-08-11

### Minor Changes

- Markets can be set to `draft`, and a project can name its default market.

  A draft market still serves its own host so it can be checked before launch, but it is excluded
  from hreflang alternates, `og:locale:alternate`, `x-default`, and market switchers, and its pages
  are served with `noindex, nofollow`. `switchMarketUrl` returns `'#market-not-active'` for a draft
  target. Status is read through `RenderMarket.isLinkable` and `isIndexable` rather than the `status`
  member, so a future status changes one mapping instead of every consumer.

  `RcProject.defaultMarketId` replaces the implicit "first market in the configuration" rule for
  `x-default`, the primary route path, the unknown-host fallback, and nuxt-i18n's `defaultLocale`.
  Which market that was depended on the order Cockpit happened to return them in, so a project whose
  primary market did not sort first was pointing `x-default` at the wrong one. Leaving the new field
  unset preserves the previous behaviour. The resolved default is reachable both as
  `RenderI18nConfig.defaultMarket` and as `RenderMarket.isDefault`, so a component holding a single
  market can tell whether it is the default one without reading the whole config.

  **Breaking:** `RenderI18nConfig.markets` now contains only markets that may be linked to. The
  complete list, including drafts, moved to `RenderI18nConfig.allMarkets`. Code that renders a market
  switcher needs no change and starts honouring status automatically; code that needs every configured
  market (routing, host resolution, preview) must switch to `allMarkets`.

  ```ts
  // Before: one list, used for both
  const switcherMarkets = i18nConfig.markets;
  const routableMarkets = i18nConfig.markets;

  // After
  const switcherMarkets = i18nConfig.markets; // linkable only, now status-aware
  const routableMarkets = i18nConfig.allMarkets; // every configured market
  ```

### Patch Changes

- **Breaking:** Local dev hostnames for projects hosted on `*.app.laioutr.tech` drop that suffix instead of folding it into the label. A market on `acme-shop.app.laioutr.tech` is now reachable at `acme-shop.local.laioutr.tech` rather than `acme-shop-app-laioutr-tech.local.laioutr.tech`. The same host drives market resolution and the dev cookie domain, so all three stay in step — update any bookmark or `allowedHosts` entry that named the old form.

  The startup banner no longer prints during `nuxi prepare` and `nuxi typecheck`, only when the app actually boots.

- Switching market or language in the Studio reloads the previewed content

  The preview kept rendering whichever market it was opened with. Switching from German to Dutch —
  or from German to English inside a single market — left the previous menus, product data and
  prices on screen, so the preview showed one market's content under another market's settings.

  Orchestr results are scoped to a market and a language, but the client caches them under a key
  that carries neither. Every query after a switch therefore read as a cache hit and no request was
  ever sent. The cached results are now dropped when the selection changes, and the page refetches
  under the market and language now selected.

  Reselecting the market already being previewed still serves the cache. Storefront rendering is
  unaffected; the change is limited to the Studio preview.

## [0.40.3] - 2026-08-07

### Patch Changes

- `linkResolver.resolve()` no longer drops a link's `query`.

  Every Laioutr page route carries `localizedPaths`, so internal links always resolved through the localized-path branch — which ignored `query` and returned before the vue-router fallback that applied it. A header search resolving `{ type: 'pageType', pageType: ProductSearchPage, query: { q: term } }` landed on `/search` without `?q=`. `reference`, `page` and `pageType` links were affected alike.

  `url` and `anchor` links kept their `query` in the type but dropped it on resolve; they now carry it too. The query is merged into whatever the `href` already has — the link's own `query` wins on a key collision — and always lands before the fragment. A link without a `query` still passes its href through untouched.

  Query strings go through vue-router's `stringifyQuery`, so a resolved link matches what `router.resolve()` would have produced.

## [0.40.2] - 2026-08-06

### Patch Changes

- Session cookies now survive the Cockpit Studio preview. Cart and customer-session cookies are issued with `SameSite=None; Secure; Partitioned` when the request comes from the Studio preview frame, so a cart built in the editor persists across reloads instead of resetting on every request. The preview gets its own cookie partition, keeping it separate from your real session on the same shop in the same browser. Top-level storefront traffic is unaffected and keeps its existing `SameSite` attributes.

  App authors get two new server auto-imports, `setManagedCookie` and `deleteManagedCookie`, which apply this policy. Use them instead of h3's `setCookie` / `deleteCookie` so an app's cookies work inside the preview — and note that deletions must go through `deleteManagedCookie`, since a delete that omits `Partitioned` addresses the wrong cookie jar and silently leaves the cookie in place.

  `Secure` is now derived from the request origin rather than set per connector, which fixes Shopify and Adobe Commerce cookies being dropped by the browser during local development over plain http on a non-loopback hostname.

## [0.40.1] - 2026-08-06

### Patch Changes

- Fix `laioutrrc.json` app config being merged into each app module twice. The config was both assigned to `nuxt.options[<appName>]` and passed to `installModule`, so Nuxt merged it with itself and concatenated every array-valued option. A four-entry Shopify `sortings` list arrived as eight and failed the build with a duplicate-key error.

## [0.40.0] - 2026-08-05

### Minor Changes

- `useConsentStore()` exposes `hasDecision()`, reporting whether the visitor has answered the consent prompt at all. A consent state of "denied" is otherwise indistinguishable from "never asked", which matters wherever that state is passed to a third party applying its own regional default.

  `ConsentAdapter` gains an optional `hasDecision?()`. The Cookiebot and CCM19 apps implement it, each reporting a saved refusal as a decision rather than as silence. An adapter that omits it always reports `false`, so a refusal its visitor made is indistinguishable from an unanswered prompt, and consumers forwarding consent to a third party will withhold that refusal rather than pass it on. Granted consent is unaffected — a grant cannot arise from silence.

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
