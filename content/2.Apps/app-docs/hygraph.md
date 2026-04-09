---
title: Hygraph
description: Laioutr app package that connects a Nuxt storefront to Hygraph’s Content API, Orchestr, Studio media, and Nuxt Image—using a sample content model as a starting point only.
seo:
  title: Hygraph | Laioutr
  description: Laioutr Hygraph app for Content API, Orchestr integration, media library, and Nuxt Image—customize queries and schema for your project.
sitemap:
  loc: /apps/app-docs/hygraph
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 1.0

---

## Overview

**@laioutr/app-hygraph** is a Laioutr **Nuxt module** that talks to [Hygraph](https://hygraph.com/) over its **Content API** (GraphQL). It registers as a Laioutr app: **Orchestr** handlers live under the package’s `server/orchestr` tree, and optional **sections/blocks** and **media library** integration ship with the module. **@nuxt/image** is configured with a **Hygraph** provider using your asset base URL.

The module exposes a small **GraphQL client** on the orchestr context (`hygraph`) so server-side code can run arbitrary queries against your project endpoint.

### About the built-in content shape

The repository includes **example GraphQL documents** and orchestr wiring that follow a **blog-oriented** content model (lists, detail by slug, collections, etc.). Treat that as a **demo / reference**: it shows how to connect Laioutr to Hygraph, not a fixed product contract.

In practice, **every Hygraph project has its own schema**. You are expected to **adapt or replace** the packaged queries and orchestr registrations so they match **your** models, fields, and naming. The same module pattern applies—only the GraphQL strings and the mapping into Laioutr types need to follow whatever you define in Hygraph.

## Configuration

Configure the module under **`@laioutr/app-hygraph`** at the top level of `nuxt.config.ts` (the module merges these values into **runtimeConfig**). Typical options:

| Option | Purpose |
|--------|--------|
| **`contentApiUrl`** | Hygraph Content API endpoint for your environment (e.g. master or a specific stage). |
| **`token`** | API bearer token used on each GraphQL request (keep in env vars in production). |
| **`imageBaseUrl`** | Base URL passed into **Nuxt Image**’s Hygraph provider for resolving image URLs from Hygraph assets. |

Use **environment variables** for `token` and URLs in deployed environments.

### Example

```ts
// nuxt.config.ts (illustrative)
export default defineNuxtConfig({
  modules: ['@laioutr/app-hygraph', '@laioutr-core/orchestr' /* + your frontend stack */],
  '@laioutr/app-hygraph': {
    contentApiUrl: process.env.HYGRAPH_CONTENT_API_URL!,
    token: process.env.HYGRAPH_TOKEN!,
    imageBaseUrl: process.env.HYGRAPH_IMAGE_BASE_URL!,
  },
});
```

Exact keys follow the published module types; align URLs and tokens with your Hygraph project settings.

## Runtime behavior

- **Hygraph client** — Server middleware builds a client that **POSTs** `{ query, variables }` to `contentApiUrl` with `Authorization: Bearer <token>`. Orchestr handlers and other server code use this client rather than calling fetch ad hoc.
- **Nuxt Image** — During setup, the module contributes **Hygraph** image config (`baseURL` from `imageBaseUrl`) so components can resolve Hygraph-hosted assets consistently.
- **Media library** — A **Hygraph** provider can list assets for Studio (pagination/search parameters are passed through to GraphQL as implemented in the package). If your schema uses different asset filters or fields, adjust the underlying query and mapper accordingly.
- **Orchestr** — Query/link/resolver files under `server/orchestr` demonstrate wiring Laioutr’s blog-style flows to Hygraph. Swap or extend these when your schema differs.

## Customizing for your schema

1. **Model content in Hygraph** the way your storefront needs (types, relations, slugs, locales, etc.).
2. **Update GraphQL** in the app package (or a fork) so fragments and operations match your API.
3. **Map responses** to the Laioutr entities and query tokens your sections expect—or introduce new orchestr queries aligned with your UI.

No separate “Hygraph schema download” is required for the concept: the **source of truth** is always your Hygraph project; the Laioutr app is the **adapter** between that API and the storefront.

## Related documentation

- **Laioutr Apps** and **Orchestr** — see the broader **Apps** and **Frontend** sections in this docs site for how queries and resolvers fit the rest of the stack.
- **Hygraph** — [Hygraph documentation](https://hygraph.com/docs) for schema, permissions, and Content API usage.
