---
title: Tracking
description: Laioutr’s analytics layer gives you one typed API to emit events. Destinations declare the consent purposes they need, and the bus delivers each event only to the destinations the visitor has allowed.
seo:
  title: Tracking
  description: Laioutr’s analytics layer gives you one typed API to emit events. Destinations declare the consent purposes they…
sitemap:
  loc: /frontend/features/tracking
  lastmod: 2026-09-08
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
- **`useTrackVideoProgress(meta)`** returns a handler that emits `web/video_progress` for each playback milestone it is given.

### Video progress

Video is opt-in rather than automatic. `MediaVideo` lives in ui-kit, which sits below Frontend Core in the dependency order, so it cannot emit a canonical event itself; it reports milestones and the page decides what they mean.

Call the composable once in `setup` and bind the handler it returns. Calling it in the template would run a composable on every milestone.

```vue
<script setup lang="ts">
const trackVideoProgress = useTrackVideoProgress({ title: 'Launch film' });
</script>

<template>
  <MediaVideo :media="media" @milestone="trackVideoProgress" />
</template>
```

The handler rounds the milestone fraction into a whole `percent` and passes `currentTime` and `duration` through. Anything you put in `meta` (`playerType`, `title`, `url`) rides along on the event. `url` is the media address; the page address stays in the page context.

## Ambient contexts

Every event carries a `contexts` object built at enrichment time, so payloads stay about the thing that happened:

| Context | Carries |
| --- | --- |
| `page` | `url`, `path`, `title`, `pageType`, and the in-session `referrer` (the route navigated away from) |
| `market` | The active market, language and currency |
| `session` | `authStatus`, visitor and session tokens, a hashed `customerId`, and the `entryReferrer` captured on entry |
| `consent` | The visitor's granted purposes at emission time |
| `campaign` | `clickIds`, `params` and the `entry` record, for the ad campaign that brought the visitor |
| `experiments` | Active allocations |
| `delivery` | `deferred`, present only on an event that waited for a consent decision |

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

A provider returning `undefined` attaches nothing, so a context that is not yet known simply stays off the event. A provider that throws costs its own context a value and warns; the event keeps the rest and still goes out.

### Contexts that follow the consent decision

A provider is called once per emission, so it reports the state at the moment the event was raised. That is what you want almost everywhere: re-reading the page context later would report the page the visitor is on now, not the one the event happened on.

Identity and consent state are the exception, because their value follows the visitor's decision rather than the moment of the emission. Register a context with `refreshOnDelivery` and it is read again when a held event is finally delivered:

```ts [app/plugins/analytics-context.client.ts]
const CrmContext = defineAnalyticsContextToken('crm', {
  schema: z.object({ profileId: z.string() }),
});

// The profile id exists only once the visitor has granted personalization, so a held event
// should carry the value minted at the grant rather than the empty one from before it.
useAnalyticsContexts().register(CrmContext, () => useCrmProfile().id, { refreshOnDelivery: true });
```

Of Laioutr's own contexts, `session`, `consent` and `campaign` are marked this way. `page`, `market` and `experiments` keep their emit-time values.

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

A replayed event is not byte-identical to the one that was buffered. On delivery, the consent-scoped contexts are read again, so it carries the identity minted at the grant instead of the empty one it was enriched with. Every other context stays at its emit-time value, so a held page view still reports the page it was raised on.

Such an event also carries a `delivery` context of `{ deferred: true }`, which is how a destination tells a replay from a live emission:

```ts
track: (event) => {
  const { deferred } = (event.contexts.delivery ?? {}) as { deferred?: boolean };
  window.acme?.send(event.type, { ...event.payload, backfilled: deferred === true });
},
```

To transform a held event on its way out, tap [`frontend-core:analytics:redeliver`](/frontend/features/hooks).

## Campaign attribution

A merchant pays for an ad, a visitor clicks it, and buys something later. The parameter naming that click exists in the landing URL and nowhere else: the router rewrites the URL on the first navigation and the value is gone. Frontend Core reads it on entry and publishes it on the `campaign` context, so every event carries the campaign that brought the visitor.

Three groups are captured, and they are not gated alike:

| Group | Carries | Purpose |
| --- | --- | --- |
| `clickIds` | `gclid`, `msclkid`, `fbclid` and the other ad networks' click identifiers | `advertising` |
| `params` | The `utm_*` set an operator writes into the URL themselves | `analytics` |
| `entry` | `landingPage` and `referrer`, naming where the visit began | `analytics` |

Click ids sit under `advertising` because Google and Microsoft gate their own storage of those ids on an advertising signal. A group the visitor has not granted is **absent from the context**, rather than present and empty.

Capture itself runs before the visitor answers, because the values would be gone by the time they did, and the result is held in memory. What the purpose gates is storage and publication. A refusal deletes the stored values and forgets the capture, so a later grant republishes nothing.

### What is captured by default

Ten click ids: `gclid`, `gbraid`, `wbraid`, `msclkid`, `fbclid`, `ttclid`, `twclid`, `li_fat_id`, `dclid`, `rdt_cid`.

