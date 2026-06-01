---
title: Akamai Adapter
description: The Akamai Adapter is a planned integration to connect the Laioutr Cockpit with Akamai-hosted delivery and deployment setups. This page documents the intended scope and configuration shape ahead of release.
aliases:
  - /hosting/hosting-adapter/akamai-adapter
seo:
  title: Akamai Adapter | Laioutr
  description: The Akamai Adapter is a planned integration to connect the Laioutr Cockpit with Akamai-hosted delivery and deployment setups.…
sitemap:
  loc: /hosting/hyperscaler/akamai-adapter
  lastmod: 2026-05-27
  changefreq: monthly
  priority: 0.6

---

## Overview

The **Akamai Adapter** is a **planned** hosting adapter for teams who run their frontend delivery on **Akamai** (e.g. enterprise CDN/edge delivery and related deployment processes).

Since this adapter is not available yet, this page provides a **generic description** of the intended integration so you can already plan your hosting approach and required credentials.

## Intended capabilities (planned)

Once available, the Akamai Adapter is expected to cover the same high-level responsibilities as other Laioutr hosting adapters:

- **Deploy from the Cockpit**: trigger a deployment/build workflow for a Laioutr frontend from within the Cockpit.
- **Provider-specific delivery**: integrate with your Akamai-based delivery setup (properties, hostnames, edge configuration) according to your organization’s standards.
- **Cache / invalidation hooks**: optionally trigger cache invalidation/purge steps as part of the deployment flow.
- **Bring Your Own**: use your existing Akamai account, CI/CD, and governance model.

## What you will likely need to configure

The exact set of fields may change when the adapter ships. Expect configuration along these lines:

- **Authentication / credentials**
  - API client credentials for your Akamai automation setup (stored securely in the Cockpit)
- **Target identifiers**
  - Property / configuration identifiers used by your Akamai delivery setup
  - Hostnames / environments to deploy to (e.g. staging, production)
- **Deployment strategy**
  - How your generated frontend artifacts are published (e.g. object storage + CDN, edge deployment, or an existing CI pipeline)
- **Invalidation**
  - Whether to run cache purge/invalidation, and what paths or patterns should be purged

## Current status

- **Availability**: not released yet (planned)
- **Recommended workaround today**: use **Bring Your Own Server & Deployment Strategy** (webhook-based) to integrate your existing Akamai deployment pipeline until the native adapter is available.

