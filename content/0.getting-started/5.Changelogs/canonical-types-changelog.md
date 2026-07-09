---
title: Canonical Types Changelog
description: Changelog for Laioutr Canonical Types (@laioutr-core/canonical-types) following Keep a Changelog and Semantic Versioning.
seo:
  title: Canonical Types Changelog
  description: Changelog for Laioutr Canonical Types (@laioutr-core/canonical-types) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/canonical-types-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr Canonical Types** (`@laioutr-core/canonical-types`, the shared TypeScript types for apps built on the platform — canonical entities, their components, and links) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.23.0]

### Added

- **Product Variant**: New `ProductVariantEnergyLabel` entity component (`@laioutr-core/canonical-types/entity/product-variant`) defining the per-variant EU energy label shape:
  - `badge: Media` — small inline energy-class badge image (A–G).
  - `label: Media` — full-size energy label image, opened in a lightbox.
  - `title?: string` — human-readable title (e.g. "Energy class A++"), used as the alt text on the badge image. Optional: consumers fall back to a generated name or a translated default.
  - `energyClass?: string` — energy efficiency class (e.g. "A", "A++"). Free-form string, not an enum, so the type survives the EU periodically rescaling its class vocabulary (regulation 2017/1369).
  - `energyClassScaleMax?: string` / `energyClassScaleMin?: string` — the most and least efficient class on the product category's regulated scale, so a class can be interpreted against its range.
  - `eprelRegistrationNumber?: string` — identifier for the variant's entry in the EU EPREL registry.
  - `dataSheetLink?: string` — optional URL of the product information sheet / data sheet PDF.

  The component lives on `ProductVariant` (next to `gtin`, `prices`, `availability`) because each EU energy label is registered per commercial model in EPREL, keyed by the model identifier / GTIN — which is variant-level. Variants of the same product can carry different energy classes. Adapters (shopify, shopware, ambiendo, etc.) should populate this component when the underlying variant carries an EU energy label; variants without the data simply omit the component.

- **Glossary**: New `Glossary` entity with `GlossaryBase` (`slug`, `title`), `GlossaryExcerpt` (`excerpt`) and `GlossaryContent` (`content`) component tokens, exported via the new subpath `@laioutr-core/canonical-types/entity/glossary`. Query/link tokens and page types continue to live in the consuming Hygraph app (e.g. `@laioutr-org/laioutr-gmbh__corporate`) — canonical-types only owns the component shape so sections like `SectionGlossaryList` in `@laioutr-app/ui` can declare what to fetch without depending on a specific Hygraph app.

- **Location**: New canonical `Location` entity, queries and page types.
  - New entity components under `@laioutr-core/canonical-types/entity/location`: `LocationBase` (slug, name, `code`, `externalId`, `googlePlaceId`), `LocationAddress`, `LocationCoordinates`, `LocationContact` (phone, fax, email, website), `LocationOpeningHours`, `LocationMedia` (gallery `images` + optional `media`), `LocationInfo` (cover image + short teaser for list cards), `LocationContent` (rich `description` + `arrival` HTML for the detail page), `LocationAttributes` (languages, headline features, services, payment methods), `LocationStatus` (operational state + opening date) and `LocationSeo`.
  - `LocationCoordinates` carries a `geo` field of the new shared `GeoCoordinates` value type (WGS84 latitude/longitude), exported from `@laioutr-core/canonical-types/common`. `MailingAddress` and the `LocationAddress` value type also gain optional coordinates.
  - New query tokens under `@laioutr-core/canonical-types/location`: `AllLocationsQuery` (multi) and `LocationBySlug` (single).
  - New page types: `LocationDetailPage` (`/locations/:slug`) and `LocationFinderPage` (`/locations`), auto-registered via `autoload`.

## [0.22.0]

### Added

- Added content page pagetype.

### Changed

- **Breaking:** Breadcrumbs are now multi-links.

## [0.21.0]

### Added

- Added `BlogPostListing` pagetype.

### Changed

- Made `BlogPostBase.publishedAt` and `BlogPostMedia.image` optional.

## [0.20.0]

### Changed

- **Breaking:** Separated `core-types` from the `canonical-types` package.

## [0.19.1]

### Added

- Added `WellKnownSectionTag` and section tags.

## [0.19.0]

### Added

- Added `defaultLimit` to `QueryTemplate`, `RenderQueryLoadSpecSeed` and `RenderQueryLoadSpec`.

### Changed

- Made `LinkQuery` compatible with vue-router type definitions.
- **Breaking:** Renamed `ProductCanonicalMenuLink` to `ProductBreadcrumbLink`.

## [0.18.0]

### Added

- Added `ProductDefaultVariant`, `ProductAnalytics` and `ProductBrand` components.

## [0.17.0]

### Changed

- **Breaking:** `MenuItem` now has a `link` property instead of being a link itself.

## [0.16.0]

### Added

- Added types for `SearchSuggest`.

## [0.15.0]

### Changed

- Updated types for cart.

## [0.14.0]

### Added

- Added `projectSlug` to frontend-core config.

## [0.13.0]

### Added

- Introduced `HtmlFragment`.
- Added `TemplateProvider` reflection to `ReflectedQuery`.
- Added `Category` query for the `ProductListingPage` pagetype.

## [0.12.1]

### Fixed

- Fixed product-listing-page pagetype query input.

## [0.12.0]

### Added

- Shopware implementation, plus minor ui fixes and orchestr quality-of-life improvements.

## [0.10.0]

### Added

- Implemented detail variant switcher and add-to-cart toast.

## [0.9.3]

### Added

- Added the ability to define tags on sections.

## [0.9.0]

### Added

- Implemented remote `QueryTemplates`.

## [0.8.0]

### Added

- Studio Refresh compatibility.

## [earlier versions]

### Added

- Section definitions and Shopify demo preparation (`0.6.0`), migration of base components to ui-kit (`0.5.0`), and media library upload handling with documentation generation from canonical-types (`0.4.0`).

### Fixed

- Missing links, robots.txt and page SEO meta (`0.7.5`, `0.7.4`); import path fixes (`0.7.1`); section type-guard moved to frontend-core (`0.9.1`).
