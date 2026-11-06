---
title: Mailer
description: The Essentials Mailer app sends a storefront's withdrawal submissions through the project's Email channel in the Cockpit, with your own SMTP server as an optional fallback.
seo:
  title: Mailer
  description: Send storefront withdrawals through Laioutr Channels, with your own SMTP server as an optional fallback.
sitemap:
  loc: /apps/essentials/mailer
  lastmod: 2026-11-06
  changefreq: monthly
  priority: 1.0

---

The **Essentials Mailer** app (`@laioutr/app-essentials-mailer`) delivers what a storefront's visitors submit. Today that is the [withdrawal button](/laioutr-ui/cms/withdrawal-form): the notice to your team and the confirmation to the consumer.

Installing the Essentials Mailer in an environment also switches on the **Email channel** for that environment in the Cockpit. Recipients, the sender, limits and the delivery log are set and read there: see [Channels](/cockpit/features/channels).

## How a submission is delivered

From version 0.1.4, in a Laioutr project the Mailer sends every submission through Laioutr Channels:

1. The storefront posts the submission to Laioutr's Channels service. It proves the project with the project's slug and secret key, which every deployed storefront already has.
2. The service stores the submission and answers at once. The visitor reads that it was received.
3. The Cockpit sends the team's notice and the consumer's confirmation within seconds, at most about a minute later, from the project's preset address or your own mailbox. It applies the recipients, the protection limits and the monthly quota of the [Email channel](/cockpit/features/channels#what-counts-and-the-monthly-quota), and logs every email.

This works the same with every commerce backend, because no connector handles the withdrawal: this app does.

Your own SMTP server (`transport`) is only a **fallback**: it sends where the Channels service cannot take the submission.

| Channels service answer | What the visitor sees | Own `transport` used? |
| --- | --- | --- |
| `2xx` received | Success | No |
| `400` malformed, `403` refused, `429` too many submissions | The withdrawal's "could not be submitted" message, in the visitor's language | No, the answer is final |
| `401` project unknown or secret wrong | What the own `transport` answers | Yes, where configured |
| `5xx` or any other answer, unreachable, or no answer within 10 seconds | What the own `transport` answers | Yes, where configured |

A `401` is not final because the service also answers it while it has not yet learnt a storefront's current identity, for example an environment that received the Mailer by a copy. A withdrawal is never lost to that: the own `transport` sends it, and without one the visitor reads "could not be submitted".

::callout{type="warning"}
The visitor is told "received" before anything is sent. At the project's monthly quota the emails wait or are not sent, and the Owners are told in the Cockpit, not the visitor. Sending emails the law requires, such as the confirmation of a withdrawal, is your business's responsibility. See [What counts, and the monthly quota](/cockpit/features/channels#what-counts-and-the-monthly-quota).
::

A dev server (`nuxi dev`) marks its submissions as local, so they reach only your team's recipients and are not counted.

## Configuration

The configuration is private: it is kept in `runtimeConfig['@laioutr/app-essentials-mailer']` and never copied to the public runtime config. Take SMTP credentials from environment variables so they never reach a client bundle.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@laioutr/app-essentials-mailer'],
  runtimeConfig: {
    '@laioutr/app-essentials-mailer': {
      brand: {
        shopName: 'Example Shop',
        shopUrl: 'https://example.com',
        footerLinks: [
          { label: 'Imprint', url: 'https://example.com/imprint' },
          { label: 'Privacy', url: 'https://example.com/privacy' },
        ],
      },
      // Optional: your own mail, used only where Channels cannot take a submission.
      transport: {
        type: 'smtp',
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for port 465
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
      from: 'Shop <noreply@example.com>',
      recipient: 'legal@example.com',
    },
  },
})
```

| Key | Type | Notes |
| --- | --- | --- |
| `brand` | `{ shopName, shopUrl?, footerLinks? }` | Required. Shop name, link and footer links in the header and footer of emails sent through the own `transport` |
| `transport` | `{ type: 'smtp', host, port, secure?, auth }` (optional) | Your own SMTP server: the fallback where Channels is on, the only way where it is off |
| `from` | `string` (optional) | Sender of emails through the own `transport`. `"Display Name <addr>"` accepted |
| `recipient` | `string` (optional) | Address that receives the team's notice through the own `transport` |
| `replyToConsumer` | `boolean` (default `true`) | Through the own `transport`: the notice's reply-to is the consumer's address |
| `timeZone` | `string` (optional) | IANA time zone for dates in emails through the own `transport`. Omitted or invalid values use UTC |
| `actions.withdrawal` | `{ recipient?, from?, replyToConsumer?, consumerAck? }` (optional) | Overrides for the withdrawal, through the own `transport` only |
| `channels.enabled` | `boolean` (default `true`) | `false` sends through the own `transport` alone and never asks Laioutr Channels |
| `channels.url` | `string` (optional) | The Channels submissions endpoint. Defaults to `https://api.laioutr.cloud/channels/v1/submissions`; the environment variable `NUXT_LAIOUTR_MAILER_CHANNELS_URL` overrides it at runtime |
| `channels.clientAddress` | `'auto'`, `'cloudflare'`, `'forwarded'` or `'none'` (default `auto`) | Where the visitor's IP address is read for the per-connection submission limit. Only its SHA-256 hash is sent. `auto` reads `x-forwarded-for` on Vercel and `cf-connecting-ip` where the request came through Cloudflare, otherwise sends no key. Name a header only a proxy in front of the storefront overwrites |

So `transport`, `from` and `recipient` are optional: without them the storefront sends through Channels only. Through Channels, the recipients, the sender and the subject are the Email channel's settings in the Cockpit, and the consumer always receives the withdrawal confirmation. The `actions.withdrawal` settings, `consumerAck` included, apply to the own `transport` only.

::callout{type="info"}
Through Channels the Cockpit writes the emails in German or English: in the visitor's language where it is one of the two, and in English otherwise.
::

### Your own SMTP server

Where you configure a `transport`, you need:

| Information | Description |
| --- | --- |
| **Host** | SMTP server hostname, for example `smtp.example.com` |
| **Port** | `587` (STARTTLS, `secure: false`) or `465` (TLS from the start, `secure: true`). `25` is often blocked |
| **Username** | The SMTP login, often the full email address |
| **Password** | The SMTP password or, with Google or Microsoft 365, an app password. The regular account password usually does not work |
| **From address** | Must be allowed to send through this account |

The sending domain needs SPF, DKIM and DMARC records for the server at your DNS provider, or emails may land in spam.

Emails sent through this fallback are not in the Cockpit's delivery log and are not counted. To send through your own mailbox **and** keep the delivery log, connect the mailbox on the Email channel's **Sender** tab in the Cockpit instead: see [Sender](/cockpit/features/channels#sender).
