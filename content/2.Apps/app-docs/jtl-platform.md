---
title: JTL Platform
description: How to connect a JTL-Wawi ERP Cloud tenant to Laioutr via the native JTL GraphQL API, and what developers can build on top.
seo:
  title: JTL Platform | Laioutr
  description: How to connect a JTL-Wawi ERP Cloud tenant to Laioutr via the native JTL GraphQL API, and what developers can build on top.
sitemap:
  loc: /apps/app-docs/jtl-platform
  lastmod: 2026-06-24
  changefreq: monthly
  priority: 1.0

---

The **JTL Platform** app connects a [JTL-Wawi](https://www.jtl-software.de/) **ERP Cloud** tenant to Laioutr. It is a **read-only catalog connector**: it maps JTL's data onto Laioutr's canonical ecommerce model — through the **native JTL ERP GraphQL API** — so your frontend can render product listing and search data without knowing the JTL API directly.

::callout{icon="i-lucide-info"}
This connector provides **data only**. It does **not** implement cart, checkout, customer accounts/login or a media library. Listing and search UI are rendered by the standard Laioutr UI (`@laioutr-app/ui`) on top of the canonical data this app supplies.
::

::callout{icon="i-lucide-construction"}
**Initial version.** Today the connector ships product **listing + full-text search** (mapped to the canonical `Product`). Product detail (images/variations), categories and brands are on the roadmap — see *Part 4*.
::

## Part 1 – Connect JTL and Laioutr (for store owners & project leads)

This section explains **which values you need from JTL** and **where to find them**. You can either enter them into the Laioutr project configuration yourself, or hand them to your implementation partner.

### 1. Information you will need

To connect a JTL tenant to Laioutr you need:

- **OAuth2 client credentials (client id + client secret)**
  - Created when you register a **cloud app** in the [JTL developer portal](https://developer.jtl-software.com/).
  - The secret is used **only on the server** and is never exposed to the browser. Treat it as a secret and rotate it if it leaks.

- **Tenant id**
  - Identifies **which merchant's data** the requests read. It is sent as the `X-Tenant-ID` header on every API call.
  - Without it the API rejects every query with `400 TenantIdMissing`.

- **Permission / scope: `items.read`**
  - The app registration must be granted the **`items.read`** permission so it may query items (products). Missing permission shows up as a `403` on data queries.

- **Endpoints** *(optional)*
  - Default GraphQL endpoint: **`https://api.jtl-cloud.com/erp/v2/graphql`**.
  - Default OAuth2 token endpoint: **`https://auth.jtl-cloud.com/oauth2/token`**.
  - Only override if your tenant is served from a different host.

The JTL Platform API is documented at **<https://developer.jtl-software.com/>** (see *Using Platform APIs* and the *GraphQL Schema Reference*).

### 2. Hand the data to your developer or partner

At this point you should have:

- OAuth2 **client id** and **client secret**
- the **tenant id**
- confirmation that **`items.read`** is granted on the app registration
- (optional) non-default **GraphQL / token endpoints**

Developers wire these values into the Laioutr project. No theme or storefront code needs to change inside JTL for the integration itself.

---

## Part 2 – Developer setup in Nuxt

Developers integrate JTL by adding the **`@laioutr/app-jtl-platform`** module to the Nuxt app that powers the Laioutr frontend.

### Module configuration

Configuration is delivered through the **Laioutr project config (`laioutrrc.json`)** — the same pattern every standalone connector app uses. You add an entry to the `apps` array; Laioutr's `frontend-core` injects that entry's `config` into the module under the key **`@laioutr/app-jtl-platform`** (the package name, used as both the Nuxt `configKey` and the private `runtimeConfig` namespace). There is **no** env-based configuration.

All connection values are **secret-bearing**: they live in **private** runtime config (`runtimeConfig['@laioutr/app-jtl-platform']`) only — never in `runtimeConfig.public`, never in the client bundle.

| Option | Required | Description |
|--------|----------|-------------|
| **`clientId`** | yes | OAuth2 client id. |
| **`clientSecret`** | yes | OAuth2 client secret. Server-only. |
| **`tenantId`** | yes | Merchant tenant, sent as the `X-Tenant-ID` header. |
| **`graphqlUrl`** | no | GraphQL endpoint. Defaults to `https://api.jtl-cloud.com/erp/v2/graphql`. |
| **`tokenUrl`** | no | OAuth2 token endpoint. Defaults to `https://auth.jtl-cloud.com/oauth2/token`. |
| **`scope`** | no | Optional OAuth2 scope. |

When **no** credentials are configured, the connector serves **built-in fixtures** so a storefront/playground still renders products end-to-end. Configure real credentials to switch to live data.

### Project config (`laioutrrc.json`)

Add the connector to the `apps` array of the project's `laioutrrc.json`:

```json
{
  "apps": [
    {
      "name": "@laioutr/app-jtl-platform",
      "version": "latest",
      "config": {
        "clientId": "your-oauth-client-id",
        "clientSecret": "your-oauth-client-secret",
        "tenantId": "your-tenant-id"
      }
    }
  ]
}
```

`laioutrrc.json` carries project secrets and is **not** committed to version control. In production the Laioutr platform supplies it; for local development you fetch it with `npx @laioutr/cli project fetch-rc` and pass it through the `laioutr` module option (as in app-actindo). Without it, the connector serves fixtures.

### Runtime behavior (high level)

- **Single-tenant per deployment.** One configured client serves all requests; there is no per-request, per-tenant credential injection.
- **OAuth2 client-credentials.** The connector obtains a Bearer token from the token endpoint, **caches** it and **renews it ~60 s before expiry** (tokens last ~24 h). On a `401` it refreshes the token once and retries.
- **Request-scoped client.** The orchestr middleware builds one authenticated JTL client per request and exposes it to every handler, alongside the resolved `locale` and `currency` from the per-request client environment.
- **Resilient transport.** Every request carries `Authorization: Bearer …` and `X-Tenant-ID`. GraphQL errors are read from the response **body** (a `200 OK` can still carry errors); `429`/`5xx` responses are retried with exponential backoff and jitter.

---

## Part 3 – What the JTL integration provides (for developers)

Once configured, the **`@laioutr/app-jtl-platform`** package implements the relevant parts of Laioutr's canonical ecommerce model through the orchestr. Your frontend talks to the canonical model, not to JTL directly.

### Built-in capabilities

- **Canonical queries**
  - **Product** — product **listing** and **full-text search** (backed by the JTL `QueryItems` GraphQL query: `searchTerm` + cursor pagination).

- **Resolvers** (hydrate canonical components)
  - **Product** component resolver, mapping each JTL item onto `ProductBase` (name + derived slug), `ProductDescription`, `ProductInfo` (short description, brand), `ProductBrand` (manufacturer) and `ProductPrices` (gross price).

- **Connectivity endpoints** (for setup/verification)
  - `GET /api/jtl-health` — runs the OAuth + GraphQL round-trip; `200` when live, `503` otherwise.
  - `GET /api/jtl-items?q=&limit=&offset=` — listing/search probe returning raw JTL items (live when configured, fixtures otherwise).

- **GraphQL types**
  - Generated from the committed JTL ERP SDL (`schema.graphql`) via `graphql-codegen` (`pnpm codegen`) — works offline, no credentials required.

::callout{icon="i-lucide-circle-slash"}
**Not provided (yet):** product detail components (images/variations), categories, brands listing, cart, checkout, customer accounts/login and media-library upload. JTL-Wawi is an ERP — storefront fields the list node lacks (media, SEO, real URL slug) are filled from the item detail in a follow-up; until then they degrade to their conventional empty canonical shape.
::

For exact type names and payloads, check the package source and the `@laioutr-core` canonical type definitions.

---

## Part 4 – Extending the integration

You can extend the JTL integration while staying within Laioutr's orchestr and canonical model.

### 1. Product detail (PDP)

- Add a `GetItemById` GraphQL operation and map `ItemdetailsItem` onto the remaining canonical components: **images** (`ItemImages.defaultImageUrl` → `ProductMedia`), **variations** (`ProductDefaultVariant`), the real **`urlPath`** slug and SEO (`metaDescription`).

### 2. Categories, navigation and brands

- Map `QueryCategories` (flat list + `parentId` → tree) onto canonical **Category**/**Menu**, and `QueryManufacturers` onto **brands**. Register query template providers so Studio editors can wire them visually.

### 3. Listing depth & performance

- Switch the offset-bridged listing to **true cursor pagination** (carry `pageInfo.endCursor`), and add a batch-by-id fetch (`where: { id: { in } }`) for cache-restore paths. Query only the fields your UI renders.

### 4. Custom sections and blocks for Studio

- Build sections/blocks that consume the canonical queries — and keep them **backend-agnostic** (depend only on canonical types, never on JTL-specific payloads), so your UI stays portable if you add or switch commerce backends later.

### Reference

The integration follows the JTL developer guides:

- [Using Platform APIs](https://developer.jtl-software.com/guides/cloud-apps/using-platform-apis)
- [Best practices](https://developer.jtl-software.com/guides/cloud-apps/best-practices)
- [Error handling](https://developer.jtl-software.com/guides/essentials/common-patterns/error-handling)
- [Pagination](https://developer.jtl-software.com/guides/essentials/common-patterns/pagination)
- [GraphQL conventions](https://developer.jtl-software.com/guides/essentials/common-patterns/graphql-conventions)

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package's GitHub repository ([`laioutr/app-jtl-platform`](https://github.com/laioutr/app-jtl-platform)). Use that repo's **`CHANGELOG.md`** for release notes.
