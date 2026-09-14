---
title: Bot Protection Providers
description: How to build a Laioutr app that protects selected actions with a bot-protection or captcha service by implementing the BotProtectionAdapter and BotProtectionVerifier contracts from frontend-core.
seo:
  title: Bot Protection Providers
  description: How to build a Laioutr app that protects selected actions with a bot-protection or captcha service by implementing the BotProtectionAdapter and BotProtectionVerifier contracts from frontend-core.
sitemap:
  loc: /apps/app-development/bot-protection-providers
  lastmod: 2026-09-14
  changefreq: monthly
  priority: 1
---

## What you are building

A project protects selected actions — a newsletter sign-up, a login, a checkout step — by listing them in its project config. A **bot-protection provider** app decides whether a request to one of those actions came from a person. Vercel BotID, Cloudflare Turnstile, reCAPTCHA, hCaptcha and a self-hosted proof-of-work all fit the same contract.

If `@laioutr-app/botid` fits your hosting, use it. Build your own provider only when no existing app fits.

A project installs **one** provider. A provider has two halves:

1. A **client adapter** (`BotProtectionAdapter`) that produces a proof for a protected request. Install it with `useBotProtection().setAdapter(adapter)` in a client plugin.
2. A **server verifier** (`BotProtectionVerifier`) that checks the proof and returns a verdict. Register it with `setBotProtectionVerifier(verifier)` in a Nitro plugin.

frontend-core owns everything around them: which actions are protected, the outage policy, the error responses, and the signed bypass for scripts and devtools.

Providers come in two shapes:

- **Token shape.** The adapter returns the proof as request headers from `prepare()`. Turnstile, reCAPTCHA, hCaptcha and proof-of-work work this way.
- **Wrapper shape.** The vendor's script wraps `fetch` and attaches its own headers to matching requests. The adapter hands the protected paths to the vendor in `setup()` and returns `{}` from `prepare()`. BotID works this way.

For the module skeleton and options handling, scaffold from the [App Starter](/apps/app-development/app-starter) and follow [App Configuration](/apps/app-development/app-configuration).

## The contract

The types are exported under the `#frontend/bot-protection` alias:

```ts
import type { H3Event } from 'h3';

export interface BotProtectionRequest {
  /** An orchestr action token, or an id an app route declared. */
  action: string;
}

export interface BotProtectionTarget extends BotProtectionRequest {
  method: string;
  /** Same-origin pathname. */
  path: string;
}

export interface BotProtectionAdapter {
  readonly name: string;
  setup?(context: { targets: readonly BotProtectionTarget[] }): void | (() => void);
  prepare(request: BotProtectionRequest): Promise<Record<string, string>>;
  challenge?(request: BotProtectionRequest, data: unknown): Promise<Record<string, string>>;
}

export type BotProtectionVerdict =
  | { status: 'valid' }
  | { status: 'invalid'; reason: string }
  | { status: 'unavailable'; reason: string }
  | { status: 'challenge'; reason: string; data?: unknown };

export interface BotProtectionServerRequest extends BotProtectionRequest {
  /** The request input, read and validated on first call. */
  readInput(): Promise<unknown>;
}

export interface BotProtectionVerifier {
  readonly name: string;
  verify(event: H3Event, request: BotProtectionServerRequest): Promise<BotProtectionVerdict>;
}
```

::field-group
  :::field{name="setup(context)" type="({ targets }) => void | (() => void)"}
  Runs once, in the plugin that installs the adapter. `targets` lists every protected action with the method and path its request goes to. Throw on missing configuration: the store logs a warning and installs nothing. Return a cleanup function if the adapter holds listeners.
  :::

  :::field{required name="prepare(request)" type="(request) => Promise<Record<string, string>>"}
  Returns the headers that prove this one request. It may load the vendor script and show an interactive challenge. Throw `BotProtectionCancelled` when the visitor closes that challenge: the action sends no request.
  :::

  :::field{name="challenge(request, data)" type="(request, data) => Promise<Record<string, string>>"}
  Returns a step-up proof after the verifier answered `challenge`. `data` is what the verifier returned. Omit it when your verifier never answers `challenge`.
  :::

  :::field{required name="verify(event, request)" type="(event, request) => Promise<BotProtectionVerdict>"}
  Checks the proof on the incoming request. Call `request.readInput()` only when the verdict depends on the submitted input, such as a proof bound to a hash of the form.
  :::
::

## Registering the provider

A client plugin installs the adapter:

```ts [src/runtime/app/plugins/botProtection.client.ts]
import { defineNuxtPlugin } from 'nuxt/app';
import { useBotProtection } from '#imports';
import { createAcmeAdapter } from '../createAcmeAdapter';

export default defineNuxtPlugin(() => {
  useBotProtection().setAdapter(createAcmeAdapter());
});
```

A Nitro plugin registers the verifier:

```ts [src/runtime/server/plugins/botProtection.ts]
import { defineNitroPlugin, setBotProtectionVerifier } from '#imports';
import { verifyWithAcme } from '../lib/verifyWithAcme';

export default defineNitroPlugin(() => {
  setBotProtectionVerifier({ name: 'acme', verify: (event) => verifyWithAcme(event) });
});
```

The module names itself as the provider, so frontend-core can warn at build time when a project lists actions and no provider is installed:

```ts [src/module.ts]
nuxt.options.runtimeConfig.laioutr = defu({ botProtection: { provider: 'acme' } }, nuxt.options.runtimeConfig.laioutr);
```

