---
title: How to write CSS
aliases: []
description: A short checklist for writing component CSS in a Laioutr app. Restyleable from the outside, responsive without JavaScript, predictable in SSR.
seo:
  title: How to write CSS | Laioutr
  description: Conventions for writing component CSS in a Laioutr app.
sitemap:
  loc: /apps/app-development/guides/writing-css
  lastmod: 2026-05-19
  changefreq: monthly
  priority: 0.8
  videos: []
  images: []
---

These are the CSS conventions to follow when you ship Vue components in a Laioutr app. They aren't framework requirements; following them keeps your components consistent with the UI Kit (restyleable from outside, predictable under SSR) so customers can apply the same overrides to your components as to ours.

```vue [components/ProductCard.vue]
<script setup lang="ts">
defineProps<{ title: string; onDark?: boolean; loading?: boolean }>();
</script>

<template>
  <article
    class="product-card"
    :class="{ 'product-card--on-dark': onDark }"
    :data-loading="loading || undefined"
  >
    <h3 class="product-card__title">{{ title }}</h3>
  </article>
</template>

<style>
@layer lui-components {
  .product-card { /* ... */ }
  .product-card__title { /* ... */ }
  .product-card--on-dark { /* ... */ }
  .product-card[data-loading] { opacity: 0.5; }
  @media (--md) {
    .product-card { /* desktop layout */ }
  }
}
</style>
```

That example uses every rule below.

## Rules

1. **Root class matches the file name.** Every component emits one owned class on its root, in kebab-case. `ProductCard.vue` emits `.product-card`. It is the customer's only stable anchor.
2. **BEM inside the component.** `.<block>__<element>--<modifier>`. The block matches the root class. Modifiers (`--on-dark`, `--horizontal`) are for render-time variants only.
3. `@layer lui-components` **around every** `<style>` **block.** See [CSS Layers](/laioutr-ui/getting-started/css-layers) for what the layer does. Without it, your components are harder to restyle than the built-in ones.
4. **No**&#x20;`<style scoped>`**.** Scoped styles inject `data-v-xxx` hashes that leak into the customer's selector landscape. The BEM block name on the root is the isolation you need.
5. **Data-attributes for runtime state.** `:data-loading="loading || undefined"` and `[data-loading]` selectors. Reserve modifier classes for render-time variants. Set the attribute to `undefined` (not `false`) so it is absent when the state is off.
6. `@media (--sm | --md | --lg | --xl)` **for responsive layouts.** Not `useBreakpoints()` or `useIsMobile()`. The custom media queries resolve at paint time with the real viewport. JS branches cause hydration mismatches and defeat shared HTML caching at the CDN.
7. **No wrapper styles targeting a child component's internals.** If `SectionNewsletterPopup` needs `EmailInputForm` to look different, add a `variant` prop on the child. Don't write `.popup .email-input-form__field { ... }`.

## When the rules give

Rule 6 has one exception: DOM that only mounts after a user interaction (dropdown content, dialog content, anything behind `v-if="isOpen"`). There is no SSR render to mismatch against, so `useIsMobile()` inside that subtree is fine. Self-check: if the element is in the initial SSR HTML, use CSS; if not, either works.

Rule 7 has one exception: parent-layout rules on the parent's own wrapper (`display: flex; gap: 1rem` on a wrapper div around buttons) are fine because they do not target child class names. The line is **parent rules on the parent's own wrapper, yes; reaching into the child's internals, no**.

## Related

- [CSS Layers](/laioutr-ui/getting-started/css-layers) for the `lui-components` layer and how customer CSS overrides it.
- [Z-Ordering](/laioutr-ui/getting-started/z-ordering) for the z-index token scale used inside `@layer lui-components`.
- [Surface Tone](/laioutr-ui/getting-started/surface-tone) for how light/dark/bright surfaces cascade through component CSS.
