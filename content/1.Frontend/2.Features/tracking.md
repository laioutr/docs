---
title: Tracking
description: Laioutr’s analytics layer gives you one typed API to emit events. Destinations declare the consent purposes they need, and the bus delivers each event only to the destinations the visitor has allowed.
seo:
  title: Tracking
  description: Laioutr’s analytics layer gives you one typed API to emit events. Destinations declare the consent purposes they…
sitemap:
  loc: /frontend/features/tracking
  lastmod: 2026-08-06
  changefreq: monthly
  priority: 1.0

---

## What the analytics layer does

Laioutr centralises how events — page views, add to cart, purchase, search — reach analytics and marketing tools. Your app and Laioutr's own components emit through one API, `useAnalytics().track()`. A **bus** enriches each event and fans it out to every registered **destination** whose consent requirement the visitor has satisfied.

- **One typed API.** `track(Token, payload)`. The token is an imported value, not a string, so the payload is checked at compile time and the event name can never drift.
- **Consent per destination, evaluated at delivery.** A destination declares the purposes it needs. One emission reaches exactly the destinations the visitor allowed — you never branch on consent at the call site.
- **Ambient context, attached for you.** Page, market, session, consent and experiment facts ride along on every event without being passed in.
- **Pluggable backends.** Add or remove destinations without touching the code that emits.

The layer lives in **@laioutr-core/frontend-core**, so `useAnalytics()` is auto-imported in any Laioutr frontend. It works together with [consent management](/frontend/features/consent-management), which supplies the visitor's choices.

::note
Analytics is browser-only in v1. `track()` called during SSR is ignored, with a warning in development.
::

## Emitting an event

Import the token and call `track`:

```ts
import { AddToCart } from '@laioutr-core/canonical-types/analytics';

const { track } = useAnalytics();

track(AddToCart, {
  products: [{ productId: 'gid://shopify/Product/1', name: 'Runner', price: { amount: 8990, currency: 'EUR' }, quantity: 1 }],
  value: { amount: 8990, currency: 'EUR' },
});
```

Money is `{ amount, currency }` in **minor units** with an ISO 4217 code. Destination adapters convert to whatever their backend expects.

### Passing entities instead of fields

Any object slot in a payload also accepts an orchestr entity. It is projected to a flat wire snapshot at emit time, selected by its `entityType`, so destinations receive plain data rather than a live store object:

```ts
track(AddToCart, { products: [{ entity: product, quantity: 2 }] });
```

Entity types with no registered projector seed `{ id }`. The `frontend-core:analytics:project` hook completes or replaces any projection — see [Hooks](/frontend/features/hooks).

Any entity carrying a slug on its `base` component also gets a `url`: an absolute address on the market's production host, resolved through the same link resolver the storefront's own links use. It works for every addressable entity type, not just products, and a destination — including a server-side subscriber, which has no way to build one — receives a link it can follow. A projector that resolved its own `url` keeps it, and a `:project` handler can replace or drop it.

### The event vocabulary

Tokens are typed, versioned and namespaced `<namespace>/<name>`.

| Package | Namespace | Events |
| --- | --- | --- |
| `@laioutr-core/core-types/analytics` | `web/*` | `page_view`, `impression`, `element_click`, `scroll_depth`, `video_progress`, `experiment_viewed`, `share`, `generate_lead`, `login`, `sign_up`, `logout` |
| `@laioutr-core/canonical-types/analytics` | `ecommerce/*` | `view_item`, `view_item_list`, `select_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `add_to_wishlist`, `remove_from_wishlist`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `refund`, `search`, `view_search_results`, `view_promotion`, `select_promotion` |

Define your own with `defineAnalyticsEventToken` when nothing fits. Use your app's own namespace so it cannot collide with the platform vocabulary:

```ts
import { defineAnalyticsEventToken } from '@laioutr-core/core-types/analytics';
import { z } from 'zod/v4';

export const QuoteRequested = defineAnalyticsEventToken('acme/quote_requested', {
  schema: z.object({ quoteId: z.string(), lineCount: z.number() }),
});
```

### What is collected for you

Frontend Core already emits some of the vocabulary, so you do not have to:

- **`web/page_view`** after every completed router navigation.
- **`v-track-click="{ key, kind?, label? }"`** emits `web/element_click`, filling in link href and outbound-ness from the DOM.
- **`v-track-impression="{ kind, key, label? }"`** emits `web/impression` once per key, after the element has held 50% visibility for a second. `useTrackImpression(target, payload, { minRatio, minDurationMs })` is the composable form.
- **`useTrackScrollDepth({ thresholds })`** emits `web/scroll_depth` as the visitor crosses each threshold.

## Ambient contexts

Every event carries a `contexts` object built at enrichment time, so payloads stay about the thing that happened:

| Context | Carries |
| --- | --- |
| `page` | `url`, `path`, `title`, `pageType`, and the in-session `referrer` (the route navigated away from) |
| `market` | The active market, language and currency |
| `session` | `authStatus`, visitor and session tokens, a hashed `customerId`, and the `entryReferrer` captured on entry |
| `consent` | The visitor's granted purposes at emission time |
| `experiments` | Active allocations |

Add your own or replace one of Laioutr's — registering the same token wins:

```ts [app/plugins/analytics-context.client.ts]
import { defineAnalyticsContextToken } from '@laioutr-core/core-types/analytics';
import { z } from 'zod/v4';

const StoreContext = defineAnalyticsContextToken('store', {
  schema: z.object({ storeId: z.string(), fulfilment: z.string() }),
});

