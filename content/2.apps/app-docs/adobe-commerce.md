---
title: Adobe Commerce
description: Developer documentation for the Laioutr Adobe Commerce app package. Connect your Nuxt frontend to Adobe Commerce (Magento) via the GraphQL API.
seo:
  title: Adobe Commerce | Laioutr
  description: Developer documentation for the Laioutr Adobe Commerce app package. Connect your Nuxt frontend to Adobe Commerce…
sitemap:
  loc: /apps/app-docs/adobe-commerce
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/adobe-commerce** package integrates a Laioutr-powered Nuxt app with [Adobe Commerce](https://business.adobe.com/products/magento/magento-commerce.html) (Magento). It uses the **Adobe Commerce GraphQL API** for categories, products, cart, and catalog search. The package registers with the Laioutr orchestr (queries, actions, links, component resolvers, query template providers), provides a **Nuxt Image** provider for Adobe Commerce media (with responsive thumbnails), and exposes canonical ecommerce capabilities so your UI can stay backend-agnostic.

Authentication is via a **Bearer access token** (admin/integration token or customer token). The module expects `baseURL`, credentials (`accessToken`; `consumerKey`, `consumerSecret`, `accessTokenSecret` are in the config for future use), and **imagesConfig** for image dimensions and optional probing. Cart is identified by the **cart ID** stored in the cookie `cart-id`; the package creates a new cart when needed and persists the ID in that cookie.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/adobe-commerce`** in `nuxt.config.ts` (or via `runtimeConfig` / `laioutrrc.json`). Required options: `baseURL`, `consumerKey`, `consumerSecret`, `accessToken`, `accessTokenSecret`. **imagesConfig** has defaults.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`baseURL`** | `string` | Adobe Commerce instance base URL (no trailing slash), e.g. `https://your-domain.com`. Used to build the GraphQL endpoint (default `${baseURL}/graphql`). |
| **`consumerKey`** | `string` | OAuth consumer key (reserved for future OAuth/integration flows). Keep secret; store in private config only. |
| **`consumerSecret`** | `string` | OAuth consumer secret. Keep secret; store in private config only. |
| **`accessToken`** | `string` | **Bearer** access token (admin/integration token or customer token). Sent as `Authorization: Bearer <token>` on every GraphQL request. Required for the SDK. |
| **`accessTokenSecret`** | `string` | OAuth access token secret (reserved for future use). Keep secret. |
| **`imagesConfig`** | `object` | Image handling. **`optInForProbing`** (optional): detect image dimensions via probing; default `false`. **`smallImageSize`**: `{ width, height }` for small image (default 1000×1000). **`thumbnailSize`**: `{ width, height }` for thumbnail (default 600×600). Used by media mappers and the Nuxt Image provider. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/adobe-commerce', '@laioutr-core/orchestr', '@nuxt/image'],
  '@laioutr-app/adobe-commerce': {
    baseURL: process.env.ADOBE_COMMERCE_BASE_URL!,
    consumerKey: process.env.ADOBE_COMMERCE_CONSUMER_KEY!,
    consumerSecret: process.env.ADOBE_COMMERCE_CONSUMER_SECRET!,
    accessToken: process.env.ADOBE_COMMERCE_ACCESS_TOKEN!,
    accessTokenSecret: process.env.ADOBE_COMMERCE_ACCESS_TOKEN_SECRET!,
    imagesConfig: {
      optInForProbing: false,
      smallImageSize: { width: 1000, height: 1000 },
      thumbnailSize: { width: 600, height: 600 },
    },
  },
});
```

Use environment variables (or a similar secret source) for all credentials in production; do not commit them.

### Runtime behavior

- **GraphQL client**  
  The package builds an **AdobeCommerceSDK** (GraphQL client via `graphql-request`) per request with `baseURL` and `credentials: { accessToken }`. The endpoint is `${baseURL}/graphql` unless overridden. Optional **Store** header can be set for multi-store. The SDK is used for both catalog (admin) and cart; **adobeCommerceClient** and **adobeCommerceAdminClient** are created with the same access token and passed into the orchestr context.

- **Cart cookie**  
  Cart is identified by the **cart ID** in the cookie **`cart-id`** (httpOnly, secure, sameSite: strict, path: /, maxAge 30 days). **GetCurrentCartQuery** returns the cookie value (may be empty). **CartAddItemsAction** calls **assertCartIdExists**: if no cookie, it creates an empty cart via GraphQL, sets the cookie, then adds items.

- **Passthrough tokens**  
  The package uses **categoriesPassthroughToken**, **productsPassthroughToken**, and **variantsPassthroughToken** to avoid refetching: menu and category queries set categories; product-by-category and variants link set products/variants; resolvers read from passthrough when available.

- **Public assets**  
  The module registers `runtime/app/public` as Nitro public assets (e.g. app logo at `/app-adobe-commerce/adobe-commerce-logo.svg`) with a 7-day cache.

- **Nuxt Image provider**  
  The package registers a **nuxtImageProviders** entry `adobecommerce` so Nuxt Image can resolve and optimize images. The provider supports width/height modifiers and picks the best-matching thumbnail from the responsive sources encoded in the image URL.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCartQuery** – Returns the current cart ID from the **cart-id** cookie. Returns empty string if no cookie. Cart content is resolved via the cart resolver.

- **Category**  
  - **CategoryBySlugQuery** – Resolves category by slug (url_key). Uses **getCategoryBySlug**. Throws **CategoryNotFoundError** if not found. Stores category in passthrough. Returns `{ id: category.uid }`.

- **Menu**  
  - **MenuByAliasQuery** – Categories as menu. `alias === "root"` fetches all top-level categories via **getAllCategories**; otherwise fetches category by slug and uses its children. Flattens tree, stores in **categoriesPassthroughToken**. Returns `ids` (category uids). Cached (TTL 1 hour, keyed by alias).

- **Product**  
  - **ProductBySlugQuery** – Product by slug (url_key). Uses **getProductBySlug** with requested components/links flags. Stores product in **productsPassthroughToken**. Throws **ProductNotFoundError** if not found. Returns `{ id: product.sku }`. Cached (TTL 24h, keyed by slug).  
  - **ProductsByCategorySlugQuery** – Product listing by category slug. Resolves category via SEO resolver, then **getProductsByCategorySlug** with filter, sort, pagination. Returns `ids` (product SKUs), `total`, `sorting`, `availableFilters`, `availableSortings`. Uses mappers to convert Adobe Commerce aggregations/sort fields to canonical shapes. Cached (SWR 1 day; cache key only for “landing” requests). Stores products in passthrough.

### Query template providers

- **MenuByAliasQuery** – Supplies templates: optional “Root” entry, plus one per category from **getAllCategories** or **searchCategories** (if term length ≥ 3). Input `alias` = category url_key or uid; label = category name or meta_title.  
- **ProductsByCategorySlugQuery** – Supplies one template per category (flattened tree). Input `categorySlug` = category url_key or uid; label = category name or meta_title. Search filter (term ≥ 3) uses **searchCategories**.

### Actions

- **Cart**  
  - **CartAddItemsAction** – Adds line items to the cart. Ensures a cart exists via **assertCartIdExists** (creates one and sets cookie if needed). Input items with `type === "product"` are sent as `{ sku: variantId, quantity }` to **addItemsToCart**. Uses **adobeCommerceClient** (same token as admin in current implementation).

### Links

- **Product**  
  - **ProductVariantsLink** – Resolves product IDs (SKUs) to variant SKUs. Uses passthrough when set; otherwise **getProductsBySku** with `includeProductVariant`. For configurable products, returns child variant SKUs; for simple products, returns the product SKU as the only target. Stores products in **variantsPassthroughToken**. Cached (SWR 1 day for landing requests).

### Component resolvers

- **Cart** – Resolves cart by id. Provides **CartBase** (totalQuantity) and **CartCost** (subtotal, total, totalTax, taxesIncluded, etc.). Uses **getCartById**.
- **Category** – Resolves categories by id (uid). Provides **CategoryBase**, **CategoryContent**, **CategoryMedia**, **CategorySeo**. Uses passthrough or **getCategoriesByIds**. Maps description, image, meta_title, meta_description. Cached (TTL 1 hour).
- **MenuItem** – Resolves menu items (categories). Provides **MenuItemBase** (name, type link, reference type category, slug, id, childIds, parentId). Uses passthrough or **getCategoriesByIds**. Cached (TTL 1 hour).
- **Product** – Resolves products by id (SKU). Provides **ProductBase**, **ProductDefaultVariant**, **ProductDescription**, **ProductInfo**, **ProductMedia**, **ProductPrices**, **ProductSeo**, **ProductFlags**. Uses passthrough or **getProductsBySku**. Maps media (image, small_image, thumbnail, media_gallery), price range, url_key, manufacturer. Component cache: 1 day; prices 15 minutes.
- **ProductVariant** – Resolves variants by SKU. Provides **ProductVariantBase**, **ProductVariantInfo**, **ProductVariantAvailability**, **ProductVariantPrices**, **ProductVariantQuantityPrices**, **ProductVariantQuantityRule**, **ProductVariantShipping**, **ProductVariantOptions**. Uses **variantsPassthroughToken** or **getProductsBySku**. Maps stock_status, only_x_left_in_stock, price_range, price_tiers, media, options. Component cache: 1 day; prices 15 minutes.

## Images and media

Product and category media are mapped to canonical **MediaImage** / **MediaVideo** with **provider: "adobecommerce"**. The package provides:

- **Media mappers** – **mapImageFragment**, **mapMediaFragment**, **mapResponsiveImageFragment** (uses **imagesConfig** for small_image and thumbnail dimensions, or probing when **optInForProbing** is true). Responsive URLs encode multiple thumbnail URLs and dimensions for the Nuxt Image provider.
- **Nuxt Image provider** – Registered as **adobecommerce**. Accepts the encoded src (base URL + `#` + thumbnail list); supports **width** and **height** modifiers and returns the best-matching thumbnail URL and dimensions.

