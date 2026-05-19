---
title: PopUp Promotion
description: Promotional popup content preset with heading, body, embedded CouponBox, and a primary CTA. Slots into PopUp.
seo:
  title: PopUp Promotion | Laioutr
  description: Promotional popup content preset with embedded coupon.
sitemap:
  loc: /laioutr-ui/cms/popups/pop-up-promotion
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`PopUpPromotion` is the promotional popup content preset. It composes a `TextGroup` (optional icon, caption, heading, body), an optional `countdown` slot, an embedded `CouponBox` for code copy or apply, a primary call-to-action, and a fine-print hint. It owns no dialog chrome of its own. Drop it into [`PopUp`](/laioutr-ui/cms/popups/pop-up)'s default slot for launch offers, seasonal promos, and welcome discounts.

## Key Business & UX Benefits

- Turns paid traffic into first orders with a focused offer surface, the standard pattern behind welcome-discount conversion lifts.
- The embedded `CouponBox` handles code copy in one tap, cutting the friction that loses redemptions between popup and checkout.
- Seasonal promos ship from Studio, so growth teams launch Black Friday, Easter, or flash sales without waiting on engineering deploys.
- Inherits `PopUp` shell semantics for focus and keyboard handling, keeping the offer popup accessible by default.

## Usage

::component-code
---
:name: LPopUpPromotion
:story-height: 600px
story-id: ui-blocks-popuppromotion--default
title: PopUpPromotion Default
---
```vue-template
<LPopUp v-model:open="showPromo" :media="image">
    <LPopUpPromotion
      heading="20% off your first order"
      body="Your welcome discount is waiting."
      :coupon="{
        text: 'Use code at checkout',
        code: 'WELCOME20',
        action: 'copy',
      }"
      cta-text="Shop now"
      cta-href="/shop"
      hint="One-time use. Excludes sale items."
      @apply-coupon="onCouponApplied"
    >
      <template #countdown>
        <CountdownBanner :ends-at="endsAt" />
      </template>
    </LPopUpPromotion>
  </LPopUp>
```
::

## Feature List

::features
---
items:
  - "Composes a TextGroup, optional countdown slot, embedded CouponBox, primary CTA, and fine-print hint"
  - "CouponBox supports 'copy' or 'apply' actions, cutting friction between popup and checkout redemption"
  - "Countdown slot accepts any countdown component, sharpening urgency on launch offers and flash sales"
  - "Inherits PopUp shell semantics for focus traps, keyboard support, and ARIA roles"
  - "Editors ship Black Friday, Easter, and welcome promos from Studio without engineering deploys"
  - "apply-coupon event hands cart logic back to the parent so coupons land in the customer's session"
---
::

## API Reference

::component-meta{:name="PopUpPromotion"}
::
