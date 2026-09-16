---
title: Bot Protection Providers
description: How to build a Laioutr app that protects selected actions with a bot-protection or captcha service by implementing the BotProtectionAdapter and BotProtectionVerifier contracts from frontend-core.
seo:
  title: Bot Protection Providers
  description: How to build a Laioutr app that protects selected actions with a bot-protection or captcha service by implementing the BotProtectionAdapter and BotProtectionVerifier contracts from frontend-core.
sitemap:
  loc: /apps/app-development/bot-protection-providers
  lastmod: 2026-09-15
  changefreq: monthly
  priority: 1
---

## What you are building

A **bot-protection provider** app decides whether a request to a [protected action](/frontend/features/bot-protection) came from a person. Build one when [`@laioutr/app-botid`](/apps/app-docs/botid) does not fit your hosting. Cloudflare Turnstile, reCAPTCHA, hCaptcha and proof-of-work services all fit the same contract.

A provider has two halves. frontend-core owns everything around them: the list of protected actions, the outage policy, the error responses and the signed bypass.

- A **client adapter** (`BotProtectionAdapter`) produces a proof for a protected request. A token adapter returns the proof as headers from `prepare()`, as Turnstile or reCAPTCHA would. A wrapper adapter hands the protected paths to a vendor script that wraps `fetch`, and returns `{}` from `prepare()`, as BotID does.
- A **server verifier** (`BotProtectionVerifier`) checks the proof and returns a verdict.

Scaffold the module from the [App Starter](/apps/app-development/app-starter).

## The contract

The types are exported from `#frontend/bot-protection`:

```ts
import type { H3Event } from 'h3';

export interface BotProtectionRequest {
  /** An orchestr action token, or an id an app route declared. */
  action: string;
}

export interface BotProtectionTarget extends BotProtectionRequest {
  method: string;
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
  readInput(): Promise<unknown>;
}

export interface BotProtectionVerifier {
  readonly name: string;
  verify(event: H3Event, request: BotProtectionServerRequest): Promise<BotProtectionVerdict>;
}
```

