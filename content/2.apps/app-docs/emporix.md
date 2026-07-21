---
title: Emporix
description: Developer documentation for the Laioutr Emporix app package. Connect your Nuxt frontend to Emporix via the Emporix API with anonymous or authenticated auth.
seo:
  title: Emporix
  description: Developer documentation for the Laioutr Emporix app package. Connect your Nuxt frontend to Emporix via the Emporix API…
sitemap:
  loc: /apps/app-docs/emporix
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/emporix** package integrates a Laioutr-powered Nuxt app with [Emporix](https://www.emporix.com/). It uses the **Emporix API** (categories, products, search, prices, availability, cart). The package registers with the Laioutr orchestr (queries, actions, links, component resolvers, query template provider), and maps Emporix media to the canonical media shape with provider `emporix` for use with Nuxt Image.

Auth is **anonymous** by default: if no `accessToken` cookie is present, the SDK calls the anonymous login endpoint and sets the token in a cookie so subsequent requests (cart, product, category) use the same session. The package also supports admin (client-credentials) auth for future use. Cart and catalog are driven by the Emporix tenant and site (e.g. `siteCode: "main"`).

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/emporix`** in `nuxt.config.ts` (or via `runtimeConfig`). Four options are required for the API; two are required for category listing with filters and sortings.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`baseURL`** | `string` | Emporix API base URL. Default: `https://api.emporix.io`. |
| **`clientId`** | `string` | API client ID. Sent as `client_id` and used for anonymous login and admin token. |
| **`clientSecret`** | `string` | API client secret (e.g. for admin client_credentials). Keep this secret and only use it on the server. |
| **`tenant`** | `string` | Emporix tenant identifier. Default: `laioutr`. Used in all API paths. |
| **`availableFilters`** | `Array<AvailableFilter>` | Filters offered for product listing (from `@laioutr-core/orchestr/types`, see [Filters](/frontend/orchestr/filters)). Passed through to query results. |
| **`availableSortings`** | `Array<AvailableSorting>` | Sort options for product listing. Passed through to query results. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/emporix', '@laioutr-core/orchestr', '@nuxt/image'],
  '@laioutr-app/emporix': {
    baseURL: process.env.EMPORIX_BASE_URL ?? 'https://api.emporix.io',
    clientId: process.env.EMPORIX_CLIENT_ID!,
    clientSecret: process.env.EMPORIX_CLIENT_SECRET!,
    tenant: process.env.EMPORIX_TENANT ?? 'laioutr',
    availableFilters: [/* ... */],
    availableSortings: [/* ... */],
  },
});
```

Use environment variables for `clientId` and `clientSecret` in production; do not commit them.

### Runtime behavior

- **Emporix SDK**  
  The package builds an **EmporixSDK** instance per request with `baseURL`, `clientId`, `clientSecret`, and `tenant`. Every orchestr request runs **assertIsAuthOrAnon({ event })**: if the request has no `accessToken` cookie, the SDK calls `/customerlogin/auth/anonymous/login`, then sets the returned `access_token` in a cookie (`accessToken`, httpOnly, secure, sameSite: lax, maxAge: expires_in). The same token is used for cart and catalog APIs. The SDK is passed into the orchestr context as `emporixClient`.

- **Admin auth (optional)**  
  The middleware includes a TODO for admin client initialization (`assertIsAdminAuth()`). Admin auth would use client_credentials against `/oauth/token` and cache the token (e.g. in userland cache) for admin-only operations.

- **Passthrough tokens**  
  The package uses passthrough tokens to avoid refetching: **categoriesPassthroughToken** (menu by-alias), **productsPassthroughToken** (products by category slug/id), **variantsPassthroughToken** (product variants link). Resolvers read from passthrough when available.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCartQuery** – Returns the current cart ID. Calls `emporixClient.assertHasCart({ siteCode: "main" })` (GET carts with `create: true`). Returns `{ id: cart.id }`.

- **Menu**  
  - **MenuByAliasQuery** – Categories as menu. `alias === "root"` calls `listCategories({})` and filters to categories without `parentId`; otherwise calls `listCategories({ parentCategoryId: alias })`. Results are stored in **categoriesPassthroughToken**. Returns `{ ids, total }`.

- **Product**  
  - **ProductBySlugQuery** – Product by code (slug). Calls `searchProducts({ q: \`code:${slug}\` })` and returns `{ id: product.id }`.  
  - **ProductsByCategorySlugQuery** – Product listing by category slug. Resolves category by slug from flattened category tree, then **listCategoryAssignments**(categoryId) with pagination and sort, then **searchProducts** by those product IDs. Stores products in **productsPassthroughToken**. Returns `ids`, `availableFilters`, `availableSortings`. Throws **CategoryNotFoundError** if category is missing.  
  - **ProductsByCategoryIdQuery** – Same as by slug but input is `categoryId`. Uses **listCategoryAssignments** and **searchProducts**, stores products in passthrough, returns `ids`, `availableFilters`, `availableSortings`.

### Actions

- **Cart**  
  - **CartAddItemsAction** – Adds line items to the cart. Input items with `type === "product"` are resolved by product ID via **searchProducts**; then **retrieveProductsPrices** is called for those IDs. Throws **ProductsNotFoundError** if products or price info are missing. Calls **addItemToCart** with item YRN, price (priceId, effectiveAmount, originalAmount, currency), quantity, and `siteCode: "main"`.

### Links

- **Product**  
  - **ProductVariantsLink** – Resolves product IDs to variant IDs. For each product ID calls **listProductVariants**(productId). Stores variant products in **variantsPassthroughToken**. Returns `sourceId` (product id) → `targetIds` (variant product ids).

### Query template provider

- **MenuByAliasQuery** – Provides template inputs for building static/menu pages: one template for `alias: "root"` (label "Root") and one per category from **listCategories** (input `alias: category.id`, label category name). Note: implementation may use `listCategories({ onlyRoots: false })`; confirm SDK supports the same parameters in your Emporix API version.

### Component resolvers

- **Cart** – Resolves cart entities by id. Provides **CartBase** (totalQuantity, discountCodes empty) and **CartCost** (subtotal, total, totalTax, totalIsEstimated, etc.). Uses **getCartById**(cartId) with `expandCalculation: true`.

- **MenuItem** – Resolves category entities. Uses **categoriesPassthroughToken** when set; otherwise fetches each category by id via **getCategory**. Provides **MenuItemBase** (name, type reference, slug from code or id, childIds from subcategories, parentId). Cached with TTL 1 hour.

- **Product** – Resolves products by id. Uses **productsPassthroughToken** when set; otherwise **searchProducts** by ids. Calls **retrieveProductsPrices** for price info. Provides **ProductBase**, **ProductDescription**, **ProductInfo**, **ProductMedia**, **ProductPrices**, **ProductSeo**, **ProductFlags**. Maps name, code/slug, description, media (first as cover), price and strikethrough from effective/original amount.

- **ProductVariant** – Resolves variants by id. Uses **variantsPassthroughToken** when set; otherwise **searchProducts** by ids. Calls **retrieveProductsPrices** and **retrieveProductAvailability** per product. Provides **ProductVariantBase**, **ProductVariantInfo**, **ProductVariantAvailability**, **ProductVariantPrices**, **ProductVariantQuantityPrices**, **ProductVariantQuantityRule**, **ProductVariantShipping**, **ProductVariantOptions**. Maps code as SKU, availability from Emporix availability API, tier prices from price model.

## Images and media

Product and variant media from Emporix are mapped to the canonical **MediaImage** type with `provider: "emporix"` and `sources[].src` set to the media URL. The module installs **@nuxt/image** on prepare; use an Emporix Nuxt Image provider if your setup requires it to serve or transform these URLs.

## Backend requirements

- **Emporix tenant** – Create a tenant in Emporix and note the tenant code, API base URL, and credentials.
- **API client** – Create an API client (client_id and client_secret) with access to anonymous login, cart, category, product, price, and availability APIs.
- **Catalog** – Categories with codes and parent/child structure; products with codes, names, descriptions, media; product–category assignments for listing by category.
- **Site** – Cart and catalog use a site code (e.g. `main`). Ensure the tenant has the correct site configured.

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **accessToken** | Emporix session access token (anonymous or authenticated). Set after anonymous login; used for cart and catalog API calls. |

Without this cookie, the first request triggers anonymous login and sets it; subsequent requests reuse it until expiry.

## Errors

- **CategoryNotFoundError** – Thrown from **ProductsByCategorySlugQuery** when no category matches the given slug.
- **ProductsNotFoundError** – Thrown from **CartAddItemsAction** when one or more product IDs are not found or lack price info (implementation may throw only when multiple are missing).

## Summary checklist

- Add `@laioutr-app/emporix`, `@laioutr-core/orchestr`, and `@nuxt/image` to Nuxt modules.
- Set `baseURL`, `clientId`, `clientSecret`, `tenant`, `availableFilters`, `availableSortings` under `@laioutr-app/emporix` (e.g. from env).
- Ensure the Emporix API client has anonymous login and access to cart, category, product, price, and availability.
- Rely on orchestr queries/actions/links/resolvers and the MenuByAliasQuery template provider for cart, menu, product, and variant data.
- Use canonical media with `provider: "emporix"` for product/variant images; configure Nuxt Image with an Emporix provider if required.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-emporix/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-emporix**](https://github.com/laioutr/app-emporix).
