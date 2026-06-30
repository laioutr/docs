---
title: Separate schema components from UI components
aliases: []
description: Split the Studio-facing schema wrapper (defineSection / defineBlock) from the visual Vue component that paints pixels. Two files, two responsibilities, fewer regressions.
seo:
  title: Schema components vs UI components | Laioutr
  description: Why and how to separate Laioutr schema definitions from the underlying Vue UI components in your app.
sitemap:
  loc: /apps/app-development/guides/schema-components-vs-ui-components
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 0.9
  videos: []
  images: []
---

The [section definitions](/apps/app-development/section-definitions) and [block definitions](/apps/app-development/block-definitions) pages show the simple case: definition and template live in one `.vue` file. That is fine for a one-off section. As soon as your app grows past a handful of sections, or you want to reuse the same visual in two places, or unit-test the visual without touching Studio, keep the two concerns in two files.

A **schema component** is a Studio-facing wrapper. Its job is to declare the schema, derive props with `definitionToProps`, resolve runtime data (queries, links, entity components), and forward the result to the underlying visual. It owns no layout and no styling.

A **UI component** is a plain Vue component. Its job is to render markup from a typed props interface. It knows nothing about Studio, nothing about `defineBlock`, and nothing about query resolution. You could ship it in a component library.

```text
SectionHeroBanner.vue   ← schema component (thin, schema → props mapping)
       │
       ▼
HeroBanner.vue          ← UI component (markup, styles, props in)
```

## The problem with co-located definitions

When the definition lives in the same file as the template, every change to either side ripples through the other. Three things break in practice:

1. **The visual is not reusable.** You can't drop `SectionHeroBanner` into a custom page outside Studio without dragging the whole `definitionToProps` machinery (and the runtime that resolves it) along with it.
2. **The visual is not unit-testable in isolation.** Tests have to mock or stub the definition layer, which makes them slow and brittle.
3. **The schema bloats.** Every visual prop becomes a schema field by reflex, even when the visual prop is internal (a layout variant the editor should not see, a derived value).

Splitting the two surfaces makes each independently changeable: the schema can grow without touching the visual, and the visual can be redesigned without re-deriving the schema.

## The split

Start with a pure UI component that takes its data as props. No `defineSection`, no `definitionToProps`, no `useQuery`. Just a typed Props interface and a template.

```vue [components/HeroBanner.vue]
<script setup lang="ts">
import type { Media } from '@laioutr-core/core-types/common';

export interface HeroBannerProps {
  heading: string;
  body?: string;
  media?: Media;
  layout?: 'centered' | 'split';
}

defineProps<HeroBannerProps>();
</script>

<template>
  <section :class="['hero-banner', `hero-banner--${layout ?? 'centered'}`]">
    <Media v-if="media" :media="media" class="hero-banner__media" />
    <div class="hero-banner__content">
      <h1>{{ heading }}</h1>
      <div v-if="body" v-html="body" />
      <slot />
    </div>
  </section>
</template>
```

The UI component takes a `Media` directly and renders it through the platform's `<Media>` component, which handles responsive sources and nuxt-image providers. No flattening to a raw `src` string.

Then write a schema component next to it. The schema component owns the `defineSection` call, derives its props from the schema, and renders the UI component.

```vue [sections/SectionHeroBanner.vue]
<script lang="ts">
import { defineSection, definitionToProps } from '#imports';

export const definition = defineSection({
  component: 'SectionHeroBanner',
  studio: {
    label: 'Hero Banner',
    description: 'A full-width banner with heading, media, and a call-to-action button.',
    tags: ['Heroes', 'Banner'],
  },
  slots: [{ name: 'default', studio: { label: 'Content' } }],
  schema: [
    {
      label: 'Content',
      fields: [
        { type: 'text', name: 'heading', label: 'Heading' },
        { type: 'richtext', name: 'body', label: 'Body Text' },
        { type: 'media', name: 'media', label: 'Background Image', allowedTypes: ['image'] },
      ],
    },
    {
      label: 'Design',
      defaultOpen: false,
      fields: [
        {
          type: 'select',
          name: 'variant',
          label: 'Layout',
          default: 'centered',
          options: [
            { label: 'Centered', value: 'centered' },
            { label: 'Split', value: 'split' },
          ],
        },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
import HeroBanner from '../components/HeroBanner.vue';

const props = defineProps(definitionToProps(definition));
</script>

<template>
  <HeroBanner
    :heading="heading"
    :body="body"
    :media="media"
    :layout="variant"
  >
    <slot />
  </HeroBanner>
</template>
```

