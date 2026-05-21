---
title: UI Changelog
description: Changelog for Laioutr UI and UI Kit following Keep a Changelog and Semantic Versioning.
seo:
  title: UI Changelog | Laioutr
  description: Changelog for Laioutr UI and UI Kit following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-changelog
  lastmod: 2026-05-21
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI**, **UI Kit**, and related component libraries will be documented in this file.

## [2.2.0]

### Added

- **UI App**: `SectionBannerBasic`, `SectionBannerShowcase`, and `SectionBannerIntegrated` now expose `margin` and `padding` in Design → Layout (via the shared `marginField` / `paddingField` presets) and `background` + `customBackground` in Design → Styling. Editors can pick `none` / `pale` / `solid` / `default` / `custom`. Each section now wraps its banner in a `<Backdrop>` that forwards the resolved background, block margin, inner padding, and container style — replacing the legacy `class="{ container: ... }"` workaround. Mirrors the `SectionContainer` background-handling pattern.
- **UI App**: Studio block-picker previews (`previewSrc`) added for 31 blocks plus 2 refreshes — including `BlockAccordion`, `BlockBannerBasic` / `BlockBannerIntegrated` / `BlockBannerShowcase`, `BlockCategoryCard`, `BlockFilterBar`, `BlockFooterMenu`, `BlockHeroSliderSlide`, `BlockIframe`, `BlockMegaMenu`, `BlockMenuBasic`, `BlockMenuSideBySide`, `BlockMobileMenuBasic` / `BlockMobileMenuShop`, `BlockPagination`, `BlockPersonaQuote`, `BlockPlanCard`, the `BlockProductDetail*` family, `BlockProductsListing`, `BlockSocialShare`, `BlockText`, and `BlockUspBannerItem`. Editors browsing the block picker now see a representative illustration for each placeable element.
- **UI App**: New per-CTA `size` selector (`xs` / `s` / `m` / `l`, default `m`) across every section and block that surfaces a button — exposed via `buttonFields` and a new `buttonSizeOptions` shared field (mirrors `buttonVariantOptions`). The banner family, product/category/content sliders, hero slider, header, page-not-found, plan-card slider, and the corresponding standalone blocks all respect editor-chosen sizes. `PlanCard` exposes new optional `ctaVariant` / `ctaSize` props; `SwiperChrome.buttons[]` accepts `size?: ButtonSize`.
- **UI App**: Heading and subline HTML-element selectors now live directly next to the field on every section and block with configurable text, via the existing `as: 'style'` decorator popup. Newly available on 13 sections (`SectionBannerBasic`, `SectionBannerShowcase`, `SectionBannerIntegrated`, `SectionBrandHero`, `SectionCategoryCardSlider`, `SectionCategoryCardGrid`, `SectionContentGrid`, `SectionContentSlider`, `SectionEditorialGrid`, `SectionLogoGrid`, `SectionLogoSlider`, `SectionNewsletterRegistration`, `SectionPageHero`, `SectionPageNotFound`) and 7 blocks (`BlockBannerBasic`, `BlockBannerShowcase`, `BlockBannerIntegrated`, `BlockCard`, `BlockHeroSliderSlide`, `BlockProductDetailVariantSelectionConfigurator`, `BlockText`). Heading options: `H1`–`H6` / `DIV`; Subline options: `P` / `H1`–`H6` / `DIV`. Section defaults: heading → `h2`, subline → `div`. Block defaults: heading → `h3`, subline → `h4`.
- **UI App**: `BlockHeroSliderSlide` exposes per-element text-shadow controls (`captionVariant.textShadow`, `headingStyle.textShadow`, `sublineStyle.textShadow`) with `none` / `soft` / `strong` options (default `none`), plus per-slide heading/subline size controls (`headingStyle.size`, `sublineStyle.size`) using the canonical `sizeOptions` S/M/L. Existing slides render unchanged. `SectionHeroSlider` forwards the values to `HeroSlide`'s new `headingSize` / `sublineSize` / heading/subline `textShadow` props.
- **UI App**: `SectionFooter` exposes new Design → Layout fields — **Logo Position** (`top` / `bottom`, default `top`) and **Logo Alignment** (`left` / `center` / `right`, default `left`, gated by `if: logoPosition === 'bottom'`). Defaults preserve current rendering.
- **UI App**: New Section Background field-pair (`sectionBackground` + `customSectionBackground`) on 17 sections — `SectionCategoryCardGrid`, `SectionCategoryCardSlider`, `SectionContainer`, `SectionContentGrid`, `SectionContentSlider`, `SectionFooter`, `SectionLogoGrid`, `SectionLogoSlider`, `SectionMediaText`, `SectionNewsletterRegistration`, `SectionPageHero`, `SectionPersonaQuoteSlider`, `SectionPlanComparisonTable`, `SectionProductListing`, `SectionProductReviews`, `SectionSearchResultHero`, `SectionUspBanner`. Paints the edge-to-edge band surrounding the boxed container, visible only when `containerStyle === 'boxed'`. Exported as `sectionBackgroundField` / `customSectionBackgroundField` / `sectionBackgroundFields` from `shared-fields/sectionBackground.ts`.
- **UI App**: `BlockButton` gains a `width` toggle (`hug` / `fill`, default `hug`) controlling whether the button hugs its content or fills the container.
- **UI App**: `SectionContentSlider` slot now accepts the three banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) and `BlockText` alongside `BlockCard` and `BlockMedia` — editors can place full banners or text blocks between cards for category teasers, promotional slides, and editorial copy.
- **UI App**: `SectionProductSlider` exposes the standard `background` and `customBackground` controls in Design → Styling — preset (`none` / `pale` / `solid` / `default`) or custom color, applied via the section's `Backdrop`.
- **UI App**: `SectionNewsletterRegistration` gains `caption` (text) and `body` (richtext) Content-panel fields matching `BlockText`. `caption` lands above `heading`; `body` lands between `subline` and the media area.

