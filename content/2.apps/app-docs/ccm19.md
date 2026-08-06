---
title: CCM19
description: Developer documentation for the Laioutr CCM19 app package. Add CCM19 cookie consent management to your Nuxt app via the Laioutr consent store.
seo:
  title: CCM19
  description: Developer documentation for the Laioutr CCM19 app package. Add CCM19 cookie consent management to your Nuxt app via the Laioutr consent store.
sitemap:
  loc: /apps/app-docs/ccm19
  lastmod: 2026-04-27
  changefreq: monthly
  priority: 1
---

## Overview

The `@laioutr-app/ccm19` package wires [CCM19](https://www.ccm19.de/) into a Laioutr-powered Nuxt app as a [consent adapter](/frontend/features/consent-management). On install, a client plugin registers a `CCM19Adapter` with `useConsentStore()` from `@laioutr-core/frontend-core`. The adapter loads the CCM19 widget, listens to its consent events, and translates CCM19's purpose IDs into Laioutr's `ConsentManagementState`.

CCM19 organises consent by **purposes** rather than fixed categories. Each purpose has a 7-character hex ID (visible in the CCM19 admin UI or on `event.detail.purpose` in the widget's events). The adapter ships with a `purposeMapping` for CCM19's standard built-in purposes, override it to handle admin-defined purposes.

## Configuration requirements

The module expects configuration under the key `@laioutr-app/ccm19` in `nuxt.config.ts` (or via `runtimeConfig`). Three options are required. Two have defaults.

### Module options

| Option           | Type                              | Description                                                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serverUrl`      | `string`                          | The CCM19 server URL. For cloud-hosted instances this is typically `https://cloud.ccm19.de`; for self-hosted installations use your own server URL.                                                                                                                               |
| `apiKey`         | `string`                          | The API key from the CCM19 dashboard. Find it in the integration/embed code section of your CCM19 domain configuration.                                                                                                                                                           |
| `domainId`       | `string`                          | The domain-specific ID number from CCM19. Also found in the integration/embed code section.                                                                                                                                                                                       |
| `lang`           | `string | undefined`              | Optional locale override (e.g. `de_DE`, `en_US`). If omitted, CCM19 auto-detects the language. Default: `undefined`.                                                                                                                                                              |
| `purposeMapping` | `Record<string, ConsentCategory>` | Mapping from CCM19 **purpose IDs** (7-char hex) to Laioutr consent categories. Direct lookup, no case folding. Values are one of `necessary`, `functional`, `statistics`, `marketing`, `unclassified`. The default mapping covers CCM19's built-in standard purposes (see below). |

### Default purpose mapping

The module ships with the canonical IDs of CCM19's built-in standard purposes (stable across CCM19 versions):

| CCM19 Purpose ID | CCM19 Purpose | Laioutr Category |
| ---------------- | ------------- | ---------------- |
| `41ba25c`        | Necessary     | `necessary`      |
| `7c19e32`        | Preference    | `functional`     |
| `a717ff5`        | Statistics    | `statistics`     |
| `6cd2721`        | Marketing     | `marketing`      |
| `15c61c3`        | Unclassified  | `unclassified`   |

Purposes whose IDs are not in the mapping flip Laioutr's `unclassified` to `true`. To map admin-defined purposes from your CCM19 dashboard, find the ID on `event.detail.purpose` and add an entry to `purposeMapping`.

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
    // Override or extend purpose mapping for admin-defined purposes:
    // purposeMapping: {
    //   '41ba25c': 'necessary',  // built-in (kept as default)
    //   'abc1234': 'statistics', // your custom purpose ID
    // },
  },
});
```

Use environment variables for `serverUrl`, `apiKey`, and `domainId` in production; the values are public so they can be exposed to the client.

::warning
Setting `purposeMapping` replaces the default mapping. To extend rather than replace, copy the default IDs from the table above into your override.
::

### Runtime behaviour

The client plugin reads `runtimeConfig.public['@laioutr-app/ccm19']`, instantiates `CCM19Adapter`, and activates it with `useConsentStore()`. On `init()` the adapter:

1. Injects an inline bootstrap script into the SSR `<head>` (with `tagPriority: 1`) that runs at HTML parse and accumulates purpose IDs from `ccm19CookieAccepted` and `ccm19EmbeddingAccepted` events into `window.__CCM19Purposes`. This catches the event storm CCM19 fires during its own init, before any client-side plugin can attach.
2. Injects the CCM19 script (`{serverUrl}/app.js?apiKey=...&domain=...&lang=...`) with `referrerpolicy="origin"`.
3. On the client, listens to `ccm19WidgetLoaded` and `ccm19WidgetClosed` and pushes the current state to registered consent-change callbacks.

`getConsentState()` reads `window.__CCM19Purposes`, looks each ID up in `purposeMapping`, and grants the matching category (or `unclassified` for unmapped IDs). If `window.CCM.fullConsentGiven` is `true`, all categories are granted. On the server, where neither `window.CCM` nor the cookie is parseable, `getConsentState()` returns the denied baseline (`necessary: true`, others `false`).

`showConsentOverlay()` calls `window.CCM.openWidget()`. `renewConsent()` calls `window.CCM.openControlPanel()` (the granular preferences dialog). `destroy()` removes all event listeners and clears callbacks.

For the full adapter contract and how to wire equivalent methods for another CMP, see the [Consent Adapters](/apps/app-development/consent-adapters) guide.

## What it integrates with

The CCM19 widget renders the consent banner and stores the user's choices server-side under a UCID. Once the adapter is active, anything that reads `useConsentStore()` respects those choices: your own `hasCategoryConsent('statistics')` checks, the [analytics layer's](/frontend/features/tracking) per-destination `consent: { purposes: […] }` gate, and the [GTM app's](/apps/app-docs/gtm) Google Consent Mode `gtag('consent', 'update', ...)` calls.

For the consumer-facing API (`useConsentStore`, `showConsentOverlay`, `onConsentChange`) see the [Consent Management feature](/frontend/features/consent-management).

## Backend requirements

- A CCM19 account at [ccm19.de](https://www.ccm19.de/) (cloud or self-hosted), with your domain configured and an API key + domain ID issued for it.
- `@laioutr-core/frontend-core` installed in the host app (the CCM19 module installs it on prepare, so just ensure the app does not strip it).

## Google Consent Mode v2

CCM19's Google Consent Mode integration is configured **directly in the CCM19 dashboard**, not via module options. Enable the relevant consent types (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) in the CCM19 embedding settings for your Google integrations.

## Server-side rendering

The first SSR render uses the denied baseline. The client overrides it once CCM19 reports in.

## Summary checklist

- Add `@laioutr-app/ccm19` to Nuxt modules.
- Set `serverUrl`, `apiKey`, and `domainId` (and optionally `lang`, `purposeMapping`) under `@laioutr-app/ccm19`, ideally from env.
- If your CCM19 dashboard defines custom purposes, find their IDs (`event.detail.purpose` or the admin UI) and extend `purposeMapping`.
- Use `useConsentStore()` and `hasCategoryConsent()` to gate behaviour; see the [Consent Management feature](/frontend/features/consent-management) for the consumer-facing API.

## Changelog

The package's `CHANGELOG.md` is the source of truth for release notes. There is no public repository under the [Laioutr GitHub organisation](https://github.com/orgs/laioutr/repositories?q=&type=public) yet; once one is published, that repo's `CHANGELOG.md` will be the canonical reference.
