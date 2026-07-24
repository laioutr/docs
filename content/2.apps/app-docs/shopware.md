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
  priority: 1.0

---

## Overview

The **@laioutr-app/shopware** package integrates a Laioutr-powered Nuxt app with a [Shopware](https://www.shopware.com/) backend. It registers with the Laioutr orchestr (queries, actions, links, resolvers, templates), provides a Nuxt Image provider for Shopware media, and a media library provider for the Laioutr Studio. All communication uses the official **Storefront API** (customer-facing) and **Admin API** (OAuth2 client credentials) from `@shopware/api-client`.

To use it, you add the module to your Nuxt config and configure the five required connection options (storefront endpoint and token, admin endpoint and OAuth client). The package then exposes canonical ecommerce capabilities (products, categories, cart, search, menu, auth, newsletter, reviews) so your UI can stay backend-agnostic while talking to Shopware.

Checkout can stay inside your Laioutr frontend or hand off to the Shopware storefront. The app runs fully headless on its own; pairing it with the optional [LaioutrConnector](https://github.com/laioutr/shopware-laioutr-connector) plugin adds an embedded checkout and a secure session handoff. See [Optional: the LaioutrConnector plugin](#optional-the-laioutrconnector-plugin).

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

- **Reads** the context token from the cookie **`sw-context-token`** on each storefront request, unless a project supplies one through the [`shopware:context-token:resolve`](#token-hooks-for-external-identity) hook.  
- **Writes** it through a single persist step whenever the API returns a new token (after login, add-to-cart, or another cart mutation), then fires the [`shopware:context-token:changed`](#token-hooks-for-external-identity) hook. The cookie is `httpOnly` (never readable by client JS), with `path: '/'`, a one-year `maxAge`, `sameSite: 'lax'`, and `secure` when the request is HTTPS.

Ensure your domain and cookie settings align with your Shopware sales channel and storefront URL so the same context is used consistently.

## Optional: the LaioutrConnector plugin

The app is fully headless on its own. Products, categories, cart, search, menus, customer auth, newsletter, and reviews all work against the Storefront and Admin APIs with nothing extra installed on the Shopware side.

Install the [**LaioutrConnector**](https://github.com/laioutr/shopware-laioutr-connector) plugin when you want shoppers to finish checkout on the Shopware storefront using the cart they built in your Laioutr frontend. It is a Shopware 6 plugin (PHP) that pairs the storefront with this app and adds:

- **Embedded checkout.** The Shopware checkout renders inside your frontend as an iframe section, with the storefront chrome (header, footer, navigation) suppressed so only the checkout flow shows.
- **A secure session handoff.** The cart's `sw-context-token` moves from your frontend into the storefront session server-to-server. The app mints a single-use, short-lived code at `/app-shopware/checkout` and redirects to the plugin's `connect-session`, which adopts the cart context and regenerates the session. The token never appears in a browser URL.
- **A `postMessage` bridge.** The embedded storefront and your frontend exchange auth, navigation, and checkout-completion signals through a versioned message envelope.

### Install the plugin

Run this on the Shopware host (it needs PHP 8.2 to 8.5 and Shopware 6.6 or 6.7):

```bash
composer require laioutr/shopware-connector
bin/console plugin:refresh
bin/console plugin:install --activate --clearCache LaioutrConnector
```

In the plugin's settings, add your Laioutr frontend origin to the allowed callback domains. Serve both the storefront and the frontend over HTTPS with `cookie_samesite: none` so the embedded session survives the cross-site context. The plugin README covers the full embedded-storefront prerequisites.

### App-side options

Point the app at the storefront that runs the plugin. These options sit under the same `'@laioutr-app/shopware'` key as the five core options, and all three are optional:

| Option | Type | Description |
|--------|------|-------------|
| **`storefrontUrl`** | `string` | Base URL of the storefront where the connector is installed (e.g. `https://shop.example.com`). Required for the cart `checkoutLink` and `GetCheckoutUrlAction`; both are unavailable when it is unset. |
| **`checkoutLoginCallbackUrl`** | `string` | Absolute URL the storefront returns to after a login inside checkout. Defaults to the request origin. Set it to your login route for external-identity (SSO) projects. |
| **`checkoutLogoutCallbackUrl`** | `string` | Absolute URL the storefront returns to after a logout inside checkout. Defaults to the request origin. Set it to your identity provider's RP-logout route so a storefront logout also ends the external session. |

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@laioutr-app/shopware'],
  '@laioutr-app/shopware': {
    endpoint: process.env.SHOPWARE_STOREFRONT_ENDPOINT!,
    accessToken: process.env.SHOPWARE_STOREFRONT_ACCESS_TOKEN!,
    adminEndpoint: process.env.SHOPWARE_ADMIN_ENDPOINT!,
    adminClientId: process.env.SHOPWARE_ADMIN_CLIENT_ID!,
    adminClientSecret: process.env.SHOPWARE_ADMIN_CLIENT_SECRET!,
    // Enables the checkout handoff to the storefront:
    storefrontUrl: process.env.SHOPWARE_STOREFRONT_URL!,
  },
});
```

## Token hooks for external identity

By default the app reads and writes the `sw-context-token` from its own cookie (see [Cookies and context token](#cookies-and-context-token)). That covers every project where Shopware owns login.

Projects that own login through an **external identity provider** (an SSO service) need the app's cart and checkout to run in their customer's Shopware context rather than an anonymous one. The app exposes two Nitro runtime hooks so your project decides where the context token is read from and where it is stored.

::hook-meta
---
name: shopware:context-token:resolve
title: Resolve the context token
surface: server
register: nitro-plugin
dispatch: async
kind: override
payload:
  - { field: event, type: H3Event, description: The incoming storefront request. }
  - { field: result, type: '{ token?: string }', description: 'Set result.token to supply the context token from your own session store. It starts empty; leave it unset to fall back to the sw-context-token cookie. The first handler to set it wins.' }
whenItFires: Before the Store API client is built, on every storefront request.
related:
  - { label: Extension hooks, to: /apps/app-development/coding-standards#extension-hooks }
---

Source the `sw-context-token` from your own session store instead of the app's cookie, so cart and checkout run in the customer's Shopware context.
::

::hook-meta
---
name: shopware:context-token:changed
title: Context token changed
surface: server
register: nitro-plugin
dispatch: async
kind: lifecycle
payload:
  - { field: event, type: H3Event, description: The incoming storefront request. }
  - { field: token, type: 'string | null', description: The new context token, or null when the session is cleared on logout. }
whenItFires: After the app persists a new token (login, add-to-cart, or another cart mutation) or clears it on logout.
related:
  - { label: Extension hooks, to: /apps/app-development/coding-standards#extension-hooks }
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
6. **Images** – Use the `shopware` Nuxt Image provider for Shopware media when using the expected `src` format.  
7. **Studio** – The `shopware` media library provider will work once the Admin API and integration are correctly configured.  
8. **Checkout (optional)** – To let shoppers finish checkout on the Shopware storefront, install the [LaioutrConnector](https://github.com/laioutr/shopware-laioutr-connector) plugin and set `storefrontUrl`. See [Optional: the LaioutrConnector plugin](#optional-the-laioutrconnector-plugin).

For type-level details and exact canonical action/query names, see the package source and `@laioutr-core/canonical-types` in the laioutr repository.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-shopware/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-shopware**](https://github.com/laioutr/app-shopware).
