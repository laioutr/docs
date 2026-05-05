---
title: Currencies
description: Laioutr uses one currency per market. Developers access it via useCurrency() and format prices with the $money formatter.
links: []
seo:
  title: Currencies | Laioutr
  description: Laioutr uses one currency per market. Developers access it via useCurrency() and format prices with the $money…
sitemap:
  loc: /frontend/features/currencies
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Part 1 — For business and content users

In Laioutr, **currency is defined per market**. Each [market](/frontend/features/multi-market) (e.g. Switzerland, Germany) has a single **ISO 4217** currency (e.g. CHF, EUR). When a customer is in a market, they see that market's currency.

To offer multiple currencies, configure **multiple markets** in [Cockpit → Markets](https://cockpit.laioutr.cloud/o/_/p/_/settings/markets) and let customers switch between them via a market/currency switcher.

Laioutr does not support multiple currencies within a single market.

---

## Part 2 — For developers

### Accessing the current currency

```ts
const currency = useCurrency() // ComputedRef<string>, e.g. "CHF"
```

This is a shorthand for `useMarket().value.currency`. Use it when building Money objects, calling pricing APIs, or showing currency labels. See [composables](/frontend/features/multi-market#composables) for the full list.

### Formatting money

The UI Kit provides a global `$money` formatter:

```vue
<template>
  <!-- Renders e.g. "CHF 149.00" or "149,00 €" depending on locale -->
  <span>{{ $money(product.price) }}</span>
</template>
```

`$money` accepts a [`Money`](/frontend/api-reference/common-types/money) object (`{ amount: number, currency: string }`) and optional `Intl.NumberFormatOptions`. The `amount` is in the **smallest currency unit** (e.g. cents), so `10012` with currency `USD` renders as `$100.12`. The locale for number formatting comes from the active language, so the same CHF amount renders differently in a German vs French locale.

See the [Money reference page](/frontend/api-reference/common-types/money) for the full type, the `$money` signature and options, the related [`UnitPrice`](/frontend/api-reference/common-types/money#unitprice) type, and the connector authoring rules (including zero-decimal currencies like JPY).

### The Money type

Laioutr uses `@screeny05/ts-money` for money arithmetic. The `Money` interface from `@laioutr-core/core-types/common` matches ts-money's `CommonMoney`:

```ts
import { Money } from '@laioutr-core/core-types/common'

const price: Money = { amount: 14900, currency: 'CHF' } // CHF 149.00
```

Connector apps (Shopify, Shopware, Adobe Commerce) convert platform-specific price formats to this type using `Money.fromDecimal()`:

```ts
import { Money } from '@screeny05/ts-money'

// In a component resolver: convert a decimal price to Money
const price = Money.fromDecimal(149.0, 'CHF')
// => { amount: 14900, currency: 'CHF' }
```

Use `Money.fromDecimal()` when your data source provides prices as decimal numbers. Use the `Money` interface directly when amounts are already in minor units.

::tip
The UI Kit also provides `$measurement`, `$timespan`, and `$duration` formatters, all locale-aware. See [Multi-language support](/frontend/features/multi-language-support#locale-aware-formatting).
::

### Currency switcher

A currency switcher is a **market switcher**. Switching currency means navigating to the same page in a different market:

```ts
// Switch to Germany market (EUR). Full page load because host may differ.
navigateTo(linkResolver.switchMarketUrl('mkt_germany'), { external: true })
```

See [language switcher](/frontend/features/multi-language-support#language-switcher) for more on `linkResolver.switchMarketUrl()`.
