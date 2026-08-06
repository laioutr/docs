---
title: Consent Management
description: Laioutr's consent management abstraction gives you a single, provider-agnostic API for cookie and consent state. Use it to gate tracking and marketing scripts, and plug in your own consent provider or one of the ready-to-use apps.
seo:
  title: Consent Management
  description: Laioutr's consent management abstraction gives you a single, provider-agnostic API for cookie and consent state. Use it to gate tracking and marketing scripts, and plug in your own consent provider or one of the ready-to-use apps.
sitemap:
  loc: /frontend/features/consent-management
  lastmod: 2026-04-27
  changefreq: monthly
  priority: 1
---

## What the consent abstraction does

A storefront usually loads scripts from several vendors (analytics, ads, chat, retargeting). Each vendor needs the user's consent before it runs, and the law cares about the *category* of cookie, not the vendor. Laioutr's consent layer separates the two: your code asks "does the user consent to **statistics**?" and the active CMP (Cookiebot, CCM19, OneTrust, custom) answers. Switching CMPs later is a config change, not a rewrite.

The abstraction gives you a **consent store** with five fixed categories and a provider-agnostic `useConsentStore()` composable. A **consent adapter** maps a concrete CMP into that store. Other Laioutr features (tracking, GTM) read the store too, so a single source of truth gates every consented behaviour in the frontend.

```ts
const consentStore = useConsentStore();

if (consentStore.hasCategoryConsent('statistics')) {
  loadHeatmapScript();
}
```

The store lives in `@laioutr-core/frontend-core`. Your Nuxt app must include the module so `useConsentStore()` and the `#frontend/consent` types are available.

## The five consent categories

Every adapter normalises its CMP's categories into this fixed shape, so the rest of the app only deals with one model:

| Category       | Typical use                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| `necessary`    | Essential cookies (session, security, CSRF). Always `true`, not user-toggleable. |
| `functional`   | Preferences and functionality (language, cart, recently viewed).                 |
| `statistics`   | Analytics and performance (GA, heatmaps, session replay).                        |
| `marketing`    | Advertising and personalisation (ad pixels, retargeting).                        |
| `unclassified` | Anything that does not fit the above.                                            |

The store keeps a single `state` object with these five booleans. Whenever the user accepts or revokes a category in the CMP, the active adapter pushes the change into the store, and `state` updates reactively.

## Using the consent store

`useConsentStore()` is a global state created with VueUse's `createGlobalState`. Auto-imported by `frontend-core`, you can call it from any component, composable, or plugin.

The methods you will use most:

| Method                         | What it does                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `state`                        | Readonly reactive `ConsentManagementState`. Watch it to react to consent changes.                                         |
| `hasCategoryConsent(category)` | Returns `true` if the category is granted by the active adapter. With no adapter active, only `necessary` returns `true`. |
| `showConsentOverlay()`         | Reopens the CMP banner. Wire this to a "Cookie preferences" link.                                                         |
| `renewConsent()`               | Opens the detailed preferences dialog so the user can revisit individual categories.                                      |
| `onConsentChange(callback)`    | Registers a watcher on the store state. The callback receives the full `ConsentManagementState` whenever it changes.      |

A typical "Cookie preferences" footer link:

```vue
<script setup lang="ts">
const consentStore = useConsentStore();
</script>

<template>
  <button type="button" @click="consentStore.showConsentOverlay()">
    Cookie preferences
  </button>
</template>
```

Reacting to consent changes outside a template (for example, lazy-loading a chat widget once the user accepts marketing):

```ts
const consentStore = useConsentStore();

consentStore.onConsentChange((consent) => {
  if (consent.marketing) {
    loadChatWidget();
  }
});
```

## How other features read consent

The store is consumed across the platform, not just by your code:

- The [analytics layer](/frontend/features/tracking) gates delivery per destination. A destination declares `consent: { purposes: ['analytics'] }`, and the bus only hands it an event once that purpose is granted. Purposes resolve from these categories: `analytics` reads `statistics`, and both `advertising` and `personalization` read `marketing`. Read them directly with `hasPurposeConsent('analytics')` or `getPurposeConsents()`.
- The [GTM app](/apps/app-docs/gtm) sets Google Consent Mode v2 defaults to `denied` inline in the head, before `gtm.js` loads, then sends an update once the visitor has actually answered — not when the CMP merely reports its default.

This means once a CMP adapter is active and the user has accepted analytics, GA fires through GTM without any further wiring in your app.

## Ready-to-use consent apps

There already are a few standalone Laioutr apps that register a `ConsentAdapter` for you: the [Cookiebot app](/apps/app-docs/cookiebot) and the [CCM19 app](/apps/app-docs/ccm19). Add the module, set the credentials, and the store and tracking/GTM consent are wired up.

## Building your own consent adapter

If you need a CMP that is not on the list (OneTrust, CookieYes, an in-house solution), you can build a Laioutr app that registers a `ConsentAdapter` with the store. The full contract, plugin boilerplate, and worked examples drawn from the Cookiebot and CCM19 sources live in [Consent Adapters](/apps/app-development/consent-adapters) under app development.

## Summary

- One store, five categories, one set of methods. Write your code against `useConsentStore()` and stop caring about which CMP is behind it.
- Use `hasCategoryConsent(category)` to gate behaviour, `onConsentChange` to react, and `showConsentOverlay` / `renewConsent` for "Cookie preferences" UI.
- Drop in [Cookiebot](/apps/app-docs/cookiebot) or [CCM19](/apps/app-docs/ccm19) for ready-to-use providers, or build your own following the [Consent Adapters](/apps/app-development/consent-adapters) guide.
