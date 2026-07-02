---
title: NPM
description: Connect to the Laioutr npm registry with an organization API key and a scoped .npmrc.
seo:
  title: Laioutr npm registry | Cockpit | Laioutr
sitemap:
  loc: /cockpit/settings/npm
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 0.7

---

## Connecting to the Laioutr npm registry

Laioutr publishes its packages to a private npm registry at **`https://npm.laioutr.cloud`**. To install (or publish) them, point the relevant scopes at that host and authenticate with an **organization API key**.

There is no per-project npm token. Registry access is authenticated with an **organization API key**, created in **Organization → Settings → API keys** — not on the project settings page.

### Scopes served by the registry

Point these package scopes at `https://npm.laioutr.cloud`:

- `@laioutr-core` — internal frontend packages
- `@laioutr-app` — licensable first-party packages
- `@laioutr-org` — third-party licensed apps and integrations
- Legacy scopes preserved from the previous registry: `@laioutr`, `@datrycs`, `@laioutr-store`, `@raumschmiede-gmbh`

Any other scope (for example `@saas-ui-pro`, or unscoped packages) continues to resolve from its usual registry — leave those lines untouched.

### Create an API key

1. Open **Organization → Settings → API keys**.
2. Create a key with the scopes you need:
   - **`registry:read`** — install packages (read-only).
   - **`registry:publish`** — publish packages. Publish implies read, so a publish key can also install.
3. Copy the generated `orgKey_…` value immediately — it is shown only once.

### Configure `.npmrc`

Add the scope-to-registry lines plus the auth token to your `.npmrc` (the token is best supplied from an environment variable rather than committed):

```ini
@laioutr-core:registry=https://npm.laioutr.cloud/
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
//npm.laioutr.cloud/:_authToken=${LAIOUTR_NPM_TOKEN}
//npm.laioutr.cloud/:always-auth=true
```

Add the legacy scopes (`@laioutr`, `@datrycs`, `@laioutr-store`, `@raumschmiede-gmbh`) the same way if you install packages from them.

Then install as usual — for example `npm install @laioutr-core/frontend-core`. Reads require a key with `registry:read`; publishes require `registry:publish`.

### Security

Treat the API key like a password: **do not commit it** to git or share it in chat — inject it from a secret manager or CI secret. To rotate a key, **revoke it and issue a new one** from the same **Organization → Settings → API keys** page, then update the token wherever it is configured.
