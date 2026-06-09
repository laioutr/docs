---
title: UI App Changelog
description: Changelog for Laioutr UI App (@laioutr-app/ui) following Keep a Changelog and Semantic Versioning.
seo:
  title: UI App Changelog | Laioutr
  description: Changelog for Laioutr UI App (@laioutr-app/ui) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-app-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI App** (`@laioutr-app/ui`, the Studio Sections and Blocks composed via `defineSection` / `defineBlock`) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0]

### Added

- `BlockProductDetailEnergyLabel` for the Product Detail page. Renders the EU energy efficiency label — an inline energy-class badge (opening the full label in a lightbox) and an optional product data sheet link next to the product information. The block reads a new per-variant `ProductVariantEnergyLabel` canonical component (badge, label, title, energy class, EPREL registration number, data sheet link). It is non-standalone and placeable in the Product Detail section. Until platform adapters implement the resolver, the block is placeable but renders nothing in storefronts.
- `BlockProductDetailRating` for the Product Detail section. Renders the product's average star rating, the rating value (`x/maxRating`), and the review count. The product detail query now fetches the `ProductRating` component so any PDP block can read `product.components.rating`.
- `SectionGlossaryList`, with a new `glossaryQuery` shared field. Renders a shared alphabetical index of name + link entries, sourced either from a bound Hygraph data source (any app registering a `Glossary` entity) or from a manually authored `items` array. A configurable `heading` field falls back to a locale-aware default when left empty.
- `SectionLocationFinder`, `SectionLocationDetail`, and `BlockLocationCard`. `SectionLocationFinder` resolves locations via the new canonical `Location` entity and renders a finder with a configurable heading, container style, and Google Maps Map ID; it also exposes a `locationCards` slot for manually curated `BlockLocationCard` instances merged into the same list and map. `SectionLocationDetail` renders the full location page — map, header, image gallery, info list, and a rich description. `BlockLocationCard` is non-standalone (only usable inside `SectionLocationFinder`'s `locationCards` slot); cards without coordinates are silently dropped. Both sections read the Google Maps API promise from `useNuxtApp().$googleMapsApi` and render inert until the storefront registers that plugin.
- `SectionPromotionBanner`, registered in the `Banners` template list. Wraps `PromotionBanner` for canonical margin / padding / container-style chrome, with Content (heading, subline, icon, code button, CTA, countdown) and Design (styling + layout) panels. The promotion banner is configured directly on the Section — there is no `BlockPromotionBanner`.

### Changed

- The `media` / `backgroundImage` / `bannerImage` fields of the banner and media sections and blocks now accept both `image` and `video` assets (previously image-only). Affected: `BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`, `BlockCategoryCard`, `SectionBannerBasic`, `SectionBannerIntegrated`, `SectionBannerShowcase`, `SectionBrandHero` (background only), `SectionMediaText`, `SectionProductSliderShowcase`. `SectionPageNotFound` stays image-only (it renders the asset as a CSS `background-image`, not via `<Media>`).
- Editors can now choose a link `target` (`_self` / `_blank`, default `_self`) in Studio across single-link Blocks and Sections, via the new `linkTargetOptions` shared field. New `Target` fields on `BlockButton`, `BlockCategoryCard`, `BlockLogoSliderSlide`; per-item `Target` on `SectionBrandList.brandLinks` and `SectionTopBar.informationLinks`; `Logo Link Target` on `SectionHeaderBasic` and `SectionHeaderShop`. Existing configurations are unchanged — the runtime default `_self` matches prior behaviour.
- **Breaking (`SectionBrandList`):** the `brandLinks` schema field is renamed to `items`, and a new `heading` text field is added. Both `SectionBrandList` and `SectionGlossaryList` now render the shared alphabetical index; `SectionBrandList` keeps the optional count. Stored configurations referencing the old `brandLinks` name will not migrate automatically.

## [2.2.2]

### Changed

- **Breaking:** `BackgroundAwareButton`'s adaptive lookup variants are now `adaptive-primary` / `adaptive-secondary` / `adaptive-ghost` (previously `primary` / `secondary` / `ghost`), so they no longer shadow `Button`'s literal `primary` / `secondary` variants. The new `backgroundAwareButtonFields` shared field exposes the three `Adaptive *` options alongside the literal `ButtonVariant` options, and every section and block with a CTA now uses it — including the header, footer email button, 404 page, and pricing-plan card, whose CTAs newly adapt to their surrounding surface tone. Editors opt into per-surface remapping by picking an `Adaptive *` option.

  Custom themes overriding `backgroundAwareButtons` in `defineTheme` / `extendTheme` must rename their map keys (`light:light:primary` → `light:light:adaptive-primary`, same for `secondary` and `ghost` across all combinations). Stored Studio CTAs where an editor previously picked "Primary" or "Secondary" will, after upgrade, render as the literal Button variant — the per-surface remap is no longer applied unless the editor re-selects an `Adaptive *` option.

## [2.2.1]

### Changed

- Caption styling on `BannerBasic` now offers a plain/boxed variant, colour scheme, and text-shadow controls, bundled into a single sidebar group via the new `captionVariantField` shared field on `BlockBannerBasic` and `SectionProductSliderShowcase`. CTA banners in full-width containers now own their own border-radius.

  **Breaking (`SectionProductSliderShowcase`):** the schema replaces `captionStyle.color` with `captionVariant`. Existing pages with values stored under `captionStyle` silently drop them on next save — re-author the caption styling via the new Variant panel in Studio.
- **Breaking — sizing-system consolidation.** A new `Sizer` primitive and matching `sizingField` shared schema route outer-box sizing through one consistent control. Banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) plus `BlockMedia` and `BlockIframe` now use `Sizer` instead of bespoke per-block fields. Banner blocks also gain vertical content alignment.

  `BlockMedia` drops its `aspectRatio`, `height`, and `orientation` schema fields; `BlockIframe` drops `desktopHeight` and `mobileHeight`. Existing pages with values stored under these names silently drop them on next save — author the desired height via the new `sizing` field in Studio.

