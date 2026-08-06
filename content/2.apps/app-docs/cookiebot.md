---
title: Cookiebot
description: Developer documentation for the Laioutr Cookiebot app package. Add Cookiebot cookie consent management to your Nuxt app via the Laioutr consent store.
seo:
  title: Cookiebot
  description: Developer documentation for the Laioutr Cookiebot app package. Add Cookiebot cookie consent management to your Nuxt…
sitemap:
  loc: /apps/app-docs/cookiebot
  lastmod: 2026-04-27
  changefreq: monthly
  priority: 1.0

---

## Overview

The `@laioutr-app/cookiebot` package wires [Cookiebot](https://www.cookiebot.com/) into a Laioutr-powered Nuxt app as a [consent adapter](/frontend/features/consent-management). On install, a client plugin registers a `CookiebotAdapter` with `useConsentStore()` from `@laioutr-core/frontend-core`. The adapter injects the Cookiebot script, reads the `CookieConsent` cookie, maps Cookiebot's four categories to Laioutr's `ConsentManagementState`, and forwards consent changes to the store.

Only `cbid` is required. `consentMode` and `consentModeDefaults` toggle Google Consent Mode v2 integration. The module installs `@laioutr-core/frontend-core` on prepare.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/cookiebot`** in `nuxt.config.ts` (or via `runtimeConfig`). One option is required; two have defaults.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`cbid`** | `string` | Cookiebot domain group ID (CBID). Used to load the Cookiebot script from `https://consent.cookiebot.com/uc.js?cbid={cbid}`. Find it in your Cookiebot dashboard. |
| **`consentMode`** | `boolean` | Enable Google Consent Mode v2. When `true`, the script attribute is omitted and Cookiebot's default behaviour applies (Consent Mode active). When `false`, the script tag gets `data-consentmode="disabled"`. Default: `true`. |
| **`consentModeDefaults`** | `boolean` | Enable Cookiebot's default Consent Mode state. When `true`, the script attribute is omitted and Cookiebot's default applies. When `false`, the script tag gets `data-consentmode-defaults="disabled"`. Default: `true`. |

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

### Runtime behaviour

The client plugin reads `runtimeConfig.public['@laioutr-app/cookiebot']`, instantiates `CookiebotAdapter`, and activates it with `useConsentStore()`. On `init()` the adapter injects the Cookiebot script via `useHead`, sets up `useCookie('CookieConsent')`, and on the client listens for `CookiebotOnLoad` to forward consent updates.

Cookiebot's categories map to Laioutr's `ConsentManagementState` as follows: `necessary` → `necessary`, `preferences` → `functional`, `statistics` → `statistics`, `marketing` → `marketing`. `unclassified` is always `false`. Because the cookie is readable through `useCookie`, `getConsentState()` works on the server and the first SSR render reflects the user's choice with no flash.

`showConsentOverlay()` and `renewConsent()` call `window.Cookiebot.show()` and `window.Cookiebot.renew()`. For the full adapter contract and how to wire equivalent methods for another CMP, see the [Consent Adapters](/apps/app-development/consent-adapters) guide.

## What it integrates with

The Cookiebot script renders the consent banner and stores the user's choices in the `CookieConsent` cookie. Once the adapter is active, anything that reads `useConsentStore()` respects those choices: your own `hasCategoryConsent('statistics')` checks, the [analytics layer's](/frontend/features/tracking) per-destination `consent: { purposes: […] }` gate, and the [GTM app's](/apps/app-docs/gtm) Google Consent Mode `gtag('consent', 'update', ...)` calls.

For the consumer-facing API (`useConsentStore`, `showConsentOverlay`, `onConsentChange`) see the [Consent Management feature](/frontend/features/consent-management).

## Backend requirements

- A Cookiebot account at [cookiebot.com](https://www.cookiebot.com/), with your domain configured and a CBID issued for it.
- `@laioutr-core/frontend-core` installed in the host app (the Cookiebot module installs it on prepare, so just ensure the app does not strip it).

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **CookieConsent** | Set by the Cookiebot script. Contains the user’s consent choices (necessary, preferences, statistics, marketing, method, region, stamp, etc.). The adapter reads it to provide **getConsentState()**. |

## Summary checklist

- Add **@laioutr-app/cookiebot** to Nuxt modules.
- Set **cbid** (and optionally **consentMode**, **consentModeDefaults**) under `@laioutr-app/cookiebot` (e.g. from env).
- Ensure your Cookiebot domain group is configured and the CBID matches.
- Use the consent store (e.g. **useConsentStore()**, **hasCategoryConsent**) in your app or in other apps (e.g. GTM) to gate scripts based on consent.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
