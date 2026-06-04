---
title: UI Changelog
description: Changelog for Laioutr UI and UI Kit following Keep a Changelog and Semantic Versioning.
seo:
  title: UI Changelog | Laioutr
  description: Changelog for Laioutr UI and UI Kit following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-changelog
  lastmod: 2026-05-28
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI**, **UI Kit**, and related component libraries will be documented in this file.

## [2.3.0]

### Added

- **UI Kit**: `<Media>` is now a dispatcher that renders video and audio, not only images. Built-in native `<video>` and `<audio>` players handle progressive sources out of the box (showing the video `poster` / audio `cover`), with playback controlled by props on `<Media>` (`controls`, `autoplay`, `muted`, `loop`, `playsinline`). Register a renderer with `provideMediaRenderers` to override the built-in for adaptive streaming (HLS/DASH) or a custom player UI. See [Rendering video and audio](/laioutr-ui/ui-kit/general/media#rendering-video-and-audio).

### Changed

- **UI**: **Breaking** — `BrandList` is replaced by the generic `AlphabeticalIndex` component. `AlphabeticalIndex` is an A-Z grouped link list with a configurable `heading` and an optional per-item `count`, usable for brands, glossaries, and similar indexes. Migrate by importing the new component, renaming the `brands` prop to `items`, and passing `heading` explicitly — the old built-in `"Brands"` translation no longer renders automatically.

## [2.2.2]

### Added

- **UI App**: New `backgroundAwareButtonFields` shared field exposes three `Adaptive *` CTA-variant options alongside the existing literal `ButtonVariant` options. Every section and block with a CTA now uses this field — banner sections, the sliders, `BlockButton`, `BlockCard`, `BlockText`, and now also the header, footer email button, 404 page, and pricing-plan card, whose CTAs newly adapt to their surrounding surface tone. Editors opt into per-surface remapping by picking an `Adaptive *` option.

### Changed

- **UI**: **Breaking** — `BackgroundAwareButton`'s adaptive lookup variants renamed to `adaptive-primary` / `adaptive-secondary` / `adaptive-ghost` (previously `primary` / `secondary` / `ghost`), so they no longer shadow `Button`'s literal `primary` / `secondary` variants. The pass-through variants (`tertiary`, `secondary-white`, `ghost-*`, `glass-*`, `subtle`, `info`, `positive`, `danger`, `close-*`) are unchanged. Custom themes overriding `backgroundAwareButtons` in `defineTheme` / `extendTheme` need their map keys renamed accordingly (e.g. `light:light:primary` → `light:light:adaptive-primary`, same for `secondary` and `ghost` across all `light|dark` × `light|dark|bright` combos).
- **UI App**: **Breaking** — Stored Studio CTAs where an editor previously picked "Primary" or "Secondary" will, after upgrade, render as the literal Button variant on the storefront — the per-surface remap is no longer applied unless the editor re-selects an `Adaptive *` option.

## [2.2.1]

### Added

- **UI Kit & UI App**: New `Sizer` primitive in `ui-kit` and matching `sizingField` shared schema in `ui-app`. Banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) plus `BlockMedia` and `BlockIframe` now route outer-box sizing through `Sizer` instead of bespoke per-block fields. Banner blocks also gain vertical content alignment (2D on Basic, vertical-only on Integrated). `Placeholder` accepts an optional `text` prop.
- **UI App**: Caption styling on `BannerBasic` — plain/boxed variant, colour scheme, and text-shadow controls, replacing the previous colour-only override. New `captionVariantField` shared field in `@laioutr-app/ui` bundles the controls into a single sidebar group on `BlockBannerBasic` and `SectionProductSliderShowcase`.

### Changed

