---
title: Client Environment
description: The clientEnv object every handler receives — what the browser sends, what the server resolves it into, and why the two are different types.
seo:
  title: Client Environment
  description: The clientEnv object every handler receives — what the browser sends, what the server resolves it into, and why the two are different types.
sitemap:
  loc: /frontend/orchestr/client-env
  lastmod: 2026-07-24
  changefreq: monthly
  priority: 0.9
---

Every query, link, action, and component resolver receives a `clientEnv` argument describing the request's environment: which language, which market, which currency, and whether this is a content preview.

There are **two types**, and the difference between them is a trust boundary:

| Type             | Who produces it            | Trusted | Where you see it                                                        |
| ---------------- | -------------------------- | ------- | ----------------------------------------------------------------------- |
| `WireClientEnv`  | The browser                | **No**  | The [`orchestr:client-env:modify`](/frontend/features/hooks#client-environment) hook, the [wire format](/frontend/orchestr/wire-format) |
| `ClientEnv`      | The server, per request    | Yes     | Every handler, `extendRequest`, `getKeySuffix`                          |

The browser sends a `WireClientEnv`. The server runs it through `resolveClientEnv()`, which validates each field against the project's own configuration and returns a `ClientEnv`. Handlers only ever see the resolved type.

## `ClientEnv` — what handlers receive

```ts
type ClientEnv<T = Record<string, any> | undefined> = {
  isPreview: boolean;
  market: RenderMarket;
  language: RenderLanguage;
  domain: RenderMarketDomain;
  custom?: T;
};
```

| Field       | Type             | Description                                                                                                     |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `isPreview` | `boolean`        | `true` only when the client asked for [content preview](/frontend/features/content-preview) **and** the server verified the token. |
| `market`    | `RenderMarket`   | The full resolved market — id, slug, currency, region codes, domains.                                            |
| `language`  | `RenderLanguage` | The full resolved language — id, BCP 47 code, fallback chain, direction.                                          |
| `domain`    | `RenderMarketDomain` | The specific domain this request resolved to — its host, optional path prefix, and language. Use `domain.host` for the request's canonical host. |
| `custom`    | `T \| undefined` | Whatever your own plugin put on the wire env. Passed through untouched, and therefore **untrusted**.              |

`market`, `language`, and `domain` are always populated. Read them directly; do not write fallback defaults like `clientEnv.market.currency ?? 'USD'`.

The fields most handlers reach for:

| Path                        | Example              | Description                                                   |
| --------------------------- | -------------------- | ------------------------------------------------------------- |
| `market.id`                 | `mkt_123`            | RC entity id of the market.                                   |
| `market.slug`               | `switzerland`        | Developer-friendly alias — the usual key for a sales channel. |
| `market.currency`           | `CHF`                | ISO 4217 currency code.                                       |
| `market.regionCodes`        | `['CH']`             | ISO 3166 region codes the market covers.                      |
| `market.defaultDomain.host` | `www.shop.ch`        | The market's **default** hostname.                           |
| `domain.host`               | `www.shop.ch`        | The host **this request** resolved to — may differ from `market.defaultDomain.host` when a market spans several domains. Prefer it for the request's canonical URL. |
| `language.id`               | `lng_abc`            | RC entity id of the language.                                 |
| `language.code`             | `de-CH`              | BCP 47 tag — the request's locale.                            |
| `language.languageCode`     | `de`                 | ISO 639 subtag, for backends that key on language alone.      |
| `language.localeChain`      | `['de-CH', 'de-DE']` | Ordered fallback chain for content resolution.                |
| `language.direction`        | `ltr`                | Text direction.                                                |

```ts [server/orchestr/catalog/products.ts]
export default defineMyQuery(ProductsQuery, async ({ context, clientEnv }) => {
  const products = await context.api.search({
    locale: clientEnv.language.code,
    currency: clientEnv.market.currency,
    channel: clientEnv.market.slug,
    includeDrafts: clientEnv.isPreview,
  });

  return { ids: products.map((p) => p.id), total: products.length };
});
```

::caution
`ClientEnv` also carries `locale` and `currency` at the top level. Both are **deprecated** flat copies of `language.code` and `market.currency`. Use the resolved objects: they cannot disagree with the market a handler reads, and they carry the region codes, fallback chain, and domains the flat strings drop.
::

::caution
`market`, `language`, and `domain` reference each other (`RenderMarketDomain.language` ↔ `RenderLanguage.marketDomains`). Traversing the graph is fine, but `JSON.stringify(clientEnv)` **throws** on the cycle. Never serialize the whole object — pick the scalars you need.
::

## `WireClientEnv` — what the browser sends

```ts
type WireClientEnv = {
  locale: string;
  currency: string;
  isPreview: boolean;
  previewToken?: string;
  marketId?: string;
  languageId?: string;
  custom?: Record<string, any>;
};
```

| Field          | Description                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `marketId`     | The market the client believes it is on. Looked up in the project's i18n config; an unknown id falls back to the default market.  |
| `languageId`   | Likewise, falling back to the market's default domain language.                                                                    |
| `isPreview`    | A *request* for preview content, not a grant.                                                                                     |
| `previewToken` | The presented content-preview token. Verified and then **stripped** — it never reaches a handler.                                 |
| `locale`       | Vestigial. The server does not read it; it derives `locale` from the resolved language. Some client-side code still reads it locally. |
| `currency`     | Vestigial, for the same reason.                                                                                                   |
| `custom`       | Your own arbitrary data, passed through to `ClientEnv.custom` unchanged.                                                          |

Nothing here is trusted. The server treats every field as a claim to be checked against configuration it already holds.

### Adding your own data

Shape the wire env from a Nuxt plugin with the [`orchestr:client-env:modify`](/frontend/features/hooks#client-environment) hook. frontend-core already sets `marketId`, `languageId`, and the preview fields — put anything of your own under `custom`:

```ts [app/plugins/client-env.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('orchestr:client-env:modify', ({ clientEnv }) => {
    clientEnv.custom = { ...clientEnv.custom, abVariant: useCookie('ab-variant').value };
  });
});
```

Read it back on the server as `clientEnv.custom?.abVariant` — and validate it there, because a shopper can set it to anything.

## Resolution

`resolveClientEnv(event, raw)` is the single entry point. It parses the raw body value, applies the preview gate, resolves the ids, and builds the result field by field — which is why `previewToken` cannot survive into it.

```ts
const clientEnv = resolveClientEnv(event, rawClientEnvFromRequest);
await runQuery(Token, args, clientEnv, event);
```

Every orchestr endpoint does this before dispatching. If you write your own endpoint that runs orchestr handlers, you must too — passing a hand-built object skips the gate.

The market and language ids are resolved against the project's i18n config, and `isPreview` is granted only when the presented token verifies. Both are decided server-side, from configuration the browser has no access to.

## Cache keys

Orchestr's default cache key includes the language code, the currency, and the preview stage — nothing else. It deliberately does not widen as `ClientEnv` grows.

If your handler's output varies by market, append your own scalar in `getKeySuffix`:

```ts
cache: {
  ttl: '10 minutes',
  getKeySuffix: (clientEnv) => clientEnv.market.slug,
}
```

Return a scalar, never the object — see the cycle caveat above. Full details in [Caching](/frontend/orchestr/caching).

## Related

- [Content Preview](/frontend/features/content-preview) — what `isPreview` unlocks.
- [Wire Format](/frontend/orchestr/wire-format) — the JSON `clientEnv` travels in.
- [Middleware](/frontend/orchestr/middleware) — `extendRequest` receives `clientEnv`.
- [Hooks](/frontend/features/hooks#client-environment) — shaping the wire env from the client.
