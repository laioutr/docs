---
title: Cap
description: Developer documentation for the Laioutr Cap app package. Protect selected actions from bots with a proof of work that the storefront checks itself, without a vendor account.
seo:
  title: Cap
  description: Developer documentation for the Laioutr Cap app package. Protect selected actions from bots with a proof of work that the storefront checks itself, without a vendor account.
sitemap:
  loc: /apps/app-docs/cap
  lastmod: 2026-10-23
  changefreq: monthly
  priority: 1.0
---

## Overview

The `@laioutr/app-cap` package makes [Cap](https://trycap.dev), an open-source proof-of-work check with browser instrumentation, the [bot-protection provider](/apps/app-development/bot-protection-providers) of a Laioutr storefront. Every action the project lists must carry a proof, and the storefront's own server checks it before the action runs. For how bot protection works in a storefront, read [Bot Protection](/frontend/features/bot-protection).

The app needs **no vendor account**. Cap runs inside the storefront's own server, and the browser contacts no third party. The app runs on any host that gives the project Redis: Laioutr Cloud, Vercel with a Redis URL, or your own server.

::callout{icon="i-lucide-triangle-alert" color="warning"}
**A visitor whose browser cannot finish a proof cannot run a protected action**, even with `whenUnavailable: "open"`. This includes a browser that the automation check takes for an automated one, a browser without WebAssembly or web workers, and a Content Security Policy that blocks the solve. Cap shows no challenge the visitor could pass instead.
::

## Configuration requirements

### Redis

Each proof is good for one action, so the server must remember every proof it accepted, across all instances. The app keeps that record in the Redis connection of orchestr's cache.

- **Laioutr Cloud** has Redis. Nothing to do.
- **Vercel:** enter a Redis URL in the environment's [hosting settings](/hosting/hyperscaler/vercel-adapter). Without a URL, the project uses Vercel's runtime cache, the app finds no Redis, and every protected action is rejected.
- **Your own server:** mount a driver named `redis` with a `url` option at Nitro's `cache` storage, for example unstorage's `redis` driver. A driver configured with a host and a port instead of a `url` is not found.

Without Redis, a built server rejects every protected action and logs why. The same happens when Redis refuses the app's command, for example with `NOPERM`. The log then names the reply code. On the dev server, the app keeps the record in memory and warns once.

### Install and configure the app

Add the app to the project's `laioutrrc.json` and list the actions to protect. No option is required:

```jsonc [laioutrrc.json]
{
  "apps": [
    {
      "name": "@laioutr/app-cap",
      "config": { "blockAutomatedBrowsers": true, "difficulty": 1000000 }
    }
  ],
  "config": {
    "botProtection": {
      "actions": ["newsletter/subscribe", "ecommerce/auth/login"],
      "whenUnavailable": "open"
    }
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| **`blockAutomatedBrowsers`** | `boolean` | Rejects a browser that Cap's instrumentation identifies as automated, such as headless Chromium. Default: `true`. |
| **`difficulty`** | `number` | The expected number of hashes for one proof. A higher value costs a bot more time, and every visitor too. Default: `1000000`. Allowed range: `50000` to `5000000`. |
| **`actions`** | `string[]` | The actions to protect. An action that is not listed is never checked. |
| **`whenUnavailable`** | `'open' \| 'closed'` | What happens when Redis cannot be reached or does not answer within 1 second. `open` runs the action and logs a warning; `closed` answers 503. A missing, wrong or reused proof is rejected under either value. Default: `open`. |

A value of the wrong type falls back to the default, and a `difficulty` outside the range is clamped. The build logs a warning that names the option and the value it uses.

### Project secret key

The project secret key signs the proofs. Cockpit writes a stable key into the `laioutrrc`, so a new deployment keeps the issued proofs valid. Without a key, a built server rejects every protected action.

All environments of a project share one secret key. The app therefore also signs with the two options, so a proof from an environment with other options does not pass. A test environment with `blockAutomatedBrowsers: false` cannot produce proofs for production. Between two environments with the same options, a proof can pass once in either of them.

## Runtime behaviour

In the browser, nothing loads on page load. On the first protected action, the app loads Cap's widget and its WebAssembly files from the storefront's own origin. The browser then solves a proof of work in a web worker, runs Cap's instrumentation, and exchanges the solution at the storefront's server for a proof that is valid for 10 minutes.

- **The visitor sees nothing.** The widget stays hidden, and there is no checkbox and no puzzle.
- **Only the first protected action waits for a solve.** At the default difficulty, a solve took about 330 ms (median) on an Apple M4 Pro. Phones are not measured. After each use, the app solves the next proof in the background, so a later action does not wait.
- **The solve is part of the action.** The app produces the proof inside the action request, so the loading state of `useMutationAction` covers the solve too.
- A second action at the same moment waits for the next proof.

On the server, the app checks each proof:

- A valid proof that was not used before runs the action. Each proof is good for one action.
- Any other request is rejected with 403. That includes a request without a proof, a proof used twice, an expired proof, and a proof from an environment with other options.
- When Redis cannot be reached or does not answer within 1 second, the project's `whenUnavailable` decides.

A rejected request reaches the storefront as an error. [Show a message](/frontend/features/bot-protection#show-a-message-when-a-request-is-rejected) with `botProtectionErrorOf(error)` from `#frontend/bot-protection`, which returns `'rejected'` or `'unavailable'`. A solve that fails in the browser stops the action before a request goes out. `botProtectionErrorOf` returns `undefined` for that error, so the visitor sees your generic error message.

### While Redis is down

Under `whenUnavailable: "open"`, replay protection stops while Redis is down: a proof issued during the outage passes as often as it is used. When Redis answers again, the app records the solution behind each such proof, so each solution passes at most once more. Under `closed`, protected actions get 503 during the outage.

## Content Security Policy

With a Content Security Policy, allow these sources in addition to `'self'`, or every protected action fails:

```
script-src 'wasm-unsafe-eval' 'unsafe-eval';
worker-src blob:;
```

Without `'unsafe-eval'`, Cap's instrumentation cannot run. A storefront whose policy must not allow `'unsafe-eval'` cannot use this app. These sources were measured in Chromium on a production build. A nonce-based policy is not tested.

## Test suites

Headless Chromium fails the automation check, so an end-to-end suite cannot solve a proof. Send frontend-core's signed bypass header `x-laioutr-bypass-bot-protection` with the value of `signBotProtectionBypass(projectSecretKey, action, nowSeconds)` from `@laioutr-core/frontend-core/bot-protection`. Or set `blockAutomatedBrowsers: false` in a test environment. Its proofs do not pass an environment with the check on.

## Limits

- **The automation check raises the cost for a bot. It does not stop every bot.** undetected-chromedriver, nodriver and headless Firefox pass it.
- Not measured: phones, Tor Browser, and setups with screens of mixed pixel density.

## Consent

The app adds no consent integration. Before the first protected action, nothing loads. At that action, the browser loads Cap's widget and WebAssembly files from the storefront's own origin, and the instrumentation script reads browser and screen properties. No request goes to a third party. Whether this needs consent for your storefront is your decision.

## Backend requirements

- Redis for orchestr's cache (see [Redis](#redis)).
- `@laioutr-core/frontend-core` 0.72.0 or newer in the host app.
- A project secret key in the `laioutrrc`. Cockpit writes it.

## Summary checklist

- Make sure the project has **Redis** for orchestr's cache. On Vercel, enter a **Redis URL** in the hosting settings.
- Add **@laioutr/app-cap** to the project's apps. **blockAutomatedBrowsers** and **difficulty** are optional.
- List the actions to protect under **config.botProtection.actions**.
- With a Content Security Policy, allow **`'unsafe-eval'`**, **`'wasm-unsafe-eval'`** and **`blob:`** workers.
- Choose **whenUnavailable** if `open` does not fit.
- Send the signed **bypass header** from end-to-end suites.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-cap/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-cap**](https://github.com/laioutr/app-cap).
