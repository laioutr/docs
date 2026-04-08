---
title: Block Definitions
description: How to create and register block definitions for Laioutr Studio.
seo:
  title: Block Definitions | Laioutr
  description: How to create and register block definitions for Laioutr Studio.
sitemap:
  loc: /apps/app-development/block-definitions
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

Blocks are smaller components that live inside a section's slots. A product card in a grid, a slide in a carousel, a single FAQ item: these are blocks. Like sections, every block starts with a **definition** that declares the component, Studio metadata, and configurable fields.

```ts
export const definition = defineBlock({
  component: 'BlockTestimonial',
  studio: {
    label: 'Testimonial',
    description: 'A single testimonial with quote, author name, and star rating.',
  },
  schema: [
    {
      label: 'Testimonial',
      fields: [
        { type: 'text', name: 'authorName', label: 'Author Name', placeholder: 'e.g. Larry Lama' },
        { type: 'richtext', name: 'quote', label: 'Quote', placeholder: 'Something nice...' },
        {
          type: 'select',
          name: 'starRating',
          label: 'Star Rating',
          options: [
            { label: '1 of 5', value: '1' },
            { label: '2 of 5', value: '2' },
            { label: '3 of 5', value: '3' },
            { label: '4 of 5', value: '4' },
            { label: '5 of 5', value: '5' },
          ],
        },
      ],
    },
  ],
});
```

Editors place blocks into section slots through Studio. The section's [slot definition](/apps/app-development/section-definitions#defining-slots) controls which blocks are available.

## Required properties

| Property | Type | Purpose |
|---|---|---|
| `component` | `string` | The globally registered Vue component name. Must match the component's filename. |
| `studio` | `object` | Metadata for Studio's block picker. At minimum, provide `label`. |

`schema` and `isStandalone` are optional.

## The studio object

Works the same way as for [sections](/apps/app-development/section-definitions#the-studio-object).

::field-group
  :::field{name="label" type="string" required}
  Display name in the Studio block picker.
  :::
  :::field{name="description" type="string"}
  Short description shown below the label.
  :::
  :::field{name="previewSrc" type="string"}
  Path to a preview image in your app's `public/` directory.
  :::
  :::field{name="tags" type="WellKnownComponentTag[]"}
  Categorization tags. Same [well-known tags](/apps/app-development/section-definitions#well-known-tags) as sections, plus custom strings.
  :::
::

## Standalone vs non-standalone blocks

By default, blocks are **standalone** (`isStandalone: true`). A standalone block can be placed in any section slot, as long as the slot does not restrict it via `restrictTo`.

Set `isStandalone: false` when a block only makes sense inside a specific section. A non-standalone block can only be used in slots that list it in their `allow` array.

```ts
// A testimonial block that only works inside the testimonial carousel section
export const definition = defineBlock({
  component: 'BlockTestimonial',
  studio: { label: 'Testimonial' },
  isStandalone: false,
  schema: [],
});
```

The section that hosts this block must list it in its slot's `allow` array:

```ts
export const definition = defineSection({
  component: 'SectionTestimonialCarousel',
  studio: { label: 'Testimonial Carousel' },
  slots: [
    {
      name: 'default',
      studio: { label: 'Testimonials' },
      allow: ['BlockTestimonial'],
    },
  ],
  schema: [],
});
```

You can also pass the imported block definition object instead of a string:

```ts
import { definition as BlockTestimonialDefinition } from './BlockTestimonial.vue';

// ...
allow: [BlockTestimonialDefinition],
```

## Adding a schema

Schemas for blocks work exactly like [section schemas](/apps/app-development/section-definitions#adding-a-schema): an array of fieldsets, each containing an array of fields.

```ts
schema: [
  {
    label: 'Content',
    fields: [
      { type: 'text', name: 'title', label: 'Title' },
      { type: 'media', name: 'image', label: 'Image' },
    ],
  },
]
```

See [Schema Fields](/apps/app-development/schema-fields) for all available field types.

## Wiring the definition to a Vue component

Same as sections: the definition and component live in the same `.vue` file. Export the definition from a regular `<script lang="ts">` block, then use `definitionToProps()` in `<script setup>`.

```vue twoslash [BlockTestimonial.vue]
// @errors: 2711
<script lang="ts">
// ---cut-start---
import { defineBlock, definitionToProps } from '@laioutr-core/frontend-core/types';
// ---cut-end---
export const definition = defineBlock({
  component: 'BlockTestimonial',
  studio: { label: 'Testimonial' },
  schema: [
    {
      label: 'Testimonial',
      fields: [
        { type: 'text', name: 'authorName', label: 'Author Name' },
        { type: 'richtext', name: 'quote', label: 'Quote' },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
const props = defineProps(definitionToProps(definition));
</script>

<template>
  <div class="testimonial-card">
    <p>{{ quote }}</p>
    <span>{{ authorName }}</span>
  </div>
</template>
```

Unlike sections, blocks do not receive an automatic `slots` prop from `definitionToProps`.

## File conventions

Place each block as a single `.vue` file in your app's blocks directory:

```
src/runtime/app/blocks/
  BlockTestimonial.vue
  BlockProductCard.vue
  BlockFaqItem.vue
```

Register the directory in your module's `registerLaioutrApp` call:

```ts
// module.ts
registerLaioutrApp({
  blocks: [resolve('./runtime/app/blocks')],
  // ...
});
```

## Full example

A product card block with display settings:

::code-collapse

```vue [BlockProductCard.vue]
<script lang="ts">
import { defineBlock, definitionToProps } from '#imports';

export const definition = defineBlock({
  component: 'BlockProductCard',
  studio: {
    label: 'Product Card',
    description: 'Displays a single product with image, title, and price.',
    previewSrc: '/app-my-app/component-previews/BlockProductCard.png',
    tags: ['Products'],
  },
  schema: [
    {
      label: 'Content',
      fields: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
        },
        {
          type: 'media',
          name: 'image',
          label: 'Product Image',
          allowedTypes: ['image'],
        },
        {
          type: 'richtext',
          name: 'description',
          label: 'Description',
        },
      ],
    },
    {
      label: 'Display Settings',
      fields: [
        {
          type: 'select',
          name: 'colorMode',
          label: 'Color Mode',
          default: 'on-light',
          options: [
            { label: 'On Light', value: 'on-light' },
            { label: 'On Dark', value: 'on-dark' },
          ],
        },
        {
          type: 'checkbox',
          name: 'showPrice',
          label: 'Show Price',
          default: true,
        },
        {
          type: 'checkbox',
          name: 'isContentFullWidth',
          label: 'Content Full Width',
        },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
const props = defineProps(definitionToProps(definition));
</script>

<template>
  <div :class="['product-card', `product-card--${colorMode}`]">
    <img v-if="image" :src="image.src" :alt="image.alt" />
    <h3>{{ title }}</h3>
    <div v-if="description" v-html="description" />
  </div>
</template>
```

::
