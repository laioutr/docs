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

The `@laioutr-app/ccm19` package wires [CCM19](https://www.ccm19.de/) into a Laioutr-powered Nuxt app as a [consent adapter](/frontend/features/consent-management). On install, a client plugin builds an adapter with `createCcm19Adapter()` and installs it on `useConsentStore()` from `@laioutr-core/frontend-core`. The adapter loads the CCM19 widget, listens to its consent events, and translates CCM19's purpose IDs into Laioutr's `ConsentState`.

CCM19 organises consent by **purposes** rather than fixed categories, which is the same shape Laioutr uses. Each purpose has a 7-character hex ID (visible in the CCM19 admin UI or on `event.detail.purpose` in the widget's events). The adapter ships with a `purposeMapping` for CCM19's built-in purposes, override it to handle admin-defined purposes.

## Configuration requirements

The module expects configuration under the key `@laioutr-app/ccm19` in `nuxt.config.ts` (or via `runtimeConfig`). Three options are required. Two have defaults.

### Module options

| Option           | Type                              | Description                                                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serverUrl`      | `string`                          | The CCM19 server URL. For cloud-hosted instances this is typically `https://cloud.ccm19.de`; for self-hosted installations use your own server URL.                                                                                                                               |
| `apiKey`         | `string`                          | The API key from the CCM19 dashboard. Find it in the integration/embed code section of your CCM19 domain configuration.                                                                                                                                                           |
| `domainId`       | `string`                          | The domain-specific ID number from CCM19. Also found in the integration/embed code section.                                                                                                                                                                                       |
| `lang`           | `string | undefined`              | Optional locale override (e.g. `de_DE`, `en_US`). If omitted, CCM19 auto-detects the language. Default: `undefined`.                                                                                                                                                              |
| `purposeMapping` | `Record<string, AnalyticsPurpose[]>` | Mapping from CCM19 **purpose IDs** (7-char hex) to the Laioutr purposes each one grants. Direct lookup, no case folding. Values are drawn from `necessary`, `functional`, `analytics`, `advertising`, `personalization`. An ID may grant several. The default mapping covers CCM19's built-in purposes (see below). |

### Default purpose mapping

The module ships with the IDs of CCM19's built-in purposes, under the names CCM19's own [Hosting API](https://docs-en.ccm19.com/agency-version/hosting-api/components/) gives them:

| CCM19 Purpose ID | CCM19 Purpose         | Grants            |
| ---------------- | --------------------- | ----------------- |
| `41ba25c`        | Technically Necessary | `necessary`       |
| `cdcbd7c`        | Advertising / Ads     | `advertising`     |
| `a717ff5`        | Analytics / Statistics| `analytics`       |
| `7c19e32`        | Personalization       | `personalization` |
| `6cd2721`        | Social Media          | `functional`      |
| `15c61c3`        | Other                 | —                 |

Two of these need explaining. **Social Media** covers embeds and share buttons — a site feature the visitor asked for — so it grants `functional`, which is also the only way a CCM19 site can grant that purpose, since CCM19 has no preference purpose of its own. Granting `advertising` from it instead would report a visitor who accepted a video embed as having accepted ad storage.

**Other** is CCM19's catch-all and grants nothing: what it covers is whatever a given operator put there, so no purpose follows from it. If you use it, map it yourself.

An accepted purpose ID with nothing mapped to it grants nothing and logs a warning naming the ID. To map admin-defined purposes from your CCM19 dashboard, find the ID on `event.detail.purpose` and add an entry to `purposeMapping`.

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
    //   '41ba25c': ['necessary'],  // built-in (kept as default)
    //   'abc1234': ['analytics'],  // your custom purpose ID
    // },
  },
});
```

Use environment variables for `serverUrl`, `apiKey`, and `domainId` in production; the values are public so they can be exposed to the client.

::warning
Setting `purposeMapping` replaces the default mapping. To extend rather than replace, spread `DEFAULT_PURPOSE_MAPPING`:

```ts
import { DEFAULT_PURPOSE_MAPPING } from '@laioutr-app/ccm19';

purposeMapping: { ...DEFAULT_PURPOSE_MAPPING, abc1234: ['analytics'] },
```
::

### Runtime behaviour

The client plugin reads `runtimeConfig.public['@laioutr-app/ccm19']`, builds the adapter with `createCcm19Adapter(config)`, and installs it via `useConsentStore().setAdapter(adapter)`. In `setup()` the adapter:

1. Injects an inline bootstrap script into the SSR `<head>` (with `tagPriority: 1`) that runs at HTML parse and accumulates purpose IDs from `ccm19CookieAccepted` and `ccm19EmbeddingAccepted` events into `window.__CCM19Purposes`. This catches the event storm CCM19 fires during its own init, before any client-side plugin can attach.
2. Injects the CCM19 script (`{serverUrl}/app.js?apiKey=...&domain=...&lang=...`) with `referrerpolicy="origin"`.
3. On the client, listens to `ccm19WidgetLoaded` and `ccm19WidgetClosed`. Each event reads `window.__CCM19Purposes`, looks each ID up in `purposeMapping`, and reports every purpose it maps to. An ID with nothing mapped grants nothing and logs a warning naming it. If `window.CCM.fullConsentGiven` is `true`, every purpose is reported granted. If the widget global is already present when `setup()` runs, it reports once immediately.

On the server, where neither `window.CCM` nor the cookie is parseable, nothing is reported and consumers see the denied baseline (`necessary: true`, others `false`) until the client corrects it.

`openConsentUi()` calls `window.CCM.openWidget()`; `openConsentUi('preferences')` calls `window.CCM.openControlPanel()` (the granular preferences dialog). The cleanup function `setup()` returns removes both event listeners.

For the full adapter contract and how to wire equivalent methods for another CMP, see the [Consent Adapters](/apps/app-development/consent-adapters) guide.

## What it integrates with

The CCM19 widget renders the consent banner and stores the user's choices server-side under a UCID. Once the adapter is active, anything that reads `useConsentStore()` respects those choices: your own `hasPurposeConsent('analytics')` checks, the [analytics layer's](/frontend/features/tracking) per-destination `consent: { purposes: […] }` gate, and the [GTM app's](/apps/app-docs/gtm) Google Consent Mode `gtag('consent', 'update', ...)` calls.

For the consumer-facing API (`useConsentStore`, `openConsentUi`, `onConsentChange`) see the [Consent Management feature](/frontend/features/consent-management).

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
- Use `useConsentStore()` and `hasPurposeConsent()` to gate behaviour; see the [Consent Management feature](/frontend/features/consent-management) for the consumer-facing API.

## Changelog

The package's `CHANGELOG.md` is the source of truth for release notes. There is no public repository under the [Laioutr GitHub organisation](https://github.com/orgs/laioutr/repositories?q=&type=public) yet; once one is published, that repo's `CHANGELOG.md` will be the canonical reference.