### Changed

- **UI Kit & UI**: `TextGroup` prop rename `headingTag` → `headingAs`, `sublineTag` → `sublineAs`; type rename `TextGroupHeadingTag` → `TextGroupHeadingAs`, `TextGroupSublineTag` → `TextGroupSublineAs`. `TextGroupSublineAs` widened to include `'h1'` so editors can override a subline to a page-level heading when SEO requires it. `SwiperChrome` and `Card` follow the same prop rename and forward to their internal `TextGroup`. `AlertDialog` gains optional `titleAs` / `descriptionAs` props (forwarded from `DialogStore.DialogOptions`). External consumers that import `TextGroupHeadingTag` / `TextGroupSublineTag` or bind `:heading-tag` / `:subline-tag` directly must update to the new names.
- **UI App**: `HeaderBasicMenu` renamed to `MenuBasic` and moved out of the `HeaderBasic/` folder into its own `MenuBasic/` folder, since the component was a generic basic navigation menu used by both `SectionHeaderBasic` and `SectionHeaderShop`. Type rename `HeaderProps` → `MenuBasicProps`, `MenuItem` → `MenuBasicItem`; CSS class `.header-basic-menu` → `.menu-basic`. The wrapping block `BlockMenuHeaderBasic` → `BlockMenuBasic`; Studio label `'Basic Header Menu'` → `'Basic Menu'`. **Stored project configurations that reference this block by name need a one-time migration**.
- **UI App**: **Breaking** — `BlockButton`'s single `icon` field is replaced by `iconLeft` and `iconRight` (both optional). Stored configs using the old `icon` key must migrate to `iconRight` to preserve the original right-aligned visual. Schema is reorganized into Content (text, link, iconLeft, iconRight) and Design (variant, size, width) panels.
- **UI App**: **Breaking** — `SectionNewsletterRegistration`'s static `media` schema field (`type: 'media'`) is replaced with a `media` block-slot accepting `BlockMedia`, `BlockText`, `BlockCard`, or `BlockButton`. Stored configs that used the old `media: { ... }` value will not auto-migrate. Adopters should drop the legacy image fallback (was `theme.image('newsletterRegistrationTeaser')`) — if no block is placed, the content side spans the full section width.
- **UI App**: `SectionProductSlider` and `SectionProductSliderShowcase` lose their dedicated "SEO" fieldset; `headingElement` is now stored at `headingStyle.element` (nested decorator path) instead of top-level `headingElement`. **Action required**: anyone with stored `headingElement` values on these two sections must re-pick the heading element in Studio once.
- **UI App**: Studio `label`, `description`, and `tags` rewritten for all 36 sections and all 37 blocks to read naturally to UX designers and e-commerce managers — removed implementation jargon ("renders", "binds", "configurator/definition", "place blocks manually"), filled missing descriptions and tags, and gave several blocks more meaningful labels (e.g. `BlockIframe` → "Embedded Page", `BlockMedia` → "Image or Video", `BlockProductDetailCartButton` → "Add to Cart", `BlockProductDetailStockInfo` → "Stock Availability", `BlockSortModes` → "Sort Selector", `BlockText` → "Text Block"). Em-dashes in descriptions normalised to plain sentences. Schema, components, slots, and `previewSrc` unchanged — no runtime behavior change.

### Fixed

- **UI App**: `SectionMediaText` custom background now renders. The section was passing the resolved CSS color string to a non-existent `containerBackground` prop on `<MediaText>` while keeping `background="none"`, so when an editor picked a custom color nothing rendered. The custom color is now resolved into `background` directly via `Backdrop`'s `BackdropBackground = 'none' | 'pale' | 'solid' | 'default' | (string & {})`. Preset values keep working unchanged.

### Removed

- **UI App**: Removed the `strawberry-field` theme.

## [1.35.0]

### Added