Ensure **@nuxt/image** is in your Nuxt config when using the provider.

## Backend requirements

- **Adobe Commerce instance** – GraphQL API enabled (typically at `/graphql`). Store configured with categories and products (url_key, SKU, price, inventory, etc.).
- **Access token** – Integration or admin token with permissions for catalog (categories, products), cart (create cart, add items, get cart). For customer-specific features, a customer token can be used (future).
- **Store header** – For multi-store, set **storeCode** in the SDK options so the **Store** header routes requests to the correct store.
- **GraphQL schema** – The package uses generated types and operations from the Adobe Commerce GraphQL schema (see `types/__generated__/graphql.ts` and codegen). Ensure your schema matches or extend the queries/mutations used.

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **cart-id** | Adobe Commerce cart ID. Set when a new cart is created (e.g. on first add-to-cart). Used by GetCurrentCartQuery and CartAddItemsAction. |

## Errors

- **CategoryNotFoundError** – Thrown from **CategoryBySlugQuery** when no category matches the given slug. Code: `CATEGORY_NOT_FOUND`.
- **ProductNotFoundError** – Thrown from **ProductBySlugQuery** when no product matches the given slug. Code: `PRODUCT_NOT_FOUND`.

## Summary checklist

- Add **@laioutr-app/adobe-commerce** to Nuxt modules.
- Set **baseURL**, **consumerKey**, **consumerSecret**, **accessToken**, **accessTokenSecret**, and optionally **imagesConfig** under `@laioutr-app/adobe-commerce` (e.g. from env).
- Ensure the Adobe Commerce GraphQL API is reachable and the access token has catalog and cart permissions.
- Rely on orchestr queries, actions, links, resolvers, and query template providers for cart, menu, category, product, and variant data.
- Use the **adobecommerce** Nuxt Image provider for product/category images when using Nuxt Image.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
