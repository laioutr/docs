---
title: Schema Fields
description: Reference for all field types available in section and block definition schemas.
links: []
seo:
  title: Schema Fields | Laioutr
  description: Reference for all field types available in section and block definition schemas.
---

The `schema` property of a [section](/apps/app-development/section-definitions) or [block](/apps/app-development/block-definitions) definition controls the sidebar editor in Studio. It is an array of **fieldsets**, where each fieldset groups related fields into a collapsible panel.

```ts
schema: [
  {
    label: 'Content',
    helpText: 'The main content of this section.',
    fields: [
      { type: 'text', name: 'heading', label: 'Heading' },
      { type: 'richtext', name: 'body', label: 'Body Text' },
    ],
  },
  {
    label: 'Design',
    defaultOpen: true,
    fields: [
      { type: 'color', name: 'backgroundColor', label: 'Background Color' },
    ],
  },
]
```

## Fieldset properties

::field-group
  :::field{name="label" type="string"}
  Panel heading in the Studio sidebar.
  :::

  :::field{name="helpText" type="string"}
  Help text shown below the fieldset label.
  :::

  :::field{name="icon" type="string"}
  [Studio icon](/apps/app-development/studio-icons) shown next to the fieldset label.
  :::

  :::field{default-value="false" name="defaultOpen" type="boolean"}
  Whether the panel starts expanded.
  :::

  :::field{name="fields" required="true" type="StudioFieldDefinition[]"}
  The fields in this group.
  :::
::

## Base field properties

Every field type shares these properties:

