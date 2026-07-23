---
title: Hooks
description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
links: []
seo:
  title: Hooks
  description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
---

Frontend-core and orchestr expose [Nuxt runtime hooks](https://nuxt.com/docs/guide/going-further/hooks#app-hooks-runtime) that let you extend or modify the complete behaviour of your Laioutr Frontend. Register hooks inside a [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins) for client-side hooks, or a [Nitro plugin](https://nitro.build/guide/plugins#nitro-hooks) for server-side hooks.

## Hook mechanics

Every hook uses one of four **mechanics**, which decide when your handler runs and how it shapes the result:

- **Filter** — runs *after* the default logic with `result.value` pre-seeded. Transform it, replace it, or leave it untouched. Chained across plugins: each handler receives the previous one's output.
- **Override** — runs *before* the default with `result.value` empty. Set it to take over; leave it unset to fall back to the default.
- **Modify** — mutates the payload object in place. There is no `result` slot.
- **Lifecycle** — a `before` / `success` / `error` / `finally` sequence around an operation.

Each hook also has a **dispatch**, shown on its card. *Synchronous* handlers run inline and are not awaited — set values immediately, since a returned promise is ignored. *Asynchronous* handlers may `await`. Dispatch is a property of the individual hook, not of its mechanic.

## Frontend Core Hooks

These hooks run on the client. Register them in a Nuxt plugin with [`nuxtApp.hook()`](https://nuxt.com/docs/3.x/api/composables/use-nuxt-app#hookname-cb).

### Link Resolver

Three hooks let you customize how `linkResolver` resolves links, switches locale paths, and switches market URLs.

::hook-meta
---
name: frontend-core:link-resolver:resolve
title: Resolve a link
surface: client
register: nuxt-plugin
dispatch: sync
kind: filter
payload:
  - { field: link, type: Link, description: The link being resolved. }
  - { field: result, type: '{ value: string }', description: 'Mutate result.value to transform the output. It arrives pre-seeded with the resolved URL or path — transform it, replace it, or leave it untouched. Threads across plugins, so each handler receives the previous output.' }
whenItFires: After every call to linkResolver.resolve(), once the default resolution has produced a value.
---

Transform, replace, or pass through a resolved link before it's used — for example, point product references at an external catalog.

#example
```ts [app/plugins/custom-link-resolver.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // Replace: resolve product references to an external catalog URL
  nuxtApp.hook('frontend-core:link-resolver:resolve', ({ link, result }) => {
    if (link.type === 'reference' && link.reference.type === 'Product') {
      result.value = `https://catalog.example.com/p/${link.reference.slug}`;
    }
  });
});
```
::

::hook-meta
---
name: frontend-core:link-resolver:switch-locale-path
title: Switch locale path
surface: client
register: nuxt-plugin
dispatch: sync
kind: override
payload:
  - { field: targetLanguageId, type: string, description: The language being switched to. }
  - { field: result, type: '{ value?: string }', description: 'Set result.value to take over locale switching, including cases the default cannot resolve. It starts empty; leave it unset to fall back to the default. The first handler to set a value wins.' }
whenItFires: Before the default logic, when switching the current page to another language.
---

Take over how the current page's URL is rebuilt when switching to another language, including cases the default can't resolve.

#example
```ts [app/plugins/custom-locale-switch.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:link-resolver:switch-locale-path', ({ targetLanguageId, result }) => {
    if (targetLanguageId === 'fr-CH') {
      result.value = `/fr-ch${useRoute().path}`;
    }
  });
});
```
::

::hook-meta
---
name: frontend-core:link-resolver:switch-market-url
title: Switch market URL
surface: client
register: nuxt-plugin
dispatch: sync
kind: override
payload:
  - { field: targetMarketId, type: string, description: The market being switched to. }
  - { field: targetLanguageId, type: string, description: The target language, if any., optional: true }
  - { field: result, type: '{ value?: string }', description: 'Set result.value to take over market switching, which may include a host change. It starts empty; leave it unset to fall back to the default.' }
whenItFires: Before the default logic, when switching to a different market.
---

Take over the URL used when switching to a different market, which may include a change of host.
::

### Page Renderer

::hook-meta
---
name: frontend-core:page-renderer:select-page-variant
title: Select page variant
surface: client
register: nuxt-plugin
dispatch: sync
kind: override
payload:
  - { field: page, type: RenderPage, description: 'Contains id, type, path, and a variants array.' }
  - { field: result, type: '{ value?: RenderPageVariant }', description: 'Set result.value to a variant to render it instead of the default. It starts empty; leave it unset to keep the default.' }
whenItFires: When the PageRenderer component selects a variant.
---

Choose which variant of a page is rendered — for A/B testing, personalization, or conditional layouts.

#example
```ts [app/plugins/ab-testing.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:page-renderer:select-page-variant', ({ page, result }) => {
    const variantId = useCookie('ab-variant').value;
    const match = page.variants.find((v) => v.id === variantId);
    if (match) {
      result.value = match;
    }
  });
});
```
::

### Page Head

::hook-meta
---
name: frontend-core:page-head:resolve
title: Resolve page head
surface: client
register: nuxt-plugin
dispatch: sync
kind: filter
payload:
  - { field: page, type: RenderPage, description: The page being rendered. }
  - { field: pageVariant, type: RenderPageVariant, description: The selected variant. }
  - { field: metaPage, type: MetaPage, description: The page's SEO meta. }
  - { field: currentDomain, type: string, description: The resolved market domain — undefined in Studio preview., optional: true }
  - { field: result, type: '{ value: { seo, locale } }', description: 'Mutate result.value to change the head; it is pre-seeded with the computed head. seo is a flat useSeoMeta object (title, description, robots, og:/twitter:); locale is { htmlAttrs, meta, link } — html lang, og:locale, canonical, and hreflang alternates.' }
whenItFires: When the PageRenderer applies the page head via useHead, on every page.
---

Read and rewrite the SEO and locale tags Frontend Core writes to the document head on every page.

#example
```ts [app/plugins/custom-head.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:page-head:resolve', ({ result }) => {
    // Append a site name to the resolved title and add a default OG image
    result.value.seo.title = `${result.value.seo.title} — Acme`;
    result.value.seo.ogImage ??= 'https://example.com/og.png';

    // Remove the x-default alternate
    result.value.locale.link = result.value.locale.link.filter((l) => l.hreflang !== 'x-default');
  });
});
```
::

### Content Preview

Two hooks around [content preview](/frontend/features/content-preview): one decides where the preview token comes from, the other tells you when preview turned on or off.

::hook-meta
---
name: frontend-core:content-preview:resolve-token
title: Resolve preview token
surface: client
register: nuxt-plugin
dispatch: sync
kind: override
payload:
  - { field: route, type: RouteLocation, description: The current route. }
  - { field: result, type: '{ value?: string }', description: 'Set result.value to a token to drive content preview from your own source. It starts empty; leave it unset to fall back to the ?preview_token= query parameter. The first handler to set a value wins.' }
whenItFires: Before frontend-core reads the preview_token query parameter, on every evaluation of the preview token source.
related:
  - { label: Content Preview, to: /frontend/features/content-preview }
---

Take over where the content-preview token comes from — a CMS cookie, a header injected by a gateway — instead of the query parameter.

Your plugin **must** use `enforce: 'pre'`: frontend-core evaluates the token source during its own plugin setup, so a handler registered later is never consulted. Handlers must also be synchronous — you may read cookies or `useRequestHeaders()`, but you must not `await`.

#example
```ts [app/plugins/preview-from-cookie.ts]
export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('frontend-core:content-preview:resolve-token', ({ result }) => {
      result.value = useCookie('cms_preview_token').value ?? undefined;
    });
  },
});
```
::

::hook-meta
---
name: frontend-core:content-preview:changed
title: Content preview changed
surface: client
register: nuxt-plugin
dispatch: sync
kind: lifecycle
payload:
  - { field: enabled, type: boolean, description: The new state — true once the server has verified the token, false otherwise. Already applied by the time the hook fires. }
whenItFires: After a content-preview transition — entering preview, leaving preview, or swapping to a different token.
related:
  - { label: Content Preview, to: /frontend/features/content-preview }
---

Invalidate your own caches when content preview turns on or off. Fire-and-forget: there is no result slot, and a returned promise is ignored.

Frontend Core already calls `refreshNuxtData()` and `invalidateOrchestrQueries()` for you, so Nuxt's own data and every stored orchestr query result are handled. Use this hook for anything else you hold — a hydrated Pinia store, a memoized CMS client.

#example
```ts [app/plugins/preview-invalidation.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:content-preview:changed', ({ enabled }) => {
    useMyCmsStore().reset();
    console.debug(`[preview] now ${enabled ? 'on' : 'off'}`);
  });
});
```
::

## Orchestr Client Hooks

These hooks fire during client-side action execution. All receive a `token` string that identifies the action (e.g. `ecommerce/cart/add-items`).

### Fetch Action Hooks

::hook-lifecycle
---
family: Fetch action lifecycle
description: Four hooks fire around every fetchAction request. finally always runs, whether the action resolved or errored.
surface: client
register: nuxt-plugin
firedBy: [fetchAction, useFetchAction, useQueryAction, useMutationAction]
diagram: fetch
phases:
  - { phase: before, name: 'orchestr:action:fetch:before', when: Before the request is sent., payload: '{ token, input }' }
  - { phase: success, name: 'orchestr:action:fetch:success', when: After the action resolves., payload: '{ token, output }' }
  - { phase: error, name: 'orchestr:action:fetch:error', when: After the action rejects., payload: '{ token, error }' }
  - { phase: finally, name: 'orchestr:action:fetch:finally', when: Always, after success or error., payload: '{ token, output?, error?, input }' }
---
::

### Mutation Action Hooks

::hook-lifecycle
---
family: Mutation action lifecycle
description: useMutationAction fires these around the mutation.
surface: client
register: nuxt-plugin
firedBy: [useMutationAction]
diagram: mutation
phases:
  - { phase: before, name: 'orchestr:action:mutation:before', when: Before the mutation runs., payload: '{ token, input }' }
  - { phase: success, name: 'orchestr:action:mutation:success', when: After the mutation resolves., payload: '{ token, output, input, context }' }
  - { phase: error, name: 'orchestr:action:mutation:error', when: After the mutation rejects., payload: '{ token, error, context }' }
  - { phase: finally, name: 'orchestr:action:mutation:finally', when: Always, after success or error., payload: '{ token, output?, error?, input, context }' }
---
::

The `context` value comes from [Pinia Colada's mutation context](https://pinia-colada.esm.dev/guide/mutations.html) and is set by the `onMutate` callback.

```ts [app/plugins/action-error-tracking.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // Track all failed actions (both fetch and mutation)
  nuxtApp.hook('orchestr:action:fetch:error', ({ token, error }) => {
    errorTracker.capture(error, { action: token, type: 'fetch' });
  });

  nuxtApp.hook('orchestr:action:mutation:error', ({ token, error }) => {
    errorTracker.capture(error, { action: token, type: 'mutation' });
  });
});
```

### URL Query Parameters

Two hooks control how Orchestr reads and writes URL query parameters (pagination, sorting, filters). See [URL Query Parameters](/frontend/orchestr/url-query-params#hooks) for the full reference with examples.

::hook-meta
---
name: orchestr:query-params:parsed
title: Parse query params
surface: client
register: nuxt-plugin
dispatch: sync
kind: modify
payload:
  - { field: params, type: QueryParams, description: The parsed query params — mutate directly. }
  - { field: queryPrefixes, type: QueryPrefixes, description: The active query prefixes. }
  - { field: route, type: RouteLocation, description: The current route. }
whenItFires: After parsing the URL, before reading pagination, sort, and filter.
related:
  - { label: URL Query Parameters, to: /frontend/orchestr/url-query-params#hooks }
---

Adjust the parsed URL query params before Orchestr reads pagination, sort, and filter from them.
::

::hook-meta
---
name: orchestr:navigate-query:build
title: Build navigation query
surface: client
register: nuxt-plugin
dispatch: sync
kind: modify
payload:
  - { field: params, type: QueryParams, description: The params being written. }
  - { field: query, type: QueryObject, description: The assembled query object — mutate directly. }
  - { field: path, type: string, description: The target path. }
  - { field: queryString, type: string, description: The serialized query string. }
whenItFires: At the end of buildQueryUrl(), before returning the URL.
related:
  - { label: URL Query Parameters, to: /frontend/orchestr/url-query-params#hooks }
---

Rewrite the assembled query object before Orchestr serializes it into a navigation URL.
::

### Client Environment

::hook-meta
---
name: orchestr:client-env:modify
title: Client environment
surface: client
register: nuxt-plugin
dispatch: sync
kind: modify
payload:
  - { field: clientEnv, type: WireClientEnv, description: '{ locale, currency, isPreview, previewToken?, marketId?, languageId?, custom? } — mutate directly, do not replace.' }
whenItFires: Synchronously, every time orchestr builds the wire clientEnv before sending a query or action request.
related:
  - { label: Client Environment, to: /frontend/orchestr/client-env }
---

Shape the **wire** client environment before every request is sent. This is the browser's payload, not what handlers receive: the server validates every field against the project's own configuration and resolves it into a [`ClientEnv`](/frontend/orchestr/client-env). Nothing you set here is trusted.

Frontend Core already sets `marketId`, `languageId`, and the content-preview fields. Put your own data under `custom`, and validate it server-side — a shopper can set it to anything.

#example
```ts [app/plugins/client-env.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('orchestr:client-env:modify', ({ clientEnv }) => {
    clientEnv.custom = { ...clientEnv.custom, abVariant: useCookie('ab-variant').value };
  });
});
```
::

## Orchestr Server Hooks

These hooks fire during **server-side** action handler execution. They are [Nitro runtime hooks](https://nitro.build/guide/plugins#nitro-hooks) and must be registered in a Nitro plugin, not a Nuxt plugin.

::hook-lifecycle
---
family: Server handler lifecycle
description: Four hooks fire around the server-side action handler. Register them in a Nitro plugin with nitroApp.hooks.hook().
surface: server
register: nitro-plugin
diagram: handler
phases:
  - { phase: before, name: 'orchestr:action:handler:before', when: Before the handler runs., payload: '{ token, input, clientEnv }' }
  - { phase: success, name: 'orchestr:action:handler:success', when: After the handler resolves., payload: '{ token, output }' }
  - { phase: error, name: 'orchestr:action:handler:error', when: After the handler throws., payload: '{ token, error }' }
  - { phase: finally, name: 'orchestr:action:handler:finally', when: Always, after success or error., payload: '{ token, output?, error?, input }' }
---
::

```ts [server/plugins/action-logging.ts]
export default defineNitroPlugin((nitroApp) => {
  const pending = new Map<string, number>();

  nitroApp.hooks.hook('orchestr:action:handler:before', ({ token }) => {
    pending.set(token, Date.now());
  });

  nitroApp.hooks.hook('orchestr:action:handler:error', ({ token, error }) => {
    const startedAt = pending.get(token);
    const duration = startedAt ? Date.now() - startedAt : undefined;
    console.error(`[orchestr] ${token} failed after ${duration}ms`, error);
    pending.delete(token);
  });
});
```
