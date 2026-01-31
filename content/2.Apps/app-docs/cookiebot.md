---
title: Cookiebot
description: Developer documentation for the Laioutr Cookiebot app package. Add Cookiebot cookie consent management to your Nuxt app via the Laioutr consent store.
---

## Overview

The **@laioutr-app/cookiebot** package integrates [Cookiebot](https://www.cookiebot.com/) into a Laioutr-powered Nuxt app for cookie consent management. It does not register any orchestr handlers; instead it adds a **client plugin** that registers a **CookiebotAdapter** with the Laioutr consent store (from **@laioutr-core/frontend-core**). The adapter loads the Cookiebot script, reads the consent cookie, maps Cookiebot’s categories to Laioutr’s **ConsentManagementState**, and exposes methods to show/renew the consent overlay and to check or react to consent changes.

Configuration is minimal: **cbid** (Cookiebot domain group ID) is required; **consentMode** and **consentModeDefaults** are optional and control Google Consent Mode v2 integration. All options are exposed in **public** runtime config so the client plugin can read them. The module installs **@laioutr-core/frontend-core** on prepare.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/cookiebot`** in `nuxt.config.ts` (or via `runtimeConfig`). One option is required; two have defaults.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`cbid`** | `string` | Cookiebot domain group ID (CBID). Used to load the Cookiebot script from `https://consent.cookiebot.com/uc.js?cbid={cbid}`. Find it in your Cookiebot dashboard. |
| **`consentMode`** | `boolean` | Enable Google Consent Mode v2. When `true`, the script tag gets `data-consentmode` (Cookiebot default). When `false`, the script gets `data-consentmode="disabled"`. Default: `true`. |
| **`consentModeDefaults`** | `boolean` | Enable default consent state for Google Consent Mode. When `true`, Cookiebot default applies. When `false`, the script gets `data-consentmode-defaults="disabled"`. Default: `true`. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/cookiebot'],
  '@laioutr-app/cookiebot': {
    cbid: process.env.COOKIEBOT_CBID!,
    consentMode: true,
    consentModeDefaults: true,
  },
});
```

Use an environment variable for **cbid** in production if you prefer not to hardcode it; the value is public so it can be exposed to the client.

### Runtime behavior

- **Plugin**  
  The package adds a Nuxt plugin that runs on the client: it reads public runtime config for `@laioutr-app/cookiebot`, creates a **CookiebotAdapter** with that config, registers it with **useConsentStore()**, and activates it. The consent store is from **@laioutr-core/frontend-core**; other adapters or UI can use the same store.

- **Adapter init**  
  When the adapter is initialised it: (1) Injects the Cookiebot script via **useHead** with `data-blockingmode="auto"` and optional `data-consentmode` / `data-consentmode-defaults`. (2) Sets up **useCookie** for the **CookieConsent** cookie (decode parses Cookiebot’s JSON shape). (3) On the client, listens for **CookiebotOnLoad** and maps **window.Cookiebot.consent** to **ConsentManagementState** and notifies registered callbacks.

- **Consent mapping**  
  Cookiebot categories are mapped to Laioutr’s consent state: **necessary** → necessary, **preferences** → functional, **statistics** → statistics, **marketing** → marketing; **unclassified** is set to `false`. **getConsentState()** returns this shape from the cookie or from **window.Cookiebot.consent** when available.

- **Adapter methods**  
  **showConsentOverlay()** calls **window.Cookiebot.show()**. **renewConsent()** calls **window.Cookiebot.renew()**. **hasCategoryConsent(category)** returns whether the given category is granted. **onConsentChange(callback)** registers a callback that is invoked when consent is updated (e.g. after CookiebotOnLoad).

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It only adds Cookiebot as a **consent adapter** for the Laioutr consent store.

- **Consent management** – The Cookiebot script displays the consent banner and stores the user’s choices in the **CookieConsent** cookie. The adapter exposes consent state (necessary, functional, statistics, marketing) so other parts of your app (e.g. analytics, marketing scripts) can respect it. Use the consent store’s **hasCategoryConsent** or the adapter’s **showConsentOverlay** / **renewConsent** as needed.

## Backend requirements

- **Cookiebot account** – Sign up at [Cookiebot](https://www.cookiebot.com/) and add your domain. Obtain the **CBID** (domain group ID) from the dashboard and configure the scanner/banner as needed.
- **@laioutr-core/frontend-core** – The consent store and **ConsentAdapter** type come from frontend-core; ensure the app has this module so the adapter can register and be used by other features (e.g. GTM, analytics).

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **CookieConsent** | Set by the Cookiebot script. Contains the user’s consent choices (necessary, preferences, statistics, marketing, method, region, stamp, etc.). The adapter reads it to provide **getConsentState()**. |

## Summary checklist

- Add **@laioutr-app/cookiebot** to Nuxt modules.
- Set **cbid** (and optionally **consentMode**, **consentModeDefaults**) under `@laioutr-app/cookiebot` (e.g. from env).
- Ensure your Cookiebot domain group is configured and the CBID matches.
- Use the consent store (e.g. **useConsentStore()**, **hasCategoryConsent**) in your app or in other apps (e.g. GTM) to gate scripts based on consent.
