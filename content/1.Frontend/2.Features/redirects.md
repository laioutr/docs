---
title: Redirects
description: How Laioutr frontends use Nuxt 3 redirects to send visitors to the right page.
---

## Redirects in Laioutr frontends

Laioutr frontends are built on **Nuxt 3**, which comes with a rich set of redirect options. We use these standard Nuxt features to cover common business needs like:

- Moving from an old URL structure to a new one.
- Handling short campaign URLs.
- Redirecting outdated content to a better page.
- Sending visitors to the right market, language, or login page.

This page explains the **types of redirects we support** and **when you would typically use each of them**, without going into implementation details.

---

## Server-side redirects

Server-side redirects happen **before a page is rendered**. The visitor’s browser is told to go to a different URL, and the original page never loads. This is ideal when you want:

- Clean SEO behaviour (search engines see the redirect at the HTTP level).
- Stable rules that apply even if JavaScript fails.
- To protect certain areas (for example, redirecting non-logged-in users away from private routes).

In Nuxt 3, Laioutr uses two main ways to do server-side redirects.

### Server routes

**What it is**  
Server routes are **backend-style endpoints** (for example `/old-blog/*`) that run on the server. They can:

- Look at the incoming request path.
- Decide whether a redirect is needed.
- Return an HTTP redirect response (such as “301 Moved Permanently” or “302 Found”).

**Typical use cases**

- **Legacy URL migration** – you have an old shop or CMS and want `/old-category/shoes` to move to `/shop/shoes`.
- **Consolidating content** – redirect multiple outdated articles to a single new guide.
- **Permanent structural changes** – when you know a URL will never come back and want search engines to update their index.

**What business users should know**

- These redirects are **very robust**: they work even without JavaScript and are friendly to SEO.
- They are ideal when you have a list or pattern of old URLs that should always go somewhere new.
- Your implementation team can maintain these rules centrally on the server.

### Server middleware

**What it is**  
Server middleware is logic that runs **for every (or selected) request** before Nuxt chooses which page to render. It can:

- Inspect the requested URL, headers, cookies, or user information.
- Decide whether the request should continue or be redirected.

**Typical use cases**

- **Market or region redirects** – send visitors to the correct market storefront based on domain, language, or geolocation rules.
- **Feature rollouts** – temporarily redirect certain traffic (e.g. beta users) to a new experience.
- **Security and access control** – redirect unauthenticated users to a login page for protected areas.

**What business users should know**

- Server middleware is best when redirects depend on **conditions**, not just fixed old→new URL pairs.
- Rules can take into account things like user login state, cookies, or custom headers.
- Like server routes, these redirects happen early and are good for SEO and performance.

---

## Universal redirects

Universal redirects work **both on the server and in the browser**, using Nuxt’s routing layer. They are useful when you want redirect rules that:

- Apply during **initial page load** (server-side).
- Also apply when the user navigates inside the app **without a full page reload** (client-side).

### Route middleware

**What it is**  
Route middleware runs whenever Nuxt navigates to a route—on the server for the first request and in the browser for internal navigation. It can:

- Look at the target route and current user state.
- Cancel the navigation and redirect to another page.

**Typical use cases**

- **Login and access control** – if a page requires login or specific roles, route middleware can redirect to:
  - A login page.
  - An “access denied” page.
  - A plan upgrade page.
- **Feature flags** – redirect users to different routes depending on experiments or entitlements.
- **Simple re-routing inside the app** – for example, redirect `/account` to `/account/overview`.

**What business users should know**

- These redirects work reliably whether users land directly on a page or click through from within the app.
- They are ideal when redirect rules are tied to **application state** (such as “user is logged in” or “has a subscription”).
- They keep business rules close to the routes they affect, which makes them easier to maintain.

### Route rules

**What it is**  
Route rules are **configuration entries** that attach behaviour to specific URL patterns. Among other things, Nuxt route rules can describe:

- Redirects from one route to another.
- Caching behaviour, headers, and more.

In a Laioutr context, route rules let your team:

- Declare redirects in a **central configuration file**, rather than coding them deep inside components.
- Apply behaviour by pattern (for example “all URLs under `/blog/old/` redirect to `/blog`”).

**Typical use cases**

- **Simple path-based redirects** – define that `/black-friday` should redirect to the current campaign page.
- **SEO housekeeping** – ensure canonical URLs (e.g. redirect `/product?id=123` to `/products/sneaker-123`).
- **Project templates** – standardise how certain URL spaces behave across environments (staging, production).

**What business users should know**

- Route rules make redirect behaviour **transparent and audit-friendly**: you can review what’s configured without reading application code.
- They are well-suited for lists of redirects that may change over time (campaigns, marketing pages, etc.).

---

## Client-side redirects

Client-side redirects happen **inside the browser after a page has started to load**, usually from within Vue components. They rely on JavaScript being active and are generally not used for SEO-critical redirects.

### Inside your Vue components

**What it is**  
Vue components can trigger redirects based on **what happens on the page**. For example:

- After a successful form submission.
- When a user clicks a button.
- When some piece of data loads and does not match expectations.

Instead of returning a redirect from the server, the component tells the router to navigate to a different page.

**Typical use cases**

- **Wizards and multi-step flows** – move the user from step 1 to step 2, or back to an overview after completion.
- **Post-action redirects** – send a customer from “add to wishlist” or “update profile” back to a relevant screen.
- **Soft-guard flows** – gently guide users to a better page when something is missing (for example, redirect to a selection page if no active market is chosen).

**What business users should know**

- These redirects are about **user experience within the app**, not about URL migrations or SEO.
- They depend on JavaScript; if you need a guarantee that every visitor is redirected, prefer server-side or universal redirects.
- They are the most flexible option for interactive flows and conditional journeys.

---

## Choosing the right type of redirect

From a business perspective, you don’t need to know the Nuxt APIs in detail. It’s more important to pick the right **capability** for your scenario:

- **You are cleaning up or migrating URLs** → use **server-side redirects** (server routes or server middleware).  
- **You are enforcing access rules or feature flags across the whole app** → use **universal redirects** (route middleware or route rules).  
- **You are shaping in-app journeys after user actions** → use **client-side redirects inside components**.

Laioutr’s frontend stack builds on Nuxt 3’s redirect features to cover all of these cases. You can configure, mix and match them so visitors always end up on the right page, whether they come from search, campaigns, or deep links inside the app.