---
title: CLI Changelog
description: Changelog for the Laioutr CLI following Keep a Changelog and Semantic Versioning.
---

All notable changes to the **Laioutr CLI** (the `laioutr` command-line tool) will be documented in this file.

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