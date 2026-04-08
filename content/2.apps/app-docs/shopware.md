---
title: Shopware
description: Developer documentation for the Laioutr Shopware app package. Connect your Nuxt frontend to a Shopware backend via the Storefront API and Admin API.
seo:
  title: Shopware | Laioutr
  description: Developer documentation for the Laioutr Shopware app package. Connect your Nuxt frontend to a Shopware backend via the…
---

## Overview

The **@laioutr-app/shopware** package integrates a Laioutr-powered Nuxt app with a [Shopware](https://www.shopware.com/) backend. It registers with the Laioutr orchestr (queries, actions, links, resolvers, templates), provides a Nuxt Image provider for Shopware media, and a media library provider for the Laioutr Studio. All communication uses the official **Storefront API** (customer-facing) and **Admin API** (OAuth2 client credentials) from `@shopware/api-client`.

To use it, you add the module to your Nuxt config and configure the five required connection options (storefront endpoint and token, admin endpoint and OAuth client). The package then exposes canonical ecommerce capabilities (products, categories, cart, search, menu, auth, newsletter, reviews) so your UI can stay backend-agnostic while talking to Shopware.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/shopware`** in `nuxt.config.ts` (or via `runtimeConfig`). All five options are **required** for the package to work correctly.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`endpoint`** | `string` | Base URL of the Shopware **Storefront API** (e.g. `https://your-store.example.com/store-api` or the URL your Shopware instance exposes for the store API). |
| **`accessToken`** | `string` | **Storefront API** access token. In Shopware this is typically a sales channel–specific token that allows public storefront access. Create or copy it from the Sales Channel in the Admin (Storefront API access). |
| **`adminEndpoint`** | `string` | Base URL of the Shopware **Admin API** (e.g. `https://your-store.example.com/api`). Used for the media library provider and any server-side admin operations. |
| **`adminClientId`** | `string` | OAuth2 **Client ID** for the Admin API. Created in Shopware Admin under **Settings → System → Integrations** (or **API → Integrations**). The integration must have the scopes needed for the operations you use (e.g. media read for the media library). |
| **`adminClientSecret`** | `string` | OAuth2 **Client Secret** for the same Admin API integration. Keep this secret and only use it on the server (the module stores it in private runtime config). |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/shopware'],
  '@laioutr-app/shopware': {
    endpoint: process.env.SHOPWARE_STOREFRONT_ENDPOINT!,
    accessToken: process.env.SHOPWARE_STOREFRONT_ACCESS_TOKEN!,
    adminEndpoint: process.env.SHOPWARE_ADMIN_ENDPOINT!,
    adminClientId: process.env.SHOPWARE_ADMIN_CLIENT_ID!,
    adminClientSecret: process.env.SHOPWARE_ADMIN_CLIENT_SECRET!,
  },
});
```

Use environment variables (or a similar secret source) for all five values in production; do not commit tokens or secrets.

### Runtime behavior

- **Storefront API**  
  The package creates a storefront client per request with `endpoint`, `accessToken`, and a **context token** read from the cookie `sw-context-token` (cart/session). It sets default headers `sw-include-seo-urls: true` and, after resolving system entities, `sw-currency-id` and `sw-language-id` from the current client context (locale/currency).

- **Admin API**  
  The admin client is created with `adminEndpoint` and OAuth2 `client_credentials` using `adminClientId` and `adminClientSecret`. It is used for the media library provider (list/search media) and any future admin-only features.

- **System entities**  
  Currencies, salutations, countries, and locales are loaded from the Storefront API and cached (e.g. 24h). The “current” currency and language are derived from the client’s locale and currency and sent with storefront requests.

## Capabilities

The package implements Laioutr’s canonical ecommerce types via the orchestr. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Cart**  
  - **GetCurrentCart** – Returns the current cart (context token from cookie).
- **Category**  
  - **CategoryBySlugQuery** – Resolves category ID from SEO slug (Storefront API SEO URLs).  
  - **CategoryAllQuery** – Paginated list of category IDs.
- **Menu**  
  - **MenuByAliasQuery** – Navigation tree by root/alias; returns category IDs, caches by alias (e.g. 10 min TTL).
- **Product**  
  - **ProductBySlugQuery** – Resolves product (parent) ID from SEO slug; supports default variant via passthrough.  
  - **ProductSearchQuery** – Full-text search with pagination, filters, and sort; returns product IDs, total, availableFilters, availableSortings.  
  - **ProductsByCategoryIdQuery** – Listing by category ID with pagination, filters, sorting; returns product IDs, total, availableFilters, availableSortings.  
  - **ProductsByCategorySlugQuery** – Same as above but driven by category slug (used via query template).

### Query template providers

- **MenuByAlias** – Supplies menu query templates (e.g. by navigation alias).  
- **ProductsByCategorySlug** – Supplies “products by category slug” templates (category options from Storefront API).

### Actions

- **AuthLoginAction** – Customer login; on success, the new context token is stored in the `sw-context-token` cookie.  
- **CartAddItemsAction** – Adds line items to the cart; updates the context token cookie if the API returns one.  
- **SubscribeAction** (newsletter) – Subscribes with email/person/address; uses current locale and salutation from system entities.  
- **CreateReviewAction** – Submits a product review (productId, name, email, title, content, points).

### Links

- **ProductBreadcrumbLink** – Breadcrumb trail for product.  
- **ProductVariantsLink** – Variants for a product.  
- **ProductReviewsLink** – Reviews for a product (with pagination).  
- **CategoryMenuItemLink** – Menu/navigation link for category (e.g. label and route).

### Component resolvers (entities)

- **Product** – Maps Shopware product/variant to canonical Product (base, info, prices, media, flags, SEO, description, default variant). Supports variant selection via passthrough.  
- **Product variant** – Maps variant data for product variants.  
- **Category** – Maps category to canonical Category (base, content, media, SEO).  
- **Menu** – Resolves menu/navigation items.  
- **Cart** – Resolves current cart.  
- **Review** – Resolves product reviews.

### Image provider

- **Provider name:** `shopware`  
- **Usage:** Use with Nuxt Image when the source is Shopware media. The provider expects a `src` that can include a fragment with thumbnail info (e.g. `url widthxheight, ...`). It picks the best-matching thumbnail for the requested width/height (or the largest if no size is requested).  
- **Registration:** The module registers this provider with the Laioutr app; use it via your Nuxt Image configuration and the `shopware` provider name.

### Media library provider

- **Name:** `shopware`  
- **Purpose:** Lets the Laioutr Studio list and search media from Shopware via the **Admin API**. Used for asset selection in the CMS.  
- **Requirements:** Admin API must be reachable and the integration (adminClientId/Secret) must have permission to search/read media.

## Backend requirements

- **Shopware version:** The package uses `@shopware/api-client` (Storefront and Admin APIs). Use a Shopware version that is supported by that client (typically Shopware 6.x with a compatible Storefront API and Admin API).  
- **Storefront API:**  
  - A sales channel with **Storefront API** enabled and an **access token** generated.  
  - SEO URLs enabled if you use slug-based queries (CategoryBySlug, ProductBySlug, ProductsByCategorySlug).  
- **Sales channel configuration (user-facing requirements)**:
  - **Headless sales channel** – Create a **headless** sales channel (Storefront API–only) that your Nuxt frontend will talk to.
  - **Categories & menus assigned** – Ensure the sales channel has appropriate **navigation entry points** (e.g. main navigation / footer navigation) so category trees and menus resolve as expected.
  - **Domain configured** – Assign at least one domain to the sales channel (e.g. `https://example.com`) so URL generation, language/currency context, and SEO URLs behave consistently.
  - **Products assigned** – Assign products (or product groups/categories) to the sales channel so listings and product detail queries return data.
  - **Reference** – See Shopware docs: [Sales channel → Products](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#products).
- **Admin API:**  
  - An **Integration** (OAuth2 client) with client ID and secret, and scopes that include at least what the media library and any admin features need (e.g. `media` read).  
- **CORS / network:** The Nuxt app (server) must be able to call both the storefront and admin base URLs (same-origin or allowed CORS for server-side requests as applicable).

## Cookies and context token

The Storefront API uses a **context token** to identify the session (cart, customer). The package:

- **Reads** the context token from the cookie **`sw-context-token`** on each storefront request.  
- **Writes** it when the API returns a new token (e.g. after login or add-to-cart). Cookie options: `path: '/'`, long-lived `maxAge`, `sameSite: 'lax'`, and `secure` when the storefront endpoint is HTTPS.

Ensure your domain and cookie settings align with your Shopware sales channel and storefront URL so the same context is used consistently.

## Summary checklist for developers

1. **Shopware instance** – Storefront API and Admin API reachable; SEO URLs and sales channel access token configured.  
2. **Admin integration** – Create an integration, note Client ID and Client Secret, grant required scopes (e.g. media).  
3. **Nuxt config** – Add `@laioutr-app/shopware` to `modules` and set all five options under `'@laioutr-app/shopware'` (endpoint, accessToken, adminEndpoint, adminClientId, adminClientSecret).  
4. **Environment** – Put secrets and URLs in env vars; ensure the Nuxt server can reach both APIs.  
5. **Orchestr / frontend** – Use the canonical queries, actions, links, and resolvers from your UI; the package maps them to Shopware under the hood.  
6. **Images** – Use the `shopware` Nuxt Image provider for Shopware media when using the expected `src` format.  
7. **Studio** – The `shopware` media library provider will work once the Admin API and integration are correctly configured.

For type-level details and exact canonical action/query names, see the package source and `@laioutr-core/canonical-types` in the laioutr repository.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-shopware/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-shopware**](https://github.com/laioutr/app-shopware).
