---
title: NPM
description: Connect to the Laioutr npm registry — interactive browser login for developers, or an organization API key for CI.
seo:
  title: Laioutr npm registry | Cockpit | Laioutr
sitemap:
  loc: /cockpit/settings/npm
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 0.7

---

## Connecting to the Laioutr npm registry

Laioutr publishes its packages to a private npm registry at **`https://npm.laioutr.cloud`**. To install (or publish) them, point the relevant scopes at that host and authenticate.

There are two ways to authenticate — pick by who is connecting:

- **Interactive browser login** (`npm login --auth-type=web`) — the recommended path for a developer on their own machine. You approve access in Cockpit and npm writes a scoped, expiring token to your `.npmrc` automatically.
- **Organization API key** — for CI, build servers, and other unattended environments. A long-lived key you create once in Cockpit and place in the environment's `.npmrc`.

Both authenticate against your **organization** — there is no per-project npm token.

### Scopes served by the registry

Point these package scopes at `https://npm.laioutr.cloud`:

- `@laioutr-core` — internal frontend packages
- `@laioutr-app` — licensable first-party packages
- `@laioutr-org` — third-party licensed apps and integrations
- Legacy scopes preserved from the previous registry: `@laioutr`, `@datrycs`, `@laioutr-store`, `@raumschmiede-gmbh`

Any other scope (for example `@saas-ui-pro`, or unscoped packages) continues to resolve from its usual registry — leave those lines untouched.

## Option 1 — Interactive browser login (developers)

Best for your local machine. npm opens a browser, you approve the access in Cockpit, and the token is written to your `.npmrc` for you — nothing to copy and paste.

1. Map the scope to the registry and start the login. `--scope` wires `@laioutr-core → npm.laioutr.cloud` and stores the token in one step:

   ```bash
   npm login --scope=@laioutr-core --auth-type=web --registry=https://npm.laioutr.cloud/
   ```

2. npm opens Cockpit's **Authorize registry access** screen in your browser. Sign in if prompted, then confirm:
   - **Organization** — the token is bound to one organization (pick it if you belong to several).
   - **Access** — **Read / install** is selected by default. Enable **Publish** only if you need to publish packages (publish also grants read).
   - **Lifetime** — how long the token stays valid: **7, 30, or 90 days**. It expires automatically after that; just run `npm login` again to renew.

3. Approve. npm finishes the handshake and writes the token to your user `.npmrc`. You can now `npm install` the scoped packages.

If you install from more than one Laioutr scope, add the extra scope-to-registry lines to your `.npmrc` (the login above only maps the one you passed to `--scope`):

```ini
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
```

> The interactive login mints a **time-limited, organization-bound** token tied to your user. It is meant for people. For unattended environments, use an API key (Option 2) — a CI job can't complete a browser prompt.

## Option 2 — Organization API key (CI & machines)

For CI, build servers, or any environment that can't open a browser, create a long-lived **organization API key** and configure `.npmrc` by hand.

### Create an API key

1. Open **Organization → Settings → API keys**.
2. Create a key with the scopes you need:
   - **`registry:read`** — install packages (read-only).
   - **`registry:publish`** — publish packages. Publish implies read, so a publish key can also install.
3. Copy the generated `orgKey_…` value immediately — it is shown only once.

### Configure `.npmrc`

Add the scope-to-registry lines plus the auth token to your `.npmrc`. Supply the token from an environment variable rather than committing it:

```ini
@laioutr-core:registry=https://npm.laioutr.cloud/
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
//npm.laioutr.cloud/:_authToken=${LAIOUTR_NPM_TOKEN}
//npm.laioutr.cloud/:always-auth=true
```

Add the legacy scopes (`@laioutr`, `@datrycs`, `@laioutr-store`, `@raumschmiede-gmbh`) the same way if you install packages from them.

Then install as usual — for example `npm install @laioutr-core/frontend-core`. Reads require a key with `registry:read`; publishes require `registry:publish`.

## Security

Treat any registry credential like a password: **do not commit it** to git or share it in chat — inject it from a secret manager or CI secret.

- **Browser-login tokens** expire on their own (7 / 30 / 90 days). To end one early, revoke it under **Account → Security → Registry sessions**, then run `npm login` again.
- **API keys** are long-lived. To rotate one, **revoke it and issue a new one** from **Organization → Settings → API keys**, then update the token wherever it is configured.
