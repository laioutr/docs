# JSON Schema `classify()` refactor — design

**Date**: 2026-05-06
**Status**: Validated, ready for implementation plan

## Goal

Eliminate the recurring "what kind of schema is this?" dispatch logic that is currently open-coded across four sites in `app/lib/json-schema/` and `app/components/JsonSchemaFields.vue`. Each site has its own nested if/else on `s.type` / `anyOf` / `allOf` / `Array.isArray(type)`, and adding any new keyword (the ten `.todo` items in `introspection.test.ts` — schema booleans, `prefixItems`, `if/then/else`, etc.) means hunting down all four sites.

Introduce a single `classify(s: JSONSchema): SchemaKind` primitive that returns a discriminated union, then refactor the four dispatch sites to switch on `kind.kind`.

## Non-goal

This refactor preserves behavior exactly. The 140-test introspection suite (commit `f27f766`) is the safety net; it must stay green. None of the ten `.todo` keywords are implemented here — they remain `.todo`, but adding them later becomes a localized change (one new kind + one new branch in each dispatcher) instead of a four-site hunt.

## Decisions

### Option A: structural classify, display heuristics on top

`classify` returns kinds whenever the *structure* matches. Three rules currently baked into `isExpandableLiteralUnion` are display policy, not schema structure:

- "≥4 consts before joined-form ids count as expandable" (introspection.ts:207)
- "clean alias name always counts" (introspection.ts:205)
- "primitive-only ids excluded" (introspection.ts:203)

These stay as helper functions in `introspection.ts`, taking the kind (or schema) as input. The same applies to `summarizeConstValues`'s 50-char budget arithmetic and `getTypeSummary`'s structural-id `{` check — all display, not structure.

**Why not display-aware kinds:** `getTypeName` and `getTypeSummary` care about different display rules. If classify bakes one in, the other has to fight it. Pure structural classify also makes future non-rendering callers (e.g. an LLM-text generator) trivial.

### Option X: classify normalizes its own input + returns resolved sub-schemas

Caller passes any schema. classify calls `resolveSchema(input, { dereferenced: true })` once at the top, and any sub-schemas it returns (variants, items, valueSchema, tagSchema, parts) are also resolved. Caller never has to remember to resolve before recursing.

**Why:** matches existing helper behavior (`getArrayItems`, `getUnionVariants` already resolve internally). Zero behavior change, just consolidated. resolveSchema is idempotent on already-resolved input, so the perf cost is not real for this domain. If profiling later shows it matters, splitting into `classify` (pure) + `classifyResolved` is non-breaking.

### `SchemaKind` shape (12 kinds)

```ts
export type SchemaKind =
  | { kind: 'empty'; schema: JSONSchema }
  | { kind: 'primitive'; type: 'string' | 'number' | 'integer' | 'boolean' | 'null';
      id?: string; format?: string; schema: JSONSchema }
  | { kind: 'const'; value: unknown; id?: string; schema: JSONSchema }
  | { kind: 'enum'; values: unknown[]; id?: string; schema: JSONSchema }
  | { kind: 'literal-union'; consts: unknown[]; escapeHatches: string[];
      id?: string; schema: JSONSchema }
  | { kind: 'union'; variants: JSONSchema[]; id?: string; schema: JSONSchema }
  | { kind: 'intersection'; parts: JSONSchema[]; schema: JSONSchema }
  | { kind: 'object'; properties: Record<string, JSONSchema>; required: string[];
      id?: string; schema: JSONSchema }
  | { kind: 'record'; valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'array'; items: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'tuple'; items: JSONSchema[]; minItems: number; id?: string; schema: JSONSchema }
  | { kind: 'discriminated-tuple'; tag: unknown; tagSchema: JSONSchema;
      valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'opaque'; name: string; schema: JSONSchema }
  | { kind: 'unknown'; schema: JSONSchema };
```

