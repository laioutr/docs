---
title: UI Kit Changelog
description: Changelog for Laioutr UI Kit (@laioutr-core/ui-kit) following Keep a Changelog and Semantic Versioning.
seo:
  title: UI Kit Changelog | Laioutr
  description: Changelog for Laioutr UI Kit (@laioutr-core/ui-kit) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-kit-changelog
  lastmod: 2026-06-09
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI Kit** (`@laioutr-core/ui-kit`, the atomic Vue 3 design-system primitives) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0]

### Added

- `Countdown` component (`#ui-kit/components/Countdown/Countdown.vue`) and a `useCountdown` composable for editorial countdowns. Unit labels come from `Intl.NumberFormat`, so they are localized and plural-aware automatically; the `unitDisplay` prop (`'long' | 'short' | 'narrow'`) sets their verbosity. `Countdown` also takes an optional frozen `now` (for tests/Storybook), and a pure `computeCountdown(endDate, now)` helper is exported. Adds `countdown.expired` and `promotionBanner.{codeCopiedTitle,codeCopiedSubline,copyCodeAriaLabel}` locale entries (EN + DE). `useNow` now accepts an optional tick interval — `useNow(intervalMs = 60_000)` — and is seeded via `useState`, so the shared clock renders byte-identically across SSR and hydration; consumers no longer need `data-allow-mismatch` on time-dependent nodes.
- `target?: string` prop on `LinkTile`, `LinkTileBasic`, `LinkTileCompact`, `LinkTileBig`, and `NavigationMenuTextItem`. Forwarded to the underlying `NuxtLink` / `MaybeLink` to open the link in a new browsing context (`_blank`), with `_self` remaining the default.
- `sectionBrandList.heading` and `sectionGlossaryList.heading` translation keys (EN: "Brands"/"Glossary", DE: "Marken"/"Glossar"). These act as the locale-aware fallback heading when an editor leaves the section's `heading` field empty.
- `rel?: string` prop on `Button` and `IconButton`. Forwarded to the underlying `NuxtLink` only when the component renders as a link (`href` set), ignored when rendered as a `<button>`. Accepts any valid HTML `rel` token or space-separated combination — e.g. `'prev'`, `'next'`, `'noopener'`, `'noopener noreferrer'`, `'external nofollow'`.
- `BlockProductDetailEnergyLabel` on the Product Detail page. Renders the EU energy efficiency label: an inline energy-class badge (opening the full label in a lightbox) and an optional product data sheet link. Backed by a new `ProductVariantEnergyLabel` canonical-types entity component and a new `EnergyLabel` ui component. Adds the `pdp.energyLabel` i18n key (EN + DE), used as the fallback alt text for the energy-label badge image. (Adapter packages still need to implement the `ProductVariantEnergyLabel` resolver before storefronts render data.)

### Changed

- `Media` is now a dispatcher. Images render via the built-in image renderer (unchanged public prop API and DOM/CSS output). Video and audio now render via new built-in native renderers: `MediaVideo` (native `<video>`) and `MediaAudio` (native `<audio>` with the optional `cover` shown above it). A `Media` value of any type renders out of the box with no registration. Playback is controlled by new flat props on `<Media>`, mirroring the HTML attributes 1:1: `controls` (default `true`), `autoplay`, `muted`, `loop`, `playsinline` (default `false`). These are set by the consuming Block, not carried on the `Media` value. Consumers can override the built-in renderer for a media type (e.g. for HLS/DASH or a custom player):

  ```ts
  // plugins/media-renderers.ts
  import { provideMediaRenderers } from '#ui-kit/components/Media/MediaRenderersProvider';
  import VidstackMedia from '../components/VidstackMedia.vue';

  export default defineNuxtPlugin((nuxtApp) => {
    provideMediaRenderers(nuxtApp.vueApp, { video: VidstackMedia, audio: VidstackMedia });
  });
  ```

  `MediaStage` now drives its background `<Media>` as a decorative loop (`autoplay muted loop playsinline`, `controls={false}`); a picked video plays silently and loops behind the foreground content. `MediaVideo` suppresses `autoplay` when the user prefers reduced motion (`prefers-reduced-motion: reduce`), settling on the `poster` frame instead.
