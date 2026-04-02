---
title: Vercel Adapter
description: The Vercel Adapter is a pre-built integration that connects the Laioutr Cockpit with Vercel. It allows you to deploy your Laioutr frontend to your own Vercel account (Bring Your Own) or to use Laioutr-managed Vercel hosting.
seo:
  title: Vercel Adapter | Laioutr
  description: The Vercel Adapter is a pre-built integration that connects the Laioutr Cockpit with Vercel. It allows you to deploy…
---

## Overview

The Vercel Adapter lets you use Vercel as the hosting provider for your Laioutr frontend. The Cockpit generates the Nuxt project (config, dependencies, and app files), then triggers a deployment to Vercel using either **your own Vercel account** (Bring Your Own) or **Laioutr Cloud based on Vercel** (optional with your subscription).

This document focuses on **Bring Your Own Vercel**: you provide a Vercel API token, team ID, and project name so the Cockpit can deploy directly to your Vercel environment. No webhook from Vercel back to the Cockpit is required for this mode; deployment is triggered from the Cockpit and runs on Vercel.

## How it works

1. **Configuration in Cockpit**  
   In your project’s Hosting → Vercel settings you store:
   - **Project name** – Must match an existing Vercel project name in your team.
   - **Token** – A Vercel API token with permission to deploy for that team.
   - **Team ID** – The Vercel team (or user) that owns the project.

2. **Deploy flow**  
   When you deploy from the Cockpit:
   - The Cockpit generates the Nuxt app (e.g. `package.json`, `nuxt.config.ts`, app entry, laioutr rc, npmrc, etc.).
   - Optionally, it configures **cache**: either a **Redis** store (if you provide a Redis URL) or Vercel’s runtime cache driver.
   - The generated files are materialized to a temporary directory and sent to Vercel via `createDeployment` (using `@vercel/client`) with your token and team ID.
   - The Vercel project is assumed to be set up as a **Nuxt** project; the adapter uses framework `nuxtjs` and forces a new build (no build cache) so dependencies stay up to date.

3. **Response behavior**  
   The adapter waits either until the deployment is “ready” or for a short timeout (about 10 seconds). After that, the Cockpit returns success; the build continues on Vercel in the background. In this Bring Your Own mode, the Cockpit does **not** receive deployment status updates from Vercel (no webhooks or status polling).

## What you need to configure

### 1. A Vercel account and team

- Sign in at [vercel.com](https://vercel.com).
- Use a **team** if you work with an organization; otherwise the “personal” scope is your default team.
- Note your **Team ID**: in the dashboard, go to **Team Settings → General** (or Account Settings for personal). The Team ID is in the URL or in the **Team ID** field.

### 2. A Vercel project (created before connecting Cockpit)

- In the Vercel dashboard, **create a new project** (or use an existing one).
- Do **not** connect a Git repo if you only want deployments from the Cockpit; you can leave it empty or use a placeholder.
- Set the **Framework Preset** to **Nuxt** (or ensure the project is configured for Nuxt). The adapter sends framework `nuxtjs` when deploying.
- Copy the **project name** (the slug, e.g. `my-laioutr-frontend`). You will enter this exact name in the Cockpit.

### 3. A Vercel API token

- In Vercel: **Account/Team Settings → Tokens** (or [vercel.com/account/tokens](https://vercel.com/account/tokens)).
- Create a token with a name like “Laioutr Cockpit”.
- Ensure the token has **deploy** (and if needed, read) scope for the team you use. The Cockpit uses this token only to create deployments and read project info as needed.
- Store the token securely; you will paste it once into the Cockpit Hosting → Vercel form. The Cockpit stores it in your project’s hosting provider data.

### 4. Cockpit Hosting form (Bring Your Own)

In the Laioutr Cockpit, open your project and go to **Hosting → Vercel**. Fill in:

| Field          | Required | Description |
|----------------|----------|-------------|
| **Project Name** | Yes     | Exact name (slug) of the Vercel project. Must already exist in the given team. |
| **Token**        | Yes     | Vercel API token with deploy access for the team. |
| **Team ID**      | Yes     | Vercel team (or user) ID that owns the project. |

Optional (if supported by your Cockpit version and UI):

- **Redis URL** – If you provide a Redis connection URL, the generated Nuxt app is configured to use Redis for Nitro cache instead of Vercel’s runtime cache. Use this if you want a shared cache across instances or more control over cache. If omitted, the adapter uses the Vercel runtime cache driver.

Save the form. The Cockpit will use these values for all subsequent deploys for this project/environment.

## Deployment behavior

- **Trigger**: Deploy is started from the Cockpit (e.g. “Deploy” or “Publish”).
- **Build**: Runs on Vercel; the Cockpit does not run the build itself. Build env includes:
  - `VERCEL_FORCE_NO_BUILD_CACHE=1` so dependencies are not served from Vercel’s build cache.
  - `NUXT_PUBLIC_LTR_LOGGER_LOG_FOR_DEVELOPMENT=false` for production.
- **Result**: The Cockpit returns success once the deployment has been accepted and is “ready” or after the short timeout. The actual build and go-live continue on Vercel; check the Vercel dashboard for final status and URL.
- **Capabilities**: In Bring Your Own mode, the adapter does **not** support: deployment status updates in the Cockpit, cancel, promote, rollback, or delete deployment. Those are available only with the managed Vercel integration and webhooks.

## Cache: Vercel runtime vs Redis

- **Default (no Redis URL)**  
  The generated Nuxt config uses Nitro storage with `@screeny05/unstorage-driver-vercel-runtime-cache`. Cache is tied to Vercel’s runtime and is suitable for most cases.

- **With Redis URL**  
  If you provide a Redis URL in the hosting config, the generated app uses `@screeny05/unstorage-driver-redis` for Nitro cache (with the URL you supplied). Use this when you need a shared cache across multiple instances or a custom cache topology.

## Summary checklist for developers

To use the Vercel adapter with **your own** Vercel environment:

1. Have a Vercel account and know your **Team ID** (or use personal account).
2. **Create a Vercel project** (Nuxt), and note its **project name** (slug).
3. Create a Vercel **API token** with deploy (and any required read) scope for that team.
4. In the Cockpit, go to **Hosting → Vercel** and enter **Project Name**, **Token**, and **Team ID** (and optionally **Redis URL**).
5. Deploy from the Cockpit; the app is built and deployed on Vercel. Check the Vercel dashboard for the live URL and build status.

No webhook or callback from Vercel to the Cockpit is required for this Bring Your Own flow. For Laioutr-managed Vercel with status updates and webhooks, see the rest of the hosting documentation or contact our support team.
