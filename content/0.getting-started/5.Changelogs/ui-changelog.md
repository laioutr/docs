---
title: UI Changelog
description: Changelog for Laioutr UI (@laioutr-core/ui) following Keep a Changelog and Semantic Versioning.
seo:
  title: UI Changelog
  description: Changelog for Laioutr UI (@laioutr-core/ui) following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/ui-changelog
  lastmod: 2026-06-23
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Laioutr UI** (`@laioutr-core/ui`, the commerce-specific organism components built on UI Kit) are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.19.1] - 2026-08-27

### Patch Changes

- The account button and the review section's login prompt redirect to customer login instead of opening a popup, and carry the current path so the customer comes back to it. Returning to that page needs a connector that reads `AuthLoginOauthAction`'s `returnTo` input — against one that ignores it, login still works and the customer lands wherever that connector sends them.

## [2.19.0] - 2026-08-26

### Minor Changes

- Product tiles show the colour swatches of the product they render. The swatch row existed but was never filled, so it was always empty. Tiles read the product's option axes directly and no longer load every variant to build a listing, which cuts the data a product grid ships to the browser.

  A sold-out product still disables its add-to-cart button. That state now comes from the product's default variant instead of a loaded variant entity.

  `ProductTileBasic`'s `sizeVariants` carries one entry per value on the product's size axis, each addressing the variant the connector names for that size and disabled when no purchasable variant carries it. The default tile renders no picker, so the prop serves tile overrides that build their own. Where a product has more than one axis, the named variant is the connector's representative for that size rather than a shopper's full combination.

## [2.18.0] - 2026-08-26

### Minor Changes

- A footer menu link can be restricted to specific markets. Each item in `BlockFooterMenu` gains a "Visible in markets" list; leaving it empty shows the item everywhere, which is what every menu authored before this release does.

  This closes a gap rather than adding a concept. Markets are already available at render time through `useMarket()`, and visibility is already a schema concern through `visibilityField` — but that toggle is static, and the `if` condition beside it is evaluated by Studio only, so it hides a field from the editor rather than content from a visitor. Projects serving several countries from one storefront had no way to express "this link, not in that market" and were rebuilding the filter per component.

  The two pieces are exported for other components to adopt: `visibleMarketsField` for the schema and `inMarket()` for the render, from `shared-fields/visibleMarkets`. The stored value is the market slug, matching `RenderMarket.slug`.

- A product-detail URL that names several option values opens the variant carrying all of them. Any single matching value was previously enough, so `?variant=Rot&variant=XL` could open a red product in the wrong size. A URL naming one value still opens the first variant carrying it.

### Patch Changes

- Fix `QuantityPicker` removing an item by mistake: it emitted `delete` when the quantity field lost focus at the minimum value, or when the minus button stepped down to it — so clicking the quantity input of a cart line at quantity 1 removed the line. `delete` now fires only for the delete button at the minimum, or a value typed below it.

## [2.17.0] - 2026-08-24

### Minor Changes

- `Review` now reports the write-review intent instead of handling it itself. It emits `submit` with the form data when the review form is sent, and `login` when the visitor confirms the login prompt.

  **Breaking:** the login prompt's primary button no longer opens a confirmation dialog of its own — it emits `login`, and the consumer decides where the visitor goes. A `Review` that is rendered without a `login` listener shows the prompt but cannot log anyone in.

  ```vue
  <!-- before: the button handled itself, and confirmed a review nothing had stored -->
  <Review :rating="rating" :reviews="reviews" />

  <!-- after -->
  <Review :rating="rating" :reviews="reviews" @login="login" @submit="onSubmit" />
  ```

### Patch Changes

- Added the `review.logIn` string, in all seven shipped locales. The review login prompt's button was hardcoded English.

- `SectionProductReviews` now sends a visitor who wants to write a review to their account. The login prompt resolves through the `ecommerce/auth/login-oauth` action, so it works with whichever connector answers it — an OAuth authorization URL where accounts are hosted, a link to the account page where the storefront renders its own.

## [2.16.0] - 2026-08-24

### Minor Changes

- Add French, Italian, Spanish and Polish locale bundles, so storefronts in those
  languages stop rendering their UI chrome in English.

  `ui-kit` shipped `de`, `en` and `nl` only, and `UiAppWrapper` resolves the bundle
  from a literal map:

  ```ts
  const uiKitLocales: Record<string, typeof en> = { en, de, nl };
  const uiKitLocale = computed(() => uiKitLocales[appLanguage.value.languageCode] ?? en);
  ```

  Any other language fell through to `en`. A project configured with `fr`, `it`, `es`
  or `pl` therefore rendered every `$tl()` string in English — 257 messages across 33
  components, including the search field, the cart, "Add to cart", "Sold Out", the
  filter drawer and the header's account/wishlist/cart labels. The page content was
  translated; the chrome around it was not.

  There was no way to fix this from a consuming app: the map is a literal with no
  registration hook (themes have `$laioutrThemes`, locales have no equivalent), so an
  app could only have patched it by re-implementing `UiAppWrapper`.

  `fr.ts`, `it.ts`, `es.ts` and `pl.ts` follow the existing `extendLocale(en, …)`
  shape and cover all 257 keys — verified key-for-key against `en.ts`, with every
  `{placeholder}` token preserved. Register is by adding them to the map; no consumer
  change is needed.

  Two pre-existing gaps in the shipped bundles are closed at the same time, since they
  are the same defect: `de` was missing `sliderNavigation.play` / `.pause`, and `nl`
  was missing the whole `mediaFeed` block. Both silently fell back to English.

  Polish avoids the plural forms a static string cannot express — `filterStars` and
  `showProducts` read "Gwiazdki: {count}" and "Pokaż produkty ({count})" rather than a
  genitive that would be wrong for 2–4.

  The `ui` playground's `fr-CH`, `fr-FR` and `it-CH` entries pointed at `en` because no
  bundle existed; they now use the real ones.

  Not a behaviour change for existing projects: `de`, `en` and `nl` resolve exactly as
  before, and a language with no bundle still falls back to `en`.

### Patch Changes

- **Breaking:** The cart sheet marks a line whose merchandise cannot be bought. `CartListItem` takes a new `isSoldOut` prop, renders an "Out of stock" badge, and carries `data-unavailable` on its root for styling. `ConnectedCartSheet` sets it from the cart item's availability component.

  A custom locale must supply the new `cart.itemSoldOut` key.

## [2.15.0] - 2026-08-24

### Minor Changes

- `MenuSideBySide` gains a `below-separator` slot on the root level.

  The area under the root drawer's separator rendered `MobileMenuListItem`s built from
  the `rootMenuItems` prop and nothing else, so a storefront whose quick links are styled
  buttons rather than list rows had no way to put them there — the only route was forking
  `MenuSideBySide` and `MenuSideBySideRoot` downstream.

  The slot sits between the separator and the menu items and is forwarded at every level
  that sits between a consumer and it — `BlockMenuSideBySide` to `MenuSideBySide` to
  `MenuSideBySideRoot` — each time only when a consumer actually provides it. All three
  components now declare their slots with `defineSlots`. Nothing renders differently
  without it.

### Patch Changes

- `BrandHero`: a background colour now shows when no background image is set.

  `fallbackColor` was passed to `MediaStage` all along, but `finalMedia` fell back to
  the theme's decorative hero SVG whenever `background` was empty — so the colour was
  painted behind an opaque image and only ever visible through `colorMode: 'plain'`.
  Setting it therefore looked like nothing happened. An explicit colour now takes
  precedence over the theme default; the default still applies when no colour is set.

  The field is relabelled "Background Color" in `SectionBrandHero`, with a description
  saying when it applies. The prop name is unchanged.

  **Behaviour change:** an instance that has a background colour AND no image switches
  from the theme graphic to that colour. That is the reported bug, but it is visible —
  clear the colour to keep the graphic.

  `BrandHero`'s description also becomes rich text. The field was a `textarea`, which
  takes typed copy only — and on a brand page its whole point is to carry the brand's
  own description from the catalogue. It is now `richtext`, the type Studio offers a
  data source on and the same one `BlockText` uses for its body, so an editor can bind
  it to the query instead of retyping it per brand.

  The component's `description` prop widens to `string | HtmlFragment` and renders a
  fragment through `RichContent`, exactly as ui-kit's `Card` does for its body copy.
  Callers passing a plain string keep working unchanged.

- The product tiles in a Product Grid show their add-to-cart button, brand, description, flags and rating again. `ConnectedProductTileBasic` declared each toggle as an optional boolean without a default, so Vue cast an unset one to `false` and the component forwarded that `false` on to `ProductTileBasic` — beating the tile's own `default: true`. `BlockProductsListing` passes none of these toggles, so every tile in a grid rendered with all five switched off. A toggle a caller does not set now stays unset and the tile decides.

## [2.14.0] - 2026-08-21

### Minor Changes

- Captions gain a **Text Size** setting, wired the same way heading and subline already are.

  `CaptionFlag` had its size hardcoded — `caption-s` for the plain variant, `caption-xs` for boxed — so no consumer could change it. It now takes an optional `size`, and the variant-derived value stays the fallback, leaving existing callers unchanged.

  The option list is a deliberate SUBSET of the shared text-size scale: the caption utilities come from the `--caption-*` tokens, which stop at `xl`, so `2xl`+ are not offered rather than offered and silently ineffective.

  The setting lands on the shared `captionVariant` style decorator, so every section and block that already uses it gets the control: Banner Basic, Banner Integrated, Banner Showcase, Product Slider Showcase, Hero Slider (per slide caption) and the Banner Basic block. The schema keeps the canonical `textSize` name with its `auto` sentinel and one shared mapper (`resolveCaptionVariant`) translates it to ui-kit's `size` — `auto` becomes absent, which is what lets `CaptionFlag` fall back.

- `ProductListingGrid` accepts a `productTile` scoped slot, bound as `{ product }`, matching the slot `ProductSlider` already exposes. Its fallback is the tile it rendered before, so an existing consumer is unaffected.

  `CartSummaryBox` emits `checkout` when its call to action is clicked, and `CartSheet` forwards it. The button keeps its `href`, so navigation is unchanged.

- `SocialShare` emits `share` with the platform a visitor picked, and `BlockSocialShare` reports it as a `web/share` event.

  The payload carries `method` alone — the platform id (`facebook`, `x`, `linkedin`, `pinterest`, `email`). The block binds to no entity, so what was shared is the page, and the ambient page context already puts its url, path and type on every event.

  Every button is an outbound link to the platform's own dialog, so the event marks the click rather than a completed share. A visitor can still abandon it.

- Product lists, product pages, the cart and search now emit commerce events. No configuration: the instrumentation is always on and has no Studio surface.

  - Product sliders and the product grid report `view_item_list` once they are on screen, not merely rendered.
  - A tile reports `select_item` on a navigation and `add_to_cart` after the mutation resolves.
  - A product page reports `view_item` on load and again on every variant switch.
  - The cart reports `view_cart` on open, `begin_checkout` from the call to action, and a removal or an add for every quantity change, sized to what moved rather than what remains.
  - The header reports a submitted `search`, and a search results page reports `view_search_results`.

  Raw entities go into `track()` and the projector registry turns them into wire shapes, so no call site builds a payload by hand.

### Patch Changes

- `SectionBannerBasic` can now be made clickable across its whole area.

  `BannerBasic` has carried the full-area link all along — a transparent `NuxtLink` over the banner, enabled by `isFullAreaLink` — but the section never passed an `href` and had no link field, so the overlay could never render there. `BlockBannerBasic` already has both. This brings the section in line with its own block: a `Link` field in Content, resolved through `linkResolver` and handed to `BannerBasic` as `href`.

  The existing constraint is unchanged: the overlay only renders when no CTA is configured, since a CTA inside a full-area link would nest one anchor in another. A banner with a CTA keeps exactly the behaviour it has today.

- **Breaking:** `SectionCategoryCardSlider` no longer pads itself by default.

  The section overrode the shared `paddingField` with `default: 's'`, so every instance started with vertical section padding nobody asked for — and a section that pads itself cannot be placed flush against its neighbour. It now uses the shared field unchanged, whose default is `none`; `margin` was already `none`.

  **Behaviour change:** existing instances that never touched the Padding field lose that padding. Set it to `S` explicitly to keep the old look. Seven other sections still carry the same `default: 's'` override and are deliberately left alone here.

- Fix a crash on a hero slide that shows a caption.

  `SectionHeroSlider` called `resolveCaptionVariant` without importing it, and ui-app registers no auto-import directory, so building the slide props threw a `ReferenceError`. Only a slide with at least one visible caption reached the call, which is why it stayed latent.

- Price the variant a commerce event names, not the product it belongs to.

  A product's own price is a "from" price across its variants. The projection already reported the active variant's sku and name, so pairing those with the product's price priced one variant as another — on a product with a wide variant spread it understated the amount by an order of magnitude. `projectAnalyticsProduct` now reads the active variant's prices and falls back to the product's only where the variant has none.

  A variant price never carries the product's strike-through price: that belongs to a different price point, and carrying it across would invent a discount.

  A tile's `add_to_cart` value is computed from the variant actually being added, taken from the id in the add-to-cart payload rather than from the product.

## [2.13.0] - 2026-08-19

### Minor Changes

