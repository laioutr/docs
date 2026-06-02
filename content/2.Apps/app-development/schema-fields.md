---
title: Schema Fields
description: Reference for all field types available in section and block definition schemas.
seo:
  title: Schema Fields | Laioutr
  description: Reference for all field types available in section and block definition schemas.
sitemap:
  loc: /apps/app-development/schema-fields
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1
links: []
changelogKeys:
  - SchemaCondition
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

::field-group{title="Fieldset definition schema"}
  :::field{name="label" type="string"}
  Panel heading in the Studio sidebar.
  :::

  :::field{name="helpText" type="string"}
  Help text shown below the fieldset label.
  :::

  :::field{name="icon" type="string"}
  [Studio icon](/apps/app-development/studio-icons) shown next to the fieldset label.
  :::

  :::field{default-value="true" name="defaultOpen" type="boolean"}
  Whether the panel starts expanded.
  :::

  :::field{name="if" type="SchemaCondition"}
  JSON expression that controls whether the fieldset is shown in Studio. See [Conditional visibility](#conditional-visibility).
  :::

  :::field
  ---
  required: true
  name: fields
  type: StudioFieldDefinition[]
  ---
  The fields in this group.
  :::
::

## Base field properties

Every field type shares these properties:

::field-group{title="Field Base Properties"}
  :::field
  ---
  required: true
  name: type
  type: string
  ---
  The field type (e.g. `'text'`, `'select'`, `'media'`).
  :::

  :::field
  ---
  required: true
  name: name
  type: string
  ---
  Property name on the component's props. Must be unique within the definition. A small set of names is [reserved](#reserved-names) and cannot be used.
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

  :::field{name="if" type="SchemaCondition"}
  JSON expression that controls whether the field is shown in Studio. See [Conditional visibility](#conditional-visibility).
  :::
::

## Naming rules

Field `name` values become props on the rendered Vue component. They must be `camelCase` and avoid the names below.

### Reserved names

These names cannot be used as a top-level field `name`:

| `name`             | Why it's reserved                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style`, `class`   | Vue attribute-bindings. Merge into the root element via `inheritAttrs` instead of arriving as props.                                                            |
| `key`, `ref`       | Consumed by Vue's renderer (list-render key, template ref); never reach `props`.                                                                                |
| `is`               | Vue's `<component :is>` prop.                                                                                                                                   |
| `slot`             | Reserved for named-slot routing in Vue Custom Elements. Currently safe; avoid for forward compatibility.                                                        |
| `slots`            | Section-only. Frontend Core injects a `slots` prop carrying slot data from the parent page; a field named `slots` is overwritten.                               |
| `refFor`, `refKey` | Vue 3 compiler internals for template refs inside `v-for`. Vue's source spells these `ref_for` / `ref_key`; the camelCase form is what you'd write as a `name`. |

::warning
Using a reserved name does not produce a TypeScript or build error. The field appears in Studio and the editor can configure it, but the value is silently consumed by Vue and never reaches your component's `props`. The bug only surfaces at runtime when nothing changes despite the configured value.
::

### camelCase only

Dash-case names (`my-field`, `data-foo`) are not supported. Vue normalises dash-case template attributes to `camelCase` for prop lookup, so a prop literally named `'my-field'` cannot be addressed from a parent template and the value never flows through.

### What's allowed

Compound names that contain a reserved token are fine; only the bare names are forbidden:

```ts
// ❌ reserved; value never reaches props
{ type: 'select', name: 'style', options: [...] }

// ✅ compound names are allowed
{ type: 'object', name: 'headingStyle', as: 'style', for: 'heading', schema: [...] }
{ type: 'text', name: 'productKey' }
```

`type`, `data-*`, and `aria-*` are not Vue-special and can be used as `name` values (camelCased: `dataFoo`, `ariaLabel`). Nested fields inside an `object` schema also don't collide with the reserved list, since their `name` becomes a key on the parent's value rather than a direct prop.

For the most common case (a top-level visual variant selector), use `variant`:

```ts
{
  type: 'toggle_button',
  name: 'variant',
  label: 'Style',
  options: [
    { label: 'Default', value: 'default' },
    { label: 'Compact', value: 'compact' },
  ],
}
```

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

## Translatability

Some field types store a separate value per language; others store a single value shared across all languages. When an editor switches the active language in Studio, only translatable fields show a per-language input. The rest stay the same.

By default:

- **Translatable**: `text`, `textarea`, `richtext`, `link`, `media`.
- **Not translatable**: `number`, `checkbox`, `select`, `radio`, `toggle_button`, `icon`, `info`, `color`, `object`, `array`, `query`, `json`.

The defaults match what is typical to localize: copy, the destination of a CTA, and the image in a hero. Layout choices, colors, and entity queries stay shared across languages.

For a `text` or `richtext` field, switching the language in Studio swaps the editor input. For a `media` field, the editor can pick a different image per language (useful when the visual contains text). For a `link` field, the resolved URL can point to a different target per language.

Editors manage available languages and fallbacks in [Cockpit → Translations](/cockpit/features/translations).

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

The field value is a [`Media`](/frontend/api-reference/common-types/media) object containing source URLs, dimensions, and alt text. Render it with the `Media` component from the UI Kit:

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

The field value is a [`Link`](/frontend/api-reference/common-types/link) object. The link type depends on what the editor selected:

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
  :::field
  ---
  required: true
  name: entityType
  type: string
  ---
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
  :::field
  ---
  required: true
  name: entityType
  type: string
  ---
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

The resolved entity set also exposes `availableFilters`, `availableSortings`, the user's current `filter` and `sorting`, and `pagination` state. For reading those and updating the URL when the user picks a filter, sort, or page, see [Consuming Query Fields](/apps/app-development/consuming-query-fields).

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

Some fields can be linked to other fields to group them visually in the Studio sidebar. Decorators do not affect the data model; both the decorator and the target field are passed as separate props.

### Visibility toggles

A `checkbox` with `for` and `as: 'visibility'` pairs a sidebar checkbox with another field. Studio groups the checkbox visually with the target field so editors see a single labelled toggle next to the content they're toggling.

```ts
// The text field
{ type: 'text', name: 'subtitle', label: 'Subtitle' },
// The visibility toggle
{ type: 'checkbox', name: 'subtitleVisible', for: 'subtitle', as: 'visibility', default: true },
```

The toggle does **not** hide the target field from the sidebar. Both fields are always editable in Studio, and both values are passed as props to your component. The component template reads the checkbox value to decide whether to render the target on the frontend:

```vue
<template>
  <p v-if="subtitleVisible">{{ subtitle }}</p>
</template>
```

::tip
Visibility-decorator checkboxes fall back to `true` (visible) instead of the normal `false` for regular checkboxes.
::

::note
A visibility decorator is a **frontend render-time toggle** expressed through a sidebar control. To hide a sidebar control based on other schema values (without affecting frontend rendering), use [Conditional visibility](#conditional-visibility) instead. The two are not alternatives. A field can have both.
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

## Conditional visibility

::since-version{version="0.30.0" packages="@laioutr-core/frontend-core" changelog="frontend"}
::

Both fieldsets and individual fields accept an optional `if` property: a JSON expression that controls whether the fieldset or field is shown in the Studio sidebar. When the expression evaluates to a falsy value, Studio hides the control. The configured value is **not** removed from storage and the prop is still passed to your component at render time. Only the sidebar control disappears.

```ts
{
  type: 'color',
  name: 'customBackground',
  label: 'Background Color',
  // Only show this control when `background === 'custom'`
  if: ['==', ['get', 'background'], 'custom'],
}
```

The same property is valid on a fieldset:

```ts
{
  label: 'Custom colors',
  if: ['==', ['get', 'background'], 'custom'],
  fields: [
    { type: 'color', name: 'customBackground', label: 'Background Color' },
    { type: 'color', name: 'customAccent', label: 'Accent Color' },
  ],
}
```

### What the expression sees

The expression evaluates against an **unwrapped** view of the section or block values, derived from the schema. For most field types this is identical to the prop value your component receives:

- `text`, `textarea`, `richtext`: the active locale's string.
- `checkbox`: a boolean.
- `select`, `radio`, `toggle_button`: the option's string value.
- `number`: a number, or `undefined` when unset.
- `icon`: the icon name string, or `undefined`.
- `color`, `link`, `media`: the same plain object your component receives (`ColorFieldValue`, `Link`, `MediaImage | MediaVideo`).
- `json`: the parsed JSON value or `null`.
- `object`: a plain object whose keys are the nested field names, unwrapped recursively.
- `array`: an array of unwrapped item objects (without the `id` property the component receives).

One case is different from the prop value:

- `query`: the expression sees the **query reference**, not the resolved data. The shape is `{ type: 'entity-set', queryId, link?, limit? }`. At render time, your component instead receives the [Orchestr](/frontend/orchestr/queries)-resolved `ClientEntitySet` or `ClientEntity`. `if` expressions on `query` fields can therefore test whether a query is configured, but cannot inspect entity data.

Missing entries fall back to the per-type runtime fallback documented in [Default values and runtime fallbacks](#default-values-and-runtime-fallbacks). You can rely on stable values in `if` expressions even when a field was added to the schema after the section was placed on a page. The expression language has no `undefined` literal; for the field types whose fallback is `undefined` (`number`, `icon`, `media`, `link`, `query`, `color`), test "is unset" with `['!', ['get', 'x']]` (`!` is JS truthy coercion) or compare against the fallback documented for the field's type.

### Path syntax

Inside a nested `object` or `array` field, scope is the **innermost enclosing object** or array item. Reach further out with prefixes:

| Path                     | Resolves from               |
| ------------------------ | --------------------------- |
| `['get', 'foo']`         | Current scope               |
| `['get', '^foo']`        | Parent scope (one level up) |
| `['get', '^^foo']`       | Grandparent scope           |
| `['get', '/foo']`        | Section or block root       |
| `['get', 'obj.nested']`  | Nested key inside scope     |
| `['get', 'arr[0].name']` | Array indexing inside scope |

### Common patterns

```ts
// Mode-switch dependent: show only when `mode === 'grid'`
if: ['==', ['get', 'mode'], 'grid']

// Boolean checkbox: bare get is enough
if: ['get', 'showProductAmount']

// Negation
if: ['!=', ['get', 'background'], 'none']

// Truthy check; meaningful "is set" only for fields whose unset fallback is falsy
if: ['bool', ['get', 'icon']]

// Set membership; `[[…]]` is the literal-array escape
if: ['in', [['basic', 'compact']], ['get', 'variant']]
```

### Canonical "unset" checks per field type

The expression engine always sees the per-type fallback when a field has no configured value. Use these patterns to test whether a field is unset:

| Field type                                          | Fallback     | Canonical "unset" check                  |
| --------------------------------------------------- | ------------ | ---------------------------------------- |
| `text`, `textarea`, `richtext`                      | `''`         | `['!', ['get', 'x']]`                    |
| `checkbox`                                          | `false`      | `['!', ['get', 'x']]`                    |
| `select`, `radio`, `toggle_button`                  | First option | `['==', ['get', 'x'], '<first option>']` |
| `array`                                             | `[]`         | `['==', ['get', 'x'], [[]]]`             |
| `json`                                              | `null`       | `['==', ['get', 'x'], null]`             |
| `number`, `icon`, `media`, `link`, `query`, `color` | `undefined`  | `['!', ['get', 'x']]`                    |

`['bool', ['get', 'x']]` is the explicit form of "is `x` truthy". At `if`-toplevel it's equivalent to the bare `['get', 'x']` because the engine coerces the result to a boolean either way; the explicit form is useful when you need a true `true`/`false` value inside a larger expression. As a truthy-based "is set" check it answers correctly for every field type except `select`/`radio`/`toggle_button` and `array`, whose fallbacks are truthy.

### Available operators

Studio registers `defaultOperators` plus the `array` and `type` operator bundles from [`@laioutr/expression`](https://www.npmjs.com/package/@laioutr/expression). See the package's [Operators section](https://www.npmjs.com/package/@laioutr/expression#operators) for each operator's aliases, operand counts, and semantics, and the [Evaluation rules](https://www.npmjs.com/package/@laioutr/expression#evaluation-rules) section for how the engine interprets array and literal forms.

Aliases in parentheses.

| Category   | Operators                                                                  |
| ---------- | -------------------------------------------------------------------------- |
| Input      | `get` (`$`), `get?` (`$?`), `?get` (`?$`)                                  |
| Logical    | `and` (`&&`), `or` (`\|\|`), `not` (`!`), `coalesce` (`??`)                |
| Comparison | `eq` (`==`), `ne` (`!=`), `gt` (`>`), `ge` (`>=`), `lt` (`<`), `le` (`<=`) |
| Branching  | `if` (`?`), `cond`                                                         |
| Container  | `len`, `member` (`[]`)                                                     |
| Array      | `in`, `arr-of`, `slice`, `join`, `map`                                     |
| Type       | `bool`, `num`, `str`, `type`                                               |

`bool` (`!!x`) is plain JavaScript truthy coercion. See the note above the per-type fallbacks table for which fields it gives a meaningful "is set" answer for.

::warning
A raw array inside an expression is interpreted by the engine, not used as data: `[]` resolves to `undefined`, `[x]` resolves to `x` (the literal escape), `[op, …]` is an operator call. There is no `undefined` literal. To pass a literal array as data, wrap it in an extra `[…]` (e.g. `[[1, 2, 3]]`) or build it with `arr-of`.
::

::tip
The `if` expression is **fail-open**: any thrown error (typo, missing path, malformed shape) returns `true` and logs a warning to the Studio browser console. A shown-but-broken control is loud, but a silently-hidden control would be invisible. Don't rely on `if` for security since it's a sidebar UX optimization, not a render-time guard.
::

### Relationship to visibility decorators

`if` and the [visibility decorator](#visibility-toggles) answer different questions and are not alternatives:

- **Visibility decorator** (`checkbox` with `as: 'visibility'`) renders a sidebar checkbox grouped with the target field. The component template reads the checkbox value and gates **frontend rendering** of the target's value.
- **`if`** hides a field's sidebar control based on other schema values. It has no effect on stored data or on frontend rendering.

A field can have both. Editors see the control only when `if` is true, and the visibility checkbox separately gates frontend render.
