---
title: Currencies
description: Laioutr uses one currency per market. Customers see prices and currency switchers in the context of the current market; developers use the market’s currency for formatting and APIs.
---

## Part 1 — For business and content users

### Overview

In Laioutr, **currency is defined per market**. Each market (e.g. Switzerland, Germany) has a single **ISO 4217** currency (e.g. CHF, EUR). There is no separate “multi-currency” layer: when a customer is in a given market, they see that market’s currency. To support multiple currencies you configure **multiple markets** and optionally let users switch between them (e.g. via domain or a market/locale switcher).

### What you can do

- **Set the currency for each market** in Cockpit (Markets): when you create or edit a market, you choose its currency. All domains under that market use that currency for display and, where applicable, for commerce.
- **Offer multiple currencies** by defining multiple markets (e.g. Switzerland → CHF, Germany → EUR) and assigning each market its own domains or path prefixes. Users reach a given currency by visiting the corresponding market (URL or switcher).
- **Use a currency switcher** in the frontend to let customers change market (and thus currency); the switcher typically navigates to the same page in the target market’s domain or path.

### Benefits

- One clear rule: one market, one currency. No ambiguity about which currency applies to a given view.
- Currency is managed in Cockpit together with markets and domains, so no code change is needed to add or change a market’s currency.
- Works with multi-market and multi-language: same project can serve CHF, EUR, USD, etc. via different markets and languages.

### Relation to markets and language

- **Markets** define the region and its currency; **domains** (and paths) determine which URL leads to which market and language. See [Multi-market](./multi-market.md).
- **Language** is per domain within a market; currency is per market. So you can have “Switzerland (CHF)” with German and French, or “Germany (EUR)” with German. See [Multi-language support](./multi-language-support.md).

---

## Part 2 — For developers

### Where currency comes from

- **RC**: **`RcMarket.currency`** is an ISO 4217 string (e.g. `"CHF"`, `"EUR"`). It is set in Cockpit and stored in `laioutrrc.markets`.
- **Render**: **`RenderMarket.currency`** is the same value, exposed after **`buildI18nConfig(languages, markets)`**. The **current market** is resolved at request time via **`resolveMarketFromRequest(config, host, path)`** and stored in Nuxt state (e.g. `useState('laioutr:market', ...)`). Your app should use the **current market’s** `currency` for formatting and for any backend calls that require a currency.

### Formatting money

- **UI Kit** provides a **`$money`** formatter that formats a **Money** value (amount in minor units + currency code) in the current locale with the correct currency symbol and decimals. It uses the currency from the **Money** object itself; for “current market” pricing you pass amounts with the **current market’s currency** (from the resolved **RenderMarket**).
- **Locale** for number formatting comes from the active i18n locale (aligned with the resolved language/market). So `$money({ amount, currency })` with `currency === currentMarket.currency` gives market-consistent display.

### Using the current market’s currency in code

- Resolve the current market from Nuxt state or a composable that wraps **`useState('laioutr:market')`** (or equivalent). The object is a **RenderMarket** (or an id/slug that you resolve via **`config.marketById`** / **`config.marketBySlug`**).
- Use **`currentMarket.currency`** when:
  - Building **Money** objects for the current context (e.g. cart totals, product prices when you only have one currency per market).
  - Calling commerce or pricing APIs that expect a currency.
  - Showing a “prices in CHF/EUR” label or currency switcher that switches market (and thus currency).

### Currency switcher implementation

- A currency switcher is effectively a **market switcher**: when the user picks another currency, navigate to the same logical page in the **target market** (e.g. another domain or path). Use **`resolveMarketFromRequest`** / domain config to build the target URL and, if needed, **`resolvePagePath(meta.localizedPaths, targetLanguage)`** and **`fillParams`** for the path. See [Multi-market](./multi-market.md) and [Multi-language support](./multi-language-support.md).

### No separate “multi-currency” runtime

- Laioutr does not support “multiple currencies in one market” (e.g. “show price in CHF and EUR on the same page”) out of the box. The model is one currency per market; to show another currency you switch market (and optionally language) and use that market’s currency for formatting.