- `Pagination` now emits SEO-correct sequence semantics when `hrefTemplate` is set: the previous/next anchors carry `rel="prev"` / `rel="next"` only on edges where the target page actually exists; on the first page the previous control renders as a `<button>` (no `href`), and on the last page the next control does the same, so crawlers don't follow dead links to page 0 or page N+1.

### Removed

- **Breaking:** the orphaned `brandGrid.title` translation key — it is no longer referenced anywhere. Consumers that overrode this key in custom locales can delete the override.
- `PromotionBanner` has moved to `@laioutr-core/ui` (promo-codes are commerce-domain). ui-kit no longer exports `PromotionBanner/types` — import from `@laioutr-core/ui` instead.

### Fixed

- Component props that were silently dropped because they didn't match the target component's API: `FeaturePillList` passed `left-icon` to `Badge` (correct prop is `icon-left`), so pill icons never rendered; `OpeningStatusIndicator`, `OpeningStatusDetail`, `LocationCard`, `LocationFinder`, and `LocationHeader` passed a non-existent `variant` to `Text`, so `variant="heading"` headings rendered with default `body` styling; `FilterBar` bound `v-model:open` to `FilterOffCanvas` (which exposes `v-model:isOpen`), so the off-canvas filter panel could not be opened; `PromotionBanner` passed an invalid `type="text"` to `Button`.

## [2.2.3]

### Added

- `$unitPrice` i18n formatter that renders a `UnitPrice` as a localized `price / reference` string (e.g. `13.99 € / 100 ml`), composing the existing `$money` and `$measurement` formatters. Available as a template global alongside `$money` / `$measurement`, and used internally by `VariantSelectionCard`.

### Fixed

- `.radius-contained` collapsing to square corners on tall elements. Inset banners (`BannerBasic`, `BannerShowcase`, `BannerIntegrated`, `BrandHero`) now keep their rounded corners regardless of height — previously a banner taller than the viewport width (common at mobile widths) lost its rounding entirely. Full-bleed, edge-to-edge banners still render square. No action required.
- `OpeningStatus` components and composables now use the shared `now` clock.

## [2.2.2]

### Changed

- `BackgroundAwareButton`'s adaptive lookup variants are now `adaptive-primary` / `adaptive-secondary` / `adaptive-ghost` (previously `primary` / `secondary` / `ghost`), so they no longer shadow `Button`'s literal `primary` / `secondary` variants. The pass-through variants (`tertiary`, `secondary-white`, `ghost-*`, `glass-*`, `subtle`, `info`, `positive`, `danger`, `close-*`) are unchanged. A new `backgroundAwareButtonFields` shared field exposes the three `Adaptive *` options in Studio alongside the literal `ButtonVariant` options, now used by every section and block with a CTA (including header, footer email button, 404 page, and pricing-plan card).

  Custom themes that override `backgroundAwareButtons` in `defineTheme` / `extendTheme` need their map keys renamed accordingly (`light:light:primary` → `light:light:adaptive-primary`, same for `secondary` and `ghost` across all `light|dark` × `light|dark|bright` combos). Stored Studio CTAs where an editor previously picked "Primary" or "Secondary" will render as the literal Button variant after upgrade — the per-surface remap is no longer applied unless the editor re-selects an `Adaptive *` option.

- **Breaking:** `Scrollbar` now owns its interaction and sizing logic and takes `progress` (0..1) and `visibleRatio` (0..1) instead of `thumbSize` / `thumbPosition` (px), and emits `update:progress` instead of `track-click` / `drag-start`. It computes thumb size/position, handles drag and track-click, and hides itself when content fits.

  ```vue
  <!-- Before -->
  <Scrollbar :thumb-size="120" :thumb-position="40" @track-click="onClick" @drag-start="onDragStart" />
  <!-- After -->
  <Scrollbar :progress="0.3" :visible-ratio="0.25" @update:progress="(progress, source) => …" />
  ```

  `source` is `'drag'` (continuous) or `'click'` (jump-to-position).

