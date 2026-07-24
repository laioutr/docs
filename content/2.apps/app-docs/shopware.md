---
title: Shopware
description: Developer documentation for the Laioutr Shopware app package. Connect your Nuxt frontend to a Shopware backend via the Storefront API and Admin API.
seo:
  title: Shopware
  description: Developer documentation for the Laioutr Shopware app package. Connect your Nuxt frontend to a Shopware backend via the…
sitemap:
  loc: /apps/app-docs/shopware
  lastmod: 2026-07-24
  changefreq: monthly
  priority: 1
---

## Overview

The **@laioutr-app/shopware** package integrates a Laioutr-powered Nuxt app with a [Shopware](https://www.shopware.com/) backend. It registers with the Laioutr orchestr (queries, actions, links, resolvers, templates), provides a Nuxt Image provider for Shopware media, and a media library provider for the Laioutr Studio. All communication uses the official **Storefront API** (customer-facing) and **Admin API** from `@shopware/api-client`.

To use it, you add the module to your Nuxt config and set the connection options for the Storefront and Admin APIs. The package then exposes canonical ecommerce capabilities (products, categories, cart, search, menu, auth, newsletter, reviews) so your UI can stay backend-agnostic while talking to Shopware.

Checkout hands off to the Shopware storefront through the [LaioutrConnector](https://github.com/laioutr/shopware-laioutr-connector) plugin on the Shopware side, so shoppers complete checkout on Shopware with the cart they built in your frontend. See [LaioutrConnector plugin](#laioutrconnector-plugin).

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/shopware`** in `nuxt.config.ts` (or via `runtimeConfig`). All options live under this one key; the **Required** column below marks which the app needs.

### Module options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| **`endpoint`** | `string` | Yes | Base URL of the Shopware **Storefront API** (e.g. `https://your-store.example.com/store-api` or the URL your Shopware instance exposes for the store API). |
| **`accessToken`** | `string` | Yes | **Storefront API** access token. In Shopware this is typically a sales channel–specific token that allows public storefront access. Create or copy it from the sales channel in the Admin (Storefront API access). |
| **`adminEndpoint`** | `string` | Yes | Base URL of the Shopware **Admin API** (e.g. `https://your-store.example.com/api`). Used for the media library provider and any server-side admin operations. |
| **`adminClientId`** | `string` | Yes | **Client ID** for the Admin API integration. Created in Shopware Admin under **Settings → System → Integrations** (or **API → Integrations**). The integration must have the scopes needed for the operations you use (e.g. media read for the media library). |
| **`adminClientSecret`** | `string` | Yes | **Client Secret** for the same Admin API integration. Keep this secret and only use it on the server (the module stores it in private runtime config). |
| **`storefrontUrl`** | `string` | Yes | Base URL of the storefront where the [LaioutrConnector](#laioutrconnector-plugin) plugin is installed (e.g. `https://shop.example.com`). Powers the checkout handoff: the cart `checkoutLink` and `GetCheckoutUrlAction` are unavailable when it is unset. |
| **`checkoutLoginCallbackUrl`** | `string` | No | Absolute URL the storefront returns to after a login inside checkout. Defaults to the request origin. Set it to your login route for external-identity (SSO) projects. |
| **`checkoutLogoutCallbackUrl`** | `string` | No | Absolute URL the storefront returns to after a logout inside checkout. Defaults to the request origin. Set it to your identity provider's RP-logout route so a storefront logout also ends the external session. |

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
    storefrontUrl: process.env.SHOPWARE_STOREFRONT_URL!,
  },
});
```

Use environment variables (or a similar secret source) for these values in production; do not commit tokens or secrets.

### Runtime behavior

- **Storefront API**:br
  The package creates a storefront client per request with `endpoint`, `accessToken`, and a **context token** read from the cookie `sw-context-token` (cart/session). It sets default headers `sw-include-seo-urls: true` and, after resolving system entities, `sw-currency-id` and `sw-language-id` from the current client context (locale/currency).
- **Admin API**:br
  The admin client is created with `adminEndpoint` using `adminClientId` and `adminClientSecret`. It is used for the media library provider (list/search media) and any future admin-only features.
- **System entities**:br
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
- **Suggested search**
  - **SuggestedSearchSearchQuery** – Type-ahead suggestions (products and categories) for the search box.

### Query template providers

- **MenuByAlias** – Supplies menu query templates (e.g. by navigation alias).
- **ProductsByCategorySlug** – Supplies “products by category slug” templates (category options from Storefront API).

### Actions

- **AuthLoginAction** – Customer login; on success, the new context token is stored in the `sw-context-token` cookie.
- **CartAddItemsAction** – Adds line items to the cart; updates the context token cookie if the API returns one.
- **SubscribeAction** (newsletter) – Subscribes with email/person/address; uses current locale and salutation from system entities.
- **CreateReviewAction** – Submits a product review (productId, name, email, title, content, points).
- **CartRemoveItemsAction** – Removes line items from the cart.
- **CartUpdateItemsAction** – Updates line-item quantities in the cart.
- **GetCheckoutUrlAction** – Returns the URL that starts the checkout handoff to the Shopware storefront (requires `storefrontUrl`).

### Links

- **ProductBreadcrumbLink** – Breadcrumb trail for product.
- **ProductVariantsLink** – Variants for a product.
- **ProductReviewsLink** – Reviews for a product (with pagination).
- **CategoryMenuItemLink** – Menu/navigation link for category (e.g. label and route).
- **CartItemsLink** – Line items of the current cart.
- **SuggestedSearchEntriesLink** – Entries of a suggested-search result.

### Component resolvers (entities)

- **Product** – Maps Shopware product/variant to canonical Product (base, info, prices, media, flags, SEO, description, default variant). Supports variant selection via passthrough.
- **Product variant** – Maps variant data for product variants.
- **Category** – Maps category to canonical Category (base, content, media, SEO).
- **Menu** – Resolves menu/navigation items.
- **Cart** – Resolves current cart.
- **Review** – Resolves product reviews.
- **Cart item** – Resolves a cart line item.
- **Suggested search entry** – Resolves a suggested-search entry.

### Image provider

- **Provider name:** `shopware`
- **Usage:** Use with Nuxt Image when the source is Shopware media. It picks the best-matching thumbnail for the requested width and height, or the largest when no size is requested.
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
  - **Storefront sales channel** – Connect the app to a regular **Storefront** sales channel, not a headless (API-only) one. The session handoff to Shopware's checkout runs on that sales channel's storefront, so the cart the app builds and the checkout the shopper completes stay on the same sales channel.
  - **Categories & menus assigned** – Ensure the sales channel has appropriate **navigation entry points** (e.g. main navigation / footer navigation) so category trees and menus resolve as expected.
  - **Domain configured** – Assign at least one domain to the sales channel (e.g. `https://example.com`) so URL generation, language/currency context, and SEO URLs behave consistently.
  - **Products assigned** – Assign products (or product groups/categories) to the sales channel so listings and product detail queries return data.
  - **Reference** – See Shopware docs: [Sales channel → Products](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#products).
- **Admin API:**
  - An **Integration** with client ID and secret, and scopes that include at least what the media library and any admin features need (e.g. `media` read).
- **CORS / network:** The Nuxt app (server) must be able to call both the storefront and admin base URLs (same-origin or allowed CORS for server-side requests as applicable).

## Cookies and context token

The Storefront API uses a **context token** to identify the session (cart, customer). The package:

- **Reads** the context token from the cookie **`sw-context-token`** on each storefront request, unless a project supplies one through the [`shopware:context-token:resolve`](#token-hooks-for-external-identity) hook.
- **Writes** it through a single persist step whenever the API returns a new token (after login, add-to-cart, or another cart mutation), then fires the [`shopware:context-token:changed`](#token-hooks-for-external-identity) hook. The cookie is `httpOnly` (never readable by client JS), with `path: '/'`, a one-year `maxAge`, `sameSite: 'lax'`, and `secure` when the request is HTTPS.

Ensure your domain and cookie settings align with your Shopware sales channel and storefront URL so the same context is used consistently.

## LaioutrConnector plugin

The app is built to run with the [**LaioutrConnector**](https://github.com/laioutr/shopware-laioutr-connector), a Shopware 6 plugin installed on your Shopware host. It pairs the storefront with this app and runs checkout: the cart a shopper builds in your Laioutr frontend is handed off to the Shopware storefront through a secure server-to-server session exchange, so the shopper completes checkout on Shopware with that same cart. Running the app without it is not supported.

For requirements, installation, allowed callback domains, and session and cookie setup, follow the [plugin README](https://github.com/laioutr/shopware-laioutr-connector#readme).

On the app side, point [`storefrontUrl`](#module-options) at the storefront that runs the plugin.

## Token hooks for external identity

By default the app reads and writes the `sw-context-token` from its own cookie (see [Cookies and context token](#cookies-and-context-token)). That covers every project where Shopware owns login.

Projects that own login through an **external identity provider** (an SSO service) need the app's cart and checkout to run in their customer's Shopware context rather than an anonymous one. The app exposes two Nitro runtime hooks so your project decides where the context token is read from and where it is stored.

::hook-meta
---
payload:
  - field: event
    type: H3Event
    description: The incoming storefront request.
  - field: result
    type: "{ token?: string }"
    description: Set result.token to supply the context token from your own session
      store. It starts empty; leave it unset to fall back to the
      sw-context-token cookie. The first handler to set it wins.
related:
  - label: Extension hooks
    to: /apps/app-development/coding-standards#extension-hooks
dispatch: async
kind: override
name: shopware:context-token:resolve
register: nitro-plugin
surface: server
title: Resolve the context token
whenItFires: Before the Store API client is built, on every storefront request.
---
Source the `sw-context-token` from your own session store instead of the app's cookie, so cart and checkout run in the customer's Shopware context.
::

::hook-meta
---
payload:
  - field: event
    type: H3Event
    description: The incoming storefront request.
  - field: token
    type: "string | null"
    description: "The new context token, or null when the session is cleared on logout."
related:
  - label: Extension hooks
    to: /apps/app-development/coding-standards#extension-hooks
dispatch: async
kind: lifecycle
name: shopware:context-token:changed
register: nitro-plugin
surface: server
title: Context token changed
whenItFires: After the app persists a new token (login, add-to-cart, or another
  cart mutation) or clears it on logout.
---
Mirror every token change into your own store so it survives across requests. Fire-and-forget: there is no result slot.
::

Register both hooks in one Nitro plugin:

```ts [server/plugins/shopware-context-token.ts]
export default defineNitroPlugin((nitroApp) => {
  // Supply the token from your own session store; the app's cookie is the fallback.
  nitroApp.hooks.hook('shopware:context-token:resolve', async ({ event, result }) => {
    result.token = await loadShopwareToken(event); // e.g. Redis, keyed by the IdP subject
  });

  // Mirror every token change back into your store; token is null on logout.
  nitroApp.hooks.hook('shopware:context-token:changed', async ({ event, token }) => {
    await storeShopwareToken(event, token);
  });
});
```

::warning
These hooks only **transport** the token; they never mint one. Keep the `resolve` handler a cheap read of your own storage, never a login call, because it runs on every Store API request. Turning an SSO shopper into a real, logged-in Shopware customer stays your project's job, done once at login through a Shopware SSO-login plugin or the Store API register/login endpoints. If the token you supply is only ever a guest token, checkout stays anonymous.
::

`changed` fires for guests too. Before login, a cart mutation issues a guest token and the hook fires with it, so you can store that token against a guest id and swap to the customer token once the shopper logs in.

## Summary checklist for developers

1. **Shopware instance** – Storefront API and Admin API reachable; SEO URLs and sales channel access token configured.
2. **Admin integration** – Create an integration, note Client ID and Client Secret, grant required scopes (e.g. media).
3. **Nuxt config** – Add `@laioutr-app/shopware` to `modules` and set all five options under `'@laioutr-app/shopware'` (endpoint, accessToken, adminEndpoint, adminClientId, adminClientSecret).
4. **Environment** – Put secrets and URLs in env vars; ensure the Nuxt server can reach both APIs.
5. **Orchestr / frontend** – Use the canonical queries, actions, links, and resolvers from your UI; the package maps them to Shopware under the hood.
6. **Images** – Use the `shopware` Nuxt Image provider for Shopware media.
7. **Studio** – The `shopware` media library provider will work once the Admin API and integration are correctly configured.
8. **Checkout** – Install the [LaioutrConnector](https://github.com/laioutr/shopware-laioutr-connector) plugin on Shopware and set `storefrontUrl` so shoppers can complete checkout on the storefront. See [LaioutrConnector plugin](#laioutrconnector-plugin).

For type-level details and exact canonical action/query names, see the package source and `@laioutr-core/canonical-types` in the laioutr repository.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-shopware/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-shopware**](https://github.com/laioutr/app-shopware).
