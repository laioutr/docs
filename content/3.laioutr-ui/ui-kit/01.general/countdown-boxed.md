---
title: Countdown Boxed
description: Promotional countdown rendering days, hours, and minutes as painted digit tiles, in four colour styles.
playground:
  name: CountdownBoxed
  base: ui-kit-atoms-countdownboxed
  defaultStory: default
  height: 240px
seo:
  title: Countdown Boxed | Laioutr
  description: Promotional countdown rendering days, hours, and minutes as painted digit tiles.
sitemap:
  loc: /laioutr-ui/ui-kit/general/countdown-boxed
  lastmod: 2026-07-22
  changefreq: monthly
  priority: 1.0
---

## Overview

`CountdownBoxed` is the promotional face of the countdown family. It counts down to an `endDate` and renders each unit as boxed digit tiles under a label, separated by colons — the treatment used on promotion banners and offer popups.

It shows **days, hours, and minutes only**. Seconds are deliberately absent: a ticking seconds digit pulls attention away from the offer on a promotional surface. Reach for [`Countdown`](/laioutr-ui/ui-kit/general/countdown) when you need the full breakdown down to the second.

Values are zero-padded to at least two digits, so the layout does not jump as numbers shrink. Unit labels come from `Intl` and are localized and plural-aware.

## Key Business & UX Benefits

- Turns a deadline into a visual centrepiece rather than a line of text, which is what a promotional banner needs to earn its space.
- Four painted styles match the countdown treatments in Figma, so campaign surfaces stay on-brand without bespoke CSS.
- Fixed-width zero-padded digits keep surrounding layout stable as the clock runs down.
- Shares its clock with every other countdown on the page, so a promo banner adds no extra timer cost.

## Usage

::component-code{:name="LCountdownBoxed" story-id="ui-kit-atoms-countdownboxed--default"}
::

```vue
<LCountdownBoxed :end-date="saleEndsAt" variant="bright" @expired="endSale" />
```

### Variants

`variant` selects the painted colour style.

| Variant | Use for |
|---|---|
| `default` | The standard treatment on a neutral surface. |
| `pale` | Muted styling where the countdown supports rather than leads. |
| `bright` | High-contrast styling for a campaign hero. |
| `solid` | Filled tiles for maximum emphasis on a busy background. |

::component-code{:name="LCountdownBoxed" story-id="ui-kit-atoms-countdownboxed--solid"}
::

## Behavior

The component emits `expired` when the deadline passes — once, on the client only. It does not hide itself, so decide what should happen: refetch the offer, swap in an "offer ended" message, or remove the banner.

Both the clock and the arithmetic come from [`useCountdown`](/laioutr-ui/ui-kit/general/countdown#usecountdown), so everything documented there applies: one shared ticker per page, SSR-stable rendering with no hydration mismatch, and a malformed `endDate` treated as already expired.

The `now` prop pins the clock to a fixed instant for tests and Storybook snapshots. Leave it unset in production.

:::tip
Pro-Tip from Larry: `CountdownBoxed` stops at minutes, so it reads as stale in the final hour of a sale. For a genuine last-hour push, switch to `Countdown` where the seconds keep moving.
:::

## When to Use

- Use `CountdownBoxed` on promotional surfaces — banners, offer popups, campaign heroes — where the deadline is part of the visual pitch.
- Use [`Countdown`](/laioutr-ui/ui-kit/general/countdown) in running copy, product tiles, or anywhere the remaining time is information rather than decoration.

## When NOT to Use

- Do not use it for deadlines inside the final hour, where a minutes-only display looks frozen. Use `Countdown` instead.
- Do not use it for elapsed time or progress. It only counts down to a fixed instant and has no start date.

## Feature List

::features
---
items:
  - "Counts down to an `endDate` (Date or ISO string); no start date"
  - "Renders days, hours, and minutes as individual digit tiles, zero-padded to two digits"
  - "Four painted styles: default, pale, bright, and solid"
  - "Localized, plural-aware unit labels from Intl"
  - "Emits `expired` once, client-side, when the deadline passes"
  - "`role=\"timer\"` with `aria-live=\"polite\"` so assistive technology announces updates"
  - "Shares the page-wide one-second ticker via `useCountdown`; SSR-stable"
---
::

## API Reference

### CountdownBoxed

::component-meta{:name="CountdownBoxed"}
::

## Related

- [Countdown](/laioutr-ui/ui-kit/general/countdown): the text-style countdown, including seconds, and the `useCountdown` composable.
- [PopUp Promotion](/laioutr-ui/cms/popups/pop-up-promotion): renders this component when `countdownEndDate` is set.