### Fixed

- `SwiperScrollbar` thumb mis-sizing and mis-positioning under `slidesPerView: 'auto'`: the thumb now reflects true content size (including gaps and uneven slide widths), dragging tracks the cursor, and clicking the track animates to the nearest slide. No API change for `SwiperScrollbar` consumers.

## [2.2.1]

### Added

- Sizing-system consolidation: a new `Sizer` primitive in ui-kit and matching `sizingField` shared schema in ui-app. Banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) plus `BlockMedia` and `BlockIframe` now route outer-box sizing through `Sizer` instead of bespoke per-block fields. Banner blocks also gain vertical content alignment (2D on Basic, vertical-only on Integrated). `Placeholder` accepts an optional `text` prop.

### Removed

- **Breaking:** `Iframe` component removed from `@laioutr-core/ui-kit`. Inline an `<iframe class="…" :src :title />` directly and let `Sizer` (in your Block) drive the height.
- **Breaking:** `MediaPreview` no longer accepts `aspectRatio`, `height`, or `orientation`. Wrap in `<Sizer :sizing="…">` (or any parent that provides a definite height) and let `MediaPreview` fill it. Portrait orientation is now done by typing a portrait `aspect-ratio` directly in the schema (e.g. `3/4`).
- **Breaking:** `BannerBasic` (`@laioutr-core/ui`) no longer accepts `sizing` / `aspectRatio` props. Wrap in `<Sizer>` in the consuming Block.
- **Breaking:** `BlockMedia` drops `aspectRatio`, `height`, and `orientation` schema fields; `BlockIframe` drops `desktopHeight` and `mobileHeight`. Existing pages with values stored under these names silently drop them on next save — author the desired height via the new `sizing` field in Studio.

### Fixed

- `SwiperChrome` mobile navigation positioning.

## [2.2.0]

### Added

- `CaptionFlag` accepts an optional `textShadow?: 'none' | 'soft' | 'strong'` prop. When `'soft'` or `'strong'`, a layered text-shadow improves legibility against busy backgrounds. Defaults to `'none'`, so existing consumers render unchanged. The values resolve from two new global CSS custom properties, `--text-shadow-soft` and `--text-shadow-strong`, so consumers can override them per theme.
- `HighlightedText` atom — renders a string with substring matches wrapped in `<mark>`. Diacritic-insensitive (NFD fold + combining-mark strip), highlights all occurrences, accepts a `highlightClass` for per-instance styling. Replaces the inline highlight loop in `InputAutocomplete`.
- Opening-hours primitives in ui-kit: `useOpeningStatus(openingHours, now)` composable (reactive `isOpen` + next state-change event across a 30-day horizon, respecting IANA timezone and one-off date exceptions), `OpeningStatusIndicator` (open/closed pill), `OpeningStatusDetail` (localized one-liner), `OpeningStatus` (Indicator + Detail combined), and `OpeningHoursWeeklyTable` (weekly schedule as a `DescriptionList`, grouping consecutive same-hours days). Adds `openingStatus.*`, `openingHoursWeeklyTable.*`, and `locationCard.*` i18n keys. (`LocationCard` and `PaymentMethodList` land in `@laioutr-core/ui`.)
- `sectionBackground?: BackdropBackground` prop on `Backdrop`. When set and `containerStyle === 'boxed'`, an outer band element paints edge-to-edge around the constrained `OnSurface` root, creating two distinct color zones. In `full-width` mode the band is inert. Accepts the same value space as `background`; defaults to `'none'`, so existing consumers render identically.
- `block?: boolean` prop on `Button` (and through extension `BackgroundAwareButton`), defaulting to `false`. When `true`, the button switches to `flex` + `width: 100%` and stretches to its container width. New Storybook story: `Block`.
- An HTML-element selector next to every configurable heading/subline field across sections and blocks, via the existing `as: 'style'` decorator popup (no more separate "SEO" panel). Heading options `H1`–`H6` / `DIV`; subline options `P` / `H1`–`H6` / `DIV`. Newly available on 13 sections and 7 blocks. Section defaults: heading → `h2`, subline → `div`. Block defaults: heading → `h3`, subline → `h4`. Components gain additive optional `headingAs` / `sublineAs` props; `Card` gains `headingAs?` / `sublineAs?`; `AlertDialog` gains `titleAs` / `descriptionAs`.
- `buttonFields` exposes a new **Size** selector per CTA (options `xs` / `s` / `m` / `l`, default `'m'`) across every section and block with a CTA, plus a new `buttonSizeOptions` export. ui consumers' CTA shapes (`HeroSlide`, `PageNotFound`, `BannerShowcase`, `ContentGrid`, `HeaderBasic.ctaButtons[]`, slider cta types) accept an optional `size`; `PlanCard` gains `ctaVariant` / `ctaSize`; `SwiperChrome.buttons[]` accepts `size?: ButtonSize`.
- `laioutr:beforeModuleRegister` Nuxt hook. Fires before the ui-kit module registers each upstream Nuxt module, with `{ name, key, options }`. Consumers can mutate `options` to override defaults applied by `registerModule`:

  ```ts
  // nuxt.config.ts
  export default defineNuxtConfig({
    hooks: {
      'laioutr:beforeModuleRegister': ({ name, options }) => {
        if (name === '@nuxt/image') {
          options.providers = { ...options.providers, customProvider: { /* … */ } };
        }
      },
    },
  });
  ```

