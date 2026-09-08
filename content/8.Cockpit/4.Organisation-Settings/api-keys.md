---
title: API keys
description: Organization and restricted API keys—key types, scopes, expiry, copy once, revoke, and last used.
seo:
  title: Organization API keys | Cockpit
sitemap:
  loc: /cockpit/organisation/api-keys
  lastmod: 2026-09-08
  changefreq: monthly
  priority: 0.75

---

## API keys (organization)

The **API Keys** tab (`/o/{organization-slug}/api-keys`) lists every API key in the organization. You need the **`apiKeyManagement`** permission; without it the tab is **disabled** with a tooltip.

### Two key types

::since-version{version="0.51.0" packages="@laioutr-core/frontend-core" changelog="frontend"}
::

The **Key type** you pick when creating a key decides what it can reach. The two carry disjoint scopes, so a key cannot be both.

| | Organization | Restricted |
| --- | --- | --- |
| Prefix | `orgKey_` | `rstk_` |
| Bound to | the organization | one project you choose |
| Scopes | the server scopes below | `media:read`, `media:write` |
| Reaches | the Laioutr API, the CLI, the npm registry | the storefront's `/api/public/*` routes |
| For | automation on a machine you control | an app outside Laioutr |

A restricted key is the credential to hand to a client you do not control — an internal tool, a partner's page, a desktop app. It cannot read your project configuration and cannot deploy; it reads or writes assets on the one project it is bound to. See [Assets](/data-api/management-api/assets) for the routes it opens, and note that the project must list an allowed origin before those routes answer at all.

The same page shows the server URL for [Laioutr MCP](/agent-api/laioutr-mcp) when Laioutr has enabled the private alpha for your organization. Laioutr MCP uses OAuth with your user account, not an organization API key.

### What API keys are for

An organization key identifies your automation to Laioutr **on behalf of the organization**. Typical uses:

- **CI/CD** — trigger deploys or other allowed operations from a pipeline.
- **Local or server CLI** — run authenticated commands without using your personal login session.

A restricted key identifies a client that is **not** yours to run — it authorizes asset access on one project and nothing more.

Each key is **scoped**: you choose which **permissions** (scopes) the key has. The scope list offered depends on the key type.

Organization scopes:

- **`app:publish`** — publish-related app operations (exact behavior is enforced by the Laioutr API).
- **`project:read-rc`** — read project runtime configuration where the API allows it.
- **`project:deploy`** — trigger or manage deployments where the API allows it.
- **`registry:publish`**, **`registry:read`** — npm registry access.

Restricted scopes:

- **`media:read`** — browse and search the project's connected media libraries.
- **`media:write`** — upload assets to them.

You should grant **only the scopes** each integration needs. The media scopes are not offered for an organization key, and the server scopes are not offered for a restricted key.

### Key list

The table columns include:

- **Name** — label you gave the key (e.g. “CI pipeline”).
- **Type** — **Machine** or **Web login** for an organization key, **Restricted** for a restricted one, with the project it is bound to shown underneath.
- **Key** — only a **prefix** is shown (`…` after the prefix); the full secret is **never** shown again after creation.
- **Scopes** — badges for each selected scope.
- **Last used** — timestamp when the key was last used, or **Never** if unused.
- **Expires** — expiry date, **Never** if no expiry, or an **Expired** badge when past validity.

### Create key

**Create key** opens a dialog where you set:

- **Key type** — **Organization** or **Restricted**.
- **Project** — required for a restricted key, and absent otherwise.
- **Name** — required.
- **Scopes** — **at least one** required (checkboxes), narrowed to the scopes the key type allows.
- **Expiration** — optional: no expiry, or **30 / 60 / 90 / 365** days.

After creation, the dialog shows the **full key once** with a **warning** to **copy it now**—it will **not** be shown again. Use **Copy**, then **Done** to close.

### Revoke

Each row can **revoke** a key after a **confirmation** dialog. Revocation **cannot be undone**; automations using that key will fail until you create a new key.

### Security practices

- Store keys in **secrets** (CI variables, secret manager), not in git.
- Prefer **short expirations** for temporary work; rotate keys periodically.
- Revoke keys you no longer use or if you suspect leakage.
- For a restricted key that ships to a browser, treat the value as **published** and grant `media:read` alone unless the client genuinely uploads. There is no rate limiting on those routes, so **revocation is the control** — the **Last used** column is how you spot a key being used by something you did not expect.
- Do not force an expiry on a restricted key held by a client with no backend: nothing there can renew it, so the expiry only schedules an outage.

For **project-specific** secrets (secret key, NPM token), see **Cockpit → Settings** on the **project** settings pages, not this organization tab. A restricted key is bound to a project but is created and revoked here, beside every other key.

The origins allowed to call a project's public routes are configured per project, under **Allowed origins** in its settings — see [Assets](/data-api/management-api/assets).
