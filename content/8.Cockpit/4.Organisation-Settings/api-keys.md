---
title: API keys
description: Organization API keys for CLI and automation—scopes, expiry, copy once, revoke, and last used.
seo:
  title: Organization API keys | Cockpit
sitemap:
  loc: /cockpit/organisation/api-keys
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## API keys (organization)

The **API Keys** tab (`/o/{organization-slug}/api-keys`) lists **organization-scoped API keys** used to **authenticate automation** (for example **CLI** usage and **CI pipelines**). You need the **`apiKeyManagement`** permission; without it the tab is **disabled** with a tooltip.

### What API keys are for

Keys identify your automation to Laioutr **on behalf of the organization**. Typical uses:

- **CI/CD** — trigger deploys or other allowed operations from a pipeline.
- **Local or server CLI** — run authenticated commands without using your personal login session.

Each key is **scoped**: you choose which **permissions** (scopes) the key has. In the product, the available scopes are fixed set entries such as:

- **`app:publish`** — publish-related app operations (exact behavior is enforced by the Laioutr API).
- **`project:read-rc`** — read project runtime configuration where the API allows it.
- **`project:deploy`** — trigger or manage deployments where the API allows it.

You should grant **only the scopes** each integration needs.

### Key list

The table columns include:

- **Name** — label you gave the key (e.g. “CI pipeline”).
- **Key** — only a **prefix** is shown (`…` after the prefix); the full secret is **never** shown again after creation.
- **Scopes** — badges for each selected scope.
- **Last used** — timestamp when the key was last used, or **Never** if unused.
- **Expires** — expiry date, **Never** if no expiry, or an **Expired** badge when past validity.

### Create key

**Create key** opens a dialog where you set:

- **Name** — required.
- **Scopes** — **at least one** required (checkboxes for each scope).
- **Expiration** — optional: no expiry, or **30 / 60 / 90 / 365** days.

After creation, the dialog shows the **full key once** with a **warning** to **copy it now**—it will **not** be shown again. Use **Copy**, then **Done** to close.

### Revoke

Each row can **revoke** a key after a **confirmation** dialog. Revocation **cannot be undone**; automations using that key will fail until you create a new key.

### Security practices

- Store keys in **secrets** (CI variables, secret manager), not in git.
- Prefer **short expirations** for temporary work; rotate keys periodically.
- Revoke keys you no longer use or if you suspect leakage.

For **project-specific** secrets (secret key, NPM token), see **Cockpit → Settings** on the **project** settings pages, not this organization tab.