## [2.2.0]

### Added

- `SectionContentGrid` — hybrid slot/query wrapper. `dataSource: 'slot'` (default, `BlockCard` via the `default` slot) or `dataSource: 'query'` (auto-populated from a blog post collection).
- Studio preview images (`previewSrc`) for 31 blocks (plus 2 refreshed). Editors browsing the block picker now see a representative illustration for each placeable element.
- Editors can now pick a button size per CTA (`xs` / `s` / `m` / `l`, default `m`) across every section and block via the `buttonFields` **Size** selector, plus a new `buttonSizeOptions` export for inline use. Existing CTAs render unchanged unless a size is explicitly picked.
- Every section and block with a configurable heading or subline now exposes an HTML-element selector (`H1`–`H6` / `DIV` for headings; `P` / `H1`–`H6` / `DIV` for sublines) directly next to the field, replacing the separate bottom "SEO" panel. Newly available on 13 sections and 7 blocks. Section defaults: heading `h2`, subline `div`. Block defaults: heading `h3`, subline `h4`.
- `BlockHeroSliderSlide` gains per-element text-shadow controls (caption, heading, subline; `none` / `soft` / `strong`, default `none`) and per-slide text-size controls for heading and subline (S/M/L; defaults heading `l`, subline `m`). Existing stored slides render unchanged.
- `SectionFooter` gains two Design → Layout fields: **Logo Position** (`top` / `bottom`, default `top`) and **Logo Alignment** (`left` / `center` / `right`, default `left`, shown only when position is `bottom`). Defaults preserve current rendering.
- `SectionBannerBasic`, `SectionBannerShowcase`, and `SectionBannerIntegrated` gain `margin` / `padding` (Design → Layout) and `background` / `customBackground` (Design → Styling) fields. Editors can pick `none` / `pale` / `solid` / `default` / `custom` as the section background. Each section now wraps its banner in a `<Backdrop>` carrying the resolved background and spacing.
- A new **Section Background** field-pair (`sectionBackground` + `customSectionBackground`) on every section that exposes a `containerStyle` + `background` config (17 sections). It paints the edge-to-edge band around a boxed container — visible only in `boxed` mode, hidden in `full-width`. Defaults preserve current rendering.
- `SectionNewsletterRegistration` gains `caption` (text) and `body` (richtext) Content-panel fields, matching `BlockText`.

