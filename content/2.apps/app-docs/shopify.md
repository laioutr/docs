---
title: Shopify
description: Developer documentation for the Laioutr Shopify app package. Connect your Nuxt frontend to a Shopify store via the Storefront API, Admin API, and Customer Account API.
---

## Overview

The **@laioutr-app/shopify** package integrates a Laioutr-powered Nuxt app with a [Shopify](https://www.shopify.com/) store. It uses three APIs: the **Storefront API** (products, collections, cart, menu, content), the **Admin API** (media library, files), and the **Customer Account API** (OAuth2 login, customer profile, addresses). The package registers with the Laioutr orchestr (queries, actions, links, resolvers, templates), provides a Nuxt Image provider for Shopify CDN media, a media library provider for the Laioutr Studio (list and upload), and sections/blocks for content pages.

To use it, you add the module to your Nuxt config and set the seven required connection options (store domain and IDs, Storefront and Admin tokens, Customer Account OAuth client and redirect URI). The package then exposes canonical ecommerce capabilities so your UI can stay backend-agnostic while talking to Shopify.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/shopify`** in `nuxt.config.ts` (or via `runtimeConfig`). All seven options are **required** for full functionality (Storefront, Admin, and Customer Account features).

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`shopId`** | `string` | Shopify shop identifier. Use the format **`id.myshopify.com`** (e.g. `my-store.myshopify.com`). Required for the Customer Account API URL. |
| **`storeDomain`** | `string` | Store domain in the same format: **`id.myshopify.com`**. Used by the Storefront and Admin API clients to resolve the API base URL. |
| **`privateAccessKey`** | `string` | **Storefront API** private access token. Create a custom app in the Shopify Admin (Settings → Apps and sales channels → Develop apps) and generate a token with Storefront API access. |
| **`adminAccessToken`** | `string` | **Admin API** access token. From the same or another custom app, with Admin API scopes (e.g. `read_products`, `read_files`, `write_files`, `read_metaobject_definitions`, `read_metaobjects` for media library and metaobjects). |
| **`customerAccountApiClientId`** | `string` | OAuth2 **Client ID** for the **Customer Account API**. Created when you enable Customer Account API access for your app (Shopify Admin → App setup). |
| **`customerAccountApiClientSecret`** | `string` | OAuth2 **Client Secret** for the same Customer Account API app. Keep this secret and only use it on the server (the module stores it in private runtime config). |
| **`redirectUri`** | `string` | OAuth2 **redirect URI** for the Customer Account login flow. Must exactly match the redirect URL configured in your Shopify app (e.g. `https://your-frontend.com/api/orchestr/action/oauth/callback` or your Laioutr OAuth callback route). |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/shopify', '@laioutr-core/orchestr', '@nuxt/image'],
  '@laioutr-app/shopify': {
    shopId: process.env.SHOPIFY_SHOP_ID!,
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
    privateAccessKey: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN!,
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
    customerAccountApiClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!,
    customerAccountApiClientSecret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_SECRET!,
    redirectUri: process.env.SHOPIFY_REDIRECT_URI!,
  },
});
```

Use environment variables (or a similar secret source) for all tokens and secrets in production; do not commit them.

### Runtime behavior

- **Storefront API**  
  The package creates a storefront client per request with `storeDomain` and `privateAccessKey`. It sends the buyer’s IP in the `Shopify-Storefront-Buyer-IP` header when available (for geo/rate limiting). Cart is identified by the **cart ID** stored in the cookie `shopify-cart-id`; the client creates or updates the cart via the Storefront API and persists the ID in that cookie.

- **Admin API**  
  The admin client is created with `storeDomain` and `adminAccessToken`. It is used for the media library provider (list files, staged uploads, create file) and any future admin-only features. Ensure the token has the scopes required by those features.

- **Customer Account API**  
  The Customer Account client uses `customerAccountApiClientId`, `customerAccountApiClientSecret`, `redirectUri`, and `shopId` to build the API URL and perform OAuth2. Login redirects the user to Shopify’s authorization URL; after approval, Shopify redirects to `redirectUri` with a code; the package exchanges the code for access/refresh/id tokens and stores them in cookies (`shopify-access-token`, `shopify-refresh-token`, `shopify-id-token`). Authenticated customer requests (e.g. get current customer, addresses) use the access token and refresh it when expired.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCartQuery** – Returns the current cart ID (from cookie); cart content is resolved via the cart resolver.
- **Category (Collection)**  
  - **CategoryBySlugQuery** – Resolves collection by handle (slug); supports products link with pagination, sorting, and filters.
- **Menu**  
  - **MenuByAliasQuery** – Navigation menu by handle (alias); cached (e.g. 10 min TTL).
- **Product**  
  - **ProductBySlugQuery** – Product by handle (slug); supports variants link and breadcrumb link.  
  - **ProductSearchQuery** – Full-text search with pagination, filters, and sort; returns product IDs, total, availableFilters, availableSortings.  
  - **ProductsByCategorySlugQuery** – Product listing by collection handle with pagination, sorting, filters.
- **Blog**  
  - **AllBlogCollectionQuery** – Paginated list of blogs.  
  - **BlogCollectionBySlug** – Single blog by handle.  
  - **BlogPostBySlug** – Single article by handle (within a blog).
- **Content page**  
  - **ContentPageByHandle** – Page by handle (e.g. CMS page).
- **Suggested search**  
  - **SuggestedSearchSearchQuery** – Predictive/suggested search entries (e.g. products, collections, pages).

### Query template providers

- **ProductBySlug** – Supplies “product by handle” query templates.  
- **ProductsByCategorySlug** – Supplies “products by collection handle” templates.  
- **MenuByAlias** – Supplies “menu by handle” templates.  
- **BlogByBlogSlug** – Supplies “blog by handle” templates.

### Actions

- **Auth**  
  - **AuthLoginOauthAction** – Initiates Customer Account OAuth; returns `authorizationUrl` for redirect.  
  - **AuthOAuthCallbackAction** – Handles OAuth callback (code → tokens), validates state/nonce, sets auth cookies.  
  - **AuthLogoutOauthAction** – Clears auth cookies (client should redirect to Shopify logout URL if desired).  
  - **AuthRecoverAction** – Sends password recovery email (Storefront API).
- **Cart**  
  - **CartAddItemsAction** – Adds line items and/or discount codes; creates cart if none exists, stores cart ID in cookie.  
  - **CartUpdateItemsAction** – Updates line item quantities.  
  - **CartRemoveItemsAction** – Removes line items.
- **Customer**  
  - **CustomerGetCurrentAction** – Returns current customer (Customer Account API; requires auth).  
  - **CustomerAddressCreateAction**, **CustomerAddressUpdateAction**, **CustomerAddressDeleteAction** – Create/update/delete address.  
  - **AddressGetAllAction** – List customer addresses.  
  - **CustomerAddressSetDefaultAction** – Set default address.

### Links

- **Product**: **ProductBreadcrumbLink**, **ProductVariantsLink**.  
- **Category**: **CategoryProductsLink**, **CategoryBreadcrumbLink**.  
- **Cart**: **CartItemsLink**.  
- **Blog**: **BlogCollectionPostsLink**; **BlogPostComments**.  
- **Suggested search**: **SuggestedSearchEntriesLink**.

### Component resolvers (entities)

- **Product** – Maps Shopify product/variant to canonical Product (base, info, prices, media, SEO, description, variants, etc.).  
- **Product variant** – Maps variant data.  
- **Category** – Maps collection to canonical Category (base, content, media, SEO, products).  
- **Menu** – Resolves menu/navigation items.  
- **Cart** – Resolves cart and line items.  
- **Cart item** – Resolves individual line items.  
- **Blog** – Resolves blog entity.  
- **Blog post** – Resolves article.  
- **Comment** – Resolves blog comments.  
- **Content page** – Resolves CMS/page content.  
- **Suggested search** – Resolves search suggestion entries.

### Image provider

- **Provider name:** `shopify`  
- **Usage:** Use with Nuxt Image when the source is a Shopify CDN URL (e.g. from Storefront API media). The provider supports modifiers: **width**, **height**, **format**. Base URL is `https://cdn.shopify.com`.  
- **Registration:** The module registers this provider and depends on `@nuxt/image`; ensure the Nuxt Image module is installed.

