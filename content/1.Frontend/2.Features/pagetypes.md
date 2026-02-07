---
title: Page Types
description: Laioutr’s page type abstraction lets customers add different kinds of pages to their frontend (Home, Product Detail, Landing Page, Search, etc.). Learn the key concept, what the platform provides, and how to add custom page types with the right routing, data, and Studio behaviour.
---

## What are page types?

In Laioutr, the frontend is built from **pages** that the customer configures in Studio. Each page has a **page type**: a named kind of page that defines what the page is (e.g. “Home”, “Product Detail”, “Landing Page”), what URL shape it has, what data it needs, and how it appears in the Studio UI. The customer can add multiple pages of the same type (e.g. many landing pages) or a single page per type (e.g. one Home). Page types are the backbone of routing, link resolution, and the “Add page” experience in Studio.

Laioutr provides a **page type abstraction** so that:

- **Backend and Studio** know which page types exist, how to label and group them, and how to generate default paths when the customer adds a new page.
- **Frontend routing** can match URLs to the right page and pass route params into the page’s data (e.g. `slug` → product query).
- **Links** can point to a page type (e.g. “search page with query”) or to a **reference** (e.g. “this Product”); the **link resolver** uses page type metadata to turn references into URLs (e.g. which page type “resolves” a Product link).

As a developer, you work with **page type tokens**: each token is a string identifier (e.g. `'ecommerce/product-detail-page'`) plus **metadata** (path rules, required data, Studio label/icon, and which reference types it resolves). You define tokens with **definePageTypeToken** and register them so the rest of the platform can use them.

## Key concepts

### Static vs dynamic

Every page type has a **kind**:

- **`static`** – The page type can exist **multiple times** in the same project (e.g. Landing Page, Content Page). Each page has its own ID; path generation typically includes that ID (e.g. `/landingpage-<id>` or a slug).
- **`dynamic`** – The page type usually exists **once** per project and is often driven by a **route** (e.g. Home at `/`, Product Detail at `/products/:slug`, Search at `/search`). Path constraints describe the URL pattern and required params.

### Path constraints

**pathConstraints** tell the platform how URLs for this page type look:

- **`exact`** – A fixed path (e.g. Home `'/'`, or Shopify content `'/pages/:slug'`).
- **`default`** – Default path pattern (e.g. `/products/:slug+`, `/search`, `/categories/:slug+`). Studio uses this when suggesting a path for a new page.
- **`requiredParams`** – List of route param names (e.g. `['slug']`) so Studio can generate a path that includes them.

If you don’t set `exact` or `default`, the platform derives a path from the page type name and `requiredParams` (e.g. for dynamic kinds).

### Required queries

Many page types need **data** that depends on the current route (e.g. “the product for this slug”). **requiredQueries** declare that:

- **alias** – Name used in page templates to reference this query (e.g. `'product'`, `'products'`).
- **entityType** – Logical entity (e.g. `'Product'`, `'Category'`) for Studio/orchestration.
- **default** – A **query template** with a **token** (the actual query) and **inputRules** that bind route/query to the query input (e.g. `slug: { join: ['/', { var: 'route.params.slug' }] }` or `query: { var: 'route.query.q' }`).

So the abstraction connects “this page type” to “this query, with these inputs from the route.” The runtime then loads the right data for each page instance.

### Link resolution and references

Links in Laioutr can be:

- **`type: 'pageType'`** – Point to a page type with optional **params** and **query** (e.g. search page with `q`). The link resolver finds the route whose page has that **type** and resolves to that route with the given params/query.
- **`type: 'reference'`** – Point to an entity (e.g. Product, Category) by **referenceType**, **slug**, and optional **id**. The resolver looks up which page type **resolveFor** that **referenceType** and then finds the route for that page type, passing the reference as params (e.g. product slug).

So **resolveFor** on a page type means: “links that reference this entity type should resolve to a page of this page type.” For example, Product Detail Page has `resolveFor: [{ referenceType: 'Product' }]`, so a Product reference link becomes the URL of the product-detail route with the product slug.

## What Laioutr provides

### Core types and registry

- **@laioutr-core/core-types** (frontend):
  - **PageTypeToken** – A branded string plus metadata (name, kind, studio, requiredQueries, pathConstraints, resolveFor, etc.).
  - **definePageTypeToken(name, meta)** – Defines a page type and **registers** it in the global **pageTypeTokenRegistry**.
  - **pageTypeTokenRegistry** – **getMetadata(token)** and **all()** so the frontend and Studio can read metadata for routing, link resolution, and UI.

Metadata is defined in **PageTypeToken.ts**: `name`, `kind` (`'static' | 'dynamic'`), `studio` (label, group, icon, variantIcon, groupBy, description), `requiredQueries`, `suggestedQueries`, `pathConstraints`, `resolveFor`.

### Built-in page types (canonical-types)

Laioutr defines common page types in **@laioutr-core/canonical-types** (or equivalent), for example:

- **core/home** – Dynamic, path `'/'`.
- **core/landingpage** – Static, group “General”, groupBy year.
- **core/contentpage** – Static, “Content Page”.
- **ecommerce/product-detail-page** – Dynamic, required product query, path `/products/:slug+`, resolveFor Product.
- **ecommerce/product-listing-page** – Dynamic, category + products queries, path `/categories/:slug+`, resolveFor Category.
- **ecommerce/product-search-page** – Dynamic, search query, path `/search`, input from `route.query.q`.
- **core/notfound** – Dynamic (or similar).
- Blog-related: blog post, blog post listing, blog collection (with requiredQueries and resolveFor where applicable).

