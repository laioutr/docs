---
title: CCM19
description: Developer documentation for the Laioutr CCM19 app package. Add CCM19 cookie consent management to your Nuxt app via the Laioutr consent store.
seo:
  title: CCM19 | Laioutr
  description: Developer documentation for the Laioutr CCM19 app package. Add CCM19 cookie consent management to your Nuxt app via the Laioutr consent store.
sitemap:
  loc: /apps/app-docs/ccm19
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/ccm19** package integrates [CCM19](https://www.ccm19.de/) into a Laioutr-powered Nuxt app for cookie consent management. It does not register any orchestr handlers; instead it adds a **client plugin** that registers a **CCM19Adapter** with the Laioutr consent store (from **@laioutr-core/frontend-core**). The adapter loads the CCM19 script, listens to CCM19's widget events, maps CCM19's purpose-based consent model to Laioutr's **ConsentManagementState**, and exposes methods to show/renew the consent overlay and to check or react to consent changes.

Unlike Cookiebot, CCM19 uses user-defined **purposes** (configured in the CCM19 dashboard) rather than fixed consent categories. The adapter provides a configurable **purposeMapping** to translate CCM19 purpose names to Laioutr's five consent categories. Sensible defaults for common German and English purpose names are included.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/ccm19`** in `nuxt.config.ts` (or via `runtimeConfig`). Three options are required; two have defaults.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`serverUrl`** | `string` | The CCM19 server URL. For cloud-hosted instances this is typically `https://cloud.ccm19.de`; for self-hosted installations use your own server URL. |
| **`apiKey`** | `string` | The API key from the CCM19 dashboard. Find it in the integration/embed code section of your CCM19 domain configuration. |
| **`domainId`** | `string` | The domain-specific ID number from CCM19. Also found in the integration/embed code section. |
| **`lang`** | `string \| undefined` | Optional locale override (e.g. `de_DE`, `en_US`). If omitted, CCM19 auto-detects the language. Default: `undefined`. |
| **`purposeMapping`** | `Record<string, ConsentCategory>` | Mapping from CCM19 purpose names to Laioutr consent categories. Keys are purpose strings (case-insensitive matching). Values are one of `necessary`, `functional`, `statistics`, `marketing`, `unclassified`. See default mapping below. |

### Default purpose mapping

The module ships with defaults that cover common German and English CCM19 purpose names:

| CCM19 Purpose | Laioutr Category |
|---------------|-----------------|
| Technisch notwendig / Essential / Essentiell | `necessary` |
| Funktional / Functional | `functional` |
| Statistik / Statistics | `statistics` |
| Marketing | `marketing` |

Purposes not found in the mapping are treated as `unclassified`. Override **purposeMapping** if your CCM19 dashboard uses custom purpose names.

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/ccm19'],
  '@laioutr-app/ccm19': {
    serverUrl: process.env.CCM19_SERVER_URL!,
    apiKey: process.env.CCM19_API_KEY!,
    domainId: process.env.CCM19_DOMAIN_ID!,
    lang: 'de_DE',
    // Override purpose mapping if your CCM19 dashboard uses custom names:
    // purposeMapping: {
    //   'Notwendig': 'necessary',
    //   'Analyse': 'statistics',
    //   'Werbung': 'marketing',
    // },
  },
});
```

Use environment variables for **serverUrl**, **apiKey**, and **domainId** in production; the values are public so they can be exposed to the client.

### Runtime behavior

- **Plugin**
  The package adds a Nuxt plugin that runs on the client: it reads public runtime config for `@laioutr-app/ccm19`, creates a **CCM19Adapter** with that config, registers it with **useConsentStore()**, and activates it. The consent store is from **@laioutr-core/frontend-core**; other adapters or UI can use the same store.

- **Adapter init**
  When the adapter is initialised it: (1) Injects the CCM19 script via **useHead** with `referrerpolicy="origin"`. The script URL follows the pattern `{serverUrl}/app.js?apiKey={apiKey}&domain={domainId}&lang={lang}`. (2) On the client, listens for **ccm19WidgetLoaded** (initial consent state), **ccm19WidgetClosed** (consent saved), **ccm19CookieAccepted**, and **ccm19EmbeddingAccepted** events. (3) Handles late initialization if **window.CCM** is already available when the plugin runs.

- **Consent mapping**
  CCM19 uses purpose-based consent rather than fixed categories. The adapter collects accepted purposes from **ccm19CookieAccepted** and **ccm19EmbeddingAccepted** event details and from **window.CCM.acceptedEmbeddings**. Each purpose is matched (case-insensitive) against **purposeMapping** to produce Laioutr's consent state. If **window.CCM.fullConsentGiven** is `true`, all categories are granted. Unmatched purposes set `unclassified` to `true`.

- **Adapter methods**
  **showConsentOverlay()** calls **window.CCM.openWidget()**. **renewConsent()** calls **window.CCM.openControlPanel()** (the detailed purpose selection dialog). **hasCategoryConsent(category)** returns whether the given category is granted. **onConsentChange(callback)** registers a callback that is invoked when consent is updated. **destroy()** cleans up all event listeners.

- **Server-side rendering**
  CCM19's cookie format is not publicly documented, so the adapter does not parse cookies for SSR. On the server, **getConsentState()** returns the default denied state (`necessary: true`, all others `false`). The consent state is updated on the client after CCM19 loads.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It only adds CCM19 as a **consent adapter** for the Laioutr consent store.

- **Consent management** – The CCM19 script displays the consent banner/widget and stores the user's choices. The adapter exposes consent state (necessary, functional, statistics, marketing, unclassified) so other parts of your app (e.g. analytics, marketing scripts) can respect it. Use the consent store's **hasCategoryConsent** or the adapter's **showConsentOverlay** / **renewConsent** as needed.

## Backend requirements

- **CCM19 account** – Sign up at [CCM19](https://www.ccm19.de/) (cloud or self-hosted). Add your domain, configure the cookie scanner and consent widget, and obtain the **server URL**, **API key**, and **domain ID** from the embed code section.
- **@laioutr-core/frontend-core** – The consent store and **ConsentAdapter** type come from frontend-core; ensure the app has this module so the adapter can register and be used by other features (e.g. GTM, analytics).

## Google Consent Mode v2

Unlike Cookiebot, Google Consent Mode v2 for CCM19 is configured **directly in the CCM19 dashboard**, not via module options. Enable the relevant consent types (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) in the CCM19 embedding settings for your Google integrations. The Laioutr module does not need additional configuration for this.

## Summary checklist

- Add **@laioutr-app/ccm19** to Nuxt modules.
- Set **serverUrl**, **apiKey**, and **domainId** (and optionally **lang**, **purposeMapping**) under `@laioutr-app/ccm19` (e.g. from env).
- Ensure your CCM19 domain is configured and the embed code credentials match.
- Review the purpose names in your CCM19 dashboard and adjust **purposeMapping** if they differ from the defaults.
- Use the consent store (e.g. **useConsentStore()**, **hasCategoryConsent**) in your app or in other apps (e.g. GTM) to gate scripts based on consent.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
