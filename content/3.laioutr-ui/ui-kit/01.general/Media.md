---
title: Media
aliases: []
changelogKeys:
  - MediaComponent
description: The dispatcher that renders a `Media` value. Images render through `nuxt-image`; video and audio render with built-in native players you can override.
links: []
playground:
  name: Media
  base: ui-kit-atoms-media
  defaultStory: default
  height: 460px
seo:
  title: Media
  description: The dispatcher that renders a Media value through nuxt-image (images) and built-in native players (video, audio) you can override with your own renderer.
sitemap:
  loc: /laioutr-ui/ui-kit/general/media
  lastmod: 2026-08-13
  changefreq: monthly
  priority: 1
  videos: []
  images: []
---

## Overview

`Media` takes a `Media` value and renders it. The value is a discriminated union, so a single `<Media :media>` call site can receive an image, a video, or an audio asset. `Media` looks at `media.type` and dispatches:

- **Images** render with the built-in renderer, backed by `nuxt-image`. It picks the right variant for the current viewport and handles `<picture>` source selection, custom `aspectRatio` (boolean, string, or number), and breakpoint-aware `sizes` strings. The bonus `cmw` (content-max-width) unit makes `sizes` strings inside constrained containers easier to write.
- **Video and audio** render with built-in native players (`<video>` / `<audio>`). Playback is set with props on `<Media>`. Register your own renderer to override the built-in for a type (for example a Vidstack wrapper for adaptive streaming). See [Rendering video and audio](#rendering-video-and-audio).

The image prop surface is unchanged from when `Media` was image-only, so every existing `<Media :media>` call site keeps working. A call site that passes an image renders exactly as before; the same call site now also plays a video or audio asset, with no per-call-site change.

Reach for `MediaPreview` when you also want lightbox interaction, surface-tone awareness, and cross-image navigation. Use `Media` directly only when you do not want the lightbox shell.

## Key Business & UX Benefits

- Backed by nuxt-image, so every storefront image ships in the right format and size for the device, cutting bandwidth costs and load times.
- A single discriminated `Media` value covers images, video, and audio, so connector and block code routes any asset through one component instead of hand-writing type branches.
- Video and audio play out of the box with native players, and a one-line registration swaps in your own player for streaming or custom UI without forking the component.
- The `cmw` unit makes `sizes` strings inside constrained containers easy to write, so the layout engine picks the smallest correct asset.

## Feature List

::features
---
items:
  - Backed by nuxt-image, so every storefront image ships in the right format
    and size for the current device
  - Single typed `Media` value (discriminated union) renders images, video, and
    audio through one component
  - Video and audio play out of the box with built-in native players; register
    your own renderer to override a type for streaming or custom UI
  - A `playback` mode (`interactive` default, or `background` for a muted
    autoplay loop) sets video/audio behavior per placement; the individual
    `controls` / `autoplay` / `muted` / `loop` / `playsinline` /
    `disablePictureInPicture` props map 1:1 to native HTML and override the mode
  - "`playback=\"background\"` runs a decorative video loop (autoplay suppressed
    under reduced motion); `v-model:paused` lets the consumer render and place
    its own WCAG-compliant pause control"
  - Videos wait until they are within a screen of the viewport before fetching,
    so a page carrying several no longer loads them all up front;
    `MediaAboveTheFoldProvider` opts a hero out and `videoPreload` overrides it
    per video
  - "`v-model:currentTime` seeks on write and reports playback progress back, so
    a scrubber or chapter link needs no template ref"
  - "`aspectRatio` accepts boolean, string, or number, so callers pick between
    intrinsic, square, and named ratios from the same prop"
  - Breakpoint-aware `sizes` strings hint the browser to pick the smallest
    correct variant, cutting bandwidth on mobile
  - Custom `cmw` (content-max-width) unit in `sizes` strings is honored inside
    constrained containers
  - Handles `<picture>` source selection so AVIF, WebP, and JPEG fallbacks are
    emitted correctly
---
::

## Sizing images with the `sizes` prop

Without a hint, the browser assumes an image fills the whole viewport and downloads the largest variant that could fit, even when the image occupies only part of the screen. The `sizes` prop tells the browser how wide the image actually renders at each breakpoint, so nuxt-image generates a matching `srcset` and the browser picks the smallest adequate file.

```vue
<template>
  <Media :media="product.cover" sizes="100vw sm:50vw md:400px" />
</template>
```

Read that as: the image is `100vw` wide by default, `50vw` from the `sm` breakpoint up, and a fixed `400px` from `md` up.

