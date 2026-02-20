---
title: Multi-market
description: Laioutr’s multi-market support lets you serve different regions (markets) from one project, each with its own domains, languages, and currency, configured in Cockpit.
---

## Part 1 — For business and content users

### Overview

A **market** in Laioutr is a regional slice of your storefront: a named region (e.g. Switzerland, Germany, France) with its own **domains** (URLs), **languages**, and **currency**. Multi-market lets you run one project that serves several such regions from a single codebase and configuration.

### What you can do

- **Create and manage markets** in Cockpit (Markets area): name, slug, currency (e.g. CHF, EUR), region codes, and optional flag for Studio.
- **Assign domains to each market**: each domain has a **host** (e.g. `www.shop.ch`), an optional **path** prefix (e.g. `/fr` for French), and one **language**. So one market can serve multiple languages via different domains or path prefixes.
- **Set a default domain** per market so the main URL (e.g. `www.shop.ch` without path) uses that language.
- **Limit pages to specific markets** (optional): in Studio you can restrict a page so it only appears in selected markets; other markets will not show that route.

### Benefits

- One Cockpit project can power multiple storefront regions (countries/currencies) without separate deployments.
- Each market has a clear currency and region; pricing and locale behaviour (e.g. measurement system) can follow the market.
- Domains and languages are configured in Cockpit, so you can add or change markets and domains without code changes.

### How it relates to languages and currency

- **Languages** are defined once in Cockpit (Translations) and then **assigned to markets** via domains: each domain belongs to one market and one language. See [Multi-language support](./multi-language-support.md).
- **Currency** is set per market (e.g. CHF for Switzerland, EUR for Germany). The frontend can use the current market’s currency for formatting and display. See [Currencies](./currencies.md).

---

## Part 2 — For developers

### How it fits in the stack

Markets and their domains come from **RC**: `laioutrrc.markets` is a dictionary of **`RcMarket`**. Each market has:

- **`id`**, **`slug`**, **`name`**
- **`currency`** (ISO 4217, e.g. `CHF`)
- **`regionCodes`** (e.g. `["CH"]`)
- **`defaultDomainId`**: which domain is the default for this market (e.g. root URL)
- **`domains`**: dictionary of **`RcMarketDomain`** — each has `id`, `host`, optional `path`, and `languageId` (reference to `RcLanguage`)

The frontend never uses this RC directly for routing; it uses a **derived Render config** built by **`buildI18nConfig()`**.

### Key types (core-types)

- **`RcMarket`**: as above; **`RcMarketDomain`**: `id`, `host`, `path?`, `languageId`.
- **`RenderMarket`**: built from `RcMarket`; has `id`, `slug`, `name`, `currency`, `regionCodes`, `domains` (array of **`RenderMarketDomain`**), and **`defaultDomain`** (reference).
- **`RenderMarketDomain`**: adds to RC domain: **`devHost`** (from `toDevHost(host)`), resolved **`language`** (RenderLanguage), **`isDefault`**.
- **`RenderI18nConfig`**: output of `buildI18nConfig()`; contains `markets`, `marketById`, `marketBySlug`, **`hostToMarket`** (hostname → RenderMarket, including dev hosts), and **`defaultMarket`** (fallback for localhost/unknown host).

### Build-time and runtime flow

1. **`buildI18nConfig(languages, markets)`**  
   - Builds **RenderLanguage** for each `RcLanguage` (with BCP 47–derived fields and empty `marketDomains`).  
   - Builds **RenderMarket** for each `RcMarket` and **RenderMarketDomain** for each domain; resolves `languageId` to **RenderLanguage** and sets **`devHost`** via **`toDevHost(host)`**.  
   - Fills **`language.marketDomains`** so each language knows which domains serve it.  
   - Builds **`hostToMarket`** (production + dev hosts).  
   - Sets **`defaultMarket`** to the first market (or a fallback market if none configured).  
   - Sets **`allLocales`** to BCP 47 codes referenced by at least one domain.

2. **`resolveMarketFromRequest(config, host, path)`**  
   - Strips port from `host`.  
   - Looks up **market** in `config.hostToMarket[host]`; if missing and host is localhost/127.0.0.1 (or still missing), uses **`config.defaultMarket`**.  
   - Within that market, finds the **domain** by matching **path** to `domain.path` (exact or prefix with `/`). If none matches, uses the market’s **defaultDomain**.  
   - Returns **`{ market, language, domain }`** (language = `domain.language`).

3. **Market detection plugin**  
   - Runs early (after i18n). Gets `host` (from request header on server, `window.location.host` on client) and current **path**.  
   - Calls **`resolveMarketFromRequest(config, host, path)`** and stores the result in Nuxt **`useState`** (e.g. `laioutr:market`, `laioutr:language`, `laioutr:domain`) so composables and the app see the current market and language.

4. **Routes: `buildRoutes(pages, config)`**  
   - For each page, determines **applicable markets** from **`page.marketIds`**: if `marketIds` is set, only those markets; otherwise all markets.  
   - For each (page, market, domain) with a resolved **page path** (via **`resolvePagePath(page.path, domain.language)`**), builds a full path (domain path prefix + page path).  
   - Ensures param sets are consistent across aliases; drops aliases with mismatched params and warns.  
   - Detects **path collisions** between pages and warns.  
   - Produces one **primary path** (default market’s default domain) and **aliases** for other (market, domain) combinations.  
   - Enforces an alias cap (e.g. 50k) to avoid build/runtime issues.

### Validation

- **`validateI18nConfig(languages, markets)`** checks: valid BCP 47 on languages; at least one market; every `defaultDomainId` exists in that market’s domains; every domain `languageId` exists in `languages`; no duplicate (host, path) across all domains. Use this (or the build step that runs it) before deploy.

### Dev hosts

- **`toDevHost(host)`**: maps production host to a stable dev host (e.g. `www.shop.ch` → `shop-ch.local.laioutr.tech`) so local development can simulate multiple domains via `/etc/hosts` or similar. Both production and dev hosts are registered in **`hostToMarket`**.

### Page-level market scope

- **`RcPage.marketIds`** (optional): if set, the page is only included in routes for those market IDs. **`buildRoutes`** uses **`applicableMarkets(page, config)`** so pages can be market-specific (e.g. a “CH only” landing page).

### Using the current market in code

- Read market/language from **`useState`** (or from composables that wrap it).  
- **Currency**: use **`currentMarket.currency`** for formatting (e.g. `$money`) or passing to APIs.  
- **Region / measurement**: use **`currentLanguage.measurementSystem`** (metric/imperial) or **`currentMarket.regionCodes`** if you need region-specific behaviour.