### Changed

- **Breaking:** `TextGroup` prop and type renames — `headingTag` → `headingAs`, `sublineTag` → `sublineAs`; `TextGroupHeadingTag` → `TextGroupHeadingAs`, `TextGroupSublineTag` → `TextGroupSublineAs`. `TextGroupSublineAs` is widened to include `'h1'`. `SwiperChrome` gets the same rename plus an added `sublineAs`. External consumers that import the old type names or bind `:heading-tag` / `:subline-tag` must update to the new names.
- `SectionProductSlider` / `SectionProductSliderShowcase` lose their dedicated "SEO" fieldset; `headingElement` is now stored at `headingStyle.element`. **Action required:** anyone with stored `headingElement` values on these two sections must re-pick the heading element in Studio once.
- The `highlightMatch` utility now returns segments with `highlight: boolean` (was `matched: boolean`) and finds every occurrence (was only the first).

### Removed

- The `strawberry-field` theme.

### Fixed

- `Card`'s body text not visually centering or end-aligning when `textAlignment` is set — the capped-width body box now follows the chosen alignment via `align-self`, matching the caption/heading/subline.

## [2.1.0]

### Changed

- Elevation shadows now route through the `--shadow-s` / `--shadow-m` / `--shadow-l` design tokens instead of hardcoded `box-shadow` values, so themes overriding these tokens take effect on Card, NavigationMenuContent, Select, ContextMenu, DropdownMenu, AlertDialog, Toast, ThemeEditor, the suggest-input dropdown, PlanCard, PersonaQuote, SearchAutoSuggest, and the variant-selector controls. Default-theme rendering is unchanged.

### Fixed

- `NavigationMenuTextItemWrapper` rendering white text on a light surface when used inside a topbar (`inTopbar` + `surfaceTone="light"`). Items now correctly inherit dark text on a light background. Affects `SectionTopBar` with its default `colorMode="grey"` and any other consumer combining `inTopbar` with `surfaceTone="light"`. No action required.

## [2.0.0]

A large coordinated refactor across the UI layer (`ui-kit`, `ui`, `ui-app`). Only the `@laioutr-core/ui-kit` surface is summarized below; cross-package moves and Studio data migrations are noted where they affect ui-kit consumers. Migration code blocks are preserved verbatim at the end of this entry.

