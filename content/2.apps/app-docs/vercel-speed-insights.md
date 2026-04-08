---
title: Vercel Speed Insights
description: Developer documentation for the Laioutr Vercel Speed Insights app package. Add Vercel Speed Insights to your Nuxt app via a client plugin.
seo:
  title: Vercel Speed Insights | Laioutr
  description: Developer documentation for the Laioutr Vercel Speed Insights app package. Add Vercel Speed Insights to your Nuxt app…
---

## Overview

The **@laioutr/app-vercel-speed-insights** package integrates [Vercel Speed Insights](https://vercel.com/docs/speed-insights) into a Laioutr-powered Nuxt app. It does not register orchestr handlers. Instead, it adds a **client plugin** that calls Vercel's Nuxt runtime injection API so real-user performance data is collected on client-side page views.

The package uses **@vercel/speed-insights** under the hood and passes an optional **sample rate** from Nuxt public runtime config.

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

- **Client plugin injection**  
  The package registers a client plugin (`speed-insights.client.ts`) and calls `injectSpeedInsights({ sampleRate: config.sampleRate ?? 1 })` from `@vercel/speed-insights/nuxt/runtime`. This injects Speed Insights in the browser runtime without requiring a page wrapper component.

- **Public runtime config**  
  `sampleRate` is merged into **public** runtime config under `@laioutr/app-vercel-speed-insights`, then read by the client plugin.

- **Laioutr app registration**  
  The module still registers itself via `registerLaioutrApp({ name, version })` so the app is discoverable in the Laioutr app ecosystem.

## Capabilities

This package does not provide orchestr queries, actions, links, or resolvers. It only adds Vercel Speed Insights to the client runtime.

- **Speed Insights** – Real-user performance data (e.g. LCP, FID, CLS) is collected and sent to your Vercel project when the wrapper is mounted. Sampling is controlled by **sampleRate**. Configuration and dashboard are handled by the Vercel project and [Vercel’s documentation](https://vercel.com/docs/speed-insights).

## Backend requirements

- **Vercel project** – Deploy your Nuxt app on Vercel (or link it to a Vercel project) and enable Speed Insights in the project dashboard. Data is tied to the Vercel project and environment.
- **@vercel/speed-insights** – The package depends on **@vercel/speed-insights**; no extra backend or API keys are required in the module. Any env or project settings required by Speed Insights apply as per Vercel’s documentation.

## Summary checklist

- Add **@laioutr/app-vercel-speed-insights** to Nuxt modules.
- Optionally set **sampleRate** under `@laioutr/app-vercel-speed-insights` (default 1).
- Ensure client-side navigation is enabled (standard Nuxt SPA behavior after hydration) so Speed Insights can track page views.
- Deploy on Vercel and enable Speed Insights in the project settings so data is collected and visible in the dashboard.

## Recent changes (since last documented app state)

- **v0.1.4**: Internal integration fix to use Nuxt SDK APIs instead of raw API usage.
- **v0.1.3**: Updated `@vercel/speed-insights` to `v2.0.0`.

## Changelog

The full version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-vercel-speed-insights/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-vercel-speed-insights**](https://github.com/laioutr/app-vercel-speed-insights).