Apps can add more: e.g. **Shopify** (shopify/content-page), **App Store** (app detail, app category). Each app defines its token with **definePageTypeToken** and ensures the defining module is loaded (e.g. via a Nuxt plugin that imports the token).

### Link resolver (frontend-core)

The **link resolver** (**useLinkResolver()**, **resolve(link)**) in **@laioutr-core/frontend-core**:

- For **pageType** links: finds the route whose **renderPage/rcPage** has **type** equal to the link’s **pageType**, then resolves to that route with **params** and **query**.
- For **reference** links: uses **pageTypeTokenRegistry.all()** to find a page type whose **resolveFor** includes the link’s **referenceType**, then finds the route for that page type and resolves with the reference’s slug/params.

So custom page types that declare **resolveFor** automatically participate in reference link resolution once their routes exist.

### Studio

Studio (Cockpit) uses page type metadata to:

- **Group and label** pages in the page switcher (studio.label, studio.group).
- **Icons** (studio.icon, studio.variantIcon) and optional **groupBy** (e.g. by year for landing pages).
- **Path generation** when adding or editing pages: **pathConstraints** (exact, default, requiredParams) and **kind** drive the generated path (see `generatePagePath` in cockpit).

So your custom page type’s **studio** and **pathConstraints** directly control how it appears and how its URL is proposed in Studio.

## How to add custom page types

### 1. Define the token

Create a module that defines your page type with **definePageTypeToken** from **@laioutr-core/core-types/frontend** (or the frontend entry that re-exports it). Use a unique **name** (e.g. `'your-app/your-page-type'`).

```ts
// e.g. runtime/shared/pageTypes/my-detail.pagetype.ts
import { definePageTypeToken } from '@laioutr-core/core-types/frontend';
import { MyEntityBySlugQuery } from '../queries/MyEntityBySlug.query';

export const MyDetailPage = definePageTypeToken('my-app/my-detail-page', {
  kind: 'dynamic',
  studio: {
    label: 'My Detail Page',
    group: 'Custom',
    icon: 'file-lines',
  },
  requiredQueries: [
    {
      alias: 'entity',
      entityType: 'MyEntity',
      default: {
        label: 'Page Entity',
        urlAlias: '_',
        token: MyEntityBySlugQuery,
        inputRules: { slug: { join: ['/', { var: 'route.params.slug' }] } },
      },
    },
  ],
  pathConstraints: {
    requiredParams: ['slug'],
    default: '/my-entity/:slug',
  },
  resolveFor: [{ referenceType: 'MyEntity' }],
});
```

- **kind** – `'static'` if the customer can add many pages of this type; `'dynamic'` if it’s typically one per project and route-driven.
- **studio** – label, group, icon (and optionally variantIcon, groupBy, description) for Studio.
- **requiredQueries** – only if the page needs entity data; **inputRules** bind **route.params** / **route.query** to the query token’s input.
- **pathConstraints** – so Studio and routing know the URL shape.
- **resolveFor** – only if you want **reference** links (e.g. “link to this MyEntity”) to resolve to this page type.

For a **static** page type (e.g. a simple custom landing type), you can omit **requiredQueries** and **resolveFor** and only set **pathConstraints** if you need a specific default path pattern.

### 2. Ensure the token is loaded

Registration happens when **definePageTypeToken** runs. So the module that defines the token must be executed (e.g. imported). A common pattern is a Nuxt plugin that imports the token so the app bundle loads it:

```ts
// e.g. plugins/pagetypes.ts
import { defineNuxtPlugin } from '#app';
import { pageTypeTokenRegistry } from '@laioutr-core/core-types/frontend';
import { MyDetailPage } from '../shared/pageTypes/my-detail.pagetype';

export default defineNuxtPlugin(() => {
  [MyDetailPage].forEach((token) => pageTypeTokenRegistry.getMetadata(token));
});
```

This ensures the token is registered before the link resolver or Studio needs it.

### 3. Backend and routes

- **RC (runtime config) pages** have a **type** string that must match your token’s **name** (e.g. `'my-app/my-detail-page'`). The frontend matches routes to pages by this type.
- **Route registration** is usually driven by the RC: each page becomes a route; **route.meta** carries the page (renderPage/rcPage) so the link resolver can find the route by **type**.
- Studio’s path generation uses **pathConstraints** from **pageTypeTokenRegistry.getMetadata(token)** so new pages of your type get a sensible default path.

So: define the token, load it, and ensure your backend/Studio can create pages with that **type** and the frontend registers routes for those pages. Then link resolution and Studio behaviour for your page type will follow.

## Summary

- **Page types** define the kinds of pages the customer can add (Home, Product Detail, Landing Page, Search, custom types). They are identified by **page type tokens** and **metadata** (kind, pathConstraints, requiredQueries, studio, resolveFor).
- Laioutr provides **definePageTypeToken**, **pageTypeTokenRegistry**, **link resolver** (pageType + reference), and **Studio** integration (groups, labels, icons, path generation). Built-in and app-specific page types live in canonical-types and in apps (Shopify, App Store, etc.).
- To **add a custom page type**: (1) define it with **definePageTypeToken** (name, kind, studio, optional requiredQueries/pathConstraints/resolveFor), (2) ensure the defining module is loaded (e.g. plugin import), (3) ensure backend/Studio can create pages with that type and the frontend registers routes for them. Then your page type gets routing, link resolution (including references if you set **resolveFor**), and the Studio UX you configured.
