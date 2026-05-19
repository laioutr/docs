---
title: CSS Layers
description: The Laioutr UI Kit wraps its CSS in a project layer (lui-components) so customer styles outside any layer always win. No !important needed, no specificity duels.
sitemap:
  loc: /laioutr-ui/getting-started/css-layers
---

A customer installs your app, opens devtools on a `ProductCard`, copies its class name, and writes `.product-card { background: var(--brand-pale); }` in their project stylesheet. Should that override the component's built-in background? Yes, every time, regardless of how specific the component's internal selector is. The mechanism that makes this work is [CSS cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer). The Laioutr UI Kit wraps every internal style in a named layer (`lui-components`) so unlayered customer CSS always wins by default.

## The layer cascade

CSS cascade layers control specificity at a level above selectors. Laioutr declares this order, lowest to highest specificity:

```css
@layer lui-tokens, lui-reset, lui-externals, lui-global, lui-overridable, lui-components;
```

::css-layer-cascade
::

A rule outside any layer beats any rule inside any layer, no matter how specific the layered selector is. A single-class customer selector wins against the UI Kit's `.product-card[data-loading] .product-card__icon`.

```css
/* In a Laioutr component */
@layer lui-components {
  .product-card[data-loading] .product-card__icon {
    color: var(--color-fg-muted);
  }
}

/* In the customer's site.css (no layer) */
.product-card__icon {
  color: hotpink; /* wins */
}
```

The customer never needs `!important` to override the UI Kit. The UI Kit never needs `!important` to defend itself against the customer's reset or base styles.

## The layers in detail

| Layer             | What lives here                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `lui-tokens`      | Theme files (`theme-classic`, `theme-sunny`, etc.). All design-token CSS custom properties: colors, typography, spacing, semantic aliases. |
| `lui-reset`       | UnoCSS reset (`@unocss/reset/tailwind.css`). Browser-defaults normalization.                                                               |
| `lui-externals`   | Third-party CSS that must lose to internal styles. Currently Swiper. Assigned via PostCSS at build time.                                   |
| `lui-global`      | Framework-wide rules: section isolation, `OnSurface` tone cascade, z-index variables, container queries, animations, bleed helpers.        |
| `lui-overridable` | Low-specificity base styles for primitives (Icon, Text) and UnoCSS `parent` rules. Intentionally easy to override from `lui-components`.   |
| `lui-components`  | Internal UI Kit, UI, and UI App component styles. The layer you wrap your own components in.                                               |
| (unlayered)       | Anything the customer writes outside any layer.                                                                                            |

The practical takeaway for an app author: **`lui-components` is your layer**. Everything else has a special purpose you might want to extend or override.

## Authoring your own components

If you ship Vue components in an app alongside Laioutr's, wrap their `<style>` blocks in the same layer. Otherwise your components become "harder to restyle" than the built-in ones, because customer overrides would need extra specificity to beat your unlayered rules.

```vue
<style>
@layer lui-components {
  .my-product-card { /* ... */ }
  .my-product-card__title { /* ... */ }
}
</style>
```

Use unscoped styles. Scoped styles inject `data-v-xxx` hashes that leak into the customer's selector landscape and break the next time you ship a build. The BEM block name on the root element is the isolation you need.

## Why this exists

Component libraries usually lose to customer CSS in one of two ways:

- They ship styles with high specificity (often `!important`) that customers have to wrestle. Override fights end with longer selectors on both sides and brittle, unreadable CSS.
- They ship low-specificity styles that customer base / reset CSS accidentally overrides. The library looks broken on import.

CSS layers let both sides write natural selectors. The order between layers and unlayered CSS is the contract, not the selector arms race. Customers get a predictable override surface; the UI Kit gets clean internal styles.

::tip
If you see a customer reporting that they need `!important` to override a Laioutr component, check that the customer's CSS is unlayered (or in a later layer than `lui-components`). A `!important` on the customer side is almost always a sign the rule is in the wrong place in the cascade.
::

## Related

- [Z-Ordering](/laioutr-ui/getting-started/z-ordering) for the CSS variable scale used alongside this layer for predictable stacking.
- [Surface Tone](/laioutr-ui/getting-started/surface-tone) for the cascading mechanism Laioutr uses for light / dark / bright surface adaptation.
