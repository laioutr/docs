---
title: Shopify
description: How to connect your Shopify store to Laioutr and what developers can build on top.
seo:
  title: Shopify | Laioutr
  description: How to connect your Shopify store to Laioutr and what developers can build on top.
---

## Part 1 – Connect Shopify and Laioutr (for store owners & project leads)

This section explains **which values you need from Shopify** and **where to find them**. You can either enter them yourself into the Laioutr project configuration, or hand them to your implementation partner.

### 1. Information you will need

To connect a Shopify store to Laioutr you need:

- **Store domain**  
  - Format: **`<store-id>.myshopify.com`**  
  - Example: `my-brand.myshopify.com`

- **Storefront API private access token**  
  - Used for product, collection, cart and content data.

- **Customer Account API credentials** (for customer login)  
  - **Client type:** must be set to **“Confidential”**  
  - **Client ID**  
  - **Client Secret**
  - **Redirect / callback URL** – provided by Laioutr (for example: `https://<your-laioutr-domain>/oauth/callback`)

- **Admin API access token (for media library and additional data)**  
  - From a **custom app** with the required Admin scopes.

Your implementation partner might ask you to paste these values into a project setup form or send them via a secure channel.

### 2. Enable the headless sales channel and Storefront API

1. In **Shopify Admin**, go to **Apps and sales channels**.  
2. Install or open the **Headless** sales channel (if your partner has not done this already).  
3. Inside the Headless channel configuration:
   - Create a **Storefront API private access token**.
   - Copy the token for later.

This token is what Laioutr uses to read products, collections, carts, menus and content via the **Storefront API**.

### 3. Configure Customer Account API (for customer login)

If you want customers to log in on your Laioutr storefront using their Shopify account:

1. In **Shopify Admin**, open your **Headless** (or custom) app configuration.
2. Enable **Customer Account API** and create an **application**.
3. Set **Client type** to **Confidential**.
4. Note down:
   - **Customer Account API Client ID**  
   - **Customer Account API Client Secret**
5. Add the **callback / redirect URL** that Laioutr gives you, e.g.:
   - `https://<your-laioutr-domain>/oauth/callback`

Laioutr uses this information to run the OAuth2 login flow with Shopify.

### 4. Set up a Shopify app for the media library (optional but recommended)

To manage images and files from within Laioutr (for example in the media library of the Studio), a separate app with **Admin API** access is required:

1. In **Shopify Admin**, go to **Settings → Apps and sales channels → Develop apps**.
2. Create a **new custom app** (or reuse one created for Laioutr), and enable **Admin API** access.
3. Grant at least these **Admin API scopes** for media and navigation:
   - `write_files`
   - `read_files`
   - `read_themes`
   - `write_themes`
   - `read_online_store_navigation`
4. Generate an **Admin API access token** and store it somewhere safe.

Your implementation partner may request additional scopes (for example to work with metaobjects or product data) depending on your project.

### 5. Hand the data to your developer or partner

At this point you should have:

- Store domain: **`<store-id>.myshopify.com`**  
- Storefront API private access token  
- Customer Account API **Client ID** and **Client Secret**  
- Customer Account API **callback URL** configured  
- Admin API access token (with the scopes above, if you use the media library)

Developers will now wire these values into the Laioutr project. You do not need to change theme code in Shopify for the integration itself.

---

## Part 2 – Developer setup in Nuxt

Developers integrate Shopify by adding the **`@laioutr-app/shopify`** module to the Nuxt app that powers the Laioutr frontend.

### Module configuration

The module expects configuration under the key **`'@laioutr-app/shopify'`** in `nuxt.config.ts` (or via `runtimeConfig`). All options are required for the full feature set (Storefront, Admin, Customer Account).

| Option | Type | Description |
|--------|------|-------------|
| **`shopId`** | `string` | Shopify shop identifier. Use **`<store-id>.myshopify.com`** (e.g. `my-brand.myshopify.com`). Used to build Customer Account API URLs. |
| **`storeDomain`** | `string` | Store domain in the same format: **`<store-id>.myshopify.com`**. Used by Storefront and Admin API clients. |
| **`privateAccessKey`** | `string` | **Storefront API** private access token from the Headless sales channel. |
| **`adminAccessToken`** | `string` | **Admin API** access token from the custom app created under **Develop apps** with the scopes listed above. |
| **`customerAccountApiClientId`** | `string` | OAuth2 **Client ID** for the **Customer Account API** app (client type Confidential). |
| **`customerAccountApiClientSecret`** | `string` | OAuth2 **Client Secret** for the same Customer Account API app. Keep this in private runtime config. |
| **`redirectUri`** | `string` | OAuth2 **redirect URI** (callback URL) that you also configured in the Customer Account API app, e.g. `https://your-frontend.com/api/orchestr/action/oauth/callback`. |