::field-group
  :::field{name="setup(context)" type="({ targets }) => void | (() => void)"}
  Runs once when the adapter is installed, with the method and path of every protected action. Throw on missing configuration, and the adapter is not installed. Return a cleanup function if it holds listeners.
  :::

  :::field{required name="prepare(request)" type="(request) => Promise<Record<string, string>>"}
  Returns the headers that prove one request. It may load the vendor script or show a challenge. Throw `BotProtectionCancelled` when the visitor closes the challenge.
  :::

  :::field{name="challenge(request, data)" type="(request, data) => Promise<Record<string, string>>"}
  Returns a [step-up proof](#step-up-challenges), given the `data` the verifier sent.
  :::

  :::field{required name="verify(event, request)" type="(event, request) => Promise<BotProtectionVerdict>"}
  Checks the proof. Call `request.readInput()` only when the verdict depends on the submitted input.
  :::
::

## Registering the provider

Install the adapter from a client plugin, and register the verifier from a Nitro plugin:

```ts [src/runtime/app/plugins/botProtection.client.ts]
import { defineNuxtPlugin } from 'nuxt/app';
import { useBotProtection } from '#imports';
import { createAcmeAdapter } from '../createAcmeAdapter';

export default defineNuxtPlugin(() => {
  useBotProtection().setAdapter(createAcmeAdapter());
});
```

```ts [src/runtime/server/plugins/botProtection.ts]
import { defineNitroPlugin, setBotProtectionVerifier } from '#imports';
import { verifyWithAcme } from '../lib/verifyWithAcme';

export default defineNitroPlugin(() => {
  setBotProtectionVerifier({ name: 'acme', verify: (event) => verifyWithAcme(event) });
});
```

Name the provider in your module, so the build can warn when a project lists actions but installs no provider:

```ts [src/module.ts]
nuxt.options.runtimeConfig.laioutr = defu({ botProtection: { provider: 'acme' } }, nuxt.options.runtimeConfig.laioutr);
```

Do not register a verifier that cannot run in the current environment, for example without its secret. frontend-core then rejects every protected action. A verifier that always throws would instead let every request through under the default `open` policy.

## What the server does with a verdict

A valid [signed bypass](#the-signed-bypass) skips the verifier, and a missing verifier rejects the request. Otherwise the verifier runs with a 5-second limit, where a throw or a timeout counts as `unavailable`:

| Verdict | Response | Error code |
| --- | --- | --- |
| `valid` | The action runs. | |
| `invalid` | 403 | `bot-protection-rejected` |
| `challenge` | 403, with the verifier's `data` as `challenge` | `bot-protection-challenge` |
| `unavailable`, policy `open` (default) | The action runs, and the server logs a warning. | |
| `unavailable`, policy `closed` | 503 | `bot-protection-unavailable` |

The code is in the error's `data.code`, or at `data.data.code` in the response of an orchestr action. The `reason` stays on the server, in the trace attribute `laioutr.bot_protection.reason`.

The outage policy applies only to `unavailable`. Return `invalid` for a missing, expired, reused or foreign proof, and for a configuration error such as a wrong secret key. Return `unavailable` only when the vendor cannot answer. An error with a `statusCode`, such as the 400 from `readInput()` on invalid input, passes through unchanged.

## When the vendor script does not load

An adapter that cannot load the vendor script may send `x-laioutr-bot-protection-client-outage: 1` (`BOT_PROTECTION_CLIENT_OUTAGE_HEADER`) instead of a proof. Any client can send that header, so never answer `unavailable` because of it alone: check the vendor's health from the server, cache the result for about 30 seconds, and answer `invalid` when the vendor is up.

## Step-up challenges

A verifier asks for a stronger proof by answering `challenge`. Its `data` reaches the browser, so put only public values in it:

```ts
return { status: 'challenge', reason: 'low-score', data: { siteKey: config.interactiveSiteKey } };
```

If the adapter implements `challenge()`, the client calls it and retries the action once with its headers. Without `challenge()`, or when the retry fails, the caller receives the error as `'rejected'`.

## Timing and consent

Laioutr's own providers load nothing in `setup()` and start the vendor when a visitor triggers a protected action. If yours loads vendor code, contacts the vendor or reads device data earlier, say so in its documentation, together with what the vendor states about its purposes. The project decides whether the provider needs consent.

## Protecting an app route

An orchestr action needs only its entry in the project config. A route your app registers itself, such as `POST /api/app-acme/login/start`, also needs three steps, after which the project lists `app-acme/login-start` like any action.

Declare the route in your module:

```ts [src/module.ts]
nuxt.options.runtimeConfig.public.laioutr = defu(
  { botProtection: { routes: [{ action: 'app-acme/login-start', method: 'POST', path: '/api/app-acme/login/start' }] } },
  nuxt.options.runtimeConfig.public.laioutr
);
```

Check it first in the handler:

```ts [src/runtime/server/api/app-acme/login/start.post.ts]
export default defineEventHandler(async (event) => {
  // Returns at once when the project does not list the id
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

## The signed bypass

A request with a valid bypass in the `x-laioutr-bypass-bot-protection` header never reaches your verifier. Scripts, load tests and the Orchestr tab of the Nuxt DevTools use it. The value is signed with the project secret key, bound to one action, and valid for five minutes either side of its timestamp:

```ts [scripts/subscribe-smoke-test.ts]
import { BOT_PROTECTION_BYPASS_HEADER, signBotProtectionBypass } from '@laioutr-core/frontend-core/bot-protection';

const bypass = await signBotProtectionBypass(process.env.LAIOUTR_PROJECT_SECRET_KEY!, 'newsletter/subscribe', Math.floor(Date.now() / 1000));

await fetch('https://staging.acme-outdoor.com/api/orchestr/action/newsletter/subscribe', {
  method: 'POST',
  headers: { 'content-type': 'application/json', [BOT_PROTECTION_BYPASS_HEADER]: bypass },
  body: JSON.stringify({ input: { email: 'smoke-test@acme-outdoor.com' }, clientEnv: {} }),
});
```

A project without a secret key accepts no bypass. The header carries a credential, so keep it out of request-header logging and tracing.