::field-group
  :::field{name="type" required="true" type="string"}
  The field type (e.g. `'text'`, `'select'`, `'media'`).
  :::

  :::field{name="name" required="true" type="string"}
  Property name on the component's props. Must be unique within the definition.
  :::

  :::field{name="label" type="string"}
  Display label in the sidebar.
  :::

  :::field{name="default" type="varies"}
  Initial value applied when an editor **creates** a new section or block in Studio. See [Default values and runtime fallbacks](#default-values-and-runtime-fallbacks).
  :::

  :::field{name="description" type="string"}
  Help text shown below the field.
  :::
::

## Default values and runtime fallbacks

The `default` property and the runtime fallback serve different purposes. Understanding the distinction prevents surprises in your component.

**Default values** are applied once: when an editor adds a new section or block to a page in Studio. Studio pre-fills the field with the `default` value. After creation, the default is not used again, even if the editor clears the field.

**Runtime fallbacks** are applied by Frontend Core whenever a prop has no configured value. This happens when:

- The editor never touched the field and no `default` was set.
- The field was added to the schema after the section was already placed on a page.
- The editor explicitly cleared the value.

The fallback is **not** the `default` value. It is a type-appropriate zero value determined by the field type:

| Field type                                          | Fallback                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------- |
| `text`, `textarea`, `richtext`                      | `''` (empty string)                                               |
| `checkbox`                                          | `false` (`true` for [visibility decorators](#visibility-toggles)) |
| `select`, `radio`, `toggle_button`                  | First option's value                                              |
| `object`                                            | Object with fallbacks applied recursively to each nested field    |
| `array`                                             | `[]`                                                              |
| `json`                                              | `null`                                                            |
| `number`, `icon`, `media`, `link`, `query`, `color` | `undefined`                                                       |

String fields like `text` and `textarea` always resolve to a string, so you can use them without null checks. Fields that fall back to `undefined` need a guard in your template.

## Primitive fields

### text

Single-line text input.

```ts
{ type: 'text', name: 'heading', label: 'Heading', placeholder: 'Enter a heading' }
```

::field-group
  :::field{name="placeholder" type="string"}
  Placeholder text shown when the field is empty.
  :::

  :::field{name="maxLength" type="number"}
  Maximum character count.
  :::
::

**Prop type:** `string` · **Fallback:** `''`

---

### textarea

Multi-line plain text input.

```ts
{ type: 'textarea', name: 'excerpt', label: 'Excerpt', maxLength: 200 }
```

::field-group
  :::field{name="placeholder" type="string"}
  Placeholder text.
  :::

  :::field{name="maxLength" type="number"}
  Maximum character count.
  :::
::

**Prop type:** `string` · **Fallback:** `''`

---

### number

Numeric input with optional constraints.

```ts
{ type: 'number', name: 'columns', label: 'Columns', default: 3, min: 1, max: 6, step: 1 }
```

::field-group
  :::field{name="min" type="number"}
  Minimum allowed value.
  :::

  :::field{name="max" type="number"}
  Maximum allowed value.
  :::

  :::field{name="step" type="number"}
  Increment step.
  :::

  :::field{name="prefix" type="string"}
  Text shown before the input (e.g. `'$'`).
  :::

  :::field{name="suffix" type="string"}
  Text shown after the input (e.g. `'px'`).
  :::
::

**Prop type:** `number | undefined` · **Fallback:** `undefined`

---

### checkbox

Boolean toggle.

```ts
{ type: 'checkbox', name: 'showPrice', label: 'Show Price', default: true }
```

A checkbox can also act as a [visibility decorator](#visibility-toggles) to control whether another field is shown in the sidebar.

**Prop type:** `boolean` · **Fallback:** `false`

---

### select

Dropdown with predefined options.

```ts
{
  type: 'select',
  name: 'layout',
  label: 'Layout',
  default: 'full-width',
  options: [
    { label: 'Full Width', value: 'full-width' },
    { label: 'Boxed', value: 'boxed' },
    { label: 'Centered', value: 'centered' },
  ],
}
```

::field-group
  :::field
  ---
  name: options
  required: "true"
  type: "{ value: string; label: string }[]"
  ---
  At least one option is required.
  :::
::

**Prop type:** `string` · **Fallback:** first option's value

---

### radio

Radio button group. Same data shape as `select`, different UI.

```ts
{
  type: 'radio',
  name: 'alignment',
  label: 'Alignment',
  default: 'left',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}
```

::field-group
  :::field
  ---
  name: options
  required: "true"
  type: "{ value: string; label: string }[]"
  ---
  At least one option is required.
  :::
::

**Prop type:** `string` · **Fallback:** first option's value

---

### toggle\_button

Segmented button group. Each option can have a [Studio icon](/apps/app-development/studio-icons).

```ts
{
  type: 'toggle_button',
  name: 'sectionStyle',
  label: 'Style',
  default: 'full-width',
  options: [
    { label: 'Full', value: 'full-width', icon: 'boxOutline' },
    { label: 'Boxed', value: 'boxed', icon: 'boxSolid' },
  ],
}
```

::field-group
  :::field
  ---
  name: options
  required: "true"
  type: "{ value: string; label: string; icon?: string }[]"
  ---
  At least one option is required. Icons are optional per option. See [Studio icons](/apps/app-development/studio-icons) for available names.
  :::
::

**Prop type:** `string` · **Fallback:** first option's value

---

### icon

Icon picker. Lets editors choose from available icon sets.

```ts
{ type: 'icon', name: 'icon', label: 'Icon' }
```

No type-specific properties.

**Prop type:** `string | undefined` · **Fallback:** `undefined`

---

### info

Displays a read-only heading or help text inside the sidebar. Not a data field; it does not produce a prop value.

```ts
{ type: 'info', name: 'designInfo', label: 'Use these settings to customize the appearance.', heading: 'Design Options' }
```

::field-group
  :::field{name="heading" type="string"}
  Heading text shown above the label/description.
  :::
::

**Prop type:** none (not passed as a prop)

## Complex fields

### richtext

Rich text editor with formatting (bold, italic, links, headings, lists, etc.).

```ts
{ type: 'richtext', name: 'body', label: 'Body Text', placeholder: 'Write something...' }
```

::field-group
  :::field{name="placeholder" type="string"}
  Placeholder text.
  :::
::

The field value is an HTML string. Render it with the `RichContent` component from the UI Kit to get consistent typography for headings, lists, blockquotes, tables, links, and images:

```vue
<template>
  <RichContent :html="body" />
</template>
```

Using `v-html` directly works but skips these styles.

**Prop type:** `string` · **Fallback:** `''`

---

### color

Color picker. Supports theme colors and optional custom color input.

```ts
{ type: 'color', name: 'backgroundColor', label: 'Background Color', allowCustom: true }
```

::field-group
  :::field{name="allowCustom" type="boolean"}
  Allow editors to enter a custom hex/rgba value.
  :::

  :::field{name="allowAlpha" type="boolean"}
  Allow alpha (transparency) values.
  :::
::

**Prop type:** `ColorFieldValue | undefined` · **Fallback:** `undefined`

---

### media

Media picker for images and videos from the media library.

```ts
{ type: 'media', name: 'heroImage', label: 'Hero Image', allowedTypes: ['image'] }
```

::field-group
  :::field{name="allowedTypes" type="('image' | 'video')[]"}
  Restrict to specific media types. If omitted, both images and videos are allowed.
  :::

  :::field{name="allowResponsive" type="boolean"}
  Allow responsive image variants (separate sources for mobile and desktop).
  :::

  :::field{name="allowFocalPoint" type="boolean"}
  Allow setting a focal point on images.
  :::
::

The field value is a `Media` object containing source URLs, dimensions, and alt text. Render it with the `Media` component from the UI Kit:

```vue
<template>
  <Media v-if="heroImage" :media="heroImage" sizes="100vw md:50vw" />
</template>
```

When `allowedTypes` is set to `['image']`, the prop type narrows to `MediaImage`.

**Prop type:** `MediaImage | MediaVideo | undefined` · **Fallback:** `undefined`

---

### link

Link picker. Editors can choose between internal pages, external URLs, page anchors, and entity references (products, categories, etc.).

```ts
{ type: 'link', name: 'ctaLink', label: 'Button Link' }
```

No type-specific properties.

The field value is a `Link` object. The link type depends on what the editor selected:

| Link variant | Description                                         |
| ------------ | --------------------------------------------------- |
| `reference`  | A link to a product, category, or blog post by slug |
| `url`        | An external URL                                     |
| `anchor`     | A same-page anchor (e.g. `#features`)               |
| `page`       | A link to a specific page by ID                     |
| `pageType`   | A link to a page type with parameters               |

Resolve a `Link` to a URL string with `linkResolver.resolve()` and pass it to an anchor or `NuxtLink`:

```vue
<template>
  <NuxtLink v-if="ctaLink" :to="linkResolver.resolve(ctaLink)">
    {{ ctaLabel }}
  </NuxtLink>
</template>
```

**Prop type:** `Link | undefined` · **Fallback:** `undefined`

---

### object

Groups nested fields into a single prop. The nested `schema` uses the same fieldset structure as the top-level definition schema.

```ts
{
  type: 'object',
  name: 'badge',
  label: 'Badge',
  schema: [
    {
      fields: [
        { type: 'text', name: 'text', label: 'Badge Text' },
        { type: 'color', name: 'color', label: 'Badge Color' },
      ],
    },
  ],
}
```

::field-group
  :::field{name="schema" type="StudioFieldsetDefinition[]"}
  Nested fieldsets. Same structure as the top-level definition schema.
  :::
::

Access nested properties on the prop directly:

```vue
<script setup lang="ts">
// ---cut---
const { badge } = defineProps<{
  badge: { text: string; color: string | undefined }
}>();
</script>

<template>
  <span v-if="badge.text" class="badge">
    {{ badge.text }}
  </span>
</template>
```

An `object` field can also act as a [style decorator](#style-objects) to attach styling controls to another field.

**Prop type:** `Object` (shape determined by nested schema) · **Fallback:** object with fallbacks applied recursively to each nested field

---

### array

Repeatable list of items. Each item has its own set of fields defined by a nested schema.

```ts
{
  type: 'array',
  name: 'features',
  label: 'Features',
  labelSingular: 'Feature',
  max: 6,
  itemLabelProperty: 'title',
  schema: [
    {
      fields: [
        { type: 'text', name: 'title', label: 'Title' },
        { type: 'icon', name: 'icon', label: 'Icon' },
        { type: 'textarea', name: 'description', label: 'Description' },
      ],
    },
  ],
}
```

::field-group
  :::field{name="schema" type="StudioFieldsetDefinition[]"}
  Fields for each array item.
  :::

  :::field{name="labelSingular" type="string"}
  Label used for the "Add [labelSingular] " button.
  :::

  :::field{name="max" type="number"}
  Maximum number of items.
  :::

  :::field{name="itemLabelProperty" type="string"}
  Field name whose value is used as the item label in the list view.
  :::
::

Each array item receives a stable `.id` property generated by Studio. Use it as the `:key` in `v-for` loops:

```vue
<script setup lang="ts">
// ---cut---
const { features } = defineProps<{
  features: { id: string; title: string; icon: string | undefined; description: string }[]
}>();
</script>

<template>
  <ul>
    <li v-for="feature in features" :key="feature.id">
      <h3>{{ feature.title }}</h3>
      <p>{{ feature.description }}</p>
    </li>
  </ul>
</template>
```

**Prop type:** `Array` (each item shaped by the nested schema, plus an `id` property) · **Fallback:** `[]`

---

### query

Connects a section or block to entity data from [Orchestr](/frontend/orchestr/queries). In Studio, editors configure which entities the component displays. At render time, Frontend Core resolves the configured query through Orchestr and passes the result to your component.

A query field that fetches a list of products for a product slider:

```ts
{
  type: 'query',
  name: 'products',
  label: 'Products',
  entityType: 'Product',
  components: [ProductBase, ProductPrices, ProductMedia],
  links: {
    'ecommerce/product/variants': {
      entityType: 'ProductVariant',
      components: [ProductVariantBase, ProductVariantAvailability],
      limit: 5,
    },
  },
}
```

When `singleEntity` is not set (or `false`), the prop contains a `ClientEntitySet` with an `entities` array. Iterate over it in your template:

```vue
<script setup lang="ts">
import type { ClientEntitySet } from '@laioutr-core/orchestr/types';
// ---cut---
const { products } = defineProps<{
  products: ClientEntitySet | undefined
}>();
</script>

<template>
  <div v-for="product in products?.entities ?? []" :key="product.id">
    <h2>{{ product.components.base.title }}</h2>
    <Media
      v-if="product.components.media"
      :media="product.components.media.image"
    />
  </div>
</template>
```

Set `singleEntity: true` when the component expects exactly one entity (e.g. a product detail page). The prop is then a single `ClientEntity` instead of a set:

```ts
{
  type: 'query',
  name: 'product',
  label: 'Product',
  entityType: 'Product',
  singleEntity: true,
  components: [ProductBase, ProductPrices, ProductDescription, ProductMedia],
  links: {
    'ecommerce/product/variants': {
      entityType: 'ProductVariant',
      components: [ProductVariantBase, ProductVariantInfo],
    },
  },
}
```

```vue
<script setup lang="ts">
import type { ClientEntity } from '@laioutr-core/orchestr/types';
// ---cut---
const { product } = defineProps<{
  product: ClientEntity | undefined
}>();
</script>

<template>
  <div v-if="product">
    <h1>{{ product.components.base.title }}</h1>
    <RichContent :html="product.components.description.body" />
    <Media
      v-if="product.components.media"
      :media="product.components.media.image"
    />
  </div>
</template>
```

::field-group
  :::field{name="entityType" required="true" type="string"}
  The canonical entity type to query (e.g. `'Product'`, `'Category'`, `'BlogPost'`). Must match an entity type with registered [Orchestr query handlers](/frontend/orchestr/queries).
  :::

  :::field{name="singleEntity" type="boolean"}
  When `true`, the prop resolves to a single `ClientEntity` object. When `false` (the default), the prop resolves to a `ClientEntitySet` with an `entities` array.
  :::

  :::field{name="components" type="EntityComponentToken[]"}
  [Entity components](/frontend/orchestr/component-resolvers) to include in the response. Each token declares a slice of entity data (e.g. base info, pricing, images) that your component needs.
  :::

  :::field{name="links" type="FieldDefinitionQueryFetchLinks"}
  Related entities to resolve alongside the main query result. See [Query links](#query-links).
  :::
::

The `entityType` determines which [query handlers](/frontend/orchestr/queries) and [component resolvers](/frontend/orchestr/component-resolvers) are involved. The `components` and `links` properties tell Orchestr exactly what data to include, so it can fetch everything in a single pass.

#### Query links

The `links` property declares related entities that should be fetched alongside the primary query result. Each key is a link token (e.g. `'ecommerce/product/variants'`), and the value describes what to fetch for that link:

```ts
links: {
  'ecommerce/product/variants': {
    entityType: 'ProductVariant',
    components: [ProductVariantBase, ProductVariantOptions],
    limit: 5,
  },
  'blog/collection/posts': {
    entityType: 'BlogPost',
    components: [BlogPostBase, BlogPostMedia],
    limit: 16,
  },
}
```

::field-group
  :::field{name="entityType" required="true" type="string"}
  The entity type of the linked entities.
  :::

  :::field{name="components" type="EntityComponentToken[]"}
  Entity components to fetch for each linked entity.
  :::

  :::field{name="limit" type="number"}
  Maximum number of linked entities to return. Use this to avoid fetching more data than the component needs (e.g. only the first 5 product variants).
  :::

  :::field{name="links" type="FieldDefinitionQueryFetchLinks"}
  Nested links. A linked entity can declare its own links to fetch further related data (e.g. variants of a product that itself was linked from a collection). Nesting is limited to two levels; Orchestr rejects deeper chains with a `LinkRecursionError`.
  :::
::

::warning
Every link you add increases the amount of data Orchestr has to resolve per request. Requesting many links, large `limit` values, or deeply nested link chains can slow down page rendering. Only fetch the components and links your component actually uses, and set a `limit` that matches what you display.
::

In your component, access linked entities through the `links` property of each entity:

```vue
<script setup lang="ts">
import type { ClientEntity } from '@laioutr-core/orchestr/types';
// ---cut---
const { product } = defineProps<{
  product: ClientEntity | undefined
}>();
</script>

<template>
  <div v-if="product">
    <div
      v-for="variant in product.links['ecommerce/product/variants'].entities"
      :key="variant.id"
    >
      {{ variant.components.base.title }}
    </div>
  </div>
</template>
```

**Prop type:** `ClientEntitySet | ClientEntity | undefined` (depends on `singleEntity`) · **Fallback:** `undefined`

---

### json

Raw JSON editor. Use this for advanced configuration that does not fit other field types.

```ts
{ type: 'json', name: 'customConfig', label: 'Custom Configuration', placeholder: '{ "key": "value" }' }
```

::field-group
  :::field{name="placeholder" type="string"}
  Placeholder text in the editor.
  :::
::

**Prop type:** `JSONType | null` · **Fallback:** `null`

## Field decorators

Some fields can be linked to other fields to change their presentation in the Studio sidebar. Decorators do not affect the data model; both the decorator and the target field are passed as separate props.

### Visibility toggles

A `checkbox` with `for` and `as: 'visibility'` controls whether another field is visible in the sidebar.

```ts
// The text field
{ type: 'text', name: 'subtitle', label: 'Subtitle' },
// The visibility toggle
{ type: 'checkbox', name: 'subtitleVisible', for: 'subtitle', as: 'visibility', default: true },
```

When the editor unchecks the toggle, the `subtitle` field hides in the sidebar. Both values are still passed as props to your component. Your component can use the checkbox value to conditionally render the field:

```vue
<template>
  <p v-if="subtitleVisible">{{ subtitle }}</p>
</template>
```

::tip
Visibility-decorator checkboxes fall back to `true` (visible) instead of the normal `false` for regular checkboxes.
::

### Style objects

An `object` with `for` and `as: 'style'` attaches styling controls to another field. Studio renders the style panel inline below the target field.

```ts
// The text field
{ type: 'text', name: 'heading', label: 'Heading' },
// The style object
{
  type: 'object',
  name: 'headingStyle',
  label: 'Heading Style',
  for: 'heading',
  as: 'style',
  schema: [
    {
      fields: [
        { type: 'color', name: 'color', label: 'Text Color' },
      ],
    },
  ],
}
```

The style object is passed as a separate prop. Apply it in your template:

```vue
<template>
  <h1 :style="{ color: headingStyle?.color }">{{ heading }}</h1>
</template>
```
