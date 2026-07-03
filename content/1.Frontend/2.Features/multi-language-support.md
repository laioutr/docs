---
title: Multi-language Support
description: Laioutr's multi-language support lets you run storefronts in multiple languages and regions, with language switchers, localized paths, and BCP 47–based configuration managed in Cockpit.
seo:
  title: Multi-language Support | Laioutr
  description: Laioutr's multi-language support lets you run storefronts in multiple languages and regions, with language switchers,…
sitemap:
  loc: /frontend/features/multi-language-support
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Part 1 — For business and content users

You define **languages** in [Cockpit → Translations](https://cockpit.laioutr.cloud/o/_/p/_/settings/translations) using **BCP 47** codes (e.g. `de-CH`, `fr-FR`, `en-US`), then assign them to [markets](./multi-market.md) via domains. Each domain serves one language, so `www.shop.ch` can show German while `www.shop.ch/fr` shows French.

Page paths and content can be **localized** per language (e.g. `/produkte` for German, `/produits` for French). Languages support **fallback chains**: `de-CH` (Swiss German) can fall back to `de` (German), so you only need to translate what actually differs.

Configuration is centralized in Cockpit ([Translations](https://cockpit.laioutr.cloud/o/_/p/_/settings/translations) and [Markets](https://cockpit.laioutr.cloud/o/_/p/_/settings/markets)). No code changes needed to add languages or domains.

---

## Part 2 — For developers

### Key types

- **`RcLanguage`**: `id`, `code` (BCP 47), `name`, `fallbacks` (ordered list of language codes for content resolution).
- **`RenderLanguage`**: derived from `RcLanguage` by `buildI18nConfig()`; adds `languageCode`, `regionCode`, `direction` (ltr/rtl), `endonym`, `measurementSystem` (metric/imperial), `localeChain` (`[code, ...fallbacks]`), and `marketDomains`.
- **`LocalizedValue<T>`**: object keyed by language code (e.g. `{ "de": "/produkte", "fr": "/produits" }`).

### Content resolution

`unlocalize(value, language.localeChain)` resolves a `LocalizedValue<T>` to a single value for a given `RenderLanguage`. It walks the chain and returns the first match, or `undefined` if no locale in the chain has a value. For example, with `de-CH` configured with fallbacks `['de-DE', 'de']`, it tries `de-CH` → `de-DE` → `de` → `undefined`.

```ts
import { unlocalize } from '#imports'

const path = unlocalize(page.paths, language.value.localeChain)
// de-CH → de-DE → de → undefined
```

### Integration with nuxt-i18n

nuxt-i18n is configured with `strategy: 'no_prefix'`. It does **not** own routing. Frontend Core generates routes with aliases from market config and resolves the active locale from domain + path. nuxt-i18n is told which locale is active via `setLocale()`.

**nuxt-i18n handles:**
- `$t()` / `useI18n()` for UI string translations
- `$n()` / `$d()` for number and date formatting
- Locale message lazy loading

**Frontend Core handles:**
- Route generation (aliases from market config)
- Domain → market → language resolution
- Link resolution (`linkResolver`)
- SEO head — canonical, hreflang alternates, `og:locale`, and `<html lang>` ([emitted automatically](#seo-hreflang-and-canonical))
- Market/language/domain [composables](/frontend/features/multi-market#composables)

::warning
If you are coming from a standard nuxt-i18n setup: `useLocalePath()` and prefix-based routing do **not** apply. Use `linkResolver.switchLocalePath()` and `linkResolver.switchMarketUrl()` instead.
::

### Locale-aware formatting

The UI Kit registers global formatters that respect the active locale:

| Formatter | Input | Output example |
|-----------|-------|----------------|
| `$money(money)` | [`{ amount, currency }`](/frontend/api-reference/common-types/money) | `CHF 149.00` / `149,00 €` |
| `$timespan(timespan)` | `{ min?, max? }` (Date) | `1. – 15. März 2025` |
| `$measurement(measurement)` | [`{ value, unit }`](/frontend/api-reference/common-types/measurement) | `100 cm` / `10 m²` |
| `$unitPrice(unitPrice)` | [`{ price, quantity, reference }`](/frontend/api-reference/common-types/unit-price) | `13,99 € / 100 ml` |
| `$duration(duration)` | `{ duration }` (ISO 8601) | `1h 30m` |

Available in any template: `{{ $money(price) }}`. See [Currencies](/frontend/features/currencies) for the developer-facing summary, and the [`Money` reference](/frontend/api-reference/common-types/money) for the full `$money` signature and options.

### Language switcher

Frontend Core provides `linkResolver` (auto-imported) for building language and market switchers. You can override the resolution logic with [Link Resolver hooks](/frontend/features/hooks#link-resolver).

**`linkResolver.switchLocalePath()`** switches language **within the same market**:

```vue
<template>
  <nav>
    <NuxtLink
      v-for="domain in market.domains"
      :key="domain.id"
      :to="linkResolver.switchLocalePath(domain.language.id)"
    >
      {{ domain.language.endonym }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const market = useMarket()
</script>
```

Returns `'#'` if the target language is not available in the current market.

**`linkResolver.switchMarketUrl()`** switches to a **different market** (full URL, requires full page load because the host may differ):

```ts
// Navigate to Germany market, default language
navigateTo(linkResolver.switchMarketUrl('mkt_germany'), { external: true })

// Navigate to Germany market, French
navigateTo(linkResolver.switchMarketUrl('mkt_germany', 'lng_fr'), { external: true })
```

Both resolve the correct localized path for the current page, including dynamic params.

### Link resolution

`linkResolver.resolve(link)` converts a [`Link`](/frontend/api-reference/common-types/link) object into a path string for the active language and market. `useResolvedLink(link)` is the reactive wrapper for use outside templates and `computed()`. Both are auto-imported.

See the [Link reference page](/frontend/api-reference/common-types/link#resolving-links) for the full API, reactivity caveats, and how to override resolution with hooks.

### SEO: hreflang and canonical

Frontend Core emits SEO head tags **automatically on every page** — you don't need to call anything. On each render it adds to `<head>`:

- **`<link rel="canonical">`** — the current page's URL on the current domain (`https://{host}{prefix}{path}`)
- **`<link rel="alternate" hreflang="...">`** — one for every domain across all markets where the current page has a localized path. The `hreflang` value is the domain's language code.
- **`<link rel="alternate" hreflang="x-default">`** — points to the first market's default domain as the fallback for search engines
- **`og:locale`** and **`og:locale:alternate`** — the current and alternate locales
- **`<html lang>`** — the current domain's language code

All URLs are built as `https://{domain.host}{domain.path}{localizedPagePath}`, with dynamic route params (e.g. `:slug`) filled from the current route. Domains where the page has no localized path are silently skipped — no broken alternate links are generated.

#### Market-scoped pages

Alternates are automatically restricted to the markets a page belongs to. A page with a `marketIds` constraint only advertises alternates (and `og:locale:alternate`) for those markets — it never points to a market where the page doesn't exist and would 404.

#### Customizing the head

Two filter [hooks](/frontend/features/hooks) let you add, override, or remove head tags while seeing Frontend Core's computed values:

- **`frontend-core:page-head:seo`** — the SEO meta (`title`, `description`, `robots`, and any `og:` / `twitter:` field)
- **`frontend-core:page-head:locale`** — the locale head (canonical, hreflang alternates, `og:locale`, `<html lang>`)

```ts
// e.g. in a Nuxt plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:page-head:seo', ({ result }) => {
    result.value.title = `${result.value.title} — Acme`
    result.value.ogImage = 'https://example.com/og.png'
  })
  nuxtApp.hook('frontend-core:page-head:locale', ({ result }) => {
    // e.g. drop the x-default alternate
    result.value.link = result.value.link.filter((l) => l.hreflang !== 'x-default')
  })
})
```

