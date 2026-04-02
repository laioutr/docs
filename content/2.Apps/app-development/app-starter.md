---
title: App Starter
description: Introduction to the Laioutr App Starter — the template and starting point for new developers building Laioutr apps.
---

## Overview

The **App Starter** is the official template for creating a new [Laioutr app](https://github.com/laioutr/app-starter). It gives you a minimal Nuxt module structure, Laioutr registration, two playgrounds for development, and the conventions you need so your app works with Laioutr’s Frontend Core, Orchestr, and Studio.

Use the App Starter when you want to:

- Build a **custom app** that connects your frontend to a backend (e.g. commerce, CMS, analytics).
- Add **orchestr** integrations (queries, actions, links, resolvers) so the frontend can request data and run actions through a unified API.
- Provide **sections and blocks** that editors can place and configure in Laioutr Studio.
- Publish your app as a **Nuxt module** (e.g. to npm or Laioutr’s private registry) so any Laioutr project can install and configure it.

If you are new to Laioutr, read [What is Laioutr?](/getting-started/what-is-laioutr) and [Apps in Laioutr](/apps) first. Then follow [Setup Local Development Environment](/getting-started/next-steps/local-setup) to clone the starter and run it locally.

## What is a Laioutr app?

A Laioutr app is a **Nuxt module** that:

1. Uses **`registerLaioutrApp`** from `@laioutr-core/kit` to register with Laioutr (orchestr dirs, sections, blocks, page wrappers, etc.).
2. Uses its **package name** as the **config key** (e.g. `my-laioutr-app` or `@laioutr-app/shopify`) so configuration from `laioutrrc.json` is passed into the module by name.
3. Optionally provides **orchestr** handlers (queries, actions, links, component resolvers, query templates) so the frontend can fetch and mutate data through a single backend-for-frontend layer.
4. Optionally provides **sections** and **blocks** (Vue components + definitions) that appear in Laioutr Studio and can be placed on pages.

The App Starter is a minimal implementation of this: it registers orchestr dirs and section/block paths, installs the right peer modules on prepare, and leaves orchestr handlers and section/block implementations for you to add.

## Getting the App Starter

Clone or download the template from GitHub:

```bash
npx giget@latest gh:laioutr/app-starter
cd app-starter
```

Or clone the repo directly:

```bash
git clone https://github.com/laioutr/app-starter.git
cd app-starter
```

You don’t have to use this template, but it gives you the expected layout, scripts, and Laioutr registration so you can focus on your app logic.

## Project structure

After opening the App Starter, you’ll see a structure like this:

| Path | Purpose |
|------|---------|
| **`src/module.ts`** | Nuxt module entry. Defines `configKey` (must match `package.json` name), `registerLaioutrApp` (orchestr dirs, sections, blocks), runtime config, and optional `installModule` for peer deps (see [Platform Dependencies](/apps/app-development/platform-dependencies)). |
| **`src/globalExtensions.ts`** | TypeScript module augmentation for Nuxt runtime config and Vue so your app’s config key is typed. |
| **`src/runtime/server/orchestr/`** | Orchestr handlers live here: e.g. `product/by-slug.query.ts`, `cart/add-item.action.ts`, `menu/base.resolver.ts`. The starter only adds a `plugins/` (e.g. Zod fix) and leaves entity folders for you. |
| **`src/runtime/app/sections/`** | Vue components and definitions for **sections** (Studio). Starter ships an empty folder with a `.gitkeep`. |
| **`src/runtime/app/blocks/`** | Vue components and definitions for **blocks** (Studio). Starter ships an empty folder with a `.gitkeep`. |
| **`playground/`** | A Nuxt app that uses your module and a **laioutrrc.json** (or mock) to develop the full UI with Frontend Core. Run with `pnpm dev`. |
| **`orchestr-playground/`** | A Nuxt app focused on **orchestr**: it includes Orchestr and Orchestr DevTools so you can test queries and actions (e.g. via the Orchestr Request Editor). Run with `pnpm orchestr-dev`. |
| **`test/`** | Basic module tests (e.g. Vitest). |

Important details:

- **`configKey`** in `module.ts` must equal the **package name** in `package.json` (e.g. `my-laioutr-app`). Laioutr passes app config from `laioutrrc.json` by this key. See [App Configuration](/apps/app-development/app-configuration).
- **Orchestr** handlers are discovered from the paths you pass to `registerLaioutrApp({ orchestrDirs: [...] })`. Adding or changing files under those dirs is how you add queries, actions, links, and resolvers.
- **Sections and blocks** are discovered from the paths you pass to `registerLaioutrApp({ sections: [...], blocks: [...] })`. Each section/block needs a `definition` export so Studio can list and configure it.

## Prerequisites

Before you start:

- **Node.js** (>= 22.12) and **pnpm** (>= 10.15).
- A **Laioutr project** in [Cockpit](https://cockpit.laioutr.cloud) (for fetching `laioutrrc.json` and testing with Studio).
- **NPM token** for Laioutr’s registry (for installing dependencies). Create a copy of `.npmrc.config` as `.npmrc` and set `NPM_LAIOUTR_TOKEN`; you can find the token in [project settings](https://cockpit.laioutr.cloud/o/_/p/_/settings).

Optional but recommended: install the [Laioutr CLI](/getting-started/next-steps/cli) to fetch and update `laioutrrc.json`:

```bash
pnpm add -g @laioutr/cli@latest
```

## Quick setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Fetch project configuration** (so the playground uses your project’s apps and config)

   ```bash
   laioutr rc fetch -p <organization-slug>/<project-slug> -s <project-secret>
   ```

   If you don’t use the CLI, create or copy a `laioutrrc.json` at the project root. The **playground** can import it (see `playground/nuxt.config.ts`); the **orchestr-playground** typically doesn’t need a full laioutrrc for testing orchestr only.

3. **Prepare and run**

   ```bash
   pnpm dev:prepare
   pnpm dev          # UI playground (Frontend Core + laioutrrc)
   pnpm orchestr-dev # Orchestr playground (queries/actions + DevTools)
   ```

After that you can:

- Open the UI playground and, if applicable, connect Studio to localhost (e.g. “Developer: Use Localhost” in the Studio command palette) to test with real project data.
- Open the orchestr-playground and use the Orchestr Request Editor (Queries / Actions) to call your orchestr handlers.

Detailed steps and troubleshooting are in [Setup Local Development Environment](/getting-started/next-steps/local-setup).

## What to customize

- **Package identity**  
  In `package.json`, set `name`, `description`, and `repository`. Use **Find & Replace** (e.g. “My Laioutr App” → your app name, `my-laioutr-app` → your package name). Ensure `module.ts` uses the same name for `configKey` (via `name` from `package.json`).

- **Module options and runtime config**  
  In `module.ts`, extend `ModuleOptions` and `RuntimeConfigModulePublic` / `RuntimeConfigModulePrivate` in `globalExtensions.ts`. Merge options into `nuxt.options.runtimeConfig[name]` and `nuxt.options.runtimeConfig.public[name]` so components and server code can read config. See [App Configuration](/apps/app-development/app-configuration).

- **Orchestr**  
  Add files under `src/runtime/server/orchestr/`, e.g. `product/by-slug.query.ts`, `cart/add-item.action.ts`, `menu/base.resolver.ts`. Use the same patterns as in existing apps (e.g. define a middleware like `defineMyApp` that provides a client and context, then use `defineMyAppQuery`, `defineMyAppAction`, etc.). Canonical types live in `@laioutr-core/canonical-types`. The starter’s `orchestr/plugins/zodFix.ts` applies a Zod compatibility fix; keep it unless you don’t use Zod in orchestr.

- **Sections and blocks**  
  Add Vue components and definitions under `src/runtime/app/sections/` and `src/runtime/app/blocks/`. Each must export a `definition` so Frontend Core and Studio can register them. See the local-setup guide section “Adding ui sections and blocks”.

- **Page wrappers**  
  If your app should wrap every page (e.g. analytics or speed insights), register a component in `registerLaioutrApp({ pageWrapper: ['YourWrapperComponent'] })` and add that component under `runtime/app/components/`.

## Key concepts to know

- **laioutrrc.json**  
  The project configuration file (apps, versions, per-app config). It is generated from Studio or fetched via CLI. Your app’s config is under `apps[].config` for the entry whose `name` matches your package name.

- **Orchestr**  
  The data-composition layer: queries (read), actions (write), links (resolve relations), component resolvers (map backend entities to canonical UI entities), and query template providers (e.g. for static/menu generation). Your app contributes handlers that the frontend calls through a single API.

- **Sections and blocks**  
  Reusable, Studio-configurable UI pieces. Sections are larger layout blocks; blocks are smaller content or feature units. Both are Vue components plus a definition object.

- **Config key**  
  The module’s `configKey` must be the package name so Laioutr can pass the right slice of `laioutrrc.json` into your module’s `setup(options, nuxt)`.

For deeper dives, see [Architecture](/getting-started/key-concepts/architecture), [Extensibility](/getting-started/key-concepts/extensibility), and the [Orchestr](/frontend/orchestr) docs.

## Example apps and references

- **App Starter** — [github.com/laioutr/app-starter](https://github.com/laioutr/app-starter)
- **Customer Demo** — [github.com/laioutr/app-customer-demo](https://github.com/laioutr/app-customer-demo) (example frontend using apps)
- **App docs** — For specific backends (Shopify, Commercetools, Emporix, Klaviyo, etc.), see the [App docs](/apps) section.

## Related documentation

- [App Configuration](/apps/app-development/app-configuration) — How `laioutrrc.json` and runtime config work for your app.
- [Setup Local Development Environment](/getting-started/next-steps/local-setup) — Step-by-step clone, install, fetch rc, and run playgrounds.
- [CLI](/getting-started/next-steps/cli) — Fetch and update `laioutrrc.json`.
- [Coding Standards](/apps/app-development/coding-standards) — Conventions and quality guidelines for app code.