- **UI**: `BannerBasic` gains optional `size` (`s` / `m` / `l`, default `m`) and `aspectRatio` props — `size` scales the text stack (heading one step above body); `aspectRatio` applies a CSS `aspect-ratio` to the banner root.
- **UI**: `CategoryCardSlider` gains an optional `cta` prop (`{ text, link, variant }`), rendered as a button in the slider's heading area via the existing `SwiperChrome.buttons` slot.
- **UI App**: New `BlockBannerBasic`, `BlockBannerIntegrated`, and `BlockBannerShowcase` blocks — first-class block versions of the banner trio (previously only available as `SectionBanner*`).
- **UI App**: `BlockBannerBasic` exposes an optional `aspectRatio` schema field (e.g. `1/1`, `16/9`).
- **UI App**: `SectionCategoryCardSlider` exposes an optional `cta` schema field (with a `ctaVisible` visibility decorator), routed through to the underlying `CategoryCardSlider`.
- **UI App**: `SectionProductSliderShowcase` re-adds the `bannerTextSize` schema field (`s` / `m` / `l`, default `m`), routed to the inner `BannerBasic.size`.
- **UI App**: `SectionContentGrid`, `SectionContentSlider`, `SectionCategoryCardGrid`, `SectionQuoteCardSlider`, and the shared `overlay` field group now use schema `if` rules to hide controls that aren't meaningful for the current configuration.

### Changed

- **UI App**: `SectionContentSlider` no longer hardcodes a `surface-tone="'light'"` binding. The underlying `ContentSlider` did not consume the prop, so rendering is unchanged; surface tone now derives from the outer `Backdrop` as intended.

### Fixed

- **UI**: Fixed `TopBar` items' surface-tone rendering.

## [1.34.1]

### Changed

- **UI Kit & UI**: Elevation shadows now route through the `--shadow-s` / `--shadow-m` / `--shadow-l` design tokens instead of hardcoded `box-shadow` values, so theme overrides actually take effect on `Card`, `NavigationMenuContent`, `Select`, `ContextMenu`, `DropdownMenu`, `AlertDialog`, `Toast`, `ThemeEditor`, the suggest-input dropdown, `PlanCard`, `PersonaQuote`, `SearchAutoSuggest`, and the variant-selector controls. Default-theme rendering is unchanged.

### Fixed

- **UI**: Reverted `HeroSlider` height behaviour to v1.

## [1.34.0]

### Added

- **UI Kit**: New structured z-index token scale: `--z-index-sticky` (100), `--z-index-modal` (1400), `--z-index-popover` (1500), `--z-index-tooltip` (1600), `--z-index-toast` (1700). Modal overlays and content share a single token so stacked modals layer correctly via DOM order.
- **Frontend Core**: New editor z-index tokens (`--z-index-editor-block-hover/focus`, `--z-index-editor-section-hover/focus`, `--z-index-editor-actions`) for the Studio editor overlay system.
- **Frontend Core**: Section definitions now support `rendering.isolate: false` to opt out of CSS containment/isolation, enabling sticky and fixed positioning to work correctly on header and overlay sections.

### Changed

- **UI Kit**: All portaled components (`Dialog`, `Sheet`, `AlertDialog`, `DropdownMenu`, `Select`, `Tooltip`, `MediaLightbox`) now explicitly apply z-index via their content class using the new token scale for predictable stacking behavior.
- **UI App**: Header sections opt out of section isolation so their sticky/fixed chrome stays visible above subsequent sections.
- **UI App**: `FilterBar` now teleports its scroll-triggered fixed bar to `<body>` to escape section isolation, and replaces hardcoded scroll thresholds with an `IntersectionObserver` tied to the inline bar's visibility.

## [1.33.0]

### Added

- **UI App**: `Pagination` component now accepts a `scrollToTop` prop (defaults to `true`) that scrolls the viewport to the top when navigating between pages.

### Fixed

- **UI App**: Fixed `Button` component not emitting `click` events on the `NuxtLink` branch and not forwarding `$attrs` on both root elements, enabling reka-ui `as-child` to work correctly.
- **UI App**: Fixed `SectionBlogPostListing` to use reactive computed properties for client-side pagination so the displayed page updates correctly on navigation.

## [1.32.5]

### Fixed

- **UI**: Fixed `Card` component `RichContent` prop (`:content` → `:html`).
- **UI App**: Simplified `SocialShare` layout by removing an unnecessary wrapper div.
- **UI App**: Wrapped `BlogPostDetail` content in a container div for consistent layout.

## [1.32.4]

### Added

- **UI App**: New standalone `BlockSocialShare` block for sharing the current page via social platforms.

### Fixed

- **UI**: Fixed breadcrumb item text wrapping by applying single-line text-overflow with ellipsis.

## [1.32.2]

### Fixed

- **UI**: Fixed CSS layer order in Studio preview to ensure correct cascade and style isolation.

## [1.32.1]

### Fixed

- **UI**: Fixed navigation on locale change.

## [1.32.0]

### Added

- **UI Kit**: New `$tl` Vue global for locale translations. Expanded locale system with 13 new message groups, full German translations, and umlaut fixes across 46 components.
- **UI App**: New **ProductReviews** block, **PageHeader** section, and **SearchResultsHeader** section.
- **UI**: Loading spinner for suggested-search queries.

### Fixed

- **UI**: Corrected hover font colors for various elements in the classic theme.

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