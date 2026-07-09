---
title: Platform Dependencies
description: Nuxt modules and their versions that the Laioutr platform installs. Check this list before adding dependencies to your custom app.
seo:
  title: Platform Dependencies
  description: Nuxt modules and their versions that the Laioutr platform installs. Check this list before adding dependencies to your…
sitemap:
  loc: /apps/app-development/platform-dependencies
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

When you build a custom app, the Laioutr platform already installs several Nuxt modules into the project. If your app needs one of these modules, you can use it directly without adding it as a dependency. If your app depends on a specific version range, check the table below to confirm compatibility.

The platform runs on **Nuxt 3.16.2**.

::caution
Nuxt can only load one version of any given module. If your app calls `installModule('@nuxt/image')` while frontend-core already registered `@nuxt/image@1.x`, Nuxt silently skips the second registration. But if your app's `node_modules` resolves a different major version (e.g. `@nuxt/image@2.x`), the version that loads first wins and every other app in the project gets that version instead of the one it expects. The `@nuxt/image` 2.x API is not backwards-compatible with 1.x, so other Laioutr apps will break at runtime.

Do not install your own version of any module listed below. If you need a feature from a newer release, coordinate with the platform team first.
::

## Installed by Frontend Core

These modules are installed by `@laioutr-core/frontend-core`, which is present in every Laioutr project:

| Module | Version |
|---|---|
| `@nuxt/image` | 1.9.0 |
| `@nuxtjs/i18n` | 9.5.2 |
| `@nuxtjs/robots` | ^5.4.0 |
| `@vueuse/nuxt` | 13.1.0 |
| `@pinia/nuxt` | 0.11.0 |
| `@pinia/colada-nuxt` | 0.2.1 |

## Installed by the UI packages

Projects that use the Laioutr UI kit (most projects) get these additional modules through `@laioutr-core/ui-kit` and `@laioutr-core/ui`:

| Module | Version |
|---|---|
| `@nuxt/fonts` | 0.10.3 |
| `@nuxt/icon` | 1.13.0 |
| `@nuxtjs/color-mode` | 3.5.2 |
| `@unocss/nuxt` | 66.2.3 |
| `nuxt-swiper` | 1.2.2 (pinned to 1.x intentionally) |

## Other runtime libraries

The Nuxt modules above pull in these libraries, so they are available at runtime in every Laioutr project:

| Package | Version |
|---|---|
| `pinia` | 3.0.2 |
| `@pinia/colada` | 0.17.1 |
| `@vueuse/core` | 13.1.0 |
| `zod` | 3.25.61 |

If your app imports one of these directly, you still need to declare it in your own `package.json` so TypeScript can resolve the types. Add it as a `dependency` (like the App Starter does with `zod`) or as a `devDependency` if you only use it in the playground.

## Structuring your `package.json`

The [App Starter](https://github.com/laioutr/app-starter) shows the recommended pattern for declaring dependencies:

**`peerDependencies`** for core platform packages your app runs against. These are resolved from the project that installs your app:

```json
{
  "peerDependencies": {
    "@laioutr-core/canonical-types": ">=0.22.13",
    "@laioutr-core/core-types": ">=0.28.8",
    "@laioutr-core/frontend-core": ">=0.28.8"
  }
}
```

**`dependencies`** for packages your app bundles itself (build tools, schema libraries):

```json
{
  "dependencies": {
    "@nuxt/kit": "3.16.2",
    "zod": "3.25.61"
  }
}
```

**`devDependencies`** for Nuxt modules and libraries that your playground needs but the platform already provides in real projects. Without these, pnpm may not hoist the packages correctly for local development:

```json
{
  "devDependencies": {
    "nuxt": "3.16.2",
    "@pinia/colada": "0.17.1",
    "@pinia/colada-nuxt": "0.2.1",
    "@vueuse/core": "13.1.0",
    "pinia": "3.0.2"
  }
}
```

::tip
The devDependencies above mirror the platform versions so your playground behaves the same as a real project. Keep these versions in sync when the platform updates.
::