- `MediaVideo` emits a `milestone` event as playback crosses each quarter of the video, carrying `{ milestone, currentTime, duration }` where `milestone` is the fraction reached — `0.25`, `0.5`, `0.75` or `1`. Each fires once per mounted player.

  `useMediaMilestones(playback, onMilestone, config?)` is the headless detector behind it, for wiring the same behaviour to a non-native player. It takes reactive `currentTime` and `duration`, knows nothing about media elements or analytics, and accepts `{ fractions }` to replace the default quarters.

  ```ts
  useMediaMilestones({ currentTime, duration }, (event) => report(event), { fractions: [0.1, 0.9] });
  ```

- Make `BlockMedia`'s Sizing setting apply to the image only, not to the image plus its description.

  `Sizer` wrapped the whole block, so an Aspect Ratio of 16/9 was the ratio of image **and** caption together: the image lost exactly the height the caption took, and a longer caption shrank the image further. The same held for Responsive Aspect Ratio and for both fixed-height modes.

  `MediaPreview` now takes an optional `sizing` and applies it to its media box, with the description below it and outside the sized box — which is where a caption belongs regardless of the mode. `BlockMedia` passes the field straight through instead of wrapping itself.

  Backwards compatible: without `sizing`, `MediaPreview` keeps its previous geometry and fills whatever box it is given, caption included. Consumers that size the outer box themselves (as the stories do) are unaffected.

- Let `CartSheet` be told how many items its header pill should report, via a new optional `cartContent.itemCount`.

  The pill was hardcoded to `cartContent.cartListItems?.length` — the number of LINES, which only equals the number of items while every line has quantity 1. A storefront whose header cart badge counts units (the usual choice, and what `CartBase.totalQuantity` provides) therefore showed two different numbers for the same cart: a cart with two products at quantity 3 read 6 in the header and 2 in the drawer.

  `itemCount` falls back to the line count when it is not passed, so existing call sites are unaffected.

- `HeroSlide`, `BannerBasic`, `BannerIntegrated` and `BannerShowcase` accept an `href` prop that turns the whole component into a single link, rendered as a transparent full-area overlay. It activates only when no CTA button is present, so a component is either button-driven or fully clickable — never both (which would nest interactive elements inside an anchor). Unset by default; existing usage is unchanged.

  The Hero Slide, Banner Basic, Banner Integrated and Banner Showcase blocks gain a **Link** field that makes the whole component clickable.

- Add `BlockBasicTable` — a Studio block for the `BasicTable` molecule.

  The primitive has been in ui-kit since the DescriptionList rename, but only domain compositions could reach it: there was no way to author a plain key-value table in the Studio. Rows are an authored array of label/value pairs, and the block exposes the primitive's `outlined` / `plain` variant as its Design style.

  Standalone, so it is offered in every section rather than only in the ones that allow-list it.

- The Mega Menu, Mobile Menu (Shop), and Side-by-Side Menu blocks gain a **Start Level** control that descends the fetched category tree by the configured number of levels before rendering. This lets editors skip a synthetic upstream root node (e.g. a Magento "Root" category) so the first business-facing level becomes the top level, without changing the query or connector. It applies only to the queried Root Menu tree — manually authored navigation items are unaffected. Default `0` preserves the current behaviour.

- Hide `BlockPagination` when the result set fits on a single page, with a `showOnSinglePage` toggle to keep it.

  A lone "1" button that cannot lead anywhere reads as a broken control, so the block now renders nothing when there is one page or none. The page count is derived from `pagination.total / pagination.limit`; a `limit` of 0 is treated as unpaged, i.e. one page.

  **Behaviour change:** storefronts that showed the controls on single-page listings will stop doing so. Switch `showOnSinglePage` on in the block's Rules group to keep the old rendering — worth doing where a listing's height should not change as filters narrow the result set, since the control appearing and disappearing moves everything below it.

## [2.12.0] - 2026-08-13

### Minor Changes

- Add `MediaFeed`, a full-screen short-form media feed in the TikTok/Reels pattern: vertical scroll-snap, one item playing at a time, an action rail, a mute toggle, and a read-more sheet. Only the item in view is interactive — the others are `inert`, so tabbing never reaches a control that is off screen, and each item carries `data-state="active" | "inactive"` to style or query against. Video items carry a play/pause affordance over the whole backdrop; image items have nothing to pause and carry none.

  Render it from props (`items` + `v-model:open`) or drive it from anywhere on the page with `useMediaFeedStore()`:

  ```ts
  const { openFeed, setItems } = useMediaFeedStore();

  // Seed on mount so a shared link resolves before anyone opens the feed.
  setItems(reels);
  // A tile opens at a position or at an item id.
  openFeed(reels, 'reel-1235512');
  ```

  Browsers only allow autoplay while muted, so the feed starts silent and the top bar carries a mute toggle back to sound — bound to `v-model:muted`, and left out when no item is a video. Replace it through the `top-bar-end` slot.

  Set `urlParam` to sync the item in view to the URL — `?reel=<id>` — so an item can be shared and the back button closes the feed instead of leaving the page. The parameter carries the item id, not its position, so a link survives the feed being reordered.

  The compound parts are exported for composition: `MediaFeedIconButton`, `MediaFeedTopBar`, `MediaFeedDesktopNavigation`, `MediaFeedItemInformation`, `MediaFeedDisclosureTeaser`, `MediaFeedOffCanvasSheet` and `MediaFeedItem`. Action rails and CTAs are scoped slots, because favourite state and counts come from your own queries rather than from the item data.

  `MediaFeedIconButton` draws an engaged `AnimatedIcon` in red, so a favourited heart reads as favourited while the rail's other icons stay on the button's own colour. Override it per rail or per button with `--animated-icon-active-color`.

  New in `ui-kit` alongside it:

  - `useOverlayHistory` — syncs any overlay's open state and current item to a query parameter. Opening pushes one history entry, item changes replace it, and back closes the overlay rather than navigating away. Usable for the lightbox, a cart drawer or any other overlay. Several overlays can run at once as long as each owns its own parameter.
  - `AnimatedIcon` — an icon that reflects a boolean active state. On the false → true transition the two artworks cross-fade — the outgoing one springs, the incoming one grows in from a quarter size — while three copies of the active artwork fly up and outwards and fade. The motion is sized in multiples of the icon, so it holds at every `size`. Overlapping bursts are kept separate so rapid repeat taps each animate in full. It reflects `data-state="active" | "inactive"`, and `--animated-icon-active-color` colours the active artwork and the hearts it throws while the resting outline keeps the ambient icon colour.
  - `AnimatedButton` — `Button` with a continuous pulse, paused on hover, under `prefers-reduced-motion`, or via `paused`.
  - `$count(1234)` — compact number formatting for the current locale, honouring your i18n `numberFormats` where you define them. The default abbreviation is CLDR's and differs by language: English shortens from a thousand (`1.2K`), German only from a million (`1234`, then `1,2 Mio.`), so a badge on a fixed width wants either room for the long form or a format of its own.
  - `Badge` gains a `glass-black` variant for badges sitting over arbitrary media.
  - `Media` and `MediaVideo` gain `v-model:currentTime`, the sibling of `v-model:paused`: assigning to it seeks, and the element reports its own progress back, so a scrubber, a chapter link or a rewind needs no template ref.

  (DEV-414, DEV-440)

- Videos rendered through `Media` wait until they are near the viewport before fetching, so a page or feed carrying several no longer loads all of them up front. Videos under a `MediaAboveTheFold` provider are unaffected; elsewhere set `videoPreload` to override it per video. (DEV-414)

### Patch Changes

- Fix the filled heart icon (`essentials/heart-filled`) rendering at `size="s"` and `size="m"`.

- Keep product tiles rendering when a variant is missing the components they read

  A query result can legitimately carry a product variant whose components have not been resolved.
  The shared product-tile mapper read `options.selected` and `availability.status` off every variant,
  so a single such variant took the whole Product Grid, Product Slider or Product Slider – Showcase
  down behind its error boundary. Those variants are now skipped, and the tile renders with a
  momentarily shorter size list instead.

## [2.11.0] - 2026-08-11

### Minor Changes

- Dutch locale for ui-kit

  `#ui-kit/locale/nl` joins `en` and `de`, covering every message key the kit defines — cart and
  checkout, the add-to-cart and sold-out states, search, filters, reviews, the withdrawal form,
  product-detail pricing, the location finder, and the newsletter.

  A storefront whose language resolves to `nl` now renders ui-kit's own chrome in Dutch. Until now
  only `en` and `de` existed, so a Dutch market showed English controls — "Add to Cart", "Sold Out",
  "Select an option" — around product data in its own language. Markets in other languages are
  unaffected and still fall back to English.

### Patch Changes

- `CategoryCardSlider` and `CategoryCardGrid` render their `nodes` prop and their default
  slot together, `nodes` first. Previously the default slot replaced `nodes` entirely, and
  because the Category Card sections always pass one, `nodes` never rendered through them
  at all.

  So a Category Card Slider bound to a category data source — e.g. the current category's
  Child Categories — showed an empty slider. It now shows one card per category, with any
  manually placed `BlockCategoryCard`s after them.

- The Filter Bar's header and quick-filter rows line up with the surrounding page content on large screens. Their horizontal padding was a fixed `--spacing-ml`, narrower than the page container's own padding, so both rows sat slightly inside the content column from `lg` upwards. They now read `--container-padding`, the same token the container uses, and follow it at every breakpoint above `lg`.

- The add-to-cart button on tiles in the Product Slider Showcase section did nothing when
  clicked — no spinner, no toast, no cart request — while the same button in the plain
  Product Slider section worked. Both now behave identically: per-tile loading state,
  success and error toasts, and the cart count updating.

  `ProductSliderShowcase` gains an optional `productTile` slot for callers that render
  their own tile; leaving it unfilled keeps the current one.

- **Breaking:** `AuthLoginOauthAction` (`ecommerce/auth/login-oauth`) no longer returns a bare `authorizationUrl`. It returns a discriminated union: the OAuth authorization URL when the customer has no session, and a `Link` to their account when they do. Narrow on `type` before reading either.

  ```ts
  // Before
  const { authorizationUrl } = await mutateAsync(undefined);
  window.open(authorizationUrl, '_blank', 'popup,width=500,height=500');

  // After
  const result = await mutateAsync(undefined);
  if (result.type === 'oauth') {
    window.open(result.authorizationUrl, '_blank', 'popup,width=500,height=500');
  } else {
    await navigateTo(resolve(result.link), { external: true });
  }
  ```

  Clicking the account icon in the shop header no longer restarts the OAuth flow for a customer who is already signed in — they go straight to their account. The Shopify connector answers from its own cookies without a network call, and returns before writing anything, so an account redirect in one tab can no longer invalidate a login in progress in another.

  The account destination is a `Link` rather than a URL string, so the frontend resolves it. Shopify returns an external link to its hosted account page; a connector whose account is a storefront page returns a `pageType` link from the same contract, with no change to the header.

  The login popup no longer fails silently in Safari and Firefox. It is opened while the click is still a trusted gesture rather than after the request that resolves its URL, and falls back to a full-page redirect where a popup is blocked anyway.

  A signed-in customer's cart now carries their identity, so checkout opens authenticated and the resulting order attaches to their account. A cart created while signed in is associated at creation; one filled beforehand is associated on the next cart read, so signing in mid-session no longer leaves the cart anonymous.

## [2.10.3] - 2026-08-06

### Patch Changes

- Add `ProductDetailButtonGroup`, a vertical stack of full-width call-to-action buttons (label, link, variant, size) for the product detail page.

- Add `BlockProductDetailButtonGroup`, a block wrapping `ProductDetailButtonGroup` with a repeatable buttons array built on the shared button field set. Placeable only inside the Product Detail section's content slot.

## [2.10.0] - 2026-08-03

### Minor Changes

- `Container` gains `columnsTablet` and `gapTablet` props, adding a tablet stage between mobile and desktop. Column count and gap now resolve in three stages — mobile (below 600px), tablet (600–1279px), desktop (1280px and up) — one breakpoint scheme shared with the Sizer. Both fall back to their mobile value when unset (`columnsTablet` → `columnsMobile`, `gapTablet` → `gapMobile`), so containers that only configured mobile and desktop render as before at those two stages.

  **Breaking (intended):** the desktop gap now switches at 1280px instead of 800px. Containers with an explicit desktop gap and no tablet gap now use the mobile gap between 800–1279px where they previously used the desktop gap — the same breakpoint unification the Sizer already applies. Column behaviour is unaffected. (SUPPORT-18)

  The Container section adds **Tablet columns** and **Gap (Tablet)** controls, so editors can set a distinct column count and gap for tablet viewports (600–1279px); previously the tablet band inherited the mobile columns and, above 800px, the desktop gap.

- Banner Basic, Banner Integrated and Banner Showcase — both their section and block variants — gain a Background Color control that fills the inner banner tile (the surface behind the copy, shown when no background image is set). This is independent of a section's outer Backdrop background, so the band around the banner and the banner tile itself can be coloured separately. Text and icon contrast adapt automatically to the chosen colour; unset banners keep their pale theme fallback. (SUPPORT-31)

- All three CTA banner sections — Banner Basic, Banner Integrated and Banner Showcase — gain a Sizing control (fixed height, responsive height, or aspect ratio) to give the banner a definite height. Banner Basic's Content Alignment becomes two-dimensional (vertical + horizontal, e.g. `bottom-left`) and Banner Integrated gains a Vertical Alignment control, so content can now sit at any edge — including the bottom. Vertical alignment only takes effect once the banner has a definite height (with Sizing `auto` it stays at the top) and composes with the existing Content Padding control. Existing sections render unchanged: stored alignment is preserved and Sizing defaults to `auto`. (DEV-343, SUPPORT-16)

