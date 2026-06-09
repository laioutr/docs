---
title: UI Changelog
description: Changelog for Laioutr UI (@laioutr-core/ui) following Keep a Changelog and Semantic Versioning.
seo:
  title: UI Changelog | Laioutr
  description: Changelog for Laioutr UI (@laioutr-core/ui) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI** (`@laioutr-core/ui`, the commerce-specific organism components built on UI Kit) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0]

### Added

- **`BlockProductDetailEnergyLabel`** for the Product Detail page. Renders the EU energy efficiency label: an inline energy-class badge (opening the full label in a lightbox) and an optional product data sheet link next to the product information. The block queries the product's variants for the new `ProductVariantEnergyLabel` component and renders the label of the selected variant (resolved via `useProductVariantContext`, falling back to the first variant). It is non-standalone and placeable in the Product Detail section.

  A new `ProductVariantEnergyLabel` entity component (`@laioutr-core/canonical-types/entity/product-variant`) defines the per-variant shape:

  - `badge: Media` — small inline energy-class badge image (A–G).
  - `label: Media` — full-size energy label image, opened in a lightbox.
  - `title?: string` — human-readable title (e.g. "Energy class A++"), used as the alt text on the badge image. Optional: consumers fall back to a generated name or a translated default.
  - `energyClass?: string` — energy efficiency class (e.g. "A", "A++"). Free-form string, not an enum, so the type survives the EU periodically rescaling its class vocabulary (regulation 2017/1369).
  - `energyClassScaleMax?: string` / `energyClassScaleMin?: string` — the most and least efficient class on the product category's regulated scale.
  - `eprelRegistrationNumber?: string` — identifier for the variant's entry in the EU EPREL registry.
  - `dataSheetLink?: string` — optional URL of the product information sheet / data sheet PDF.

  The component lives on `ProductVariant` because each EU energy label is registered per commercial model in EPREL, keyed by the model identifier / GTIN — which is variant-level. Variants of the same product can carry different energy classes. Adapters (shopify, shopware, ambiendo, etc.) populate this component when the underlying variant carries an EU energy label; variants without the data omit the component and the block renders nothing. Until adapters implement the resolver, the block is placeable but renders nothing in storefronts.

  A new `EnergyLabel` component renders the badge image, lightbox trigger, and optional data sheet link. Props: `badge: Media`, `label: Media`, `title?: string`, `dataSheetLink?: string`, plus `width` / `height` for the badge image. When `title` is omitted, the alt text falls back to the `pdp.energyLabel` translation.

- **`PromotionBanner`** (moved here from UI Kit because promo-codes + checkout language are commerce-domain). Accepts headings, optional countdown (via `useCountdown`), a promo-code copy button, a CTA, and a surface preset (`default | pale | bright | solid`) or `custom` colors with per-slot overrides (background / text / countdown / icon). It auto-promotes `variant` to `'custom'` when any `customColors` field is set, and adds `@vueuse/core` as a dependency.

- Plumbed `target?: string` through link-rendering components so consumers can choose the browsing context of editorial links. Default behaviour is unchanged when `target` is omitted (`_self`):

  - `BrandList` — `BrandListItem.target` carries through to the per-brand `NuxtLink`.
  - `HeaderBasic` — new `logoTarget` prop on the logo link.
  - `HeaderShop` — new `logoTarget` prop on the logo link.
  - `LogoSlider` / `LogoGrid` / `LogoSliderSlide` — `LogoSliderSlideProps.target` forwards to the slide's `MaybeLink`.
  - `TopBar` — `informationLinks[].target` forwards to each navigation item.

### Changed

- **Breaking:** Replaced `BrandList` with the generic `AlphabeticalIndex` component — an alphabetically grouped link list with a configurable `heading` and an optional per-item `count`, usable for brands, glossaries, and similar A–Z indexes.

  ```ts
  // Before
  interface BrandListProps {
    brands: { name: string; href: string; count?: number }[];
  }

  // After
  interface AlphabeticalIndexProps {
    heading?: string;
    items: { name: string; href: string; count?: number }[];
  }
  ```

  Upgrade: import from `#ui/components/AlphabeticalIndex/AlphabeticalIndex.vue`, rename the `brands` prop to `items`, and pass `heading` explicitly (the old built-in `"Brands"` translation no longer renders automatically).

