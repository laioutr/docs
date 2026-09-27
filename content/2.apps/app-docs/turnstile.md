---
title: Cloudflare Turnstile
description: Developer documentation for the Laioutr Cloudflare Turnstile app package. Protect selected actions from bots with your own Turnstile widget, on any host.
seo:
  title: Cloudflare Turnstile
  description: Developer documentation for the Laioutr Cloudflare Turnstile app package. Protect selected actions from bots with your own Turnstile widget, on any host.
sitemap:
  loc: /apps/app-docs/turnstile
  lastmod: 2026-09-25
  changefreq: monthly
  priority: 1.0
---

## Overview

The `@laioutr/app-turnstile` package makes [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) the [bot-protection provider](/apps/app-development/bot-protection-providers) of a Laioutr storefront. Every action the project lists must carry a Turnstile token, and the server checks it with Cloudflare before the action runs. For how bot protection works in a storefront, read [Bot Protection](/frontend/features/bot-protection).

The app runs on any host: Vercel, Laioutr Cloud or your own server. Each project uses its **own** Turnstile widget, from its own Cloudflare account.

::callout{icon="i-lucide-triangle-alert" color="warning"}
**A visitor whose browser cannot reach Cloudflare cannot run a protected action**, even with `whenUnavailable: "open"`. This includes a blocked or failed load of Turnstile's script and a browser Turnstile does not support. `open` covers only an outage that the server sees. A browser cannot prove an outage, because every bot could make the same claim.
::

## Configuration requirements

### Create a Turnstile widget

In your Cloudflare dashboard, open **Turnstile → Add widget** and choose the **Managed** mode. Add every hostname the storefront answers on, including preview hostnames. You get a site key and a secret key.

On Cloudflare's Free plan, a widget takes up to 10 hostnames and an account up to 20 widgets. Verifications have no limit.

### Install and configure the app

Add the app to the project's `laioutrrc.json` with the two keys, and list the actions to protect:

```jsonc [laioutrrc.json]
{
  "apps": [
    {
      "name": "@laioutr/app-turnstile",
      "config": { "siteKey": "0x…", "secretKey": "0x…" }
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
| **`siteKey`** | `string` | The widget's site key. It reaches the browser. |
| **`secretKey`** | `string` | The widget's secret key. It stays on the server. |
| **`actions`** | `string[]` | The actions to protect. An action that is not listed is never checked. |
| **`whenUnavailable`** | `'open' \| 'closed'` | What happens when the server cannot reach Cloudflare. `open` runs the action and logs a warning; `closed` answers 503. A missing or failed token is rejected under either value. Default: `open`. |

If either key is missing, the build logs a warning and the app registers nothing, so every protected action is rejected.

## Runtime behaviour

In the browser, nothing loads on page load. On the first protected action, the app loads Turnstile's script and asks Cloudflare for a token. Most visitors pass without seeing anything. When Cloudflare asks the visitor to confirm they are human, the app shows the widget in a small dialog, and the action continues after the visitor passes. Two actions at the same moment run one after the other.

On the server, the app checks each token with Cloudflare and compares the hostname and the action it was made for:

- A valid token for this hostname and this action runs the action.
- Any other request is rejected with 403. That includes a request without a token, a token used twice, and a wrong secret key.
- When Cloudflare does not answer, times out or answers with a server error, the project's `whenUnavailable` decides.

A rejected request reaches the storefront as an error. [Show a message](/frontend/features/bot-protection#show-a-message-when-a-request-is-rejected) with `botProtectionErrorOf(error)` from `#frontend/bot-protection`. It returns `'rejected'`, `'unavailable'`, or `'cancelled'` when the visitor closes the dialog.

### Style the dialog

The dialog is a native `<dialog data-laioutr-turnstile>` with `data-state="open"` or `"closed"`. Its default styles use `:where(…)`, so any rule in your stylesheet overrides them without `!important`:

```css
dialog[data-laioutr-turnstile] {
  border-radius: 0;
  background: var(--color-surface);
}
```

## Content Security Policy

With a Content Security Policy, allow Cloudflare in two directives, or the browser blocks Turnstile and
every protected action fails:

```
script-src https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
```

A nonce-based policy needs `'strict-dynamic'`. The app inserts Turnstile's script from its own code and
does not set a nonce on it, so the script loads only when your trusted scripts may load further ones.

The dialog's default styles are an inline `<style>`. A policy without `style-src 'unsafe-inline'` blocks
them. The dialog still works, but unstyled, so style it in your own stylesheet.

## Test keys

Cloudflare's test keys work on any hostname, including `localhost`:

| Site key | Behaviour |
| --- | --- |
| `1x00000000000000000000BB` | Always passes, invisible |
| `2x00000000000000000000BB` | Always fails, invisible |
| `3x00000000000000000000FF` | Forces an interactive challenge |

| Secret key | Behaviour |
| --- | --- |
| `1x0000000000000000000000000000000AA` | Always passes |
| `2x0000000000000000000000000000000AA` | Always fails |
| `3x0000000000000000000000000000000AA` | Returns "token already spent" |

A test secret accepts every token, so the server logs a warning at startup when one is configured. Never deploy a test secret to production.

## Consent

The app loads Turnstile only when a visitor triggers a protected action, and it adds no consent integration. From that moment the browser contacts `challenges.cloudflare.com`. Whether Turnstile needs consent for your storefront is your decision. Read what Cloudflare states about Turnstile in its [documentation](https://developers.cloudflare.com/turnstile/) and its privacy terms before you enable it.

## Backend requirements

- A Cloudflare account with a Turnstile widget for the storefront's hostnames.
- `@laioutr-core/frontend-core` 0.55.0 or newer in the host app.

## Summary checklist

- Create a **Managed** Turnstile widget and add every storefront and preview hostname.
- Add **@laioutr/app-turnstile** to the project's apps with **siteKey** and **secretKey**.
- List the actions to protect under **config.botProtection.actions**.
- Choose **whenUnavailable** if `open` does not fit.
- Handle rejected and cancelled actions in the UI with **botProtectionErrorOf**.

## Changelog

Version history is maintained in [`CHANGELOG.md`](https://github.com/laioutr/app-turnstile/blob/main/CHANGELOG.md) in the public repository [**laioutr/app-turnstile**](https://github.com/laioutr/app-turnstile).
