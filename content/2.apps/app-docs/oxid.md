---
title: OXID eShop
description: Developer documentation for the Laioutr OXID app package. Connect your Nuxt frontend to OXID eShop via the GraphQL API with token-based auth and basket cookie.
seo:
  title: OXID eShop | Laioutr
  description: Developer documentation for the Laioutr OXID app package. Connect your Nuxt frontend to OXID eShop via the GraphQL API…
sitemap:
  loc: /apps/app-docs/oxid
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr/app-oxid** package integrates a Laioutr-powered Nuxt app with [OXID eShop](https://www.oxid-esales.com/). It uses the **OXID GraphQL API** for products, categories, search, basket (cart), and menu. The package registers with the Laioutr orchestr (queries, actions, links, component resolvers, query template providers) and provides a Nuxt Image provider that selects the best-fit OXID thumbnail for requested dimensions.

Auth is **token-based**: the module logs in with a configured user and password to obtain a Bearer token, which is then used for all GraphQL requests. The cart is identified by a **basket ID** stored in a cookie; the middleware ensures a basket exists on each request and creates one if missing.

To use it, add the module to your Nuxt config and set the GraphQL URL plus user credentials. The package then exposes canonical ecommerce capabilities so your UI can stay backend-agnostic while talking to OXID.

## Configuration requirements

The module expects configuration under the key **`@laioutr/app-oxid`** in `nuxt.config.ts` (or via `runtimeConfig`). Three options are **required**; image sizes are optional with defaults.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`graphqlURL`** | `string` | OXID GraphQL API base URL (e.g. your OXID GraphQL endpoint). |
| **`user`** | `string` | API user name used to obtain the Bearer token (login). |
| **`password`** | `string` | API password for the same user. Keep this secret and only use it on the server. |
| **`imagesConfig`** | `object` | Optional. Thumbnail size presets used by OXID and by the image provider. See [OXID image configuration](https://docs.oxid-esales.com/eshop/en/7.0/configuration/images.html). |

### imagesConfig (optional)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **`thumbImageSize`** | `{ width: number; height: number }` | `{ width: 500, height: 500 }` | Thumbnail dimensions. |
| **`iconImageSize`** | `{ width: number; height: number }` | `{ width: 100, height: 100 }` | Icon/small image dimensions. |
| **`zoomImageSize`** | `{ width: number; height: number }` | `{ width: 1200, height: 1200 }` | Zoom/large image dimensions. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr/app-oxid', '@laioutr-core/orchestr', '@nuxt/image'],
  '@laioutr/app-oxid': {
    graphqlURL: process.env.OXID_GRAPHQL_URL!,
    user: process.env.OXID_USER!,
    password: process.env.OXID_PASSWORD!,
    imagesConfig: {
      thumbImageSize: { width: 500, height: 500 },
      iconImageSize: { width: 60, height: 60 },
      zoomImageSize: { width: 600, height: 600 },
    },
  },
});
```

Use environment variables for `user` and `password` in production; do not commit them.

### Runtime behavior

- **GraphQL client**  
  The package builds an **OxidSDK** (GraphQL client) per request. It calls the **Token** query with `user` and `password` to obtain a Bearer token, then sends it in the `Authorization` header for all subsequent requests (categories, products, basket).

- **Basket (cart)**  
  The orchestr middleware runs **assertCurrentBasketExists({ event })** on each request: it reads the cookie **`oxid-basket-id`**. If missing, it creates a new basket via the **BasketCreate** mutation and sets the returned basket ID in the cookie (`oxid-basket-id`, httpOnly, secure, sameSite: none, path: `/`, maxAge: 30 days). Cart queries and add-to-cart actions use this basket ID.

- **Passthrough**  
  The package uses passthrough tokens to avoid refetching: **productsPassthroughToken**, **categoriesPassthroughToken**, **variantsPassthroughToken**, **cartFragmentToken**, **suggestionResultsFragmentToken**. Resolvers and links read from passthrough when available.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCartQuery** – Returns the current cart ID (from cookie). Fetches full basket with product/variant fragments and stores it in **cartFragmentToken**. Returns `{ id: basket.id }` or `{ id: undefined }` if no basket.

- **Category**  
  - **MenuByAliasQuery** – Navigation menu by alias. `alias === "root"` returns top-level categories; otherwise returns children of the category identified by the alias (parsed from a composite menu id). Results stored in **categoriesPassthroughToken**. Returns category IDs.

- **Product**  
  - **ProductBySlugQuery** – Product by SEO slug. Parses the slug to extract the product ID (OXID slug format) and returns `{ id }`.  
  - **ProductSearchQuery** – Full-text search by title (contains filter) with pagination and sort. Stores products in **productsPassthroughToken**. Returns product IDs.  
  - **ProductsByCategorySlugQuery** – Product listing by category slug. Resolves category by slug, then fetches products for that category with pagination and sort. Supports **availableFilters** (mapped from manufacturers/vendors) and **availableSortings** (price, rating, title ASC/DESC). Stores products in **productsPassthroughToken**. Returns `ids`, `availableFilters`, `availableSortings`.

- **Suggested search**  
  - **SuggestedSearchSearchQuery** – Predictive/suggested search. Returns categories and products matching the query (title/category title), limited (e.g. 10 each). Stores suggestion entries in **suggestionResultsFragmentToken**. Returns a single suggestion result id.

### Query template providers

- **ProductsByCategorySlugQuery** – Supplies “products by category slug” templates: lists categories (optionally filtered by term) and returns inputs with `categorySlug` (from category SEO slug).  
- **MenuByAliasQuery** – Supplies “menu by alias” templates: lists categories and returns inputs with `alias: "root"` or alias derived from category id for submenus.

### Actions

- **Cart**  
  - **CartAddItemsAction** – Adds line items to the current basket. Input items with `type === "product"` are added via the basket add-item mutation (productId, amount). Uses the basket ID from the request context (cookie). Other item types are ignored.

### Links

- **Product**: **ProductVariantsLink** – Resolves variant IDs per product (or product id as single “variant” if no variants). Uses **productsPassthroughToken** or fetches products with variant data; stores flat list in **variantsPassthroughToken**.  
- **Cart**: **CartItemsLink** – Links cart to line item IDs from the basket fragment in passthrough.  
- **Suggested search**: **SuggestedSearchEntriesLink** – Links the suggestion result to individual suggestion entry IDs from **suggestionResultsFragmentToken**.

### Component resolvers (entities)

- **Product** – Maps OXID product to canonical Product (base, info, description, media, prices, SEO, defaultVariant). Supports passthrough from product queries.  
- **Product variant** – Maps OXID variant to canonical ProductVariant (base, info, availability, prices, quantityPrices, quantityRule, shipping, options). Uses **variantsPassthroughToken** when available.  
- **Category** – Maps OXID category to canonical Category (base, content, media, SEO). Uses **categoriesPassthroughToken** when available. Cached (e.g. 10 min TTL).  
- **Menu** – Resolves menu/navigation items from category tree (by-alias query).  
- **Cart** – Resolves cart and totals (base, cost) from basket; currency and delivery from OXID cost structure.  
- **Cart item** – Resolves line items (base, cost, productData, availability, quantityRule) from basket items; product link uses product slug from **extractEntitySlug**.  
- **Suggested search entry** – Resolves suggestion entries (id, type, title, link) from the suggestion result in passthrough.

### Image provider

- **Provider name:** `oxid`  
- **Usage:** Use with Nuxt Image when the source is an OXID image URL. The provider accepts a special format: the `src` can contain a fragment (`#`) with a comma-separated list of “url widthxheight” thumbnails (e.g. from OXID’s responsive image data). The provider picks the **best-fit** thumbnail for the requested **width** and **height** modifiers (smallest image that is at least as large as the requested size). If no fragment is present, the original URL is used.  
- **Modifiers:** **width**, **height** (optional).  
- **Registration:** The module registers this provider and depends on `@nuxt/image`; ensure the Nuxt Image module is installed.