### Fixed

- Fixed component props that were silently dropped because they didn't match the target component's API:

  - `FeaturePillList` passed `left-icon` to `Badge` (whose prop is `icon-left`), so pill icons never rendered.
  - `OpeningStatusIndicator`, `OpeningStatusDetail`, `LocationCard`, `LocationFinder`, and `LocationHeader` passed `variant` to `Text`, which has no `variant` prop. Headings using `variant="heading"` rendered with the default `body` styling.
  - `FilterBar` bound `v-model:open` to `FilterOffCanvas`, which exposes `v-model:isOpen` — the off-canvas filter panel could not be opened.
  - `PromotionBanner` passed an invalid `type="text"` to `Button`; the dead attribute was removed.

## [2.2.3]

### Changed

- `PriceInfo`, `ProductTileBasic`, and `CartListItem` now render their unit price via the new `$unitPrice` formatter instead of inlining `$money(...) / $measurement(...)`. No visual change — the rendered string and each component's BEM classes are unchanged.

## [2.2.2]

### Changed

- `BackgroundAwareButton`'s adaptive lookup variants are now `adaptive-primary` / `adaptive-secondary` / `adaptive-ghost` (previously `primary` / `secondary` / `ghost`), so they no longer shadow `Button`'s literal `primary` / `secondary` variants. The pass-through variants (`tertiary`, `secondary-white`, `ghost-*`, `glass-*`, `subtle`, `info`, `positive`, `danger`, `close-*`) are unchanged.

  In Studio, the new `backgroundAwareButtonFields` shared field exposes the three `Adaptive *` options alongside the existing literal `ButtonVariant` options. Every section and block with a CTA now uses this field — banner sections, the sliders, `BlockButton`, `BlockCard`, `BlockText`, and now also the header, footer email button, 404 page, and pricing-plan card, whose CTAs newly adapt to their surrounding surface tone. Editors opt into per-surface remapping by picking an `Adaptive *` option.

  **Breaking:** Custom themes that override `backgroundAwareButtons` in `defineTheme` / `extendTheme` need their map keys renamed accordingly (`light:light:primary` → `light:light:adaptive-primary`, same for `secondary` and `ghost` across all `light|dark` × `light|dark|bright` combos). Stored Studio CTAs where an editor previously picked "Primary" or "Secondary" will, after upgrade, render as the literal Button variant — the per-surface remap is no longer applied unless the editor re-selects an `Adaptive *` option.

## [2.2.1]

### Changed

- Caption styling on `BannerBasic`: plain/boxed variant, colour scheme, and text-shadow controls — replacing the previous colour-only override. A new `captionVariantField` shared field bundles the controls into a single sidebar group on `BlockBannerBasic` and `SectionProductSliderShowcase`. `Container` no longer strips border-radius from CTA banners in full-width containers (banners now own their own radius).

  **Breaking:** `BannerBasic` replaces `captionColor: string` with `captionVariant: Omit<CaptionFlagProps, 'text'>`. Migrate inline:

  ```ts
  // Before
  <BannerBasic :caption="caption" caption-color="#ff0000" />

  // After
  <BannerBasic :caption="caption" :caption-variant="{ variant: 'plain', textShadow: 'none' }" />
  ```

  **Breaking:** `SectionProductSliderShowcase` schema replaces `captionStyle.color` with `captionVariant`. Existing pages with values stored under `captionStyle` silently drop them on next save — re-author the caption styling via the new Variant panel in Studio.

- Sizing-system consolidation. A new `Sizer` primitive (in UI Kit) and matching `sizingField` shared schema route outer-box sizing. Banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) plus `BlockMedia` and `BlockIframe` now route outer-box sizing through `Sizer` instead of bespoke per-block fields. Banner blocks also gain vertical content alignment (2D on Basic, vertical-only on Integrated). `Placeholder` accepts an optional `text` prop.

  **Breaking:** `BannerBasic` no longer accepts `sizing` / `aspectRatio` props. Wrap in `<Sizer>` in the consuming Block.

  **Breaking:** `BlockMedia` drops `aspectRatio`, `height`, and `orientation` schema fields; `BlockIframe` drops `desktopHeight` and `mobileHeight`. Existing pages with values stored under these names silently drop them on next save — author the desired height via the new `sizing` field in Studio.