### Changed

- **Breaking (`SectionProductSlider`, `SectionProductSliderShowcase`):** these sections lose their dedicated "SEO" fieldset; the heading element is now stored at `headingStyle.element` instead of top-level `headingElement`. Anyone with stored `headingElement` values on these two sections must re-pick the heading element in Studio once.
- **Breaking (`HeaderBasicMenu` → `MenuBasic`):** the generic basic navigation menu (used by both `SectionHeaderBasic` and `SectionHeaderShop`) is renamed and moved out of the `HeaderBasic/` folder. The wrapping block `BlockMenuHeaderBasic` is renamed to `BlockMenuBasic` (Studio label `'Basic Header Menu'` → `'Basic Menu'`). Stored project configurations that reference this block by name need a one-time migration.
- **Breaking (`BlockButton`):** the single `icon` field is replaced by `iconLeft` and `iconRight`. Stored configs using the old `icon` key must migrate to `iconRight` to preserve the original right-aligned visual. A new `width` field (`hug` default / `fill`) is added, and the schema is reorganized into Content and Design panels.
- **Breaking (`SectionNewsletterRegistration`):** the static `media` schema field is replaced with a `media` block-slot accepting one of `BlockMedia`, `BlockText`, `BlockCard`, or `BlockButton`. Stored configs that used the old `media: { ... }` value will not auto-migrate; if no block is placed, the content side spans the full section width.
- `SectionContentSlider` now accepts the three banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) and `BlockText` in its slot, alongside the existing `BlockCard` / `BlockMedia`.
- `SectionProductSlider` now exposes the standard `background` and `customBackground` controls in Design → Styling.
- Rewrote `studio.label`, `description`, and `tags` for all 36 sections and 37 blocks so the copy reads naturally to UX designers and e-commerce managers in Studio — removing implementation jargon and giving several blocks clearer labels (e.g. `BlockIframe` → "Embedded Page", `BlockMedia` → "Image or Video", `BlockProductDetailCartButton` → "Add to Cart", `BlockText` → "Text Block"). No runtime behavior change.

### Fixed

- `SectionMediaText` custom background. When an editor picked a custom color, nothing rendered because the value was passed to a non-existent prop. The custom color is now resolved into `background` directly. Preset values (`none`, `pale`, `solid`, `default`) keep working unchanged.

### Removed

- The strawberry-field theme.

## [2.1.0]

### Added

- First-class block versions of the banner trio — `BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase` (previously only available as `SectionBanner*`). `BlockBannerBasic` gains an optional `aspectRatio` field.
- `SectionCategoryCardSlider` gains an optional `cta` field, rendered as a button in the slider heading area.
- `SectionProductSliderShowcase` gains an optional `bannerTextSize` field (`s` / `m` / `l`, default `m`).

### Changed

- `SectionContentSlider` removed a cosmetic hardcoded surface-tone binding; surface tone now derives from the outer `Backdrop` as intended. No rendering change.

## [2.0.0]

Large coordinated refactor across the UI layer. The entries below cover the Studio-facing Section and Block changes; many require migrating stored Studio configurations.

### Added

