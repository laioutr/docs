---
title: UI Changelog
description: Changelog for Laioutr UI and UI Kit following Keep a Changelog and Semantic Versioning.
---

All notable changes to **Laioutr UI**, **UI Kit**, and related component libraries will be documented in this file.

## [1.32.2]

### Fixed

- **UI**: Fixed CSS layer order in Studio preview to ensure correct cascade and style isolation.

## [1.31.4]

### Fixed

- **UI App**: Added missing `useResolvedLink` import in `SectionBreadcrumbs`.

## [1.31.0]

### Added

- **UI**: Market-domain locale support for **LanguageSwitcher** — the switcher now uses market domains for locale data.
- **UI**: Adopted **link-fields** throughout blocks and sections, including updated CTA button link fields.

### Changed

- **UI App**: LanguageSwitcher uses navigation for locale switching instead of full page reloads.
- UI, UI Kit & UI App: Dependency updates aligned with Frontend Core / Core Types `0.28.0`.

### Fixed

- **UI**: SSR hydration errors.
- **UI App**: Fixed navigation-based locale switching in LanguageSwitcher.

## [1.30.0]

### Added

- **UI Kit**: New i18n formatters:
  - **$timespan** formatter for Timespan objects (date/datetime ranges, locale-aware).
  - **$duration** formatter for ISO 8601 duration strings (uses `Intl.DurationFormat` when available).
  - **$money** and **$measurement** moved from frontend-core to UI Kit (template globals and auto-imports unchanged).
- **UI**: Added missing section thumbnails.
- **UI**: Table formatting in RichContent component.

### Changed

- **UI**: Component CSS moved to `lui-components` layer for better encapsulation and cascade control.
- UI Kit & UI: Dependency updates aligned with multi-market frontend and i18n changes.

### Fixed

- **UI**: Input styling and desktop header close button.
- **UI**: Adjusted ThemeSwitcher meta requirements and import.

## [1.29.2]

### Changed

- UI App: Correctly merge theme images so theme-specific assets are combined as expected.
- UI Kit & UI: Dependency bumps to align tokens and core packages with the 1.29.2 / 0.27.2 release line.

## [1.29.1]

### Changed

- UI App: Do not show the theme switcher when it is not enabled in configuration.
- UI: Dependency updates to keep UI Kit and core packages in sync.

## [1.29.0]

### Added

- UI Kit & UI App: Introduced **theme switcher support** so projects can offer multiple visual themes.

### Changed

- UI: Updated dependencies to the corresponding Frontend Core, Orchestr, Kit, Core Types and UI Kit versions (`0.27.2` / `1.29.0`).

## [1.28.x]

### Added

- UI (1.28.0): Multiple UX and layout improvements:
  - Fixed links in BasicHeader and LogoBanner.
  - Ensured SectionLogoPresentation respects link fields.
  - Fixed PricingTable width.
  - Improved mobile menu hierarchy in `SectionBasicHeader`.
- UI App (1.28.0): Same header and pricing fixes exposed via the app.

### Changed

- UI (1.28.1): Show filter-bar sorting only when sortings are available and make the `BuyBoxStockInfo` icon optional.
- UI & UI Kit: Aligned dependencies with Frontend Core/Orchestr `0.27.x` and Core Types `0.27.0` / `0.27.1`.

## [1.27.x]

### Added

- UI App (1.27.0): New **Iframe Block** for embedding external content.

### Changed

- UI Kit (1.27.0): Fixed **HeroSlider** media loading eagerness to avoid unnecessary eager loads.
- UI (1.27.0): Pulled in the HeroSlider fix and updated dependencies to the `0.26.1` frontend/orchestr line.
- UI App (1.27.0): Included the HeroSlider fix and dependency updates.

## [1.26.x]

### Added

- UI (1.26.0) & UI App (1.26.0): Implemented a **Breadcrumb section** and adopted the canonical `BreadcrumbItem` type (UI App 1.26.1) for consistent breadcrumb data.

### Changed

- UI & UI Kit: Updated dependencies to Core Types / Canonical Types / Frontend Core / Orchestr `0.26.0`.
- UI App (1.26.1): Used `BreadcrumbItem` canonical type in `SectionBreadcrumbs` for better type safety and consistency.

## [1.25.x]

### Added

- UI (1.25.0) & UI App (1.25.0): New sections: **Error 404**, **Pricing Plans**, and **Pricing Table** for richer marketing and error pages.

### Changed

- UI, UI Kit & UI App: Dependencies aligned to the `0.25.0` core release line.

## [1.24.x]

### Added

- UI (1.24.0):
  - Support for **multiple CTAs** in `BasicHeader`.
  - Support for calling PDPs with **variant option values** for more precise product links.
- UI Kit (1.24.0): Support for multiple CTAs and variant-aware links where relevant.

### Fixed

- UI (1.24.3): Fixed a **hydration error** that could break the page when Header components with submenus were used.
- UI (1.24.2): Fixed **FlexibleContentSliderSection** breaking when `actionButton` is missing.
- UI (1.24.1): Fixed errors in `SectionBlogSlider` and `SectionFlexibleContentSlider` when a button is missing; added **WellKnownSectionTag** and section tags.

### Changed

- UI, UI Kit & UI App: Multiple dependency updates to match Canonical Types, Core Types, Frontend Core and Orchestr `0.24.x` and `0.23.1`.

## [1.23.0]

### Added

- UI: Added missing **testimonial sections** for richer marketing and social proof content.

## [1.22.0]

### Added

- UI: New **ProductShowcaseSlider** section and several layout and visual bug fixes:
  - Footer width and background fixes.
  - Two-row layout fixes for `LogoSlider`.
  - Minor z-index and color fixes for `InpageNavigation`.

## [1.21.x – 1.20.x]

### Added

- UI (1.21.0): Autosuggest in `ShopHeader` on mobile.
- UI Kit (1.20.0): Implemented **SearchOverlay** with real data integration.

### Changed

- UI & UI Kit: Multiple minor fixes (section tweaks, link reference case-insensitivity, variant query parameter support) and alignment with Frontend Core / Orchestr / Canonical Types `0.22.x` and `0.21.x`.

## [1.19.x and earlier]

### Added

- UI Kit:
  - **RichContent**: Support for `HtmlFragment` props.
  - A basic **strawberry-field theme** and additional theming improvements.
  - New filters and detail variant switcher across various components (e.g. filter bar, detail variant switcher, add-to-cart toast).
- UI:
  - A growing library of sections (navigation, marketing, ecommerce, blog, subscription) built on top of the UI Kit.
- UI App:
  - Packaging of UI sections and blocks as a Laioutr app so they can be installed and versioned independently of the core frontend.

### Fixed

- UI Kit: Prevented frontend crashes when `Media` components are missing props and worked around broken `nuxt/image` provider URLs.
- UI & UI Kit: Numerous minor fixes across components and sections as the design system and UI surface matured.