### Fixed

- Fixed `ProductSliderShowcase` padding and width: the slider no longer reserves bleed padding on the wrapper, the banner respects its container, and the slider fills the remaining row width on desktop.

## [2.2.0]

### Added

- `Footer` accepts two new optional props: `logoPosition?: 'top' | 'bottom'` (default `'top'`) and `logoAlignment?: 'left' | 'center' | 'right'` (default `'left'`, only meaningful when `logoPosition === 'bottom'`). When `logoPosition === 'bottom'`, the top logo-column is hidden, menus span the full top row, and the logo image renders inside the bottom bar between the icons cluster and the copyright; `logoAlignment` controls its placement. Existing behaviour is preserved at the defaults.

- Editors can now pick a button size per CTA across every section and block. `buttonFields` exposes a new **Size** selector (`xs` / `s` / `m` / `l`, default `'m'`), and a new `buttonSizeOptions` export covers inline button-size selects. Existing CTAs render unchanged unless an editor explicitly picks a different size. For ui consumers building their own CTA shapes, the following accept an optional `size` on each CTA entry (defaults preserve previous rendering): `HeroSlide`, `PageNotFound`, `BannerShowcase`, `ContentGrid`, `HeaderBasic.ctaButtons[]`, the `ContentSlider` / `CategoryCardSlider` / `ProductSlider` cta types; `PlanCard` gains `ctaVariant` / `ctaSize`.

- Forwarded the new `sectionBackground` (and `customSectionBackground`) props through `Container` and `MediaText` to `Backdrop`. Both default to `'none'`, so existing consumers render unchanged.

- `HeroSlide` accepts new optional props: `headingSize?: 's' | 'm' | 'l'`, `sublineSize?: 's' | 'm' | 'l'` (defaults `'l'` / `'m'`), and `headingTextShadow?: 'none' | 'soft' | 'strong'` / `sublineTextShadow?: 'none' | 'soft' | 'strong'` (default `'none'`). The text-shadow values apply a layered shadow for legibility against busy hero backgrounds, resolving from the global `--text-shadow-soft` / `--text-shadow-strong` custom properties. Defaults preserve previous rendering.

- Added opening-hours primitives (in UI Kit) and location-card domain components (here): `useOpeningStatus` composable, `OpeningStatusIndicator`, `OpeningStatusDetail`, `OpeningStatus`, `OpeningHoursWeeklyTable`, plus `LocationCard` (list / map-popup variants) and `PaymentMethodList`.

- `NewsletterRegistration` accepts two new optional props: `caption?: string` (rendered above the heading) and `body?: string` (rendered as a `<RichContent>` block between the headings group and the form), mirroring the caption + body fields exposed by `BlockText`. Both are unset by default.

- **Editor:** every section AND block with a configurable heading or subline now exposes an HTML-element selector (`H1`–`H6` / `DIV` for headings; `P` / `H1`–`H6` / `DIV` for sublines) directly next to the field via the `as: 'style'` decorator popup — no more separate "SEO" panel. Newly available on 13 sections and 7 blocks; section defaults: heading → `h2`, subline → `div`; block defaults: heading → `h3`, subline → `h4`. The underlying ui components (`BannerBasic`, `BannerShowcase`, `BannerIntegrated`, `BrandHero`, `CategoryCardSlider`, `CategoryCardGrid`, `ContentGrid`, `ContentSlider`, `EditorialGrid`, `HeroSlide`, `LogoGrid`, `LogoSlider`, `NewsletterRegistration`, `PageHero`, `PageNotFound`, `ProductSlider`, `ProductSliderShowcase`, `VariantSelectorConfigurator`) accept new optional `headingAs` / `sublineAs` props (additive).

### Changed

- `HeaderBasicMenu` → `MenuBasic`. The component was a generic basic navigation menu (used by both `SectionHeaderBasic` and `SectionHeaderShop`), not a sub-component of `HeaderBasic`. Exported type `HeaderProps` → `MenuBasicProps`, `MenuItem` → `MenuBasicItem`; root CSS class `.header-basic-menu` → `.menu-basic`.

  **Breaking:** `BlockMenuHeaderBasic` → `BlockMenuBasic`. `defineBlock({ component: 'BlockMenuHeaderBasic' })` → `'BlockMenuBasic'` — **stored project configurations that reference this block by name need a one-time migration**. Studio label `'Basic Header Menu'` → `'Basic Menu'`.

