---
title: Multi-language Support
description: Laioutr’s multi-language support lets you run storefronts in multiple languages and regions, with language switchers, localized paths, and BCP 47–based configuration managed in Cockpit.
---

## Part 1 — For business and content users

### Overview

Multi-language support in Laioutr lets you offer your storefront in several **languages** and **regions**. Customers see content and URLs in their chosen language, and you manage languages and their assignment to **markets** (e.g. Switzerland, Germany) in **Cockpit**.

### What you can do

- **Define languages** in Cockpit (e.g. German, French, English) using standard **BCP 47** codes (e.g. `de-CH`, `fr-FR`, `en-US`).
- **Assign languages to markets**: each market has one or more **domains** (host + optional path), and each domain is tied to one language. So e.g. `www.shop.ch` can show German and `www.shop.ch/fr` French.
- **Localized content**: page paths and other content can be defined per language (e.g. `/produkte` for German, `/produits` for French). The frontend resolves the right path from the current language and fallbacks.
- **Language switcher**: your frontend can expose a language/locale switcher so users change language (and possibly market) with persisted preference where supported.

### Benefits

- One project can serve multiple languages and regions from a single codebase.
- Content and URLs are consistent per language; fallback chains (e.g. `de-CH` → `de`) allow reuse of translations.
- Configuration is centralized in Cockpit (Translations and Markets), so non-developers can add languages and domains without code changes.

---

## Part 2 — For developers

### How it fits in the stack

Multi-language behaviour is driven by **RC (project configuration)** from `laioutrrc`:

- **Languages** (`RcLanguage`): `id`, BCP 47 `code`, `name`, `fallbacks` (ordered list of language codes for content resolution).
- **Markets** (`RcMarket`) and **domains** (`RcMarketDomain`): each domain has `host`, optional `path`, and `languageId` linking to a language. Markets also have `currency` and `regionCodes`; see [Multi-market](./multi-market.md).

The frontend does **not** store this raw RC on the client. Instead, **Frontend Core** builds a derived **Render** config and routes at build/runtime and exposes it via virtual modules and composables.

### Key types (core-types)

- **`RcLanguage`**: `id`, `code` (BCP 47), `name`, `fallbacks`.
- **`RenderLanguage`**: built from `RcLanguage` by `buildI18nConfig()`; adds `languageCode`, `regionCode`, `direction` (ltr/rtl), `endonym`, `measurementSystem` (metric/imperial), and `marketDomains` (back-reference to domains serving this language).
- **`LocalizedValue<T>`**: object keyed by language code (e.g. `{ "de": "/produkte", "fr": "/produits" }`). Used for page paths and other localized fields.

### Build-time and runtime flow

1. **`buildI18nConfig(languages, markets)`** (frontend-core)  
   Takes RC `languages` and `markets` and produces **`RenderI18nConfig`**:  
   - `languages` / `markets` (Render arrays),  
   - `languageById`, `languageByCode`, `marketById`, `marketBySlug`, `hostToMarket`,  
   - `defaultMarket`,  
   - `allLocales` (BCP 47 codes used by at least one domain, for nuxt-i18n).

2. **`validateI18nConfig(languages, markets)`**  
   Validates BCP 47 codes, domain→language references, and host+path uniqueness; returns a list of issues (dangling refs, duplicate host+path, missing default domain).

3. **`resolvePagePath(paths, language)`**  
   Resolves a **localized path** to a single path string for a given `RenderLanguage`: uses the chain `[language.code, ...language.fallbacks, '*']` and returns the first matching key in `paths`, so e.g. `de-CH` can fall back to `de` or a catch-all.

4. **`unlocalize(value, chain)`**  
   Generic resolver for `LocalizedValue<T>`: given a chain of locale codes, returns the first existing value. Used by `resolvePagePath` and for other localized content.

5. **Market/locale resolution**  
   At request time, **`resolveMarketFromRequest(config, host, path)`** finds the **market** and **domain** (and thus the **language**) from host and path. The **market detection plugin** uses this (or equivalent logic) and stores the current market/language in Nuxt `useState` so composables and the i18n layer see the active locale.

6. **Routes**  
   **`buildRoutes(pages, config)`** generates Vue Router route entries with one path per (page × market × domain) and alias generation; it respects **`marketIds`** on `RcPage` so a page can be limited to specific markets. Paths are built via `resolvePagePath(page.path, domain.language)` and prefixed with the domain path when the domain is not the market default.

### Utilities

- **`getExonym(language, inLocale)`**: returns the language name in another locale (e.g. “German” in English).
- **`fillParams(path, params)`**: replaces `:param` segments in a path string (for building localized URLs with dynamic segments).
- **`toDevHost(host)`**: maps a production host to the dev host pattern (e.g. `www.shop.ch` → `shop-ch.local.laioutr.tech`) for local development.

### Integration with nuxt-i18n

- **Locales** come from `RenderI18nConfig.allLocales` (BCP 47 codes).
- The **current locale** is set from the resolved **domain language** so that nuxt-i18n and any language switcher use the same locale. The market detection plugin runs after the i18n plugin and sets or aligns the active locale.

### Implementing a language switcher

- Use the current **market** and **language** from `useState` / composables (e.g. `laioutr:market`, `laioutr:language` or app-specific composables that wrap them).
- For each target language (or market+language), build the target URL: use the **domain** that serves that language (and market, if you switch market), and the **localized path** for the current page via `resolvePagePath(meta.localizedPaths, targetLanguage)` plus `fillParams` for dynamic params.
- Optional: show language names with **`getExonym(language, currentLocale)`** for labels in the current UI language.

### Validation before deploy

Run **`validateI18nConfig`** (or the CLI/build step that uses it) and fix any reported issues: invalid BCP 47, missing language references, duplicate host+path, or missing default domain. This avoids runtime fallbacks and misrouted requests.
