---
title: Commercetools
description: Developer documentation for the Laioutr Commercetools app package. Connect your Nuxt frontend to Commercetools via the Platform API with anonymous or client-credentials auth.
---

## Overview

The **@laioutr-app/commercetools** package integrates a Laioutr-powered Nuxt app with [Commercetools](https://commercetools.com/). It uses the **Commercetools Platform API** (products, categories, cart, product search with facets and sortings). The package registers with the Laioutr orchestr (queries, actions, links, component resolvers), and maps Commercetools images to the canonical media shape with provider `commercetools` for use with Nuxt Image.

Auth is either **anonymous session** (when a `ctp-anon-token` cookie is present) or **client credentials** (server-side only). The package creates or reuses the active cart per request and exposes canonical ecommerce capabilities so your UI can stay backend-agnostic.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/commercetools`** in `nuxt.config.ts` (or via `runtimeConfig`). All five options are **required**.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`apiURL`** | `string` | Commercetools API base URL (e.g. `https://api.eu-central-1.aws.commercetools.com`). Default: EU Central 1. |
| **`authURL`** | `string` | Commercetools Auth URL (e.g. `https://auth.eu-central-1.aws.commercetools.com`). Default: EU Central 1. |
| **`projectKey`** | `string` | Commercetools project key. Default: `laioutr-demo`. |
| **`clientId`** | `string` | API client ID with scope `manage_project:{projectKey}` (and anonymous sessions if you use cart/me). |
| **`clientSecret`** | `string` | API client secret. Keep this secret and only use it on the server (the module stores it in private runtime config). |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/commercetools', '@laioutr-core/orchestr', '@nuxt/image'],
  '@laioutr-app/commercetools': {
    apiURL: process.env.CTP_API_URL ?? 'https://api.eu-central-1.aws.commercetools.com',
    authURL: process.env.CTP_AUTH_URL ?? 'https://auth.eu-central-1.aws.commercetools.com',
    projectKey: process.env.CTP_PROJECT_KEY!,
    clientId: process.env.CTP_CLIENT_ID!,
    clientSecret: process.env.CTP_CLIENT_SECRET!,
  },
});
```

Use environment variables (or a similar secret source) for `clientId` and `clientSecret` in production; do not commit them.

### Runtime behavior

- **API client**  
  The package builds a single Commercetools API client per request via `@commercetools/ts-client` and `@commercetools/platform-sdk`. If the request has the **anonymous token cookie** (`ctp-anon-token`), it uses **anonymous session flow** so cart and `me` endpoints work. Otherwise it uses **client credentials flow** (server-only, no cart/me). The client is passed into the orchestr context as `commercetoolsClient`.

- **Token cache**  
  For anonymous sessions, the package uses a cookie-based token cache. Tokens are read from and written to `ctp-anon-token` and `ctp-anon-refresh-token` (httpOnly, secure, sameSite: strict, path: /). The first request without a token triggers a token fetch before running orchestr handlers.

- **Facets and sortings**  
  The orchestr middleware injects a default **facets** config (e.g. Price ranges, In Stock boolean, Color lenum) and **sortings** (e.g. price asc/desc). You can extend these in the middleware; see [Commercetools Product Search facets](https://docs.commercetools.com/api/projects/product-search#facets) and [Search Sortings](https://docs.commercetools.com/api/search-query-language#ctp:api:type:SearchSorting).

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCartQuery** – Returns the current cart ID. Uses `me().activeCart()` or creates a new cart with `me().carts().post()` if none exists. Currency comes from `clientEnv.currency`. Returns `{ id: "" }` if neither anonymous nor authenticated session is available.

- **Menu**  
  - **MenuByAliasQuery** – Categories as menu. `alias === "root"` returns top-level categories (`parent is not defined`); otherwise looks up category by key and returns that category’s id. Returns `{ ids, total }`.

- **Product**  
  - **ProductBySlugQuery** – Product by slug for the current locale (`masterData.current(slug(locale = "…"))`). Returns `{ id }`.  
  - **ProductsByCategorySlugQuery** – Product listing by category slug. Resolves category by slug, then runs product search with filter by category, facets, postFilter (from selected filters), and sort. Returns `ids`, `total`, `availableFilters`, `availableSortings`.

### Actions

- **Cart**  
  - **CartAddItemsAction** – Adds line items to the active cart. Input items with `type === "product"` are resolved by SKU via product search; then `addLineItem` actions are applied (productId, variantId, quantity). Creates the cart if needed (same as GetCurrentCartQuery).

### Links

- **Product**  
  - **ProductVariantsLink** – Resolves product IDs to variant SKUs. Fetches product projections by id and returns `sourceId` (product id) → `targetIds` (master + variant SKUs).

### Component resolvers

- **Cart** – Resolves cart entities by id. Provides **CartBase** (totalQuantity, discountCodes) and **CartCost** (subtotal, total, totalTax, taxesIncluded, etc.). Uses `carts().get()` with expand for discount codes.

- **MenuItem** – Resolves category entities for the menu. Provides **MenuItemBase** (name, reference with type category, slug, id, childIds, parentId). Builds a full category tree (limit 500) to compute children; only requested entity ids are returned.

- **Product** – Resolves product projections by id. Provides **ProductBase**, **ProductDescription**, **ProductInfo**, **ProductMedia**, **ProductPrices**, **ProductSeo**, **ProductFlags**. Maps name, slug, description, brand (from attribute), images (master + variants), price range, compare-at range, SEO meta. Uses `productProjections().get()` with currency from clientEnv.

- **ProductVariant** – Resolves variants by SKU via product search. Provides **ProductVariantBase**, **ProductVariantInfo**, **ProductVariantAvailability**, **ProductVariantPrices**, **ProductVariantQuantityPrices**, **ProductVariantQuantityRule**, **ProductVariantShipping**, **ProductVariantOptions**. Maps price, discounted price, availability, barcode/gtin, variant options from attributes, unit price measurement, quantity rules (min/step/max), and shipping (e.g. requiresShipping attribute).

## Images and media

Product and variant images from Commercetools are mapped to the canonical **MediaImage** type with `provider: "commercetools"` and `sources[].src` set to the image URL (and optional width/height from `dimensions`). The module installs **@nuxt/image** on prepare; use a Commercetools Nuxt Image provider if your setup requires it to serve or transform these URLs.

## Backend requirements

- **Commercetools project** – Create a project in the Commercetools Merchant Center and note `projectKey`, `apiURL`, and `authURL` for your region.
- **API client** – Create an API client with scope `manage_project:{projectKey}`. For cart and `me` (active cart, anonymous sessions), ensure anonymous sessions are allowed for the project and that the client is used only server-side with the provided client secret.
- **Product and category data** – Publish products with slugs (per locale), categories with keys and slugs, and inventory/availability if you use stock and facets.
- **Facets and search** – The default middleware configures facets (e.g. `variants.prices.centAmount`, `variants.availability.isOnStock`, `variants.attributes.search-color.key`). Adjust or extend in `defineCommercetools` to match your product types and searchable attributes.

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **ctp-anon-token** | Anonymous session access token for Commercetools (me, cart). Set by the token cache when using anonymous session flow. |
| **ctp-anon-refresh-token** | Refresh token for the anonymous session. |

Without these cookies, the app uses client credentials only; `GetCurrentCartQuery` and cart actions will not have a customer cart and may return empty id or create one-off carts depending on implementation.

## Summary checklist

- Add `@laioutr-app/commercetools` and `@laioutr-core/orchestr` (and `@nuxt/image` if using images) to Nuxt modules.
- Set `apiURL`, `authURL`, `projectKey`, `clientId`, `clientSecret` under `@laioutr-app/commercetools` (e.g. from env).
- Ensure the Commercetools API client has scope `manage_project:{projectKey}` and that anonymous sessions are enabled if you use cart/me.
- Rely on orchestr queries/actions/links/resolvers for cart, menu, product, and variant data; extend facets/sortings in middleware if needed.
- Use canonical media with `provider: "commercetools"` for product/variant images; configure Nuxt Image with a Commercetools provider if required.
