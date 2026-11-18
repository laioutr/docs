---
title: Assetr Changelog
description: Changelog for Assetr, following Keep a Changelog.
seo:
  title: Assetr Changelog
  description: Changelog for Assetr, following Keep a Changelog.
sitemap:
  loc: /getting-started/changelogs/assetr-changelog
  lastmod: 2026-11-17
  changefreq: weekly
  priority: 1.0

---

All notable changes to **Assetr** are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2026-11-17]

### Added

- **URL-Mapping**: URL mapping imports that move files can be stopped and resumed, each behind a confirmation; a stopped import shows its progress and offers Retry.

### Changed

- **URL-Mapping**: A replacing URL mapping import says on its Check step and in its Start confirmation that each original takes the old file's folder and name, and that the old file stays in the library next to it.

## [2026-11-16]

### Added

- **URL-Mapping**: URL mapping's Configuration offers "Assets not published on Dynamic Media": skip them (the default) or bring their originals. The Check says how many were skipped and links to the setting.
- **URL-Mapping**: URL mapping's AEM card offers "Only replace the originals of the files already migrated", ticked once the project has migrated files.
- **URL-Mapping**: Where the platform allows it, URL mapping's Overview lists originals the library does not take with what they risk, copies them into the project's archive on request, and lets each copy be downloaded or deleted.

## [2026-11-13]

### Added

- **URL-Mapping**: URL mapping's Problems offers "Take originals from AEM", which looks up each failed old URL's file in AEM and opens an import of the originals found.
- **URL-Mapping**: URL mapping's Log shows each AEM reading's start, failures, missing originals, end and stop.
- **URL-Mapping**: With more than one import, URL mapping's Overview shows all of the project's old URLs and a table of every import with what its own run moved and failed.

### Changed

- **URL-Mapping**: URL mapping asks for confirmation before Read assets from AEM, Start migration, Retry, Mark as gone and requests to the Laioutr team.

### Fixed

- **URL-Mapping**: An AEM import that is still reading shows on URL mapping's Overview and Import.
- **URL-Mapping**: A finished AEM import no longer shows "Checking" with nothing read.

## [2026-11-12]

### Added

- **URL-Mapping**: URL mapping can import from AEM through the AEM connector app on the project's storefront, with no CSV.
- **URL-Mapping**: A URL mapping host can fit images asked without a preset to a default size, give files that are no resizable image (PDFs, SVGs) their own pattern for old paths, and clean file names as Adobe Scene7 named assets.

## [2026-11-11]

### Added

- **URL-Mapping**: URL mapping's Configuration has "Old paths for new files", with a live preview per host, and a Reindex card.
- **URL-Mapping**: A URL mapping host can add a query to every old URL a move fetches, and can pad presets to their box in white.

### Changed

- **URL-Mapping**: URL mapping answers old URLs by redirect; rewrite is offered only as a request to the Laioutr team.

## [2026-11-09]

### Added

- Assetr metadata can be exported as a CSV, chosen by fields and date range.

## [2026-11-06]

### Added

- Move old asset URLs into the media library from a CSV; old addresses keep working.

## [2026-10-23]

### Added

- Select a range of assets in Assetr with Shift+click.

## [2026-10-21]

### Added

- A project's dashboard shows how many images it stores and its image traffic this month.

## [2026-10-20]

### Added

- Cloud Image CDN licenses set how many images a project can store.

## [2026-10-02]

### Fixed

- The delete dialog now names content entries by their title.
