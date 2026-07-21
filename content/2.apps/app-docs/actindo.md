---
title: Actindo
description: How to connect an Actindo Storefront Data Service tenant to Laioutr and what developers can build on top.
seo:
  title: Actindo
  description: How to connect an Actindo Storefront Data Service tenant to Laioutr and what developers can build on top.
sitemap:
  loc: /apps/app-docs/actindo
  lastmod: 2026-06-04
  changefreq: monthly
  priority: 1.0

---

The **Actindo** app connects an [Actindo](https://www.actindo.com/) **Storefront Data Service** tenant to Laioutr. It is a **read-only catalog connector**: it maps Actindo's storefront REST API onto Laioutr's canonical ecommerce model so your frontend can render product, category, navigation and search data without knowing the Actindo API directly.

::callout{icon="i-lucide-info"}
This connector provides **data only**. It does **not** implement cart, checkout, customer accounts/login or a media library. Product detail pages, listing pages, the header and search UI are rendered by the standard Laioutr UI (`@laioutr-app/ui`) on top of the canonical data this app supplies.
::

## Part 1 – Connect Actindo and Laioutr (for store owners & project leads)

This section explains **which values you need from Actindo** and **where to find them**. You can either enter them into the Laioutr project configuration yourself, or hand them to your implementation partner.

### 1. Information you will need

To connect an Actindo tenant to Laioutr you need:

- **Storefront Data Service API key (Bearer token)**
  - One key resolves server-side to exactly **one Actindo tenant** (its catalog, categories, navigation and search).
  - Treat it as a secret — it is used only on the server and never exposed to the browser.

- **Service base URL** *(optional)*
  - Defaults to **`https://laioutr.actindo.com`**.
  - Only needed if your tenant is served from a different host.

- **Locale mapping** *(optional)*
  - Your storefront speaks a locale such as `de`, but the Actindo catalog may be keyed under a dialect such as `de-DE` (and does not fall back from a bare language tag for slug lookups).
  - You provide a small map, e.g. `de → de-DE`, so slugs resolve correctly.

The API contract for the Storefront Data Service is documented at **<https://laioutr.actindo.com/docs>**.

### 2. Hand the data to your developer or partner

At this point you should have:

- Storefront Data Service **API key** (Bearer token)
- (Optional) a non-default **base URL**
- (Optional) a **locale map** (e.g. `de → de-DE`)

Developers wire these values into the Laioutr project. No theme or storefront code needs to change inside Actindo for the integration itself.

---

## Part 2 – Developer setup in Nuxt

Developers integrate Actindo by adding the **`@laioutr/app-actindo`** module to the Nuxt app that powers the Laioutr frontend.

### Module configuration

Configuration is delivered through the **Laioutr project config (`laioutrrc.json`)** — the same pattern every standalone connector app uses. You add an entry to the `apps` array; Laioutr's frontend-core injects that entry's `config` into the module under the key **`'@laioutr/app-actindo'`** (the package name, used as both the Nuxt `configKey` and the private `runtimeConfig` namespace).

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| **`apiKey`** | `string` | yes | Storefront Data Service **Bearer token**. Resolves to exactly one Actindo tenant. Server-only. |
| **`baseUrl`** | `string` | no | Service base URL. Defaults to **`https://laioutr.actindo.com`**. |
| **`localeMap`** | `Record<string, string>` | no | Maps the storefront locale to the tenant's locale dialect, e.g. `{ de: 'de-DE' }`. Unmapped locales pass through unchanged. Defaults to `{}`. |

The `apiKey` lives in **private** runtime config (`runtimeConfig['@laioutr/app-actindo']`) — never in `runtimeConfig.public`. This connector exposes **no** client-visible configuration.

### Project config (`laioutrrc.json`)

Add the connector to the `apps` array of the project's `laioutrrc.json`:

```json
{
  "apps": [
    {
      "name": "@laioutr/app-actindo",
      "version": "latest",
      "config": {
        "apiKey": "your-tenant-bearer-token",
        "localeMap": { "de": "de-DE" }
      }
    }
  ]
}
```

`laioutrrc.json` carries project secrets and is **not** committed to version control. In production the Laioutr platform supplies it; for local development you place your project's `laioutrrc.json` next to the playground (the connector reads it the same way).

### Runtime behavior (high level)

- **Single-tenant per deployment.** One configured key serves all requests; there is no per-request, per-tenant credential injection. (This mirrors the Shopify connector's credential model.)
- **Request-scoped client.** The orchestr middleware builds one authenticated Actindo client per request and exposes it to every handler, alongside the resolved `locale` (after the locale map) and `currency` from the per-request client environment.
- **Locale resolution.** The storefront locale is mapped through `localeMap` before it is sent to the service, so slug lookups hit the right catalog dialect.

---

## Part 3 – What the Actindo integration provides (for developers)

Once configured, the **`@laioutr/app-actindo`** package implements the relevant parts of Laioutr's canonical ecommerce model through the orchestr. Your frontend talks to the canonical model, not to Actindo directly.

### Built-in capabilities

- **Canonical queries**
  - **Product** — by slug (PDP), product search, products by category (by category slug and by category id).
  - **Category** — by slug, and a listing of all categories.
  - **Menu** — menu/navigation by alias (e.g. `main`).
  - **Suggested search** — predictive header autocomplete entries (a query suggestion plus product hits).

- **Links** (connect canonical entities)
  - Product → variants.
  - Product → breadcrumb.
  - Category → products, and Category → breadcrumb (ancestor trail).
  - Suggested search → entries.

- **Resolvers** (hydrate canonical components)
  - **Product** and **ProductVariant** component resolvers (gallery/title/price/variant data, quantity prices, shipping, etc.).
  - **Category** and **Menu** resolvers.

- **Query template providers**
  - Studio-wireable templates for the **category** product listing and the **menu** query, so editors can bind them visually.

- **Page types**
  - Registers the commerce page types used by the storefront: **Product Detail**, **Product Listing** and **Product Search**.

- **Images**
  - A **Nuxt Image provider** named `actindo` for Actindo-hosted media URLs.

::callout{icon="i-lucide-circle-slash"}
**Not provided:** cart, checkout, customer accounts/login, order history and media-library upload. This is a catalog read connector; transactional and customer flows are out of scope.
::

For exact type names and payloads, check the package source and the `@laioutr-core` canonical type definitions.

---

## Part 4 – Extending the integration

You can extend the Actindo integration while staying within Laioutr's orchestr and canonical model.

### 1. Adding new Actindo-powered features

- **New queries** — expose additional catalog data (e.g. brand or attribute listings):
  - Call the relevant Storefront Data Service endpoint.
  - Map the response into an existing canonical entity or a new canonical type.
  - Register a new orchestr query and, optionally, a query template provider so Studio users can wire it in visually.

### 2. Enriching existing entities

- **Extending canonical types** — if you need more fields on a product or category, extend the canonical type (where appropriate for your project) and populate the new field from additional Actindo API fields. Keep extensions backwards compatible and documented for frontend developers.
- **Custom links** — connect existing entities in new ways (e.g. product → related products), as long as the relationship is available from the service.

### 3. Custom sections and blocks for Studio

- Build sections/blocks that consume the canonical queries and links (for example a “Featured category grid” reading products from a category slug).
- **Best practice:** keep sections/blocks backend-agnostic — depend only on canonical types, never on Actindo-specific payloads. This keeps your UI portable if you add or switch commerce backends later.

### 4. Working with media

- Use the `actindo` Nuxt Image provider for Actindo-hosted media so images flow through Nuxt Image.
- Extend the image provider if you need custom URL handling or transformation parameters.

By combining these extension points you can grow from a standard Laioutr × Actindo catalog storefront into a more tailored experience, without losing the benefits of a canonical, backend-agnostic frontend architecture.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package's GitHub repository. When the Actindo connector is published as a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public), use that repo's **`CHANGELOG.md`** for release notes.