Nine campaign parameters: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`.

A capture is kept for 90 days, which is what both Google and Microsoft publish for their own click-id cookies. Narrow the lists or change the window with `config.campaign` in the laioutrrc:

```jsonc [laioutrrc.json]
{
  "config": {
    "campaign": {
      "clickIds": ["gclid", "msclkid"],
      "params": ["utm_source", "utm_medium", "utm_campaign"],
      "retentionDays": 30
    }
  }
}
```

A name outside the shipped `ClickId` and `CampaignParam` unions is accepted and behaves identically, so a network introducing a new identifier needs no release; it simply gets no autocomplete. Those lists are also the boundary against hostile input: a name you did not configure is never kept, whether it arrives in the URL or in a cookie some other page on the registrable domain wrote.

### One record is one touch

A landing URL carrying any configured parameter replaces both halves of the record, so a click id from one campaign is never reported beside the campaign text of another.

The entry record follows the same touch. `landingPage` is the origin and path with the query stripped, since the campaign parameters are carried individually and the rest of a landing query is whatever the visitor happened to paste. A referrer from the storefront's own origin is dropped, because arriving from another page of the site is a navigation rather than an entry. A direct visit stores nothing at all: its landing page is simply the page the visitor opened, and there is no referrer to name.

A value longer than 256 characters is dropped whole rather than truncated. Half a click id is worse than none, because it still looks like one.

### Reading it yourself

`useCampaignAttribution().ensure()` returns the same value the context carries, for code that wants the campaign without waiting for an event:

```ts
const { clickIds, params, entry } = useCampaignAttribution().ensure();
```

It applies the same consent gate, so a group the visitor has not granted is absent here too, and reading never extends the retention window.

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

### Degrading instead of going silent

A destination that can still do something useful without consent declares `onDenied`, and receives the events it was not granted, with the consent state attached:

```ts
onDenied: (event, consent) => {
  // No visitor or session token is attached, so this can be counted but not attributed
  window.acme?.count(event.type, { consent });
},
```

What that changes:

- An event handed to `onDenied` counts as **delivered**. It is not held for a later grant, because a destination that degrades upgrades its own record rather than being sent the same event twice.
- Revocation leaves the destination running. `teardown()` is for a destination that goes silent; one that declares `onDenied` keeps receiving.
- `filter` still applies, and `init()` still runs before the first denied event reaches you.

### Reshaping events on the way out

Five synchronous Nuxt hooks sit on the pipeline: `frontend-core:analytics:emit` (veto or pre-transform), `:enrich` (the whole event), `:project` (one entity), `:redeliver` (an event that waited for a consent decision), and `:deliver` (the copy one destination is about to receive). Handler ordering, worked redaction examples, and which hooks change the event for every destination rather than one are covered in [Hooks](/frontend/features/hooks).

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

### Reading the visitor's identity on a request

A server route or a connector that wants its own work grouped into the same visit reads the tokens the browser is already reporting, rather than minting a second identity:

```ts [server/api/quote.post.ts]
export default defineEventHandler(async (event) => {
  const { visitorToken, sessionToken } = readAnalyticsIdentity(event);

  await recordQuoteRequest({ visitorToken, sessionToken, ...(await readBody(event)) });
});
```

Both cookies are written only under the `analytics` purpose, so an empty result means the visitor has not granted it, not that something is misconfigured.

## Debugging

Both switches live under `laioutr.dev` in `nuxt.config.ts`. A production build discards that object whole, so neither can ship by accident:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  laioutr: {
    dev: { analyticsDebug: true, consentDebug: true },
  },
});
```

**`analyticsDebug`** registers a built-in destination that logs every event to the console. It declares `{ purposes: [] }`, so consent does not gate it and you see the full stream regardless of what any other destination is receiving.

**`consentDebug`** installs a debug CMP that grants every purpose without asking. A storefront with no consent app installed never grants anything, so none of the consent-gated paths run: no visitor identity, no browser-to-server transport, no delivery to a destination. It reports a decision the visitor never made, so it warns on install.

## Ready-to-use: Google Tag Manager

Laioutr ships an app for [Google Tag Manager](https://tagmanager.google.com/). It registers a destination requiring the `analytics` purpose, maps canonical events to GA4 names and pushes them to the data layer with money converted to major units, and drives **Google Consent Mode v2** from the consent store — an inline `denied` default in the head before `gtm.js` loads, then an update once the visitor answers.

- **App package:** **@laioutr-app/gtm**
- **Configuration:** your GTM `containerId`, optionally `layer` for the data layer variable name.

For setup and options, see the **[GTM app documentation](/apps/app-docs/gtm)**.

## Summary

- Emit with **`useAnalytics().track(Token, payload)`** using tokens from `@laioutr-core/core-types/analytics` (`web/*`) and `@laioutr-core/canonical-types/analytics` (`ecommerce/*`). Payload slots accept orchestr entities, which are projected at emit time.
- **Ambient contexts** — page, market, session, consent, experiments — are attached for you; add or override them with `useAnalyticsContexts()`, and mark one `refreshOnDelivery` when its value follows the consent decision rather than the moment of the emission.
- **Campaign attribution** rides on the `campaign` context, captured from the landing URL on entry. Click ids need `advertising`; `utm_*` and the entry record need `analytics`. Read it directly with `useCampaignAttribution().ensure()`.
- **Consent gates delivery per destination.** Declare `consent: { purposes: [...] }`; there is no ungated path, and events emitted before the visitor decides are held rather than dropped. A replayed event arrives with `delivery` set to `{ deferred: true }`. Declare `onDenied` instead to receive events under denial and degrade rather than go silent.
- **Add a backend** with `defineAnalyticsDestination({ id, consent, track })` registered from a client plugin, or `subscribeToAnalytics` in a Nitro plugin for server-side recipients. `readAnalyticsIdentity(event)` gives server code the visitor and session tokens off a request.
- **Debug in dev** with `laioutr.dev.analyticsDebug` to log the full event stream, and `laioutr.dev.consentDebug` to grant every purpose without a CMP installed.
- For a ready-made setup use **@laioutr-app/gtm** with a consent app such as [Cookiebot](/apps/app-docs/cookiebot), so Consent Mode stays in sync with the visitor's choices.
