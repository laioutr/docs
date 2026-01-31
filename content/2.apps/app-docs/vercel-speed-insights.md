---
title: Vercel Speed Insights
description: Developer documentation for the Laioutr Vercel Speed Insights app package. Add Vercel Speed Insights to your Nuxt app via a Laioutr page wrapper.
---

## Overview

The **@laioutr/app-vercel-speed-insights** package integrates [Vercel Speed Insights](https://vercel.com/docs/speed-insights) into a Laioutr-powered Nuxt app. It does not register any orchestr handlers; instead it registers a **page wrapper** with Laioutr and adds the official **@vercel/speed-insights** Nuxt component so that real-user performance data is collected on every page rendered through that wrapper.

The package uses **@vercel/speed-insights** under the hood. The wrapper component renders the default slot (your page content) and the `<SpeedInsights />` component from `@vercel/speed-insights/nuxt`, passing an optional **sample rate** from runtime config. The module installs **@laioutr-core/frontend-core** on prepare and registers **VercelSpeedInsightsWrapper** as a global component and as Laioutr’s page wrapper.

## Configuration requirements

The module expects configuration under the key **`@laioutr/app-vercel-speed-insights`** in `nuxt.config.ts` (or via `runtimeConfig`). All options are **optional**; defaults are applied if omitted.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`sampleRate`** | `number` | Fraction of page views to report (0–1). Default: `1` (100%). Lower values reduce data volume. Exposed to the client via public runtime config and passed to `<SpeedInsights :sample-rate="..." />`. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr/app-vercel-speed-insights'],
  '@laioutr/app-vercel-speed-insights': {
    sampleRate: 1, // 100% (default); use e.g. 0.1 for 10%
  },
});
```

### Runtime behavior

- **Page wrapper**  
  The package registers **VercelSpeedInsightsWrapper** with Laioutr via `registerLaioutrApp({ pageWrapper: ["VercelSpeedInsightsWrapper"] })`. When your app uses Laioutr’s layout/page wrapper stack, this wrapper wraps the page and mounts the Vercel Speed Insights Nuxt component (`<SpeedInsights :sample-rate="config.sampleRate ?? 1" />`), so real-user metrics (e.g. Web Vitals) are sent to Vercel.

- **Public runtime config**  
  `sampleRate` is merged into **public** runtime config so the wrapper can read it on the client and pass it to `<SpeedInsights />`.

- **Global component**  
  **VercelSpeedInsightsWrapper** is also registered as a global Nuxt component, so you can use it manually (e.g. `<VercelSpeedInsightsWrapper>...</VercelSpeedInsightsWrapper>`) if you are not relying on Laioutr’s page wrapper for that route.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It only adds Vercel Speed Insights to the client via the page wrapper (or the global component).

- **Speed Insights** – Real-user performance data (e.g. LCP, FID, CLS) is collected and sent to your Vercel project when the wrapper is mounted. Sampling is controlled by **sampleRate**. Configuration and dashboard are handled by the Vercel project and [Vercel’s documentation](https://vercel.com/docs/speed-insights).

## Backend requirements

- **Vercel project** – Deploy your Nuxt app on Vercel (or link it to a Vercel project) and enable Speed Insights in the project dashboard. Data is tied to the Vercel project and environment.
- **@vercel/speed-insights** – The package depends on **@vercel/speed-insights**; no extra backend or API keys are required in the module. Any env or project settings required by Speed Insights apply as per Vercel’s documentation.

## Summary checklist

- Add **@laioutr/app-vercel-speed-insights** to Nuxt modules.
- Optionally set **sampleRate** under `@laioutr/app-vercel-speed-insights` (default 1).
- Ensure your app uses Laioutr’s page wrapper so **VercelSpeedInsightsWrapper** is included in the wrapper stack; or use **VercelSpeedInsightsWrapper** manually where you want Speed Insights.
- Deploy on Vercel and enable Speed Insights in the project settings so data is collected and visible in the dashboard.
