---
title: Vercel Analytics
description: Developer documentation for the Laioutr Vercel Analytics app package. Add Vercel Analytics to your Nuxt app via a Laioutr page wrapper.
seo:
  title: Vercel Analytics
  description: Developer documentation for the Laioutr Vercel Analytics app package. Add Vercel Analytics to your Nuxt app via a…
sitemap:
  loc: /apps/app-docs/vercel-analytics
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr/app-vercel-analytics** package integrates [Vercel Analytics](https://vercel.com/docs/analytics) into a Laioutr-powered Nuxt app. It does not register any orchestr handlers; instead it registers a **page wrapper** with Laioutr and adds the official **@vercel/analytics** Nuxt component so that analytics run on every page rendered through that wrapper.

The package uses **@vercel/analytics** under the hood. The wrapper component renders the default slot (your page content) and the `<Analytics />` component from `@vercel/analytics/nuxt`. The module installs **@laioutr-core/frontend-core** on prepare and registers **VercelAnalyticsPageWrapper** as a global component and as Laioutr’s page wrapper.

## Configuration requirements

The module does not define any required options. You can add the module with no config. The module’s `defaults` include `sampleRate: 1` (100%); if the underlying Vercel Analytics integration reads this in the future, it will be available from the merged options.

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/vercel-analytics'],
  // optional: any module-specific options can go under the config key
  // '@laioutr/app-vercel-analytics': {},
});
```

### Runtime behavior

- **Page wrapper**  
  The package registers **VercelAnalyticsPageWrapper** with Laioutr via `registerLaioutrApp({ pageWrapper: ["VercelAnalyticsPageWrapper"] })`. When your app uses Laioutr’s layout/page wrapper stack, this wrapper wraps the page and mounts the Vercel Analytics Nuxt component (`<Analytics />`), so page views and events are sent to Vercel Analytics.

- **Global component**  
  **VercelAnalyticsPageWrapper** is also registered as a global Nuxt component, so you can use it manually (e.g. `<VercelAnalyticsPageWrapper>...</VercelAnalyticsPageWrapper>`) if you are not relying on Laioutr’s page wrapper for that route.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It only adds Vercel Analytics to the client via the page wrapper (or the global component).

- **Analytics** – Page views and any events tracked by **@vercel/analytics** are sent to your Vercel project when the wrapper is mounted. Configuration (e.g. sampling, env) is handled by the Vercel Analytics Nuxt integration and your Vercel project settings.

## Backend requirements

- **Vercel project** – Deploy your Nuxt app on Vercel (or link it to a Vercel project) and enable Vercel Analytics in the project dashboard. Analytics data is tied to the Vercel project and environment.
- **@vercel/analytics** – The package depends on **@vercel/analytics**; no extra backend or API keys are required in the module. Any env or project settings required by Vercel Analytics apply as per [Vercel’s documentation](https://vercel.com/docs/analytics).

## Summary checklist

- Add **@laioutr/app-vercel-analytics** to Nuxt modules.
- Ensure your app uses Laioutr’s page wrapper so **VercelAnalyticsPageWrapper** is included in the wrapper stack; or use **VercelAnalyticsPageWrapper** manually where you want analytics.
- Deploy on Vercel and enable Vercel Analytics in the project settings so data is collected and visible in the dashboard.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
