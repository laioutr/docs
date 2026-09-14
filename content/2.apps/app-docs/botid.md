---
title: Vercel BotID
description: Developer documentation for the Laioutr Vercel BotID app package. Protect selected actions from bots with Vercel BotID on storefronts hosted on Vercel.
seo:
  title: Vercel BotID
  description: Developer documentation for the Laioutr Vercel BotID app package. Protect selected actions from bots with Vercel BotID on storefronts hosted on Vercel.
sitemap:
  loc: /apps/app-docs/botid
  lastmod: 2026-09-14
  changefreq: monthly
  priority: 1.0
---

## Overview

The `@laioutr-app/botid` package makes [Vercel BotID](https://vercel.com/docs/botid) the [bot-protection provider](/apps/app-development/bot-protection-providers) of a Laioutr storefront. It checks the actions the project lists — a newsletter sign-up, a login, a contact form — and rejects a request that BotID does not classify as a person.

The app uses BotID's Basic check level only. It runs only on storefronts hosted on Vercel.

## Configuration requirements

### Install the module

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/botid'],
});
```

The module has no options.

### List the protected actions

List the orchestr action tokens to protect in the `config` block of the project's `laioutrrc.json`:

```jsonc [laioutrrc.json]
{
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
| **`actions`** | `string[]` | The actions to protect. An action that is not listed is never checked. |
| **`whenUnavailable`** | `'open' \| 'closed'` | What happens when BotID cannot answer, such as during a Vercel outage. `open` runs the action and logs a warning; `closed` answers 503. A missing or failed check is rejected under either value. Default: `open`. |

## Runtime behaviour

In the browser, the app hands the protected paths to BotID. BotID wraps `fetch` and loads nothing on page load. Its challenge script loads on the first request to a protected action, and BotID attaches its headers to that request.

On the server, the app asks BotID about each request to a protected action:

- A request BotID classifies as a person runs the action.
- Any other request is rejected with 403, including verified bots such as search-engine crawlers.
- When BotID cannot answer, the project's `whenUnavailable` decides.

A rejected request reaches the storefront as an error. Show a message with `botProtectionErrorOf(error)` from `#frontend/bot-protection`, which returns `'rejected'` or `'unavailable'` for these errors.

In development (`nuxi dev`), BotID classifies every request as a person without contacting Vercel.

## Limits

- **Vercel only.** On a production server that is not on Vercel, the app registers no check, and every protected action is rejected. The build logs a warning when it targets another host.
- **Do not enable Deep Analysis** in the Vercel dashboard. The browser then loads the Kasada script whatever the app configures, and every check is billed.
- **Test in a browser, not with `curl`.** BotID rejects a request that did not pass through its client script. To call a protected action from a script, send a [signed bypass](/apps/app-development/bot-protection-providers#the-signed-bypass).
- **The first protected request is slower**, because it loads BotID's challenge script first.

## Consent

The app starts BotID only when a visitor triggers a protected action, and it adds no consent integration. Whether BotID needs consent for your storefront is your decision. Read what Vercel states about BotID in its [documentation](https://vercel.com/docs/botid) and its data processing terms before you enable it.

## Backend requirements

- A storefront deployed on Vercel.
- `@laioutr-core/frontend-core` installed in the host app.

## Summary checklist

- Add **@laioutr-app/botid** to Nuxt modules.
- List the actions to protect under **config.botProtection.actions** in `laioutrrc.json`.
- Choose **whenUnavailable** if `open` does not fit.
- Leave Deep Analysis off in the Vercel dashboard.
- Handle rejected actions in the UI with **botProtectionErrorOf**.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package's GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo's **`CHANGELOG.md`** for release notes.