When a verifier cannot run in the current environment — a vendor that works only on one host, a missing secret — do not register it. frontend-core then rejects every protected action, which is visible. A verifier that always throws would let every request through under the default outage policy, which is not.

## What the server does with a verdict

For a protected action, frontend-core checks in this order:

1. A valid [signed bypass](#the-signed-bypass) lets the request through without asking the verifier.
2. No registered verifier: the request is rejected, and the server logs this once.
3. The verifier runs, with a limit of 5 seconds. A verifier that throws or takes longer counts as `unavailable`.
4. The verdict decides:

| Verdict | Response | `data.code` |
| --- | --- | --- |
| `valid` | The action runs. | — |
| `invalid` | 403 | `bot-protection-rejected` |
| `challenge` | 403, with the verifier's `data` as `challenge` | `bot-protection-challenge` |
| `unavailable`, project policy `open` (default) | The action runs, and the server logs a warning. | — |
| `unavailable`, project policy `closed` | 503 | `bot-protection-unavailable` |

The `reason` never reaches the browser. It is recorded on the request's trace as `laioutr.bot_protection.reason`, next to `laioutr.bot_protection.verdict` and `laioutr.bot_protection.provider`.

Choose the verdict carefully, because the outage policy only applies to `unavailable`:

- Return `invalid` for a missing, expired, reused or foreign proof, and for a configuration error such as a wrong secret key. Returning `unavailable` for these would let every request through under the `open` policy.
- Return `unavailable` only when the vendor cannot answer: a network error, a timeout, a 5xx.
- An error that carries a `statusCode`, such as the 400 from `readInput()` on invalid input, is passed on unchanged.

## When the vendor script does not load

A client that cannot load the vendor's script cannot produce a proof. The adapter may then send the header `x-laioutr-bot-protection-client-outage: 1` (exported as `BOT_PROTECTION_CLIENT_OUTAGE_HEADER`) instead of a proof.

A client can send that header whether or not the vendor is really down, so the header alone must never produce `unavailable`. When the verifier sees it, check the vendor's health from the server — cache the result for about 30 seconds — and answer `unavailable` only when the vendor is really unreachable. Otherwise answer `invalid`.

## Step-up challenges

A verifier can ask for a stronger proof — for example after a low invisible score — by answering `challenge` with the public data the client needs:

```ts
return { status: 'challenge', reason: 'low-score', data: { siteKey: config.interactiveSiteKey } };
```

`data` is sent to the browser. Put public values in it only, never a secret.

When the adapter implements `challenge()`, the client retries the action once: it calls `challenge(request, data)` and sends its headers with the second request. Without `challenge()`, or when the second request fails too, the error reaches the caller.

A storefront shows a message for these errors with `botProtectionErrorOf(error)`, which returns `'rejected'`, `'unavailable'`, `'cancelled'` or `undefined`:

```ts
import { botProtectionErrorOf } from '#frontend/bot-protection';

try {
  await subscribe.mutateAsync(input);
} catch (error) {
  if (botProtectionErrorOf(error) === 'cancelled') return;
  toaster.addToast({ title: 'Please try again.', variant: 'error' });
}
```

## Timing and consent

First-party providers start at the protected action, not on page load: the adapter's `setup()` loads nothing and contacts no vendor, and the vendor's code runs when the visitor triggers a protected action. frontend-core has no consent integration for bot protection.

A provider may start earlier — some vendors must run on page load to observe the visitor. If yours loads vendor code, contacts the vendor or reads device data in `setup()`, say so in its documentation, together with what the vendor states about its own purposes. Whether a provider needs consent is the project's decision, and it needs that information to make it.

## Protecting an app route

An orchestr action needs nothing beyond its entry in the project config. A route your app registers itself — for example `POST /api/app-acme/login/start` — protects itself in three steps.

Declare the route from your module, so the adapter knows its path:

```ts [src/module.ts]
nuxt.options.runtimeConfig.public.laioutr = defu(
  { botProtection: { routes: [{ action: 'app-acme/login-start', method: 'POST', path: '/api/app-acme/login/start' }] } },
  nuxt.options.runtimeConfig.public.laioutr
);
```

Call `requireBotProtection` first in the handler. It returns at once when the project does not list the id:

```ts [src/runtime/server/api/app-acme/login/start.post.ts]
export default defineEventHandler(async (event) => {
  await requireBotProtection(event, { action: 'app-acme/login-start' });
  // …
});
```

Send the proof from your client code:

```ts
const botProtection = useBotProtection();
const headers = botProtection.isProtected('app-acme/login-start') ? await botProtection.prepare({ action: 'app-acme/login-start' }) : {};

await $fetch('/api/app-acme/login/start', { method: 'POST', body, headers });
```

The project lists the id `app-acme/login-start` in its config like any action.

## The signed bypass

Scripts, load tests and the Nuxt DevTools run protected actions without a proof by sending a signed bypass header. The value is bound to one action and is valid for five minutes either side of its timestamp:

```ts
import { BOT_PROTECTION_BYPASS_HEADER, signBotProtectionBypass } from '@laioutr-core/core-types/utils';

const headers = {
  [BOT_PROTECTION_BYPASS_HEADER]: await signBotProtectionBypass(projectSecretKey, 'newsletter/subscribe', Math.floor(Date.now() / 1000)),
};
```

The value is signed with the project secret key, and a project without one accepts no bypass. The Orchestr tab of the Nuxt DevTools adds the header to every action it runs.

The header carries a credential. Exclude `x-laioutr-bypass-bot-protection` from any request-header capture in logging or tracing.