- **UI**: `Container` no longer strips border-radius from CTA banners in full-width containers — banners now own their own radius.
- **UI**: **Breaking** — `BannerBasic` replaces `captionColor: string` with `captionVariant: Omit<CaptionFlagProps, 'text'>`. Migrate `<BannerBasic :caption="caption" caption-color="#ff0000" />` to `<BannerBasic :caption="caption" :caption-variant="{ variant: 'plain', textShadow: 'none' }" />`.
- **UI App**: **Breaking** — `SectionProductSliderShowcase` schema replaces `captionStyle.color` with `captionVariant`. Existing pages with values stored under `captionStyle` silently drop them on next save — re-author the caption styling via the new Variant panel in Studio.
- **UI**: **Breaking** — `BannerBasic` no longer accepts `sizing` / `aspectRatio` props. Wrap in `<Sizer>` in the consuming Block.
- **UI Kit**: **Breaking** — `MediaPreview` no longer accepts `aspectRatio`, `height`, or `orientation`. Wrap in `<Sizer :sizing="…">` (or any parent that provides a definite height) and let `MediaPreview` fill it. Portrait-orientation behavior is now done by typing a portrait `aspect-ratio` directly in the schema (e.g. `3/4`).
- **UI App**: **Breaking** — `BlockMedia` drops `aspectRatio`, `height`, and `orientation` schema fields; `BlockIframe` drops `desktopHeight` and `mobileHeight`. Existing pages with values stored under these names silently drop them on next save — author the desired height via the new `sizing` field in Studio.

### Fixed

- **UI**: `ProductSliderShowcase` padding and width — slider no longer reserves bleed padding on the wrapper (relied on full-bleed parent), banner respects its container, and the slider fills the remaining row width on desktop.
- **UI Kit**: Fixed `SwiperChrome` mobile navigation positioning.

### Removed

- **UI Kit**: **Breaking** — `Iframe` component removed from `@laioutr-core/ui-kit`. Consumers wrapped it for a single iframe with fixed mobile/desktop heights — inline an `<iframe class="…" :src :title />` directly and let `Sizer` (in your Block) drive the height.

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

## [2.0.0]

Coordinated major refactor across `@laioutr-core/ui-kit`, `@laioutr-core/ui`, and `@laioutr-app/ui`. Touches imports, auto-import prefixes, prop names, CSS classes, locale keys, and stored Studio configurations. Stored Studio data, custom themes, template tags, and external CSS overrides all require a one-time migration.

### Added

- **UI Kit**: New atoms and molecules — `IconButton` (icon-only button with required `label`/`icon`), `TextGroup` (caption + heading + subline with `captionTag`/`headingTag`/`sublineTag` + size tiers), `OnSurface` (surface-tone context, replaces `OnBackground`), `LinkTile` (with `basic`/`compact`/`compact-bordered`/`big` variants, replaces `CategoryCard`), `HighlightToggle` (generic two-way `v-model` toggle, replaces `BillingCycleSwitch`), `StatusMessage` (icon-led message composition, replaces `LoginReviewPanel`), `MediaStage` (replaces `CtaBannerBase`), `BadgePromotion` (replaces `SavingsBadge`), `Iframe` (sandboxed iframe wrapper), `InputPin`, `InputAutocomplete`, `InputCombobox`, `InputSlider`, plus reka-ui-backed `Tabs`, `Popover`, `ContextMenu`, `Listbox`. `NavLinkItem` / `NavSectionHeading` replace the old `MenuLinkItem` / `MenuSectionTitle` / `FooterTitle`. New `SwiperChrome` composition (caption/heading/subline + Swiper chrome + action buttons). `useSwiperEdgeState`, `useFieldContext`, `useSurfaceTone` composables consolidate previously duplicated wiring.
- **UI**: New components — `Container` (backdrop + grid + alignment + media-sizes), `MegaMenu` compound (`MegaMenu` + `MegaMenuTrigger` + `MegaMenuContent`), `BlogPostDetail`, `ProductDetail`, `ScrollAnchor`, `BlogPostListing`, `PopUp` shell with `PopUpInfo` / `PopUpNewsletter` / `PopUpPromotion` presets, `SortModes`, `SearchAutoSuggest` (replaces `SearchOverlayInput`), `CategoryCardGrid` / `CategoryCardSlider` (built on `LinkTile`, replacing the InpageNavigation family), `EditorialGrid` (was `ArticlesGrid`), `PersonaQuoteSlider`, plus the renamed BuyBox-prefixed components — `PriceInfo`, `ProductTitle`, `QuantityDiscount`, `EnergyLabel`, `BenefitsBox`, `CouponBox`, `AddToCart`.
- **UI App**: New sections — `SectionContentGrid` (hybrid slot/query, replaces `SectionCardGrid`), `SectionEditorialGrid`, `SectionCategoryCardGrid`, `SectionProductReviews` (replaces `BlockProductReviews`), reshaped `SectionUspBanner` (with extracted `items` slot of `BlockUspBannerItem` children), `SectionContentSlider` (hybrid slot/query). New blocks — `BlockCategoryCard`, `BlockUspBannerItem`, `BlockProductsListing`, `BlockFilterBar`, `BlockSortModes`, `BlockPagination` (split out of the former `SectionProductListing`), `BlockMobileMenuBasic` / `BlockMobileMenuShop` (host `mobile` slot), `BlockMenuSideBySide` / `BlockMenuHeaderBasic` (host `desktop` slot), `BlockMegaMenu`, `BlockProductDetailVariantSelectorOptions`.

