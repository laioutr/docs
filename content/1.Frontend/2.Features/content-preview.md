---
title: Content Preview
description: Let editors see unpublished content on the live storefront by opening any URL with a preview token. Server-verified, server-rendered, and never cached.
seo:
  title: Content Preview
  description: Let editors see unpublished content on the live storefront by opening any URL with a preview token. Server-verified, server-rendered, and never cached.
sitemap:
  loc: /frontend/features/content-preview
  lastmod: 2026-07-23
  changefreq: monthly
  priority: 1.0

---

::since-version{version="0.37.0" packages="@laioutr-core/frontend-core, @laioutr-core/orchestr" changelog="frontend"}
::

An editor drafts a campaign page in the CMS and wants to see it on the real storefront — real layout, real products, real prices — before anyone else can. Content preview does exactly that: append `?preview_token=<token>` to any storefront URL and the page is server-rendered against unpublished content instead of published content.

```
https://shop.example.com/campaigns/summer?preview_token=pvtk_3Qm…
```

Everything else stays the same. Same deployment, same routes, same sections. The only thing that changes is what your connectors return, because they now see `clientEnv.isPreview === true`.

## How the gate works

The token is a **project-level secret**, not a per-user credential. It travels like this:

::steps

### Cockpit stores it

Every project has a **Content Preview Token**, shown under **Project → Settings**. It is separate from the [project secret key](/cockpit/project-settings/project-secret-key) and separately rotatable, because it gets pasted into CMS preview-URL templates. It is also what Studio's "Show preview content" toggle sends.

### The frontend receives it at deploy time

The token is written into `laioutrrc.json` as `laioutr.previewToken` and read into **private** runtime config. It never ships in the browser bundle.

### The server verifies every presented token

`verifyPreviewToken()` compares the presented token against the configured one with a timing-safe compare. No token configured means preview is never granted.

### The verdict becomes `clientEnv.isPreview`

Orchestr's `resolveClientEnv()` sets `isPreview` only when the client asked for preview **and** the server verified the token. The token itself is stripped and never reaches a handler.

::

::caution
Rotating the token in Cockpit has **no effect until the project redeploys** — the frontend reads it from `laioutrrc` at deploy time. Until then the storefront keeps accepting the old token, and every CMS preview-URL template that embeds it must be updated with the new one. Rotate, then publish.
::

A wrong token is not an error. The page renders published content, exactly as it would for a shopper, and nothing is thrown. The only signal is `status === 'rejected'` in the composable below.

## Reading preview state in your app

`useContentPreview()` is auto-imported and safe to call from any component or composable.

```vue [app/components/PreviewBadge.vue]
<script setup lang="ts">
const { enabled, status, state } = useContentPreview();
</script>

<template>
  <div v-if="enabled" class="preview-badge">
    Preview mode
    <button @click="enabled = false">Exit</button>
  </div>
  <div v-else-if="status === 'rejected'" class="preview-badge preview-badge--error">
    Invalid preview token — showing published content.
  </div>
</template>
```

### Return value

| Property  | Type                                 | Description                                                                                                   |
| --------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `enabled` | `WritableComputedRef<boolean>`       | `true` only once the server has verified the token. Safe to use for `v-if`. Assign `false` to leave preview.  |
| `status`  | `ComputedRef<ContentPreviewStatus>`  | The full state: `'off' \| 'pending' \| 'active' \| 'rejected'`.                                               |
| `state`   | `PreviewState`                       | Nuxt's preview state, a plain object. Read `state.token` — **not** `state.value.token`.                        |

### The four states

| `status`     | Meaning                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `'off'`      | No preview token was presented. This is the normal shopper path.                                 |
| `'pending'`  | A token was presented and the verdict is still in flight. Only occurs client-side.               |
| `'active'`   | The server verified the token. Unpublished content is being served.                              |
| `'rejected'` | A token was presented and rejected. Published content is being served.                           |

::note
Prefer `enabled` over `status !== 'off'`. `enabled` reports the *verified* result, so a wrong token can never light up your preview chrome. Use `status` only when you want to distinguish `pending` from `rejected` in the UI.
::

## Driving preview from a cookie or header

