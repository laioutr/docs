---
title: Middleware
description: Extend Orchestr handlers with shared context, API clients, and cross-cutting logic using extendRequest and use.
seo:
  title: Middleware
  description: Extend Orchestr handlers with shared context, API clients, and cross-cutting logic using extendRequest and use.
sitemap:
  loc: /frontend/orchestr/middleware
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

Your connector app needs an API client available in every handler — actions, queries, links, and component resolvers. Instead of creating a client in each handler, Orchestr lets you set up shared context once and pass it through to all handlers automatically.

```typescript [server/orchestr/middleware/defineMyPackage.ts] twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
/** Create a mock client for a CRM system */
declare const createCrmClient: () => { subscribe: (email: string) => Promise<void> };
// ---cut---
export const defineMyPackage = defineOrchestr
  .meta({ app: 'my-crm-package' })
  .extendRequest(() => ({
    context: { client: createCrmClient() },
  }));
```

Every handler built from `defineMyPackage` now has `context.client` available with full type safety.

## `extendRequest` — Per-Request Setup

**`extendRequest`** runs once at the start of each request, before any handler executes. Use it to initialize API clients, read cookies, or set response headers.

```typescript [server/orchestr/middleware/defineMyPackage.ts] twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const shopwareClientFactory: (event: any) => { defaultHeaders: Record<string, string> };
declare const shopwareAdminClientFactory: () => any;
// ---cut---
export const defineShopware = defineOrchestr
  .meta({
    app: '@laioutr-core/shopware',
    logoUrl: '/app-shopware/shopware-logo.svg',
    label: 'Shopware',
  })
  .extendRequest(async ({ event, clientEnv }) => {
    const storefrontClient = shopwareClientFactory(event);
    const adminClient = shopwareAdminClientFactory();

    return {
      context: {
        storefrontClient,
        adminClient,
      },
    };
  });

export const defineShopwareAction = defineShopware.actionHandler;
export const defineShopwareQuery = defineShopware.queryHandler;
export const defineShopwareLink = defineShopware.linkHandler;
```

The callback receives `event` (the H3 request event) and `clientEnv` (locale, currency, and other client environment data). The returned `context` object is merged into every handler's arguments.

::note
`clientEnv.locale` and `clientEnv.currency` are guaranteed populated on every request. Read them directly; do not write fallback defaults like `clientEnv.currency ?? 'USD'`.
::

You can chain multiple `extendRequest` calls. Each one extends the context further:

```typescript twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const createApiClient: () => any;
declare const createAnalyticsClient: () => any;
// ---cut---
const defineMyPackage = defineOrchestr
  .extendRequest(() => ({ context: { api: createApiClient() } }))
  .extendRequest(() => ({ context: { analytics: createAnalyticsClient() } }));
```

::note
`extendRequest` runs for **every** incoming request, regardless of whether the current app handles it. Keep initialization lightweight or use caching for expensive operations like fetching system configuration. See [Caching](/frontend/orchestr/caching).
::

::tip
For backends that need vendor-internal IDs (Shopware's `sw-language-id`, sales-channel UUIDs) instead of standard locale or currency codes, see the [System bootstrap in extendRequest](/frontend/orchestr/recipes/system-bootstrap) recipe for the fetch-cache-resolve pattern.
::

## Setting cookies and response headers

Query, link, and component-resolver responses are streamed as turbo-stream chunks; response headers are flushed before any of those handlers run. Two places remain where you can mutate the HTTP response:

- **Inside `extendRequest`** for read-side requests. It runs once at the start of the request, before streaming begins. Use it for session cookies that need to be set on initial render or for `Set-Cookie` headers derived from incoming auth state.
- **Inside an [action handler](/frontend/orchestr/actions)** for write-side requests. Action responses are a single non-streamed payload, so cookies and headers set in an action reach the browser normally. Use this for login, logout, and anything else that mutates the session.

Header and cookie writes from query handlers, link handlers, component resolvers, or `use` middleware fail (Nitro logs a "Cannot set headers after they are sent" error) because the response stream has already started.

::tip
For the read-or-create-and-set pattern used for cart, session, and visitor IDs (with guidance on which slot to pick), see the [Identity cookies](/frontend/orchestr/recipes/identity-cookies) recipe.
::

## `use` — Per-Handler Middleware

**`use`** wraps each individual handler execution. Unlike `extendRequest`, it can run multiple times per request (once per handler) and has access to the handler's output through the `next` function.

Use `use` when you need to:
- Run logic **before and after** each handler (logging, timing)
- Transform handler output
- Add error handling around individual handlers

```typescript [server/orchestr/middleware/defineWithLogger.ts] twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
// ---cut---
export const defineWithLogger = defineOrchestr.use(async (args, next) => {
  console.log('Handler input:', args.input);
  const response = await next({});
  console.log('Handler output:', response.output);
  return response;
});
```

You can also use `use` to inject additional context, similar to `extendRequest`:

```typescript twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const createCrmClient: () => { subscribe: (email: string) => Promise<void> };
// ---cut---
const defineMyPackage = defineOrchestr.use((args, next) => {
  return next({
    context: { client: createCrmClient() },
  });
});
```

::warning
Do not write to response headers or cookies inside `use`. The response stream has already started by the time `use` runs. See [Setting cookies and response headers](#setting-cookies-and-response-headers).
::

## Which One to Use

| | `extendRequest` | `use` |
|---|---|---|
| **Runs** | Once per request | Once per handler execution |
| **Access to handler output** | No | Yes (via `next`) |
| **Can set headers/cookies** | Yes | No |
| **Best for** | Client setup, auth, request-scoped context | Logging, timing, output transformation |

For most connector apps, **`extendRequest`** is the right choice. The standard pattern is to create a `defineMyPackage` builder that sets up your API clients, then export shortcut functions for each handler type:

```typescript [server/orchestr/middleware/defineMyPackage.ts] twoslash
import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
declare const createClient: () => any;
// ---cut---
export const defineMyPackage = defineOrchestr
  .meta({ app: 'my-package', label: 'My Package' })
  .extendRequest(() => ({
    context: { client: createClient() },
  }));

export const defineMyAction = defineMyPackage.actionHandler;
export const defineMyQuery = defineMyPackage.queryHandler;
export const defineMyLink = defineMyPackage.linkHandler;
export const defineMyComponentResolver = defineMyPackage.componentResolver;
```
