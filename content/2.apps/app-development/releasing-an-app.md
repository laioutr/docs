---
title: Releasing an App
description: The three steps that take an app version from your repository to a customer's storefront (npm publish, laioutr app release, deployment) and what each one does and does not change.
seo:
  title: Releasing an App
  description: The three steps that take an app version from your repository to a customer's storefront (npm publish, laioutr app release, deployment) and what each one does and does not change.
sitemap:
  loc: /apps/app-development/releasing-an-app
  lastmod: 2026-10-02
  changefreq: monthly
  priority: 1
---

You have added a [manifest](/apps/app-development/app-manifest) to your app, published a new version, and the Cockpit still shows no settings form. That is expected: publishing puts the package into the registry, but the Cockpit learns about a version only when you **release** it, and a storefront changes only when its environment is **deployed**. Each of the three steps does one thing.

```bash
npm publish                 # 1. the registry holds the version and its manifest
npx @laioutr/cli app release  # 2. the Cockpit knows the version and its settings form
# 3. a deployment builds one environment with the versions and settings chosen for it
```

| Step | Who runs it | Changes | Does not change |
| --- | --- | --- | --- |
| `npm publish` | your CI | The registry serves the new version and keeps its `laioutr.manifest.json` | Anything in the Cockpit or on a storefront |
| `laioutr app release` | your CI | The Cockpit knows the version, its peer dependencies, its channel and its settings form | Any environment's installed versions, settings or storefront |
| Deployment | the customer, or their CI | One environment's storefront | Any other environment |

## 1. Publish the package

Publish to the Laioutr registry at `npm.laioutr.cloud` as described in [Publish an organization package](/cockpit/project-settings/npm#publish-an-organization-package). Make sure `laioutr.manifest.json` is listed in `package.json` under `files`.

The settings form comes from this registry: a package published only to npmjs.org gets no form from its manifest.

At publish, the registry reads `laioutr.manifest.json` from the tarball and stores it with the version. A manifest that is not valid JSON or breaks a [validation rule](/apps/app-development/app-manifest#validation-rules) does not stop the publish; the version simply has no settings form later. A published version cannot be replaced, so a fixed manifest needs a new version.

## 2. Release the version to the Cockpit

Run `laioutr app release` in the package folder, once for every version you publish:

```bash
LAIOUTR_API_KEY=orgKey_xxx npx @laioutr/cli app release
```

```text
Publishing @laioutr-org/acme__search@1.4.0...
Published @laioutr-org/acme__search@1.4.0 (stable)
```

The command reads `name` and `version` from `package.json` and sends them to the Cockpit. The Cockpit then:

- checks that the version is published, and refuses it otherwise;
- takes the version's peer dependencies from the registry, so the install check describes what was actually published;
- assigns a channel: a pre-release version such as `1.5.0-beta.1` goes to `testing`, any other to `stable`, unless you pass `--channel`;
- takes the settings form from the `laioutr.manifest.json` the registry read for this exact version.

When the version has no valid manifest, the release still succeeds and the version keeps whatever form it had before. The CLI falls back to a `configSchema` exported from `src/module.ts`, if your module has one. Check the manifest with [`validateAppManifest`](/apps/app-development/app-manifest#validation-rules) before you publish, because the release does not report manifest problems.

Releasing does not install anything, start a build or change an environment. Running it again for the same version is safe: it updates the same record.

### The API key

Use an organization API key with the **`app:publish`** scope, created under [Organization > Settings > API keys](https://cockpit.laioutr.cloud/o/_/api-keys). The key must belong to the organization that owns the package: the organization whose slug the `@laioutr-org/<organization-slug>__<package-name>` name carries, which is the one allowed to publish it to the registry. A key of an organization the owner has granted publishing to works as well, the same rule the registry applies to `npm publish`; the app is then listed under the owner. Pass it with `--key` or the `LAIOUTR_API_KEY` environment variable.

### The first release of a third-party app

When the Cockpit has never listed your package, its first release lists it as a **private** app of your organization. A private app appears in no project's app catalogue. Its settings form appears only in environments that already include the package. To make the app available in the catalogue, contact Laioutr.

### Errors

| Status | Meaning | What to do |
| --- | --- | --- |
| `401` | The key is missing, unknown, revoked or expired. | Check `LAIOUTR_API_KEY`. |
| `403` | The key lacks the `app:publish` scope, or the app is listed publicly in the catalogue for an organization you do not publish for. | Add the scope to the key, or use a key of the owning organization or of one it granted publishing to. |
| `404` | Your organization neither owns this package nor holds a publish grant from its owner. The Cockpit gives the same answer whether the name is unknown or held by someone else. | Check `name` in `package.json`, and use a key of the owning organization, or ask its owner for a publish grant. |
| `409` | The version is not published in the registry. | Run `npm publish` first, then release again. |

### Laioutr's own apps

Apps published by Laioutr (`@laioutr-app/*`) are not released by you. Their settings forms arrive with the next catalogue sync after a version is published.

## 3. Deploy

A deployment builds **one environment** from three things:

- the app and platform versions selected for that environment in **Package Management**: a pinned version, or whatever a followed dist-tag points at when the build runs;
- the values saved for those apps in that environment's [Configuration](/cockpit/features/configuration);
- the Studio content of that environment.

A deployment never installs "the latest release" on its own. A version you released reaches an environment only when the environment is set to it, or follows a dist-tag that points at it. An environment following `latest` builds the newest version the tag points at, released or not, so release every version you publish: the Cockpit then knows the settings form of the version that environment will build.

Saving settings does not start a deployment either. Values saved in Configuration take effect with the environment's next deployment.

## In GitHub Actions

One job publishes the package and releases it. The organization API key needs the `registry:publish` and `app:publish` scopes; store it as the repository secret `LAIOUTR_API_KEY`.

```yaml [.github/workflows/release.yml]
name: Release

on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://npm.laioutr.cloud/
          scope: '@laioutr-org'

      - run: pnpm install --frozen-lockfile
        env:
          NODE_AUTH_TOKEN: ${{ secrets.LAIOUTR_API_KEY }}

      - run: pnpm build

      - name: Publish to the Laioutr registry
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.LAIOUTR_API_KEY }}

      - name: Release the version to the Cockpit
        run: npx @laioutr/cli app release
        env:
          LAIOUTR_API_KEY: ${{ secrets.LAIOUTR_API_KEY }}
```

To deploy from the same pipeline, add `laioutr deploy trigger --project <org>/<project> --environment-name <environment>` with a key that has the `project:deploy` scope. See the [CLI reference](/getting-started/next-steps/cli) for its flags.

## Troubleshooting

### The environment shows no settings for my app

- Is `laioutr.manifest.json` in the published tarball? Check with `npm pack --dry-run`.
- Does the manifest pass [`validateAppManifest`](/apps/app-development/app-manifest#validation-rules)?
- Did you run `laioutr app release` for the version the environment uses? In **Package Management**, an app whose installed version declares settings the Cockpit has not received shows a **Settings not released** badge.
- Is the environment on a version that carries the manifest? An environment pinned to an older version shows no form until it moves to the new one.

### A field is missing from the form

The form belongs to one version. Publish a new version with the field, release it, and move the environment to that version.