export default defineNuxtPlugin(() => {
  useAnalyticsContexts().register(StoreContext, () => ({
    storeId: useSelectedStore().id,
    fulfilment: useSelectedStore().mode,
  }));
});
```

A provider returning `undefined` attaches nothing, so a context that is not yet known simply stays off the event.

## How consent gates delivery

Each destination declares what it needs:

```ts
consent: { purposes: ['analytics'] }
```

There are five purposes — `necessary`, `functional`, `analytics`, `advertising`, `personalization` — resolved from the [consent store](/frontend/features/consent-management)'s five categories: `analytics` reads `statistics`, and both `advertising` and `personalization` read `marketing`.

- **`purposes`** — every listed purpose must be granted (AND).
- **`purposeSets`** — a list of alternatives, OR between sets and AND within one, for a destination that can operate in more than one mode.
- **`{ purposes: [] }`** — needs no consent at all, and delivers unconditionally.

**There is no ungated path.** A destination that names a purpose receives nothing until the visitor grants it, and stops receiving the moment they revoke — at which point its `teardown()` runs.

### Events emitted before the visitor answers

The banner is usually still open when the first page view fires. Those events are **held, not dropped**: the bus buffers them and delivers them in order once the visitor grants. A denial the visitor actually made discards them; a CMP merely reporting its denied default does not, because nothing has been decided yet.

That distinction is why a destination sees the landing page view at all. It also means a redaction applied in `frontend-core:analytics:enrich` is what gets buffered — the unredacted event is never retained.

## Building your own destination

To send Laioutr events to another tool — a custom endpoint, another tag manager, a CRM:

1. **Create a Laioutr app** (a Nuxt module) that depends on **@laioutr-core/frontend-core**.
2. **Author the destination** with `defineAnalyticsDestination`.
3. **Register it from a client plugin** with `useAnalytics().register()`.

```ts [app/plugins/acme-analytics.client.ts]
export default defineNuxtPlugin(() => {
  const destination = defineAnalyticsDestination({
    id: 'acme-analytics',
    consent: { purposes: ['analytics'] },

    // Runs once, before the first delivered event
    init: () => loadAcmeSdk(),

    // Optional: narrow what this destination cares about
    filter: (event) => event.type.startsWith('ecommerce/'),

    track: (event) => {
      window.acme?.send(event.type, { ...event.payload, page: event.contexts.page });
    },

    // Runs when consent is revoked or the destination is unregistered
    teardown: () => window.acme?.reset(),
  });

  useAnalytics().register(destination);
});
```

You do not check consent inside `track()` — the bus has already decided. Deliveries are serialised per destination, and a throwing destination is isolated: it warns and the others still receive the event.

Call `useAnalytics().unregister('acme-analytics')` to detach; its `teardown` runs and any queued events for it are discarded.

### Reshaping events on the way out

Three synchronous Nuxt hooks sit on the pipeline — `frontend-core:analytics:emit` (veto or pre-transform), `:enrich` (the whole event) and `:project` (one entity). Handler ordering, worked redaction examples, and the limit that redaction is global rather than per-destination are covered in [Hooks](/frontend/features/hooks).

## Receiving events on the server

For a recipient that must not run in the browser — a server-side API key, a warehouse ingest — subscribe in a Nitro plugin. The browser posts consented batches and Frontend Core dispatches them:

```ts [server/plugins/analytics.ts]
import { Purchase } from '@laioutr-core/canonical-types/analytics';

export default defineNitroPlugin((nitroApp) => {
  subscribeToAnalytics(nitroApp, [Purchase], { purposes: ['analytics'] }, async (event) => {
    await sendToWarehouse(event);
  });
});
```

Batches go to `POST /api/frontend/signals`. Change it with `analyticsIngestPath` in the module's public runtime config — that moves the server route too, not just where the browser posts.

## Debugging

Set `analyticsDebug: true` in the module's public runtime config to register a built-in destination that logs every event to the console. It declares `{ purposes: [] }`, so it is not gated by consent and shows you the full stream regardless of what any other destination is receiving.

## Ready-to-use: Google Tag Manager

Laioutr ships an app for [Google Tag Manager](https://tagmanager.google.com/). It registers a destination requiring the `analytics` purpose, maps canonical events to GA4 names and pushes them to the data layer with money converted to major units, and drives **Google Consent Mode v2** from the consent store — an inline `denied` default in the head before `gtm.js` loads, then an update once the visitor answers.

- **App package:** **@laioutr-app/gtm**
- **Configuration:** your GTM `containerId`, optionally `layer` for the data layer variable name.

For setup and options, see the **[GTM app documentation](/apps/app-docs/gtm)**.

## Summary

- Emit with **`useAnalytics().track(Token, payload)`** using tokens from `@laioutr-core/core-types/analytics` (`web/*`) and `@laioutr-core/canonical-types/analytics` (`ecommerce/*`). Payload slots accept orchestr entities, which are projected at emit time.
- **Ambient contexts** — page, market, session, consent, experiments — are attached for you; add or override them with `useAnalyticsContexts()`.
- **Consent gates delivery per destination.** Declare `consent: { purposes: [...] }`; there is no ungated path, and events emitted before the visitor decides are held rather than dropped.
- **Add a backend** with `defineAnalyticsDestination({ id, consent, track })` registered from a client plugin, or `subscribeToAnalytics` in a Nitro plugin for server-side recipients.
- For a ready-made setup use **@laioutr-app/gtm** with a consent app such as [Cookiebot](/apps/app-docs/cookiebot), so Consent Mode stays in sync with the visitor's choices.
