---
title: Tracking
description: Laioutr’s tracking abstraction gives you a single API to send analytics and marketing events. Use one or more tracking adapters (e.g. Google Tag Manager), optionally gated by consent, and implement your own adapters for other tools.
seo:
  title: Tracking
  description: Laioutr’s tracking abstraction gives you a single API to send analytics and marketing events. Use one or more tracking…
sitemap:
  loc: /frontend/features/tracking
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## What is the tracking abstraction?

Laioutr provides a **tracking** layer in the frontend that centralises how events (page views, add to cart, purchase, search, etc.) are sent to analytics and marketing tools. Your app (and Laioutr’s own components) call a single **tracking store** with a standard event shape. The store forwards each event to every **tracking adapter** that is currently active. Adapters can be **gated by consent**: an adapter only receives events if the user has granted the consent categories that adapter declares (e.g. `statistics`, `marketing`). That way you keep one event API and multiple backends (GTM, GA4, custom pixels, etc.) without duplicating consent logic everywhere.

This gives you:

- **One API** – Call **pushEvent(eventName, payload)** or **pushEvent({ eventName, payload })** from anywhere; the store fans out to all active adapters.
- **Consent-aware delivery** – Adapters can declare **consentCategories** (e.g. `['statistics', 'marketing']`). They only receive events when the user has granted all of those categories in the [consent store](/frontend/features/consent-management). Adapters that don’t set consent categories receive every event (they can handle consent themselves, e.g. via Google Consent Mode).
- **Pluggable backends** – Add or remove tracking adapters (GTM, custom analytics, etc.) without changing the code that emits events.
- **Standard event shape** – Events follow Laioutr’s **Analytics** type (event names like `page_view`, `add_to_cart`, `purchase`, `search`, plus typed payloads). Adapters can map this to their own format (e.g. data layer, GA4 schema).

The tracking store lives in **@laioutr-core/frontend-core**. Your Nuxt app must have this module so **useTrackingStore()** and the **Analytics** types are available. Tracking works best together with the [consent management](/frontend/features/consent-management) abstraction so adapters can be gated by the user’s choices.

## How the tracking store works

The **tracking store** (useTrackingStore) is a global state that:

- Holds a **registry of adapters**. Each adapter has an **id**, a **track(event)** function, and optionally **consentCategories** (e.g. `['statistics']` or `['statistics', 'marketing']`).
- Computes **active adapters** from the consent store: an adapter is active if it has no **consentCategories**, or if the user has granted **every** category in **consentCategories** (via the consent store’s **hasCategoryConsent**). So when the user accepts or revokes consent, the set of active adapters updates automatically.
- **pushEvent(event)** adds the event to an internal queue and calls **track(event)** on **every active adapter only**. Adapters that require consent but don’t have it never receive the event.
- **registerAdapter(adapter)** adds an adapter and subscribes it to future events (again, only when it’s active). Optionally replays the current event queue to the new adapter if it’s already active, so late-registered adapters can receive recent events.
- **unregisterAdapter(id)** removes an adapter. **isAdapterActive(adapterId)** tells you whether an adapter is currently receiving events (e.g. for UI that depends on consent).

So: **your app only calls pushEvent**. The store decides which adapters receive each event based on registration and consent. Adapters that need consent should set **consentCategories**; adapters that handle consent themselves (e.g. GTM with Consent Mode) can omit it and receive all events.

## Event shape: Analytics

Events follow the **Analytics** type: **eventName** (string) and **payload** (object). Laioutr defines standard event names and payloads (e.g. **page_view**, **add_to_cart**, **view_item**, **begin_checkout**, **purchase**, **search**, **view_search_results**, **form_start**, **form_submit**, **custom**) and typed payloads (currency, products, cartId, orderId, searchTerm, etc.). Use these from **@laioutr-core/frontend-core** (or your app’s imports) so adapters get a consistent structure. Custom events can use **eventName: 'custom'** and a flexible payload.

Example: send a page view and an add-to-cart from your code:

```ts
const trackingStore = useTrackingStore();

trackingStore.pushEvent('page_view', { pageType: 'home' });

trackingStore.pushEvent('add_to_cart', {
  hasUserConsent: true,
  currency: 'EUR',
  cartId: 'gid://shopify/Cart/abc',
  products: [{ productGid: '...', name: '...', brand: '...', price: 10, quantity: 1 }],
  // ... other payload fields as needed
});
```

Adapters receive the same **{ eventName, payload }** and can push it to the data layer, send it to an API, or transform it for their backend.

