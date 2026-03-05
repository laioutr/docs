---
title: Server-Side Rendering (SSR) and Caching
description: How the Laioutr frontend uses SSR by default, how to make pages cacheable, how to enable CDN and HTTP caching, and how to override behaviour in your own modules for custom SSR and caching.
---

The Laioutr frontend is a **Nuxt 3** app. By default it uses **server-side rendering (SSR)**: the server renders HTML for each request and sends it to the browser, then the app **hydrates** on the client so the page becomes interactive. This improves perceived performance and SEO. To get the most out of a **CDN** (Content Delivery Network) or edge caching, you need to know what the frontend does by default, which pages are good candidates for caching, and how to adjust or override SSR and caching in your own modules.

This page explains: (1) **what the frontend does by default** for SSR, (2) **making SSR cacheable** (what to cache, and how to handle time-sensitive or personalized content), (3) **enabling SSR and HTML caching** (TTL, Cache-Control, route rules), (4) **caching API and data responses**, and (5) **how you can override** these behaviours for custom handling.

---

## What the frontend does by default

### SSR is on by default

The frontend does **not** set `ssr: false`. So **Nuxt’s default applies: SSR is enabled.** When a user opens a URL (e.g. from a link or search result), the **server** renders the page:

1. The server matches the route to a **page** from the runtime config (RC).
2. **PageRenderer** runs and **awaits** Orchestr **queries** for that page and its variant (e.g. product by slug, category listing). So the **first paint** is based on data fetched **on the server**.
3. The server sends **HTML** plus the serialized state; the browser shows the content and then **hydrates** so Vue and your sections/blocks become interactive.

So by default, **pages are server-rendered** and the initial data for the page comes from the Orchestr API (which runs on the same Nitro server during SSR).

### Actions and SSR

When you call a server action via **useFetchAction**, it uses Nuxt’s **useAsyncData**. That means the action runs **once on the server** during SSR (if the component is rendered then), and the result is **transferred to the client**. So you don’t double-execute the action on client load; it’s SSR-friendly by design.

### Client-only code

Where something must run only in the browser (e.g. connecting to the Studio iframe, or using `window`), the platform uses **SSR-safe** patterns: **ClientOnly** (Nuxt’s built-in component), or **import.meta.client** checks so that code is skipped on the server. You can use the same patterns in your sections and blocks when you need client-only behaviour.

### What is not set by default

Out of the box, the frontend does **not** set:

- **Cache-Control** headers for HTML or API responses
- **routeRules** (or Nitro `routeRules`) for caching or TTL
- Any CDN-specific config

So the **default is “SSR on, no HTTP/CDN caching”**. To make SSR output cacheable and to cache API responses, you (or your hosting/CDN layer) need to add cache headers or route rules as described below.

---

## Making SSR cacheable

For a **CDN** to cache SSR output, the **HTML** for a given request must be the same for every user (or you must include something like a cookie in the cache key and accept lower cache hit rates). So you need to decide **which pages to cache** and **which content to keep out of SSR** so that the server-rendered HTML is safe to share.

### Good candidates for caching

Good candidates for caching are shareable, indexable pages; bad candidates are session-specific or highly personalized pages. Pages that are typically reached via **external links** or **search** are good candidates for **SSR + CDN caching**:

- **Homepage**
- **Product detail pages** (PDP)
- **Category / listing pages** (PLP)
- **Content / CMS pages** (e.g. landing, info pages)

These are the same for (or vary only by URL/locale, which you can encode in the cache key). Caching them improves performance and reduces load on your origin.

### Poor candidates for caching

Pages that are **session-specific** or **personalized** are poor candidates for shared HTML cache:

- **Checkout**
- **Cart** (if rendered as a full page)
- **Profile / account** (e.g. “My orders”, “Edit profile”)
- **Login / register**

If you cache their HTML, you risk serving one user’s data to another (e.g. cart or recommendations). So either **do not cache** these routes, or ensure **personalized content is not in the SSR output** (see below).

### Time-sensitive data

Data that changes often (e.g. **stock**, **live prices**) may be wrong if cached for a long time. You can:

- **Shorten TTL** for those pages or for the API that feeds them, or
- **Fetch that data on the client** after the initial SSR so the cached HTML is “stable” and only the time-sensitive part updates in the browser.