- **New sections:** `SectionContentGrid` (hybrid slot/query), `SectionEditorialGrid`, `SectionCategoryCardGrid`, `SectionProductReviews` (replacing the legacy block-level implementation). `SectionContentSlider` adopts a hybrid slot/query data source (default `slot`). `SectionUspBanner` is reshaped: it drops `bannerStyle` and `colors` (moved to top-level `color` / `iconColor`) and extracts its `usps[]` into a new `items` slot populated by `BlockUspBannerItem`.
- **New blocks:** `BlockCategoryCard` and `BlockUspBannerItem` (non-standalone children); `BlockProductsListing`, `BlockFilterBar`, `BlockSortModes`, `BlockPagination` (split out of the previous combined `SectionProductListing`); `BlockMobileMenuBasic` and `BlockMobileMenuShop` (non-standalone, hosted in header sections' `mobile` slots); `BlockMenuSideBySide` and `BlockMenuHeaderBasic` (non-standalone, header `desktop` slots); `BlockMegaMenu` (thin wrapper around the new `MegaMenu` compound); `BlockProductDetailVariantSelectorOptions`.

### Changed

- **Breaking — section renames (Studio data migration required):** `SectionBasicHeader` → `SectionHeaderBasic`; `SectionBasicHeroSlider` → `SectionHeroSlider`; `SectionImageAndContent` → `SectionMediaText`; `SectionTestimonialPersonaQuote` → `SectionPersonaQuoteSlider`; `SectionTestimonialQuoteCardSlider` → `SectionQuoteCardSlider`; `SectionBrandLink` → `SectionBrandList`; `SectionSearchResultHeader` → `SectionSearchResultHero`; `SectionPricingPlans` → `SectionPlanCardSlider`; `SectionPricingTable` → `SectionPlanComparisonTable`; `SectionPageHeader` / `SectionCategoryHeader` → `SectionPageHero`; `SectionShopHeader` → `SectionHeaderShop`; `SectionError404` → `SectionPageNotFound`; `SectionProductDetailContainer` → `SectionProductDetail`; `SectionLogoPresentation` → split into `SectionLogoSlider` / `SectionLogoGrid` by the old `view` discriminator; `BlockCtaBanner{Basic,Integrated,Showcase}` → promoted to `SectionBanner{Basic,Integrated,Showcase}`; `SectionBannerContainer` → consolidated into `SectionContainer`.
- **Breaking — block renames (Studio data migration required):** `BlockBasicHeroSliderSlide` → `BlockHeroSliderSlide`; `BlockTestimonial` → `BlockPersonaQuote`; `BlockProductGrid` → `BlockProductsListing`; `BlockQueryPagination` → `BlockPagination`; `BlockQuerySorting` → `BlockSortModes`; `BlockCmsButton` → `BlockButton` (Studio label `CMS Button` → `Button`); `BlockCmsCardContent` → `BlockCard`; `BlockSingleLogoPresentation` → `BlockLogoSliderSlide`.
- **Breaking — schema field renames (Studio data migration required)** normalized across 30+ sections/blocks to the section-config standard, including: `blockMargin` → `margin`; `blockPadding` / `innerBlockPadding` → `padding`; `textAlignment` / `contentPosition` / `contentAlignment` → `alignment`; `headline*` → `heading*`; `actionButton[0]` → `cta` object + `ctaVisible`; `accordionStyle` (`BlockAccordion`) → `variant`; `image` (`SectionNewsletterRegistration`) → `media`; `BlockIframe.url` → `src`; `SectionScrollAnchor.id` → `anchorName`; `SectionPageHero.title` → `heading`; plus many per-section renames on `SectionTopBar`, `SectionFooter`, `SectionProductSlider`, `SectionProductSliderShowcase`, `SectionCategoryCardSlider`, `SectionQuoteCardSlider`, and others. `is*`-prefixed schema fields (`isSticky`, `isSaleDesign`) are kept unchanged so stored configurations continue to bind without migration.
- **Breaking — `ctaButton.variant` value remap (Studio data migration required):** the CTA variant enum was reshaped from 12 to 14 values. Notable remaps: `white-ghost` → `ghost-white`; `white-secondary` → `secondary-white`; `black-ghost` → `ghost-black`; `white-close` → `close-white`; `black-close` → `close-black`; `glass` → `glass-black` (verify with design); `input-field` → dropped (map to `subtle` or drop); `black-close-always-black` / `white-close-always-white` lose their always-color semantics. New variants without a predecessor: `tertiary`, `positive`, `danger`, `subtle`, `info`.
- **Breaking — auto-import tag prefix unified to `<L*>`.** `@laioutr-core/ui` previously registered components with the `Lui` prefix; it now uses `L`, matching `@laioutr-core/ui-kit`. Templates referencing `<Lui*>` for any `ui` component must be renamed to `<L*>`.
- New shared-field presets in `shared-fields/`: `background.ts`, `margin.ts`, `padding.ts`, `size.ts`, `visibility.ts`, `buttonVariant.ts`, `themedStyleColor.ts`, `button.ts`, `containerStyle.ts`, `headingElement.ts`, `surfaceTone.ts`. Top-level panels normalized to `Content` + `Design` (with `Styling` / `Layout` dividers) across 30+ sections/blocks.
- `SectionBlogPostDetail`, `SectionProductDetail`, `SectionScrollAnchor`, `SectionBlogPostListing`, `SectionMediaText`, `BlockMedia`, and `BlockIframe` are now thin configuration adapters over their `ui` components, with no schema changes.

### Removed

- **Breaking (Studio data migration required):** `SectionBlogSlider` and `SectionFlexibleContentSlider` → `SectionContentSlider`; `SectionTestimonialQuoteCard` → `SectionQuoteCardSlider` (single slide); `SectionCardGrid` → `SectionContentGrid`; `SectionInpageNavigationBasic` / `Big` / `Compact` → `SectionCategoryCardGrid` / `SectionCategoryCardSlider`; `SectionAmbiendoHeader` → `SectionHeaderShop` with `BlockMenuSideBySide`; `SectionShopHeaderNavigation` → demoted into `BlockMenuSideBySide`; `BlockProductReviews` → `SectionProductReviews`; `SectionFilterBar` → block-only `BlockFilterBar`.

## [1.34.0]

### Changed

- Reworked z-index architecture across the UI stack. Header sections opt out of section isolation so their sticky/fixed chrome remains visible above subsequent sections; the filter bar teleports its scroll-triggered fixed bar to `<body>` to escape section isolation.

## [1.33.0]

### Added

- `scrollToTop` prop on Pagination (default `true`), which scrolls the viewport to the top when navigating pages.

### Fixed

- Button now emits `click` events on the NuxtLink branch and forwards `$attrs` on both root elements, so reka-ui `as-child` works correctly.
- `SectionBlogPostListing` uses reactive computed properties for client-side pagination.

## [1.32.5]

### Fixed

- `Card` rich-content prop (`:content` → `:html`); simplified SocialShare layout; wrapped BlogPostDetail content in a container div.

## [1.32.4]

### Added

- Standalone `BlockSocialShare` block for sharing the current page via social platforms.

## [1.32.2]

### Fixed

- CSS-layer order in Studio preview.

## [1.32.1]

### Fixed

- Workaround for entities not refetching on locale change.

## [1.32.0]

### Added

- `BlockProductReviews` block, `PageHeader` section, and `SearchResultsHeader` section.

### Fixed

- Correct hover font colors for some elements; loading state from async watchers.

## [1.31.4]

### Fixed

- Missing `useResolvedLink` import in `SectionBreadcrumbs` that caused a runtime error.

## [1.31.0]

### Added

- `LanguageSwitcher` now uses market-domain data for available locales; locale props are threaded through Header, TopBar, MobileMenu, and MegaMenu components, and sections use `useAvailableLocales` for navigation-based locale switching.

### Changed

- URL fields migrated from `text` to `link` type and resolved through `linkResolver` for market-aware URL resolution.

### Deprecated

- `useLinkResolver` is converted to a singleton `linkResolver` object that no longer requires a setup context. `useLinkResolver` is preserved as a deprecated re-export. Unused `useSwitchLanguagePath` and `useSwitchMarketUrl` wrappers were removed.

## [1.30.0]

### Changed

- All component CSS is now wrapped in `@layer lui-components` for cascade-layer control.

## [1.29.3]

### Fixed

- ThemeSwitcher import and `ThemeWithMeta`; Input prop fallthrough and ShopHeader close button.

## [1.29.2]

### Fixed

- Correctly merge theme images.

## [1.29.1]

### Fixed

- Do not show the theme switcher when it is not enabled.

## [1.29.0]

### Added

- Theme switcher support.

## [1.28.0]

### Fixed

- Links in the basic header.

## [1.27.0]

### Added

- New Iframe block.

### Fixed

- HeroSlider media loading eagerness.

## [1.26.1]

### Changed

- `SectionBreadcrumbs` uses the `BreadcrumbItem` canonical type.

## [1.26.0]

### Added

- Breadcrumb section.

## [1.25.0]

### Added

- Error 404, Pricing Plans, and Pricing Table sections.

## [1.24.3]

### Fixed

- Hydration error breaking the page when a Header component with submenus is used.

## [1.24.2]

### Fixed

- `FlexibleContentSliderSection` breaking when `actionButton` is missing.

## [1.24.1]

### Added

- `WellKnownSectionTag` and section tags.

## [1.24.0]

### Added

- Support for multiple CTAs in the basic header.
- Support for calling PDPs with variant option values.

## [1.23.0]

### Added

- Missing testimonial sections.

## [1.22.0]

### Added

- ProductShowcaseSlider section.

### Fixed

- Footer width and background.

## [1.21.3]

### Added

- Support for a variant query parameter in `ProductDetailContainer`.

## [1.21.1]

### Fixed

- Links with references are now case-insensitive to their `type`.

## [1.21.0]

### Added

- Autosuggest in the shop header on mobile.

## [1.20.0]

### Added

- SearchOverlay wired to actual data.

## [1.19.0]

### Added

- `ConnectedCart` component for use in headers.

## [1.18.0]

### Added

- Correct `SectionBasicHeader` implementation.

## [1.17.7]

### Fixed

- `SectionIntegratedHeader` recursion bug.

## [1.17.0]

### Added

- Ability to select a root menu item in the Integrated Shop Header; the root menu places all of its children as navigation items.

## [1.16.0]

### Added

- Basic strawberry-field theme.

## [1.15.0]

### Added

- Integrated Shop Header section.

## [1.14.0]

### Added

- `SectionShopHeader` opens an empty cart; sold-out status shown in DetailAddToCart with LightboxModal connected to the product image gallery; detail variant switcher and add-to-cart toast.

## [1.13.0]

### Added

- Filter bar implementation and type adjustments.

### Fixed

- Removed duplicate product info from `BlockProductDetailDetails`.

## [1.12.0]

### Added

- Remote `QueryTemplates`.

## [1.11.0]

### Changed

- Studio refresh compatibility.

## [1.10.0]

### Changed

- Improved LCP loading strategy.

## [1.9.0]

### Fixed

- Missing links; added `robots.txt` and page SEO meta.

## [1.6.0]

### Fixed

- CSS layer order and swiper styles.

## [1.5.0]

### Added

- Adjusted definition default behaviour; added several sections and blocks.

## [earlier versions]

Initial development of the Section and Block layer (1.1.0 – 1.4.0): the first section definitions, preparation for the Shopify demo, theme loading via ui-kit, and early ShopHeader login wiring. Intervening patch releases not listed here were internal fixes or cross-package dependency bumps with no Studio-facing change.
