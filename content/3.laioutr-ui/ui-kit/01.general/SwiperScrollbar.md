---
title: SwiperScrollbar
description: Adapter that wires a Scrollbar to a Swiper carousel — derives thumb size and position from Swiper state and drives the slider on interaction.
playground:
  name: SwiperScrollbar
  base: ui-kit-molecules-swiperscrollbar
  defaultStory: horizontal
  height: 400px
jiraIssueId: LUI-39
seo:
  title: SwiperScrollbar | Laioutr
  description: Adapter that wires a Scrollbar to a Swiper carousel — derives thumb size and position from Swiper state and drives the slider on interaction.
sitemap:
  loc: /laioutr-ui/ui-kit/general/swiperscrollbar
  lastmod: 2026-05-26
  changefreq: monthly
  priority: 1.0

---

## Overview

SwiperScrollbar connects a [Scrollbar](/laioutr-ui/ui-kit/general/scrollbar) to a Swiper carousel. Placed inside a Swiper, it reads the live Swiper state (`progress` and content size) to size and position the thumb, and translates user interaction back into the slider: dragging scrolls the slides continuously and 1:1 with the cursor, while clicking the track animates to the nearest slide. It carries no sizing or interaction math of its own — that lives in Scrollbar — so this component is a thin adapter you drop into the carousel.

It works with `slidesPerView: 'auto'`, uneven slide widths, and any `spaceBetween`, because it measures the true rendered content size rather than counting slides. When the content fits within the viewport, the scrollbar hides itself without shifting layout.

## Key Business & UX Benefits

- Gives touch and desktop shoppers a scroll indicator and drag-to-scroll on product carousels without per-carousel wiring.
- Click-to-snap lands on a real slide boundary, matching the rest of Swiper's navigation behavior.
- Auto-hides when a carousel has too few slides to scroll, so rows with little content stay clean.

:::tip
Pro-Tip from Larry: drop it into Swiper's `#container-end` slot so it renders beneath the slides and inherits the carousel context automatically.
:::

## Usage

### Horizontal

::component-code
---
:name: LSwiperScrollbar
:story-height: 320px
story-id: ui-kit-molecules-swiperscrollbar--horizontal
title: SwiperScrollbar Horizontal
---
```vue-template
<Swiper :slides-per-view="'auto'" :space-between="16">
  <SwiperSlide v-for="n in 10" :key="n">…</SwiperSlide>
  <template #container-end>
    <LSwiperScrollbar orientation="horizontal" />
  </template>
</Swiper>
```
::

### Vertical

::component-code
---
:name: LSwiperScrollbar
:story-height: 360px
story-id: ui-kit-molecules-swiperscrollbar--vertical
title: SwiperScrollbar Vertical
---
```vue-template
<Swiper direction="vertical" :slides-per-view="'auto'" :space-between="16">
  <SwiperSlide v-for="n in 10" :key="n">…</SwiperSlide>
  <template #container-end>
    <LSwiperScrollbar orientation="vertical" />
  </template>
</Swiper>
```
::

### Auto-hidden when content fits

::component-code
---
:name: LSwiperScrollbar
:story-height: 320px
story-id: ui-kit-molecules-swiperscrollbar--scrollbar-hidden
title: SwiperScrollbar Hidden
---
```vue-template
<Swiper :slides-per-view="'auto'" :space-between="16">
  <SwiperSlide>Single slide — fits viewport</SwiperSlide>
  <template #container-end>
    <LSwiperScrollbar orientation="horizontal" />
  </template>
</Swiper>
```
::

With a single slide that fits the viewport, there is nothing to scroll, so the scrollbar renders nothing.

## When to Use

- Use SwiperScrollbar whenever the scroll source is a Swiper carousel and you want a scroll indicator, drag-to-scroll, or click-to-snap.

## When NOT to Use

- Don't use it outside a Swiper — it reads Swiper context and has nothing to bind to otherwise. For non-Swiper scroll sources, drive a [Scrollbar](/laioutr-ui/ui-kit/general/scrollbar) directly.

## API Reference

::component-meta{:name="SwiperScrollbar"}
::
