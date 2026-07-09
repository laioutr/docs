---
title: Sylius
description: Developer documentation for the Laioutr Sylius app package. Connect your Nuxt frontend to a Sylius backend via the Shop API v2.
seo:
  title: Sylius
  description: Developer documentation for the Laioutr Sylius app package. Connect your Nuxt frontend to a Sylius backend via the Shop API v2.
sitemap:
  loc: /apps/app-docs/sylius
  lastmod: 2026-05-21
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/sylius** package integrates a Laioutr-powered Nuxt app with [Sylius](https://sylius.com/), the open-source headless eCommerce platform built on [Symfony](https://symfony.com/). It talks to the **Sylius Shop API v2** (`/api/v2/shop`) via [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) using a TypeScript client generated from the Sylius OpenAPI spec.

The package registers with the Laioutr orchestr (queries, actions, links, component resolvers) and maps Sylius resources to canonical ecommerce entities (Product, ProductVariant, Category, MenuItem, BreadcrumbItem, Cart, CartItem).

### MVP scope

This release is intentionally narrow. Anything not listed is out of scope.

- **Read** – Product, ProductVariant (PLP, PDP, variant selection), Category, MenuItem, BreadcrumbItem (taxon-derived navigation).
- **Write** – Cart line-items only: **Add**, **Update quantity**, **Remove**. **No checkout.**
- **Out of scope** – Customer authentication, addresses, payments, shipping, CMS pages, wishlist, bundles, reviews, attributes, associations, promotions.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/sylius`** in `nuxt.config.ts` (or via `runtimeConfig`).

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`apiURL`** | `string` | **Required.** Sylius **Shop API v2** base URL, e.g. `http://localhost/api/v2/shop` or `https://your-store.example.com/api/v2/shop`. The origin is used to build the API client; the path identifies the Shop API. |
| **`defaultLocale`** | `string` | Fallback `Accept-Language` sent with every request when the orchestr client environment does not provide a locale. Default: `en_US`. |
| **`imageFilter`** | `string` | [LiipImagine](https://symfony.com/bundles/LiipImagineBundle/current/index.html) filter Sylius applies server-side before returning image URLs. Sent as the `imageFilter` query parameter on every product/variant fetch, so `image.path` comes back as a ready-to-use absolute URL. Default: `sylius_large`. |
| **`itemsPerPage`** | `number` | Default pagination size for list queries (e.g. category PLPs). Default: `20`. |

### Example configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@laioutr-app/sylius'],
  '@laioutr-app/sylius': {
    apiURL: process.env.SYLIUS_SHOP_API_URL ?? 'http://localhost/api/v2/shop',
    defaultLocale: 'en_US',
    imageFilter: 'sylius_large',
    itemsPerPage: 20,
  },
});
```

### Runtime behavior

- **Shop API client** – A `createSyliusClient` instance is built per request with `apiURL`, the active `locale` (from the orchestr `clientEnv` or `defaultLocale`), `itemsPerPage`, and `imageFilter`. Headers default to `Accept: application/ld+json` and `Accept-Language: <locale>`. The client is exposed to handlers via `context.syliusClient`.

- **Hydra responses** – Sylius returns JSON-LD with [Hydra](https://www.hydra-cg.com/) collections (`hydra:member`, `hydra:totalItems`). The client unwraps collections into `{ items, total }` before they reach the orchestr handlers.

- **No Admin API** – The MVP does not call the Sylius Admin API. Everything goes through the Shop API.

- **Write surface is single-sourced** – By design, only the client module issues non-GET HTTP requests (`createCart`, `addCartItem`, `changeCartItemQuantity`, `removeCartItem`). Orchestr handlers, mappers, and helpers are read-only and delegate every write to the client.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. For exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**
  - **GetCurrentCartQuery** – Returns the current cart id (the cart token from cookie) if a cart exists; otherwise `{ id: undefined }`. No cart is created on read.
- **Category**
  - **CategoryBySlugQuery** – Resolves a Sylius **taxon** by slug; returns the canonical entity id (`taxon:<code>`).
- **Menu**
  - **MenuByAliasQuery** – Returns a flat, parent-before-children list of taxon entity ids. The `alias` argument is resolved directly as a **Sylius taxon code** (e.g. `MENU_CATEGORY`); there is no separate alias-to-code mapping. The tree is BFS-walked up to a depth of 5. `MenuItem.parentId` is **never** emitted because the Shop `taxon.show` schema does not expose `parent` — reconstruct the tree top-down from `childIds`.
- **Product**
  - **ProductBySlugQuery** – Resolves a product by slug; returns the Sylius product `code` as id.
  - **ProductsByCategorySlugQuery** – Listing by taxon slug with pagination and sort. Sortings: `name:asc`, `name:desc`, `price:asc`, `price:desc` (default `name:asc`). Filters: none in MVP. The Sylius `taxon` query parameter is recursive — filtering by a parent IRI returns products in that taxon and all descendants.

### Actions (cart line-items)

- **CartAddItemsAction** – Adds line items to the cart. Creates the cart on demand if no `sylius-cart-token` cookie is set (or if the existing token no longer resolves), then `POST /api/v2/shop/orders/{tokenValue}/items` per item. Only items with `type === 'product'` are processed.
- **CartUpdateItemsAction** – `PATCH` each item’s quantity. The canonical `itemId` is decoded as `<cartToken>::<orderItemId>`; items without a quantity are skipped.
- **CartRemoveItemsAction** – `DELETE` each item by decoded `orderItemId`. Throws if no cart token is present.

There is **no checkout action** in this package.

### Links

- **ProductBreadcrumbLink** – Breadcrumb trail derived from the product’s `mainTaxon`. Uses Sylius’s `/api/v2/shop/taxon-tree/{code}/path` endpoint to fetch the full ancestor chain (root → leaf) in a single request.
- **ProductVariantsLink** – Lists variant codes per product via `/api/v2/shop/product-variants?product[]=...`.
- **CartItemsLink** – Resolves a cart token to its line items, exposing each as `<cartToken>::<orderItemId>`.
- **CartItemProductVariantLink** – Resolves a cart item to its underlying variant code.

### Component resolvers

- **Product** – Maps to `ProductBase`, `ProductInfo`, `ProductMedia`, `ProductPrices`, `ProductSeo`, `ProductDescription`, `ProductFlags`, `ProductDefaultVariant`. Prices use `defaultVariantData.price` / `originalPrice`; `isOnSale` and `strikethroughPrice` are derived from the delta. `isStartingFrom` is true when the product has more than one variant. Cache: 1 day, with `prices` sub-component at 15 minutes.
- **ProductVariant** – Maps to `ProductVariantBase`, `ProductVariantInfo`, `ProductVariantPrices`, `ProductVariantOptions`, `ProductVariantAvailability`. Options are resolved through a per-request cache that fetches `/product-options` and `/product-option-values` once and reuses the result for concurrent resolves. Cache: 1 day, `prices` at 10 minutes, `availability` uncached.
- **Category** – Maps a taxon to `CategoryBase` (slug, title). Cache: 1 day.
- **MenuItem** – Maps a taxon to `MenuItemBase` (`type: 'link'`, name, link reference, `childIds`). `parentId` is not emitted. Cache: 1 day.
- **BreadcrumbItem** – Maps a taxon to `BreadcrumbItemBase` (name, link reference). Cache: 1 day.
- **Cart** – Maps a cart token to `CartBase` (totalQuantity) and `CartCost` (subtotal, total, tax) in the cart’s `currencyCode`.
- **CartItem** – Maps `<cartToken>::<orderItemId>` to `CartItemBase` (type `'product'`, quantity, title, subtitle) and `CartItemCost` (single, subtotal, total).

### Entity ID conventions

The connector uses stable, decode-friendly ids so other handlers can round-trip them without extra lookups:

| Entity | ID format | Example |
|--------|-----------|---------|
| Product / ProductVariant | Sylius `code` | `MUG-001` |
| Category / MenuItem / BreadcrumbItem | `taxon:<code>` | `taxon:MENU_CATEGORY` |
| Cart | Sylius cart `tokenValue` | `7a9c…` |
| CartItem | `<cartToken>::<orderItemId>` | `7a9c…::42` |

### Image provider

- **Provider name:** `sylius`
- **How it works:** Product and variant media are mapped to the canonical `MediaImage` type with `sources[].src` set to the Sylius `image.path`. Because the client sends `imageFilter` on every request, that path is already a fully-resolved URL like `http://your-store/media/cache/resolve/sylius_large/<hash>.webp` — no client-side transformation is needed.

