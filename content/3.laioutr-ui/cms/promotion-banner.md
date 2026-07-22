---
title: Promotion Banner
description: Campaign banner combining a heading, countdown, copyable discount code, and call-to-action, in four painted styles plus a freeform custom palette.
playground:
  name: PromotionBanner
  base: ui-sections-promotionbanner
  defaultStory: default
  height: 320px
seo:
  title: Promotion Banner | Laioutr
  description: Campaign banner with countdown, copyable discount code, and call-to-action.
sitemap:
  loc: /laioutr-ui/cms/promotion-banner
  lastmod: 2026-07-22
  changefreq: monthly
  priority: 1.0
---

## Overview

`PromotionBanner` is the campaign band that runs across a page to announce an offer. It composes up to four parts, each optional: a heading and subline with an icon, a live countdown, a copyable discount code, and a call-to-action button.

Every part is independent, so the same component covers a bare "Free shipping this week" strip and a full flash-sale banner with a ticking deadline and a code to redeem. Parts that receive no props simply do not render.

## Key Business & UX Benefits

- One banner covers the whole campaign lifecycle — announcement, deadline pressure, code delivery, and click-through — instead of three bespoke components.
- The code copies to the clipboard in one tap with a confirmation toast, closing the gap where shoppers lose a code between the banner and checkout.
- Four painted styles keep seasonal campaigns on-brand, while the custom palette gives marketing an escape hatch for partner or co-branded promotions.
- Alignment is configurable per breakpoint, so a banner that centres on mobile can run left-aligned on desktop without a second component.

## Usage

::component-code{:name="LPromotionBanner" story-id="ui-sections-promotionbanner--default"}
::

```vue
<LPromotionBanner
  heading="Spring sale"
  subline="Save on selected items this week only."
  icon="emoji/party-popper"
  show-countdown
  :countdown-end-date="saleEndsAt"
  :code-button="{ code: 'SPRING20' }"
  :cta="{ text: 'Shop now', link: '/sale' }"
/>
```

### The countdown

The countdown needs **both** `showCountdown` and a `countdownEndDate` — setting only one renders nothing. It uses [`Countdown`](/laioutr-ui/ui-kit/general/countdown), so it ticks once a second and shows days once more than 24 hours remain. `countdownIcon` swaps the clock glyph.

### The code button

Pass `codeButton` with a `code` to render a copy button. Clicking it writes the code to the clipboard and raises a confirmation toast — there is nothing to wire up and no event to handle. An optional `iconName` overrides the button's icon.

::component-code{:name="LPromotionBanner" story-id="ui-sections-promotionbanner--code-only"}
::

### Layout

| Prop | Values | Effect |
|---|---|---|
| `fill` | `full-width`, `boxed` | Whether the banner spans the viewport or sits inside the content container. |
| `mobileAlignment` | `left`, `center` | Content alignment below the breakpoint. |
| `desktopAlignment` | `left`, `center` | Content alignment above it. |

The banner reflows across breakpoints on its own: a compact stack on small screens, a centred stack in the middle band, and a single row on desktop.

## Styling

`variant` selects the painted style — `default`, `pale`, `bright`, or `solid` — matching the campaign treatments in Figma.

::component-code{:name="LPromotionBanner" story-id="ui-sections-promotionbanner--solid"}
::

For a promotion that has to match an external brand, set `variant: 'custom'` and supply `customColors`:

| Key | Applies to |
|---|---|
| `background` | The banner background. |
| `text` | Heading and subline. Not the countdown. |
| `countdownBackground` | The countdown pill background. |
| `countdownText` | Countdown digits and labels. |
| `countdownIcon` | The countdown clock icon only. |
| `iconColor` | The heading-row icon and the copy-code button icon. |

The split between `text` and `countdownText` is deliberate: the countdown sits on its own pill, so it usually needs a different colour from the copy around it.

:::warning
`iconColor` tints icons that draw with `currentColor`, such as `essentials/clock`. Emoji icons like `emoji/party-popper` render their own colours and ignore it — pick a line icon when the colour has to match the palette.
:::

## When to Use

- Use `PromotionBanner` for a site-wide or page-wide campaign announcement: a sale, a shipping offer, a launch.
- Use it when the offer has a deadline, a code, or both, and you want them in one place.

## When NOT to Use

- Do not use it for editorial or product storytelling — reach for [Banner Basic](/laioutr-ui/cms/banner/banner-basic) or [Media Text](/laioutr-ui/cms/banner/media-text) instead.
- Do not use it for a modal offer on entry. [PopUp Promotion](/laioutr-ui/cms/popups/pop-up-promotion) is the popup form of the same idea.
- Do not use it as a persistent notice bar. It is a campaign surface, not a status message.

## Feature List

::features
---
items:
  - "Four independent parts — heading with icon, countdown, copyable code, CTA — each rendering only when its props are set"
  - "Live countdown via the shared Countdown component, requiring both showCountdown and countdownEndDate"
  - "One-tap clipboard copy of the discount code with a confirmation toast, no wiring required"
  - "Four painted styles (default, pale, bright, solid) plus a custom palette for co-branded campaigns"
  - "Per-breakpoint content alignment and a full-width or boxed fill"
  - "Six-key customColors palette separating banner copy from countdown pill and icons"
---
::

## API Reference

### PromotionBanner

::component-meta{:name="PromotionBanner"}
::

## Related

- [Countdown](/laioutr-ui/ui-kit/general/countdown): the countdown rendered inside the banner.
- [PopUp Promotion](/laioutr-ui/cms/popups/pop-up-promotion): the same offer pattern as a modal.
- [USP Banner](/laioutr-ui/cms/banner/usp-banner): non-promotional strip for shipping and returns messaging.