## [2.9.2] - 2026-08-02

### Patch Changes

- Fix filter off-canvas accordion opening the wrong panel. `FilterOffCanvasAccordionItem` used `activeValue` (the display text) as its reka `AccordionItem` identity, so every unselected list/range filter shared `value=""` and clicking any trigger opened the first one, overlapping the others. The item now takes a dedicated, unique `value` prop for identity, with `activeValue` used for display only.

## [2.9.1] - 2026-08-02

### Patch Changes

- `ProductTileBasic` accepts an optional `sizeVariants` prop (`{ value: string; label: string; disabled?: boolean }[]`, default `[]`), carrying each product's selectable size options through to the tile. The prop is data-only — the default tile renders no size picker — so overrides can render their own selector from it without changing existing tiles.

- Expose per-product size variants on the product-tile pipeline. `productTileMapper` now emits a `sizeVariants` array (`{ value, label, disabled }`, keyed by variant id, `disabled` for sold-out sizes) derived from the variants already fetched by the shared product-tile query; products without a size option yield `[]`. The shared query's variant limit is raised from 5 to 30 so full size runs are no longer truncated. Consumers of `ProductTileBasic` (Product Slider, Product Slider Showcase, and tile overrides) receive this data without forking the query or mapper.

  The Product Slider Showcase now defaults `Show Product Flags` to on, matching the standard Product Slider (new sections only; existing configurations are unaffected).

## [2.9.0] - 2026-08-01

### Minor Changes

- Add `BlockProductSlider` — the Product Slider available as a standalone block so it
  can be placed inside a container slot, not only as a full-width section. Its
  configuration, data binding and rendering are identical to `SectionProductSlider`.

## [2.8.6] - 2026-08-01

### Patch Changes

- Add a `Child Categories` link (`Category → Category`) and let the Category Card Slider render categories from a data source.

  - **canonical-types:** new `ChildCategoriesLink` token (`ecommerce/category/child-categories`).
  - **shopify:** implements the link by reading the navigation menu (new `categoryMenuHandle` option, default `main-menu`), locating the source collection's node and returning its collection children as inline `Category` entities (title/slug + collection image). Localized via `@inContext`.
  - **ui-app:** `SectionCategoryCardSlider` gains an optional Category external-source query (`categories`) whose entities render as cards. Manual slot cards still take precedence, so existing usage is unchanged. Bind it in Studio to the current category's `Child Categories` to show its sub-categories.

## [2.8.1] - 2026-07-23

### Patch Changes

- Add the missing Product Slider preview image so the Studio component picker shows a preview for it. The `previewSrc` already pointed to `SectionProductSlider.png`, but that asset was absent, leaving the entry with a broken preview link.

## [2.8.0] - 2026-07-20

### Minor Changes