The schema component is now a **mapping layer**: schema-shaped data goes in, UI-component props come out. It is the only place that knows about runtime fallbacks, query resolution, or renaming a canonical schema field to the UI component's prop name (here, `variant` from the schema becomes `layout` on the UI component). Everything visual is delegated to `HeroBanner`.

## What goes where

The split is sharper than it looks at first. Keep this checklist in mind:

| Concern                                        | Schema component | UI component |
| ---------------------------------------------- | ---------------- | ------------ |
| `defineSection` / `defineBlock` call           | ✓                |              |
| `definitionToProps`                            | ✓                |              |
| Renaming canonical schema fields to UI props   | ✓                |              |
| Resolving runtime data (queries, link helpers) | ✓                |              |
| Vue `<template>` markup, classes, styles       |                  | ✓            |
| Layout variants, slots, sub-components         |                  | ✓            |
| CSS (`@layer`, BEM blocks, tokens)             |                  | ✓            |
| Storybook stories                              |                  | ✓            |

A useful heuristic: if you could not write a Storybook story for a piece of behavior, it does not belong in the UI component.

## Why this pays off

The UI component can render anywhere: a custom checkout page, an internal admin tool, an email preview. None of those need the Studio runtime in scope.

You can test the visual in isolation. Mount `HeroBanner` in a Vitest + Vue Test Utils setup with plain props. No Studio, no Frontend Core, no mocks.

The visual API stays stable. When you redesign the UI component you change one file. The schema component is untouched as long as the props interface holds. When the schema grows a new field, the UI component does not see it until you wire it through.

Internal layout knobs (think: "tablet breakpoint for the column gap") stay as defaults on the UI component instead of leaking into Studio as fields no editor should ever touch.

Designers and contributors less familiar with Laioutr can iterate on the UI component without learning the schema system.

## File conventions

Both files live in your app's `runtime/app/` tree. Keep schema components in `sections/` or `blocks/` (this is what gets registered with `registerLaioutrApp`), and keep UI components in a sibling `components/` directory:

```text
src/runtime/app/
  components/
    HeroBanner.vue
    ProductCard.vue
  sections/
    SectionHeroBanner.vue
  blocks/
    BlockProductCard.vue
```

Only the `sections/` and `blocks/` directories are passed to `registerLaioutrApp`:

```ts [module.ts]
registerLaioutrApp({
  sections: [resolve('./runtime/app/sections')],
  blocks: [resolve('./runtime/app/blocks')],
  // components/ is intentionally not registered. It is imported directly.
});
```

The `components/` directory is for your own internal imports. It is not auto-discovered, and it is not exposed to Studio.

### Naming

Schema components keep the `Section` or `Block` prefix: `SectionHeroBanner.vue`, `BlockProductCard.vue`. The `component` string passed to `defineSection` / `defineBlock` must match the filename verbatim.

UI components drop the prefix: `HeroBanner.vue`, `ProductCard.vue`. The name describes the visual, not the Studio role.

A 1:1 correspondence between a schema component and its UI component is the default. If you find one schema component pulling in several UI components, look closely. You may be hiding a layout decision in the wrapper that belongs in a new UI component.

## When not to split

The split is not free. If your section has no real visual logic (a divider, a fixed-content footer, a thin wrapper around a single ui-kit primitive), co-locating the definition and the template in one file is fine. Reach for the split when at least one of these is true:

- You want to reuse the visual outside Studio.
- You want Storybook stories or unit tests for the visual.
- The template is more than a handful of lines of markup, or it pulls in multiple sub-components.
- The schema has internal layout knobs that should not be editor-facing.

Co-located definitions are a starting point, not the destination. When a section earns the split, do it. The cost of leaving it co-located grows faster than the cost of the refactor.

## Related

- [Section Definitions](/apps/app-development/section-definitions) for the `defineSection` and `definitionToProps` reference.
- [Block Definitions](/apps/app-development/block-definitions) for the `defineBlock` reference and the standalone / non-standalone distinction.
- [Schema Fields](/apps/app-development/schema-fields) for the full field-type catalog the schema component declares.
- [Coding Standards](/apps/app-development/coding-standards) for naming, file layout, and registration conventions.
