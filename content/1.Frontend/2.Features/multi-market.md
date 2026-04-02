---
title: Multi-market
description: Laioutr's multi-market support lets you serve different regions (markets) from one project, each with its own domains, languages, and currency, configured in Cockpit.
---

## Part 1 — For business and content users

A **market** in Laioutr is a regional slice of your storefront: a named region (e.g. Switzerland, Germany) with its own **domains**, **languages**, and **currency**. You configure markets in [Cockpit → Markets](https://cockpit.laioutr.cloud/o/_/p/_/settings/markets).

Each market has one or more **domains**. A domain maps a host and optional path prefix to a language:

| Domain | Language |
|--------|----------|
| `www.shop.ch` | German |
| `www.shop.ch/fr` | French |
| `www.shop.de` | German |

One domain per market is the **default** (the root URL without path prefix). You can also **limit pages to specific markets** in Studio; other markets won't show that route.

The combination of market and language is the **context** a customer browses in. When someone visits `www.shop.ch/fr`, Laioutr resolves the market (Switzerland) and the language (French). Everything downstream ([currency](/frontend/features/currencies), measurement system, content translations, available pages) follows from this context.

**Languages** are defined once in [Cockpit → Translations](https://cockpit.laioutr.cloud/o/_/p/_/settings/translations) and assigned to markets via domains. See [Multi-language support](./multi-language-support.md).

---

## Part 2 — For developers

### Configuration

Markets and their domains come from **RC** (`laioutrrc.markets`). Each `RcMarket` has:

- **`id`**, **`slug`**, **`name`**
- **`currency`** (ISO 4217, e.g. `CHF`)
- **`regionCodes`** (e.g. `["CH"]`)
- **`defaultDomainId`**
- **`domains`**: dictionary of `RcMarketDomain`, each with `id`, `host`, optional `path`, and `languageId`

At build time, Frontend Core transforms this into a **`RenderI18nConfig`** (via `buildI18nConfig()`) with resolved types (`RenderMarket`, `RenderMarketDomain`, `RenderLanguage`) and lookup maps (`marketById`, `marketBySlug`, `hostToMarket`). You access this derived config through composables, never the raw RC.

### Host-to-market constraint

Each host (e.g. `www.shop.ch`) must belong to **exactly one market**. Within that market, path prefixes differentiate languages (e.g. `/` for German, `/fr` for French). You cannot assign the same host to two different markets with different path prefixes — `hostToMarket` maps each host to a single market, so only the last-processed market would be reachable.

If you need two regions on the same domain, use a single market with multiple domains (path-prefixed), or use separate hosts per market.

::callout{type="warning"}
Validation catches duplicate `(host, path)` pairs within one market, but does **not** prevent two markets from sharing a host. If this happens, a warning is logged at build time and one market silently shadows the other.
::

### Composables

```ts
const market = useMarket()          // ComputedRef<RenderMarket>
const language = useLanguage()      // ComputedRef<RenderLanguage>
const domain = useMarketDomain()    // ComputedRef<RenderMarketDomain>
const currency = useCurrency()      // ComputedRef<string>, shorthand for market.currency
const config = useI18nConfig()      // RenderI18nConfig (static, not reactive)
const marketPath = useMarketPath()  // (path: string) => string, prepends domain path prefix
```

These are always defined. Resolution falls back to the default market when the host is unknown.

Use `useI18nConfig()` when you need the full list of markets and languages, for example to build a market picker.

Use `useMarketPath()` when you need to prepend the current domain's path prefix to a URL (e.g. turning `/products` into `/fr/products` on a French-prefixed domain).

**Currency**: use `useCurrency()` when passing the currency code to APIs. For displaying prices, use the [`$money` formatter](/frontend/features/currencies) directly — it reads the currency from the `Money` object, not from `useCurrency()`.

**Region / measurement**: use `useLanguage().value.measurementSystem` (metric/imperial) or `useMarket().value.regionCodes` for region-specific behaviour.

### Page-level market scope

`RcPage.marketIds` (optional): if set, the page only exists in routes for those markets. A "CH only" landing page won't generate routes in the Germany market.

### Validation

`validateI18nConfig(languages, markets)` runs at build time and checks: valid BCP 47 codes, existing `defaultDomainId` and `languageId` references, no duplicate (host, path) pairs. Issues are logged as warnings.

### Dev hosts

`toDevHost(host)` maps production hosts to local development hosts (e.g. `www.shop.ch` → `shop-ch.local.laioutr.tech`). A `*.local.laioutr.tech` wildcard DNS record points to `127.0.0.1`, so you can test multi-domain setups locally. The first market is also aliased to `localhost` as an offline fallback.

### Fallback behaviour

Market and language are **never null** at runtime. Resolution always produces a result:

| Scenario | What happens |
|----------|-------------|
| No market matches the request host | Falls back to the default market (first configured). Warning logged. |
| No path prefix matches within the market | Uses the market's default domain. |
| Page not in current market (`marketIds`) | No route alias exists. Standard 404. |
| Language has no path for a page | No alias generated. `linkResolver.switchLocalePath()` returns `'#'`. |
| Content has no value for the locale chain | `unlocalize()` returns `undefined`. Components handle missing data. |
| Invalid RC config (dangling refs, bad BCP 47) | Build-time warnings from `validateI18nConfig()`. |