### Media library provider

- **Name:** `shopify`  
- **Purpose:** Lets the Laioutr Studio **list** and **upload** media via the **Admin API**. List uses the files query (paginated, optional search); upload uses staged uploads then file create.  
- **Requirements:** Admin API token with `read_files` and `write_files` (and any other scopes required by your app).  
- **Upload:** Validates file type/size (see package const for limits), then staged upload → upload binary → file create.

### Sections and blocks

- The package registers **sections** and **blocks** (e.g. `ShopifyContentPageBlock`) and a **pagetypes** plugin for content-page page types. Use these in the Laioutr Studio to build pages backed by Shopify content.

## Backend requirements

- **Shopify store** – A Shopify store (any plan that supports the APIs you use).  
- **Storefront API** – A custom app with Storefront API access and a **private access token** (no OAuth for storefront; the token is server-side only).  
- **Admin API** – Same or another custom app with Admin API scopes. For the media library: **read_products**, **read_files**, **write_files**; for metaobjects (if used): **read_metaobject_definitions**, **read_metaobjects**.  
- **Customer Account API** – In the Shopify Admin, enable **Customer Account API** for your app and create OAuth2 credentials (Client ID and Client Secret). Configure the **redirect URI** to match your app (e.g. `https://your-domain.com/api/orchestr/action/oauth/callback` or the route that handles `AuthOAuthCallbackAction`).  
- **CORS / network** – The Nuxt server must be able to call Shopify’s APIs (storefront and admin are per-store URLs; Customer Account API is `https://shopify.com/{shopId}/account/customer/api/...`). For OAuth, the redirect URI must be reachable by the user’s browser and by Shopify after login.