The query parameter is the default source, not the only one. Register a handler on [`frontend-core:content-preview:resolve-token`](/frontend/features/hooks#content-preview) to take it over — useful when your CMS sets a preview cookie, or when you proxy previews behind a gateway that injects a header.

```ts [app/plugins/preview-from-cookie.ts]
export default defineNuxtPlugin({
  // Must outrank frontend-core's own preview plugin.
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('frontend-core:content-preview:resolve-token', ({ result }) => {
      result.value = useCookie('cms_preview_token').value ?? undefined;
    });
  },
});
```

Two constraints, both enforced by how the hook is called:

- **The plugin must use `enforce: 'pre'`.** frontend-core evaluates the token source during its own plugin setup; a handler registered later is never consulted.
- **Handlers must be synchronous.** You may read cookies or `useRequestHeaders()`, but you must not `await` — a returned promise is ignored.

The first handler to set `result.value` wins. Leave it unset to fall back to `?preview_token=`.

## Reacting to a preview change

Entering or leaving preview invalidates data that was fetched under the old assumption. frontend-core already handles its own two caches:

- `refreshNuxtData()` — every `useAsyncData` / `useFetch` in your app re-runs.
- `invalidateOrchestrQueries()` — every stored orchestr query result is dropped.

If you keep your own cache — a Pinia store hydrated once, a memoized CMS client — invalidate it from [`frontend-core:content-preview:changed`](/frontend/features/hooks#content-preview):

```ts [app/plugins/preview-invalidation.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:content-preview:changed', ({ enabled }) => {
    useMyCmsStore().reset();
    console.debug(`[preview] now ${enabled ? 'on' : 'off'}`);
  });
});
```

The hook fires after `enabled` already holds the new value, on the enable transition, the disable transition, **and** on a token swap — a change from one token to another flips neither `enabled` nor Nuxt's own lifecycle callbacks, but still needs the same invalidation.

## Serving unpublished content from a handler

Preview is only useful if your connectors act on it. Read `clientEnv.isPreview` in any query handler, link handler, component resolver, or action handler:

```ts [server/orchestr/cms/pages.ts]
export default defineMyCmsQuery(PageByPathQuery, async ({ context, input, clientEnv }) => {
  const { id } = await context.cmsClient.page({
    path: input.path,
    // Most headless CMSs expose drafts through a separate stage or endpoint.
    stage: clientEnv.isPreview ? 'DRAFT' : 'PUBLISHED',
  });

  return { id };
});
```

`isPreview` is a server-verified fact by the time your handler sees it — see [Client Environment](/frontend/orchestr/client-env) for the full trust boundary.

## Caching

Preview content is volatile and per-editor. It is kept out of every cache, deliberately:

| Layer                                        | Behaviour in preview                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| Orchestr query and link caches                | Bypassed entirely — treated as `strategy: 'live'`. Nothing is read or written.    |
| Orchestr component cache                      | Bypassed entirely.                                                                 |
| Orchestr cache keys                           | Carry a `preview` / `published` segment, so the two can never collide.             |
| The HTTP response                             | Sent as `Cache-Control: private, no-store`.                                        |

The `private, no-store` header is set for **any** presented token, granted or rejected. A rejected render still embeds the token in the hydration payload, and a CDN that ignores query strings in its cache key could otherwise hand that response to a shopper.

::caution
`private, no-store` keeps the response out of *shared* caches — a CDN, a reverse proxy. It does **not** opt out of Nitro's own route rules. If a route is configured with `swr` or `isr` in `routeRules`, add an explicit opt-out for it, or preview responses will be stored by Nitro itself.
::

## The verify endpoint

`POST /api/frontend/preview-verify` answers `{ granted: boolean }` for a presented token. The client uses it to resolve `pending` into `active` or `rejected`.

```json
// POST /api/frontend/preview-verify
{ "token": "pvtk_3Qm…" }

// → 200
{ "granted": true }
```

It is unauthenticated on purpose: the browser calling it carries no project secret, and appending `?preview_token=X` to any page is the same oracle. It is a **UI hint only** — authorization for real data is the gate that runs inside `resolveClientEnv()` on every orchestr request regardless, so a client that asserts `isPreview: true` without ever calling this endpoint still receives published content. Both paths share one implementation and cannot drift apart.

Brute-force resistance comes from token entropy. The response never contains the expected token, its length, or a reason.

## Security notes

- **The token is a project-wide secret.** Anyone holding it sees all unpublished content for that project. Share it with editors the way you would share a staging password, and rotate it when someone leaves.
- **It is never sent to the browser as configuration.** It lives in private runtime config. It reaches the browser only when *someone typed it into a URL*.
- **A wrong token is indistinguishable from no token** as far as rendered output goes. This is intentional: a preview URL that leaks to a shopper renders the ordinary published page.
- **Preview never reaches a shared cache.** See [Caching](#caching) above.

## Related

- [Hooks](/frontend/features/hooks#content-preview) — the two content-preview hooks in full.
- [Client Environment](/frontend/orchestr/client-env) — how `isPreview` is resolved and what else `clientEnv` carries.
- [Caching](/frontend/orchestr/caching) — orchestr's three cache layers.
- [Environments & Staging](/frontend/features/environments) — previewing *code* changes, as opposed to content.
