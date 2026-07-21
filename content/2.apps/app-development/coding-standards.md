---
title: Coding Standards
description: Conventions and quality guidelines for developing Laioutr apps. Use these standards to keep app code consistent, maintainable, and aligned with the Laioutr ecosystem.
seo:
  title: Coding Standards
  description: Conventions and quality guidelines for developing Laioutr apps. Use these standards to keep app code consistent,…
sitemap:
  loc: /apps/app-development/coding-standards
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Overview

This document describes coding standards for **Laioutr apps** — Nuxt modules that extend Laioutr via `registerLaioutrApp` and optionally provide orchestr handlers, sections, blocks, and page wrappers. Following these conventions keeps your app consistent with official and community apps, simplifies reviews, and makes it easier for others to contribute.

The standards cover: package and naming, module structure, configuration, orchestr layout and patterns, runtime layout, TypeScript, build and tooling, testing, and linting/formatting. Where the ecosystem allows flexibility, we note it.

## Package and naming

### Package name and config key

- **Package name** in `package.json` must be unique and stable (e.g. `my-laioutr-app`, `@laioutr-app/shopify`). Use a scope (e.g. `@laioutr-app/`, `@laioutr-org/`) for published apps.
- **Config key** in your Nuxt module must **exactly match** the package name. Laioutr passes app configuration from `laioutrrc.json` by this key. In `module.ts` use `configKey: name` where `name` is imported from `package.json`.

```ts
// module.ts
import { name, version } from '../package.json';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: name, // must match package name
  },
  // ...
});
```

- In **globalExtensions.ts**, augment `PublicRuntimeConfig` and `RuntimeConfig` with the same key (e.g. `['my-laioutr-app']` or `['@laioutr-app/commercetools']`) so TypeScript knows your app’s config shape.

### Repository and metadata

- Set **description**, **repository**, and **license** in `package.json`. Use a **CHANGELOG** (e.g. changelogen) for release notes.
- Prefer **MIT** for open-source apps unless your organization requires otherwise.

## Module structure

### Entry point and exports

- **Entry:** `src/module.ts` is the module entry. Build output is typically `dist/module.mjs` and `dist/types.d.mts`.
- **Exports:** In `package.json`, expose the main entry and types. Re-export types or utilities from `module.ts` if needed (e.g. `export * from "./globalExtensions"`).
- **Files:** Publish only what’s needed: e.g. `"files": ["dist"]` so source and playgrounds are not published.

### meta, defaults, setup