## Cookies and cart / auth

- **Cart**  
  The Storefront API uses a **cart ID** to identify the cart. The package stores it in the cookie **`shopify-cart-id`**. It creates a cart on first add-to-cart and updates the cookie when the API returns a new cart ID.

- **Customer Account (OAuth)**  
  After a successful OAuth callback, the package sets:  
  - **`shopify-access-token`** – Access token (short-lived).  
  - **`shopify-refresh-token`** – Refresh token (long-lived).  
  - **`shopify-id-token`** – ID token (for identity).  
  State and nonce used during the OAuth flow are stored temporarily in **`shopify-oauth-state`** and **`shopify-oauth-nonce`** and cleared after the callback. Cookie options are httpOnly, secure, sameSite strict, path `/`. Ensure your domain and HTTPS setup match so cookies are sent and accepted.

## Required Shopify permissions (summary)

- **Storefront API** – Required for products, collections, cart, menu, content, search, and password recovery. Use a private access token with the needed storefront access.  
- **Admin API** – For media library and optional features: **read_products**, **read_files**, **write_files**, **read_metaobject_definitions**, **read_metaobjects** (adjust if you use more admin features).  
- **Customer Account API** – OAuth2 app with Client ID and Client Secret; redirect URI must match your app. Scope used by the package includes `openid email customer-account-api:full` (see package const).

## Summary checklist for developers

1. **Shopify store** – Have a store and know its **store domain** (`id.myshopify.com`) and **shop ID** (same format for Customer Account API URL).  
2. **Custom app(s)** – Create a custom app in Shopify Admin; generate **Storefront API** private access token and **Admin API** access token with the scopes above.  
3. **Customer Account API** – Enable Customer Account API for the app; create OAuth2 Client ID and Client Secret; set **redirect URI** to your OAuth callback URL.  
4. **Nuxt config** – Add `@laioutr-app/shopify` to `modules` and set all seven options under `'@laioutr-app/shopify'`.  
5. **Environment** – Put all secrets and URLs in env vars; ensure the Nuxt server can reach Shopify APIs and that the redirect URI is correct and reachable.  
6. **OAuth callback route** – Ensure the route that receives the OAuth callback (e.g. `/api/orchestr/action/oauth/callback`) is the one configured as `redirectUri` in Shopify and in your config.  
7. **Orchestr / frontend** – Use the canonical queries, actions, links, and resolvers from your UI; the package maps them to Shopify.  
8. **Images** – Use the `shopify` Nuxt Image provider for Shopify CDN URLs.  
9. **Studio** – The `shopify` media library provider will list and upload files once the Admin API and token are correctly configured.
