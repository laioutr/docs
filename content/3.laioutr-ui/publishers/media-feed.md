---
title: Media Feed
changelogKeys:
  - MediaFeed
description: A full-screen vertical media feed in the TikTok and Reels pattern — scroll-snap, one item playing at a time, an action rail, a mute toggle, and a read-more sheet.
playground:
  name: MediaFeed
  base: growth-kit-publishers-media-features-mediafeed
  defaultStory: default
  height: 640px
links: []
seo:
  title: Media Feed
  description: A full-screen vertical media feed in the TikTok and Reels pattern, with scroll-snap, one item playing at a time, an action rail, a mute toggle, and a shareable URL.
sitemap:
  loc: /laioutr-ui/publishers/media-feed
  lastmod: 2026-08-13
  changefreq: monthly
  priority: 1.0
---

## Overview

:since-version{changelog="ui" packages="@laioutr-core/ui" version="2.12.0"}

`MediaFeed` is the full-screen vertical feed visitors know from TikTok and Reels. Items snap one to a viewport, the one in view plays and the rest do not, and each carries its own captions, badges, action rail, and call to action. A read-more sheet holds the long copy so the item itself stays a picture rather than a page.

It renders as a modal dialog over the whole viewport. Give it items and open it:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const reels = [
  {
    id: 'summer-collection',
    media: summerClip,
    title: 'Summer Collection',
    captions: ['@laioutr'],
    teaser: 'Linen, and rather a lot of it.',
    detail: '<p>The full story behind the collection…</p>',
  },
];
</script>

<template>
  <Button @click="isOpen = true">Open the feed</Button>
  <MediaFeed :items="reels" title="Reels" v-model:open="isOpen" />
</template>
```

## Key Business & UX Benefits

- Puts merchandising inside a format visitors already know how to use, so the interaction needs no explanation.
- Every item is individually shareable through the URL, so a single clip can carry traffic back into the storefront rather than into a feed's first item.
- Action rails and calls to action are slots, so likes, saves, and add-to-cart run through your own queries and mutations instead of a shape the component imposes.
- Only the item in view loads and plays, so a long feed does not spend the visitor's data on clips they never reach.

## Items

An item is the unit a ui-app wrapper maps one of your entities into:

| Field | Purpose |
| --- | --- |
| `id` | Stable identity, and the value the feed puts in the URL |
| `media` | The [`Media`](/frontend/api-reference/common-types/media) value — a video or an image |
| `title` | Headline over the media |
| `captions` | Small lines above the title, such as a handle or a date |
| `badges` | Rendered as [`glass-black` badges](/laioutr-ui/ui-kit/indicators/badge), legible over arbitrary media |
| `features` | Rendered as `plain` badges |
| `teaser` | Short copy, truncated with a "more" affordance that opens the sheet |
| `detail` | The full body the sheet reveals — a string or an `HtmlFragment` |

Images and videos mix freely in one feed. An image has nothing to pause, so it carries no playback affordance; a video carries one over the whole backdrop.

## Two ways to drive it

### From props

Pass `items` and bind `v-model:open`. The feed owns nothing globally, which suits a page that already has the items in hand.

### From the store

Leave `items` off and drive it from anywhere on the page with `useMediaFeedStore()`. This is the mode for a tile in a slider or a card in a grid opening a feed that lives elsewhere in the tree:

```ts
const { openFeed, setItems } = useMediaFeedStore();

// Seed on mount, so a shared link resolves before anyone has opened the feed.
setItems(reels);

// A tile opens at a position or at an item id.
openFeed(reels, 'summer-collection');
```

The store exposes `items`, `isOpen`, and `activeIndex` as refs, plus `setItems`, `openFeed`, and `closeFeed`. Items outlive a close on purpose — the URL parameter still has to resolve against them afterwards.

Supplying `items` switches the feed to props mode entirely; it then ignores the store rather than merging with it.

## Sound

Browsers only permit autoplay while the media is muted, so the feed starts silent. The top bar carries a mute toggle back to sound, bound to `v-model:muted`, and it is left out when no item in the set is a video — a control that cannot do anything is worse than no control.

```vue
<template>
  <MediaFeed :items="reels" v-model:open="isOpen" v-model:muted="muted" />
</template>
```

Replace the control through the `top-bar-end` slot if it belongs somewhere else in your chrome.

## Sharing and the back button

Set `urlParam` and the item in view syncs to a query parameter:

```vue
<template>
  <MediaFeed :items="reels" url-param="reel" v-model:open="isOpen" />
</template>
```

The feed then puts `?reel=<id>` in the address bar. Opening pushes one history entry and moving between items replaces it, so the back button closes the feed rather than walking the visitor back through every item they scrolled past — and rather than leaving the page altogether.

The parameter carries the item id, not its position, so a shared link survives the feed being reordered. A parameter whose id the current set cannot resolve is left in the address bar untouched and retried as the set changes, so items that arrive after the page does still open at the right one.

This is [`useOverlayHistory`](#useoverlayhistory) underneath, and it is available for your own overlays.

## Slots

| Slot | Scope | For |
| --- | --- | --- |
| `actions` | `item`, `index`, `active` | The rail down the right of each item |
| `cta` | `item`, `index`, `active` | The call to action under the item's copy |
| `sheet` | `item` | Replaces the rendered `detail` in the read-more sheet |
| `top-bar-start` | — | Replaces the close button |
| `top-bar-end` | — | Replaces the mute toggle |

The rail and the call to action are slots rather than item fields because favourite state, counts, and cart behaviour come from your own queries and mutations. `active` tells you whether the item is the one in view, which is what a pulsing call to action should key off:

```vue
<template>
  <MediaFeed :items="reels" v-model:open="isOpen">
    <template #actions="{ item }">
      <MediaFeedIconButton
        label="Like"
        icon="essentials/heart-outline"
        :caption="likeCounts[item.id]"
        :active="!!liked[item.id]"
        @click="toggleLike(item.id)"
      >
        <template #icon>
          <AnimatedIcon
            icon="essentials/heart-outline"
            active-icon="essentials/heart-filled"
            :active="!!liked[item.id]"
          />
        </template>
      </MediaFeedIconButton>
    </template>

    <template #cta="{ active }">
      <AnimatedButton :paused="!active">Shop the look</AnimatedButton>
    </template>
  </MediaFeed>
