---
title: Animated Icon
changelogKeys:
  - AnimatedIcon
description: An icon that reflects a boolean active state. Flipping it on cross-fades the two artworks and throws three copies of the active one up and outwards.
playground:
  name: AnimatedIcon
  base: ui-kit-atoms-animatedicon
  defaultStory: default
  height: 460px
links: []
seo:
  title: Animated Icon
  description: An icon that reflects a boolean active state, cross-fading between two artworks and throwing a burst of the active one on the transition into active.
sitemap:
  loc: /laioutr-ui/ui-kit/general/animated-icon
  lastmod: 2026-08-13
  changefreq: monthly
  priority: 1.0
---

## Overview

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

`AnimatedIcon` renders an [`Icon`](/laioutr-ui/ui-kit/general/icon) that reflects a boolean. When `active` flips from `false` to `true` it plays a burst: the two artworks cross-fade — the outgoing one springs, the incoming one grows in from a quarter size — while three copies of the active artwork fly up and outwards and fade out.

It is the favourite/like gesture, and the reason it exists as a component is that the reward has to feel instant. The state itself is not the component's: `active` is a prop the parent owns, so the animation plays off whatever your own mutation reports.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const favourited = ref(false);
</script>

<template>
  <button @click="favourited = !favourited">
    <AnimatedIcon
      icon="essentials/heart-outline"
      activeIcon="essentials/heart-filled"
      :active="favourited"
    />
  </button>
</template>
```

`activeIcon` falls back to `icon` when unset, so an icon that only changes colour needs one artwork.

## Key Business & UX Benefits

- The reward lands on the tap, not on the server round-trip, so a favourite feels instant even on a slow connection.
- A single component covers the whole like/save/favourite gesture, so every rail in the product animates identically without per-surface CSS.
- Motion is sized in multiples of the icon, so the same component reads correctly at every `size` without a second set of keyframes.

## Sizing

The motion is expressed in multiples of the icon's own box rather than in pixels, so the burst scales with `size` and holds its proportions at every step:

::component-code
---
:name: AnimatedIcon Large
story-height: 200px
story-id: ui-kit-atoms-animatedicon--large
---
```vue-template
<AnimatedIcon icon="essentials/heart-outline" active-icon="essentials/heart-filled" size="l" />
```
::

`size` accepts `s`, `sm`, `m` (default), and `l`, matching `Icon`.

## Colour

The resting artwork takes the ambient icon colour it inherits, so an inactive icon matches whatever else sits in its rail. The active artwork and the copies it throws take `--animated-icon-active-color`, which defaults to that same ambient colour — set it to make the engaged state read differently:

```vue
<template>
  <AnimatedIcon
    style="--animated-icon-active-color: var(--red-9)"
    icon="essentials/heart-outline"
    activeIcon="essentials/heart-filled"
    :active="favourited"
  />
</template>
```

Set it on any ancestor to colour a whole rail at once. [`MediaFeedIconButton`](/laioutr-ui/publishers/media-feed) sets it to red, so a favourited heart reads as favourited while the rail's other icons stay on the button's own colour.

## Repeat taps

Each burst is an element of its own that removes itself when its animation ends, so rapid repeat taps overlap rather than cutting each other short. Only the newest burst stages the cross-fade, so the two artworks never stack half-finished copies of themselves.

## Accessibility

The burst and both cross-fading artworks are `aria-hidden`; only the resting icon is exposed, so a screen reader hears one icon rather than five. The component renders no button of its own — wrap it in your own control and put the accessible name there, as in the example above.

The root carries `data-state="active" | "inactive"` for styling and for querying in tests.

## Feature List

::features
---
items:
  - Reflects a parent-owned `active` boolean, so the animation plays off your
    own mutation rather than owning the state itself
  - Cross-fades between `icon` and `activeIcon` on the false to true transition;
    `activeIcon` falls back to `icon` when unset
  - Throws three copies of the active artwork up and outwards, each on its own
    trajectory, scale, and rotation curve
  - Motion sized in multiples of the icon box, so it holds at every `size`
    (`s`, `sm`, `m`, `l`)
  - Overlapping bursts stay separate, so rapid repeat taps each animate in full
  - "`--animated-icon-active-color` colours the active artwork and its burst
    while the resting artwork keeps the ambient icon colour"
  - "Exposes `data-state=\"active\" | \"inactive\"` for styling and test queries"
  - Burst and cross-fade artworks are `aria-hidden`, so assistive technology
    hears a single icon
---
::

## API Reference

::component-meta{:name="AnimatedIcon"}
::