- **Breaking:** the `image?: MediaImage` prop on `NewsletterRegistration` is removed in favor of a new `media` slot. The right-side / top-on-mobile media area is now consumer-provided via `<template #media>...</template>`. The legacy `theme.image('newsletterRegistrationTeaser')` fallback is gone; if no media is provided, the content side takes the full width.

- **Migrated (2 sections):** `SectionProductSlider`, `SectionProductSliderShowcase` lose their dedicated "SEO" fieldset; `headingElement` is now stored at `headingStyle.element`. **Action required:** anyone with stored `headingElement` values on these two sections must re-pick the heading element in Studio once.

- Removed the strawberry-field theme.

### Fixed

- Fixed `FilterOffCanvas` / `FilterModal` filter selections never reaching the parent's `selectedFilters`. Three inner filter components had moved to the canonical `modelValue` channel, so the parent's `:checked` binding fell through as a raw HTML attribute and `@update:checked` was never emitted — brand checkboxes did not toggle, the price-range slider received `checked="[object Object]"`, and the stock-filter switch toggled visually but never propagated.

  **Breaking:** `FilterOffCanvasSwatchList`'s v-model channel is renamed from `'checked'` to the default `modelValue`. Consumers using `v-model:checked="…"` must switch to `v-model="…"`.

- `SearchAutoSuggestItem` now uses the shared `HighlightedText` atom instead of its own inline highlighting, picking up diacritic-insensitive matching and all-occurrences highlighting. Visual output is unchanged.

## [2.1.0]

### Added

- Restored banner / category-slider / showcase parity with v1:

  - `BannerBasic`: new optional `size` prop (`'s' | 'm' | 'l'`, default `'m'`) and `aspectRatio` prop.
  - `CategoryCardSlider`: new optional `cta` prop (`{ text, link, variant }`).
  - New `BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase` blocks — first-class block versions of the banner trio (previously only available as `SectionBanner*`). `BlockBannerBasic` gains an optional `aspectRatio` schema field.
  - `SectionCategoryCardSlider`: new optional `cta` schema field with `ctaVisible` visibility decorator.
  - `SectionProductSliderShowcase`: new optional `bannerTextSize` schema field (`s` / `m` / `l`, default `m`).

### Changed

- `SectionContentSlider` removed the cosmetic hardcoded `surface-tone="'light'"` binding; surface tone now derives from the outer `Backdrop` as intended (no rendering change).
- Routed elevation shadows through the `--shadow-s` / `--shadow-m` / `--shadow-l` design tokens instead of hardcoded `box-shadow` values, so theme overrides take effect on Card, NavigationMenuContent, Select, ContextMenu, DropdownMenu, AlertDialog, Toast, ThemeEditor, PlanCard, PersonaQuote, SearchAutoSuggest, and the variant-selector controls. Default-theme rendering is unchanged.
- Reverted HeroSlider height behaviour to v1.

## [2.0.0]

A large coordinated refactor across the UI layer (UI Kit, UI, and the section/block app layer). This is the major release that unified naming, the surface-tone system, form prop contracts, and the public CSS API. The most consequential consumer-facing changes are summarized below; see the migration sub-sections at the end for diffs.

### Added