## How tracking uses consent

The tracking store uses the **consent store** (useConsentStore) to decide which adapters are active:

- When you register an adapter with **consentCategories** (e.g. `['statistics']`), the store checks **consentStore.hasCategoryConsent('statistics')**. Only if that (and any other listed category) is true does the adapter get events.
- When the user changes consent (e.g. accepts statistics in the cookie banner), the consent store updates; the tracking store’s **activeAdapters** recompute, and from then on **pushEvent** will include that adapter.
- Adapters **without** consentCategories are always active. They receive every event. This is useful for adapters that implement consent themselves (e.g. GTM: it receives all events but tags inside GTM are controlled by Google Consent Mode, which the GTM app updates from the consent store).

So: **consent management** defines “what the user allowed”; **tracking** uses that to decide “who gets the event.” For a new analytics or marketing adapter, set **consentCategories** to the categories that must be granted (e.g. `['statistics']` for analytics, `['marketing']` for ads) so you don’t send data without consent.

## How to build your own tracking adapter

To send Laioutr events to another tool (e.g. a custom analytics endpoint, another tag manager, or a CRM):

1. **Create a Laioutr app** (Nuxt module) that depends on **@laioutr-core/frontend-core**.
2. **Implement an adapter object** with:
   - **id** – Unique string (e.g. `'my-analytics'`).
   - **track(event: Analytics) => void** – Called for each event when the adapter is active. Map **event.eventName** and **event.payload** to your backend’s format and send (e.g. fetch, data layer, pixel).
   - **consentCategories** (optional) – Array of consent category keys (e.g. `['statistics']` or `['statistics', 'marketing']`). If present, the adapter only receives events when the user has granted **all** of these categories. Omit to receive all events (and handle consent yourself if needed).
3. **Register the adapter in a client plugin** – Use **useTrackingStore()**, then **trackingStore.registerAdapter(adapter)**. Run this only on the client (e.g. in a plugin with `mode: 'client'` or inside `import.meta.client`).
4. **Optional: unregister on teardown** – If your adapter is conditional or can be disabled, call **trackingStore.unregisterAdapter(adapter.id)** when it should stop receiving events.

The store will call your **track** function only when the adapter is active (i.e. when consent for **consentCategories** is granted, or when **consentCategories** is not set). You don’t need to check consent inside **track** if you use **consentCategories**; the store does that for you.

## Ready-to-use: Google Tag Manager (GTM) app

Laioutr ships a ready-to-use tracking app for [Google Tag Manager](https://tagmanager.google.com/). It registers a tracking adapter that pushes every event to the GTM data layer as **{ event: eventName, ...payload }**, so you can configure tags and triggers in GTM to react to Laioutr events. The GTM app does **not** set **consentCategories** on its adapter: it receives all events and relies on **Google Consent Mode** for consent. It subscribes to the consent store and pushes consent updates (e.g. `analytics_storage`, `ad_storage`) to the data layer when the user grants statistics or marketing, so tags inside GTM can respect consent.

- **App package:** **@laioutr-app/gtm**
- **What it does:** Injects the GTM script and noscript iframe, sets Consent Mode defaults to “denied,” registers a tracking adapter that pushes events to the data layer, and updates Consent Mode when the user changes consent (works best with a [consent adapter](/frontend/features/consent-management) such as Cookiebot).
- **Configuration:** Set your GTM **containerId** (and optionally **layer** for the data layer variable name).

For setup and options, see the **[GTM app documentation](/apps/app-docs/gtm)**.

## Summary

- Laioutr’s **tracking abstraction** is a single **tracking store** (useTrackingStore) and **tracking adapters** in **@laioutr-core/frontend-core**. You emit events with **pushEvent(eventName, payload)**; the store forwards them to all **active** adapters.
- **Consent** gates which adapters are active: set **consentCategories** on an adapter (e.g. `['statistics']`) so it only receives events when the user has granted those categories in the [consent store](/frontend/features/consent-management). Adapters without **consentCategories** receive all events and can handle consent themselves (e.g. GTM + Consent Mode).
- To add your own backend, implement an adapter **{ id, track, consentCategories? }** and **registerAdapter** in a client plugin. Use the standard **Analytics** event names and payloads where possible.
- For a ready-to-use solution, use the **@laioutr-app/gtm** app and follow the **[GTM app documentation](/apps/app-docs/gtm)**. Combine it with a consent app (e.g. [Cookiebot](/apps/app-docs/cookiebot)) so Consent Mode stays in sync with the user’s choices.
