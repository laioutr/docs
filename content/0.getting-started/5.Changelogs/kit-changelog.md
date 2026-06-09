---
title: Kit Changelog
description: Changelog for Laioutr Kit (@laioutr-core/kit) following Keep a Changelog and Semantic Versioning.
seo:
  title: Kit Changelog | Laioutr
  description: Changelog for Laioutr Kit (@laioutr-core/kit) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/kit-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr Kit** (`@laioutr-core/kit`, the utility functions and composables for building Laioutr Apps) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> `@laioutr-core/kit` is largely a downstream consumer of `@laioutr-core/core-types` and `@laioutr-core/canonical-types`. Most of its releases contain only dependency updates and are intentionally omitted here; the entries below are the releases with developer-facing changes to Kit itself.

## [0.28.9]

### Fixed

- Fixed `useRoute()` returning stale route data in studio preview. In preview mode there is no `<NuxtPage>`, so the `page:finish` hook that syncs Nuxt's internal route ref never fired. The preview now emits `page:finish` after each navigation to keep `useRoute()` current.

## [0.7.1]

### Fixed

- Fixed missing links, added robots.txt and page SEO meta.

## [0.7.0]

### Fixed

- Fixed globbing for the `templateStrategies` folder.

## [0.6.0]

### Changed

- Replaced `globby` with `tinyglobby`.

## [0.5.1]

### Fixed

- Fixed import paths.

## [0.4.0]

### Added

- Media Library upload handling, and improved documentation generation from canonical-types.
