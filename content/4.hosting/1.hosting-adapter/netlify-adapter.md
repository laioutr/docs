---
title: Netlify Adapter
description: The Netlify Adapter is a pre-built integration that connects the Laioutr Cockpit directly with Netlify. It allows you to trigger deployments and manage frontend delivery through Netlify services.
seo:
  title: Netlify Adapter | Laioutr
  description: The Netlify Adapter is a pre-built integration that connects the Laioutr Cockpit directly with Netlify. It allows you…
sitemap:
  loc: /hosting/hosting-adapter/netlify-adapter
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

# Netlify Adapter

The **Netlify Adapter** connects the Laioutr Cockpit with **Netlify** to run builds and publish your storefront via Netlify’s hosting and CDN. It’s intended for teams that already operate their frontend on Netlify and want to trigger deploys directly from the Cockpit (e.g. after content changes, configuration changes, or releases).

## What it does (high level)

- **Triggers Netlify deploys** from Laioutr (usually via a build hook / deploy trigger).
- **Optionally maps environments** (e.g. preview/staging/production) to different Netlify sites or deploy contexts.
- **Keeps responsibilities clear**: Laioutr orchestrates *when* to deploy; Netlify handles *how* to build and serve the frontend.

## Prerequisites

- A Netlify account with at least one **Site** for your storefront.
- A configured build in Netlify (repository connection or other build source).
- A **deploy trigger** (typically a Netlify build hook URL) that Laioutr can call.

## Setup overview

1. **Create a build hook in Netlify** for the target site/environment.
2. **Configure the Netlify Adapter in the Laioutr Cockpit** by storing the hook URL (and, if applicable, environment/site mapping).
3. **Select the adapter** in your hosting/project configuration so deploys can be triggered from Laioutr workflows.

## Deployment flow (typical)

1. A change in Laioutr (content, configuration, release) triggers a deploy action.
2. The adapter calls the configured Netlify deploy trigger.
3. Netlify builds the frontend and publishes it to the configured domain(s).

## Notes & limitations

- The adapter typically **does not stream build logs** back into the Cockpit; logs remain in Netlify.
- **Permissions and secrets** remain on the Netlify side (repo access, env vars, build settings). Laioutr only needs the deploy trigger endpoint.
- If you need **advanced control** (e.g. cache purge strategy, per-branch preview rules, custom deploy parameters), manage that in Netlify and keep the adapter configuration minimal.

## Troubleshooting

- **Deploy not triggered**: verify the build hook URL, site selection, and that the hook is active in Netlify.
- **Deploy triggered but site not updated**: check Netlify build status/logs and verify build output & publish directory settings.
