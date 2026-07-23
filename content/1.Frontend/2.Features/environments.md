---
title: Environments & Staging
description: How to preview changes before going live, using Vercel preview deployments and workarounds for environment-specific content.
seo:
  title: Environments & Staging
  description: How to preview changes before going live, using Vercel preview deployments and workarounds for environment-specific…
sitemap:
  loc: /frontend/features/environments
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Previewing before you go live

You are building a new product listing design, a seasonal campaign page, or a structural change to your navigation. Before pushing it to production, you want to see it running with real data on a real URL. This page explains what works today, what workarounds exist, and what is coming next.

---

## What works today

Laioutr Cloud handles **production deployments** end to end. When you click "Publish" in Studio, the platform builds your Nuxt application and deploys it to your configured [hyperscaler integration](/hosting/hyperscaler). For previewing work-in-progress changes at the code level, **Vercel preview deployments** are the recommended path.

### Vercel preview deployments

If your project uses the [Vercel adapter](/hosting/hyperscaler/vercel-adapter), every branch push automatically generates a **preview deployment** with its own URL. This lets developers and stakeholders review frontend changes before merging to the main branch.

::steps

### Push a branch

Create a feature branch in your project repository and push your changes. Vercel picks up the branch automatically.

### Get the preview URL

Vercel generates a unique URL for the deployment (e.g. `your-project-abc123.vercel.app`). Share this URL with your team for review.

### Merge when ready

Once the preview looks correct, merge to your main branch. The next production publish picks up the changes.

::

::note
Preview deployments use the same `laioutrrc.json` and data configuration as production. They are ideal for reviewing **code and design changes**, but they do not let you point at a different commerce backend or staging API.
::

---

## Previewing content changes

Preview deployments cover **code** changes. For **content** changes — a draft campaign page, an unpublished article — use [Content Preview](/frontend/features/content-preview) instead: append `?preview_token=<token>` to any URL on the live production site and the page is server-rendered against unpublished content, while regular visitors continue to see the published version.

The token is verified server-side, previews are never written to a shared cache, and a wrong token silently renders the published page.

::tip
For toggling the visibility of individual sections or banners without a CMS draft behind them, the **rule engine** still works: a rule keyed on a secret URL parameter shows a section only to whoever has the link.
::

---

## What is coming

Full **multi-environment support** is being built out. The goal is to let you configure environment-specific data connections, so a staging environment could point at a staging commerce backend while production points at the live one.

This will enable workflows like:

- **Staging environment** with its own domain, connected to your commerce platform's sandbox API.
- **Environment-specific Orchestr configurations**, so queries resolve against the correct backend per environment.
- **Promotion pipeline** from staging to production with confidence that what you tested is what goes live.

::caution
Multi-environment data configuration is not yet available. The information above describes the planned direction. Until this ships, preview deployments share the same data sources as production.
::

---

## Summary

| Capability | Status | How |
|---|---|---|
| Production deployments | Available | Laioutr Cloud + [hyperscaler integrations](/hosting/hyperscaler) |
| Branch preview deployments | Available | [Vercel adapter](/hosting/hyperscaler/vercel-adapter) |
| Preview content on production | Available | [Content Preview](/frontend/features/content-preview) with `?preview_token=` |
| Environment-specific data configs | Coming soon | Planned multi-environment support |

For most teams, the combination of Vercel preview deployments for code changes and Content Preview for unpublished content covers the majority of staging needs today.