</template>
```

A numeric `caption` on [`MediaFeedIconButton`](#the-compound-parts) formats compactly for the locale, so a like count arrives as `1.2K` in English without the call site formatting it.

## Navigation

The feed is a scroller, so the visitor's own scroll, swipe, or trackpad gesture is the primary way through it — snapping is the browser's. On top of that:

- Arrow up and arrow down move one item.
- Desktop gets previous and next buttons plus a pagination indicator. Turn the indicator off with `:show-pagination="false"`, and swap the arrows with `prevIcon` and `nextIcon`.

All three inputs resolve through the same snap, so the item in view is decided in one place rather than three.

## Accessibility

Only the item in view is interactive. Every other item is `inert`, so tab never reaches a control that is off screen, and assistive technology is not offered five items' worth of buttons at once. Each item carries `data-state="active" | "inactive"` for styling and for querying in tests.

The feed is a modal dialog with a visually hidden title, falling back to a localized label when no `title` is set. Video items expose the whole backdrop as the play/pause control, with the glass button over it marked `aria-hidden` so the same action is not two tab stops.

## The compound parts

The pieces are exported so a bespoke feed can compose them directly rather than replacing the whole component:

| Component | Role |
| --- | --- |
| `MediaFeedItem` | One full-viewport item: media, gradient, playback affordance, information, rail |
| `MediaFeedItemInformation` | The captions, title, badges, features, and teaser stack |
| `MediaFeedIconButton` | A rail button — icon, optional caption, `aria-pressed` |
| `MediaFeedTopBar` | The floating bar with start, centre, and end regions |
| `MediaFeedDesktopNavigation` | Previous/next arrows and the pagination indicator |
| `MediaFeedDisclosureTeaser` | Truncated teaser copy with the "more" affordance |
| `MediaFeedOffCanvasSheet` | The read-more sheet |

## useOverlayHistory

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

`useOverlayHistory` is the composable behind the URL sync. `MediaFeed` uses it internally, but it is a UI Kit composable and works for any overlay that has an open state and a current item — a lightbox, a cart drawer, a product quick-view.

```ts
function useOverlayHistory(options: {
  param: MaybeRefOrGetter<string | undefined>;
  open: Ref<boolean>;
  value: Ref<string | undefined>;
  paused?: Ref<boolean>;
  throttleMs?: number;
}): void;
```

- **`param`** — the query parameter to own, such as `reel`. Inert while `undefined`, because a composable cannot be called conditionally — this is how an opt-in feature stays opt-in.
- **`open`** — the overlay's open state. Writable: a back navigation closes the overlay through it.
- **`value`** — the stable id of the item in view. Writable: a deep link and a back/forward drive it from the URL.
- **`paused`** — suspends writes while a drag or transition is in flight, so a scroll does not write an entry per item it passes.
- **`throttleMs`** — throttle for item changes, defaulting to 150ms. Opening is never throttled.

Opening pushes one history entry; each item change replaces it. So back closes the overlay rather than stepping through its history. A value the consumer cannot resolve reads as "closed" and is left in the address bar untouched, so an item set that loads late still opens at the right item.

One overlay at a time may own a given parameter — a second on the same parameter would pop the first one's entry on close and send the visitor a page back instead of up a level. Overlays on different parameters run independently.

## Feature List

::features
---
items:
  - Full-screen vertical feed with scroll-snap, one item to a viewport, in the
    TikTok and Reels pattern
  - Only the item in view plays; the rest are paused and rewound, so a clip
    scrolled back to starts from the beginning
  - "Drive it from props (`items` plus `v-model:open`) or from anywhere on the
    page with `useMediaFeedStore()`"
  - Videos and images mix in one feed; video items carry a play/pause affordance
    over the whole backdrop, image items carry none
  - Starts muted because browsers require it, with a mute toggle in the top bar
    that is omitted when no item is a video
  - "`urlParam` syncs the item in view to a query parameter by id, so a link is
    shareable and the back button closes the feed"
  - "Action rail and call to action are scoped slots carrying `item`, `index`,
    and `active`, so favourites and counts come from your own queries"
  - "Off-screen items are `inert` and every item exposes
    `data-state=\"active\" | \"inactive\"`"
  - Read-more sheet holds the long copy, rendered once at feed level from the
    active item rather than once per item
  - Keyboard arrows, desktop previous/next buttons, and a pagination indicator,
    all resolving through the same snap
  - Compound parts exported for bespoke composition
---
::

## API Reference

### MediaFeed

::component-meta{:name="MediaFeed"}
::

### MediaFeedItem

::component-meta{:name="MediaFeedItem"}
::

### MediaFeedIconButton

::component-meta{:name="MediaFeedIconButton"}
::

### MediaFeedItemInformation

::component-meta{:name="MediaFeedItemInformation"}
::
