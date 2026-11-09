---
title: CLI Changelog
description: Changelog for the Laioutr CLI following Keep a Changelog and Semantic Versioning.
seo:
  title: CLI Changelog
  description: Changelog for the Laioutr CLI following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/cli-changelog
  lastmod: 2026-05-12
  changefreq: monthly
  priority: 1.0

---

All notable changes to the **Laioutr CLI** (the `laioutr` command-line tool) will be documented in this file.

## [0.6.1] - 2026-11-04

### Patch Changes

- `laioutr app release` prints what the Cockpit warns about, such as a version npmjs does not serve yet. The command still succeeds, because the version is recorded.

- When the Cockpit refuses a request, `laioutr` commands say why, such as "App does not belong to your organization", instead of a generic message that could report it as failed authentication. Server errors stay generic.

## [0.6.0] - 2026-11-03

### Minor Changes

- `laioutr app release` sends the app's `laioutr.manifest.json`, so an app published on npmjs can offer a settings form in the Cockpit. The command fails when the manifest is invalid, or when the manifest declares settings and the Cockpit did not store a form from it.

## [0.5.0] - 2026-09-30

### Minor Changes

- `laioutr deploy trigger` deploys a chosen project environment with `--environment-name` (`-e`, or `ENVIRONMENT_NAME`). Without it, `main` is deployed as before, so a workflow on a staging branch can now deploy `staging` instead of production.

## [0.4.1] - 2026-07-21

### Patch Changes

- Follow CLI output conventions for deployment logs, add actionable timeout-aware HTTP errors and a versioned API user agent, and introduce kebab-case flags with deprecated camelCase aliases.

## [0.4.0]

### Added

- CLI: New `laioutr app release` command for publishing app releases via the Cockpit API (uses API key authentication).

### Fixed

- CLI: `--project` flag now accepts inputs that include a `/p/` segment (e.g. when copy-pasted from a Cockpit URL) — the prefix is stripped before splitting the organization and project slugs. Failed `fetch-rc` calls also include the HTTP status text in the error message for easier debugging.

## [0.3.0] – 2025-11-25

### Added

- CLI: Restructured RC commands so `project fetch-rc` becomes `rc fetch`, and introduced a dedicated `rc update` command to pull the latest project configuration into an existing `laioutrrc.json`.

## [0.2.1] – 2025-09-11

### Added

- CLI: Improved `fetch-rc` usage to make fetching the latest project configuration more convenient for day-to-day workflows.

### Changed

- CLI: Updated README and documentation as part of the `0.2.1` release to better explain available commands and setup.

## [0.2.0] – 2025-06–2025-09 (aggregated)

### Added

- CLI: Introduced initial **RC commands** for fetching and updating project configurations (`laioutrrc`) from Studio:
  - Command(s) to **fetch** the current RC from your Cockpit project.
  - Command(s) to **push/update** RC back to the project or CI pipeline.

### Changed

- Repo / CLI:
  - Migration of the repository to **Zod v4**, ensuring consistent validation across CLI and core packages.
  - Adoption of a new publishing workflow via **changesets**; the first changeset-based publish for the CLI and related packages.
  - Nuxt version updates (including downgrade to `3.12.4` and later update to `3.16.2`) to keep the CLI and its dev environment in sync with the rest of the monorepo.
  - Pinning of dependency versions across packages to improve reproducibility of CLI builds and reduce update drift.

## [0.1.x and earlier] – 2024 and before

### Added

- Initial versions of the **Laioutr CLI** under `apps/cli`, providing:
  - Basic project scaffolding and setup helpers for Laioutr frontends and apps.
  - Commands to bootstrap a local development environment (install, prepare, run playgrounds).
  - Early support for interacting with project configuration files and integrating with Studio.

### Changed

- Iterative improvements to CLI UX, logging and error messages, aligning it with the rest of the toolchain and preparing for public adoption.