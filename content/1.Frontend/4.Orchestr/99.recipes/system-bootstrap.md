---
title: System bootstrap in extendRequest
description: When your backend needs internal IDs for currency, locale, or sales channel that aren't part of clientEnv, fetch and cache the metadata once, then resolve it on each request.
seo:
  title: System bootstrap in extendRequest | Laioutr
  description: When your backend needs internal IDs for currency, locale, or sales channel that aren't in clientEnv, fetch and cache the metadata once, then resolve it on each request.
sitemap:
  loc: /frontend/orchestr/recipes/system-bootstrap
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9

---

Your storefront passes `clientEnv: { locale: 'de-DE', currency: 'EUR' }` to every Orchestr request. Your backend has no idea what `de-DE` or `EUR` mean. It wants its own opaque IDs (`sw-language-id: 0190a1b2c3...`, `sw-currency-id: 0190a1b2d4...`) on every API call. You can't hardcode them because they differ per installation, and asking the storefront to know them is a layering violation.

The pattern: fetch the vendor metadata once on first request, cache it for a day, and resolve `clientEnv` against it inside `extendRequest` on every request. The resolved IDs go onto the API client's default headers, so handlers downstream can ignore localization entirely.

```ts
.extendRequest(async ({ event, clientEnv }) => {
  const storefrontClient = shopwareClientFactory(event);

  const systemEntities = await getCachedSystemEntities(storefrontClient);    // 1. cached metadata
  const current = getCurrentSystemEntities(systemEntities, clientEnv);       // 2. resolve clientEnv
  storefrontClient.defaultHeaders['sw-currency-id'] = current.currency.id;   // 3. apply to client
  storefrontClient.defaultHeaders['sw-language-id'] = current.locale.languageId;

  return { context: { storefrontClient, current } };
});
```

## When you need this (and when you don't)

You need system bootstrap when your backend uses opaque internal IDs for entities that the storefront only knows by their canonical name (BCP47 locale, ISO 4217 currency, ISO 3166 country). Shopware is the case we hit hardest: every Storefront API call requires a `sw-language-id` UUID, never a locale string.

You don't need it when your backend accepts standard codes directly. The `defineShopify` middleware just constructs its API clients (the Storefront API takes BCP47 locales and ISO currency codes through the request context, no resolution step needed). Adobe Commerce's middleware is the same shape. Reach for this pattern only when there's a real translation layer between `clientEnv` and your API client.

## Step 1: write the metadata fetch

The fetch retrieves every entity your handlers might need to translate against (currencies, locales, countries, salutations). One call per surface, run in parallel where the SDK allows it:

```ts [server/shopware-helper/system/getSystemEntities.ts]
import { StorefrontClient } from '../../types/shopware';
import { swTranslated } from '../swTranslated';

export type SwSystemEntities = Awaited<ReturnType<typeof getSystemEntities>>;
export type SwSystemLocale = SwSystemEntities['locales'][number];

export const getSystemEntities = async (client: StorefrontClient) => {
  const [rawCurrencies, rawCountries, rawLanguages] = await Promise.all([
    client.invoke('readCurrency post /currency'),
    client.invoke('readCountry post /country'),
    client.invoke('readLanguages post /language'),
  ]);

  return {
    currencies: rawCurrencies.data.map((c) => ({
      id: c.id,
      iso: swTranslated(c, 'isoCode'),
    })),
    countries: rawCountries.data.elements?.map((c) => ({ id: c.id, iso: c.iso })) ?? [],
    locales:
      rawLanguages.data.elements?.map((lang) => ({
        id: lang.localeId,
        languageId: lang.id,
        iso: swTranslated(lang.locale, 'code'),
      })) ?? [],
  };
};
```

Keep this function pure: it takes a client and returns plain data. No caching, no `clientEnv`. The next step adds the cache layer.

## Step 2: cache it for a day, keyed by tenant

Vendor metadata changes rarely (months apart) but must be invalidated when credentials rotate. Use `useUserlandCache` keyed by your API token so a credential change naturally evicts the cache:

```ts [server/shopware-helper/system/getSystemEntities.ts]
import { useRuntimeConfig, useUserlandCache } from '#imports';

const SYSTEM_ENTITIES_TTL = 60 * 60 * 24; // 1 day

export const getCachedSystemEntities = async (client: StorefrontClient) => {
  const accessToken = useRuntimeConfig()['@laioutr-app/shopware'].accessToken;
  const cache = useUserlandCache<SwSystemEntities>(
    `shopware:${accessToken}:system-entities`,
  );

  const cached = await cache.getItem('default');
  if (cached) return cached;

  const fresh = await getSystemEntities(client);
  await cache.setItem('default', fresh, { ttl: SYSTEM_ENTITIES_TTL });
  return fresh;
};
```

