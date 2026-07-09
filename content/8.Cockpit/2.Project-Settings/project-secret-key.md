---
title: Project secret key
description: The project secret key authenticates requests to your Laioutr project; view it masked on project settings.
seo:
  title: Project secret key | Cockpit
sitemap:
  loc: /cockpit/settings/project-secret-key
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.7

---

## Project secret key

On **Project → Settings**, the **Project Secret Key** block displays the **secret key** that **authenticates requests to the project** (for APIs, tooling, or integrations that require project-level authentication—depending on your setup).

### How to use it in the UI

- The key appears in a **read-only** input, **masked** by default.
- Use **Show** / **Hide** to toggle visibility while you copy it into a secure location.

### Security

The same settings page reminds you to **keep secrets safe** and not share them. Anyone with the secret key may be able to act on behalf of the project within the scope allowed by your integration—store it in a **secret manager** or environment variables, not in source control.

If you believe a key has been compromised, follow your security process and contact **Laioutr support** for rotation or remediation options available for your plan.