### Added

- New components: `IconButton` (icon-only button; required `label` rendered as `aria-label`, required `icon`), `TextGroup` (caption + heading + subline molecule), `OnSurface` (surface-tone context provider, replaces `OnBackground`), `LinkTile` (replaces `CategoryCard`), `HighlightToggle` (replaces `BillingCycleSwitch`), `StatusMessage` (generic icon-led message, replaces `LoginReviewPanel`), `MediaStage` (replaces `CtaBannerBase`), `BadgePromotion` (replaces `SavingsBadge`, redesigned), `NavLinkItem` (replaces `MenuLinkItem`), `NavSectionHeading` (replaces `MenuSectionTitle` / `FooterTitle`), `SwiperChrome`, `Iframe` (sandboxed wrapper), and the reka-ui atoms `Tabs`, `Popover`, `ContextMenu`, `Listbox`, `InputSlider`, `InputAutocomplete`, `InputCombobox`, `InputPin`.
- New `useSwiperEdgeState()` and `useFieldContext(props)` composables. The Swiper widget family (`SwiperBullets`, `SwiperNumbers`, `SwiperNavBar`, `SwiperArrows`, `SwiperScrollbar`, `ThumbnailsSlider`) and `DarkModeSwitch`, `StockInfoSummary` (was `BuyBoxStockInfo`), `LanguageSwitcher`, `RatingProgressBarFilter`, `CommonSwiper`, and the `swiperBreakpoints` helper move into ui-kit.
- Many new locale keys (countdown, pagination, social-share, variant-selection, opening-hours, and more). New CSS tokens `--on-light-*`, `--on-dark-*`, `--on-bright-*`.

### Changed

- **Breaking — `Button` refactor.** `Button.type` removed (use the new `IconButton`). Sizes `'small' | 'medium' | 'large'` → `'xs' | 's' | 'm' | 'l'` (default `'m'`). `ButtonVariant` flattened to a single 14-value union; `CtaButtonVariant` / `IconOnlyButtonVariant` removed. `'input-field'` → `'subtle'`; `'video-control'` removed. Legacy alias layer dropped (`LegacyButtonVariant`, `normalizeButtonVariant`, `VARIANT_ALIASES`, …). `iconLeft` / `iconRight` now accept `IconName` props instead of `#iconLeft` / `#iconRight` slots. `isLoading` → `loading`; new `spinnerType?: 'row' | 'round'`. `BackgroundAwareButtonVariant` rebuilt to mirror the new shape — theme-level `backgroundAwareButtons` maps must rewrite their value entries.
- **Breaking — surface-tone migration.** `OnBackground` deleted; use `OnSurface` + `useSurfaceTone()` (`useSurfaceTone(props)` resolves explicit prop > nearest ancestor context > `'light'`). `BackgroundBrightness` type removed in favor of `SurfaceTone` (`'light' | 'dark' | 'bright'`) across the Field, Input, Switch, Select, Checkbox, `InputRadio`, and Swatch families. `colorToBackground` → `colorToSurfaceTone`. `Backdrop`'s `containerBackground` and `backgroundBrightness` props removed — pass `:background` directly. `MediaPreview`'s `mode` prop → `surfaceTone`. `provideSurfaceToneContext` → internal `_provideSurfaceToneContext` (only `<OnSurface>` may set tone publicly).
- **Breaking — form prop normalization.** `Field` drops `error: string` (use `errorMessage` + `invalid`). `Input` / `InputAutocomplete` / `InputCombobox`: `isError` → `invalid`. `Label`: `error: boolean` → `invalid: boolean`. `Switch` and `Checkbox`: v-model channel `checked` → default `modelValue` (`v-model:checked` call sites must become `v-model`); `Switch` size `'small' | 'medium'` → `'s' | 'm'`. `Select` `size` prop removed (use `:trigger="{ size: 's' }"`). `InputPassword`: `readOnly` → `readonly`.
- **Breaking — `is*` prefix renames** (drop `is` where the component is the subject): `Badge.isRounded` → `rounded`, `Button.isLoading` → `loading`, `Label.isRequired` → `required`, `ThumbnailsSlider.isCentered` → `centered`, `Toast.isOpen` → `open`, `LinkTileBig.isBackgroundDark` → `backgroundDark`, `Pagination.isNavigationNumbers` → `variant: 'arrows' | 'numbers'`, `OptionTileImage` / `OptionTileText` `notAvailable` object flattened to `unavailable?` + `unavailableTooltip?`.
- **Breaking — other prop / API changes.** `Accordion.accordionStyle` → `variant`. `LoadingSpinner`: `type` → `variant`, color `variant` → `colorScheme`, size `'small' | 'large'` → `'s' | 'l'`. `IconList` size scale → `'xs' | 's' | 'm'`. `Card` redesigned (size → `'m' | 'l'`, many new props, `Card/types.ts` deleted — import `CardProps` / `CardCta` from `Card.vue`). `BadgePromotion` props redesigned (BEM root `.badge-promotion`). `Sheet` drops `component` / `customClass`. Various banner-refactor changes (`variant` prop removed from the three banners; border-radius now context-driven via `.radius-contained`). `reka-ui` bumped `^2.3.1` → `^2.9.6`.
- Numerous BEM/CSS class renames and the removal of `<style scoped>` / `:deep()` / `:global()` across many components (full diff preserved below).

