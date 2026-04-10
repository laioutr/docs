---
title: Section Definitions
description: How to create and register section definitions that appear in Laioutr Studio.
seo:
  title: Section Definitions | Laioutr
  description: How to create and register section definitions that appear in Laioutr Studio.
sitemap:
  loc: /apps/app-development/section-definitions
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

You have a Laioutr app and you want editors to place a new section on pages through Studio. Every section starts with a **definition**: a TypeScript object that declares the component name, Studio metadata, configurable fields, and slots for blocks.

```ts twoslash
import type { SectionDefinition } from '@laioutr-core/core-types/frontend';
declare const defineSection: <const T extends SectionDefinition>(definition: T) => T;
// ---cut---
export const definition = defineSection({
  component: 'SectionHeroBanner',
  studio: {
    label: 'Hero Banner',
    description: 'A full-width banner with heading, media, and a call-to-action button.',
    previewSrc: '/app-my-app/component-previews/SectionHeroBanner.png',
    tags: ['Heroes', 'Banner'],
  },
  slots: [
    {
      name: 'default',
      studio: { label: 'Content' },
    },
  ],
  schema: [
    {
      label: 'Content',
      fields: [
        { type: 'text', name: 'heading', label: 'Heading' },
        { type: 'media', name: 'backgroundImage', label: 'Background Image', allowedTypes: ['image'] },
        { type: 'text', name: 'ctaLabel', label: 'Button Label' },
        { type: 'link', name: 'ctaLink', label: 'Button Link' },
      ],
    },
  ],
});
```

The platform reads this definition at three points: **Studio** uses it to build the sidebar editor, **Frontend Core** uses it to wire up data and props, and your **Vue component** uses it to define its props.

## Required properties

Every section definition needs these properties:

| Property | Type | Purpose |
|---|---|---|
| `component` | `string` | The globally registered Vue component name. Must match the component's filename (e.g., `SectionHeroBanner.vue` registers as `'SectionHeroBanner'`). |
| `studio` | `object` | Metadata shown in the Studio UI. At minimum, provide `label`. |
| `slots` | `SectionSlotDefinition[]` | Named insertion points for blocks. Pass an empty array if the section has no slots. |

`schema` is optional but present on almost every section.

## The studio object

The `studio` property controls how the section appears in Studio's component picker and sidebar.

```ts twoslash
import type { SectionDefinition } from '@laioutr-core/core-types/frontend';
declare const defineSection: <const T extends SectionDefinition>(definition: T) => T;
// ---cut---
export const definition = defineSection({
  component: 'SectionImageAndContent',
  studio: {
    label: 'Image and Content',
    description: 'Combine large images or videos with any content.',
    previewSrc: '/app-ui/component-previews/SectionImageAndContent.png',
    tags: ['Banner', 'Content'],
  },
  slots: [],
  schema: [],
});
```