### Example `nuxt.config.ts`

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

Use environment variables or a secret manager for all tokens and secrets; never commit them to version control.

### Runtime behavior (high level)

- **Storefront API**
  - A client is created per request using `storeDomain` and `privateAccessKey`.
  - Cart identity is stored in the cookie **`shopify-cart-id`**; the package creates/updates carts and syncs the cookie.

- **Admin API**
  - A client is created with `storeDomain` and `adminAccessToken`.
  - Used by the Laioutr media library provider to list and upload files.

- **Customer Account API**
  - Uses `shopId`, `customerAccountApiClientId`, `customerAccountApiClientSecret` and `redirectUri` to run an OAuth2 flow.
  - After login, the package stores tokens in httpOnly cookies:
    - `shopify-access-token`
    - `shopify-refresh-token`
    - `shopify-id-token`
  - Temporary state/nonce cookies (`shopify-oauth-state`, `shopify-oauth-nonce`) are cleared after the callback.

---

## Part 3 – What the Shopify integration provides (for developers)

Once configured, the **`@laioutr-app/shopify`** package implements Laioutr’s canonical ecommerce model through the orchestr. Your frontend can talk to Shopify without knowing its APIs directly.

### Built-in capabilities

- **Canonical queries**
  - Cart: current cart by ID (using `shopify-cart-id` cookie).
  - Category / collection: by handle (slug), with paginated product listings.
  - Menu: menu by alias/handle (navigation).
  - Product: by handle, product search, products by category.
  - Blog: blog collections and posts by slug.
  - Content pages: content page by handle.
  - Suggested search: predictive search entries.

- **Actions**
  - Auth: login via OAuth, callback handling, logout, password recovery.
  - Cart: add, update and remove items (and discount codes).
  - Customer: get current customer and manage addresses (create/update/delete, set default).

- **Links and resolvers**
  - Links that connect canonical entities (e.g. product → variants, category → products, cart → items, blog → posts).
  - Resolvers map Shopify entities (products, collections, blogs, etc.) to Laioutr’s canonical types.

- **Media and images**
  - **Nuxt Image provider** named `shopify` for `https://cdn.shopify.com` URLs.
  - **Media library provider** named `shopify` for listing and uploading media via the Admin API.

- **Studio sections and blocks**
  - Sections/blocks (such as `ShopifyContentPageBlock`) and pagetype plugins for content pages backed by Shopify data.

For exact type names and payloads, check the package source and the `@laioutr-core` canonical type definitions.

---

## Part 4 – Extending the integration

You can extend the Shopify integration in several ways while staying within Laioutr’s orchestr and canonical model.

### 1. Adding new Shopify-powered features

- **New queries**  
  - Example: expose a new query for product recommendations, order history, or custom metaobjects.  
  - Implementation pattern:
    - Call the relevant Shopify Storefront or Admin API endpoint.
    - Map the response into either existing canonical entities or a new canonical type.
    - Register a new orchestr query and (optionally) a query template provider so Studio users can wire it in visually.

- **New actions**
  - Example: wishlist operations, subscription management, or loyalty actions that live in Shopify or an app that exposes a Shopify API.
  - Use the same pattern as the built-in cart and auth actions: validate input, call Shopify, map errors, and return canonical action results.

### 2. Enriching existing entities

- **Extending canonical types**
  - If you need more fields on a product, collection or customer, you can:
    - Extend the canonical type definition (where appropriate for your project).
    - Populate the new field from additional Shopify API fields (e.g. metafields, metaobjects).
  - Be careful to keep extensions backwards compatible and document them for frontend developers.

- **Custom links**
  - Add links that connect existing entities in new ways, for example:
    - Product → recommended products.
    - Customer → recently viewed products (if you store that in Shopify or an adjacent system).

### 3. Custom sections and blocks for Studio

- **Create new sections/blocks** that consume the canonical queries and links:
  - Example: a “Featured collection grid” section that reads products from a Shopify collection handle.
  - Example: a “Customer account overview” section that uses customer actions and queries.

- **Best practice**
  - Keep sections/blocks backend-agnostic: they should depend only on canonical types, not on Shopify-specific payloads. This keeps your UI portable if you add other commerce backends later.

### 4. Working with media and navigation

- **Media**
  - Extend the media provider if you need custom file validation or additional metadata stored in Shopify.
  - Use the `shopify` Nuxt Image provider for all Shopify CDN media to get automatic optimization.

- **Navigation**
  - If you rely heavily on Shopify’s navigation, you can add new queries or links that surface more complex menu structures (for example, navigation trees driven by metaobjects combined with `read_online_store_navigation`).

By combining these extension points, you can gradually grow from a standard Laioutr × Shopify storefront into a highly tailored commerce experience, without losing the benefits of a canonical, backend-agnostic frontend architecture.
