---
title: Z-Ordering
description: How Laioutr prevents z-index conflicts between sections and how to use z-index tokens for sticky or fixed elements.
sitemap:
  loc: /laioutr-ui/getting-started/z-ordering
---

You build a hero section with `z-index: 10` on its navigation arrows. A content manager drags a product grid section below it. The arrows now paint over the grid. This is a z-index leak: values inside one section escape and break sibling sections. Laioutr prevents this with **section isolation** and a **z-index token scale**.

## Section isolation

Every section gets its own CSS stacking context via `isolation: isolate` on the section root. Z-index values inside your section cannot leak out and affect neighboring sections.

Portaled content (reka-ui `DropdownMenu`, `Sheet`, `Dialog`, `AlertDialog`) is unaffected by section isolation because it renders outside your section's DOM tree via a portal to `<body>`.

### The `#__nuxt` root

The Nuxt app root (`#__nuxt`) also receives `isolation: isolate`. This creates a stacking boundary between the app content and portaled elements at `<body>` level. Any portaled element with a positive z-index appears above the entire app.

### How it fits together

::excalidraw-diagram{src="/images/z-ordering-architecture.excalidraw" alt="Section isolation and portaling architecture"}
::

Section z-index values (like the hero slider's `z-index: 10`) are trapped inside their section's stacking context. Portaled elements sit at `<body>` level with z-index values from the token scale, above the entire `#__nuxt` app.

## Z-index tokens

For sticky or fixed elements, use the provided CSS custom properties instead of hardcoded z-index values:

| Token               | Value  | Use case                                |
| ------------------- | ------ | --------------------------------------- |
| `--z-index-sticky`  | `100`  | Sticky headers, fixed filter bars       |
| `--z-index-overlay` | `1300` | Sheet and dialog backdrops              |
| `--z-index-modal`   | `1400` | Sheet content, dialog content, lightbox |
| `--z-index-popover` | `1500` | Dropdown menus, select menus, popovers  |
| `--z-index-tooltip` | `1600` | Tooltips                                |
| `--z-index-toast`   | `1700` | Toast notifications                     |

```css
.my-sticky-bar {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}
```

## Opting out of isolation

Sections with sticky or fixed positioning that must remain visible above subsequent sections need to opt out of isolation. Otherwise their z-index is trapped inside the section's stacking context and they disappear behind the next section as it scrolls past.

Set `rendering: { isolate: false }` in your [section definition](/apps/app-development/section-definitions):

```ts
export const definition = defineSection({
  component: 'SectionStickyHeader',
  rendering: { isolate: false },
  studio: { label: 'Sticky Header', tags: ['Header'] },
});
```

::warning
Only disable isolation for sections with sticky or fixed elements that must remain visible above subsequent sections. Disabling it for regular sections reintroduces z-index conflicts between sections.
::

::tip
If a dropdown or popover inside your section appears behind another section, the overlay is likely not being portaled. All reka-ui overlay components portal to `<body>` by default. Verify that yours do, too.
::