### The format

`sizes` is a space-separated list of `breakpoint:width` pairs built on the laioutr-ui theme breakpoints (`xs`, `s`, `sm`, `md`, `lg`, `xl`, `xxl`):

- A value with no breakpoint prefix is the base size, applied from the smallest viewport up.
- Each prefixed pair applies from its breakpoint upward and overrides the previous one (mobile-first).
- Widths accept any unit a CSS `sizes` attribute understands, such as `vw` and `px`.

`sizes="100vw md:50vw xl:600px"` is `100vw` below `md`, `50vw` from `md` to just under `xl`, and `600px` from `xl` up.

A single viewport-relative value is shorthand for that width on every breakpoint. `sizes="50vw"` becomes 50vw across all viewports.

### The `cmw` unit

`cmw` (content-max-width) expresses a width as a percentage of the theme's content max-width at that breakpoint instead of the full viewport. Reach for it when the image sits inside a width-constrained container, such as the main content column, rather than bleeding to the screen edge.

```vue
<template>
  <Media :media="article.hero" sizes="100vw md:50cmw" />
</template>
```

`50cmw` resolves to half of the content max-width configured for that breakpoint. `Media` looks up the breakpoint's content max-width in your theme and rewrites the `cmw` value to the equivalent `px` before handing the string to nuxt-image; with the default theme, `md:50cmw` becomes roughly `640px`.

### High-density screens

`Media` serves `1x`-density images by default. Set `retina` to also emit `2x` variants for high-DPI screens:

```vue
<template>
  <Media :media="product.cover" sizes="md:400px" retina />
</template>
```

### Providing a default `sizes` to a subtree

Instead of repeating `sizes` on every call site, wrap a subtree in `MediaSizesProvider` and set one default. Every `<Media>` rendered inside it inherits that value. The provider takes the sizes as a ref through its `value` prop:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MediaSizesProvider } from '#ui-kit/components/Media/MediaSizesProvider';

const sizes = ref('100vw md:50cmw');
</script>

<template>
  <MediaSizesProvider :value="sizes">
    <slot />
  </MediaSizesProvider>
</template>
```

A provided value overrides the `sizes` prop on the `<Media>` elements below it. So once `MediaSizesProvider` sets sizes, setting `sizes` on an individual descendant has no effect; change the provided value, or render that `<Media>` outside the provider.

## Rendering video and audio

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.3.0"}

`<Media>` plays video and audio out of the box with built-in native players: `type: 'video'` renders a native `<video>`, `type: 'audio'` a native `<audio>`. Pick a video in Studio and it plays, with no wiring. For adaptive streaming or a custom player UI, register your own renderer to override the built-in for that type.

### Playback

Playback behavior is set with props on `<Media>`. The `playback` prop picks the intent; six individual props map 1:1 to the native HTML attributes and override whatever the mode implies.

| `playback`              | What it renders                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `interactive` (default) | A native player: `controls` on, nothing automatic.                                                                                        |
| `background`            | A decorative muted autoplay loop: `autoplay`, `muted`, `loop`, `playsinline`, and `disablePictureInPicture` on, `controls` off. Video only. |

Each attribute also has its own prop. An explicitly set prop always wins; an unset prop takes the mode default, so you reach for these only to deviate from the mode:

| Prop                      | `interactive` | `background` | Effect                                                              |
| ------------------------- | ------------- | ------------ | ------------------------------------------------------------------ |
| `controls`                | `true`        | `false`      | Show the browser's native playback controls                        |
| `autoplay`                | `false`       | `true`       | Start playback automatically (the browser also requires `muted`)   |
| `muted`                   | `false`       | `true`       | Mute the media                                                      |
| `loop`                    | `false`       | `true`       | Restart when playback ends                                         |
| `playsinline`             | `false`       | `true`       | Play inline on iOS instead of going fullscreen (video only)        |
| `disablePictureInPicture` | `false`       | `true`       | Ask the browser to hide the Picture-in-Picture control (video only; a request, not a guarantee) |

These are deliberately not part of the `Media` value. A `Media` object describes the asset; whether a placement is a controllable player or a muted background loop is an editorial decision, so the calling component sets it. They apply to video (and to audio where meaningful); image media ignores them, and `background` is video-only. A controllable player needs no extra props:

```vue
<template>
  <Media :media="episode.audio" />
