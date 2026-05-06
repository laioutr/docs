# JSON Schema test suite — design

**Date**: 2026-05-06
**Status**: Validated, ready for implementation plan

## Goal

Lock down the current behavior of the JSON Schema rendering pipeline before introducing any further keyword support, refactor, or architectural changes. The recent commit `79bed2c` shipped four edge-case fixes that came from manually noticing broken pages — exactly the regression surface tests would have caught.

## Scope

**In scope** (v1): unit tests for five pure-function modules under `app/lib/json-schema/`:

- `introspection.ts`
- `resolveSchema.ts`
- `nullOrEmpty.ts`
- `component-meta-adapter.ts`
- `exampleFromSchema.ts`

**Out of scope** (deliberately):

- Vue component snapshot tests (`JsonSchemaFields.vue`, `JsonSchemaPropTable.vue`, `JsonSchemaVariantList.vue`, `JsonSchemaFieldRow.vue`). Templates have been stable; recent regressions were all in pure-function logic.
- CI integration. Will be a follow-up.
- Coverage reporting.
- E2E tests against rendered docs pages.
- Fixes for the gap items themselves (schema booleans, `prefixItems`, `if/then/else`, `not`, `nullable`, `additionalProperties: <schema>` with sibling properties, `examples`, `exclusiveMinimum/Maximum` as boolean, multi-type arrays). Those will be tracked as `.todo` placeholders.

## Decisions

### Framework: Vitest

Matches the established Laioutr convention (`packages/ui`, `packages/ui-kit`, `packages/orchestr`, `packages/logger`, `packages/app-pwa` all use Vitest). No DOM environment needed (`node` default). No `@vue/test-utils`. No `--typecheck` (regular Nuxt build covers this).

### Layout: colocated tests, shared fixtures

```
app/lib/json-schema/
  introspection.ts
  introspection.test.ts
  resolveSchema.ts
  resolveSchema.test.ts
  nullOrEmpty.ts
  nullOrEmpty.test.ts
  component-meta-adapter.ts
  component-meta-adapter.test.ts
  exampleFromSchema.ts
  exampleFromSchema.test.ts
  __fixtures__/
    schemas-shared.ts   // shapes both sources produce
    schemas-zod.ts      // canonical-types/reflection style ($ref+$defs, allOf wraps, etc.)
    schemas-vue.ts      // adapter outputs (structural ids, opaque framework types, flat)
    vue-meta.ts         // vue-component-meta PropertyMeta inputs (the adapter's input side)
    index.ts            // re-exports
```

Tests live next to their source modules. Fixtures are shared across all test files via the `__fixtures__/` directory, with named exports per shape. The fixture catalog also serves as living documentation of what shapes we support.

### Two schema sources, three fixture groups

The renderer is fed by two distinct sources:

| Source                                      | Components                                                                                              | Pipeline                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `vue-component-meta`                        | `ComponentProps.vue`, `ComponentEmits.vue`, `ComponentSlots.vue`                                        | `PropertyMeta` → `componentPropsToJsonSchema` → `DocsJSONSchema` |
| `@laioutr-core/canonical-types/reflection`  | `ActionMeta.vue`, `EntityComponentMeta.vue`, `QueryMeta.vue`, `PageTypeMeta.vue`, `ErrorMeta.vue`       | zod → JSON Schema directly                                    |

Their characteristic shapes diverge:

| Pattern                                | Vue adapter                          | Canonical-types (zod)        |
| -------------------------------------- | ------------------------------------ | ---------------------------- |
| `$ref` + `$defs`                       | never (fully expanded)               | very common                  |
| `allOf` single-element wrap            | never                                | very common                  |
| `id` (custom field, not `$id`)         | always set, sometimes structural     | absent                       |
| Opaque `{ id, title }` for unknown     | yes (`Component`, function sigs)     | never                        |
| `anyOf` of full objects with own ids   | rare                                 | common                       |
| Recursive `$ref` cycles                | impossible                           | possible (tree-shaped types) |
| `string & {}` autocomplete trick       | yes                                  | never                        |

The fixture catalog reflects this split: `schemas-shared.ts` for the overlap, `schemas-zod.ts` for canonical-types-specific shapes, `schemas-vue.ts` for adapter-specific shapes. `vue-meta.ts` holds the input side of the adapter pipeline so `component-meta-adapter.test.ts` can assert the full transformation.

### Real-schema seeding

`schemas-zod.ts` is seeded by pulling 3-4 actual schemas from `@laioutr-core/canonical-types/reflection` (e.g. `Product` entity, an action input, a recursive page-type) and committing them as JSON snapshots. This anchors the fixtures in real shipped shapes rather than synthetic ones, catching the "I forgot zod emits this weird wrapper" class of bug.

