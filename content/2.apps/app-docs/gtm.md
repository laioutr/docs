---
title: Google Tag Manager (GTM)
description: Developer documentation for the Laioutr GTM app package. Add Google Tag Manager to your Nuxt app with Consent Mode v2 and an analytics destination that maps canonical events to the data layer.
seo:
  title: Google Tag Manager (GTM)
  description: Developer documentation for the Laioutr GTM app package. Add Google Tag Manager to your Nuxt app with Consent Mode…
sitemap:
  loc: /apps/app-docs/gtm
  lastmod: 2026-08-06
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/gtm** package integrates [Google Tag Manager](https://tagmanager.google.com/) (GTM) into a Laioutr-powered Nuxt app. It does not register any orchestr handlers; instead it (1) emits an inline head bootstrap that sets the **Google Consent Mode v2** denied default before `gtm.js` loads, (2) injects the GTM script and noscript iframe, (3) sends a Consent Mode update once the visitor answers the banner, and (4) registers an [analytics destination](/frontend/features/tracking) that maps canonical events to GA4 names and pushes them to the data layer.

Configuration is minimal: **containerId** is required; **layer** (data layer variable name) and **consentUpdates** are optional. All options are in **public** runtime config. The module installs **@laioutr-core/frontend-core** on prepare so the consent store and analytics bus are available.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/gtm`** in `nuxt.config.ts` (or via `runtimeConfig`). One option is required; one has a default.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`containerId`** | `string \| Record<string, string>` | Google Tag Manager container ID (e.g. `GTM-XXXXXX`). A string installs one container for every market; a record maps each market id to its own container, and a market absent from the record gets no container at all. Used in the script URL `https://www.googletagmanager.com/gtm.js?id={containerId}&l={layer}` and in the noscript iframe. |
| **`layer`** | `string` | Name of the data layer variable on `window`. Default: `dataLayer`. If you use a custom data layer name in GTM, set it here so the script and plugin use the same variable. |
| **`consentUpdates`** | `'store' \| 'external'` | Who pushes `gtag('consent', 'update', …)`. Default `'store'` drives it from the Laioutr consent store. Set `'external'` when your CMP emits Consent Mode itself, so the two do not race for the same signals — the inline denied default stays ours either way. |

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
  The module adds to **nuxt.options.app.head**, in this order: (1) An **inline bootstrap script** that creates `window[layer]`, defines `gtag`, sets the Consent Mode v2 default, and pushes `{ 'gtm.start': timestamp, event: 'gtm.js' }`. (2) The async `gtm.js` script tag. (3) A noscript tag containing the GTM iframe (`https://www.googletagmanager.com/ns.html?id={containerId}`) for users with JavaScript disabled.

  The bootstrap is inline and first **deliberately**: the default has to be registered before the Google tag initializes, or tags fire unconsented in the gap. It sets `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`, `functionality_storage` and `personalization_storage` to `denied`; `security_storage` to `granted`; `wait_for_update` to `500`; plus `ads_data_redaction: true` and `url_passthrough: false`.

- **Consent updates**  
  With the default `consentUpdates: 'store'`, a client plugin watches the consent store and sends **one complete** `gtag('consent', 'update', …)` carrying all six consent-gated signals — so a revocation is transmitted as faithfully as a grant.

  The update is held until the visitor has **actually answered**. A CMP that activates on page load reporting its denied default does not trigger one: asserting a refusal nobody made would release the tags `wait_for_update` is holding. A consent adapter that cannot report whether a decision was made still gets updates, since going silent would be worse.

- **Analytics destination**  
  The plugin registers a destination declaring `consent: { purposes: ['analytics'] }`. Canonical event types are mapped to GA4 names — `ecommerce/add_to_cart` becomes `add_to_cart`, while an app-namespaced `acme/quote_requested` becomes `acme_quote_requested` — money is converted from minor to major units per ISO 4217, and product category arrays are flattened to `item_category`…`item_category5`. Nothing is pushed until the `analytics` purpose is granted.

- **Consent integration**  
  For consent updates to apply, a consent adapter (e.g. **@laioutr-app/cookiebot**) must be registered and activated. If no consent adapter is active, the inline denied default stands and no tag storage is released.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It adds GTM to the page and connects it to the Laioutr consent store and analytics bus.

- **GTM container** – The GTM script and noscript iframe load your container. Configure tags, triggers, and variables in the GTM UI; the package only provides the data layer and consent updates.
- **Consent Mode v2** – Every consent-gated signal defaults to `denied` inline in the head; when the visitor answers, the plugin sends one update reflecting the full state so Google tags (GA4, Ads) can respect it.
- **Analytics destination** – Events emitted with `useAnalytics().track(Token, payload)` are mapped to GA4 names and pushed to the data layer once the `analytics` purpose is granted. Use GTM triggers to react to those event names and parameters.

## Backend requirements

- **Google Tag Manager account** – Create a GTM container and note the **container ID** (e.g. `GTM-XXXXXX`). Configure your tags (e.g. GA4, conversion tracking) and triggers in the GTM UI.
- **@laioutr-core/frontend-core** – The consent store and analytics bus come from frontend-core; ensure the app has this module. For consent-driven updates, also use a consent adapter (e.g. **@laioutr-app/cookiebot**).

## Cookies and context

This package does not set or read cookies itself. GTM and the tags you configure in it (e.g. GA4) may set their own cookies; consent updates pushed by this package help those tags respect user consent when using Consent Mode.

## Summary checklist

- Add **@laioutr-app/gtm** to Nuxt modules.
- Set **containerId** (and optionally **layer** and **consentUpdates**) under `@laioutr-app/gtm` (e.g. from env).
- Add a consent adapter (e.g. **@laioutr-app/cookiebot**) so Consent Mode updates are applied when the visitor accepts or revokes. Without one, everything stays denied.
- Emit events with **`useAnalytics().track(Token, payload)`** in your app or in other apps; GTM receives them once the `analytics` purpose is granted. See [Tracking](/frontend/features/tracking).
- Configure tags and triggers in the GTM container to react to data layer events and consent state.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
