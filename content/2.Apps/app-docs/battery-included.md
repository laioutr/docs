---
title: Battery Included
description: Developer documentation for the Laioutr Battery Included app package. Add search, suggested search, and product recommendations to your Laioutr frontend via the BatteryIncluded API.
seo:
  title: Battery Included | Laioutr
  description: Developer documentation for the Laioutr Battery Included app package. Add search, suggested search, and product…
---

## Overview

The **@laioutr-app/battery-included** package integrates [BatteryIncluded](https://batteryincluded.io/) into a Laioutr-powered Nuxt app. It uses the **BatteryIncluded API** for full-text product search (browse), suggested search (suggest and highlights), and product recommendations. The package registers with the Laioutr orchestr (queries, links, component resolvers) and exposes canonical types for **ProductSearchQuery**, **SuggestedSearchSearchQuery**, **SuggestedSearchEntriesLink**, **SuggestedSearchEntry**, and a custom **ProductRecommendation** link and resolver.

BatteryIncluded indexes your catalog (e.g. from Shopify or another commerce app); this package does not provide cart, menu, or category. It adds search, autocomplete/suggest, and “recommended for you” style links. The module installs **@laioutr-core/frontend-core**, **@nuxt/image**, and **@laioutr-app/shopify** on prepare; use Battery Included alongside a commerce app (e.g. Shopify) so product data is available for search and recommendations.

## Configuration requirements

The module expects configuration under the key **`@laioutr-app/battery-included`** in `nuxt.config.ts` (or via `runtimeConfig`). Two options are required; one is optional.

### Module options

| Option | Type | Description |
|--------|------|-------------|
| **`baseURL`** | `string` | BatteryIncluded API base URL. Default: `https://api.batteryincluded.io`. |
| **`collection`** | `string` | BatteryIncluded collection identifier. Used in all API paths: `/api/v1/collections/{collection}/...`. |
| **`apiKey`** | `string` | API key for authentication. Sent as **X-BI-API-KEY** header on every request. Keep secret and only use on the server (private runtime config). |

### Example configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/battery-included', '@laioutr-core/orchestr'],
  '@laioutr-app/battery-included': {
    baseURL: process.env.BATTERY_INCLUDED_BASE_URL ?? 'https://api.batteryincluded.io',
    collection: process.env.BATTERY_INCLUDED_COLLECTION!,
    apiKey: process.env.BATTERY_INCLUDED_API_KEY!,
  },
});
```

Use environment variables for `collection` and `apiKey` in production; do not commit the API key.

### Runtime behavior

- **BatteryIncluded SDK**  
  The package builds a **BatteryIncludedSDK** instance per request with `baseURL`, `collection`, `apiKey`, and **locale** (derived from `clientEnv.locale`, e.g. first part before `-`). All requests are sent to `/api/v1/collections/{collection}{endpoint}` with `X-BI-API-KEY` and `v[locale]` query param. The SDK is passed into the orchestr context as **batteryIncludedClient**.

- **Available sortings**  
  The middleware injects a default **availableSortings** list (e.g. `price:asc`, `price:desc`) into context; used by **ProductSearchQuery** in the response.

- **Passthrough tokens**  
  **suggestionResultsFragmentToken** – Stores suggested-search result (id + suggestions array with type, title, link) for **SuggestedSearchEntriesLink** and **SuggestedSearchEntry** resolver.  
  **recommendationsToken** – Stores raw recommendation responses for the **ProductRecommendation** resolver after **BatteryIncludedProductRecommendations** link runs.

- **Order**  
  Suggested-search query, link, and resolver use **order: 2** so they run after other providers (e.g. Shopify suggested search); you can combine multiple suggestion sources.

## Capabilities

The package implements Laioutr’s canonical search and suggested-search types plus a custom recommendations link. The following lists what is available; for exact types and payloads, refer to `@laioutr-core/canonical-types` and the package source.

### Queries

- **Product**  
  - **ProductSearchQuery** – Full-text product search. **Input:** `query`. Uses **browse** API with pagination, sort, and filters (mapped via orchestr-helper facets). Returns `ids` (document ids from hits), `total` (found), `availableFilters`, `availableSortings`, `sorting`.

- **Suggested search**  
  - **SuggestedSearchSearchQuery** – Suggested search / autocomplete. **Input:** `query`. If `query` is empty, calls **highlights** and returns suggestion id with search highlights as query suggestions (link to ProductSearchPage with `q: ""`). If `query` is set, calls **suggest** and builds suggestions from query-completion, document (product), and facet (category) hits. Stores result in **suggestionResultsFragmentToken**. Returns `id` (e.g. `search-suggest:{query}`). **Order: 2.**

### Links

- **Product**  
  - **BatteryIncludedProductRecommendations** – Custom link token `battery-included/product/recommendations`. **Source:** Product. **Target:** ProductRecommendation. Resolves product IDs to recommendation document IDs. For each source id calls **recommend(id)**. Stores responses in **recommendationsToken**. Returns `links: [{ sourceId, targetIds }]`.

- **Suggested search**  
  - **SuggestedSearchEntriesLink** – Resolves suggested-search result id to suggestion entry ids. Reads **suggestionResultsFragmentToken** from passthrough (required). Returns one link: sourceId = result id (or first of entityIds), targetIds = suggestion entry ids. **Order: 2.**

### Component resolvers

- **ProductRecommendation** – Resolves recommendation entities. **Requires** **recommendationsToken** in passthrough (set by **BatteryIncludedProductRecommendations** link). Provides **RecommendationBase** (relation: `also` | `together` | `related`). Maps each recommendation response to an entity with `id: res.document.id`, `relation: res.type`.

- **SuggestedSearchEntry** – Resolves suggested-search entries. **Requires** **suggestionResultsFragmentToken** in passthrough (set by **SuggestedSearchSearchQuery**). Provides **SuggestedSearchEntryBase** (type, title, link). **Order: 2.**

## Backend requirements

- **BatteryIncluded account** – Create an account and a **collection** that indexes your catalog (e.g. products from Shopify). Obtain the **API key** for that collection.
- **Commerce app** – Use a commerce app (e.g. **@laioutr-app/shopify**) so product data exists for the storefront; Battery Included powers search and recommendations over that data. Product IDs returned by Battery Included (e.g. from browse or recommend) must match the IDs used by your commerce app (e.g. Shopify GID or SKU) so the product resolver can load full details.
- **Locale** – The SDK sends `v[locale]` on every request; ensure your BatteryIncluded collection supports the locales you use in `clientEnv.locale`.

## Cookies and context

This package does not set or read any cookies. All calls are stateless per request using the API key and collection.

## Summary checklist

- Add **@laioutr-app/battery-included** to Nuxt modules (and a commerce app such as **@laioutr-app/shopify** for product data).
- Set **baseURL** (optional), **collection**, and **apiKey** under `@laioutr-app/battery-included` (e.g. from env).
- Ensure your BatteryIncluded collection is populated and the API key has access to browse, suggest, highlights, and recommendations.
- Use **ProductSearchQuery** for search results, **SuggestedSearchSearchQuery** + **SuggestedSearchEntriesLink** + **SuggestedSearchEntry** for autocomplete, and **BatteryIncludedProductRecommendations** link + **ProductRecommendation** resolver for recommendations.
- Keep **apiKey** in private runtime config only; do not expose it to the client.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package’s GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo’s **`CHANGELOG.md`** for release notes.