Every kind carries `schema: JSONSchema` so callers can reach `getConstraints`, `getFieldDescriptionHtml`, `s.deprecated`, etc. without threading the original through separately.

#### Rationale per kind

- **`empty`** absorbs `nullOrEmpty(s)` so the Vue template's first branch maps to a kind.
- **`const`, `enum`, `literal-union`** are three structurally distinct shapes (`s.const`, `s.enum: [...]`, `anyOf` of consts). `getTypeName` checks them in that order today; merging would require the renderer to introspect again.
- **`record`** for `type: 'object'` with no `properties` and `additionalProperties: <schema>` — the `Record<string, T>` rendering case in `getTypeName`.
- **`opaque`** for the no-type-but-has-id/title fall-through — adapter framework types like `Component`, function signatures, structural inline objects.
- **`literal-union`** matches structurally (anyOf of consts ± primitive escape hatches, ≥1 const). The ≥4-threshold and clean-alias check live in `isExpandableLiteralUnion` per Option A.

#### Deliberately omitted

Covered by `unknown` for now; each gets its own kind when the corresponding `.todo` is implemented:

- `multi-type` (`type: ['string', 'null']`)
- schema booleans (`true` / `false`)
- `if/then/else`
- `not`
- `nullable: true` (OpenAPI 3.0)

## Dispatch order

First match wins. Mirrors the current order in `getTypeName` so behavior is preserved exactly:

