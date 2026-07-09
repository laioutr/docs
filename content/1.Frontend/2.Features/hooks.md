---
title: Hooks
description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
links: []
seo:
  title: Hooks
  description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
---

Frontend-core and orchestr expose [Nuxt runtime hooks](https://nuxt.com/docs/guide/going-further/hooks#app-hooks-runtime) that let you extend or modify the complete behaviour of your Laioutr Frontend. Register hooks inside a [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins) for client-side hooks, or a [Nitro plugin](https://nitro.build/guide/plugins#nitro-hooks) for server-side hooks.

## Frontend Core Hooks

These hooks run on the client. Register them in a Nuxt plugin with [`nuxtApp.hook()`](https://nuxt.com/docs/3.x/api/composables/use-nuxt-app#hookname-cb).

### Link Resolver

Three hooks let you customize how `linkResolver` resolves links, switches locale paths, and switches market URLs. They come in two shapes.

The `resolve` hook is a **filter**. It runs *after* a link is resolved, with `result.value` pre-seeded with the resolved URL or path. Your handler can transform that value (for example, append a query parameter), replace it outright (route a reference to an external URL), or leave it untouched to keep the default. This works for any link type. When several plugins register this hook, each receives the previous one's output.

The two `switch-*` hooks are **overrides**. They run *before* the default logic, with `result.value` starting empty. Set it to take over locale or market switching, including cases the default cannot resolve. Leave it unset to fall back to the default.

| Hook                                             | Arguments                                                       | When it fires                                                  |
| ------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `frontend-core:link-resolver:resolve`            | `{ link: Link, result }`                                        | After every call to `linkResolver.resolve()`                   |
| `frontend-core:link-resolver:switch-locale-path` | `{ targetLanguageId: string, result }`                          | When switching the current page to another language            |
| `frontend-core:link-resolver:switch-market-url`  | `{ targetMarketId: string, targetLanguageId?: string, result }` | When switching to a different market (may include host change) |

For `resolve`, `result` has the shape `{ value: string }`, pre-seeded with the resolved value. For the two `switch-*` hooks, it is `{ value: string | undefined }`, empty until you set it.

```ts [app/plugins/custom-link-resolver.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // Replace: resolve product references to an external catalog URL
  nuxtApp.hook('frontend-core:link-resolver:resolve', ({ link, result }) => {
    if (link.type === 'reference' && link.reference.type === 'Product') {
      result.value = `https://catalog.example.com/p/${link.reference.slug}`;
    }
  });

  // Filter: append a tracking param to outbound links to a partner domain
  nuxtApp.hook('frontend-core:link-resolver:resolve', ({ link, result }) => {
    if (link.type === 'url' && result.value.includes('://partner.example.com')) {
      const separator = result.value.includes('?') ? '&' : '?';
      result.value = `${result.value}${separator}ref=laioutr`;
    }
  });

  // Override: take over locale switching for a specific market
  nuxtApp.hook('frontend-core:link-resolver:switch-locale-path', ({ targetLanguageId, result }) => {
    if (targetLanguageId === 'fr-CH') {
      result.value = `/fr-ch${useRoute().path}`;
    }
  });
});
```

### Page Renderer

This hook lets you control which **page variant** is rendered. Pages can have multiple variants (for A/B testing, personalization, or conditional layouts). If you set `result.value` to a `RenderPageVariant`, that variant is used instead of the default.

| Hook                                              | Arguments                      | When it fires                                       |
| ------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| `frontend-core:page-renderer:select-page-variant` | `{ page: RenderPage, result }` | When the `PageRenderer` component selects a variant |

Here `result` has the shape `{ value: RenderPageVariant | undefined }`. The `page` object contains `id`, `type`, `path`, and a `variants` array.

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

## Orchestr Client Hooks

These hooks fire during client-side action execution. They follow the lifecycle pattern: `before` fires before the request, `success` or `error` after resolution, and `finally` always. All receive a `token` string that identifies the action (e.g. `ecommerce/cart/add-items`).

### Fetch Action Hooks

Fired by [`fetchAction`](/frontend/orchestr/actions#fetchaction), [`useFetchAction`](/frontend/orchestr/actions#usefetchaction), [`useQueryAction`](/frontend/orchestr/actions#query), and [`useMutationAction`](/frontend/orchestr/actions#mutation) (which uses `fetchAction` internally).

| Hook                            | Arguments                           |
| ------------------------------- | ----------------------------------- |
| `orchestr:action:fetch:before`  | `{ token, input }`                  |
| `orchestr:action:fetch:success` | `{ token, output }`                 |
| `orchestr:action:fetch:error`   | `{ token, error }`                  |
| `orchestr:action:fetch:finally` | `{ token, output?, error?, input }` |

### Mutation Action Hooks

Fired by [`useMutationAction`](/frontend/orchestr/actions#mutation).

| Hook                               | Arguments                                    |
| ---------------------------------- | -------------------------------------------- |
| `orchestr:action:mutation:before`  | `{ token, input }`                           |
| `orchestr:action:mutation:success` | `{ token, output, input, context }`          |
| `orchestr:action:mutation:error`   | `{ token, error, context }`                  |
| `orchestr:action:mutation:finally` | `{ token, output?, error?, input, context }` |

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

| Hook                              | Arguments                                          | When it fires                                                |
| --------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `orchestr:query-params:parsed`    | `{ params, queryPrefixes, route }`                 | After parsing the URL, before reading pagination/sort/filter |
| `orchestr:navigate-query:build`   | `{ params, query, path, queryString }`             | At the end of `buildQueryUrl()`, before returning the URL    |

### Client Environment

The `orchestr:client-env:modify` hook fires **synchronously** every time orchestr builds the `clientEnv` object before sending an action request. Use it to set locale, currency, or custom fields based on the current frontend state.

| Hook                         | Arguments                  |
| ---------------------------- | -------------------------- |
| `orchestr:client-env:modify` | `{ clientEnv: ClientEnv }` |

The `ClientEnv` object has the following shape:

```ts
{
  locale: string;
  currency: string;
  isPreview?: boolean;
  custom?: Record<string, any>;
}
```

Mutate `clientEnv` directly; don't replace it.

```ts [app/plugins/client-env.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('orchestr:client-env:modify', ({ clientEnv }) => {
    clientEnv.locale = useLanguage().value.locale;
    clientEnv.currency = useCurrency().value;
  });
});
```

::note
This hook is called synchronously (not `async`). Avoid async work inside the callback.
::

## Orchestr Server Hooks

These hooks fire during **server-side** action handler execution. They are [Nitro runtime hooks](https://nitro.build/guide/plugins#nitro-hooks) and must be registered in a Nitro plugin, not a Nuxt plugin.

| Hook                              | Arguments                           |
| --------------------------------- | ----------------------------------- |
| `orchestr:action:handler:before`  | `{ token, input, clientEnv }`       |
| `orchestr:action:handler:error`   | `{ token, error }`                  |
| `orchestr:action:handler:success` | `{ token, output }`                 |
| `orchestr:action:handler:finally` | `{ token, output?, error?, input }` |

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