- **meta:** Always set `name`, `version`, and `configKey` (equal to package name).
- **defaults:** Provide sensible defaults for every option that has one. Omit only when the value must be supplied by the user.
- **setup:** Use a single `async setup(options, nuxt)` where you:
  1. Resolve paths with `createResolver(import.meta.url)` and a helper like `resolveRuntimeModule(path) => resolve("./runtime", path)`.
  2. Add runtime to transpile: `nuxt.options.build.transpile.push(resolve("./runtime"))`.
  3. Merge options into runtime config (see [Configuration](#configuration)).
  4. Call `registerLaioutrApp` with `name`, `version`, and the appropriate dirs (`orchestrDirs`, `sections`, `blocks`, `pageWrapper`).
  5. On `nuxt.options._prepare`, call `installModule` for peer dependencies so auto-imports and aliases work in consuming apps. Check [Platform Dependencies](/apps/app-development/platform-dependencies) first to avoid installing modules the platform already provides.

### registerLaioutrApp

- Pass **name** and **version** from `package.json`.
- **orchestrDirs:** Array of paths to server-side orchestr handler directories (e.g. `[resolveRuntimeModule("server/orchestr")]`).
- **sections** / **blocks:** If your app provides Studio sections or blocks, pass paths to the directories that contain the Vue components and definitions.
- **pageWrapper:** If your app provides a page wrapper component, pass its name(s) in the array.

### globalExtensions.ts

- **Purpose:** Extend Nuxt and Vue types so your app’s runtime config is typed.
- **Declare** `PublicRuntimeConfig[packageName]` and `RuntimeConfig[packageName]` using the same key as in `module.ts`. Use the types you export from `module.ts` (`RuntimeConfigModulePublic`, `RuntimeConfigModulePrivate`).
- **Vue:** Extend `GlobalComponents` and `ComponentCustomProperties` only if your app adds global components or properties.
- End the file with `export {}` so it is treated as a module.

## Configuration

- **ModuleOptions:** Interface for the options your module accepts (from `nuxt.config` or `laioutrrc.json`). Document each property; use optional (`?`) only when the option has a default or is truly optional.
- **RuntimeConfigModulePublic:** Shape of config exposed to the client. Include only **client-safe** values (no secrets).
- **RuntimeConfigModulePrivate:** Shape of config available only on the server. Typically extends `ModuleOptions` or includes secrets (API keys, client secrets).
- **Merge:** Use `defu` to merge user options with defaults into both `nuxt.options.runtimeConfig[name]` and `nuxt.options.runtimeConfig.public[name]`. Only put public values in `public`; keep secrets in private config.
- **Config key:** The key must be the package name (e.g. `my-laioutr-app`) so Laioutr can pass the correct slice of `laioutrrc.json` into your module. See [App Configuration](/apps/app-development/app-configuration).

## Orchestr

### Middleware (defineOrchestr)

- **Location:** Typically `src/runtime/server/middleware/` (e.g. `defineCommercetools.ts` or `index.ts`).
- **Pattern:** Create a base orchestr with `defineOrchestr.meta({ app: name, label, logoUrl }).extendRequest(...)`. The meta block identifies your app for Orchestr DevTools and other tooling: pass `app` (the package name from `package.json`), `label` (a human-readable display name like `'Shopware'`), and `logoUrl` (an absolute path to a logo image served from your app's public assets, e.g. `/app-shopware/shopware-logo.svg`). In `extendRequest`, build any client/context (API client, auth, facets) and return `{ context: { ... } }`.
- **Exports:** Re-export the handler factories from the base orchestr:
  - `defineXQuery` = base `.queryHandler`
  - `defineXAction` = base `.actionHandler`
  - `defineXLink` = base `.linkHandler`
  - `defineXComponentResolver` = base `.componentResolver`
  - `defineXQueryTemplateProvider` = base `.queryTemplateProvider` (if used)
- Handlers in the orchestr dir then import these (e.g. `defineCommercetoolsQuery`, `defineEmporixAction`) and use the canonical types from `@laioutr-core/canonical-types`.

### API client

Connectors typically wrap a backend HTTP/REST or GraphQL API. Generate a typed client from the backend's schema instead of writing fetch calls by hand:

- **REST/OpenAPI:** Use [`openapi-typescript`](https://openapi-ts.dev/) to generate types from the backend's OpenAPI spec, paired with [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) for a typed `fetch` wrapper. Commit the generated `schema.ts` under `src/runtime/server/client/` and add a `pnpm openapi:generate` script that refreshes it from the upstream spec URL.
- **GraphQL:** Use [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) to produce typed operations from `.graphql` documents.
- **Vendor SDK:** If the backend ships its own typed SDK (e.g. commercetools), use that and skip codegen.

Construct the client inside `extendRequest` so each request gets its own instance with the right auth, locale, and currency derived from `clientEnv`.

### File and folder naming

- **Entity-based folders:** Group handlers by canonical entity or feature: `cart/`, `menu/`, `product/`, `product-variant/`, `newsletter/`, etc.
- **Query files:** `<name>.query.ts` (e.g. `by-slug.query.ts`, `get-current.query.ts`, `by-alias.query.ts`).
- **Action files:** `<name>.action.ts` (e.g. `add-to-cart.action.ts`, `add-item.action.ts`, `subscribe.action.ts`).
- **Link files:** `<name>.link.ts` (e.g. `variants.link.ts`).
- **Resolver files:** `base.resolver.ts` per entity (e.g. `cart/base.resolver.ts`, `product/base.resolver.ts`). Use `entityType`, `label`, `provides`, and `resolve` with `$entity`.
- **Query template provider:** `<name>.template.ts` (e.g. `by-alias.template.ts`) when you provide multiple query inputs for static/menu generation.
- **Plugins:** Put Nitro/orchestr plugins under `orchestr/plugins/` (e.g. `zodFix.ts` for Zod compatibility).
- **Errors:** Put custom errors under `errors/` in the relevant entity folder (e.g. `menu/errors/category-not-found.error.ts`, `product/errors/products-not-found.error.ts`). Use a `.error.ts` suffix.

### Handler implementation

- **Queries:** Default export = `defineXQuery(CanonicalQuery, async ({ context, input, clientEnv, filter, sorting, pagination, passthrough }) => { ... })`. Return the shape expected by the canonical type (e.g. `{ id }`, `{ ids, total, availableFilters, availableSortings }`). For the filter request and `availableFilters` response shapes, see [Filters](/frontend/orchestr/filters).
- **Actions:** Default export = `defineXAction(CanonicalAction, async ({ context, input, clientEnv }) => { ... })`. Perform side effects and return the canonical action result.
- **Links:** Default export = `defineXLink(CanonicalLink, async ({ entityIds, context, passthrough }) => { ... })`. Return `{ links: [{ sourceId, targetIds }] }`.
- **Resolvers:** Default export = `defineXComponentResolver({ entityType, label, provides: [...], resolve: async ({ entityIds, context, clientEnv, $entity, passthrough }) => { ... } })`. Use `$entity({ id, base: () => ({...}), ... })` to build entities; return `{ entities }`.
- **Canonical types:** Import queries, actions, links, and entity parts from `@laioutr-core/canonical-types` (e.g. `ecommerce`, `entity/cart`, `entity/product`). Do not invent new variable or entity shapes; extend the canonical model if needed via the proper channels.
- **Cookies and response headers:** Set them inside `extendRequest` (runs before streaming) or inside an action (single non-streamed response). Query, link, and component-resolver handlers cannot set headers because the response stream has already started. See [Setting cookies and response headers](/frontend/orchestr/middleware#setting-cookies-and-response-headers).

### Errors

- Use **HTTP error classes** that map to appropriate status codes (e.g. `@ebec/http`). Extend `NotFoundError`, `BadRequestError`, etc., for consistent API behavior.
- Give each error a **static `code`** (e.g. `static readonly code = "PRODUCTS_NOT_FOUND"`) and pass a clear **message** and **data** in the constructor.
- Document public errors with **JSDoc** and `@public` if they are part of your app’s API.
- Export a **default no-op** (`export default () => {}`) from error files if the file is only for the class and you want to avoid side effects when importing.

### Passthrough and helpers

- **Passthrough tokens:** Use `createPassthroughToken<T>(key)` from the orchestr for data that should be shared between a query/link and a resolver in the same request (e.g. categories, products, variants). Set and get via `passthrough.set(token, value)` and `passthrough.get(token)`. Treat passthrough as the default path when your list query already returns full entity data; without it, every resolver in the chain refetches the same entities.
- **Userland cache:** Use `useUserlandCache<T>('myapp/concern')` from `#imports` for data that should survive across requests but lives outside query/link/resolver results (e.g. resolved auth tokens, system config, aggregated counts). The cache is cleared together with the orchestr cache. See [Userland cache](/frontend/orchestr/caching#userland-cache).
- **orchestr-helper:** Put pure mapping and helper logic in `runtime/server/orchestr-helper/` (e.g. cart helpers, product mappers, localized getters) so handlers stay thin and testable.
- **mappers:** Put backend-to-canonical mappers (e.g. filters, media) in `runtime/server/mappers/` and import them in resolvers or handlers.

## Section and block naming

Sections and blocks are registered as **global Vue components** when Laioutr loads your app. All apps in a project share one global component registry, so names must be **unique across every section and block in the project**, including those from other installed apps. If two apps register a `HeroBanner` component, whichever loads last silently overwrites the other.

To avoid collisions:

- Prefix section components with `Section` (e.g. `SectionHeroBanner`, `SectionProductGrid`).
- Prefix block components with `Block` (e.g. `BlockTestimonial`, `BlockCarouselSlide`).
- Keep the `component` value in the definition identical to the filename: `SectionHeroBanner.vue` registers as `'SectionHeroBanner'`.

The prefix also makes it clear in Studio and in Vue devtools whether a component is a top-level section or a slot-level block.

## Paths and routes

An app shares one origin with the project's editor-created content pages, the platform's own routes, and every other installed app. Just as global component names must be unique ([Section and block naming](#section-and-block-naming)), **every URL path your app owns must be namespaced** so it can never collide with a content slug or another app.

**Convention: prefix every app-owned path with `/app-<name>/`**, where `<name>` is your app's short name — the app segment of the package name (e.g. `shopware` for `@laioutr-app/shopware`). This is already the de-facto pattern for public assets; apply it uniformly across every path type:

- **Public assets** — place files under `src/runtime/app/public/app-<name>/` so they serve at `/app-<name>/…`. Your `defineOrchestr` `logoUrl` and any image/font/icon your runtime references use this path (e.g. `/app-shopware/shopware-logo.svg`).
- **Server routes** — when you register a browser- or server-facing route with `addServerHandler`, give it an `/app-<name>/…` path (e.g. the Shopware checkout handoff at `/app-shopware/checkout`).
- **Custom pages** — any Vue page your app adds to the router lives under `/app-<name>/…`.

One hard rule:

1. **Never use a bare top-level path** (`/checkout`, `/cart`, `/account`). Editors create content pages at arbitrary slugs, so an un-namespaced path can shadow — or be shadowed by — real content.

Keep the `<name>` segment identical everywhere (assets, routes, pages) and identical to the public-assets folder you already ship, so the whole app occupies one predictable path namespace.

## Extension hooks

When your app runs an effect a consuming project can't otherwise reach — an automatic emission site, or a value your runtime resolves internally — expose it as a **Nitro runtime hook** so the project can plug in without forking your app. Type the hook by augmenting `NitroRuntimeHooks` in `globalExtensions.ts`, fire it with `useNitroApp().hooks.callHook(...)`, and let projects tap it from a `defineNitroPlugin`. Name hooks `namespace:entity:action` (kebab-case) — present tense for before/during, past tense for after.

The Shopware app uses this for external-IdP (SSO) integration, where the project owns login and must supply / mirror the Shopware cart session token:

- `shopware:context-token:resolve` (bail): the project supplies the `sw-context-token` from its own session store; the app's cookie is the fallback.
- `shopware:context-token:changed` (notification): fired after the token is persisted, so the project can mirror it into its own store.

The hooks only **transport** the token — the app never mints it; establishing the customer session stays the project's responsibility. Full contract: `docs/plans/2026-07-17-shopware-sso-checkout-integration-design.md` in the platform repo.

## Runtime layout

- **Server-only** code lives under `src/runtime/server/`: `client/` (API/SDK factory), `const/` (keys, passthrough tokens), `mappers/`, `middleware/` (orchestr defineOrchestr), `orchestr/`, `orchestr-helper/`, `utils/`.
- **Client-only** code lives under `src/runtime/app/`: `components/`, `sections/`, `blocks/`, and optionally `image/` (providers), `public/`.
- **Shared (server + client)** code lives under `src/runtime/shared/`. This is where orchestr token files belong: `defineActionToken`, `defineQueryToken`, `defineLinkToken`, and `defineEntityComponentToken` declarations all need to be importable from both your server handlers and your frontend components, so they cannot live under `server/` or `app/`. The convention is `src/runtime/shared/tokens/<feature>.ts`.
- **Transpile:** The module must add `resolve("./runtime")` to `nuxt.options.build.transpile` so the runtime is compiled by the consuming app.

## TypeScript

- Use **strict** TypeScript. Rely on types from `@laioutr-core/canonical-types` and `@laioutr-core/core-types` for orchestr inputs and outputs.
- **Explicit types** for public APIs (module options, runtime config, exported functions). Use inference for local variables where it improves readability.
- **Empty object types:** If an interface has no properties (e.g. `RuntimeConfigModulePublic`), you may need `// eslint-disable-line @typescript-eslint/no-empty-object-type` or a comment property to satisfy the linter; keep the type if it is used for augmentation.
- **Import types** with `import type` where only types are needed to keep runtime imports clear.

## Build and tooling

### build.config.ts (unbuild)

- Use **unbuild** (e.g. via `nuxt-module-build`). Externalize dependencies that must not be bundled: at least `defu`, and often `@laioutr-core/frontend-core`, `@laioutr-core/kit`, `@parcel/watcher` if used. This keeps the dist small and avoids duplicate instances of core packages.

### package.json scripts

- **dev:** Prepare and run the main playground (`nuxi dev playground`).
- **orchestr-dev:** Prepare and run the orchestr playground (`nuxi dev orchestr-playground`).
- **dev:prepare:** Build the module (stub), run nuxt prepare for playground(s). Required before `dev` and `orchestr-dev`.
- **prepack:** Build the module for publishing (`nuxt-module-build build`).
- **release:** Lint, test, prepack, then run your release flow (e.g. changelogen, publish, push tags).
- **lint:** Run ESLint (e.g. `eslint .`).
- **test:** Run tests (e.g. `vitest run`).
- **test:types:** Type-check the module and playground (e.g. `vue-tsc --noEmit`).

### Playgrounds

- **playground:** Consumes your module and, if applicable, `laioutrrc.json` and Frontend Core. Use it for full UI and integration testing.
- **orchestr-playground:** Adds Orchestr and Orchestr DevTools. Use it to test queries and actions (e.g. Orchestr Request Editor) without a full project config. Both playgrounds should list your module and required peer deps in their own `package.json`.

## Testing

- Use **Vitest** for unit and **@nuxt/test-utils** for Nuxt-related tests. Place tests in `test/` (e.g. `basic.test.ts`) and fixtures under `test/fixtures/basic/` (minimal Nuxt app that uses your module).
- At least one **smoke test** (e.g. SSR render of a page) ensures the module installs and runs. Add handler- or resolver-level tests as needed.
- Run **test:types** in CI to catch type errors in the module and playground.

## Linting and formatting

- **ESLint:** Use the Laioutr ESLint config for Nuxt modules (e.g. `@laioutr/eslint-config/nuxt-module`). Run `pnpm lint` (or `npm run lint`) before committing and in CI.
- **Prettier:** Use a consistent formatter (e.g. `@laioutr/prettier-config` or a local `.prettierrc` with `tabWidth: 2`, `useTabs: false`, `printWidth: 80` or `120`). Format on save or in pre-commit.
- **Empty interfaces:** If the linter forbids empty object types, use the approved escape (e.g. eslint-disable for that line) and a short comment, or add a single optional property; keep the type for schema augmentation.

## Secrets and environment

- **Never commit** API keys, client secrets, or tokens. Use environment variables or a secret manager (e.g. Infisical) and pass them into **private** runtime config only.
- **Public runtime config** is exposed to the client. Put only non-sensitive options (e.g. sample rate, feature flags, public URLs) in `RuntimeConfigModulePublic`.
- Document required env vars and config in your app’s README or in the [App docs](/apps) so integrators know what to set.