</template>
```

`autoplay` only takes effect when the media is also `muted`; browsers block sound-on autoplay. `background` mode turns both on for you.

### Background video

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.4.0"}

`playback="background"` turns a video into a decorative loop with one switch — `autoplay`, `muted`, `loop`, `playsinline`, and `disablePictureInPicture` on, `controls` off — instead of spelling out the whole cluster at every call site:

```vue
<template>
  <Media :media="hero.video" playback="background" />
</template>
```

Individual props still override the mode, so a background loop that plays once becomes `<Media :media="hero.video" playback="background" :loop="false" />` — the rest of the cluster stays on.

#### Reduced motion

A muted autoplay loop is decorative motion, so `<Media>` suppresses autoplay for visitors who set `prefers-reduced-motion: reduce`. The video does not start on its own; it settles on its `poster` frame, and the visitor can start it from the pause control you provide.

#### Pausing a background video

Auto-playing motion that runs longer than five seconds needs a pause mechanism ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). `<Media>` ships no pause button of its own — where it sits is a layout decision — so it exposes the paused state through `v-model:paused` and leaves the control to you. Bind a `ref` and render your own button:

```vue
<script setup lang="ts">
import { ref } from 'vue';

// The consumer owns the paused state; <Media> seeds it on mount and keeps it in sync.
const paused = ref<boolean>();
const toggle = () => {
  paused.value = !(paused.value ?? false);
};
</script>

<template>
  <div style="position: relative">
    <Media :media="hero.video" playback="background" v-model:paused="paused" />
    <IconButton
      style="position: absolute; inset-block-end: 1rem; inset-inline-end: 1rem"
      :icon="paused ? 'media/play' : 'media/pause'"
      :label="paused ? 'Play background video' : 'Pause background video'"
      @click="toggle"
    />
  </div>
</template>
```

`<Media>` seeds `paused` on mount from the reduced-motion-aware autoplay decision, so the button reflects reality on first paint — it shows "play" when autoplay was suppressed. It also reflects browser-initiated pauses (a data-saver mode, a backgrounded tab) back into the binding, so the icon and label stay truthful.

### Seeking and reading progress

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

`v-model:currentTime` is the sibling of `v-model:paused` and carries the playback position in seconds. Assigning to it seeks; the element reports its own progress back as it plays. A scrubber, a chapter link, or a rewind button needs no template ref and no `addEventListener`:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const currentTime = ref(0);
</script>

<template>
  <Media :media="episode.video" v-model:currentTime="currentTime" />
  <button @click="currentTime = 0">Rewind</button>
  <p>{{ Math.floor(currentTime) }}s</p>
</template>
```

Writes only seek when the value has genuinely moved away from the element, so binding a slider to the same ref that the element writes back to does not fight itself.

### Deferred loading

:since-version{changelog="ui" packages="@laioutr-core/ui-kit" version="2.12.0"}

A video does not fetch anything until the visitor scrolls near it. A page or feed carrying several videos loads only the ones in play, instead of pulling every file up front.

This needs more than the `preload` attribute alone: `autoplay` overrides `preload`, a `play()` call fetches regardless of both, and a server without range support answers `preload="metadata"` with the whole file. So `<Media>` holds back the attributes *and* the play call together until the element comes within one screen of the viewport — a screen of lead time, so the next item of a feed is warm before it lands.

The gate latches. Once a video has come into range its bytes are on the wire, and scrolling away does not restrict it again.

#### Above the fold

A hero video is on screen at first paint, and making it wait for an observer callback would cost it the start of its own playback. Wrap that subtree in `MediaAboveTheFoldProvider` — the same provider that already opts images out of lazy loading — and every `<Media>` inside it loads immediately:

```vue
<script setup lang="ts">
import { toRef } from 'vue';
import { MediaAboveTheFoldProvider } from '#ui-kit/components/Media/MediaAboveTheFoldProvider';

const isAboveTheFold = true;
</script>

<template>
  <MediaAboveTheFoldProvider :value="toRef(isAboveTheFold)">
    <Media :media="hero.video" playback="background" />
  </MediaAboveTheFoldProvider>
</template>
```

`value` is a ref, so a slider can flip it per slide: the first slide is above the fold and loads eagerly, the rest wait until they are scrolled to.

#### Overriding per video

`videoPreload` maps to the native `preload` attribute (`'none' | 'metadata' | 'auto'`) and takes precedence over the gate, for the rare video whose loading you want to spell out yourself:

```vue
<template>
  <Media :media="trailer" videoPreload="auto" />
</template>
```