### Changed

- **UI**: **Breaking** — auto-import prefix unified to `L`. `@laioutr-core/ui` previously registered components with `Lui`; it now uses `L`, matching `@laioutr-core/ui-kit`. Every `<Lui*>` tag pointing at a `ui` component must be renamed to `<L*>` (e.g. `<LuiProductSlider>` → `<LProductSlider>`). Consumers can run a single `<Lui` → `<L` sweep across templates regardless of which package a component ended up in.
- **UI Kit**: **Breaking** — `Button.type` prop removed (use the new `IconButton` for icon-only buttons). Sizes `'small' | 'medium' | 'large'` → `'xs' | 's' | 'm' | 'l'` (default changes from `'medium'` to `'m'`). `ButtonVariant` flattened to a single 14-value union; `'input-field'` → `'subtle'`; `'video-control'` removed. Icon slots replaced by `iconLeft` / `iconRight` props (`IconName`). `isLoading` → `loading`; clicks are blocked while loading. New `spinnerType?: 'row' | 'round'`. `BackgroundAwareButtonVariant` rebuilt; theme-level `backgroundAwareButtons` maps must rewrite their entries (removed: `glass`, `white-secondary`, `white-ghost`, `black-ghost`, `white-close`, `black-close`, `black-close-always-black`, `white-close-always-white`, `input-field`; added: `secondary-white`, `ghost-white`, `ghost-black`, `close-white`, `close-black`, `subtle`, `glass-black`, `info`).
- **UI Kit**: **Breaking** — surface-tone migration. `BackgroundBrightness` → `SurfaceTone` (`'light' | 'dark' | 'bright'`) across Field, Input, Switch, Select, Checkbox, `InputRadio`, and Swatch families. `OnBackground` deleted; use `OnSurface` + the new `useSurfaceTone()` composable. `colorToBackground` renamed to `colorToSurfaceTone`. `Backdrop.containerBackground` / `backgroundBrightness` props removed (use `:background` directly and let `colorToSurfaceTone` derive the tone, or pass `:surface-tone` explicitly). `MediaPreview.mode` → `surfaceTone`; BEM root `.media-block` → `.media-preview`. New CSS tokens `--on-light-*` / `--on-dark-*` / `--on-bright-*`. `BackgroundAwareBackdropSet` drops the `'default'` literal — theme presets must spell `none: 'light'` directly.
- **UI Kit**: **Breaking** — `Banner` refactor. `BannerBasic`, `BannerShowcase`, `BannerIntegrated` no longer expose a `variant` prop; the `BannerBasicVariant` / `BannerShowcaseVariant` / `BannerIntegratedVariant` types are removed. Border-radius is now context-driven via the new `.radius-contained` utility class. `MediaStage` no longer hardcodes `border-radius`.
- **UI Kit**: **Breaking** — form prop normalization. `Field` legacy `error: string` removed (use `errorMessage: string` for the displayed message, `invalid: boolean` for the visual error state; `Field` auto-derives `isInvalid` from `errorMessage` when `invalid` is unset). `Input` / `InputAutocomplete` / `InputCombobox`: `isError` → `invalid`. `Label`: `error: boolean` → `invalid: boolean`; BEM `label--error` → `label--invalid`. `Switch` and `Checkbox` v-model channel renamed from `'checked'` to default `'modelValue'` — `v-model:checked` callsites must become `v-model`. `Switch.size: 'small' | 'medium'` → `'s' | 'm'`. `Select.size` prop removed (express size via `:trigger="{ size: 's' }"`).
- **UI Kit**: **Breaking** — `is*` prefix dropped for component-self props (world-state facts like `isUserLoggedIn`, `isAboveTheFold`, `isSoldOut`, `isVerified`, `isFreeDelivery`, `isShippingFree`, `isLoggedIn` keep `is*`). Notable renames: `Badge.isRounded` → `rounded`; `Button.isLoading` → `loading`; `Label.isRequired` → `required`; `Toast.isOpen` → `open`; `LinkTileBig.isBackgroundDark` → `backgroundDark`; `Pagination.isNavigationNumbers` → `variant: 'arrows' | 'numbers'`; `OptionTileImage` / `OptionTileText` flatten `notAvailable: { isNotAvailable, notAvailableTooltip }` to `unavailable?: boolean` + `unavailableTooltip?: string`.
- **UI Kit**: Component renames (file path, exported `*Props` type, auto-imported tag, and BEM block class all follow the new name). Highlights: `SwatchPreview` → `Swatch`, `ColorSwatch` → `SwatchChip`, `SwatchItem` → `SwatchOption`, `ProductTilesSwatches` → `SwatchSummary`, `Radioselect` → `InputRadio`, `PasswordInput` → `InputPassword`, `SearchInput` → `InputSearch`, `RatingInput` → `InputRating`, `PinInput` → `InputPin`, `VariantOptionSelectorButton` → `OptionTileText`, `VariantOptionSelectorImage` → `OptionTileImage`, `VariantSelectorMultipleVariant` → `VariantSelectionCard`, `ZoomLevelMobile` → `ZoomLevelSegmented`, `ZoomLevelDesktop` → `ZoomLevelStepper`, `NewsletterInputBox` → `EmailInputForm`, `MediaLightbox` → `Lightbox`, `SwiperNavigationBullets` → `SwiperBullets`, `SwiperNavigationNumbers` → `SwiperNumbers`, `SwiperNavigationCompact` → `SwiperNavBar`, `SwiperFadeoutArrows` → `SwiperArrows` (and `hasFadeoutBackground` → `fadeout`, default `true`), `SwiperThumbnailsSlider` → `ThumbnailsSlider`, `LoginReviewPanel` → `StatusMessage`, `BuyBoxStockInfo` → `StockInfoSummary` (`size` `'small' \| 'medium'` → `'s' \| 'm'`).
- **UI**: Component renames (file paths, exported `*Props` types, BEM blocks, Storybook titles, and `luiComponentDirs` entries all follow the new name). Highlights: `Header` → `HeaderBasic`, `ShopHeader` → `HeaderShop`, `BasicHeroSlider` → `HeroSlider`, `BasicHeroSliderSlide` → `HeroSlide`, `MegaMenuDesktop` → `MegaMenu` compound (full prop replacement), `MobileMenu` → `MobileMenuBasic`, `MegaMenuMobile` → `MobileMenuShop`, `SideBySideMenu` → `MenuSideBySide`, `ArticlesGrid` → `EditorialGrid`, `CardGrid` → `ContentGrid`, `GalleryContentSlider` → `ContentSlider`, `BrandGrid` → `BrandList`, `CmsImageText` → `MediaText`, `LightboxGallery` → `MediaGallery`, `SearchResultHeader` → `SearchResultHero`, `Error404Page` → `PageNotFound`, `BuyBoxEnergyLabel` → `EnergyLabel`, `BuyBoxBenefitsBox` → `BenefitsBox`, `BuyBoxPriceInfo` → `PriceInfo`, `BuyBoxApplyDiscountCode` → `CouponBox`, `BuyBoxQuantityPrices` → `QuantityDiscount`, `BuyBoxProductInfoBasic` → `ProductTitle`, `BuyBoxCartButton` → `AddToCart`, `MultipleVariantSelection*` → `VariantSelectorMultiple*`, `MultipleVariantSelectionSheet` → `VariantOffCanvas`, `VariantSelection*` → `VariantSelectorOptions*`, `FilterSheet*` → `FilterOffCanvas*`, `ProductGrid` → `ProductListingGrid`, `QuoteSlider` → `QuoteCardSlider`, `CartCouponCodeForm` → `CartCouponCodeAccordionInput`, `CartEmptyState` → `EmptyStateCart`, `CartFreeDeliveryProgress` → `FreeDeliveryProgress`, `PricingCard` → `PlanCard`, `PricingGrid` / `PricingCardSlider` → `PlanCardSlider`, `PricingTable` → `PlanComparisonTable`.
- **UI**: **Breaking** — `HeaderBasic` / `HeaderShop` slot-based refactor. Both expose `desktop` and `mobile` named slots filled by the hosting Section. `HeaderBasic` removes `menuItems`, `mobileMenuItems`, `socialLinks` props; `HeaderShop` removes `navigationMenuItems` prop and `navigationItemClick` event. Both emit `menuClick` when the mobile hamburger is activated. `HeaderMenuContext` coordinates open / selected state.
- **UI**: **Breaking** — `HeaderBasicMenu.textColor` → `surfaceTone` (semantic flip). The previous `textColor` named the foreground colour; the new `surfaceTone` names the surface against which the foreground is rendered. Old `textColor: 'dark'` (dark text on light bg) maps to new `surfaceTone: 'light'`; old `textColor: 'light'` maps to `surfaceTone: 'dark'`. The default flips from `'dark'` to `'light'` accordingly. Migrate by inverting the value, not just renaming the prop. `HeaderBasic.textColor` (the header-level prop) is unchanged.
- **UI**: **Breaking** — `MegaMenu` (was `MegaMenuDesktop`) complete API replacement. Old props `colorMode` / `isOpen` / `megaMenuItems` / `contentLayout` are gone. New props `items: MegaMenuItem[]`; `surfaceTone?: 'light' | 'dark'`; `defaultValue?: string`; `delayDuration?: number`; `skipDelayDuration?: number`. Trigger / content split into `MegaMenuTrigger` / `MegaMenuContent` compound parts. Promo-slot layout auto-derived from child count (`--narrow` / `--flex` / `--grid`).
- **UI App**: **Breaking** — section renames requiring Studio data migration. `SectionBasicHeader` → `SectionHeaderBasic`; `SectionBasicHeroSlider` → `SectionHeroSlider`; `SectionImageAndContent` → `SectionMediaText`; `SectionTestimonialPersonaQuote` → `SectionPersonaQuoteSlider`; `SectionTestimonialQuoteCardSlider` → `SectionQuoteCardSlider`; `SectionBrandLink` → `SectionBrandList`; `SectionSearchResultHeader` → `SectionSearchResultHero`; `SectionPricingPlans` → `SectionPlanCardSlider`; `SectionPricingTable` → `SectionPlanComparisonTable`; `SectionPageHeader` / `SectionCategoryHeader` → `SectionPageHero`; `SectionShopHeader` → `SectionHeaderShop`; `SectionError404` → `SectionPageNotFound`; `SectionProductDetailContainer` → `SectionProductDetail`; `SectionLogoPresentation` split into `SectionLogoSlider` / `SectionLogoGrid` (by old `view` discriminator); `BlockCtaBannerBasic` / `Integrated` / `Showcase` promoted to `SectionBannerBasic` / `SectionBannerIntegrated` / `SectionBannerShowcase`; `SectionBannerContainer` → `SectionContainer` (consolidated).
- **UI App**: **Breaking** — block renames requiring Studio data migration. `BlockBasicHeroSliderSlide` → `BlockHeroSliderSlide`; `BlockTestimonial` → `BlockPersonaQuote`; `BlockProductGrid` → `BlockProductsListing`; `BlockQueryPagination` → `BlockPagination`; `BlockQuerySorting` → `BlockSortModes`; `BlockCmsButton` → `BlockButton` (Studio label `CMS Button` → `Button`); `BlockCmsCardContent` → `BlockCard`; `BlockSingleLogoPresentation` → `BlockLogoSliderSlide`.
- **UI App**: **Breaking** — schema field normalization across 30+ sections/blocks. `blockMargin` → `margin` (uses `marginField` preset); `blockPadding` → `padding` (uses `paddingField` preset); `contentColor` → `backgroundBrightness` (enum remap: `on-light` → `light`, `on-dark` → `dark`, `on-bright` → `bright`) on `SectionProductSliderShowcase`, dropped on `SectionProductSlider`; `textAlignment` → `alignment`; `actionButton[0]` (array) → `cta` (object via `buttonFields`) + `ctaVisible`; `sectionBackground` / `themePresets` / `customBackground` → `background` + `customBackground` (via `backgroundFields`); `headline*` → `heading*`; `SectionBrandHero.background` (media) → `backgroundImage`; `accordionStyle` (`BlockAccordion`) → `variant`; `image` (`SectionNewsletterRegistration`) → `media`; `overlay` / `overlayStyle` / `overlayOpacity` (`BlockHeroSliderSlide`) → `backgroundOverlay` (object; `variant === 'off'` means no overlay); `buttonText` / `buttonLink` / `buttonVariant` (`BlockCard`) → `cta` (object); `productFlags` → `showFlags`. `is*`-prefixed schema fields (`isSticky`, `isSaleDesign`) are kept unchanged so stored configurations continue to bind.
- **UI App**: **Breaking** — `ctaButton.variant` enum reshaped from 12 to 14 values via the new `buttonFields.variant` (sourced from `buttonVariantOptions`). Stored values across `BlockText.cta`, `SectionProductSlider.button`, all banner CTAs, etc. need a one-time remap: `white-ghost` → `ghost-white`, `glass` → `glass-black`, `white-secondary` → `secondary-white`, `black-ghost` → `ghost-black`, `white-close` → `close-white`, `black-close` → `close-black`, `input-field` → drop or map to `subtle`, `black-close-always-black` → `close-black` (loses `always-black` semantics), `white-close-always-white` → `close-white` (loses `always-white` semantics). New variants without a predecessor: `tertiary`, `positive`, `danger`, `subtle`, `info`.
- **UI App**: **Breaking** — section / block deletions requiring Studio data migration. `SectionBlogSlider`, `SectionFlexibleContentSlider` → `SectionContentSlider` (now hybrid slot/query); `SectionTestimonialQuoteCard` → `SectionQuoteCardSlider` with a single slide; `SectionCardGrid` → new `SectionContentGrid` (default `dataSource: 'slot'`); `SectionInpageNavigationBasic` / `Big` / `Compact` → `SectionCategoryCardGrid` / `SectionCategoryCardSlider`; `SectionAmbiendoHeader` → `SectionHeaderShop` with `BlockMenuSideBySide` in the new `menu` slot; `SectionShopHeaderNavigation` demoted into `BlockMenuSideBySide` inside `SectionHeaderShop.desktop` / `SectionHeaderBasic.desktop`; `BlockProductReviews` → `SectionProductReviews`; `BlockInpageNavigationBasicGrid` removed.
- **UI Kit & UI**: Component i18n key renames. `lightboxGallery.*` → `mediaGallery.*`; `colorSwatch.*` → `swatchChip.*`; `searchInput.*` → `inputSearch.*`; `passwordInput.*` → `inputPassword.*`; `savingsBadge.*` → `badgePromotion.*`; `mediaLightbox.*` → `lightbox.*`; `shopHeader.*` → `headerShop.*`. New keys for `MediaPreview`, `ZoomLevel`, `SocialShare`, `Pagination`, `Select`, `InputAutocomplete`, `InputCombobox`, `InputCheckbox`, `InputSlider`, `InputRating`, `RatingProgressBarFilter`, `PopUpNewsletter`, `UspBanner`, `Cart`, `SearchAutoSuggest`, `SliderNavigation`. Removed: `couponCodeInput.*` (consumers reuse `cart.couponCode` and `inputSearch.clear`).
- **UI Kit**: BEM and CSS class cleanup. Mismatched block names normalised to component names; single-dash modifiers fixed to double-dash; missing root BEM classes added. State-modifier prefix `is-` no longer used in BEM class names. `<style scoped>` / `:deep()` / `:global()` removed across `Toaster`, `Swatch`, `QuantityPicker`, `ThemeEditor`, `Link`, `Placeholder`, `SwatchChip`, `PlanComparisonTable`, `PopUp`, `HeaderBasic`. Outer chrome stripped from primitives (`Separator.margin`, `Label` root padding, `InputGroupAddon` root padding, `InputRating` root `align-self`, `SwiperBullets` centering wrapper, `ThumbnailsSlider` outer padding) — consumers apply layout chrome at the call site.
- **UI Kit**: `Card` redesigned. `size: 'default' | 'small' | 'medium' | 'large'` → `'m' | 'l'` (default `'m'`). New props `caption`, `subline`, `description: string | HtmlFragment`, `aspectRatio`, `icon`, `iconBackground`, `textSize`, `textAlignment`, `linkText`. `CardProps` / `CardCta` are declared inline in `Card.vue` (the old `Card/types.ts` is deleted).
- **UI**: `MenuMegaMenu` content-slot layout auto-derived from child count (0 → no content area, 1 → narrow, 2 → row/column, 3+ → 2×2 grid). New `twoSlotDirection: 'row' | 'column'` (default `'row'`) controls the only design-variable case.
- **UI**: `SectionFilterBar` removed; the filter bar is now block-only as `BlockFilterBar`. Hosting Section provides background/margin/padding/style.
- **UI**: `BrandHero` uses the context-aware `.radius-contained` utility; the hardcoded `border-radius: 0` is removed.
- **Dependencies**: `reka-ui` bumped from `^2.3.1` to `^2.9.6` (introduces the `Autocomplete` primitive used by `InputAutocomplete`).