### Removed

- **Breaking:** `OnBackground` (use `OnSurface`), `BillingCycleSwitch` (use `HighlightToggle`), `CategoryCard` (use `LinkTile`), `Breadcrumb` (moved to ui as `BreadcrumbsItem`), `Menubar`, `Stepper`, `HoverCard`, `DiscountFlag` (use `Badge`), `SavingsBadge` (use `BadgePromotion`), `SwiperNavigationNumbersWithArrows` (use `SwiperNavBar` with `navigationStyle="numbers"`).
- Moved out to `@laioutr-core/ui`: `LightboxGallery` (→ `MediaGallery`), `SearchResultHeader` (→ `SearchResultHero`), `ReviewForm`, `SocialShare`, `NavigationNodeButton` (→ `MenuSideBySideNode`).

### Migration — imports and template tags

```diff
- import OnBackground from '#ui-kit/components/OnBackground/OnBackground.vue';
+ import OnSurface from '#ui-kit/components/OnSurface/OnSurface.vue';

- import { colorToBackground } from '#ui-kit/imports/colorToBackground';
+ import { colorToSurfaceTone } from '#ui-kit/imports/colorToSurfaceTone';

- import LightboxGallery from '#ui/components/LightboxGallery/LightboxGallery.vue';
+ import MediaGallery from '#ui/components/MediaGallery/MediaGallery.vue';

- import LoginReviewPanel from '#ui-kit/components/LoginReviewPanel/LoginReviewPanel.vue';
+ import StatusMessage from '#ui-kit/components/StatusMessage/StatusMessage.vue';

- import CategoryCard from '#ui-kit/components/CategoryCard/CategoryCard.vue';
+ import LinkTile from '#ui-kit/components/LinkTile/LinkTile.vue';

- import Card from '#ui/components/Card/Card.vue';
+ import Card from '#ui-kit/components/Card/Card.vue';

- import Iframe from '#ui/components/Iframe/Iframe.vue';
+ import Iframe from '#ui-kit/components/Iframe/Iframe.vue';

- import Media from '#ui/components/Media/Media.vue';
+ import MediaPreview from '#ui-kit/components/MediaPreview/MediaPreview.vue';

- <LuiProductSlider />        <!-- old: ui registered components with the Lui prefix -->
+ <LProductSlider />          <!-- new: ui uses L, matching ui-kit. Applies to every native-ui component. -->
```

### Migration — props and bindings

