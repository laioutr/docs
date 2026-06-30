---
title: Hygraph
description: Laioutr app package that connects a Nuxt storefront to Hygraph's Content API, Orchestr, Studio media, and Nuxt Image, using a sample content model as a starting point only.
seo:
  title: Hygraph | Laioutr
  description: Laioutr Hygraph app for Content API, Orchestr integration, media library, and Nuxt Image. Customize queries and schema for your project.
sitemap:
  loc: /apps/app-docs/hygraph
  lastmod: 2026-04-27
  changefreq: monthly
  priority: 1.0

---

## Overview

`@laioutr/app-hygraph` is a Laioutr Nuxt module that talks to [Hygraph](https://hygraph.com/) over its Content API (GraphQL). It registers as a Laioutr app: Orchestr handlers live under the package's `server/orchestr` tree, a Hygraph media library provider plugs into Studio, and `@nuxt/image` is configured with a Hygraph provider using your asset base URL.

For module options, configuration examples, and runtime behaviour, see the [package README on GitHub](https://github.com/laioutr/app-hygraph/).

## About the built-in content shape

The repository includes example GraphQL documents and Orchestr wiring that follow a blog-oriented content model (lists, detail by slug, collections). Treat that as a demo: it shows how to connect Laioutr to Hygraph, not a fixed product contract.

Every Hygraph project has its own schema. You are expected to adapt or replace the packaged queries and Orchestr registrations so they match your models, fields, and naming. The same module pattern applies; only the GraphQL strings and the mapping into Laioutr types need to follow whatever you define in Hygraph.

## Reusing Hygraph integration in another app

When another Laioutr app also needs to talk to Hygraph, import from this package instead of duplicating the client and codegen setup. Three subpath exports are available:

- `@laioutr/app-hygraph/runtime`: `defineHygraph` Orchestr builder, `hygraphClientFactory`, `mapHygraphMedia`, plus types.
- `@laioutr/app-hygraph/codegen`: `defineHygraphCodegen()` factory with Hygraph-specific scalar mappings.
- `@laioutr/app-hygraph/queries`: reusable GraphQL fragments (e.g. `AssetFragment`).

See the [Exports section in the README](https://github.com/laioutr/app-hygraph/#exports) for the full API and usage examples.

## Related documentation

- [Orchestr](/frontend/orchestr): how queries, resolvers, and middleware fit the rest of the stack.
- [Apps](/apps): the Apps section overview and other app integrations.
- [Hygraph documentation](https://hygraph.com/docs): schema, permissions, and Content API usage.
