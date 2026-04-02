---
title: Multi-language Support
description: Laioutr's multi-language support lets you run storefronts in multiple languages and regions, with language switchers, localized paths, and BCP 47–based configuration managed in Cockpit.
seo:
  title: Multi-language Support | Laioutr
  description: Laioutr's multi-language support lets you run storefronts in multiple languages and regions, with language switchers,…
---

## Part 1 — For business and content users

You define **languages** in [Cockpit → Translations](https://cockpit.laioutr.cloud/o/_/p/_/settings/translations) using **BCP 47** codes (e.g. `de-CH`, `fr-FR`, `en-US`), then assign them to [markets](./multi-market.md) via domains. Each domain serves one language, so `www.shop.ch` can show German while `www.shop.ch/fr` shows French.

Page paths and content can be **localized** per language (e.g. `/produkte` for German, `/produits` for French). Languages support **fallback chains**: `de-CH` (Swiss German) can fall back to `de` (German), so you only need to translate what actually differs.

Configuration is centralized in Cockpit ([Translations](https://cockpit.laioutr.cloud/o/_/p/_/settings/translations) and [Markets](https://cockpit.laioutr.cloud/o/_/p/_/settings/markets)). No code changes needed to add languages or domains.

---

## Part 2 — For developers

### Key types

- **`RcLanguage`**: `id`, `code` (BCP 47), `name`, `fallbacks` (ordered list of language codes for content resolution).
- **`RenderLanguage`**: derived from `RcLanguage` by `buildI18nConfig()`; adds `languageCode`, `regionCode`, `direction` (ltr/rtl), `endonym`, `measurementSystem` (metric/imperial), `localeChain` (`[code, ...fallbacks, '*']`), and `marketDomains`.
- **`LocalizedValue<T>`**: object keyed by language code (e.g. `{ "de": "/produkte", "fr": "/produits" }`). The `'*'` key is a universal fallback. Existing content stored under `'*'` works without migration.

### Content resolution

`unlocalize(value, language.localeChain)` resolves a `LocalizedValue<T>` to a single value for a given `RenderLanguage`. It walks the language's `localeChain` and returns the first match. For example, `de-CH` tries `de-CH` → `de-DE` → `de` → `*` → first available value.

```ts
import { unlocalize } from '#imports'

const path = unlocalize(page.paths, language.value.localeChain)
// de-CH → de-DE → de → '*' → first available
```

### Integration with nuxt-i18n

nuxt-i18n is configured with `strategy: 'no_prefix'`. It does **not** own routing. Frontend Core generates routes with aliases from market config and resolves the active locale from domain + path. nuxt-i18n is told which locale is active via `setLocale()`.

**nuxt-i18n handles:**
- `$t()` / `useI18n()` for UI string translations
- `$n()` / `$d()` for number and date formatting
- `useLocaleHead()` for `<html lang>`, `dir`, `og:locale`
- Locale message lazy loading

**Frontend Core handles:**
- Route generation (aliases from market config)
- Domain → market → language resolution
- Link resolution (`linkResolver`)
- hreflang alternates (`useMarketHead`)
- Market/language/domain [composables](/frontend/features/multi-market#composables)

::warning
If you are coming from a standard nuxt-i18n setup: `useLocalePath()` and prefix-based routing do **not** apply. Use `linkResolver.switchLocalePath()` and `linkResolver.switchMarketUrl()` instead.
::

### Locale-aware formatting

The UI Kit registers global formatters that respect the active locale:

| Formatter | Input | Output example |
|-----------|-------|----------------|
| `$money(money)` | `{ amount, currency }` | `CHF 149.00` / `149,00 €` |
| `$timespan(timespan)` | `{ min?, max? }` (Date) | `1. – 15. März 2025` |
| `$measurement(measurement)` | `{ value, unit }` | `100 cm` / `10 m²` |
| `$duration(duration)` | `{ duration }` (ISO 8601) | `1h 30m` |

Available in any template: `{{ $money(price) }}`. See [Currencies](/frontend/features/currencies) for `$money` details.

### Language switcher

Frontend Core provides `linkResolver` (auto-imported) for building language and market switchers:

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

`linkResolver.resolve(link)` converts a `Link` object (reference, URL, anchor, page, or page type) into a path string. It is auto-imported and can be used directly in templates:

```vue
<template>
  <NuxtLink :to="linkResolver.resolve(item.link)">
    {{ item.label }}
  </NuxtLink>
</template>
```

::warning
`linkResolver.resolve()` reads the current language and market domain to resolve localized paths. When called bare in `setup()`, the result is a static string that will **not** update when the language changes — the same reactivity caveat that applies to nuxt-i18n's `$t()` outside of templates and `computed()`. Use `useResolvedLink()` when you need a reactive result.
::

**`useResolvedLink(link)`** wraps `linkResolver.resolve()` in a `computed()` so the resolved path re-evaluates automatically when the language or market changes:

```ts
const link = useResolvedLink(props.link) // ComputedRef<string>
```

### SEO: hreflang and canonical

`useMarketHead(pageMarketIds?)` generates `<link>` tags for search engines. It is auto-imported but you must call it yourself, typically in a layout:

```ts
// In your layout or page
useMarketHead()
```

It adds the following to `<head>` via Nuxt's `useHead()`:

- **`<link rel="canonical">`** — the current page's URL on the current domain (`https://{host}{prefix}{path}`)
- **`<link rel="alternate" hreflang="...">`** — one for every domain across all markets where the current page has a localized path. The `hreflang` value is the domain's language code.
- **`<link rel="alternate" hreflang="x-default">`** — points to the first market's default domain as the fallback for search engines

All URLs are built as `https://{domain.host}{domain.path}{localizedPagePath}`, with dynamic route params (e.g. `:slug`) filled from the current route.

Domains where the page has no localized path are silently skipped — no broken alternate links are generated.

#### Market-scoped pages

Pass `pageMarketIds` to restrict alternates to specific markets. Markets not in the list are excluded entirely:

```ts
// Only generate alternates for Switzerland and Germany
useMarketHead(['mkt_switzerland', 'mkt_germany'])
```

This matches the `marketIds` constraint on pages: a page scoped to certain markets should not advertise alternates in other markets.

::note
`useMarketHead()` does **not** set `<html lang>`, `dir`, or `og:locale`. Those are handled by nuxt-i18n's `useLocaleHead()`.
::