- **New ui components:** `Container` (backdrop + grid + alignment composition), the `MegaMenu` compound (`MegaMenu` + `MegaMenuTrigger` + `MegaMenuContent`), `BlogPostDetail`, `ProductDetail`, `ScrollAnchor`, `BlogPostListing`, a `PopUp` shell + presets (`PopUpInfo`, `PopUpNewsletter`, `PopUpPromotion`), `SortModes`, and `SearchAutoSuggest` (+ `SearchAutoSuggestItem`).
- **Auto-import prefix unified to `L`.** `@laioutr-core/ui` now registers its auto-imported components with prefix `L` (matching UI Kit) instead of `Lui`. Every `<LuiX>` template tag pointing at a `ui` component must be renamed to `<LX>`. Combined with the cross-package moves, consumers can apply a single `<Lui` → `<L` sweep across templates.
- **New UI-Kit atoms relevant to ui consumers:** `IconButton`, `TextGroup`, `OnSurface` (replaces `OnBackground`), `LinkTile` (replaces `CategoryCard`), `HighlightToggle`, `StatusMessage`, `MediaStage`, `BadgePromotion` (replaces `SavingsBadge`), `NavLinkItem`, `NavSectionHeading`, and the Swiper widget family moved in from `ui`.
- **New sections/blocks:** `SectionContentGrid`, `SectionEditorialGrid`, `SectionCategoryCardGrid`, `SectionProductReviews`, `SectionContentSlider`; `BlockCategoryCard`, `BlockUspBannerItem`, `BlockProductsListing`, `BlockFilterBar`, `BlockSortModes`, `BlockPagination`, `BlockMobileMenuBasic`, `BlockMobileMenuShop`, `BlockMenuSideBySide`, `BlockMenuHeaderBasic`, `BlockMegaMenu`, `BlockProductDetailVariantSelectorOptions`.

### Changed

- **Breaking: extensive component renames in `ui`.** Final → old names include: `HeaderBasic` ← `Header`; `HeaderShop` ← `ShopHeader`; `HeroSlider` ← `BasicHeroSlider`; `HeroSlide` ← `BasicHeroSliderSlide`; `MobileMenuBasic` ← `MobileMenu`; `MobileMenuShop` ← `MegaMenuMobile`; `MenuSideBySide` ← `SideBySideMenu`; `EditorialGrid` ← `ArticlesGrid`; `ContentGrid` ← `CardGrid`; `ContentSlider` ← `GalleryContentSlider`; `BrandList` ← `BrandGrid`; `MediaText` ← `CmsImageText`; `MediaGallery` ← `LightboxGallery`; `SearchResultHero` ← `SearchResultHeader`; `PageNotFound` ← `Error404Page`; `ProductListingGrid` ← `ProductGrid`; `QuoteCardSlider` ← `QuoteSlider`; the BuyBox family renamed to `EnergyLabel`, `BenefitsBox`, `PriceInfo`, `CouponBox`, `QuantityDiscount`, `ProductTitle`, `AddToCart`; the `VariantSelector*` / `FilterOffCanvas*` / `PlanCard*` families renamed. Every `*Props` type, BEM block, and Storybook title follows the new name.

- **Breaking: surface-tone migration.** `BackgroundBrightness` → `SurfaceTone` (`'light' | 'dark' | 'bright'`) across the form-input families. `OnBackground` is deleted — use `OnSurface` + the `useSurfaceTone()` composable. `colorToBackground` renamed to `colorToSurfaceTone`. `HeaderBasicMenu`'s `textColor` is replaced by `surfaceTone` with a **semantic value flip**: old `text-color="dark"` (dark text on light bg) maps to new `surface-tone="light"` — invert the value, don't just rename.

- **Breaking: Button refactor.** `Button.type` prop removed (use `IconButton` for icon-only buttons). Sizes `'small' | 'medium' | 'large'` → `'xs' | 's' | 'm' | 'l'` (default `'m'`). `ButtonVariant` flattened to a single 14-value union; `'input-field'` → `'subtle'`, `'video-control'` removed. Icons move from `#iconLeft` / `#iconRight` slots to typed `iconLeft` / `iconRight` props.

- **Breaking: form prop normalization.** `Field` drops `error: string` (use `errorMessage` + `invalid`); `Input` `isError` → `invalid`; `Label` `error` → `invalid`; `Switch` and `Checkbox` v-model channel renamed from `'checked'` to default `modelValue` (`v-model:checked` callsites must become `v-model`); `Select` `size` prop removed (express via `:trigger="{ size: 's' }"`).

- **Breaking: `is*` prefix sweep.** For props where the subject is the component itself, the `is` prefix is dropped — e.g. `Badge.isRounded` → `rounded`, `Button.isLoading` → `loading`, `Toast.isOpen` → `open`, `Pagination.isNavigationNumbers` → `variant`, `HeaderBasic.isSticky` → `sticky`, `HeroSlider.isFullHeight` → `fullHeight`, `CouponBox.isApplied` → `applied`, `ProductTileBasic.isAddToCart*` → `addToCart*`. World-state facts (`isUserLoggedIn`, `isSoldOut`, `isAboveTheFold`, etc.) keep `is*`.