It is named `videoPreload` rather than `preload` because `<Media>`'s own `preload` is the image boolean that emits a `<link rel="preload">` hint.

### What the built-in players handle

The built-in `<video>` shows the `poster` image before playback, resolved through nuxt-image so provider-bound posters (Shopify, Cloudinary) work as expected. The built-in `<audio>` has no native poster, so it renders the `cover` image above the player. Both emit a `<source>` per source and a `<track>` per entry in `media.tracks` for captions and chapters.

The native elements play progressive sources (a self-contained MP4, WebM, or MP3). They do not switch responsive sources per viewport or demux adaptive streaming (HLS, DASH); that needs a JavaScript player, which is what a custom renderer is for. See [Streaming formats](/frontend/api-reference/common-types/media#streaming-formats).

### Overriding with a custom renderer

Register a renderer for a media type to replace the built-in with a streaming player, a branded UI, or anything the native element cannot do. A registered renderer takes precedence over the built-in for its type. Register it from a Nuxt plugin at app root with `provideMediaRenderers`:

```ts [plugins/media-renderers.ts]
import { defineNuxtPlugin } from '#imports';
import { provideMediaRenderers } from '#ui-kit/components/Media/MediaRenderersProvider';
import VidstackMedia from '../components/VidstackMedia.vue';

export default defineNuxtPlugin((nuxtApp) => {
  provideMediaRenderers(nuxtApp.vueApp, {
    video: VidstackMedia,
  });
});
```

The map is keyed by media type; register only the types you want to override. Here just `video` is registered, so audio keeps the built-in native renderer.

### The renderer contract

A renderer receives the narrowed `media` object as its `media` prop, the playback props (`playback`, `controls`, `autoplay`, `muted`, `loop`, `playsinline`, `disablePictureInPicture`), and any fallthrough attributes (`class`, `style`, `data-*`) that the call site put on `<Media>`. A video renderer gets a `MediaVideo`; an audio renderer gets a `MediaAudio`. (`v-model:paused` is wired only to the built-in `<video>`; a custom renderer owns its own playback state.)

The playback props arrive unresolved: you get the `playback` mode plus whichever overrides were explicitly set, not the expanded attribute cluster. Map them onto your player yourself, or run them through the exported `resolvePlayback` helper (`#ui-kit/components/Media/resolvePlayback`) to get the same mode-default-plus-override precedence the built-in players use.

Declare the playback props you want to honor and map them onto your player. The `MediaVideoProps` / `MediaAudioProps` types from `#ui-kit/components/Media/types` bundle the playback props with a single-type `media` prop; a renderer that handles both types declares `MediaPlaybackProps` alongside its own `media` union (as in the example below). Any playback prop you do not declare falls through as an attribute onto your renderer's root element, so a player with its own UI should declare `controls` and decide what to do with it rather than let the native attribute land on the root.

Here is a video renderer that wraps [Vidstack](https://vidstack.io), typed with `MediaVideoProps`:

```vue [components/VidstackMedia.vue]
<script setup lang="ts">
import type { MediaVideoProps } from '#ui-kit/components/Media/types';

defineProps<MediaVideoProps>();
</script>

<template>
  <media-player
    :autoplay="autoplay"
    :muted="muted"
    :loop="loop"
    :playsinline="playsinline"
  >
    <media-provider>
      <source v-for="source in media.sources" :key="source.src" :src="source.src" />
    </media-provider>
    <media-video-layout />
  </media-player>
</template>
```

`controls` is left unforwarded on purpose: Vidstack draws its own UI. A renderer reads what it needs from `media.sources` (and `media.tracks`, `media.streaming`) and decides whether a source plays natively or needs a JavaScript player; see [Streaming formats](/frontend/api-reference/common-types/media#streaming-formats).

Sizing is not the renderer's job. Beyond `media` and the playback props, the renderer receives only fallthrough attributes; the outer box (height, aspect ratio) is set by the Block that wraps `<Media>`.

### Dispatch order

`<Media>` resolves what to render in this order:

| Asset                                        | What renders                  |
| -------------------------------------------- | ----------------------------- |
| `image`                                      | The built-in image renderer   |
| `video` / `audio` with a registered renderer | Your renderer                 |
| `video`                                      | The built-in native `<video>` |
| `audio`                                      | The built-in native `<audio>` |

A registered renderer always wins for its type; otherwise the built-in plays. There is no empty-render path: every asset resolves to a player or an image, so a page stays crawlable with no layout shift.

## API Reference

::component-meta{:name="Media"}
::