::field-group
  :::field{name="label" type="string" required}
  Display name in the Studio component picker.
  :::
  :::field{name="description" type="string"}
  Short description shown below the label.
  :::
  :::field{name="previewSrc" type="string"}
  Path to a preview image. Place the image in your app's `public/` directory.
  :::
  :::field{name="tags" type="WellKnownComponentTag[]"}
  Categorization tags for the component picker. Use [well-known tags](#well-known-tags) or any custom string.
  :::
  :::field{name="propsWizard" type="PropsWizard"}
  A multi-step wizard that pre-configures the section before it is placed on a page. See [Props wizard](#props-wizard).
  :::
::

### Well-known tags

Studio recognizes these tags for built-in category filters:

`Banner`, `Brands`, `Blog`, `Checkout & Cart`, `Content`, `Customer Relations`, `Featuring Products`, `Footer`, `Grids`, `Header`, `Heroes`, `Navigation`, `Products`, `Product Detail Page`, `Product Listing Page`, `Testimonials`, `Sliders`, `Blank Containers`

You can also pass any custom string.

### Props wizard

A props wizard lets editors choose a pre-configured variant when they add a section. Studio shows the wizard as a step-by-step flow before the section is placed on the page. Each step presents a set of variants, and the selected variant's props are applied to the new section.

```ts twoslash
import type { SectionDefinition } from '@laioutr-core/core-types/frontend';
declare const defineSection: <const T extends SectionDefinition>(definition: T) => T;
// ---cut---
export const definition = defineSection({
  component: 'SectionHeroBanner',
  studio: {
    label: 'Hero Banner',
    propsWizard: {
      steps: [
        {
          type: 'variant',
          title: 'Choose a layout',
          input: [
            {
              id: 'centered',
              label: 'Centered',
              icon: 'layout',
              previewSrc: '/app-my-app/previews/hero-centered.png',
              props: { layout: 'centered', sectionStyle: 'full-width' },
            },
            {
              id: 'split',
              label: 'Split',
              icon: 'container',
              previewSrc: '/app-my-app/previews/hero-split.png',
              props: { layout: 'split', sectionStyle: 'boxed' },
            },
          ],
        },
      ],
    },
  },
  slots: [],
  schema: [],
});
```

The `propsWizard` object contains a `steps` array. Currently only `variant` steps are supported.

#### Step properties

::field-group
  :::field{name="type" type="'variant'" required}
  Step type. Only `'variant'` is supported.
  :::
  :::field{name="title" type="string" required}
  Heading shown above the variant cards in the wizard.
  :::
  :::field{name="input" type="PropsWizardVariant[]" required}
  The variants the editor can choose from in this step.
  :::
::

#### Variant properties

::field-group
  :::field{name="id" type="string" required}
  Unique identifier for this variant within the step.
  :::
  :::field{name="label" type="string" required}
  Display name shown on the variant card.
  :::
  :::field{name="icon" type="string"}
  [Studio icon](/apps/app-development/studio-icons) shown on the variant card.
  :::
  :::field{name="props" type="Record<string, any>" required}
  Props applied to the section when this variant is selected. Keys must match field names in the section's `schema`.
  :::
  :::field{name="previewSrc" type="string"}
  Path to a preview image for this variant. Place the image in your app's `public/` directory.
  :::
::

## Defining slots

Slots are named insertion points where editors place blocks. They map directly to Vue `<slot>` elements in your component.

```ts twoslash
import type { SectionDefinition } from '@laioutr-core/core-types/frontend';
declare const defineSection: <const T extends SectionDefinition>(definition: T) => T;
// ---cut---
export const definition = defineSection({
  component: 'SectionProductShowcase',
  studio: { label: 'Product Showcase' },
  slots: [
    {
      name: 'default',
      studio: { label: 'Content Blocks' },
    },
    {
      name: 'sidebar',
      studio: { label: 'Sidebar' },
      restrictTo: ['BlockProductCard', 'BlockPromotion'],
      prefer: ['BlockProductCard'],
    },
  ],
  schema: [],
});
```

::field-group
  :::field{name="name" type="string" required}
  Slot name. Use `'default'` for the main slot. Must match the `<slot name="...">` in your Vue template.
  :::
  :::field{name="studio.label" type="string"}
  Label shown in the Studio sidebar for this slot area.
  :::
  :::field{name="restrictTo" type="(string | BlockDefinition)[]"}
  If set, only these blocks can be placed in this slot. Accepts component name strings or imported block definition objects.
  :::
  :::field{name="allow" type="(string | BlockDefinition)[]"}
  Blocks marked as `isStandalone: false` need to appear in this list to be usable in this slot.
  :::
  :::field{name="prefer" type="(string | BlockDefinition)[]"}
  These blocks appear first in the Studio block picker for this slot.
  :::
::

Pass an empty array (`slots: []`) if your section does not accept child blocks.

## Adding a schema

The `schema` property defines the fields that appear in the Studio sidebar. Fields are grouped into **fieldsets** (collapsible panels in the sidebar UI).

```ts
schema: [
  {
    label: 'Content',
    fields: [
      { type: 'text', name: 'heading', label: 'Heading' },
      { type: 'richtext', name: 'body', label: 'Body Text' },
    ],
  },
  {
    label: 'Design',
    defaultOpen: false,
    fields: [
      { type: 'color', name: 'backgroundColor', label: 'Background Color' },
      {
        type: 'select',
        name: 'layout',
        label: 'Layout',
        default: 'full-width',
        options: [
          { label: 'Full Width', value: 'full-width' },
          { label: 'Boxed', value: 'boxed' },
        ],
      },
    ],
  },
]
```

Each fieldset can have a `label`, optional `helpText`, [`icon`](/apps/app-development/studio-icons), and `defaultOpen` (defaults to `true`).

For the full list of available field types and their options, see [Schema Fields](/apps/app-development/schema-fields).

## Wiring the definition to a Vue component

The definition and the component live in the same `.vue` file. Export the definition from a regular `<script lang="ts">` block, then use `definitionToProps()` in `<script setup>` to derive Vue props from it.

```vue [SectionHeroBanner.vue] twoslash
<script lang="ts">
import { defineSection, definitionToProps } from '@laioutr-core/frontend-core/types';
// ---cut---
export const definition = defineSection({
  component: 'SectionHeroBanner',
  studio: { label: 'Hero Banner' },
  slots: [{ name: 'default', studio: { label: 'Content' } }],
  schema: [
    {
      label: 'Content',
      fields: [
        { type: 'text', name: 'heading', label: 'Heading' },
        { type: 'richtext', name: 'body', label: 'Body Text' },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
const props = defineProps(definitionToProps(definition));
</script>

<template>
  <section>
    <h1>{{ heading }}</h1>
    <div v-html="body" />
    <slot />
  </section>
</template>
```

`definitionToProps` keeps your component's props in sync with the schema. You never declare props by hand. For sections, it also adds a `slots` prop (typed as an object) so you can access block data for each named slot.

## File conventions

Place each section as a single `.vue` file in your app's sections directory:

```
src/runtime/app/sections/
  SectionHeroBanner.vue
  SectionImageAndContent.vue
  SectionTestimonialCarousel.vue
```

Register the directory in your module's `registerLaioutrApp` call:

```ts
// module.ts
registerLaioutrApp({
  sections: [resolve('./runtime/app/sections')],
  // ...
});
```

## Full example

A section with media, design settings, and a content slot (based on the built-in `SectionImageAndContent`):

::code-collapse

```vue [SectionImageAndContent.vue]
<script lang="ts">
import { defineSection, definitionToProps, toMedia } from '#imports';

export const definition = defineSection({
  component: 'SectionImageAndContent',
  studio: {
    label: 'Image and Content',
    description: 'Combine large images or videos with any content.',
    previewSrc: '/app-ui/component-previews/SectionImageAndContent.png',
    tags: ['Banner', 'Content'],
  },
  slots: [
    {
      name: 'default',
      studio: { label: 'Content' },
    },
  ],
  schema: [
    {
      label: 'Media',
      fields: [
        {
          type: 'media',
          name: 'media',
          label: 'Media',
          allowedTypes: ['image'],
        },
        {
          type: 'select',
          name: 'imageSizeMode',
          label: 'Image Size Mode',
          default: 'keep-ratio',
          options: [
            { label: 'Keep Ratio', value: 'keep-ratio' },
            { label: 'Fill', value: 'fill' },
          ],
        },
      ],
    },
    {
      label: 'Design',
      fields: [
        {
          type: 'toggle_button',
          name: 'sectionStyle',
          label: 'Style',
          default: 'full-width',
          options: [
            { label: 'Full', value: 'full-width' },
            { label: 'Boxed', value: 'boxed' },
          ],
        },
        {
          type: 'color',
          name: 'customBackgroundColor',
          label: 'Custom Background Color',
        },
        {
          type: 'select',
          name: 'proportions',
          label: 'Proportions',
          default: '50/50',
          options: [
            { label: '50/50', value: '50/50' },
            { label: '60/40', value: '60/40' },
            { label: '70/30', value: '70/30' },
          ],
        },
        {
          type: 'number',
          name: 'sectionHeight',
          label: 'Section Height',
          default: 0,
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
  <section>
    <img v-if="media" :src="toMedia(media).src" :alt="toMedia(media).alt" />
    <div>
      <slot />
    </div>
  </section>
</template>
```

::