- **Breaking: TextGroup tag-prop rename.** `headingTag` / `sublineTag` → `headingAs` / `sublineAs`; types `TextGroupHeadingTag` / `TextGroupSublineTag` → `*As`. `TextGroupSublineAs` widened to include `'h1'`.

- **Breaking: Studio data migration required** for every renamed/deleted section and block component string, every renamed schema field, and every promoted/demoted section ↔ block. Highlights:
  - Section renames: `SectionBasicHeader` → `SectionHeaderBasic`, `SectionImageAndContent` → `SectionMediaText`, `SectionShopHeader` → `SectionHeaderShop`, `SectionError404` → `SectionPageNotFound`, `SectionPricingPlans` → `SectionPlanCardSlider`, `SectionPricingTable` → `SectionPlanComparisonTable`, the banner blocks promoted to `SectionBanner*`, and more.
  - Block renames: `BlockBasicHeroSliderSlide` → `BlockHeroSliderSlide`, `BlockTestimonial` → `BlockPersonaQuote`, `BlockProductGrid` → `BlockProductsListing`, `BlockCmsButton` → `BlockButton`, `BlockCmsCardContent` → `BlockCard`, etc.
  - Schema fields normalized to the section-config standard across 30+ sections/blocks: `blockMargin` → `margin`, `blockPadding` → `padding`, `textAlignment` → `alignment`, `headline*` → `heading*`, `actionButton[0]` → `cta` + `ctaVisible`, and the `ctaButton.variant` enum reshaped from 12 to 14 values (e.g. `white-ghost` → `ghost-white`, `input-field` dropped).
  - Header refactor: `HeaderBasic` / `HeaderShop` are now slot-based; inline navigation/mobile-menu props (`menuItems`, `mobileMenuItems`, `navigationMenuItems`, `socialLinks`) are removed and provided via `desktop` / `mobile` slots filled by the hosting Section.
  - `MegaMenu` (was `MegaMenuDesktop`): complete API replacement — old `colorMode` / `isOpen` / `megaMenuItems` / `contentLayout` props gone; new `items` / `surfaceTone` / `defaultValue` props and split `MegaMenuTrigger` / `MegaMenuContent` compound parts.

- **Breaking: public CSS class renames** following the component renames — e.g. `.cms-image-text*` → `.media-text*`, `.brand-grid*` → `.brand-list*`, `.shop-header*` → `.header-shop*`, `.product-grid*` → `.product-listing-grid*`, `.error-404-page*` → `.page-not-found*`, `.basic-hero-slider*` → `.hero-slider*`, plus `is-` state-modifier prefixes dropped (`.breadcrumbs-item--is-active` → `--active`, `.swatch-chip.is-selected` → `.swatch-chip--selected`). `Container` uses `.s-scontainer` as its root block.

- **Breaking: locale key renames** — `lightboxGallery.*` → `mediaGallery.*`, `colorSwatch.*` → `swatchChip.*`, `searchInput.*` → `inputSearch.*`, `passwordInput.*` → `inputPassword.*`, `savingsBadge.*` → `badgePromotion.*`, `shopHeader.*` → `headerShop.*`; `couponCodeInput.*` removed (reuses `cart.couponCode` and `inputSearch.clear`).

### Removed

- **Breaking:** `BuyBox` (static demo), the `InpageNavigation*` family (covered by `CategoryCardGrid` / `CategoryCardSlider`), `CmsContainer` / `ContainerContent`, `PageHeader`, `CategoryNodeButton`, `LightboxModal` (use `Lightbox` from UI Kit), `FilterBarQuickFilters`, `MobileMenuButtonGrid`, `GridCardContent` / `GridCardTextContent`, and `FooterMenuItem` / `FooterTitle` (replaced by `NavLinkItem` / `NavSectionHeading`).
- **Breaking: components moved to UI Kit** — `Card`, `Iframe`, `DarkModeSwitch`, `BuyBoxStockInfo`, `LanguageSwitcher`; `Media` (import `MediaPreview` directly).
- **Breaking: sections/blocks deleted with Studio migration** — `SectionBlogSlider` / `SectionFlexibleContentSlider` → `SectionContentSlider`; `SectionCardGrid` → `SectionContentGrid`; `SectionInpageNavigation*` → `SectionCategoryCardGrid` / `SectionCategoryCardSlider`; `SectionFilterBar` (now block-only as `BlockFilterBar`); `SectionShopHeaderNavigation` (demoted into `BlockMenuSideBySide`); `BlockProductReviews` → `SectionProductReviews`.