### Removed

- **UI Kit**: `OnBackground` (use `OnSurface`), `BillingCycleSwitch` (use `HighlightToggle`), `CategoryCard` (use `LinkTile`), `Breadcrumb` (moved to `@laioutr-core/ui` as `BreadcrumbsItem`, the `isProduct` prop is gone), `Menubar`, `Stepper`, `HoverCard` (unused), `DiscountFlag` (use `Badge` with `leftIcon` and the default slot), `SavingsBadge` (replaced by `BadgePromotion`), `SwiperNavigationNumbersWithArrows` (reachable via `SwiperNavBar` with `navigationStyle="numbers"`). `BackgroundAwareBackdropSet`'s `'default'` literal dropped.
- **UI**: `BuyBox` (compose from blocks at runtime), `InpageNavigation*` family (use `CategoryCardGrid` / `CategoryCardSlider`), `CmsContainer` / `ContainerContent` (inline the markup or use Section/Block), `Iframe` (moved to `ui-kit`), `Card` (moved to `ui-kit`; `cta` prop type is now inline `CardCta`), `DarkModeSwitch` / `BuyBoxStockInfo` / `LanguageSwitcher` (moved to `ui-kit`), `Media` (use `MediaPreview` from `ui-kit` directly), `FooterMenuItem` / `FooterTitle` (replaced by `NavLinkItem` / `NavSectionHeading`), `LightboxGallery` (renamed to `MediaGallery`), `PageHeader` (Section-level page heroes now compose `LTextGroup` and `Backdrop` directly), `CategoryNodeButton` (replaced by `MenuSideBySideNode`), `CategoryCard` (replaced by `LinkTile`; the node `variant` field is renamed to `cardVariant`), `LightboxModal` (replaced by `Lightbox` in `ui-kit`), `FilterBarQuickFilters` (UI integrated into `FilterBar`), `MobileMenuButtonGrid` (folded into `MobileMenuShared`), `FooterMenuDesktopItem` (folded into `FooterMenu`), `CategoryHeaderBasic` (built from page-hero + section composition), `GridCardContent` / `GridCardTextContent` (flow through `Card` slots).
- **UI App**: `shared-fields/backdrop.ts` (replaced by `background` / `margin` / `padding` presets), `shared-fields/ctaButton.ts` (replaced by `shared-fields/button.ts` + `shared-fields/buttonVariant.ts`).
- **UI App**: Section / block schema fields dropped — `SectionBreadcrumbs.colorMode` (entire `Style` fieldset); `SectionNewsletterRegistration.textColor` / `legal`; `SectionPersonaQuoteSlider.textColor`; `SectionQuoteCardSlider.cardStyle` / `profilePicture`; `SectionCategoryCardSlider.hasSubCategories` / `colorMode`; `SectionUspBanner.bannerStyle` / `colors`.

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