## Backend requirements

- **OXID eShop** – An OXID eShop instance with the **GraphQL API** enabled and reachable from your Nuxt server.  
- **API user** – A user and password that can authenticate against the Token query and have permission to read categories, products, manufacturers, vendors, and to create/read/update baskets and add items.  
- **CORS / network** – The Nuxt server must be able to call the OXID GraphQL URL. For cookie-based basket persistence, your frontend domain must be allowed to send the `oxid-basket-id` cookie (sameSite and secure settings are configured by the package).

## Cookies

- **oxid-basket-id** – Stores the current basket (cart) ID. Set when a new basket is created (first request without a basket). Options: httpOnly, secure, sameSite: none, path: `/`, maxAge: 30 days. Ensure your deployment domain and HTTPS setup allow this cookie to be sent and received.

## Summary checklist for developers

1. **OXID instance** – Have an OXID eShop with GraphQL API and note the **GraphQL URL**.  
2. **API user** – Create or use an API user; set **user** and **password** in config (or env).  
3. **Nuxt config** – Add `@laioutr/app-oxid` to `modules` and set **graphqlURL**, **user**, **password** under `'@laioutr/app-oxid'`. Optionally set **imagesConfig**.  
4. **Environment** – Put credentials in env vars; ensure the Nuxt server can reach the OXID GraphQL endpoint.  
5. **Orchestr / frontend** – Use the canonical queries, actions, links, and resolvers from your UI; the package maps them to OXID.  
6. **Images** – Use the `oxid` Nuxt Image provider for OXID media when you have thumbnail lists in the src fragment; otherwise use the raw URL.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-oxid/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-oxid**](https://github.com/laioutr/app-oxid).