## [1.32.5]

### Fixed

- Fixed Card `RichContent` prop (`:content` → `:html`), simplified SocialShare layout, and wrapped BlogPostDetail content in a container div.

## [1.32.4]

### Fixed

- Prevented breadcrumb item text from wrapping by applying single-line text-overflow with ellipsis.

## [1.32.0]

### Added

- Added the `$tl` Vue global for locale translations and expanded the locale system with 13 new message groups, full German translations, and umlaut fixes. Migrated 46 components from `useLocale().t` to `$tl` template calls.

### Fixed

- Use correct hover font-colors for some elements.

## [1.31.0]

### Changed

- `LanguageSwitcher` now uses market-domain data for available locales instead of the removed `useLocalesData` composable. Locale props are threaded through Header, TopBar, MobileMenu, and MegaMenu components, and sections use `useAvailableLocales` for navigation-based locale switching.
- Migrated URL fields from `text` to `link` type and resolve links through `linkResolver` for market-aware URL resolution.

## [1.30.0]

### Changed

- Wrapped all component CSS in `@layer lui-components` for cascade layer control, allowing consumers to override component styles with unlayered CSS without needing `!important`. Existing `@layer lui-overridable` blocks (Icon, Text) are preserved. A new ESLint rule (`laioutr/require-css-layer`) enforces that all new component CSS is layered.

## [1.28.1]

### Changed

- Show filter-bar sorting only if sortings are available; made the BuyBoxStockInfo icon optional.

## [1.28.0]

### Changed

- Fixed links in the basic header and the logo banner, made `SectionLogoPresentation` respect link fields, fixed pricing table width, and fixed mobile menu hierarchy in `SectionBasicHeader`.

## [1.26.0]

### Added

- Implemented the Breadcrumb section.

## [1.25.0]

### Added

- Added the Error 404, Pricing Plans, and Pricing Table sections.

## [1.24.3]

### Fixed

- Fixed a hydration error that broke the page when the Header component with submenus was used.

## [1.24.0]

### Added

- Added support for multiple CTAs in the basic header.
- Added support for calling PDPs with variant option-values.

## [1.20.0]

### Added

- Implemented the SearchOverlay with actual data.

## [0.20.0]

### Changed

- Updated the cart-sheet implementation.

## [0.17.5]

### Changed

- Shopware implementation, minor UI fixes, and quality-of-life improvements.

## [0.17.0]

### Added

- Added the Integrated Shop Header section.

## [0.16.0]

### Added

- `SectionShopHeader` opens an empty cart.
- Show `isSoldOut` status in DetailAddToCart and connect LightboxModal to ProductImageGallery.

### Fixed

- Fixed a missing import in CartSheet, IconButton sizing, and variant preview sizes.

## [0.15.0]

### Added

- Adjusted types and implemented the filter bar.

## [0.14.1]

### Changed

- Studio refresh compatibility.

## [0.14.0]

### Changed

- Improved the LCP loading strategy.

## [0.13.0]

### Changed

- Accessibility improvements for desktop navigation and slider navigation.

## [0.12.0]

### Added

- Fixed missing links, added `robots.txt` and page SEO meta.

## [0.10.2]

### Fixed

- Fixed Shopify product prices and made minor frontend adjustments.

## [0.10.0]

### Changed

- Fixed CSS layer order and Swiper styles.

## [0.9.0]

### Added

- Added a few sections and blocks; changed definition default behaviour.

## [0.6.0]

### Added

- Added section definitions in preparation for the Shopify demo.

## [0.5.0]

### Changed

- Migrated base components to UI Kit.

## [0.4.0]

### Added

- Media Library upload handling and improved documentation generation from canonical types.

## [earlier versions]

Earlier `0.x` releases and the intervening patch releases not listed above contained only internal changes and cross-package dependency updates with no user-facing UI changes.
