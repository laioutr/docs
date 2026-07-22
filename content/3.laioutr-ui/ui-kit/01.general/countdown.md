---
title: Countdown
description: Live countdown to a deadline, rendering days, hours, minutes, and seconds with localized unit labels, powered by the useCountdown composable.
playground:
  name: Countdown
  base: ui-kit-atoms-countdown
  defaultStory: default
  height: 200px
seo:
  title: Countdown | Laioutr
  description: Live countdown to a deadline with localized unit labels, powered by the useCountdown composable.
sitemap:
  loc: /laioutr-ui/ui-kit/general/countdown
  lastmod: 2026-07-22
  changefreq: monthly
  priority: 1.0
---

## Overview

`Countdown` renders the time remaining until an `endDate` as a row of value-and-label pairs, ticking once a second. Pass a `Date` or an ISO string; everything else is optional.

The units shown adapt to how much time is left. Above 24 hours the row leads with days; below that it drops to hours, minutes, and seconds so the numbers stay meaningful as the deadline approaches. Once the deadline passes, the row is replaced by an expired message and the component emits `expired`.

Unit labels come from `Intl`, so they are localized and plural-aware without any translation work. The exact wording is owned by CLDR and is not customizable — `unitDisplay` picks how verbose it is.

## Key Business & UX Benefits

- Deadline pressure on flash sales, delivery cut-offs, and campaign endings, using the urgency cue shoppers already understand.
- Unit labels localize themselves through `Intl`, so a new market ships without a translation pass for "days" and "hours".
- One shared ticker drives every countdown on the page, so a listing full of deals costs one interval rather than one per item.
- Server-rendered and client-rendered output agree, so a countdown above the fold does not flicker or warn on hydration.

## Usage

::component-code{:name="LCountdown" story-id="ui-kit-atoms-countdown--default"}
::

```vue
<LCountdown :end-date="offerEndsAt" @expired="refreshOffer" />
```

### Label verbosity

`unitDisplay` controls how the units are spelled out. The exact strings are locale-dependent:

| Value | English output |
|---|---|
| `long` (default) | days · hours · minutes · seconds |
| `short` | days · hr · min · sec |
| `narrow` | d · h · m · s |

Use `narrow` where horizontal space is tight, such as inside a product tile.

### Icon

A clock icon (`essentials/clock`) renders ahead of the values. Pass a different `iconName` to swap it, or an empty string to drop it.

:::tip
Pro-Tip from Larry: handle `@expired` rather than leaving a finished countdown on screen. Refetching the offer is usually right — a deal that has ended should stop advertising itself.
:::

## useCountdown

`useCountdown` is the composable behind both `Countdown` and [`CountdownBoxed`](/laioutr-ui/ui-kit/general/countdown-boxed). Call it directly to drive your own countdown UI. It is auto-imported.

```ts
function useCountdown(options: {
  endDate: MaybeRefOrGetter<Date | string>;
  now?: MaybeRefOrGetter<Date | string | undefined>;
  onExpired?: () => void;
}): {
  remainingMs: ComputedRef<number>;
  isExpired: ComputedRef<boolean>;
  totalSeconds: ComputedRef<number>;
  showDays: ComputedRef<boolean>;
  timeParts: ComputedRef<{ days: number; hours: number; minutes: number; seconds: number }>;
}
```

- **`endDate`** — the instant to count toward. There is no start date.
- **`onExpired`** — fires at most once, and only on the client. It covers both the tick that crosses zero and the case where the deadline had already passed at mount.
- **`showDays`** — `true` when more than 24 hours remain. When it is `false`, `timeParts.days` is `0` and the hours roll up, so an hours-only display needs no arithmetic of its own.

```vue
<script setup lang="ts">
// useCountdown is auto-imported
const { timeParts, isExpired } = useCountdown({
  endDate: () => props.endsAt,
  onExpired: () => emit('ended'),
});
</script>
```

The composable owns its clock through the shared `useNow(1000)` ticker, so every countdown on a page shares one interval. That clock is SSR-stable: the first client frame matches the server's, so no hydration anchor is needed.

A malformed `endDate` is treated as already expired rather than rendering `NaN`.

### computeCountdown

For pure arithmetic with no clock and no lifecycle — unit tests, or deriving parts from a timestamp you already hold — `computeCountdown(endDate, now)` returns the same shape as a plain function.

## Freezing the clock

Both components and the composable accept a `now` prop, which pins the clock to a fixed instant so the display never ticks. It exists for tests and Storybook snapshots. Leave it unset in production, where the live clock is what you want.

## Feature List

::features
---
items:
  - "Counts down to an `endDate` (Date or ISO string) with a one-second tick"
  - "Drops the days unit automatically once under 24 hours remain"
  - "Localized, plural-aware unit labels from Intl — no translation work per market"
  - "`unitDisplay` selects long, short, or narrow labels for tight layouts"
  - "Emits `expired` once, client-side, and swaps the values for an expired message"
  - "`role=\"timer\"` with `aria-live=\"polite\"` so assistive technology announces updates"
  - "One shared ticker across all countdowns on the page; SSR-stable with no hydration mismatch"
---
::

## API Reference

### Countdown

::component-meta{:name="Countdown"}
::

## Related

- [Countdown Boxed](/laioutr-ui/ui-kit/general/countdown-boxed): the same clock rendered as painted digit tiles, for promotional surfaces.
- [Promotion Banner](/laioutr-ui/cms/promotion-banner): campaign banner that renders this component when a countdown end date is set.
- [PopUp Promotion](/laioutr-ui/cms/popups/pop-up-promotion): promotional popup that can show a countdown in place of a coupon.
