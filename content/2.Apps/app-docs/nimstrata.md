---
title: Nimstrata Google Retail API
description: Developer documentation for the Laioutr Nimstrata app package. Add AI-powered search, recommendations, suggested search, and event tracking to your Laioutr frontend via the Nimstrata (Retail Connect) API, with Shopify integration.
seo:
  title: Nimstrata Google Retail API | Laioutr
  description: Developer documentation for the Laioutr Nimstrata app package. Add AI-powered search, recommendations, suggested…
---

## Overview

The **@laioutr-app/nimstrata** package integrates [Nimstrata](https://www.nimstrata.com/) (Retail Connect / Google Retail API) into a Laioutr-powered Nuxt app for AI-powered product search, category browsing, recommendations, suggested search (autocomplete), and event tracking. It uses the **Nimstrata API** (search, predict, autocomplete, event) and depends on **@laioutr-app/shopify** to resolve collection and product IDs (e.g. category slug → Shopify collection ID, product slug → product ID for recommendations). The package registers with the Laioutr orchestr (queries, links, component resolvers, query template provider, actions) and exposes **ProductSearchQuery**, **ProductsByCategorySlugQuery**, **NimstrataProductRecommendationsQuery**, **SuggestedSearchSearchQuery**, **SuggestedSearchEntriesLink**, **SuggestedSearchEntry** resolver, and **TrackEventAction**.

Configuration includes **projectId** (required), **baseURL** (optional), **catalogId** (optional), and **serving** (optional search/byCategory/predict configs). The middleware injects **nimstrataClient**, **shopifyStorefrontClient**, and **nimstrata** context (visitorId, sessionId, userInfo). A **visitor ID** is stored in the **nimstrata-visitor-id** cookie for personalisation and event attribution. The module installs **@laioutr-core/frontend-core**, **@nuxt/image**, and **@laioutr-app/shopify** on prepare.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/nimstrata`** in `nuxt.config.ts` (or via `runtimeConfig`). One option is required; the rest have defaults or are optional.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`baseURL`** | `string` | Nimstrata API base URL. Default: `https://storefront.retailconnect.app/v1`. |
| **`projectId`** | `string` | Nimstrata project identifier. Used in API payloads (e.g. event, catalog path). |
| **`catalogId`** | `string` | Catalog identifier. Default: `default_catalog`. Used in catalog path: `projects/{projectId}/locations/global/catalogs/{catalogId}`. |
| **`serving`** | `object` | Optional override for search, byCategory, and predict configs. **search** / **byCategory**: `servingConfigId`, `filterFields`, `availableSortings`. **predict**: array of `{ servingConfigId, label, limit, eventType, eventDataInput }` (e.g. home-page-view, detail-page-view). See [Google Retail user events](https://docs.cloud.google.com/retail/docs/user-events) for event data. |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/nimstrata', '@laioutr-core/orchestr', '@laioutr-app/shopify'],
  '@laioutr-app/nimstrata': {
    baseURL: process.env.NIMSTRATA_BASE_URL ?? 'https://storefront.retailconnect.app/v1',
    projectId: process.env.NIMSTRATA_PROJECT_ID!,
    catalogId: process.env.NIMSTRATA_CATALOG_ID ?? 'default_catalog',
    serving: {
      // optional overrides
    },
  },
});
```

Use environment variables for **projectId** (and **baseURL**, **catalogId**) in production; do not commit secrets if the API requires auth beyond projectId.

### Runtime behavior

- **Nimstrata SDK**  
  The package builds a **NimstrataSDK** instance per request with `baseURL`, `projectId`, `catalogId`, and optional `serving`. The SDK exposes **search**, **byCollection**(collectionId, params), **predict**(servingConfigId, limit, userEvent), **autocomplete**(params), **event**(payload), and **getPredictConfigs()**. All API calls are POST to the base URL. The SDK is passed into the orchestr context as **nimstrataClient**.

- **Shopify storefront client**  
  The middleware also creates **shopifyStorefrontClient** (from **@laioutr-app/shopify**) using the request IP. It is used to resolve **collection ID** by category slug (for **ProductsByCategorySlugQuery**) and **product ID** by product slug (for **NimstrataProductRecommendationsQuery**). Ensure **@laioutr-app/shopify** is configured in the same app.

- **Visitor and session**  
  **ensureVisitorId(event)** reads or sets the **nimstrata-visitor-id** cookie (UUID v4, httpOnly, secure in production, sameSite lax, path /, maxAge 1 year). **visitorId** is passed to search, predict, autocomplete, and event. **sessionId** is currently set to visitorId; **userInfo** is optional (TODO for logged-in user). Context **nimstrata** holds `{ visitorId, sessionId, userInfo }`.

- **Passthrough**  
  **suggestedSearchEntriesPassthroughToken** stores the mapped suggested-search entries after **SuggestedSearchSearchQuery** runs; **SuggestedSearchEntriesLink** and **SuggestedSearchEntry** resolver read from it.

- **Public assets**  
  The module registers `runtime/app/public` as Nitro public assets (e.g. app logo at `/app-nimstrata/nimstrata-logo.svg`) with a 7-day cache.

## Capabilities

The package implements Laioutr’s canonical search, category, suggested-search, and tracking types plus a custom recommendations query. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Product**  
  - **ProductSearchQuery** – Full-text product search. **Input:** `query`. Uses **nimstrataClient.search** with visitorId, filters, order, pagination. Returns **entities** (mapped to product-like shape via **searchResultToEntity**), **total**, **sorting**, **availableFilters**, **availableSortings**. **Provides:** ProductDefaultVariant, ProductInfo, ProductPrices.  
  - **ProductsByCategorySlugQuery** – Product listing by category slug. Resolves **collectionId** from slug via **resolveCollectionId** (Shopify storefront client, cached). Uses **nimstrataClient.byCollection**(collectionId, params). Returns **total**, **sorting**, **availableFilters**, **availableSortings**, **entities**. **Provides:** ProductDefaultVariant, ProductInfo, ProductPrices.  
  - **NimstrataProductRecommendationsQuery** – Custom query token **nimstrata/product/recommendations**. **Input:** `servingConfigId`, `eventType` (home-page-view, search, category-page-view, detail-page-view), optional `productSlug`, `productId`, `searchQuery`, `pageCategories`. Resolves **productId** from slug via Shopify if needed. Uses **nimstrataClient.predict**(servingConfigId, limit, userEvent). Returns **entities** (mapped via **predictResultToEntity** with currency and attributionToken). **Provides:** ProductDefaultVariant, ProductInfo, ProductPrices, ProductAnalytics.

- **Suggested search**  
  - **SuggestedSearchSearchQuery** – Autocomplete. **Input:** `query`. If empty, sets passthrough to empty array and returns id. Otherwise uses **nimstrataClient.autocomplete** and maps results via **mapAutosuggestToSuggestedSearch**; stores entries in **suggestedSearchEntriesPassthroughToken**. Returns **id** (e.g. `suggested-search:{query}`).

### Query template provider

- **NimstrataProductRecommendationsQuery** – Supplies one template per predict config from **nimstrataClient.getPredictConfigs()** (default or **serving.predict**). Each template has **inputRules** (servingConfigId, eventType, eventDataInput), **defaultLimit**, **label** (e.g. "[Home] On Sale", "[PDP] Others you may like").

### Links

- **Suggested search**  
  - **SuggestedSearchEntriesLink** – Resolves suggested-search result id to suggestion entry ids. **Requires** **suggestedSearchEntriesPassthroughToken** in passthrough. Returns links: each entityId → all entry ids from passthrough.

### Component resolvers

- **SuggestedSearchEntry** – Resolves suggested-search entries. **Requires** **suggestedSearchEntriesPassthroughToken** in passthrough. **Provides** **SuggestedSearchEntryBase**. Returns entities from passthrough (already in resolver entity shape).

### Actions

- **Tracking**  
  - **TrackEventAction** – Sends a user event to Nimstrata. **Input:** eventType, eventTime, uri, referrerUri, pageViewId, entity, experimentIds, categories, filters (searchQuery, filterQuery, paginationOffset, orderBy), productDetails, cartId, transaction, attributes. Uses **nimstrataClient.event** with visitorId, sessionId, userInfo from context. No return value. Use this to feed page views, detail views, add-to-cart, purchase, etc., for recommendations and analytics.

## Backend requirements

- **Nimstrata / Retail Connect** – Configure a project and catalog (e.g. Google Retail API or Nimstrata storefront). Ensure **projectId** and **catalogId** match; configure serving configs for search, byCategory, and predict (e.g. default_search, on-sale-revenue, rec4-you-revenue, others-you-may-like-revenue).  
- **@laioutr-app/shopify** – Required for **ProductsByCategorySlugQuery** (collection resolve) and **NimstrataProductRecommendationsQuery** (product resolve). Configure Shopify in the same app so **shopifyStorefrontClient** is available.  
- **Catalog data** – Products and categories in Nimstrata must align with Shopify (e.g. collection IDs, product IDs) so byCollection and predict return the right items and the frontend can resolve full product data via Shopify.

## Cookies and context

| Cookie | Purpose |
|--------|---------|
| **nimstrata-visitor-id** | Persistent visitor ID (UUID v4) for personalisation and event attribution. Set by **ensureVisitorId** when missing. Used in search, predict, autocomplete, and event calls. |

## Summary checklist

- Add **@laioutr-app/nimstrata**, **@laioutr-core/orchestr**, and **@laioutr-app/shopify** to Nuxt modules (and **@nuxt/image** if needed).
- Set **baseURL** (optional), **projectId**, **catalogId** (optional), and optionally **serving** under `@laioutr-app/nimstrata` (e.g. from env).
- Ensure Nimstrata project and catalog are configured and serving configs exist for search, byCategory, and predict.
- Use **ProductSearchQuery**, **ProductsByCategorySlugQuery**, **NimstrataProductRecommendationsQuery** (and its template provider), **SuggestedSearchSearchQuery** + **SuggestedSearchEntriesLink** + **SuggestedSearchEntry** resolver, and **TrackEventAction** as needed. Call **TrackEventAction** for page views, detail views, cart, and purchase so recommendations and analytics work.
