---
title: Animated Button
changelogKeys:
  - AnimatedButton
description: A Button with a continuous pulse, for the one call to action on a screen that has to be found without being read.
playground:
  name: AnimatedButton
  base: ui-kit-atoms-animatedbutton
  defaultStory: default
  height: 460px
links: []
seo:
  title: Animated Button
  description: A Button with a continuous pulse that pauses on hover and under reduced motion, for a single high-priority call to action.
sitemap:
  loc: /laioutr-ui/ui-kit/form/animated-button
  lastmod: 2026-08-13
  changefreq: monthly
  priority: 1.0
---

## Overview

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

`AnimatedButton` is a [`Button`](/laioutr-ui/ui-kit/form/button) that pulses — scaling and glowing on a two-second loop — so it is found on a busy or media-heavy screen without the visitor having to read the screen first. It takes every `Button` prop and passes it straight through, so it is a drop-in wherever a button already works:

::component-code
---
:name: LAnimatedButton
story-height: 200px
story-id: ui-kit-atoms-animatedbutton--default
---
```vue-template
<LAnimatedButton>Shop the look</LAnimatedButton>
```
::

It defaults to the `secondary-white` variant, the one designed to sit over media.

Motion that never stops is a strong signal, and it competes with every other thing on the screen for the same attention. One per screen is the intent.

## Key Business & UX Benefits

- Draws the eye to a single high-priority action on media-heavy screens, where a static button competes with the imagery behind it.
- Drop-in for `Button`, so an existing call to action gains the treatment without a markup change.
- Pauses itself on hover and under reduced motion, so the pulse never fights a visitor who has already found the button or asked for less movement.

## When it pauses

The pulse stops on its own in the cases where it would work against the visitor:

| Condition | Why |
| --- | --- |
| Pointer over the button | The visitor has found it; continuing to animate makes it harder to hit |
| `prefers-reduced-motion: reduce` | Continuous motion is exactly what that setting asks to suppress |
| `paused` prop | Your own reason — a pending submit, a disabled form, an off-screen section |

`paused` is additive to the other two, so setting it `false` does not override a reduced-motion preference.

```vue
<template>
  <AnimatedButton :paused="isSubmitting">Reserve a seat</AnimatedButton>
</template>
```

## Tuning the pulse

The timing, the three scale steps, and the three glow steps are custom properties on the root, so a theme can retune the pulse without redefining the keyframes:

```css
.my-cta {
  --animated-button-duration: 3s;
  --animated-button-keyframe-2-scale: 1.1;
  --animated-button-keyframe-2-glow: 0 0 24px rgb(0 0 0 / 0.3);
}
```

## Feature List

::features
---
items:
  - Continuous scale-and-glow pulse on a two-second loop, for the one call to
    action on a screen that has to be found before it is read
  - Accepts every `Button` prop and forwards it, so it is a drop-in replacement
  - Defaults to the `secondary-white` variant, designed to sit over media
  - Pauses on hover, under `prefers-reduced-motion`, and via the `paused` prop
  - Duration, timing, and the three scale and glow steps are custom properties,
    so a theme retunes the pulse without redefining keyframes
---
::

## API Reference

::component-meta{:name="AnimatedButton"}
::
