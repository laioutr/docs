---
title: Google Tag Manager (GTM)
description: Developer documentation for the Laioutr GTM app package. Add Google Tag Manager to your Nuxt app with consent integration and a tracking adapter for the Laioutr tracking store.
seo:
  title: Google Tag Manager (GTM)
  description: Developer documentation for the Laioutr GTM app package. Add Google Tag Manager to your Nuxt app with consent…
sitemap:
  loc: /apps/app-docs/gtm
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/gtm** package integrates [Google Tag Manager](https://tagmanager.google.com/) (GTM) into a Laioutr-powered Nuxt app. It does not register any orchestr handlers; instead it (1) injects the GTM script and noscript iframe into the app head, (2) adds a **client plugin** that initialises the data layer, sets **Google Consent Mode v2** defaults and updates them from the Laioutr consent store, and (3) registers a **tracking adapter** with the Laioutr tracking store (from **@laioutr-core/frontend-core**) so events pushed to the tracking store are forwarded to the GTM data layer.

Configuration is minimal: **containerId** (GTM container ID, e.g. `GTM-XXXXXX`) is required; **layer** (data layer variable name) is optional and defaults to `dataLayer`. Both options are in **public** runtime config. The module installs **@laioutr-core/frontend-core** on prepare so the consent and tracking stores are available.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/gtm`** in `nuxt.config.ts` (or via `runtimeConfig`). One option is required; one has a default.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`containerId`** | `string` | Google Tag Manager container ID (e.g. `GTM-XXXXXX`). Used in the script URL `https://www.googletagmanager.com/gtm.js?id={containerId}&l={layer}` and in the noscript iframe. Find it in your GTM container settings. |
| **`layer`** | `string` | Name of the data layer variable on `window`. Default: `dataLayer`. If you use a custom data layer name in GTM, set it here so the script and plugin use the same variable. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/gtm'],
  '@laioutr-app/gtm': {
    containerId: process.env.GTM_CONTAINER_ID!,
    layer: 'dataLayer',
  },
});
```

Use an environment variable for **containerId** in production if you prefer not to hardcode it; the value is public so it can be exposed to the client.

### Runtime behavior

- **Head injection**  
  The module adds to **nuxt.options.app.head**: (1) A script tag with `src` pointing to `https://www.googletagmanager.com/gtm.js?id={containerId}&l={layer}` (async). (2) A noscript tag containing the GTM iframe (`https://www.googletagmanager.com/ns.html?id={containerId}`) for users with JavaScript disabled.

- **Client plugin**  
  The plugin runs only on the client. It: (1) Ensures `window[layer]` exists (e.g. `window.dataLayer = window.dataLayer || []`). (2) Pushes `{ 'gtm.start': timestamp, event: 'gtm.js' }` to the data layer so GTM loads. (3) Sets **Google Consent Mode v2** default state via `gtag('consent', 'default', { ... })`: **ad_storage**, **analytics_storage**, **functionality_storage**, **personalization_storage** are `denied`; **security_storage** is `granted`; **wait_for_update** is `500`. (4) Subscribes to **useConsentStore().activeAdapter** consent changes: when **statistics** is granted, it pushes `consent update` with **analytics_storage** and **functionality_storage** granted; when **marketing** is granted, it pushes **ad_storage** and **personalization_storage** granted. (5) Registers a **tracking adapter** with **useTrackingStore()**: the adapter’s **track(event)** pushes `{ event: event.eventName, ...event.payload }` to the data layer. Other parts of your app (or other apps) can use the tracking store to send events; GTM receives them and can fire tags accordingly.

- **Consent integration**  
  For consent updates to apply, a consent adapter (e.g. **@laioutr-app/cookiebot**) must be registered and activated so **consentStore.activeAdapter** exists and **onConsentChange** is called when the user accepts or revokes categories. If no consent adapter is active, the default “denied” state remains until you update consent manually.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It adds GTM to the page and connects it to the Laioutr consent and tracking stores.

- **GTM container** – The GTM script and noscript iframe load your container. Configure tags, triggers, and variables in the GTM UI; the package only provides the data layer and consent updates.
- **Consent Mode** – Default consent is “denied” for ad, analytics, functionality, and personalization; when the user consents via the active consent adapter, the plugin pushes the corresponding `consent update` so Google tags (e.g. GA4, Ads) can respect consent.
- **Tracking adapter** – Events sent through the Laioutr tracking store (e.g. **useTrackingStore().track(...)**) are pushed to the GTM data layer with `event` and the event payload. Use GTM triggers to react to these event names and payloads.

## Backend requirements

- **Google Tag Manager account** – Create a GTM container and note the **container ID** (e.g. `GTM-XXXXXX`). Configure your tags (e.g. GA4, conversion tracking) and triggers in the GTM UI.
- **@laioutr-core/frontend-core** – The consent store and tracking store come from frontend-core; ensure the app has this module. For consent-driven updates, also use a consent adapter (e.g. **@laioutr-app/cookiebot**).

## Cookies and context

This package does not set or read cookies itself. GTM and the tags you configure in it (e.g. GA4) may set their own cookies; consent updates pushed by this package help those tags respect user consent when using Consent Mode.

## Summary checklist

- Add **@laioutr-app/gtm** to Nuxt modules.
- Set **containerId** (and optionally **layer**) under `@laioutr-app/gtm` (e.g. from env).
- Optionally add a consent adapter (e.g. **@laioutr-app/cookiebot**) so Consent Mode updates are applied when the user accepts or revokes categories.
- Use the tracking store (e.g. **useTrackingStore().track({ eventName, payload })**) in your app or in other apps to send events to GTM.
- Configure tags and triggers in the GTM container to react to data layer events and consent state.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