- **Breaking:** The `ai` metadata on section and block definitions is now a typed `AiComponentMetadata` object with exactly two optional fields — `description` (agent-facing facts that don't fit the picker-facing `studio.description`) and `examples` (a worked slot/block composition for complex multi-block sections). The previous free-form `{ label, description }` shape, the co-located `ai-descriptions/*.md` files, and the `aiDescription()` helper are removed. An absent `ai` object is the normal state: `studio.description` plus the field/slot schema carry the load for agents, and all built-in section/block descriptions have been enriched with the facts that previously lived in `ai` metadata. Prescriptive guidance fields (`useWhen`, `avoidWhen`, `constraints`, `neverWith`, `pairsWellWith`, `typicallyFollowedBy`, `supports`, …) are gone — evals showed they measurably degrade agent page composition.

  ```ts
  // before
  ai: { label: 'Button', description: aiDescription('BlockButton') }

  // after — most definitions:
  // (no ai key at all; put facts in studio.description)

  // after — only where a fact doesn't fit the picker text or an assembly is non-obvious:
  ai: {
    description: 'Currently a progress display only — it does not yet fetch the next batch.',
    examples: 'gallery slot: BlockProductMediaGallery; content column: BasicInfo, PriceInfo, CartButton in on-page order.',
  }
  ```

### Patch Changes

- Add `studio.package` and `studio.kit` metadata to section/block definitions for the Studio picker tabs and type filter. Every built-in section and block description has been reviewed and enriched so the picker text carries the component's non-obvious capabilities and data-binding facts.

## [2.7.0] - 2026-07-14

### Added

- **UI Kit** — Video sources now support a `focalPoint`, mirroring image sources. The built-in `MediaVideo` renderer applies it as `object-position` (per viewport, with `center center` as the fallback) so the important region stays in frame when the video is cropped by `object-fit: cover`.

### Fixed

- **UI Kit** — Registered the `$unitPrice` formatter as an auto-import. It is now available both as the `$unitPrice(...)` template global and from `#imports`, matching the other formatters. Previously it was only wired into the runtime plugin, so consumer typechecks reported `Property '$unitPrice' does not exist` on templates that used it even though it worked at runtime.

## [2.6.0]

### Added

- **UI Kit** — `TableOfContents`, a numbered navigation list with scroll-spy active-item tracking, and the underlying `useScrollSpy` composable.

- **UI** — An optional, auto-generated table of contents for `ArticleDetail`, built from the body's H2 headings, with a sticky sidebar on desktop and a collapsible accordion on mobile.

- **UI App** — A `showTableOfContents` Studio feature flag on `SectionBlogPostDetail` (default on) to toggle the new auto-generated table of contents.

- **UI** — The EU withdrawal-button feature. `WithdrawalForm` renders a statutory right-of-withdrawal (Widerruf) dialog form with the three legally-permitted fields (name, order/contract reference, email) and client-side validation. `BlockWithdrawalButton` (`ui-app`) makes it a Studio-configurable button that opens the form in a dialog and dispatches the `ecommerce/legal/withdrawal` action. `Footer` and `SectionFooter` gain a `bottomContent` slot so the button (or any block) can sit in the footer's bottom row, and a `withdrawal` locale namespace (en/de) supplies the default labels and validation messages.

### Changed

- **UI Kit** — `openDialog` and `addToast` now accept a ref or getter for their content (`MaybeRefOrGetter<…>`), so a dialog's or toast's title, description, and other fields can stay reactive after it opens — e.g. `openDialog(() => ({ title: t('...'), ... }))` re-renders on locale or prop changes. Passing a plain object works exactly as before. `addToast` additionally returns the new toast's `id` (matching `openDialog`), and the toaster store's `toasts` is now a resolved computed rather than a writable ref (it was already only read internally).

### Fixed

- **UI Kit** — Form inputs placed inside `<Field>` now inherit the field's `disabled`, `readonly`, `required`, and `invalid` state. Previously these were silently dropped (only `id` and `errorMessage` propagated), so a control inside `<Field disabled>` or `<Field :invalid>` stayed enabled/valid. A control is now in that state if either its own prop or the surrounding `<Field>` declares it, matching native `<fieldset disabled>`.

## [2.5.0]

### Added

- **UI** — `TableProductSpecifications`, a product specification sheet built on `BasicTable`. Rows carry a `label` and a **typed** `value` (`string | number | boolean | Measurement | Money`) that the new `TableProductSpecificationsValue` subcomponent formats per locale — numbers via `Intl.NumberFormat`, booleans as localized Yes/No (`tableProductSpecifications.{yes,no}`), `Measurement` via `$measurement`, `Money` via `$money`. An optional per-row `sectionName` groups rows into sections (one `BasicTable` per section, first-seen order); absent ⇒ a single ungrouped table. See [Product Specifications Table](/laioutr-ui/shop/product-detail/product-specifications).

- **UI App** — `BlockTableOpeningHours` and `BlockTableProductSpecifications`, two standalone Studio blocks. Each can be filled from a query (a Location's opening hours / a Product's `specifications`) or with manually entered rows, switchable via a **Data Source** toggle, and exposes an `outlined` / `plain` style toggle. `BlockTableProductSpecifications` forwards the product's typed specification values unchanged and supports per-row sections (an optional **Section** field on manual rows) for grouped output.

### Changed

- **UI Kit** — **Breaking:** `DescriptionList` was renamed to `BasicTable` and `DescriptionListItem` to `BasicTableRow`. `BasicTable` now renders as a semantic description list (`<dl>` with `<dt>`/`<dd>` rows) instead of presentational `<div>`s, and the label column is overridable via the public `--basic-table-label-col` custom property. The grid/subgrid layout and the CSS surface (`.basic-table` root class, BEM classes) are unchanged. See [Basic Table](/laioutr-ui/ui-kit/content/basic-table).

  ```diff
  - import DescriptionList from '#ui-kit/components/DescriptionList/DescriptionList.vue';
  - import DescriptionListItem from '#ui-kit/components/DescriptionList/DescriptionListItem.vue';
  + import BasicTable from '#ui-kit/components/BasicTable/BasicTable.vue';
  + import BasicTableRow from '#ui-kit/components/BasicTable/BasicTableRow.vue';
  ```

- **UI** — **Breaking:** `OpeningHoursWeeklyTable` moved out of UI Kit into `@laioutr-core/ui` as `TableOpeningHours`, now built on the `BasicTable` primitive and gaining an `outlined` / `plain` `variant`. Its weekday-grouping behavior is unchanged. See [Table Opening Hours](/laioutr-ui/location/table-opening-hours).

  ```diff
  - import OpeningHoursWeeklyTable from '#ui-kit/components/OpeningHoursWeeklyTable/OpeningHoursWeeklyTable.vue';
  + import TableOpeningHours from '#ui/components/TableOpeningHours/TableOpeningHours.vue';
  ```

## [2.4.0]

### Added

- **UI Kit** — `<Media>` gains a `playback` mode for video and audio. `playback="background"` is a one-switch decorative loop — `autoplay`, `muted`, `loop`, `playsinline`, and `disablePictureInPicture` on, `controls` off — replacing the hand-spelled cluster; `interactive` (the default) is the native player. Each attribute still has its own prop that overrides the mode. `<Media>` now exposes `v-model:paused` so a consumer can render and position its own pause control (WCAG 2.2.2), and it suppresses autoplay under `prefers-reduced-motion: reduce`, seeding the paused state from that decision. `MediaStage` adopts `playback="background"` for video backgrounds; it ships no pause control of its own, so a consumer that needs one renders the background with `<Media>` directly and binds `v-model:paused`. See [Rendering video and audio](/laioutr-ui/ui-kit/general/media#background-video).

- **UI Kit** — `GridFill` gains `justify` and `align` props (`'start' | 'center' | 'end'`, both default `'start'`) controlling main- and cross-axis item alignment. The values are stated logically: under `sizing="greedy-first"` the component internally reverses its axis to pack growing items into the first row, and un-mirrors the alignment so `start` / `end` still resolve to the intended physical direction (`center` stays symmetric). Consumers never see the reversal.

- **UI Kit** — `Input` gains a `plain` variant alongside `outline` (default) and `subtle`. It paints resting, hover, focus, disabled, and error backgrounds and borders from the `--input-field-plain-*` design tokens, for fields that sit on an already-styled surface and shouldn't carry their own box.

- **UI Kit** — `EmailInputForm` and `EmailInputFormDisplay` gain a forwarded `variant` prop (`'boxed' | 'plain'`). The `plain` value renders the email field with the new plain `Input` styling, so footer and popup signups can sit flush on a colored surface.

- **UI Kit** — `NavigationMenuTextItem` gains an optional `textColor` prop accepting a resolved CSS color string. When set it overrides the surface-tone label color for that item; unset, the item inherits the surrounding surface tone.

- **UI** — `MenuBasicItem` and `MegaMenuItem` gain an optional `textColor` (`ColorFieldValue`) that overrides the surface-tone label color of a top-level menu item or trigger. `NavigationNode` (the `MenuSideBySide` data shape) carries a matching `textColor` field. All three resolve the color via `colorValueToCss()` and fall back to the surface-tone cascade when unset.

- **UI** — `ArticleDetail` gains an optional `showSocialShare` prop (default `false`) that toggles the trailing `SocialShare` row. (`ArticleDetail` is the renamed `BlogPostDetail` — see Changed.)

- **UI App** — `SectionGlossaryDetail`, the reading view for a single glossary entry. It binds the `Glossary` entity's `base` and `content` components and renders them through the shared `ArticleDetail` component (social share off).

- **UI App** — `BlockProductDetailCouponBox`, a non-standalone block placeable in the Product Detail section's content slot. It wraps `CouponBox` with editor-configurable text, code, optional discount badge, and icon, and hard-wires `action="copy"` so shoppers copy the code to the clipboard. A `variant` toggle switches between the default and promotion-code presentations.

- **UI App** — Banner sections gain a Design → Layout **Content Padding** control. `BannerBasic`, `BannerIntegrated`, and `BannerShowcase` take a new `contentPadding` prop (`'default' | 'm' | 's' | 'none'`) with matching `--content-padding-{m,s,none}` modifier classes; an unset value preserves the existing padding.

- **UI App** — `SectionMediaText` gains a Design → Layout **Padding** control (none/S/M/L). `MediaText` takes a new `innerBlockPadding` prop (`'s' | 'm' | 'l'`) forwarded to `Backdrop`; unset defaults to none, so existing sections render unchanged.

- **UI App** — `BlockMenuBasic`, `BlockMenuSideBySide`, and `BlockMegaMenu` expose a per-item text-color picker via an `as: 'style'` decorator on author-typed item titles. The picked color is applied as the item label's `textColor`; entity-driven (CMS query) items do not expose the picker.

### Changed

- **UI** — **Breaking:** `BlogPostDetail` was renamed to `ArticleDetail` and promoted to the shared reading view behind both the Blog Post and Glossary sections. There is no backwards-compatible alias.

  ```diff
  - import BlogPostDetail from '#ui/components/BlogPostDetail/BlogPostDetail.vue';
  + import ArticleDetail from '#ui/components/ArticleDetail/ArticleDetail.vue';

  - <LBlogPostDetail :title :media :body />
  + <LArticleDetail :title :media :body />
  ```

- **UI App** — **Breaking:** `SectionGlossaryList` was renamed to `SectionGlossaryListing`. The Studio component string changed and **no data migration shipped**, so stored sections must be re-added. `SectionBlogPostDetail` and `SectionGlossaryDetail` both now render through the shared `ArticleDetail` component.

- **UI Kit** — **Breaking:** the `sectionGlossaryList` locale namespace was renamed to `sectionGlossaryListing` (key `sectionGlossaryListing.heading`; EN "Glossary" / DE "Glossar"), matching the section rename. Custom locales overriding the old namespace must rename it.

- **UI App** — `SectionLocationFinder`'s container-style control migrated to the shared `containerStyleField` toggle. The field name (`containerStyle`) and stored values (`'full-width' | 'boxed'`) are unchanged, so the migration is data-safe.

### Fixed

- **UI** — Un-mirrored `Container` alignment under the "Greedy First" sizing mode. `Container` now maps its 2D `alignment` onto `GridFill`'s logical `justify` / `align` props, and the axis-reversal handling moved into `GridFill` itself, so alignment resolves consistently across all sizing modes.

- **UI Kit** — `AlphabeticalIndex` group content is now top-aligned (`align-items: flex-start` instead of `center`), so columns of uneven height line up along their top edge.

- **UI Kit** — `.location-finder--boxed` now clamps to `--container-max-width` and centres with `margin-inline: auto` from the `--lg` breakpoint up, so boxed finders sit centered on desktop instead of stretching full-width.

- **UI App** — `BlockButton` set to Hug width now respects its sizing inside Media & Text; the column's `align-items` changed from `stretch` to `flex-start` so a hug button no longer stretches to the full column width.

- **UI** — `NewsletterRegistration` media column no longer collapses, and its email field now uses the plain `Input` styling.

- **UI Kit** — `LocationFinderMap` pre-bundles `vue3-google-map` via Vite `optimizeDeps`, resolving ESM export failures in dev.

## [2.3.0]

### Added

- **UI** — **`BlockProductDetailEnergyLabel`** for the Product Detail page. Renders the EU energy efficiency label: an inline energy-class badge (opening the full label in a lightbox) and an optional product data sheet link next to the product information. The block queries the product's variants for the new `ProductVariantEnergyLabel` component and renders the label of the selected variant (resolved via `useProductVariantContext`, falling back to the first variant). It is non-standalone and placeable in the Product Detail section.

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

- **UI App** — `BlockProductDetailRating` for the Product Detail section. Renders the product's average star rating, the rating value (`x/maxRating`), and the review count. The product detail query now fetches the `ProductRating` component so any PDP block can read `product.components.rating`.

- **UI Kit** — `Countdown` component (`#ui-kit/components/Countdown/Countdown.vue`) and a `useCountdown` composable for editorial countdowns. Unit labels come from `Intl.NumberFormat`, so they are localized and plural-aware automatically; the `unitDisplay` prop (`'long' | 'short' | 'narrow'`) sets their verbosity. `Countdown` also takes an optional frozen `now` (for tests/Storybook), and a pure `computeCountdown(endDate, now)` helper is exported. Adds `countdown.expired` and `promotionBanner.{codeCopiedTitle,codeCopiedSubline,copyCodeAriaLabel}` locale entries (EN + DE). `useNow` now accepts an optional tick interval — `useNow(intervalMs = 60_000)` — and is seeded via `useState`, so the shared clock renders byte-identically across SSR and hydration; consumers no longer need `data-allow-mismatch` on time-dependent nodes.

- **UI** — **`PromotionBanner`** (moved here from UI Kit because promo-codes + checkout language are commerce-domain). Accepts headings, optional countdown (via `useCountdown`), a promo-code copy button, a CTA, and a surface preset (`default | pale | bright | solid`) or `custom` colors with per-slot overrides (background / text / countdown / icon). It auto-promotes `variant` to `'custom'` when any `customColors` field is set, and adds `@vueuse/core` as a dependency.

- **UI App** — `SectionPromotionBanner`, registered in the `Banners` template list. Wraps `PromotionBanner` for canonical margin / padding / container-style chrome, with Content (heading, subline, icon, code button, CTA, countdown) and Design (styling + layout) panels. The promotion banner is configured directly on the Section — there is no `BlockPromotionBanner`.

- **UI** — Plumbed `target?: string` through link-rendering components so consumers can choose the browsing context of editorial links. Default behaviour is unchanged when `target` is omitted (`_self`):

  - `BrandList` — `BrandListItem.target` carries through to the per-brand `NuxtLink`.
  - `HeaderBasic` — new `logoTarget` prop on the logo link.
  - `HeaderShop` — new `logoTarget` prop on the logo link.
  - `LogoSlider` / `LogoGrid` / `LogoSliderSlide` — `LogoSliderSlideProps.target` forwards to the slide's `MaybeLink`.
  - `TopBar` — `informationLinks[].target` forwards to each navigation item.

- **UI Kit** — `target?: string` prop on `LinkTile`, `LinkTileBasic`, `LinkTileCompact`, `LinkTileBig`, and `NavigationMenuTextItem`. Forwarded to the underlying `NuxtLink` / `MaybeLink` to open the link in a new browsing context (`_blank`), with `_self` remaining the default.

- **UI App** — Editors can now choose a link `target` (`_self` / `_blank`, default `_self`) in Studio across single-link Blocks and Sections, via the new `linkTargetOptions` shared field. New `Target` fields on `BlockButton`, `BlockCategoryCard`, `BlockLogoSliderSlide`; per-item `Target` on `SectionBrandList.brandLinks` and `SectionTopBar.informationLinks`; `Logo Link Target` on `SectionHeaderBasic` and `SectionHeaderShop`. Existing configurations are unchanged — the runtime default `_self` matches prior behaviour.

- **UI Kit** — `sectionBrandList.heading` and `sectionGlossaryList.heading` translation keys (EN: "Brands"/"Glossary", DE: "Marken"/"Glossar"). These act as the locale-aware fallback heading when an editor leaves the section's `heading` field empty.

- **UI App** — `SectionGlossaryList`, with a new `glossaryQuery` shared field. Renders a shared alphabetical index of name + link entries, sourced either from a bound Hygraph data source (any app registering a `Glossary` entity) or from a manually authored `items` array. A configurable `heading` field falls back to a locale-aware default when left empty.

- **UI Kit** — `rel?: string` prop on `Button` and `IconButton`. Forwarded to the underlying `NuxtLink` only when the component renders as a link (`href` set), ignored when rendered as a `<button>`. Accepts any valid HTML `rel` token or space-separated combination — e.g. `'prev'`, `'next'`, `'noopener'`, `'noopener noreferrer'`, `'external nofollow'`.

- **UI App** — `SectionLocationFinder`, `SectionLocationDetail`, and `BlockLocationCard`. `SectionLocationFinder` resolves locations via the new canonical `Location` entity and renders a finder with a configurable heading, container style, and Google Maps Map ID; it also exposes a `locationCards` slot for manually curated `BlockLocationCard` instances merged into the same list and map. `SectionLocationDetail` renders the full location page — map, header, image gallery, info list, and a rich description. `BlockLocationCard` is non-standalone (only usable inside `SectionLocationFinder`'s `locationCards` slot); cards without coordinates are silently dropped. Both sections read the Google Maps API promise from `useNuxtApp().$googleMapsApi` and render inert until the storefront registers that plugin.

### Changed

- **UI Kit** — `Media` is now a dispatcher. Images render via the built-in image renderer (unchanged public prop API and DOM/CSS output). Video and audio now render via new built-in native renderers: `MediaVideo` (native `<video>`) and `MediaAudio` (native `<audio>` with the optional `cover` shown above it). A `Media` value of any type renders out of the box with no registration. Playback is controlled by new flat props on `<Media>`, mirroring the HTML attributes 1:1: `controls` (default `true`), `autoplay`, `muted`, `loop`, `playsinline` (default `false`). These are set by the consuming Block, not carried on the `Media` value. Consumers can override the built-in renderer for a media type (e.g. for HLS/DASH or a custom player):

  ```ts
  // plugins/media-renderers.ts
  import { provideMediaRenderers } from '#ui-kit/components/Media/MediaRenderersProvider';
  import VidstackMedia from '../components/VidstackMedia.vue';

  export default defineNuxtPlugin((nuxtApp) => {
    provideMediaRenderers(nuxtApp.vueApp, { video: VidstackMedia, audio: VidstackMedia });
  });
  ```

  `MediaStage` now drives its background `<Media>` as a decorative loop (`autoplay muted loop playsinline`, `controls={false}`); a picked video plays silently and loops behind the foreground content. `MediaVideo` suppresses `autoplay` when the user prefers reduced motion (`prefers-reduced-motion: reduce`), settling on the `poster` frame instead.

- **UI App** — The `media` / `backgroundImage` / `bannerImage` fields of the banner and media sections and blocks now accept both `image` and `video` assets (previously image-only). Affected: `BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`, `BlockCategoryCard`, `SectionBannerBasic`, `SectionBannerIntegrated`, `SectionBannerShowcase`, `SectionBrandHero` (background only), `SectionMediaText`, `SectionProductSliderShowcase`. `SectionPageNotFound` stays image-only (it renders the asset as a CSS `background-image`, not via `<Media>`).

- **UI Kit** — `Pagination` now emits SEO-correct sequence semantics when `hrefTemplate` is set: the previous/next anchors carry `rel="prev"` / `rel="next"` only on edges where the target page actually exists; on the first page the previous control renders as a `<button>` (no `href`), and on the last page the next control does the same, so crawlers don't follow dead links to page 0 or page N+1.

- **UI** — **Breaking:** Replaced `BrandList` with the generic `AlphabeticalIndex` component — an alphabetically grouped link list with a configurable `heading` and an optional per-item `count`, usable for brands, glossaries, and similar A–Z indexes.

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

- **UI App** — **Breaking (`SectionBrandList`):** the `brandLinks` schema field is renamed to `items`, and a new `heading` text field is added. Both `SectionBrandList` and `SectionGlossaryList` now render the shared alphabetical index; `SectionBrandList` keeps the optional count. Stored configurations referencing the old `brandLinks` name will not migrate automatically.

### Removed

- **UI Kit** — **Breaking:** the orphaned `brandGrid.title` translation key — it is no longer referenced anywhere. Consumers that overrode this key in custom locales can delete the override.
- **UI Kit** — `PromotionBanner` has moved to `@laioutr-core/ui` (promo-codes are commerce-domain). ui-kit no longer exports `PromotionBanner/types` — import from `@laioutr-core/ui` instead.

### Fixed

- **UI** — Fixed component props that were silently dropped because they didn't match the target component's API:

  - `FeaturePillList` passed `left-icon` to `Badge` (whose prop is `icon-left`), so pill icons never rendered.
  - `OpeningStatusIndicator`, `OpeningStatusDetail`, `LocationCard`, `LocationFinder`, and `LocationHeader` passed `variant` to `Text`, which has no `variant` prop. Headings using `variant="heading"` rendered with the default `body` styling.
  - `FilterBar` bound `v-model:open` to `FilterOffCanvas`, which exposes `v-model:isOpen` — the off-canvas filter panel could not be opened.
  - `PromotionBanner` passed an invalid `type="text"` to `Button`; the dead attribute was removed.

## [2.2.3]

### Added

- **UI Kit** — `$unitPrice` i18n formatter that renders a `UnitPrice` as a localized `price / reference` string (e.g. `13.99 € / 100 ml`), composing the existing `$money` and `$measurement` formatters. Available as a template global alongside `$money` / `$measurement`, and used internally by `VariantSelectionCard`.

### Changed

- **UI** — `PriceInfo`, `ProductTileBasic`, and `CartListItem` now render their unit price via the new `$unitPrice` formatter instead of inlining `$money(...) / $measurement(...)`. No visual change — the rendered string and each component's BEM classes are unchanged.

### Fixed

- **UI Kit** — `.radius-contained` collapsing to square corners on tall elements. Inset banners (`BannerBasic`, `BannerShowcase`, `BannerIntegrated`, `BrandHero`) now keep their rounded corners regardless of height — previously a banner taller than the viewport width (common at mobile widths) lost its rounding entirely. Full-bleed, edge-to-edge banners still render square. No action required.
- **UI Kit** — `OpeningStatus` components and composables now use the shared `now` clock.

## [2.2.2]

### Changed

- **UI** — `BackgroundAwareButton`'s adaptive lookup variants are now `adaptive-primary` / `adaptive-secondary` / `adaptive-ghost` (previously `primary` / `secondary` / `ghost`), so they no longer shadow `Button`'s literal `primary` / `secondary` variants. The pass-through variants (`tertiary`, `secondary-white`, `ghost-*`, `glass-*`, `subtle`, `info`, `positive`, `danger`, `close-*`) are unchanged.

  In Studio, the new `backgroundAwareButtonFields` shared field exposes the three `Adaptive *` options alongside the existing literal `ButtonVariant` options. Every section and block with a CTA now uses this field — banner sections, the sliders, `BlockButton`, `BlockCard`, `BlockText`, and now also the header, footer email button, 404 page, and pricing-plan card, whose CTAs newly adapt to their surrounding surface tone. Editors opt into per-surface remapping by picking an `Adaptive *` option.

  **Breaking:** Custom themes that override `backgroundAwareButtons` in `defineTheme` / `extendTheme` need their map keys renamed accordingly (`light:light:primary` → `light:light:adaptive-primary`, same for `secondary` and `ghost` across all `light|dark` × `light|dark|bright` combos). Stored Studio CTAs where an editor previously picked "Primary" or "Secondary" will, after upgrade, render as the literal Button variant — the per-surface remap is no longer applied unless the editor re-selects an `Adaptive *` option.

- **UI Kit** — **Breaking:** `Scrollbar` now owns its interaction and sizing logic and takes `progress` (0..1) and `visibleRatio` (0..1) instead of `thumbSize` / `thumbPosition` (px), and emits `update:progress` instead of `track-click` / `drag-start`. It computes thumb size/position, handles drag and track-click, and hides itself when content fits.

  ```vue
  <!-- Before -->
  <Scrollbar :thumb-size="120" :thumb-position="40" @track-click="onClick" @drag-start="onDragStart" />
  <!-- After -->
  <Scrollbar :progress="0.3" :visible-ratio="0.25" @update:progress="(progress, source) => …" />
  ```

  `source` is `'drag'` (continuous) or `'click'` (jump-to-position).

### Fixed

- **UI Kit** — `SwiperScrollbar` thumb mis-sizing and mis-positioning under `slidesPerView: 'auto'`: the thumb now reflects true content size (including gaps and uneven slide widths), dragging tracks the cursor, and clicking the track animates to the nearest slide. No API change for `SwiperScrollbar` consumers.

## [2.2.1]

### Changed

- **UI** — Caption styling on `BannerBasic`: plain/boxed variant, colour scheme, and text-shadow controls — replacing the previous colour-only override. A new `captionVariantField` shared field bundles the controls into a single sidebar group on `BlockBannerBasic` and `SectionProductSliderShowcase`. `Container` no longer strips border-radius from CTA banners in full-width containers (banners now own their own radius).

  **Breaking:** `BannerBasic` replaces `captionColor: string` with `captionVariant: Omit<CaptionFlagProps, 'text'>`. Migrate inline:

  ```ts
  // Before
  <BannerBasic :caption="caption" caption-color="#ff0000" />

  // After
  <BannerBasic :caption="caption" :caption-variant="{ variant: 'plain', textShadow: 'none' }" />
  ```

  **Breaking:** `SectionProductSliderShowcase` schema replaces `captionStyle.color` with `captionVariant`. Existing pages with values stored under `captionStyle` silently drop them on next save — re-author the caption styling via the new Variant panel in Studio.

- **UI** — Sizing-system consolidation. A new `Sizer` primitive (in UI Kit) and matching `sizingField` shared schema route outer-box sizing. Banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) plus `BlockMedia` and `BlockIframe` now route outer-box sizing through `Sizer` instead of bespoke per-block fields. Banner blocks also gain vertical content alignment (2D on Basic, vertical-only on Integrated). `Placeholder` accepts an optional `text` prop.

  **Breaking:** `BannerBasic` no longer accepts `sizing` / `aspectRatio` props. Wrap in `<Sizer>` in the consuming Block.

  **Breaking:** `BlockMedia` drops `aspectRatio`, `height`, and `orientation` schema fields; `BlockIframe` drops `desktopHeight` and `mobileHeight`. Existing pages with values stored under these names silently drop them on next save — author the desired height via the new `sizing` field in Studio.

### Removed

- **UI Kit** — **Breaking:** `Iframe` component removed from `@laioutr-core/ui-kit`. Inline an `<iframe class="…" :src :title />` directly and let `Sizer` (in your Block) drive the height.
- **UI Kit** — **Breaking:** `MediaPreview` no longer accepts `aspectRatio`, `height`, or `orientation`. Wrap in `<Sizer :sizing="…">` (or any parent that provides a definite height) and let `MediaPreview` fill it. Portrait orientation is now done by typing a portrait `aspect-ratio` directly in the schema (e.g. `3/4`).

### Fixed

- **UI** — Fixed `ProductSliderShowcase` padding and width: the slider no longer reserves bleed padding on the wrapper, the banner respects its container, and the slider fills the remaining row width on desktop.
- **UI Kit** — `SwiperChrome` mobile navigation positioning.

## [2.2.0]

### Added

- **UI** — `Footer` accepts two new optional props: `logoPosition?: 'top' | 'bottom'` (default `'top'`) and `logoAlignment?: 'left' | 'center' | 'right'` (default `'left'`, only meaningful when `logoPosition === 'bottom'`). When `logoPosition === 'bottom'`, the top logo-column is hidden, menus span the full top row, and the logo image renders inside the bottom bar between the icons cluster and the copyright; `logoAlignment` controls its placement. Existing behaviour is preserved at the defaults.

- **UI** — Editors can now pick a button size per CTA across every section and block. `buttonFields` exposes a new **Size** selector (`xs` / `s` / `m` / `l`, default `'m'`), and a new `buttonSizeOptions` export covers inline button-size selects. Existing CTAs render unchanged unless an editor explicitly picks a different size. For ui consumers building their own CTA shapes, the following accept an optional `size` on each CTA entry (defaults preserve previous rendering): `HeroSlide`, `PageNotFound`, `BannerShowcase`, `ContentGrid`, `HeaderBasic.ctaButtons[]`, the `ContentSlider` / `CategoryCardSlider` / `ProductSlider` cta types; `PlanCard` gains `ctaVariant` / `ctaSize`.

- **UI** — Forwarded the new `sectionBackground` (and `customSectionBackground`) props through `Container` and `MediaText` to `Backdrop`. Both default to `'none'`, so existing consumers render unchanged.

- **UI** — `HeroSlide` accepts new optional props: `headingSize?: 's' | 'm' | 'l'`, `sublineSize?: 's' | 'm' | 'l'` (defaults `'l'` / `'m'`), and `headingTextShadow?: 'none' | 'soft' | 'strong'` / `sublineTextShadow?: 'none' | 'soft' | 'strong'` (default `'none'`). The text-shadow values apply a layered shadow for legibility against busy hero backgrounds, resolving from the global `--text-shadow-soft` / `--text-shadow-strong` custom properties. Defaults preserve previous rendering.

- **UI** — Added opening-hours primitives (in UI Kit) and location-card domain components (here): `useOpeningStatus` composable, `OpeningStatusIndicator`, `OpeningStatusDetail`, `OpeningStatus`, `OpeningHoursWeeklyTable`, plus `LocationCard` (list / map-popup variants) and `PaymentMethodList`.

- **UI** — `NewsletterRegistration` accepts two new optional props: `caption?: string` (rendered above the heading) and `body?: string` (rendered as a `<RichContent>` block between the headings group and the form), mirroring the caption + body fields exposed by `BlockText`. Both are unset by default.

- **UI** — **Editor:** every section AND block with a configurable heading or subline now exposes an HTML-element selector (`H1`–`H6` / `DIV` for headings; `P` / `H1`–`H6` / `DIV` for sublines) directly next to the field via the `as: 'style'` decorator popup — no more separate "SEO" panel. Newly available on 13 sections and 7 blocks; section defaults: heading → `h2`, subline → `div`; block defaults: heading → `h3`, subline → `h4`. The underlying ui components (`BannerBasic`, `BannerShowcase`, `BannerIntegrated`, `BrandHero`, `CategoryCardSlider`, `CategoryCardGrid`, `ContentGrid`, `ContentSlider`, `EditorialGrid`, `HeroSlide`, `LogoGrid`, `LogoSlider`, `NewsletterRegistration`, `PageHero`, `PageNotFound`, `ProductSlider`, `ProductSliderShowcase`, `VariantSelectorConfigurator`) accept new optional `headingAs` / `sublineAs` props (additive).

- **UI Kit** — `CaptionFlag` accepts an optional `textShadow?: 'none' | 'soft' | 'strong'` prop. When `'soft'` or `'strong'`, a layered text-shadow improves legibility against busy backgrounds. Defaults to `'none'`, so existing consumers render unchanged. The values resolve from two new global CSS custom properties, `--text-shadow-soft` and `--text-shadow-strong`, so consumers can override them per theme.

- **UI Kit** — `HighlightedText` atom — renders a string with substring matches wrapped in `<mark>`. Diacritic-insensitive (NFD fold + combining-mark strip), highlights all occurrences, accepts a `highlightClass` for per-instance styling. Replaces the inline highlight loop in `InputAutocomplete`.

- **UI Kit** — Opening-hours primitives in ui-kit: `useOpeningStatus(openingHours, now)` composable (reactive `isOpen` + next state-change event across a 30-day horizon, respecting IANA timezone and one-off date exceptions), `OpeningStatusIndicator` (open/closed pill), `OpeningStatusDetail` (localized one-liner), `OpeningStatus` (Indicator + Detail combined), and `OpeningHoursWeeklyTable` (weekly schedule as a `DescriptionList`, grouping consecutive same-hours days). Adds `openingStatus.*`, `openingHoursWeeklyTable.*`, and `locationCard.*` i18n keys. (`LocationCard` and `PaymentMethodList` land in `@laioutr-core/ui`.)

- **UI Kit** — `sectionBackground?: BackdropBackground` prop on `Backdrop`. When set and `containerStyle === 'boxed'`, an outer band element paints edge-to-edge around the constrained `OnSurface` root, creating two distinct color zones. In `full-width` mode the band is inert. Accepts the same value space as `background`; defaults to `'none'`, so existing consumers render identically.

- **UI App** — A new **Section Background** field-pair (`sectionBackground` + `customSectionBackground`) on every section that exposes a `containerStyle` + `background` config (17 sections). It paints the edge-to-edge band around a boxed container — visible only in `boxed` mode, hidden in `full-width`. Defaults preserve current rendering.

- **UI Kit** — `block?: boolean` prop on `Button` (and through extension `BackgroundAwareButton`), defaulting to `false`. When `true`, the button switches to `flex` + `width: 100%` and stretches to its container width. New Storybook story: `Block`.

- **UI Kit** — `laioutr:beforeModuleRegister` Nuxt hook. Fires before the ui-kit module registers each upstream Nuxt module, with `{ name, key, options }`. Consumers can mutate `options` to override defaults applied by `registerModule`:

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

- **UI App** — `SectionContentGrid` — hybrid slot/query wrapper. `dataSource: 'slot'` (default, `BlockCard` via the `default` slot) or `dataSource: 'query'` (auto-populated from a blog post collection).

- **UI App** — Studio preview images (`previewSrc`) for 31 blocks (plus 2 refreshed). Editors browsing the block picker now see a representative illustration for each placeable element.

- **UI App** — `BlockHeroSliderSlide` gains per-element text-shadow controls (caption, heading, subline; `none` / `soft` / `strong`, default `none`) and per-slide text-size controls for heading and subline (S/M/L; defaults heading `l`, subline `m`). Existing stored slides render unchanged.

### Changed

- **UI** — `HeaderBasicMenu` → `MenuBasic`. The component was a generic basic navigation menu (used by both `SectionHeaderBasic` and `SectionHeaderShop`), not a sub-component of `HeaderBasic`. Exported type `HeaderProps` → `MenuBasicProps`, `MenuItem` → `MenuBasicItem`; root CSS class `.header-basic-menu` → `.menu-basic`.

  **Breaking:** `BlockMenuHeaderBasic` → `BlockMenuBasic`. `defineBlock({ component: 'BlockMenuHeaderBasic' })` → `'BlockMenuBasic'` — **stored project configurations that reference this block by name need a one-time migration**. Studio label `'Basic Header Menu'` → `'Basic Menu'`.

- **UI** — **Breaking:** the `image?: MediaImage` prop on `NewsletterRegistration` is removed in favor of a new `media` slot. The right-side / top-on-mobile media area is now consumer-provided via `<template #media>...</template>`. The legacy `theme.image('newsletterRegistrationTeaser')` fallback is gone; if no media is provided, the content side takes the full width.

- **UI** — **Migrated (2 sections):** `SectionProductSlider`, `SectionProductSliderShowcase` lose their dedicated "SEO" fieldset; `headingElement` is now stored at `headingStyle.element`. **Action required:** anyone with stored `headingElement` values on these two sections must re-pick the heading element in Studio once.

- **UI Kit** — **Breaking:** `TextGroup` prop and type renames — `headingTag` → `headingAs`, `sublineTag` → `sublineAs`; `TextGroupHeadingTag` → `TextGroupHeadingAs`, `TextGroupSublineTag` → `TextGroupSublineAs`. `TextGroupSublineAs` is widened to include `'h1'`. `SwiperChrome` gets the same rename plus an added `sublineAs`. External consumers that import the old type names or bind `:heading-tag` / `:subline-tag` must update to the new names.

- **UI Kit** — The `highlightMatch` utility now returns segments with `highlight: boolean` (was `matched: boolean`) and finds every occurrence (was only the first).

- **UI App** — **Breaking (`BlockButton`):** the single `icon` field is replaced by `iconLeft` and `iconRight`. Stored configs using the old `icon` key must migrate to `iconRight` to preserve the original right-aligned visual. A new `width` field (`hug` default / `fill`) is added, and the schema is reorganized into Content and Design panels.

- **UI App** — `SectionContentSlider` now accepts the three banner blocks (`BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase`) and `BlockText` in its slot, alongside the existing `BlockCard` / `BlockMedia`.

- **UI App** — `SectionProductSlider` now exposes the standard `background` and `customBackground` controls in Design → Styling.

- **UI App** — Rewrote `studio.label`, `description`, and `tags` for all 36 sections and 37 blocks so the copy reads naturally to UX designers and e-commerce managers in Studio — removing implementation jargon and giving several blocks clearer labels (e.g. `BlockIframe` → "Embedded Page", `BlockMedia` → "Image or Video", `BlockProductDetailCartButton` → "Add to Cart", `BlockText` → "Text Block"). No runtime behavior change.

- **UI** — Removed the strawberry-field theme.

### Fixed

- **UI** — Fixed `FilterOffCanvas` / `FilterModal` filter selections never reaching the parent's `selectedFilters`. Three inner filter components had moved to the canonical `modelValue` channel, so the parent's `:checked` binding fell through as a raw HTML attribute and `@update:checked` was never emitted — brand checkboxes did not toggle, the price-range slider received `checked="[object Object]"`, and the stock-filter switch toggled visually but never propagated.

  **Breaking:** `FilterOffCanvasSwatchList`'s v-model channel is renamed from `'checked'` to the default `modelValue`. Consumers using `v-model:checked="…"` must switch to `v-model="…"`.

- **UI** — `SearchAutoSuggestItem` now uses the shared `HighlightedText` atom instead of its own inline highlighting, picking up diacritic-insensitive matching and all-occurrences highlighting. Visual output is unchanged.

- **UI Kit** — `Card`'s body text not visually centering or end-aligning when `textAlignment` is set — the capped-width body box now follows the chosen alignment via `align-self`, matching the caption/heading/subline.

- **UI App** — `SectionMediaText` custom background. When an editor picked a custom color, nothing rendered because the value was passed to a non-existent prop. The custom color is now resolved into `background` directly. Preset values (`none`, `pale`, `solid`, `default`) keep working unchanged.

## [2.1.0]

### Added

- **UI** — Restored banner / category-slider / showcase parity with v1:

  - `BannerBasic`: new optional `size` prop (`'s' | 'm' | 'l'`, default `'m'`) and `aspectRatio` prop.
  - `CategoryCardSlider`: new optional `cta` prop (`{ text, link, variant }`).
  - New `BlockBannerBasic`, `BlockBannerIntegrated`, `BlockBannerShowcase` blocks — first-class block versions of the banner trio (previously only available as `SectionBanner*`). `BlockBannerBasic` gains an optional `aspectRatio` schema field.
  - `SectionCategoryCardSlider`: new optional `cta` schema field with `ctaVisible` visibility decorator.
  - `SectionProductSliderShowcase`: new optional `bannerTextSize` schema field (`s` / `m` / `l`, default `m`).

### Changed

- **UI** — `SectionContentSlider` removed the cosmetic hardcoded `surface-tone="'light'"` binding; surface tone now derives from the outer `Backdrop` as intended (no rendering change).
- **UI** — Routed elevation shadows through the `--shadow-s` / `--shadow-m` / `--shadow-l` design tokens instead of hardcoded `box-shadow` values, so theme overrides take effect on Card, NavigationMenuContent, Select, ContextMenu, DropdownMenu, AlertDialog, Toast, ThemeEditor, PlanCard, PersonaQuote, SearchAutoSuggest, and the variant-selector controls. Default-theme rendering is unchanged.
- **UI** — Reverted HeroSlider height behaviour to v1.

### Fixed

- **UI Kit** — `NavigationMenuTextItemWrapper` rendering white text on a light surface when used inside a topbar (`inTopbar` + `surfaceTone="light"`). Items now correctly inherit dark text on a light background. Affects `SectionTopBar` with its default `colorMode="grey"` and any other consumer combining `inTopbar` with `surfaceTone="light"`. No action required.

## [2.0.0]

A large coordinated refactor across the UI layer (UI Kit, UI, and the section/block app layer). This is the major release that unified naming, the surface-tone system, form prop contracts, and the public CSS API. The most consequential consumer-facing changes are summarized below; see the migration sub-sections at the end for diffs.

### Added

- **UI** — **New ui components:** `Container` (backdrop + grid + alignment composition), the `MegaMenu` compound (`MegaMenu` + `MegaMenuTrigger` + `MegaMenuContent`), `BlogPostDetail`, `ProductDetail`, `ScrollAnchor`, `BlogPostListing`, a `PopUp` shell + presets (`PopUpInfo`, `PopUpNewsletter`, `PopUpPromotion`), `SortModes`, and `SearchAutoSuggest` (+ `SearchAutoSuggestItem`).
- **UI** — **Auto-import prefix unified to `L`.** `@laioutr-core/ui` now registers its auto-imported components with prefix `L` (matching UI Kit) instead of `Lui`. Every `<LuiX>` template tag pointing at a `ui` component must be renamed to `<LX>`. Combined with the cross-package moves, consumers can apply a single `<Lui` → `<L` sweep across templates.
- **UI** — **New UI-Kit atoms relevant to ui consumers:** `IconButton`, `TextGroup`, `OnSurface` (replaces `OnBackground`), `LinkTile` (replaces `CategoryCard`), `HighlightToggle`, `StatusMessage`, `MediaStage`, `BadgePromotion` (replaces `SavingsBadge`), `NavLinkItem`, `NavSectionHeading`, and the Swiper widget family moved in from `ui`.
- **UI** — **New sections/blocks:** `SectionContentGrid`, `SectionEditorialGrid`, `SectionCategoryCardGrid`, `SectionProductReviews`, `SectionContentSlider`; `BlockCategoryCard`, `BlockUspBannerItem`, `BlockProductsListing`, `BlockFilterBar`, `BlockSortModes`, `BlockPagination`, `BlockMobileMenuBasic`, `BlockMobileMenuShop`, `BlockMenuSideBySide`, `BlockMenuHeaderBasic`, `BlockMegaMenu`, `BlockProductDetailVariantSelectorOptions`.
- **UI Kit** — New components: `IconButton` (icon-only button; required `label` rendered as `aria-label`, required `icon`), `TextGroup` (caption + heading + subline molecule), `OnSurface` (surface-tone context provider, replaces `OnBackground`), `LinkTile` (replaces `CategoryCard`), `HighlightToggle` (replaces `BillingCycleSwitch`), `StatusMessage` (generic icon-led message, replaces `LoginReviewPanel`), `MediaStage` (replaces `CtaBannerBase`), `BadgePromotion` (replaces `SavingsBadge`, redesigned), `NavLinkItem` (replaces `MenuLinkItem`), `NavSectionHeading` (replaces `MenuSectionTitle` / `FooterTitle`), `SwiperChrome`, `Iframe` (sandboxed wrapper), and the reka-ui atoms `Tabs`, `Popover`, `ContextMenu`, `Listbox`, `InputSlider`, `InputAutocomplete`, `InputCombobox`, `InputPin`.
- **UI Kit** — New `useSwiperEdgeState()` and `useFieldContext(props)` composables. The Swiper widget family (`SwiperBullets`, `SwiperNumbers`, `SwiperNavBar`, `SwiperArrows`, `SwiperScrollbar`, `ThumbnailsSlider`) and `DarkModeSwitch`, `StockInfoSummary` (was `BuyBoxStockInfo`), `LanguageSwitcher`, `RatingProgressBarFilter`, `CommonSwiper`, and the `swiperBreakpoints` helper move into ui-kit.
- **UI Kit** — Many new locale keys (countdown, pagination, social-share, variant-selection, opening-hours, and more). New CSS tokens `--on-light-*`, `--on-dark-*`, `--on-bright-*`.
- **UI App** — **New sections:** `SectionContentGrid` (hybrid slot/query), `SectionEditorialGrid`, `SectionCategoryCardGrid`, `SectionProductReviews` (replacing the legacy block-level implementation). `SectionContentSlider` adopts a hybrid slot/query data source (default `slot`). `SectionUspBanner` is reshaped: it drops `bannerStyle` and `colors` (moved to top-level `color` / `iconColor`) and extracts its `usps[]` into a new `items` slot populated by `BlockUspBannerItem`.
- **UI App** — **New blocks:** `BlockCategoryCard` and `BlockUspBannerItem` (non-standalone children); `BlockProductsListing`, `BlockFilterBar`, `BlockSortModes`, `BlockPagination` (split out of the previous combined `SectionProductListing`); `BlockMobileMenuBasic` and `BlockMobileMenuShop` (non-standalone, hosted in header sections' `mobile` slots); `BlockMenuSideBySide` and `BlockMenuHeaderBasic` (non-standalone, header `desktop` slots); `BlockMegaMenu` (thin wrapper around the new `MegaMenu` compound); `BlockProductDetailVariantSelectorOptions`.

### Changed

- **UI** — **Breaking: extensive component renames in `ui`.** Final → old names include: `HeaderBasic` ← `Header`; `HeaderShop` ← `ShopHeader`; `HeroSlider` ← `BasicHeroSlider`; `HeroSlide` ← `BasicHeroSliderSlide`; `MobileMenuBasic` ← `MobileMenu`; `MobileMenuShop` ← `MegaMenuMobile`; `MenuSideBySide` ← `SideBySideMenu`; `EditorialGrid` ← `ArticlesGrid`; `ContentGrid` ← `CardGrid`; `ContentSlider` ← `GalleryContentSlider`; `BrandList` ← `BrandGrid`; `MediaText` ← `CmsImageText`; `MediaGallery` ← `LightboxGallery`; `SearchResultHero` ← `SearchResultHeader`; `PageNotFound` ← `Error404Page`; `ProductListingGrid` ← `ProductGrid`; `QuoteCardSlider` ← `QuoteSlider`; the BuyBox family renamed to `EnergyLabel`, `BenefitsBox`, `PriceInfo`, `CouponBox`, `QuantityDiscount`, `ProductTitle`, `AddToCart`; the `VariantSelector*` / `FilterOffCanvas*` / `PlanCard*` families renamed. Every `*Props` type, BEM block, and Storybook title follows the new name.

- **UI** — **Breaking: surface-tone migration.** `BackgroundBrightness` → `SurfaceTone` (`'light' | 'dark' | 'bright'`) across the form-input families. `OnBackground` is deleted — use `OnSurface` + the `useSurfaceTone()` composable. `colorToBackground` renamed to `colorToSurfaceTone`. `HeaderBasicMenu`'s `textColor` is replaced by `surfaceTone` with a **semantic value flip**: old `text-color="dark"` (dark text on light bg) maps to new `surface-tone="light"` — invert the value, don't just rename.

- **UI** — **Breaking: Button refactor.** `Button.type` prop removed (use `IconButton` for icon-only buttons). Sizes `'small' | 'medium' | 'large'` → `'xs' | 's' | 'm' | 'l'` (default `'m'`). `ButtonVariant` flattened to a single 14-value union; `'input-field'` → `'subtle'`, `'video-control'` removed. Icons move from `#iconLeft` / `#iconRight` slots to typed `iconLeft` / `iconRight` props.

- **UI** — **Breaking: form prop normalization.** `Field` drops `error: string` (use `errorMessage` + `invalid`); `Input` `isError` → `invalid`; `Label` `error` → `invalid`; `Switch` and `Checkbox` v-model channel renamed from `'checked'` to default `modelValue` (`v-model:checked` callsites must become `v-model`); `Select` `size` prop removed (express via `:trigger="{ size: 's' }"`).

- **UI** — **Breaking: `is*` prefix sweep.** For props where the subject is the component itself, the `is` prefix is dropped — e.g. `Badge.isRounded` → `rounded`, `Button.isLoading` → `loading`, `Toast.isOpen` → `open`, `Pagination.isNavigationNumbers` → `variant`, `HeaderBasic.isSticky` → `sticky`, `HeroSlider.isFullHeight` → `fullHeight`, `CouponBox.isApplied` → `applied`, `ProductTileBasic.isAddToCart*` → `addToCart*`. World-state facts (`isUserLoggedIn`, `isSoldOut`, `isAboveTheFold`, etc.) keep `is*`.

- **UI** — **Breaking: TextGroup tag-prop rename.** `headingTag` / `sublineTag` → `headingAs` / `sublineAs`; types `TextGroupHeadingTag` / `TextGroupSublineTag` → `*As`. `TextGroupSublineAs` widened to include `'h1'`.

- **UI** — **Breaking: Studio data migration required** for every renamed/deleted section and block component string, every renamed schema field, and every promoted/demoted section ↔ block. Highlights:
  - Section renames: `SectionBasicHeader` → `SectionHeaderBasic`, `SectionImageAndContent` → `SectionMediaText`, `SectionShopHeader` → `SectionHeaderShop`, `SectionError404` → `SectionPageNotFound`, `SectionPricingPlans` → `SectionPlanCardSlider`, `SectionPricingTable` → `SectionPlanComparisonTable`, the banner blocks promoted to `SectionBanner*`, and more.
  - Block renames: `BlockBasicHeroSliderSlide` → `BlockHeroSliderSlide`, `BlockTestimonial` → `BlockPersonaQuote`, `BlockProductGrid` → `BlockProductsListing`, `BlockCmsButton` → `BlockButton`, `BlockCmsCardContent` → `BlockCard`, etc.
  - Schema fields normalized to the section-config standard across 30+ sections/blocks: `blockMargin` → `margin`, `blockPadding` → `padding`, `textAlignment` → `alignment`, `headline*` → `heading*`, `actionButton[0]` → `cta` + `ctaVisible`, and the `ctaButton.variant` enum reshaped from 12 to 14 values (e.g. `white-ghost` → `ghost-white`, `input-field` dropped).
  - Header refactor: `HeaderBasic` / `HeaderShop` are now slot-based; inline navigation/mobile-menu props (`menuItems`, `mobileMenuItems`, `navigationMenuItems`, `socialLinks`) are removed and provided via `desktop` / `mobile` slots filled by the hosting Section.
  - `MegaMenu` (was `MegaMenuDesktop`): complete API replacement — old `colorMode` / `isOpen` / `megaMenuItems` / `contentLayout` props gone; new `items` / `surfaceTone` / `defaultValue` props and split `MegaMenuTrigger` / `MegaMenuContent` compound parts.

- **UI** — **Breaking: public CSS class renames** following the component renames — e.g. `.cms-image-text*` → `.media-text*`, `.brand-grid*` → `.brand-list*`, `.shop-header*` → `.header-shop*`, `.product-grid*` → `.product-listing-grid*`, `.error-404-page*` → `.page-not-found*`, `.basic-hero-slider*` → `.hero-slider*`, plus `is-` state-modifier prefixes dropped (`.breadcrumbs-item--is-active` → `--active`, `.swatch-chip.is-selected` → `.swatch-chip--selected`). `Container` uses `.s-scontainer` as its root block.

- **UI** — **Breaking: locale key renames** — `lightboxGallery.*` → `mediaGallery.*`, `colorSwatch.*` → `swatchChip.*`, `searchInput.*` → `inputSearch.*`, `passwordInput.*` → `inputPassword.*`, `savingsBadge.*` → `badgePromotion.*`, `shopHeader.*` → `headerShop.*`; `couponCodeInput.*` removed (reuses `cart.couponCode` and `inputSearch.clear`).

- **UI Kit** — **Breaking — `Button` refactor.** `Button.type` removed (use the new `IconButton`). Sizes `'small' | 'medium' | 'large'` → `'xs' | 's' | 'm' | 'l'` (default `'m'`). `ButtonVariant` flattened to a single 14-value union; `CtaButtonVariant` / `IconOnlyButtonVariant` removed. `'input-field'` → `'subtle'`; `'video-control'` removed. Legacy alias layer dropped (`LegacyButtonVariant`, `normalizeButtonVariant`, `VARIANT_ALIASES`, …). `iconLeft` / `iconRight` now accept `IconName` props instead of `#iconLeft` / `#iconRight` slots. `isLoading` → `loading`; new `spinnerType?: 'row' | 'round'`. `BackgroundAwareButtonVariant` rebuilt to mirror the new shape — theme-level `backgroundAwareButtons` maps must rewrite their value entries.
- **UI Kit** — **Breaking — surface-tone migration.** `OnBackground` deleted; use `OnSurface` + `useSurfaceTone()` (`useSurfaceTone(props)` resolves explicit prop > nearest ancestor context > `'light'`). `BackgroundBrightness` type removed in favor of `SurfaceTone` (`'light' | 'dark' | 'bright'`) across the Field, Input, Switch, Select, Checkbox, `InputRadio`, and Swatch families. `colorToBackground` → `colorToSurfaceTone`. `Backdrop`'s `containerBackground` and `backgroundBrightness` props removed — pass `:background` directly. `MediaPreview`'s `mode` prop → `surfaceTone`. `provideSurfaceToneContext` → internal `_provideSurfaceToneContext` (only `<OnSurface>` may set tone publicly).
- **UI Kit** — **Breaking — form prop normalization.** `Field` drops `error: string` (use `errorMessage` + `invalid`). `Input` / `InputAutocomplete` / `InputCombobox`: `isError` → `invalid`. `Label`: `error: boolean` → `invalid: boolean`. `Switch` and `Checkbox`: v-model channel `checked` → default `modelValue` (`v-model:checked` call sites must become `v-model`); `Switch` size `'small' | 'medium'` → `'s' | 'm'`. `Select` `size` prop removed (use `:trigger="{ size: 's' }"`). `InputPassword`: `readOnly` → `readonly`.
- **UI Kit** — **Breaking — `is*` prefix renames** (drop `is` where the component is the subject): `Badge.isRounded` → `rounded`, `Button.isLoading` → `loading`, `Label.isRequired` → `required`, `ThumbnailsSlider.isCentered` → `centered`, `Toast.isOpen` → `open`, `LinkTileBig.isBackgroundDark` → `backgroundDark`, `Pagination.isNavigationNumbers` → `variant: 'arrows' | 'numbers'`, `OptionTileImage` / `OptionTileText` `notAvailable` object flattened to `unavailable?` + `unavailableTooltip?`.
- **UI Kit** — **Breaking — other prop / API changes.** `Accordion.accordionStyle` → `variant`. `LoadingSpinner`: `type` → `variant`, color `variant` → `colorScheme`, size `'small' | 'large'` → `'s' | 'l'`. `IconList` size scale → `'xs' | 's' | 'm'`. `Card` redesigned (size → `'m' | 'l'`, many new props, `Card/types.ts` deleted — import `CardProps` / `CardCta` from `Card.vue`). `BadgePromotion` props redesigned (BEM root `.badge-promotion`). `Sheet` drops `component` / `customClass`. Various banner-refactor changes (`variant` prop removed from the three banners; border-radius now context-driven via `.radius-contained`). `reka-ui` bumped `^2.3.1` → `^2.9.6`.
- **UI Kit** — Numerous BEM/CSS class renames and the removal of `<style scoped>` / `:deep()` / `:global()` across many components (full diff preserved below).
- **UI App** — **Breaking — section renames (Studio data migration required):** `SectionBasicHeader` → `SectionHeaderBasic`; `SectionBasicHeroSlider` → `SectionHeroSlider`; `SectionImageAndContent` → `SectionMediaText`; `SectionTestimonialPersonaQuote` → `SectionPersonaQuoteSlider`; `SectionTestimonialQuoteCardSlider` → `SectionQuoteCardSlider`; `SectionBrandLink` → `SectionBrandList`; `SectionSearchResultHeader` → `SectionSearchResultHero`; `SectionPricingPlans` → `SectionPlanCardSlider`; `SectionPricingTable` → `SectionPlanComparisonTable`; `SectionPageHeader` / `SectionCategoryHeader` → `SectionPageHero`; `SectionShopHeader` → `SectionHeaderShop`; `SectionError404` → `SectionPageNotFound`; `SectionProductDetailContainer` → `SectionProductDetail`; `SectionLogoPresentation` → split into `SectionLogoSlider` / `SectionLogoGrid` by the old `view` discriminator; `BlockCtaBanner{Basic,Integrated,Showcase}` → promoted to `SectionBanner{Basic,Integrated,Showcase}`; `SectionBannerContainer` → consolidated into `SectionContainer`.
- **UI App** — **Breaking — block renames (Studio data migration required):** `BlockBasicHeroSliderSlide` → `BlockHeroSliderSlide`; `BlockTestimonial` → `BlockPersonaQuote`; `BlockProductGrid` → `BlockProductsListing`; `BlockQueryPagination` → `BlockPagination`; `BlockQuerySorting` → `BlockSortModes`; `BlockCmsButton` → `BlockButton` (Studio label `CMS Button` → `Button`); `BlockCmsCardContent` → `BlockCard`; `BlockSingleLogoPresentation` → `BlockLogoSliderSlide`.
- **UI App** — **Breaking — schema field renames (Studio data migration required)** normalized across 30+ sections/blocks to the section-config standard, including: `blockMargin` → `margin`; `blockPadding` / `innerBlockPadding` → `padding`; `textAlignment` / `contentPosition` / `contentAlignment` → `alignment`; `headline*` → `heading*`; `actionButton[0]` → `cta` object + `ctaVisible`; `accordionStyle` (`BlockAccordion`) → `variant`; `image` (`SectionNewsletterRegistration`) → `media`; `BlockIframe.url` → `src`; `SectionScrollAnchor.id` → `anchorName`; `SectionPageHero.title` → `heading`; plus many per-section renames on `SectionTopBar`, `SectionFooter`, `SectionProductSlider`, `SectionProductSliderShowcase`, `SectionCategoryCardSlider`, `SectionQuoteCardSlider`, and others. `is*`-prefixed schema fields (`isSticky`, `isSaleDesign`) are kept unchanged so stored configurations continue to bind without migration.
- **UI App** — **Breaking — `ctaButton.variant` value remap (Studio data migration required):** the CTA variant enum was reshaped from 12 to 14 values. Notable remaps: `white-ghost` → `ghost-white`; `white-secondary` → `secondary-white`; `black-ghost` → `ghost-black`; `white-close` → `close-white`; `black-close` → `close-black`; `glass` → `glass-black` (verify with design); `input-field` → dropped (map to `subtle` or drop); `black-close-always-black` / `white-close-always-white` lose their always-color semantics. New variants without a predecessor: `tertiary`, `positive`, `danger`, `subtle`, `info`.
- **UI App** — New shared-field presets in `shared-fields/`: `background.ts`, `margin.ts`, `padding.ts`, `size.ts`, `visibility.ts`, `buttonVariant.ts`, `themedStyleColor.ts`, `button.ts`, `containerStyle.ts`, `headingElement.ts`, `surfaceTone.ts`. Top-level panels normalized to `Content` + `Design` (with `Styling` / `Layout` dividers) across 30+ sections/blocks.
- **UI App** — `SectionBlogPostDetail`, `SectionProductDetail`, `SectionScrollAnchor`, `SectionBlogPostListing`, `SectionMediaText`, `BlockMedia`, and `BlockIframe` are now thin configuration adapters over their `ui` components, with no schema changes.

### Removed

- **UI** — **Breaking:** `BuyBox` (static demo), the `InpageNavigation*` family (covered by `CategoryCardGrid` / `CategoryCardSlider`), `CmsContainer` / `ContainerContent`, `PageHeader`, `CategoryNodeButton`, `LightboxModal` (use `Lightbox` from UI Kit), `FilterBarQuickFilters`, `MobileMenuButtonGrid`, `GridCardContent` / `GridCardTextContent`, and `FooterMenuItem` / `FooterTitle` (replaced by `NavLinkItem` / `NavSectionHeading`).
- **UI** — **Breaking: components moved to UI Kit** — `Card`, `Iframe`, `DarkModeSwitch`, `BuyBoxStockInfo`, `LanguageSwitcher`; `Media` (import `MediaPreview` directly).
- **UI** — **Breaking: sections/blocks deleted with Studio migration** — `SectionBlogSlider` / `SectionFlexibleContentSlider` → `SectionContentSlider`; `SectionCardGrid` → `SectionContentGrid`; `SectionInpageNavigation*` → `SectionCategoryCardGrid` / `SectionCategoryCardSlider`; `SectionFilterBar` (now block-only as `BlockFilterBar`); `SectionShopHeaderNavigation` (demoted into `BlockMenuSideBySide`); `BlockProductReviews` → `SectionProductReviews`.
- **UI Kit** — **Breaking:** `OnBackground` (use `OnSurface`), `BillingCycleSwitch` (use `HighlightToggle`), `CategoryCard` (use `LinkTile`), `Breadcrumb` (moved to ui as `BreadcrumbsItem`), `Menubar`, `Stepper`, `HoverCard`, `DiscountFlag` (use `Badge`), `SavingsBadge` (use `BadgePromotion`), `SwiperNavigationNumbersWithArrows` (use `SwiperNavBar` with `navigationStyle="numbers"`).
- **UI Kit** — Moved out to `@laioutr-core/ui`: `LightboxGallery` (→ `MediaGallery`), `SearchResultHeader` (→ `SearchResultHero`), `ReviewForm`, `SocialShare`, `NavigationNodeButton` (→ `MenuSideBySideNode`).
- **UI App** — **Breaking (Studio data migration required):** `SectionBlogSlider` and `SectionFlexibleContentSlider` → `SectionContentSlider`; `SectionTestimonialQuoteCard` → `SectionQuoteCardSlider` (single slide); `SectionCardGrid` → `SectionContentGrid`; `SectionInpageNavigationBasic` / `Big` / `Compact` → `SectionCategoryCardGrid` / `SectionCategoryCardSlider`; `SectionAmbiendoHeader` → `SectionHeaderShop` with `BlockMenuSideBySide`; `SectionShopHeaderNavigation` → demoted into `BlockMenuSideBySide`; `BlockProductReviews` → `SectionProductReviews`; `SectionFilterBar` → block-only `BlockFilterBar`.

### Migration — imports and template tags (UI Kit)

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

### Migration — props and bindings (UI Kit)

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

### Migration — CSS class names (UI Kit)

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

- **UI Kit** — New z-index token scale in ui-kit: `--z-index-sticky` (100), `--z-index-modal` (1400), `--z-index-popover` (1500), `--z-index-tooltip` (1600), `--z-index-toast` (1700). Modal overlays and content share one token so stacked modals layer correctly via DOM order.

### Changed

- **UI Kit** — All portaled components (Dialog, Sheet, AlertDialog, DropdownMenu, Select, Tooltip, MediaLightbox) now set z-index on their content class for reliable stacking. Header sections opt out of section isolation so their sticky/fixed chrome remains visible, and `FilterBar` teleports its scroll-triggered fixed bar to `<body>` to escape section isolation, using an IntersectionObserver instead of hardcoded scroll thresholds.
- **UI App** — Reworked z-index architecture across the UI stack. Header sections opt out of section isolation so their sticky/fixed chrome remains visible above subsequent sections; the filter bar teleports its scroll-triggered fixed bar to `<body>` to escape section isolation.

## [1.33.0]

### Added

- **UI Kit** — `scrollToTop` prop on `Pagination` (defaults to `true`), which scrolls the viewport to the top when navigating pages.
- **UI App** — `scrollToTop` prop on Pagination (default `true`), which scrolls the viewport to the top when navigating pages.

### Fixed

- **UI Kit** — `Button` now emits `click` events on the `NuxtLink` branch and forwards `$attrs` on both root elements, enabling reka-ui `as-child` to work correctly.
- **UI Kit** — `SectionBlogPostListing` now uses reactive computed properties for client-side pagination.
- **UI App** — Button now emits `click` events on the NuxtLink branch and forwards `$attrs` on both root elements, so reka-ui `as-child` works correctly.
- **UI App** — `SectionBlogPostListing` uses reactive computed properties for client-side pagination.

## [1.32.5]

### Fixed

- **UI** — Fixed Card `RichContent` prop (`:content` → `:html`), simplified SocialShare layout, and wrapped BlogPostDetail content in a container div.

## [1.32.4]

### Added

- **UI App** — Standalone `BlockSocialShare` block for sharing the current page via social platforms.

### Fixed

- **UI** — Prevented breadcrumb item text from wrapping by applying single-line text-overflow with ellipsis.

## [1.32.2]

### Fixed

- **UI Kit** — CSS-layer order in Studio preview.
- **UI App** — CSS-layer order in Studio preview.

## [1.32.1]

### Fixed

- **UI App** — Workaround for entities not refetching on locale change.

## [1.32.0]

### Added

- **UI** — Added the `$tl` Vue global for locale translations and expanded the locale system with 13 new message groups, full German translations, and umlaut fixes. Migrated 46 components from `useLocale().t` to `$tl` template calls.
- **UI App** — `BlockProductReviews` block, `PageHeader` section, and `SearchResultsHeader` section.

### Fixed

- **UI** — Use correct hover font-colors for some elements.
- **UI App** — Correct hover font colors for some elements; loading state from async watchers.

## [1.31.4]

### Fixed

- **UI App** — Missing `useResolvedLink` import in `SectionBreadcrumbs` that caused a runtime error.

## [1.31.0]

### Added

- **UI Kit** — `$duration` formatter for ISO 8601 duration strings. Uses `Intl.DurationFormat` with locale awareness when available, falling back to narrow-style manual formatting (`1h 30m 5s`). Available as template global and auto-import.
- **UI App** — `LanguageSwitcher` now uses market-domain data for available locales; locale props are threaded through Header, TopBar, MobileMenu, and MegaMenu components, and sections use `useAvailableLocales` for navigation-based locale switching.

### Changed

- **UI** — `LanguageSwitcher` now uses market-domain data for available locales instead of the removed `useLocalesData` composable. Locale props are threaded through Header, TopBar, MobileMenu, and MegaMenu components, and sections use `useAvailableLocales` for navigation-based locale switching.
- **UI** — Migrated URL fields from `text` to `link` type and resolve links through `linkResolver` for market-aware URL resolution.
- **UI Kit** — `$money` and `$measurement` i18n formatters moved from frontend-core to ui-kit, removing dead code. Template globals and auto-imports work identically — no consumer changes needed.
- **UI App** — URL fields migrated from `text` to `link` type and resolved through `linkResolver` for market-aware URL resolution.

### Deprecated

- **UI App** — `useLinkResolver` is converted to a singleton `linkResolver` object that no longer requires a setup context. `useLinkResolver` is preserved as a deprecated re-export. Unused `useSwitchLanguagePath` and `useSwitchMarketUrl` wrappers were removed.

## [1.30.0]

### Added

- **UI Kit** — An ESLint rule (`laioutr/require-css-layer`) that enforces all new component CSS is layered.

### Changed

- **UI** — Wrapped all component CSS in `@layer lui-components` for cascade layer control, allowing consumers to override component styles with unlayered CSS without needing `!important`. Existing `@layer lui-overridable` blocks (Icon, Text) are preserved. A new ESLint rule (`laioutr/require-css-layer`) enforces that all new component CSS is layered.
- **UI Kit** — All component CSS is now wrapped in `@layer lui-components`, allowing consumers to override component styles with unlayered CSS without needing `!important`. Existing `@layer lui-overridable` blocks (Icon, Text) are preserved.
- **UI App** — All component CSS is now wrapped in `@layer lui-components` for cascade-layer control.

## [1.29.3]

### Fixed

- **UI Kit** — `ThemeSwitcher` import and `ThemeWithMeta`.
- **UI Kit** — `Input` prop fallthrough and the `ShopHeader` close-button.
- **UI App** — ThemeSwitcher import and `ThemeWithMeta`; Input prop fallthrough and ShopHeader close button.

## [1.29.2]

### Fixed

- **UI App** — Correctly merge theme images.

## [1.29.1]

### Fixed

- **UI App** — Do not show the theme switcher when it is not enabled.

## [1.29.0]

### Added

- **UI Kit** — Theme switcher support.
- **UI App** — Theme switcher support.

## [1.28.1]

### Changed

- **UI** — Show filter-bar sorting only if sortings are available; made the BuyBoxStockInfo icon optional.

## [1.28.0]

### Changed

- **UI** — Fixed links in the basic header and the logo banner, made `SectionLogoPresentation` respect link fields, fixed pricing table width, and fixed mobile menu hierarchy in `SectionBasicHeader`.

### Fixed

- **UI App** — Links in the basic header.

## [1.27.0]

### Added

- **UI App** — New Iframe block.

### Fixed

- **UI Kit** — `HeroSlider` Media loading eagerness.
- **UI App** — HeroSlider media loading eagerness.

## [1.26.1]

### Changed

- **UI App** — `SectionBreadcrumbs` uses the `BreadcrumbItem` canonical type.

## [1.26.0]

### Added

- **UI** — Implemented the Breadcrumb section.
- **UI App** — Breadcrumb section.

## [1.25.0]

### Added

- **UI** — Added the Error 404, Pricing Plans, and Pricing Table sections.
- **UI App** — Error 404, Pricing Plans, and Pricing Table sections.

## [1.24.3]

### Fixed

- **UI** — Fixed a hydration error that broke the page when the Header component with submenus was used.
- **UI App** — Hydration error breaking the page when a Header component with submenus is used.

## [1.24.2]

### Fixed

- **UI App** — `FlexibleContentSliderSection` breaking when `actionButton` is missing.

## [1.24.1]

### Added

- **UI App** — `WellKnownSectionTag` and section tags.

## [1.24.0]

### Added

- **UI** — Added support for multiple CTAs in the basic header.
- **UI** — Added support for calling PDPs with variant option-values.
- **UI App** — Support for multiple CTAs in the basic header.
- **UI App** — Support for calling PDPs with variant option values.

## [1.23.0]

### Added

- **UI App** — Missing testimonial sections.

## [1.22.0]

### Added

- **UI App** — ProductShowcaseSlider section.

### Fixed

- **UI App** — Footer width and background.

## [1.21.3]

### Added

- **UI App** — Support for a variant query parameter in `ProductDetailContainer`.

## [1.21.1]

### Fixed

- **UI App** — Links with references are now case-insensitive to their `type`.

## [1.21.0]

### Added

- **UI App** — Autosuggest in the shop header on mobile.

## [1.20.0]

### Added

- **UI** — Implemented the SearchOverlay with actual data.
- **UI Kit** — `SearchOverlay` implemented with actual data.
- **UI App** — SearchOverlay wired to actual data.

## [1.19.0]

### Added

- **UI App** — `ConnectedCart` component for use in headers.

## [1.18.0]

### Added

- **UI App** — Correct `SectionBasicHeader` implementation.

## [1.17.7]

### Fixed

- **UI App** — `SectionIntegratedHeader` recursion bug.

## [1.17.0]

### Added

- **UI App** — Ability to select a root menu item in the Integrated Shop Header; the root menu places all of its children as navigation items.

## [1.16.0]

### Added

- **UI App** — Basic strawberry-field theme.

## [1.15.0]

### Added

- **UI App** — Integrated Shop Header section.

## [1.14.0]

### Added

- **UI App** — `SectionShopHeader` opens an empty cart; sold-out status shown in DetailAddToCart with LightboxModal connected to the product image gallery; detail variant switcher and add-to-cart toast.

## [1.13.0]

### Added

- **UI App** — Filter bar implementation and type adjustments.

### Fixed

- **UI App** — Removed duplicate product info from `BlockProductDetailDetails`.

## [1.12.0]

### Added

- **UI App** — Remote `QueryTemplates`.

## [1.11.0]

### Changed

- **UI App** — Studio refresh compatibility.

## [1.10.0]

### Changed

- **UI App** — Improved LCP loading strategy.

## [1.9.0]

### Fixed

- **UI App** — Missing links; added `robots.txt` and page SEO meta.

## [1.6.0]

### Fixed

- **UI App** — CSS layer order and swiper styles.

## [1.5.0]

### Added

- **UI App** — Adjusted definition default behaviour; added several sections and blocks.

## [0.20.0]

### Changed

- **UI** — Updated the cart-sheet implementation.

### Fixed

- **UI Kit** — Minor type fixes.

## [0.19.11]

### Fixed

- **UI Kit** — Worked around a nuxt/image Hygraph provider bug that returned broken image URLs.

## [0.19.7]

### Fixed

- **UI Kit** — Prevent a frontend crash when the `Media` component is not provided a `media` prop.

## [0.19.0]

### Added

- **UI Kit** — `RichContent` support for an `HtmlFragment` prop.

## [0.18.0]

### Added

- **UI Kit** — A basic `strawberry-field` theme.

## [0.17.5]

### Changed

- **UI** — Shopware implementation, minor UI fixes, and quality-of-life improvements.

## [0.17.4]

### Fixed

- **UI Kit** — Build issue.

## [0.17.0]

### Added

- **UI** — Added the Integrated Shop Header section.

## [0.16.0]

### Added

- **UI** — `SectionShopHeader` opens an empty cart.
- **UI** — Show `isSoldOut` status in DetailAddToCart and connect LightboxModal to ProductImageGallery.
- **UI Kit** — Detail variant switcher and add-to-cart toast.

### Fixed

- **UI** — Fixed a missing import in CartSheet, IconButton sizing, and variant preview sizes.

## [0.15.0]

### Added

- **UI** — Adjusted types and implemented the filter bar.
- **UI Kit** — Filter bar implementation and type adjustments.

## [0.14.3]

### Fixed

- **UI Kit** — `SectionShopHeaderNavigation` now respects menu data; fixed `RichContent` margins.

## [0.14.1]

### Changed

- **UI** — Studio refresh compatibility.

### Added

- **UI Kit** — Studio refresh compatibility.

## [0.14.0]

### Changed

- **UI** — Improved the LCP loading strategy.
- **UI Kit** — Improved LCP loading strategy.

## [0.13.0]

### Changed

- **UI** — Accessibility improvements for desktop navigation and slider navigation.
- **UI Kit** — Accessibility improvements for desktop navigation and slider navigation.

## [0.12.0] – [0.11.0]

### Added

- **UI** — Fixed missing links, added `robots.txt` and page SEO meta.

### Fixed

- **UI Kit** — Missing links; added `robots.txt` and page SEO meta.

## [0.10.4]

### Changed

- **UI Kit** — Default color-mode set to `light` instead of `system`, since most e-commerce frontends do not provide a dark mode and being greeted with dark mode could confuse users.

## [0.10.2]

### Fixed

- **UI** — Fixed Shopify product prices and made minor frontend adjustments.
- **UI Kit** — Shopify product prices and minor frontend adjustments.

## [0.10.0]

### Changed

- **UI** — Fixed CSS layer order and Swiper styles.

### Fixed

- **UI Kit** — CSS layer order and swiper styles.

## [0.9.0] – [0.8.0]

### Added

- **UI** — Added a few sections and blocks; changed definition default behaviour.
- **UI Kit** — Adjusted definition default behaviour; added several sections and blocks to ui-app.

## [0.7.1]

### Fixed

- **UI Kit** — Import paths.

## [0.6.0]

### Added

- **UI** — Added section definitions in preparation for the Shopify demo.
- **UI Kit** — Section definitions; preparation for the Shopify demo.

## [0.5.0]

### Changed

- **UI** — Migrated base components to UI Kit.

### Added

- **UI Kit** — Migrated base components into the UI Kit.

## [0.4.0]

### Added

- **UI** — Media Library upload handling and improved documentation generation from canonical types.

## [earlier versions]

Earlier `0.x` releases and the intervening patch releases not listed above contained only internal changes and cross-package dependency updates with no user-facing UI changes. For the Section and Block layer, initial development (1.1.0 – 1.4.0) covered the first section definitions, preparation for the Shopify demo, theme loading via ui-kit, and early ShopHeader login wiring.
</content>
</invoke>
