---
title: Multi-language Support
description: Laioutr's multi-language support lets you run storefronts in multiple languages and regions, with language switchers, localized paths, and BCP 47–based configuration managed in Cockpit.
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

`resolvePagePath(paths, language)` resolves a `LocalizedValue<string>` to a single path for a given `RenderLanguage`. It walks the language's `localeChain` and returns the first match. For example, `de-CH` tries `de-CH` → `de-DE` → `de` → `*` → first available value.

The generic version `unlocalize(value, chain)` does the same for any `LocalizedValue<T>`.

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
- Link resolution (`useLinkResolver`)
- hreflang alternates (`useMarketHead`)
- Market/language/domain [composables](/frontend/features/multi-market#composables)

::warning
If you are coming from a standard nuxt-i18n setup: `useLocalePath()` and prefix-based routing do **not** apply. Use `useSwitchLanguagePath()` and `useSwitchMarketUrl()` instead.
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

Frontend Core provides two composables for building language and market switchers:

**`useSwitchLanguagePath()`** switches language **within the same market**:

```vue
<template>
  <nav>
    <NuxtLink
      v-for="domain in market.domains"
      :key="domain.id"
      :to="switchLanguagePath(domain.language.id)"
    >
      {{ domain.language.endonym }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const market = useMarket()
const switchLanguagePath = useSwitchLanguagePath()
</script>
```

Returns `'#'` if the target language is not available in the current market.

**`useSwitchMarketUrl()`** switches to a **different market** (full URL, requires full page load because the host may differ):

```ts
const switchMarketUrl = useSwitchMarketUrl()

// Navigate to Germany market, default language
navigateTo(switchMarketUrl('mkt_germany'), { external: true })

// Navigate to Germany market, French
navigateTo(switchMarketUrl('mkt_germany', 'lng_fr'), { external: true })
```

Both resolve the correct localized path for the current page, including dynamic params.

### SEO: hreflang and canonical

Frontend Core registers `useMarketHead()` globally. No setup needed. It injects:

- `<link rel="alternate" hreflang="...">` for every (market × domain) combination with a resolved path for the current page
- `<link rel="alternate" hreflang="x-default">` pointing to the default market's default domain
- `<link rel="canonical">` for the current domain + path

Pages scoped to specific markets via `marketIds` correctly exclude other markets from hreflang tags.

### Utilities

- **`getExonym(language, inLocale)`**: returns the language name in another locale (e.g. "German" when the UI is in English). Useful for language picker labels that show names in the current UI language rather than the target language's endonym.
- **`fillParams(path, params)`**: replaces `:param` segments in a path string. Used internally by the switcher composables; you may need it for custom link building.
