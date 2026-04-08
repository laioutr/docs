---
title: Consent Management
description: Laioutr's consent management abstraction gives you a single, provider-agnostic API for cookie and consent state. Use it to gate tracking and marketing scripts, and plug in your own consent provider or the ready-to-use Cookiebot app.
seo:
  title: Consent Management | Laioutr
  description: Laioutr's consent management abstraction gives you a single, provider-agnostic API for cookie and consent state. Use…
sitemap:
  loc: /frontend/features/consent-management
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## What is the consent management abstraction?

Laioutr provides a **consent management** layer in the frontend that separates "what the user has consented to" from "which vendor collects it." Your app and other Laioutr apps (e.g. Google Tag Manager, analytics) use one **consent store** and one set of **consent categories**. The actual banner, cookie, and CMP (Consent Management Platform) are implemented by a **consent adapter** that you choose. You can use the built-in **Cookiebot** app or implement your own adapter for another provider (OneTrust, CookieYes, custom, etc.).

This way you get:

- **One API** – Check consent with `hasCategoryConsent('statistics')` or `hasCategoryConsent('marketing')` and react to changes, no matter which CMP is behind it.
- **Swappable providers** – Change CMP or consent implementation without rewriting the rest of your app or your tracking setup.
- **Integration with other features** – The tracking store and apps like **GTM** read from the consent store so tags can respect consent (e.g. Google Consent Mode). Only adapters that have the required consent receive events.

The abstraction lives in **@laioutr-core/frontend-core**. Your Nuxt app must have this module so the consent store and the `#frontend/consent` types are available.

## Consent state: the five categories

Consent is represented by a single state shape with five categories. Every adapter maps its provider's categories into this shape so the rest of the app only deals with one model:

| Category       | Typical use |
|----------------|-------------|
| **necessary**  | Essential cookies (e.g. session, security). Usually always `true` and not user-toggleable. |
| **functional** | Preferences and functionality (e.g. language, cart). |
| **statistics** | Analytics and performance (e.g. GA, heatmaps). |
| **marketing**  | Advertising and personalisation (e.g. ads, retargeting). |
| **unclassified** | Any category that doesn't fit the above. |

The store keeps a single **state** object with these five booleans. When the user accepts or revokes categories in the CMP, the active adapter calls the store (via `onConsentChange`), and the store updates this state. Other code can read **state** (reactive) or use **hasCategoryConsent(category)** to gate behaviour.

## The consent store (useConsentStore)

The consent store is a global state (VueUse `createGlobalState`) that:

- Holds the current **consent state** (the five categories).
- Keeps a registry of **adapters** and one **active adapter**.
- Exposes methods to **register** an adapter, **activate** it (so it becomes the single active provider), and **deactivate** it.
- Exposes **hasCategoryConsent(category)** so you can check consent without touching the adapter directly.
- Exposes **showConsentOverlay()** and **renewConsent()** so you can open the banner or "Cookie preferences" from your UI (e.g. a footer link).

Only one adapter is active at a time. When you activate an adapter, the store calls its **init()**, subscribes to its **onConsentChange**, and applies its initial **getConsentState()** to the store state. Deactivating calls the adapter's **destroy()** (if implemented) and resets state to safe defaults (only **necessary** true).

You use the store from any component or plugin via **useConsentStore()** (auto-imported when using frontend-core). Example: disable a feature until the user has given statistics consent:

```ts
const consentStore = useConsentStore();

if (consentStore.hasCategoryConsent('statistics')) {
  // load analytics
}
```

Or show a "Cookie preferences" button that reopens the banner:

```ts
await consentStore.showConsentOverlay();
```

## The consent adapter interface

A **consent adapter** is the bridge between a concrete CMP (Cookiebot, OneTrust, etc.) and the Laioutr consent store. It implements a small interface so the store can drive and read consent in a uniform way.

Conceptually, an adapter must:

1. **Identify itself** – A **name** (e.g. `'cookiebot'`) so the store can register and activate it.
2. **Report activation state** – A readonly **isActive** boolean that indicates whether the adapter is currently the active consent provider. The store sets this when it activates or deactivates the adapter.
3. **Initialise** – **init()** loads the CMP script, sets up cookies, and subscribes to the provider's consent events. When the user changes consent in the CMP, the adapter should call the callbacks registered via **onConsentChange** with a **Partial&lt;ConsentManagementState&gt;** so the store stays in sync.
4. **Report current state** – **getConsentState()** returns the current consent (from cookie or CMP API) in the same five-category shape (or a partial). Can be sync or async.
5. **Expose UI triggers** – **showConsentOverlay()** and **renewConsent()** should open the CMP banner or preferences dialog.
6. **Answer category checks** – **hasCategoryConsent(category)** returns whether the given category is granted (typically derived from **getConsentState()**).
7. **Optional cleanup** – **destroy()** can tear down listeners or resources when the adapter is deactivated.