The trade-off depends on how fresh the data must be and how long your cache TTL is.

### Personalized and session-specific data

**Personalized** or **session-specific** content (cart, wishlist, user name, recommendations per user) should **not** be part of the SSR output if you want **one cached HTML per URL** (or per URL + locale). Otherwise:

- Either the CDN cache key includes the user/session (e.g. cookie), which **reduces cache hits**, or
- The same URL returns the same HTML for everyone, and users could see **another user’s** data (privacy and UX issues).

**Recommended approach:** Keep SSR output **generic** for cacheable pages. Load **personalized** or **session-specific** content **on the client** after hydration:

- Use **ClientOnly** around components that show cart, wishlist, recommendations, or “Hello, {name}”.
- Or fetch that data in a composable/component that only runs on the client (e.g. guarded with **import.meta.client** or inside **onMounted**), and show a **skeleton** or placeholder during load so layout doesn’t shift.

This way the CDN can cache one HTML per URL (and optionally per locale if you vary by that), and personalization still works correctly.

### Skeletons for client-only content

For every part of the UI that you **defer to the client** (e.g. “Products you may like”), use a **skeleton** (placeholder) with the **same dimensions** as the final content. That avoids **layout shift** when the real data loads and keeps Core Web Vitals and UX in good shape.

---

## Enabling SSR caching (TTL and Cache-Control)

To have a **CDN** (or any HTTP cache) store and reuse SSR responses, you need to send **Cache-Control** (and optionally other headers) so caches know how long they can keep the response. In Nuxt 3 you can do this with **route rules** or **middleware**.

### TTL (time-to-live)

**TTL** is how long a cache may consider the response “fresh.” After that, the cache will revalidate or fetch again from the origin. Common pattern:

- **HTML:** Short TTL (e.g. 15–60 seconds) so that after a new deploy, users get new HTML (and thus the right JS/assets) quickly. Long HTML TTL can mean users keep getting old HTML and outdated asset references.
- **Static assets** (JS, CSS, images): Long TTL (e.g. 1 year) with cache-busting filenames so deployments invalidate naturally.

A typical default for **HTML** is something like: **`public, max-age=0, s-maxage=15, must-revalidate`** — no browser cache for the HTML, but the CDN can cache it for 15 seconds.

### Where to set Cache-Control in a Laioutr frontend

**Option 1: Nuxt `routeRules` (recommended)**

