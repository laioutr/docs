---
title: Section config standard
aliases: []
description: A canonical sidebar layout and field-naming convention for every section and block. Same ordering and the same names everywhere, so editors learn one app and know them all.
seo:
  title: Section config standard | Laioutr
  description: Canonical sidebar panel ordering and field naming for Laioutr sections and blocks.
sitemap:
  loc: /apps/app-development/guides/section-config-standard
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 0.9
  videos: []
  images: []
---

Editors will use your sections next to ones built by other apps. When every section uses a different sidebar order, different group names, and different field labels for the same concept, editors lose the muscle memory they've built up everywhere else. This guide is the convention we follow across every section and block we ship. Follow it in your app and you get that consistency for free.

The standard governs three things: which **top-level panels** appear in the sidebar, the **order of fields within each panel**, and the **canonical name and type** for each common concept (margin, padding, heading, background, etc.). It does not pin default values; pick those per section.

```ts
schema: [
  {
    label: 'Content',
    fields: [
      { type: 'text', name: 'heading', label: 'Heading' },
      { type: 'media', name: 'media', label: 'Image', allowedTypes: ['image'] },
    ],
  },
  {
    label: 'Design',
    defaultOpen: false,
    fields: [
      { type: 'select', name: 'variant', label: 'Style', /* ... */ },
      { type: 'select', name: 'background', label: 'Background', /* ... */ },
      { type: 'select', name: 'margin', label: 'Margin', /* ... */ },
      { type: 'select', name: 'padding', label: 'Padding', /* ... */ },
    ],
  },
],
```

## Top-level panels

Every section and block uses this panel order, top to bottom. Omit a panel if your component has no fields in it. Never reorder.

1. **Section info & settings** is rendered by Studio from `studio.*` metadata (`label`, `description`, `previewSrc`, `tags`). It is not part of `schema`.
2. **Content** holds editorial content authored per instance: texts, media, CTAs, query bindings, slot-specific options.
3. **Design** holds visual appearance. It splits into two sub-groups (see below).
4. **Rules** holds data-binding and visibility conditions.

If you find yourself reaching for a "Behaviour", "Advanced", or "Settings" panel, the fields belong in Content (if editorial) or Design (if visual). Don't introduce a fourth top-level panel.

## Field order inside Content

Content fields follow the natural reading order of the rendered component. When multiple of these apply, use this sequence:

1. `caption`
2. `heading`
3. `subline`
4. `description`
5. `media`
6. `cta`
7. `query`
8. `items` (and any slot-specific arrays)

A section with `heading`, `description`, and `cta` follows that order. A section that only has `media` and `cta` skips the missing ones but keeps `media` above `cta`.

## Field order inside Design

The Design panel splits into Styling and Layout, in that order.

**Styling** (visual character):

1. `variant`
2. `background`
3. `customBackground` (only when `background` exposes a `custom` variant)
4. `color`
5. `overlay`
6. `captionStyle` (attached to caption fields via `as: 'style'`)

**Layout** (geometry and responsive overrides):

1. `margin`
2. `padding`
3. `columns`
4. `rows`
5. `mobile`
6. `desktop`
7. `alignment`

If your component does not yet need a full split, group everything under one Design fieldset that still respects the relative order of these fields.

## Canonical names and types

When your section configures one of the concepts below, use exactly the `name` and `type` from these tables. The labels editors see in Studio are up to you; the schema `name` is the contract.

### Content

| Concept             | `name`        | `type`                   |
| ------------------- | ------------- | ------------------------ |
| Caption             | `caption`     | `text`                   |
| Heading             | `heading`     | `text`                   |
| Subline             | `subline`     | `text`                   |
| Description         | `description` | `textarea` or `richtext` |
| Media               | `media`       | `media`                  |
| CTA button          | `cta`         | `object`                 |
| Dynamic data source | `query`       | `query`                  |
| Link                | `link`        | `link`                   |

### Design → Styling

| Concept           | `name`             | `type`                      |
| ----------------- | ------------------ | --------------------------- |
| Style variant     | `variant`          | `toggle_button` or `select` |
| Background preset | `background`       | `select`                    |
| Custom background | `customBackground` | `color`                     |
| Foreground color  | `color`            | `color`                     |
| Overlay           | `overlay`          | `object`                    |
| Caption styling   | `captionStyle`     | `object` (`as: 'style'`)    |

The bare `style` field name is reserved by Vue (see [Forbidden field names](/apps/app-development/schema-fields#forbidden-field-names)). Use `variant` for the component's primary styling selector, or a compound name like `captionStyle` for nested style objects.

### Design → Layout

| Concept           | `name`      | `type`               | Options                   |
| ----------------- | ----------- | -------------------- | ------------------------- |
| Margin            | `margin`    | `select`             | `none`, `s`, `m`, `l`     |
| Padding           | `padding`   | `select`             | `none`, `s`, `m`, `l`     |
| Columns           | `columns`   | `number` or `select` |                           |
| Rows              | `rows`      | `number` or `select` |                           |
| Mobile overrides  | `mobile`    | `object`             |                           |
| Desktop overrides | `desktop`   | `object`             |                           |
| Alignment (1D)    | `alignment` | `toggle_button`      | `left`, `center`, `right` |
| Alignment (2D)    | `alignment` | `content_alignment`  | 3x3 grid                  |

## Why pin the names

Editors swap between sections from different apps inside the same project. When every section calls its top padding `padding`, every margin `margin`, and every heading `heading`, the sidebar feels like one product. When one section calls it `blockMargin` and another `innerSpacingTop`, every move is a small unlearning.

The same applies to your downstream code. A shared field factory (see [Shared field factories](/apps/app-development/guides/shared-field-factories)) only works when every section accepts the same field name. `marginField()` cannot produce both `margin` and `blockMargin` without losing literal-type benefits in `definitionToProps`.

## When a name does not fit

A few legitimate reasons to deviate:

- **Multiple instances of the same concept.** When a section has both a `heading` and a `subline` that each carry their own style object, qualify with a prefix: `headingStyle`, `sublineStyle`. The base name stays canonical.
- **Decorators.** Visibility toggles use `<fieldName>Visible` with `as: 'visibility'`. Style attachments use `<fieldName>Style` with `as: 'style'`. These compound names are part of the standard.

For anything else, before introducing a new name, check the table above and consider whether your concept is one of the canonical ones with a different label.

## Related

- [Section Definitions](/apps/app-development/section-definitions) for the `defineSection` reference.
- [Schema Fields](/apps/app-development/schema-fields) for the catalog of field types and their properties.
- [Shared field factories](/apps/app-development/guides/shared-field-factories) for promoting these canonical fields into reusable helpers.
