---
title: Shared field factories
aliases: []
description: When the same field shape appears in three or more sections, promote it to a factory function. The trick is keeping the literal types intact, so definitionToProps still produces narrow prop types.
seo:
  title: Shared field factories
  description: A pattern for reusing schema fields across sections and blocks without losing literal types.
sitemap:
  loc: /apps/app-development/guides/shared-field-factories
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 0.9
  videos: []
  images: []
---

Your app has six sections and four of them have the same margin field: a select with `none`, `s`, `m`, `l`. The fifth section adds it. The sixth section is about to. You're now maintaining the same option list in six places, and the option labels drift apart by the second copy.

Promote the field to a factory. A tiny one-liner like this:

```ts [shared-fields/margin.ts]
import type { StudioFieldDefinition } from '@laioutr-core/core-types/fields';

export const marginField = {
  type: 'select',
  name: 'margin',
  label: 'Margin',
  default: 'none',
  options: [
    { label: 'None', value: 'none' },
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' },
  ],
} satisfies StudioFieldDefinition;
```

Then reuse it:

```ts [sections/SectionHero.vue]
schema: [
  {
    label: 'Design',
    fields: [
      marginField,
      // ...
    ],
  },
],
```

That works for the simple case. The rest of this guide is about the cases where the simple case fails: when TypeScript silently widens your literals and `definitionToProps` stops producing narrow types.

## The widening problem

The reason factories are non-trivial is that schema field arrays in `defineSection` are typed as a union of every possible field type. Each member carries `name: string`, `type: string`, `value: string`. When TypeScript resolves your factory call inside that array, it lines up your return against the union and **widens** literals to plain `string` along the way.

The result: `definitionToProps` derives prop types from `options[i].value`. If your `value` widens to `string`, the prop type widens to `string`. You lose the `'none' | 's' | 'm' | 'l'` discrimination that you wanted.

The fix is to write factories whose return types are derived **structurally** from the input, not inferred as independent generic parameters with defaults.

## Pattern 1: static field, no generics

When the field shape is fixed (margin, padding, fixed enum), you don't need generics. Use `satisfies` to keep literal types intact:

```ts [shared-fields/padding.ts]
import type { StudioFieldDefinition } from '@laioutr-core/core-types/fields';

export const paddingField = {
  type: 'select',
  name: 'padding',
  label: 'Padding',
  default: 'none',
  options: [
    { label: 'None', value: 'none' },
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' },
  ],
} satisfies StudioFieldDefinition;
```

`satisfies` checks that the literal matches `StudioFieldDefinition` without changing the inferred type of the object. The values stay as `'none' | 's' | 'm' | 'l'`, not `string`.

Do not annotate the type directly:

```ts
// Don't: this widens every literal to string
export const paddingField: StudioFieldDefinition = { /* ... */ };
```

## Pattern 2: reusable option lists

When you want to share an options array (not a whole field), wrap it in a helper that enforces the non-empty tuple shape while preserving literals:

```ts [shared-fields/defineSelectOptions.ts]
import type { FieldDefinitionSelectOption } from '@laioutr-core/core-types/fields';

export const defineSelectOptions = <
  const T extends readonly [FieldDefinitionSelectOption, ...FieldDefinitionSelectOption[]],
>(
  options: T,
): [...T] => [...options];
```

The `const T` modifier tells TypeScript to keep the literal types. The function returns a fresh array, so callers can assign it directly to a field's `options` and mutations cannot corrupt the shared export.

```ts [shared-fields/buttonVariant.ts]
import { defineSelectOptions } from './defineSelectOptions';

export const buttonVariantOptions = defineSelectOptions([
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Tertiary', value: 'tertiary' },
]);
```

Then use it in any field:

```ts
{
  type: 'select',
  name: 'variant',
  label: 'Variant',
  options: buttonVariantOptions,
}
```

The prop type for `variant` will be `'primary' | 'secondary' | 'tertiary'`, not `string`.

## Pattern 3: dynamic factory with computed name

Sometimes the field's `name` is derived from an argument. A visibility checkbox toggles another field; its name should be `${target}Visible`:

```ts
visibilityField({ for: 'heading' })
// => { type: 'checkbox', as: 'visibility', for: 'heading', name: 'headingVisible' }
```

The obvious implementation has two generic parameters: `ForKey extends string` and `Name extends string = \`${ForKey}Visible\``. **This does not work.** Inside a` fields: [...]`array, contextual typing widens`Name`to`string`, and the resulting field's` name`property loses its literal type.`definitionToProps\` then matches the visibility checkbox against fields it shouldn't, and prop types break in surprising ways.

The fix: collapse the generics into a single `const Opts` parameter and derive the resolved name **structurally** from `Opts`:

```ts [shared-fields/visibility.ts]
export const visibilityField = <
  const Opts extends {
    for: string;
    name?: string;
    label?: string;
    default?: boolean;
  },
>(
  opts: Opts,
) => {
  type ResolvedName = Opts extends { name: string }
    ? Opts['name']
    : `${Opts['for']}Visible`;

  const field: {
    type: 'checkbox';
    as: 'visibility';
    for: Opts['for'];
    name: ResolvedName;
    label?: string;
    default?: boolean;
  } = {
    type: 'checkbox',
    as: 'visibility',
    for: opts.for,
    name: (opts.name ?? `${opts.for}Visible`) as ResolvedName,
  };

  if (opts.label !== undefined) field.label = opts.label;
  if (opts.default !== undefined) field.default = opts.default;
  return field;
};
```

The key is `type ResolvedName = Opts extends { name: string } ? Opts['name'] : \`${Opts ['for'] }Visible\``. The resolved name is computed from` Opts\`, not declared as a separate inferable generic. Contextual typing cannot widen what it cannot see.

Use it inside a schema:

```ts
schema: [
  {
    label: 'Content',
    fields: [
      { type: 'text', name: 'heading', label: 'Heading' },
      visibilityField({ for: 'heading' }),
      // ResolvedName is 'headingVisible' (literal)
    ],
  },
],
```

## When to write a factory

A simple test: count the copies. One section: keep it inline. Two: probably still inline (the duplication is cheap, and the two sections might diverge). Three or more: promote to a factory.

A second test: are the option values stable, or do you find yourself touching them in every section? Stable values that you copy unchanged are perfect factory candidates. Per-section tweaks suggest the field is component-specific, not shared.

## Detecting widening regressions

If `definitionToProps` suddenly produces a prop type like `string | boolean` (or `string | number`) where you expected a single primitive, suspect a widened factory. The fastest check is to inspect the schema type directly:

```ts
type Check = typeof definition['schema'][number]['fields'][number];
//   ^? Inspect this in your editor
```

If a checkbox or select inside the array shows `name: string` instead of the literal you expect, a factory is widening. Switch it to the `const Opts` pattern.

## Related

- [Section config standard](/apps/app-development/guides/section-config-standard) for the canonical names and types that good candidates for factories follow.
- [Schema Fields](/apps/app-development/schema-fields) for the field types and properties these factories produce.