The TypeScript types (**ConsentAdapter**, **ConsentManagementState**) are exported from **#frontend/consent** (aliased by frontend-core). Your consent app can depend on **@laioutr-core/frontend-core** and implement a class that satisfies **ConsentAdapter**, then register it in a Nuxt plugin (see below).

## How to build your own consent management app

If you want to support a different CMP or a custom consent solution:

1. **Create a Laioutr app** (Nuxt module) that depends on **@laioutr-core/frontend-core**.
2. **Implement an adapter class** that implements **ConsentAdapter** (import types from **#frontend/consent**):
   - Map your provider's categories to **ConsentManagementState** (necessary, functional, statistics, marketing, unclassified).
   - In **init()**, load the CMP script (e.g. via **useHead**), read the initial consent (cookie or API), and subscribe to your provider's "consent changed" event. When it fires, call every callback passed to **onConsentChange** with the mapped state.
   - Implement **getConsentState()**, **hasCategoryConsent()**, **showConsentOverlay()**, **renewConsent()**, and optionally **destroy()**.
3. **Register and activate the adapter in a client plugin** – In a Nuxt plugin that runs on the client, get the consent store with **useConsentStore()**, instantiate your adapter (e.g. with config from **useRuntimeConfig()**), call **store.registerAdapter(adapter)** and **store.activateAdapter(adapter.name)**.
4. **Configure your app** – Use your module's config (e.g. in **laioutrrc.json** or **nuxt.config**) to pass in API keys, domain IDs, or feature flags so the adapter can initialise the CMP correctly.

Once your adapter is active, the rest of the app and other apps (e.g. GTM) only use **useConsentStore()** and **hasCategoryConsent** / **state**; they do not need to know which CMP is used.

## Ready-to-use: Cookiebot app

Laioutr ships a ready-to-use consent app for [Cookiebot](https://www.cookiebot.com/). It implements the consent adapter for Cookiebot's banner and cookie, maps Cookiebot's categories (necessary, preferences, statistics, marketing) to Laioutr's consent state, and registers with the consent store so you don't have to write adapter code yourself.

- **App package:** **@laioutr-app/cookiebot**
- **What it does:** Loads the Cookiebot script, reads the **CookieConsent** cookie, and keeps the consent store in sync. Exposes **showConsentOverlay** and **renewConsent** so you can reopen the banner from a "Cookie preferences" link. Supports optional Google Consent Mode (configurable).
- **Configuration:** You only need to set your Cookiebot **CBID** (domain group ID) in the app config; optional options control Consent Mode defaults.

To use it, add the module to your app and set your CBID. Other features (e.g. [GTM](/apps/app-docs/gtm)) will then read consent from the store and update their tags (e.g. Google Consent Mode) when the user accepts or revokes categories.

For setup, options, and behaviour, see the **[Cookiebot app documentation](/apps/app-docs/cookiebot)**.

## How other apps use consent

Apps that need to respect consent do not talk to Cookiebot (or any CMP) directly. They use the consent store:

- **GTM app** – Subscribes to **consentStore.activeAdapter.value?.onConsentChange(...)** and pushes Google Consent Mode updates (e.g. `analytics_storage`, `ad_storage`) when the user grants statistics or marketing. It also sets default consent to "denied" so tags wait for consent.
- **Tracking store** – When you register a tracking adapter (e.g. GTM), you can attach **consentCategories** (e.g. `['statistics', 'marketing']`). The tracking store only forwards events to that adapter if **hasCategoryConsent** is true for all of those categories. So analytics or marketing events are not sent until the user has consented.

This keeps a clear separation: one consent provider (your chosen adapter), one state, and many consumers (tracking, GTM, custom logic) that all use the same API.

## Summary

- Laioutr's **consent management abstraction** is a single store and **ConsentAdapter** interface in **@laioutr-core/frontend-core**, representing consent as five categories (necessary, functional, statistics, marketing, unclassified).
- Use **useConsentStore()** to register and activate adapters, check consent with **hasCategoryConsent(category)**, and trigger consent UI with **showConsentOverlay()** or **renewConsent()**.
- To add your own CMP, implement a **ConsentAdapter** and register it in a client plugin. For a ready-to-use solution, see the **[Cookiebot app documentation](/apps/app-docs/cookiebot)**.