```diff
- <Button type="icon" size="medium" />
+ <IconButton label="..." icon="..." size="m" />

- <Button>
-   <template #iconLeft><Icon name="..." /></template>
- </Button>
+ <Button :icon-left="iconName" />

- <Button variant="input-field" />
+ <Button variant="subtle" />

- <Input :is-error="hasError" />
+ <Input :invalid="hasError" />

- <Field :error="errorString" />
+ <Field :error-message="errorString" />
+ <!-- Field auto-derives `invalid` from `errorMessage`. Pass :invalid="…" explicitly only to override. -->

- <Label :error="hasError" />
+ <Label :invalid="hasError" />

- <Select size="small" />
+ <Select :trigger="{ size: 's' }" />

- <Accordion accordion-style="..." />
+ <Accordion variant="..." />

- <SwatchChip color-mode="dark" />
+ <SwatchChip surface-tone="dark" />

- <Badge is-rounded />
+ <Badge rounded />

- <Toast :is-open="open" />
+ <Toast :open="open" />

- <Pagination :is-navigation-numbers="true" />
+ <Pagination variant="numbers" />

- <OptionTileImage :not-available="{ isNotAvailable: true, notAvailableTooltip: '…' }" />
+ <OptionTileImage unavailable unavailable-tooltip="…" />

- <LSwiperCompact />
+ <LSwiperNavBar />

- <LSwiperFadeoutArrows :has-fadeout-background="false" />
+ <LSwiperArrows :fadeout="false" />

- <LSwiperThumbnailsSlider />
+ <LThumbnailsSlider />

- <Switch v-model:checked="open" />
+ <Switch v-model="open" />

- <Checkbox v-model:checked="agreed" />
+ <Checkbox v-model="agreed" />
```

### Migration — CSS class names

```diff
- .swatch-chip.is-selected       { ... }
+ .swatch-chip--selected         { ... }

- .switch--small                 { ... }
+ .switch--s                     { ... }

- .round-spinner-s               { ... }
+ .round-spinner--s              { ... }

- .swiper-chrome__head-top       { ... }
+ .swiper-chrome__head--top      { ... }

- .user-avatar                   { ... }
+ .avatar                        { ... }

- .toast__progress-bar           { ... }
+ .toaster-progressbar           { ... }

- .login-review-panel            { ... }
+ .status-message                { ... }

- .swatch-preview                { ... }
+ .swatch                        { ... }

- .swatch-item                   { ... }
+ .swatch-option                 { ... }

- .product-tiles-swatches        { ... }
+ .swatch-summary                { ... }

- .menu-link-item                { ... }
+ .nav-link-item                 { ... }

- .menu-section-title            { ... }
+ .nav-section-heading           { ... }

- .navigation-node-button        { ... }
+ .menu-side-by-side-node        { ... }

- .variant-option-selector-button, .variant-option-selector-image
+ .option-tile-text, .option-tile-image

- .zoom-level-mobile, .zoom-level-desktop
+ .zoom-level-segmented, .zoom-level-stepper

- .media-block*                  { ... }
+ .media-preview*                { ... }
```

> **Studio data migration required** for every renamed or deleted section/block component string, every renamed schema field, and every promoted or demoted section ↔ block. Custom themes that defined `backgroundAwareBackdrop` with `'default'` must rewrite those entries with the equivalent `SurfaceTone` (`'default'` was a synonym for `'light'`).

## [1.34.0]

### Added

- New z-index token scale in ui-kit: `--z-index-sticky` (100), `--z-index-modal` (1400), `--z-index-popover` (1500), `--z-index-tooltip` (1600), `--z-index-toast` (1700). Modal overlays and content share one token so stacked modals layer correctly via DOM order.

### Changed

- All portaled components (Dialog, Sheet, AlertDialog, DropdownMenu, Select, Tooltip, MediaLightbox) now set z-index on their content class for reliable stacking. Header sections opt out of section isolation so their sticky/fixed chrome remains visible, and `FilterBar` teleports its scroll-triggered fixed bar to `<body>` to escape section isolation, using an IntersectionObserver instead of hardcoded scroll thresholds.