## Backend requirements

- **Sylius version** – A Sylius release that exposes the **API Platform–based Shop API v2** (Sylius 1.13+ recommended).
- **Channel** – A storefront channel with at least one locale, currency, and hostname matching the storefront.
- **Catalog** – Products with taxons, variants, prices, and images assigned to the active channel. Slugs translated for the locales you serve so slug-based queries resolve.
- **Menu root taxon** – A taxon (e.g. `MENU_CATEGORY`) that acts as the storefront menu root. Its code is what the frontend passes as `alias` to `MenuByAliasQuery`.
- **Image filter** – A LiipImagine filter set (default `sylius_large`) defined in the Sylius config.
- **CORS / network** – The Nuxt server must reach the Shop API; the browser does not call the Shop API directly.

## Cookies and session

| Cookie | Purpose |
|--------|---------|
| **`sylius-cart-token`** | Sylius `tokenValue` for the current cart/order. Set on cart creation and read on every cart query/action. Options: `httpOnly`, `secure`, `sameSite=lax`, `path=/`, `maxAge=30d`. |

There is no customer/session cookie in the MVP — there is no customer auth.

## Codegen

Sylius types are generated from the OpenAPI spec into `src/runtime/server/client/sylius-types.ts` and committed:

```sh
pnpm gen:sylius
```

The script fetches `/api/v2/docs` from the configured Sylius backend (default `http://localhost`) and runs [`openapi-typescript`](https://openapi-ts.dev/) against it.

## Summary checklist for developers

1. **Sylius instance** – Shop API v2 reachable; channel(s) configured with locales, currencies, hostnames; LiipImagine `sylius_large` (or your chosen filter) defined; menu root taxon (e.g. `MENU_CATEGORY`) created.
2. **Catalog data** – Products with taxons, variants, prices, images, and translated slugs.
3. **Nuxt config** – Add `@laioutr-app/sylius` to `modules` and set `apiURL` (plus optional `defaultLocale`, `imageFilter`, `itemsPerPage`).
4. **Environment** – Put the API URL in env vars; ensure the Nuxt server can reach the Sylius origin.
5. **Frontend** – Use the canonical queries, actions, links, and resolvers from your UI. Pass the menu root **taxon code** as the menu `alias`. Reconstruct the menu tree top-down from `childIds`.
6. **Images** – Use the `sylius` Nuxt Image provider for Sylius media.
7. **Checkout** – Plan the checkout flow outside this package (it is not in MVP scope).

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-sylius/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-sylius**](https://github.com/laioutr/app-sylius).