A 1-day TTL is the right ballpark for currency and language lists. For higher-churn data (price tier IDs, sales channel changes), drop to an hour. See [Userland cache patterns](./userland-cache-patterns#in-the-prefix-invalidate-as-a-unit) for why the access token belongs in the cache prefix, not the value.

## Step 3: resolve clientEnv against the metadata

Vendor locale formats rarely line up with BCP47 strings. A request for `de-DE` might find `de_DE`, `de-de`, `de`, or no German at all. Apply a fallback ladder so a request never hard-fails on a locale mismatch:

```ts [server/shopware-helper/system/getCurrentSystemEntities.ts]
import { ClientEnv } from '@laioutr-core/orchestr/types';
import { SwSystemEntities, SwSystemLocale } from './getSystemEntities';

const findBestLocale = (locales: SwSystemLocale[], clientLocale: string): SwSystemLocale => {
  if (locales.length === 0) throw new Error('No locales available');

  const normalize = (s: string) => s.replace('_', '-').toLowerCase();
  const wanted = normalize(clientLocale);
  const normalized = locales.map((l) => ({ ...l, isoNorm: normalize(l.iso) }));

  // 1. Exact match (case-insensitive, treating de_DE and de-DE as equal).
  const exact = normalized.find((l) => l.isoNorm === wanted);
  if (exact) return exact;

  // 2. Language-only match (de matches de-AT, de-CH).
  const language = wanted.split('-')[0];
  const byLanguage = normalized.find((l) => l.isoNorm.split('-')[0] === language);
  if (byLanguage) return byLanguage;

  // 3. Fall back to English in any region.
  const english = normalized.find((l) => l.isoNorm.startsWith('en'));
  if (english) return english;

  // 4. Anything is better than nothing.
  return locales[0];
};

export const getCurrentSystemEntities = (system: SwSystemEntities, clientEnv: ClientEnv) => {
  const locale = findBestLocale(system.locales, clientEnv.locale);
  const currency = system.currencies.find((c) => c.iso === clientEnv.currency) ?? system.currencies[0];
  const country = system.countries.find((c) => c.iso === new Intl.Locale(clientEnv.locale).region) ?? system.countries[0];
  return { locale, currency, country };
};
```

The ladder is sequential, not heuristic. Each rung is a clear rule someone can debug if a customer reports the wrong locale rendering. Currency and country usually only need an exact match plus a "first available" fallback. There's no equivalent of language-only matching for ISO 4217.

## Step 4: wire it into extendRequest

The full middleware combines all three pieces. Note that handlers downstream see `current` on `context` and never deal with the raw metadata or the fallback logic:

```ts [server/middleware/defineShopware.ts]
import { defineOrchestr } from '#imports';
import { shopwareClientFactory } from '../client/shopwareClientFactory';
import { getCachedSystemEntities } from '../shopware-helper/system/getSystemEntities';
import { getCurrentSystemEntities } from '../shopware-helper/system/getCurrentSystemEntities';

export const defineShopware = defineOrchestr
  .meta({ app: '@laioutr-core/shopware', label: 'Shopware', logoUrl: '/app-shopware/shopware-logo.svg' })
  .extendRequest(async ({ event, clientEnv }) => {
    const storefrontClient = shopwareClientFactory(event);

    const systemEntities = await getCachedSystemEntities(storefrontClient);
    const current = getCurrentSystemEntities(systemEntities, clientEnv);

    storefrontClient.defaultHeaders['sw-currency-id'] = current.currency.id;
    storefrontClient.defaultHeaders['sw-language-id'] = current.locale.languageId;

    return {
      context: {
        storefrontClient,
        current,
        swCurrency: current.currency.iso,
      },
    };
  });
```

A handler now reads `context.swCurrency` if it needs the ISO code, or `context.current.locale.languageId` for vendor IDs, but it never runs the bootstrap. The cache means only the first request after a TTL eviction pays the network cost; the rest are an in-memory map lookup.

## Cost discipline in extendRequest

`extendRequest` runs on every Orchestr request (actions, queries, links, and component resolvers all share the same per-request middleware chain), so the bootstrap call has to stay cheap. The cache layer is what makes that safe: without it, every response would carry the metadata fetch's latency, and a slow vendor would slow the entire storefront. Treat any uncached work in `extendRequest` as a hot-path performance bug.

## Related

- [Middleware: extendRequest](/frontend/orchestr/middleware#extendrequest-per-request-setup): base mechanics of per-request setup.
- [Caching: Userland cache](/frontend/orchestr/caching#userland-cache): the cache the bootstrap uses.
- [Userland cache patterns](./userland-cache-patterns) (recipe): the prefix-vs-key composition rule the bootstrap cache follows.