### Style: explicit assertions, no snapshots

Outputs of these modules are small structured values (strings, arrays, schemas). Explicit assertions read better in PR diffs and don't drift silently. Snapshots are reserved for HTML/large serialized blobs, which is out of scope.

### Breadth: comprehensive (~100 tests) + ~10 `.todo` placeholders

The `.todo` entries do double duty: they document known limitations and make adding support later mechanical (flip `.todo` → real test → watch fail → fix).

## Test coverage breakdown

### `resolveSchema.test.ts` (~10 tests)

- `withDefinitionIds` stamps id on `$defs` and `definitions` entries
- `withDefinitionIds` skips `__schema\d+$` synthetic names
- `withDefinitionIds` doesn't mutate input
- `dereferenceSync` resolves single-level `$ref`
- `dereferenceSync` resolves nested `$ref`
- `dereferenceSync` doesn't loop on cyclic refs
- `resolveSchema` unwraps single-element `allOf` recursively until none
- `resolveSchema` preserves multi-element `allOf`
- `resolveSchema` honors `dereferenced: true`

### `nullOrEmpty.test.ts` (~6 tests)

- True for missing `type`, `type: 'null'`, empty `{}` object
- False for any union (`anyOf`/`oneOf`/`allOf`), object with props, primitive types

### `introspection.test.ts` (~50 tests)

- `getTypeName` json + javascript modes — every branch (const, enum, allOf, type-array, anyOf/oneOf, object, array, tuple, discriminated tuple, format mapping, integer→number, fallback to id/title)
- `getConstraints` per constraint type, exclusive bounds, mode-skipping for mapped formats
- `isExpandableLiteralUnion` — clean alias triggers, joined-form needs ≥4 consts, primitive-only rejects, missing id rejects, `boolean` excluded
- `summarizeConstValues` — budget arithmetic, "first always shown", escape hatches included
- `getExpandableVariants` — direct object, tuple-with-discriminant, anyOf of objects (with discriminant enrichment), array-of-union, literal-union synthetic; WeakMap cache hit on second call
- `getTypeSummary` — outer-id splice, structural-id detection, array variant labelling

### `component-meta-adapter.test.ts` (~25 tests)

- `parseDefault` for each branch (string, bool, number, JSON object/array, fallback)
- `parseInlineObjectType` — flat, nested, optional members, malformed returns undefined
- `walkSchema` — every kind (object, array single, array tuple, enum single-collapse, enum multi → anyOf, event)
- Edge cases: `string & {}` normalization, opaque framework type list, trailing `[]` strip, `| undefined` strip, undefined-branch drop
- Full `componentPropsToJsonSchema` against fixture `vue-meta.ts` inputs

### `exampleFromSchema.test.ts` (~10 tests)

- Honors `default`; uses first enum/const value; recurses into objects/arrays; depth cap respected; name-heuristic pattern matches

### `.todo` block at the bottom of `introspection.test.ts`

```ts
test.todo('schema booleans: properties with `true`/`false` value');
test.todo('multi-type: type: ["string", "null"] renders both branches');
test.todo('prefixItems (Draft 2020-12 tuples)');
test.todo('if/then/else conditional schemas');
test.todo('not');
test.todo('nullable: true (OpenAPI 3.0)');
test.todo('additionalProperties as schema with sibling properties');
test.todo('examples array');
test.todo('exclusiveMinimum/Maximum as boolean (Draft 4)');
test.todo('cycle protection in renderer recursion');
```

## Implementation order

Each step is independently committable:

1. **Vitest scaffolding** — add devDeps, `vitest.config.ts`, `pnpm test` scripts. Smoke import from `nullOrEmpty.ts` to prove toolchain.
2. **`nullOrEmpty.test.ts`** — smallest module, closes the loop end-to-end.
3. **`__fixtures__/schemas-shared.ts`** — primitives, objects, arrays, annotations.
4. **`resolveSchema.test.ts`** + **`__fixtures__/schemas-zod.ts`** (seeded from real `@laioutr-core/canonical-types/reflection` exports).
5. **`introspection.test.ts`** — split commits per concept group (getTypeName, getConstraints, isExpandableLiteralUnion + summarizeConstValues, getExpandableVariants + getTypeSummary).
6. **`__fixtures__/vue-meta.ts`** + **`schemas-vue.ts`** + **`component-meta-adapter.test.ts`** — input/output sides land together.
7. **`exampleFromSchema.test.ts`**.
8. **`.todo` placeholder block** in `introspection.test.ts`.

## Non-goals (explicit list, to avoid scope creep)

- Vue component tests
- CI integration
- Coverage reporting
- Pre-commit wiring
- E2E tests
- Implementing fixes for any of the `.todo` items