In your app’s **nuxt.config.ts** you can define **routeRules** (Nitro’s `routeRules`) to attach headers per path:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Default: short CDN TTL for HTML, no browser cache
    '/**': {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15, must-revalidate' },
    },
    // Don’t cache session-specific pages
    '/checkout/**': { headers: { 'Cache-Control': 'private, no-store, no-cache' } },
    '/cart': { headers: { 'Cache-Control': 'private, no-store, no-cache' } },
    '/login': { headers: { 'Cache-Control': 'private, no-store, no-cache' } },
  },
});
```

You can override **per route** (e.g. longer TTL for a static content page, or `private, no-store` for account pages). The exact paths depend on your app’s routing (page types and paths from your RC).

**Option 2: Nitro `routeRules`**

Same idea under **nitro.routeRules** if you prefer to keep everything in Nitro config:

```ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15, must-revalidate' } },
      '/checkout/**': { headers: { 'Cache-Control': 'private, no-store, no-cache' } },
    },
  },
});
```

**Option 3: Middleware**

You can also set **Cache-Control** in a Nuxt/Nitro **middleware** (or in a handler) based on the request path or other logic. Use this when you need dynamic rules (e.g. depending on locale or cookie).

### Overriding from your own module

If you ship a **Nuxt module** (e.g. a Laioutr app) and want to add or override cache behaviour:

- In your module’s **setup**, read or extend **nuxt.options.routeRules** (or **nuxt.options.nitro.routeRules**) and add entries for the routes your module cares about.
- You can **merge** with existing rules so the app or other modules can still define their own; just avoid overwriting the whole object if others already use it.

That way, developers get your default caching for your routes but can still override globally or per route in **nuxt.config.ts**.

---

## Caching API and data responses

There are two different layers: **(1) Orchestr’s own data cache** (already built in), and **(2) HTTP caching** of API responses (for CDN or browser).

### Orchestr data cache (built-in)

The **Orchestr** layer caches **query**, **link**, and **component resolver** results **on the server** (see [Caching](/frontend/orchestr/caching)). So when the same query runs again (e.g. same product, same category), the result can be served from cache instead of calling the backend again. That reduces load on your commerce backend and speeds up SSR and client requests.

This is **independent** of CDN/HTTP caching: it’s an application-level cache inside the Nuxt/Nitro server. You configure it per query/link/resolver (TTL, cache key, strategy). No extra step is required for “caching API responses” at the Orchestr level beyond what’s in the Caching doc.

### Caching API responses at the HTTP layer (CDN / browser)

If you put a **CDN** in front of your frontend, the CDN can also cache **API responses** (e.g. requests to `/api/orchestr/...` or other server routes) **if** those responses send **Cache-Control** (and optionally **Vary**) headers. Then the traffic **between the browser and your server** (or CDN) can be cached; the **requests made internally during SSR** (server-to-itself) are typically not going through the CDN, so they don’t benefit from CDN cache unless you have a different setup (e.g. internal cache or edge).

To make **specific API routes** cacheable by the CDN:

1. **Set Cache-Control** on the response for that route (e.g. `public, max-age=0, s-maxage=60, must-revalidate` for a 60-second CDN TTL). You can do this via **routeRules** for the API path or inside the route handler.
2. If the response **varies** by a header (e.g. `Accept-Language` or a custom `x-currency`), set the **Vary** header so the CDN stores separate entries per value.
3. **Do not** cache routes that are mutations (POST that change state), return user-specific data, or require auth, unless you intentionally cache per user (e.g. by cookie in the cache key) and accept the trade-offs.

You can define **routeRules** for `/api/**` (or `/api/orchestr/**`) with the desired headers, or in your own module add rules for your API routes. Same idea as for HTML: your module can extend **nuxt.options.routeRules** (or **nitro.routeRules**) in its setup.

---

## How to adjust and override (summary for developers)

### General settings

| What | Where | Default in Laioutr |
|------|--------|--------------------|
| **SSR on/off** | **nuxt.config.ts** → `ssr: true \| false` | `true` (Nuxt default; we don’t set it) |
| **HTML caching** | **routeRules** or **nitro.routeRules** → `headers['Cache-Control']` | Not set (no CDN TTL by default) |
| **API response caching** | Same: routeRules for `/api/**` or per-handler headers | Not set |

So: **SSR is on by default**; **caching is off by default**. To enable CDN-friendly caching, you add **routeRules** (or middleware) and set **Cache-Control** (and **Vary** if needed).

### Per-route overrides

- In **nuxt.config.ts**, define **routeRules** with path patterns (e.g. `'/checkout/**'`, `'/cart'`, `'/api/orchestr/query'`) and set different **Cache-Control** (or **private, no-store** for non-cacheable routes).
- You can use a **default** rule for `'/**'` and then override specific paths with stricter or more permissive headers.

### Custom handling in your modules

If you build a **Laioutr app** or another Nuxt module:

1. **SSR-safe components** – Use **ClientOnly** or **import.meta.client** for anything that must run only in the browser (e.g. third-party scripts, Studio connection, `window`). Provide a **skeleton** or placeholder so layout doesn’t shift.
2. **Personalized content** – Prefer loading it **on the client** (e.g. in `onMounted` or a client-only composable) so SSR HTML stays cacheable. Don’t put user-specific data into the initial SSR payload for cacheable pages.
3. **Cache headers** – In your module’s **setup**, extend **nuxt.options.routeRules** (or **nuxt.options.nitro.routeRules**) to add or override **Cache-Control** (and **Vary**) for the routes your module registers (e.g. API routes or specific page paths).
4. **Orchestr cache** – For your query/link/resolver handlers, use the existing [Orchestr Caching](/frontend/orchestr/caching) (strategy, TTL, buildCacheKey) to control server-side data caching; that’s separate from HTTP/CDN caching.

This gives you a **basic understanding** of what the frontend does by default (SSR on, no HTTP caching), how to **make SSR cacheable** (good vs bad pages, time-sensitive and personalized content, skeletons), how to **enable SSR and API caching** (TTL, Cache-Control, routeRules), and how to **adjust and override** in your own modules for custom SSR and caching behaviour.
