---
title: Software Requirements
description: The software requirements for the BYOS approach.
seo:
  title: Software Requirements
  description: The software requirements for the BYOS approach.
sitemap:
  loc: /hosting/bring-your-own-server-byos/software
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---


## Runtime Environment

- **Node.js**: Version 22.12 or higher is required for building and running Laioutr frontends. Ensure your build and runtime environments use compatible Node.js versions.

## Build Tools

- **Build System**: Your infrastructure must support executing Node.js build scripts via pnpm.
- **Package Manager**: pnpm is the recommended package manager for Laioutr projects.

## Web Server / Runtime

Depending on your deployment strategy:

- **SSR Hosting**: A Node.js runtime capable of running Nuxt in SSR mode, with proper process management (PM2, systemd, or container orchestration)
- **Edge Runtime**: Support for edge computing runtimes if deploying to edge platforms