1. `s.const !== undefined` → `const`
2. `s.enum` → `enum`
3. `s.allOf?.length` (multi-element after resolveSchema's unwrap) → `intersection`
4. `getUnionVariants(s)` (anyOf/oneOf, after resolving each variant):
   - all variants are `const` or isolated primitive, ≥1 const → `literal-union`
   - else → `union`
5. `s.type === 'object'`:
   - has `properties` (non-empty) → `object`
   - else `additionalProperties` is a schema → `record`
   - else → `empty` (object with no shape)
6. `s.type === 'array'`:
   - `Array.isArray(s.items)`:
     - 2-tuple with const head → `discriminated-tuple`
     - else → `tuple`
   - else → `array` (resolves `items`)
7. `s.type === 'null'` → `empty`
8. `s.type` is a primitive name → `primitive`
9. No `s.type`:
   - has `id` → `opaque`
   - has `title` → `opaque`
   - bare `{}` (no other keys) → `empty`
10. Fallback → `unknown`

> Note: an earlier draft listed `nullOrEmpty(s)` as the first dispatch step, but `nullOrEmpty` returns `true` for any schema lacking a `type` regardless of other keys — that would have misclassified `{ const: 'x' }`, `{ enum: [...] }`, opaque schemas, and intersections as `empty`. The narrow empty checks above (object with no shape, `type: 'null'`, bare `{}`) preserve the semantic intent without the over-broad capture.

## File layout

Minimum-churn approach. `introspection.ts`'s public API stays identical — only its internals get rewritten. No call sites outside `app/lib/json-schema/` need touching.

```
app/lib/json-schema/
  classify.ts              # NEW: SchemaKind types + classify() + private structural predicates
  classify.test.ts         # NEW: ~25 tests, one fixture-per-kind minimum
  introspection.ts         # public API unchanged; internals dispatch via classify
  introspection.test.ts    # existing 140 + 13 todo tests, all stay green
  ...
```

`classify.ts` exports:

- `SchemaKind` (the discriminated union)
- `classify(s: JSONSchema): SchemaKind`

`introspection.ts` keeps all current exports: `getTypeName`, `getTypeSummary`, `getConstraints`, `getExpandableVariants`, `isExpandableLiteralUnion`, `getConstValues`, `getEscapeHatchTypes`, `summarizeConstValues`, `summarizeProps`, `isFieldDescriptionFromObject`, `getFieldDescriptionHtml`, `getSchemaId`, `getSchemaName`, `isObjectWithProps`, `getArrayItems`, `getUnionVariants`. Display heuristics stay co-located with the dispatchers that use them.

**Why no `display.ts` file:** only two heuristics are display-level (`isExpandableLiteralUnion` threshold, `summarizeConstValues` budget). One file for two helpers is overkill, and Vue template imports stay on the same path. If display logic grows when `.todo` items land, splitting later is a no-op move.

## Refactoring strategy

Each step verified by `pnpm test` (must stay at 140 + new + 13 todo). Single commit at the end on `main`, no worktree.

1. **Add `classify.ts` + `classify.test.ts`.** No callers yet. Verifies the abstraction in isolation.
2. **Refactor `getTypeName`** to `switch (classify(s).kind)`. Each case does the JS/json-mode formatting.
3. **Refactor `getExpandableVariants`** (and its private helpers `variantFromSchema`, `tupleVariantToParts`, `computeExpandableVariants`) to dispatch on kind. `WeakMap` cache stays intact.
4. **Refactor `getTypeSummary`** to dispatch on kind. The `outerId`/`innerId` splice logic stays put — operates on labels and ids, not schema structure.
5. **Refactor `JsonSchemaFields.vue`.** Add `const kind = computed(() => classify(schema.value))`. Replace `nullOrEmpty(schema)`, `schema.type === 'object'`, `schema.type === 'array'` checks with `kind.kind === ...`. Per-field `getExpandableVariants(field)` calls inside the loop stay — right level of abstraction.
6. **Sweep** for now-unused private helpers; delete them. Keep exports used by `JsonSchemaFields.vue` and `component-meta-adapter.ts`.

## Test plan for `classify.test.ts`

Approximately 25 tests, reusing existing fixtures in `__fixtures__/`.

### Per-kind happy path (~14 tests)

Each kind matched against a representative fixture. Asserts `.kind` plus the kind-specific payload.

### Dispatch-order edges (~8 tests)

- `{ const: 'x', type: 'string' }` → `const`
- `{ enum: ['a'], const: 'a' }` → `const`
- `{ allOf: [{ type: 'string' }] }` → `primitive` (single-element allOf unwrapped)
- `{ allOf: [{ id: 'A' }, { id: 'B' }] }` → `intersection`
- `{ anyOf: [{ const: 'a' }, { const: 'b' }] }` → `literal-union`, `escapeHatches: []`
- `{ anyOf: [{ const: 'a' }, { type: 'string' }] }` → `literal-union`, `escapeHatches: ['string']`
- `{ anyOf: [{ type: 'string' }, { type: 'number' }] }` → `union`
- `{ type: 'object' }` → `unknown`
- `{ type: 'object', additionalProperties: { type: 'string' } }` → `record`
- `{ type: 'array', items: [{ const: 'CTA' }, { type: 'object', properties: {...} }] }` → `discriminated-tuple`
- `{ type: 'array', items: [{ type: 'string' }, { type: 'number' }] }` → `tuple`
- `{ id: 'Component', title: 'Component' }` (no type) → `opaque`

### Resolution (~4 tests)

- `$ref` is dereferenced before classification
- Single-element `allOf` is unwrapped before classification
- Cyclic `$ref` does not loop
- Sub-schemas in `kind.variants` / `kind.items` / `kind.valueSchema` are also resolved

## Acceptance gate

Before commit:

1. `pnpm test` reports 140 + 25 (or more) passed, 13 todo, zero failures
2. `pnpm tsc --noEmit -p tsconfig.vitest.json` clean
3. `pnpm dev` smoke check on a real docs page (entity reference or UI component page) — verify identical render. The renderer changes are mechanical but the template touches HTML, so eyeballs are warranted.

## Out of scope

- Vue component snapshot tests (still out of scope per the v1 test design)
- Implementing any of the ten `.todo` keywords
- CI integration, coverage reporting, pre-commit wiring
- Splitting heuristics into a separate `display.ts` file (deferred until they grow)
