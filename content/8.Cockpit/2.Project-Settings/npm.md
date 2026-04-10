---
title: NPM
description: Read-only NPM token on the project settings page for authenticating to the Laioutr npm registry.
seo:
  title: NPM registry token | Cockpit | Laioutr
sitemap:
  loc: /cockpit/settings/npm
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.7

---

## NPM token (project settings)

On **Project → Settings**, the **NPM Token** section shows a **read-only token** used to **log in to the Laioutr npm registry** when you install private packages from Laioutr (for example in local development or CI).

### How to use it in the UI

- The value is displayed in a **masked** field by default.
- Click **Show** to reveal the token temporarily, or **Hide** to mask it again.
- Copy the value from the field when you need to configure `.npmrc` or your package manager (follow your team’s internal guide for exact `npm login` / token configuration).

### Security

Treat the token like a password: **do not commit it** to git or share it in chat. The settings page shows a **warning** reminding you to keep project secrets safe. If a token is exposed, rotate it according to your organization’s process and Laioutr support guidance.

This screen only explains the **purpose** of the field as implemented in Cockpit; for CLI and registry details, see developer documentation for the **Laioutr npm registry** and your frontend toolchain.
