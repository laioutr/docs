<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Path to the image, e.g. `/assets/img/schema-fields/text.png`. */
    src: string;
    /** Accessible description of what the screenshot shows. */
    alt?: string;
    /** Optional caption rendered below the window. */
    caption?: string;
    /** Intrinsic image width in px. Set together with `height` to reserve space and prevent layout shift. */
    width?: number | string;
    /** Intrinsic image height in px. */
    height?: number | string;
    /**
     * Display size relative to the intrinsic dimensions. Captures are taken at
     * 2x DPI, so `0.5` renders them at their true (1x) on-screen size, `0.75` at 1.5x.
     * Requires `width` to take effect.
     */
    scale?: number | string;
    /** Content-area background: `muted` (default) frames light captures; `white` blends with white-background captures. */
    background?: 'muted' | 'white';
  }>(),
  {
    scale: 1,
    background: 'muted',
  },
);

// Render the image at `width * scale` while the width/height attributes keep the
// intrinsic aspect ratio, so space is reserved at the displayed size (no CLS).
const imgStyle = computed(() =>
  props.width != null ? { width: `${Number(props.width) * Number(props.scale)}px` } : undefined,
);
</script>

<template>
  <figure class="screenshot">
    <div class="screenshot__window">
      <div class="screenshot__bar" aria-hidden="true">
        <span class="screenshot__dot" />
        <span class="screenshot__dot" />
        <span class="screenshot__dot" />
      </div>
      <div class="screenshot__content" :class="`screenshot__content--${background}`">
        <img
          :src="src"
          :alt="alt"
          :width="width"
          :height="height"
          :style="imgStyle"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.screenshot {
  width: 100%;
  margin: 1.5rem 0;
}

.screenshot__window {
  border: 1px solid var(--ui-border, #e5e7eb);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--ui-bg, #ffffff);
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.04),
    0 4px 12px rgb(0 0 0 / 0.05);
}

.screenshot__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 2.25rem;
  padding-inline: 0.9rem;
  background: var(--ui-bg-muted, #f4f4f5);
  border-bottom: 1px solid var(--ui-border-muted, #ececec);
}

.screenshot__dot {
  flex: none;
  width: 11px;
  height: 11px;
  border-radius: 9999px;
  background: var(--ui-border-accented, #d4d4d8);
}

.screenshot__content {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.screenshot__content--muted {
  background: var(--ui-bg-muted, #fafafa);
}

.screenshot__content--white {
  background: #ffffff;
}

/* On a white background the capture sits flush, with no framing border. */
.screenshot__content--white img {
  border-color: transparent;
}

/* The image keeps its (scaled) size, only shrinking if it would overflow. */
.screenshot__content img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  border: 1px solid var(--ui-border-muted, #ececec);
  border-radius: 0.375rem;
}

.screenshot figcaption {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--ui-text-muted, #6b7280);
}
</style>

<style>
:root.dark .screenshot__window {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.3),
    0 4px 14px rgb(0 0 0 / 0.25);
}
</style>
