---
title: NPM
description: Connect to the Laioutr npm registry, configure authentication, and publish organization packages.
seo:
  title: Laioutr npm registry | Cockpit | Laioutr
  description: Connect to the Laioutr npm registry, configure authentication, and publish organization packages.
sitemap:
  loc: /cockpit/settings/npm
  lastmod: 2026-07-15
  changefreq: monthly
  priority: 0.7
---

## Connecting to the Laioutr npm registry

Laioutr publishes its packages to a private npm registry at **`https://npm.laioutr.cloud`**. To install or publish them, point the relevant scopes at that host and authenticate.

There are two ways to authenticate. Pick one based on who is connecting:

- **Interactive browser login** (`npm login --registry https://npm.laioutr.cloud`) is the recommended path for a developer on their own machine. You approve access in Cockpit, and npm writes an expiring token to your `.npmrc` automatically.
- **Organization API key** is for CI, build servers, and other unattended environments. You create the long-lived key in Cockpit and place it in the environment's `.npmrc`.

Both methods authenticate against your **organization**. There is no per-project npm token.

## Option 1: Interactive browser login (developers)

Use browser login on your local machine. Run:

```bash
npm login --registry https://npm.laioutr.cloud
```

npm opens Cockpit's **Authorize npm login** screen in your browser. Sign in if prompted, then select:

- **Organization**: the organization the token belongs to. Choose one if you belong to several.
- **Access**: **Read / install** is selected by default. Enable **Publish** only when you need to publish packages.
- **Lifetime**: how long the token remains valid. Choose 7, 30, or 90 days.

Approve the login. npm will write the token to your user `~/.npmrc`.

> The interactive login creates a **time-limited, organization-bound** token tied to your user. For unattended environments, use an API key. A CI job cannot complete a browser prompt.

### Check the active token

After logging in, check which organization and token npm is using:

```bash
npm whoami --registry https://npm.laioutr.cloud
```

The command returns the identity in this format:

```text
<Organisation> / <Token Name> / <Token Prefix>
```

For example:

```text
Laioutr / Release Pipeline / orgKey_ex4mP7
```

Use this command to confirm that npm reads the expected credential from your `.npmrc`. The token must have `registry:read` access for the check to succeed.

### Configure package scopes

The login command stores the registry token, but package scopes still need to point to the Laioutr registry. Add the following scopes to your `.npmrc`:

```ini [.npmrc]
@laioutr-core:registry=https://npm.laioutr.cloud/
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
```

When using the [app-starter](/apps/app-development/app-starter), these are configured already.

## Option 2: Organization API key (CI and machines)

For CI, build servers, or any environment that can't open a browser, create a long-lived **organization API key** and configure `.npmrc` by hand.

### Create an API key

1. Open [Organization > Settings > API keys](https://cockpit.laioutr.cloud/o/_/api-keys).
2. Create a key with the scopes you need:
   - **`registry:read`**: install packages (read-only).
   - **`registry:publish`**: publish packages (read-write).
3. Copy the generated `orgKey_...` value immediately. It is shown only once.

### Configure `.npmrc`

Add the scope-to-registry lines plus the auth token to your `.npmrc`. Supply the token from an environment variable rather than committing it:

```ini [.npmrc]
@laioutr-core:registry=https://npm.laioutr.cloud/
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-store:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
//npm.laioutr.cloud/:_authToken=NPM_LAIOUTR_TOKEN
```

We recommend using a tools such as [npmrc-replace-env](https://github.com/dennzimm/npmrc-replace-env) for this task.

The [app-starter](/apps/app-development/app-starter) ships this as a committed `.npmrc.config` and renders it in CI with `sed`. See [Publishing](/apps/app-development/publishing#registry-access-in-ci) for that workflow.

## Publish an organization package

Third-party apps use this package name format:

```text
@laioutr-org/<organization-slug>__<package-name>
```

`@laioutr-org` is the shared scope. The text before the first `__` must match the read-only slug in [Organization general settings](https://cockpit.laioutr.cloud/o/_); the text after it identifies the package. For example, `@laioutr-org/laioutr-gmbh__storefront-tools` belongs to the `laioutr-gmbh` organization and has the package name `storefront-tools`.

Your token can publish under its own organization slug. Contact Laioutr if another organization, such as a central build organization, needs permission to publish on the owner's behalf. Package visibility is managed separately through the Laioutr App Store and access grants.

Configure the name and registry in `package.json`:

```json [package.json]
{
  "name": "@laioutr-org/laioutr-gmbh__storefront-tools",
  "version": "1.1.3",
  "files": ["dist", "CHANGELOG.md"],
  "publishConfig": {
    "registry": "https://npm.laioutr.cloud/"
  }
}
```

The package must not set `"private": true`. Use a token with `registry:publish` access, preview the release, then publish it:

```bash
pnpm publish --dry-run
pnpm publish
```

Verify the published version:

```bash
pnpm view @laioutr-org/laioutr-gmbh__storefront-tools version
```

A package name and version can only be published once. Increment `version` before publishing another release.

## Security

Treat any registry credential like a password. **Do not commit it** to git or share it in chat. Inject it from a secret manager or CI secret.

- **Browser-login tokens** expire on their own (7 / 30 / 90 days). To end one early, revoke it under [Account > Security > Registry sessions](https://cockpit.laioutr.cloud/account/security), then run `npm login` again.
- **API keys** are long-lived. To rotate one, revoke it and issue a new one from [Organization > Settings > API keys](https://cockpit.laioutr.cloud/o/_/api-keys), then update the token wherever it is configured.