## [1.33.0]

### Added

- `scrollToTop` prop on `Pagination` (defaults to `true`), which scrolls the viewport to the top when navigating pages.

### Fixed

- `Button` now emits `click` events on the `NuxtLink` branch and forwards `$attrs` on both root elements, enabling reka-ui `as-child` to work correctly.
- `SectionBlogPostListing` now uses reactive computed properties for client-side pagination.

## [1.32.5]

### Fixed

- `Card` RichContent prop (`:content` → `:html`), simplified `SocialShare` layout (removed an unnecessary wrapper div), and wrapped `BlogPostDetail` content in a container div.

## [1.32.2]

### Fixed

- CSS-layer order in Studio preview.

## [1.32.0]

### Added

- `$tl` Vue global for locale translations, plus 13 new message groups, full German translations, and umlaut fixes. Migrated 46 components from `useLocale().t` to `$tl` template calls.

### Fixed

- Correct hover font-colors for some elements.

## [1.31.0]

### Added

- `$duration` formatter for ISO 8601 duration strings. Uses `Intl.DurationFormat` with locale awareness when available, falling back to narrow-style manual formatting (`1h 30m 5s`). Available as template global and auto-import.

### Changed

- `$money` and `$measurement` i18n formatters moved from frontend-core to ui-kit, removing dead code. Template globals and auto-imports work identically — no consumer changes needed.

## [1.30.0]

### Added

- An ESLint rule (`laioutr/require-css-layer`) that enforces all new component CSS is layered.

### Changed

- All component CSS is now wrapped in `@layer lui-components`, allowing consumers to override component styles with unlayered CSS without needing `!important`. Existing `@layer lui-overridable` blocks (Icon, Text) are preserved.

## [1.29.3]

### Fixed

- `ThemeSwitcher` import and `ThemeWithMeta`.
- `Input` prop fallthrough and the `ShopHeader` close-button.

## [1.29.0]

### Added

- Theme switcher support.

## [1.27.0]

### Fixed

- `HeroSlider` Media loading eagerness.

## [1.20.0]

### Added

- `SearchOverlay` implemented with actual data.

## [0.20.0]

### Fixed

- Minor type fixes.

## [0.19.11]

### Fixed

- Worked around a nuxt/image Hygraph provider bug that returned broken image URLs.

## [0.19.7]

### Fixed

- Prevent a frontend crash when the `Media` component is not provided a `media` prop.

## [0.19.0]

### Added

- `RichContent` support for an `HtmlFragment` prop.

## [0.18.0]

### Added

- A basic `strawberry-field` theme.

## [0.17.4]

### Fixed

- Build issue.

## [0.16.0]

### Added

- Detail variant switcher and add-to-cart toast.

## [0.15.0]

### Added

- Filter bar implementation and type adjustments.

## [0.14.3]

### Fixed

- `SectionShopHeaderNavigation` now respects menu data; fixed `RichContent` margins.

## [0.14.1]

### Added

- Studio refresh compatibility.

## [0.14.0]

### Changed

- Improved LCP loading strategy.

## [0.13.0]

### Changed

- Accessibility improvements for desktop navigation and slider navigation.

## [0.12.0] – [0.11.0]

### Fixed

- Missing links; added `robots.txt` and page SEO meta.

## [0.10.4]

### Changed

- Default color-mode set to `light` instead of `system`, since most e-commerce frontends do not provide a dark mode and being greeted with dark mode could confuse users.

## [0.10.2]

### Fixed

- Shopify product prices and minor frontend adjustments.

## [0.10.0]

### Fixed

- CSS layer order and swiper styles.

## [0.9.0] – [0.8.0]

### Added

- Adjusted definition default behaviour; added several sections and blocks to ui-app.

## [0.7.1]

### Fixed

- Import paths.

## [0.6.0]

### Added

- Section definitions; preparation for the Shopify demo.

## [0.5.0]

### Added

- Migrated base components into the UI Kit.
