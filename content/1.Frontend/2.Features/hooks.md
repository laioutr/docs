---
title: Hooks
description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
links: []
seo:
  title: Hooks | Laioutr
  description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
---

Frontend-core and orchestr expose [Nuxt runtime hooks](https://nuxt.com/docs/guide/going-further/hooks#app-hooks-runtime) that let you extend or modify the complete behaviour of your Laioutr Frontend. Register hooks inside a [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins) for client-side hooks, or a [Nitro plugin](https://nitro.build/guide/plugins#nitro-hooks) for server-side hooks.

## Frontend Core Hooks

These hooks run on the client. Register them in a Nuxt plugin with [`nuxtApp.hook()`](https://nuxt.com/docs/3.x/api/composables/use-nuxt-app#hookname-cb).

### Link Resolver

Three hooks let you customize how `linkResolver` resolves links, switches locale paths, and switches market URLs. They come in two shapes.

The `resolve` hook is a **filter**. It runs *after* a link is resolved, with `result.value` pre-seeded with the resolved URL or path. Your handler can transform that value, replace it outright, or leave it untouched to keep the default. When several plugins register this hook, each receives the previous one's output.

The two `switch-*` hooks are **overrides**. They run *before* the default logic, with `result.value` starting empty. Set it to take over locale or market switching, including cases the default cannot resolve. Leave it unset to fall back to the default.

::hook-meta
---
name: frontend-core:link-resolver:resolve
title: link-resolver · resolve
surface: client
register: nuxt-plugin
kind: filter
payload:
  - { field: link, type: Link, description: The link being resolved. }
  - { field: result, type: '{ value: string }', description: Mutate to transform the output — see result.value. }
result: { seed: pre-seeded, type: string, description: Starts with the resolved URL or path. Transform it, replace it, or leave it untouched. Threads across plugins — each handler receives the previous one's output. }
whenItFires: After every call to linkResolver.resolve(), once the default resolution has produced a value.
---
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
title: link-resolver · switch-locale-path
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: targetLanguageId, type: string, description: The language being switched to. }
  - { field: result, type: '{ value?: string }', description: Set it to take over — see result.value. }
result: { seed: empty, type: string | undefined, description: Set it to take over locale switching, including cases the default cannot resolve. Leave it unset to fall back. First handler to set a value wins. }
whenItFires: Before the default logic, when switching the current page to another language.
---
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
title: link-resolver · switch-market-url
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: targetMarketId, type: string, description: The market being switched to. }
  - { field: targetLanguageId, type: string, description: The target language, if any., optional: true }
  - { field: result, type: '{ value?: string }', description: Set it to take over — see result.value. }
result: { seed: empty, type: string | undefined, description: Set it to take over market switching (may include a host change). Leave it unset to fall back to the default. }
whenItFires: Before the default logic, when switching to a different market.
---
::

### Page Renderer

This hook lets you control which **page variant** is rendered. Pages can have multiple variants (for A/B testing, personalization, or conditional layouts). If you set `result.value` to a `RenderPageVariant`, that variant is used instead of the default.

::hook-meta
---
name: frontend-core:page-renderer:select-page-variant
title: page-renderer · select-page-variant
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: page, type: RenderPage, description: 'Contains id, type, path, and a variants array.' }
  - { field: result, type: '{ value?: RenderPageVariant }', description: Set it to pick a variant — see result.value. }
result: { seed: empty, type: RenderPageVariant | undefined, description: Set it to a variant to render it instead of the default. Leave it unset to keep the default. }
whenItFires: When the PageRenderer component selects a variant.
---
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

One **filter** hook lets you customize the tags Frontend Core writes to `<head>` on every page. It runs with `result.value` pre-seeded with Frontend Core's computed head, so your handler can read those values and add, override, or remove tags.

::hook-meta
---
name: frontend-core:page-head:resolve
title: page-head · resolve
surface: client
register: nuxt-plugin
kind: filter
payload:
  - { field: page, type: RenderPage, description: The page being rendered. }
  - { field: pageVariant, type: RenderPageVariant, description: The selected variant. }
  - { field: metaPage, type: MetaPage, description: The page's SEO meta. }
  - { field: currentDomain, type: string, description: The resolved market domain — undefined in Studio preview., optional: true }
  - { field: result, type: '{ value: { seo, locale } }', description: Mutate to change the head — see result.value. }
result: { seed: pre-seeded, type: '{ seo, locale }', description: 'seo is a flat useSeoMeta object (title, description, robots, og:/twitter:). locale is { htmlAttrs, meta, link } — html lang, og:locale, canonical, and hreflang alternates.' }
whenItFires: When the PageRenderer applies the page head via useHead, on every page.
---
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

## Orchestr Client Hooks

These hooks fire during client-side action execution. They follow the lifecycle pattern: `before` fires before the request, `success` or `error` after resolution, and `finally` always. All receive a `token` string that identifies the action (e.g. `ecommerce/cart/add-items`).

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
description: useMutationAction fires these around the mutation. The context value comes from Pinia Colada's mutation context, set by the onMutate callback.
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
title: query-params · parsed
surface: client
register: nuxt-plugin
kind: modify
payload:
  - { field: params, type: QueryParams, description: The parsed query params — mutate directly. }
  - { field: queryPrefixes, type: QueryPrefixes, description: The active query prefixes. }
  - { field: route, type: RouteLocation, description: The current route. }
whenItFires: After parsing the URL, before reading pagination, sort, and filter.
related:
  - { label: URL Query Parameters, to: /frontend/orchestr/url-query-params#hooks }
---
::

::hook-meta
---
name: orchestr:navigate-query:build
title: navigate-query · build
surface: client
register: nuxt-plugin
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
::

### Client Environment

::hook-meta
---
name: orchestr:client-env:modify
title: client-env · modify
surface: client
register: nuxt-plugin
kind: modify
payload:
  - { field: clientEnv, type: ClientEnv, description: '{ locale, currency, isPreview?, custom? } — mutate directly, do not replace.' }
whenItFires: Synchronously, every time orchestr builds the clientEnv object before sending an action request.
---
```ts [app/plugins/client-env.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('orchestr:client-env:modify', ({ clientEnv }) => {
    clientEnv.locale = useLanguage().value.locale;
    clientEnv.currency = useCurrency().value;
  });
});
```
::

::note
This hook is called synchronously (not `async`). Avoid async work inside the callback.
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
