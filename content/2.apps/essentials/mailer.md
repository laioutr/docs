---
title: Mailer
description: The Laioutr Mailer essentials app provides transactional email sending for Laioutr projects, powered by Nodemailer.
seo:
  title: Mailer | Laioutr
  description: Transactional email sending for Laioutr projects, powered by Nodemailer.
sitemap:
  loc: /apps/essentials/mailer
  lastmod: 2026-05-06
  changefreq: monthly
  priority: 1.0

---

The **Mailer** essentials app provides transactional email sending for Laioutr projects. It is built on top of [Nodemailer](https://nodemailer.com), the de-facto standard module for sending email from Node.js, so any transport Nodemailer supports — SMTP, SendGrid, Amazon SES, Mailgun, custom transports — can be used as the delivery backend.

Typical use cases include contact form submissions, order confirmations, password reset emails, and other transactional notifications triggered by the frontend.

Because the underlying engine is Nodemailer, the full feature set documented at [nodemailer.com](https://nodemailer.com) is available — HTML and plain-text bodies, attachments, embedded images, DKIM signing, OAuth2 authentication, and more.

## What we need from you

To configure the Mailer app, the customer provides the access details for the email account or service that should send mail on the project's behalf. In almost all cases this is an **SMTP** account; alternatively a Nodemailer-supported API transport (SendGrid, SES, Mailgun, …) can be used.

### SMTP transport (default)

| Information | Description |
|-------------|-------------|
| **Host** | SMTP server hostname, e.g. `smtp.example.com`. |
| **Port** | Usually `465` (SMTPS / implicit TLS) or `587` (STARTTLS). `25` is rarely used and often blocked. |
| **Secure / TLS** | Whether the connection is implicitly TLS (`true`, typical for port 465) or upgraded via STARTTLS (`false`, typical for port 587). |
| **Username** | The SMTP login, often the full email address. |
| **Password** | The SMTP password or, for providers like Gmail or Microsoft 365, a dedicated **app password** generated for this integration. The regular account password usually does not work. |
| **From address** | The default `From:` address used for outgoing mails (e.g. `noreply@yourdomain.com`). Must be allowed to send via the configured account. |
| **From name** | Optional display name shown next to the from address (e.g. `Your Store`). |
| **Reply-To address** | Optional address replies should be routed to (e.g. `support@yourdomain.com`). |

### API transports (optional)

Instead of SMTP, the app can use a Nodemailer API transport. In that case we need the corresponding credentials:

- **SendGrid** — API key
- **Amazon SES** — AWS access key, secret, and region
- **Mailgun** — API key and sending domain
- **Microsoft 365 / Google Workspace via OAuth2** — client ID, client secret, refresh token, and the user/mailbox to send as

### Domain / deliverability setup

For reliable delivery to inboxes (and to avoid being marked as spam), the sending domain should be set up correctly. This is configured at the DNS provider, not in the app, but the customer should plan for it:

- **SPF** record authorising the SMTP host or API provider to send on behalf of the domain.
- **DKIM** key published in DNS so outgoing mails can be signed. Most providers (SES, SendGrid, Mailgun, Google, Microsoft) generate the key — the customer adds the resulting DNS record.
- **DMARC** policy referencing SPF and DKIM, recommended for production setups.
- A confirmation that the **From address** is permitted to send via the chosen account/provider.

### Operational details

- **Rate limits** — any sending limits imposed by the provider (per second / per day), so the app can throttle accordingly.
- **Sandbox vs. production** — whether the credentials point at a sandbox (e.g. SES sandbox mode, where only verified recipients can be reached) or a production account.
- **Test recipient** — an email address we can send a test message to during onboarding to verify the setup end-to-end.

::callout{type="info"}
A detailed description of the available actions, template handling, and customization options will follow in a later iteration once the app is generally available.
::
