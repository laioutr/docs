---
title: Publishing
description: Release a Laioutr app with Changesets, publish it to npmjs.org with npm trusted publishing, and set up the CI it needs.
seo:
  title: Publishing a Laioutr app | App Development | Laioutr
  description: Release a Laioutr app with Changesets, publish it to npmjs.org with npm trusted publishing, and set up the CI it needs.
sitemap:
  loc: /apps/app-development/publishing
  lastmod: 2026-08-07
  changefreq: monthly
  priority: 0.8
---

## Overview

Public Laioutr apps release through [Changesets](https://github.com/changesets/changesets) and
publish to npmjs.org using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers). CI
holds no npm token, and every published version carries a provenance attestation linking it to the
commit and workflow that built it.

The day-to-day loop is short:

1. Run `pnpm changeset` and describe your change. Commit the generated file with your work.
2. Merge your pull request.
3. The release workflow opens a **chore: release** pull request collecting every pending changeset.
4. Merge that pull request. It builds and publishes to npm.

Publishing a **private** app to `npm.laioutr.cloud` instead is a different flow — see
[Publish an organization package](/cockpit/project-settings/npm#publish-an-organization-package).

## Repository setup

### Secrets

Two repository secrets are required.

| Secret | Purpose |
| --- | --- |
| `NPM_LAIOUTR_TOKEN` | Read access to `npm.laioutr.cloud` so CI can install `@laioutr-core/*` and `@laioutr-app/*`. Create it as an [organization API key](/cockpit/project-settings/npm#create-an-api-key) with `registry:read`. |
| `RELEASE_TOKEN` | Lets the release workflow open a pull request that CI will actually build. |

`RELEASE_TOKEN` is a fine-grained personal access token owned by the **organization**, scoped to the
one repository, with exactly two permissions:

- **Contents**: read and write
- **Pull requests**: read and write

::caution
A pull request opened with the default `GITHUB_TOKEN` cannot trigger further workflow runs — GitHub
blocks that to prevent loops. Without `RELEASE_TOKEN` the release pull request arrives with **zero**
checks and can never satisfy a required-status branch protection rule, so it can only be merged by
an administrator override.
::

::note
Fine-grained tokens expire after at most a year, and releases then fail with a permissions error that
does not obviously point at the token. For a fleet of app repositories, a GitHub App via
[`actions/create-github-app-token`](https://github.com/actions/create-github-app-token) avoids the
expiry entirely.
::

### Registry access in CI

`.npmrc` is gitignored, so CI renders it from the committed `.npmrc.config` template:

```yaml [.github/workflows/ci.yml]
- name: Create .npmrc from template
  env:
    NPM_LAIOUTR_TOKEN: ${{ secrets.NPM_LAIOUTR_TOKEN }}
  run: sed "s|NPM_LAIOUTR_TOKEN|${NPM_LAIOUTR_TOKEN}|" .npmrc.config > .npmrc
```

The template carries the placeholder verbatim:

```ini [.npmrc.config]
shamefully-hoist=true
strict-peer-dependencies=false

registry=https://registry.npmjs.org
//npm.laioutr.cloud/:_authToken="NPM_LAIOUTR_TOKEN"
@laioutr-core:registry=https://npm.laioutr.cloud/
@laioutr-app:registry=https://npm.laioutr.cloud/
@laioutr-store:registry=https://npm.laioutr.cloud/
@laioutr-org:registry=https://npm.laioutr.cloud/
```

Note the explicit `registry=https://registry.npmjs.org`. The `@laioutr` scope is deliberately **not**
mapped to `npm.laioutr.cloud`, so public app packages resolve and publish to npmjs.org.

### Node version

::warning
npm trusted publishing requires **npm 11.5.1 or newer**. Node 22 ships npm 10 and cannot mint a
provenance token — the publish fails. Run releases on **Node 24**, and keep `.nvmrc` in step so local
development, CI and release all agree.
::

`engines.node` can still declare a lower floor such as `>=22.12.0`; that constrains consumers of the
package, not the machine that builds it.

### package.json

```json [package.json]
{
  "name": "@laioutr/app-example",
  "license": "MIT",
  "packageManager": "pnpm@10.15.0",
  "publishConfig": {
    "access": "public",
    "provenance": true
  },
  "scripts": {
    "prepack": "nuxt-module-build build",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm run prepack && changeset publish"
  }
}
```

`packageManager` is the single source of truth for the pnpm version. Pinning it in the workflow
instead lets a local install and CI drift onto different versions and rewrite the lockfile against
each other.

::note
Setting `packageManager` also switches on `actions/setup-node`'s dependency cache, which fails the
step unless `pnpm-lock.yaml` is committed. Commit the lockfile.
::

## The first publish

A trusted publisher is configured **on a package that already exists**, so the very first version has
to be published by hand before CI can take over.

::steps

### Build and publish once, locally

```bash
pnpm prepack
npm publish --access public --no-provenance
```

`--no-provenance` is required. `publishConfig.provenance` asks npm to generate a provenance
attestation, which needs a CI provider with OIDC; from a local shell npm resolves `provider: null`
and refuses with `EUSAGE`.

### Wait for the registry to catch up

A brand-new package can return `404` from the registry for a few minutes after a successful publish.
That is replication lag, not a failed publish — `npm view` and the packument URL will both lie about
it. Check again before re-running anything.

### Configure the trusted publisher

On the package's settings page on npmjs.com, add a GitHub Actions trusted publisher pointing at the
repository and the `release.yml` workflow.

### Release normally from then on

Merge a changeset, then merge the release pull request. The publish is tokenless and the tarball
carries provenance.

::

## Writing a changeset

A changeset is a changelog entry, and its audience is the **package consumer** — not the contributor
and not a reviewer. Build internals, refactor lists and type-system mechanics belong in the commit
message instead. A purely internal change needs no changeset at all.

````md [.changeset/quiet-pandas-wave.md]
---
'@laioutr/app-example': minor
---

**Breaking:** the `endpoint` option now takes the Store API base URL rather than the storefront
origin, so the app no longer guesses the path.

```diff
 export default defineNuxtConfig({
   '@laioutr/app-example': {
-    endpoint: 'https://shop.example.com',
+    endpoint: 'https://shop.example.com/store-api',
   },
 });
```
````

Two rules worth internalising:

- **Breaking changes lead with a bold `**Breaking:**` prefix and a before/after snippet.** The version
  bump alone does not tell a reader what to change.
- **Every file in `.changeset/` is unreleased and ships as one changelog section**, in arbitrary
  order. A changeset therefore describes the feature *as it will be at release*, not the increment
  one pull request added. If an entry for the same feature already exists, rewrite it rather than
  adding a sibling that only makes sense if you read the first one.

## Verifying a release

```bash
npm view @laioutr/app-example version
```

To confirm provenance actually attached, check the published version's `dist.attestations`:

```bash
npm view @laioutr/app-example@latest dist.attestations
```

A published release shows a `provenance` entry with the SLSA predicate type. If it is missing, the
publish fell back to an ordinary token-authenticated path.

## Related documentation

- [App Starter](/apps/app-development/app-starter) — the template these workflows ship in.
- [npm registry](/cockpit/project-settings/npm) — authenticating to `npm.laioutr.cloud`, and
  publishing private organization packages.
- [Platform Dependencies](/apps/app-development/platform-dependencies) — which Laioutr packages
  belong in `peerDependencies`.
