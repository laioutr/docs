# JSON Schema `classify()` refactor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Introduce a single `classify(s: JSONSchema): SchemaKind` primitive in `app/lib/json-schema/classify.ts` and refactor the four open-coded dispatch sites (`getTypeName`, `getTypeSummary`, `getExpandableVariants`, `JsonSchemaFields.vue` template) to switch on `kind.kind`.

**Architecture:** Pure structural classification (12 kinds covering every shape the renderer currently handles). `classify` normalizes its own input via `resolveSchema` and returns sub-schemas (variants, items, valueSchema, tagSchema, parts) that are also resolved, so callers can recurse without re-resolving. Display heuristics (`isExpandableLiteralUnion` ≥4-threshold, `summarizeConstValues` budget, `getTypeSummary` structural-id check) stay in `introspection.ts` and operate on the kind, per the design's Option A. `introspection.ts`'s public API is unchanged.

**Tech Stack:** TypeScript, Vitest, Vue 3 (SFC template). All work happens directly on `main` (no worktree). Single commit at the end.

**Design doc:** `docs/plans/2026-05-06-classify-refactor-design.md`

**Safety net:** existing 140 passing + 13 todo tests in `introspection.test.ts`, `nullOrEmpty.test.ts`, `resolveSchema.test.ts`, `component-meta-adapter.test.ts`, `exampleFromSchema.test.ts`. They must stay green at every step.

---

## Task 1: Write `classify.test.ts` (TDD — all failing)

**Files:**
- Create: `app/lib/json-schema/classify.test.ts`

**Reuses:** Existing fixtures from `app/lib/json-schema/__fixtures__/`. No new fixture file needed.

**Step 1: Create the test file with imports + full test bodies**

```ts
import { describe, it, expect } from 'vitest';
import { classify, type SchemaKind } from './classify';
import {
  PRIM_STRING,
  PRIM_INTEGER,
  PRIM_NUMBER,
  PRIM_BOOLEAN,
  CONST_STRING,
  CONST_NUMBER,
  ENUM_STRINGS,
  OBJECT_SIMPLE,
  ARRAY_OF_STRING,
  TUPLE_THREE,
  TUPLE_DISCRIMINATED,
  STRING_DATE_TIME,
  ALL_OF_INTERSECTION,
  ALL_OF_SINGLE_WRAP,
  ANY_OF_OBJECTS,
  LITERAL_UNION_NAMED,
  LITERAL_UNION_LONG_WITH_ESCAPE,
  LITERAL_UNION_JOINED_TOO_SHORT,
  REF_TO_DEFS,
  RECURSIVE_REF,
  VUE_OPAQUE_COMPONENT,
} from './__fixtures__';

describe('classify — happy path per kind', () => {
  it('empty: bare {} → empty', () => {
    const k = classify({});
    expect(k.kind).toBe('empty');
  });

  it('empty: { type: "null" } → empty', () => {
    const k = classify({ type: 'null' });
    expect(k.kind).toBe('empty');
  });

  it('primitive: { type: "string" } → primitive', () => {
    const k = classify(PRIM_STRING);
    expect(k.kind).toBe('primitive');
    if (k.kind === 'primitive') expect(k.type).toBe('string');
  });

  it('primitive: integer keeps its type (mode-agnostic)', () => {
    const k = classify(PRIM_INTEGER);
    expect(k.kind).toBe('primitive');
    if (k.kind === 'primitive') expect(k.type).toBe('integer');
  });

  it('primitive: format is exposed', () => {
    const k = classify(STRING_DATE_TIME);
    expect(k.kind).toBe('primitive');
    if (k.kind === 'primitive') expect(k.format).toBe('date-time');
  });

  it('const: { const: "fixed" } → const with value', () => {
    const k = classify(CONST_STRING);
    expect(k.kind).toBe('const');
    if (k.kind === 'const') expect(k.value).toBe('fixed');
  });

  it('const: { const: 42 } → const with numeric value', () => {
    const k = classify(CONST_NUMBER);
    expect(k.kind).toBe('const');
    if (k.kind === 'const') expect(k.value).toBe(42);
  });

  it('enum: { enum: ["a", "b", "c"] } → enum', () => {
    const k = classify(ENUM_STRINGS);
    expect(k.kind).toBe('enum');
    if (k.kind === 'enum') expect(k.values).toEqual(['a', 'b', 'c']);
  });

  it('intersection: multi-element allOf → intersection with parts', () => {
    const k = classify(ALL_OF_INTERSECTION);
    expect(k.kind).toBe('intersection');
    if (k.kind === 'intersection') expect(k.parts).toHaveLength(2);
  });

  it('literal-union: anyOf of consts only → literal-union, no escape hatches', () => {
    const k = classify(LITERAL_UNION_NAMED);
    expect(k.kind).toBe('literal-union');
    if (k.kind === 'literal-union') {
      expect(k.consts).toEqual(['icon', 'text', 'none']);
      expect(k.escapeHatches).toEqual([]);
      expect(k.id).toBe('FallbackVariant');
    }
  });

  it('literal-union: anyOf of consts + primitive → literal-union with escapeHatches', () => {
    const k = classify(LITERAL_UNION_LONG_WITH_ESCAPE);
    expect(k.kind).toBe('literal-union');
    if (k.kind === 'literal-union') {
      expect(k.consts).toEqual(['arrow', 'check', 'close', 'menu', 'home']);
      expect(k.escapeHatches).toEqual(['string']);
      expect(k.id).toBe('IconName');
    }
  });

  it('literal-union: short joined-form union still classifies structurally (display gates expansion)', () => {
    const k = classify(LITERAL_UNION_JOINED_TOO_SHORT);
    expect(k.kind).toBe('literal-union');
    if (k.kind === 'literal-union') expect(k.consts).toEqual(['a', 'b']);
  });

  it('union: anyOf of full objects → union with variants', () => {
    const k = classify(ANY_OF_OBJECTS);
    expect(k.kind).toBe('union');
    if (k.kind === 'union') expect(k.variants).toHaveLength(2);
  });

  it('object: { type: "object", properties: {...} } → object', () => {
    const k = classify(OBJECT_SIMPLE);
    expect(k.kind).toBe('object');
    if (k.kind === 'object') {
      expect(Object.keys(k.properties)).toEqual(['name', 'age']);
      expect(k.required).toEqual(['name']);
    }
  });

  it('record: { type: "object", additionalProperties: <schema> } → record', () => {
    const k = classify({ type: 'object', additionalProperties: { type: 'string' } });
    expect(k.kind).toBe('record');
    if (k.kind === 'record') expect(k.valueSchema).toEqual({ type: 'string' });
  });

  it('array: { type: "array", items: <schema> } → array', () => {
    const k = classify(ARRAY_OF_STRING);
    expect(k.kind).toBe('array');
    if (k.kind === 'array') expect(k.items).toEqual({ type: 'string' });
  });

  it('tuple: { type: "array", items: [...] } → tuple', () => {
    const k = classify(TUPLE_THREE);
    expect(k.kind).toBe('tuple');
    if (k.kind === 'tuple') expect(k.items).toHaveLength(3);
  });

  it('tuple: minItems defaults to items.length when unspecified', () => {
    const k = classify(TUPLE_THREE);
    if (k.kind === 'tuple') expect(k.minItems).toBe(3);
  });

  it('tuple: minItems is exposed when specified', () => {
    const k = classify({ type: 'array', items: [{ type: 'string' }, { type: 'number' }], minItems: 1 });
    if (k.kind === 'tuple') expect(k.minItems).toBe(1);
  });

  it('discriminated-tuple: 2-tuple with const head → discriminated-tuple', () => {
    const k = classify(TUPLE_DISCRIMINATED);
    expect(k.kind).toBe('discriminated-tuple');
    if (k.kind === 'discriminated-tuple') {
      expect(k.tag).toBe('colors');
      expect(k.valueSchema).toEqual({ type: 'array', items: { type: 'string' } });
    }
  });

  it('opaque: no type, has id and title → opaque', () => {
    const k = classify(VUE_OPAQUE_COMPONENT);
    expect(k.kind).toBe('opaque');
    if (k.kind === 'opaque') expect(k.name).toBe('Component');
  });

  it('opaque: no type, has only title → opaque', () => {
    const k = classify({ title: 'SomeType' });
    expect(k.kind).toBe('opaque');
    if (k.kind === 'opaque') expect(k.name).toBe('SomeType');
  });
});

describe('classify — dispatch order edges', () => {
  it('const wins over enum', () => {
    const k = classify({ enum: ['a'], const: 'a' });
    expect(k.kind).toBe('const');
  });

  it('const wins over primitive type', () => {
    const k = classify({ const: 'x', type: 'string' });
    expect(k.kind).toBe('const');
  });

  it('object with empty properties → object (still has the key)', () => {
    // Mirrors current isObjectWithProps logic indirectly: empty {} props with type:object
    // is an empty object, which nullOrEmpty considers empty.
    const k = classify({ type: 'object', properties: {} });
    expect(k.kind).toBe('empty');
  });

  it('object with no properties and no additionalProperties → unknown (or empty)', () => {
    // type: 'object' with neither properties nor additionalProperties is empty per nullOrEmpty.
    const k = classify({ type: 'object' });
    expect(k.kind).toBe('empty');
  });

  it('literal-union: structurally matches even when no id', () => {
    const k = classify({ anyOf: [{ const: 'a' }, { const: 'b' }] });
    expect(k.kind).toBe('literal-union');
    if (k.kind === 'literal-union') expect(k.id).toBeUndefined();
  });

  it('union: anyOf of two primitives (no consts) → union', () => {
    const k = classify({ anyOf: [{ type: 'string' }, { type: 'number' }] });
    expect(k.kind).toBe('union');
  });

  it('opaque vs unknown: no type, no id, no title → unknown', () => {
    const k = classify({ description: 'something' });
    expect(k.kind).toBe('unknown');
  });
});

describe('classify — resolution', () => {
  it('dereferences $ref before classifying', () => {
    const k = classify(REF_TO_DEFS);
    expect(k.kind).toBe('object');
  });

  it('unwraps single-element allOf before classifying', () => {
    const k = classify(ALL_OF_SINGLE_WRAP);
    expect(k.kind).toBe('primitive');
    if (k.kind === 'primitive') expect(k.type).toBe('string');
  });

  it('does not loop on cyclic refs', () => {
    const k = classify(RECURSIVE_REF);
    expect(k.kind).toBe('object');
  });

  it('returns resolved sub-schemas in array.items (single-element allOf unwrapped)', () => {
    const k = classify({ type: 'array', items: { allOf: [{ type: 'string' }] } });
    if (k.kind === 'array') expect(k.items).toEqual({ type: 'string' });
  });

  it('returns resolved sub-schemas in union.variants', () => {
    const k = classify({
      anyOf: [
        { type: 'object', id: 'A', properties: { x: { type: 'string' } }, required: ['x'] },
        { allOf: [{ type: 'object', id: 'B', properties: { y: { type: 'string' } }, required: ['y'] }] },
      ],
    });
    if (k.kind === 'union') {
      expect(k.variants[0]).toMatchObject({ id: 'A' });
      expect(k.variants[1]).toMatchObject({ id: 'B' });
    }
  });
});
```

**Step 2: Run the new test file — every test should fail with "module not found"**

Run: `pnpm test classify.test.ts`
Expected: All tests fail with module-not-found / ReferenceError on `classify`.

---

## Task 2: Implement `classify.ts`

**Files:**
- Create: `app/lib/json-schema/classify.ts`
- Reference: `app/lib/json-schema/introspection.ts:17-29` (existing helpers `isObjectWithProps`, `getArrayItems`, `getUnionVariants`) — `classify` will reimplement equivalents privately.
- Reference: `app/lib/json-schema/nullOrEmpty.ts` — call directly.
- Reference: `app/lib/json-schema/resolveSchema.ts` — call directly.

**Step 1: Write the file**

```ts
import { nullOrEmpty } from './nullOrEmpty';
import { resolveSchema } from './resolveSchema';
import type { JSONSchema } from '@laioutr-core/core-types/common';

/** JSON Schema with the custom `id` field added by canonical-types reflection / vue-component-meta adapter. */
export type DocsJSONSchema = JSONSchema & { id?: string };

const PRIMITIVE_TYPE_NAMES = ['string', 'number', 'integer', 'boolean', 'null'] as const;
type PrimitiveTypeName = (typeof PRIMITIVE_TYPE_NAMES)[number];

const isPrimitiveTypeName = (t: unknown): t is PrimitiveTypeName =>
  typeof t === 'string' && (PRIMITIVE_TYPE_NAMES as readonly string[]).includes(t);

const getId = (s: JSONSchema): string | undefined => (s as DocsJSONSchema).id;

/** Resolve, then collect anyOf/oneOf variants. Each variant is also resolved. Returns undefined if none. */
const getResolvedUnionVariants = (s: JSONSchema): JSONSchema[] | undefined => {
  const variants = s.anyOf ?? s.oneOf;
  if (!variants?.length) return undefined;
  return variants
    .filter((v): v is JSONSchema => typeof v === 'object' && v !== null)
    .map((v) => resolveSchema(v, { dereferenced: true }));
};

export type SchemaKind =
  | { kind: 'empty'; schema: JSONSchema }
  | { kind: 'primitive'; type: PrimitiveTypeName; id?: string; format?: string; schema: JSONSchema }
  | { kind: 'const'; value: unknown; id?: string; schema: JSONSchema }
  | { kind: 'enum'; values: unknown[]; id?: string; schema: JSONSchema }
  | { kind: 'literal-union'; consts: unknown[]; escapeHatches: string[]; id?: string; schema: JSONSchema }
  | { kind: 'union'; variants: JSONSchema[]; id?: string; schema: JSONSchema }
  | { kind: 'intersection'; parts: JSONSchema[]; schema: JSONSchema }
  | { kind: 'object'; properties: Record<string, JSONSchema>; required: string[]; id?: string; schema: JSONSchema }
  | { kind: 'record'; valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'array'; items: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'tuple'; items: JSONSchema[]; minItems: number; id?: string; schema: JSONSchema }
  | { kind: 'discriminated-tuple'; tag: unknown; tagSchema: JSONSchema; valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'opaque'; name: string; schema: JSONSchema }
  | { kind: 'unknown'; schema: JSONSchema };

/**
 * Classify a JSON Schema into a discriminated union of structural shapes.
 * Resolves the input (single-pass deref + allOf unwrap) and any sub-schemas it returns,
 * so callers can recurse via `classify(kind.items)` without re-resolving.
 *
 * Display heuristics (e.g. when a literal-union should render expanded) live in
 * `introspection.ts` and operate on the returned kind.
 */
export const classify = (input: JSONSchema): SchemaKind => {
  const s = resolveSchema(input, { dereferenced: false });

  if (nullOrEmpty(s)) return { kind: 'empty', schema: s };

  if (s.const !== undefined) return { kind: 'const', value: s.const, id: getId(s), schema: s };

  if (s.enum) return { kind: 'enum', values: s.enum, id: getId(s), schema: s };

  // Multi-element allOf survives resolveSchema's single-element unwrap.
  if (s.allOf?.length) {
    const parts = s.allOf
      .filter((p): p is JSONSchema => typeof p === 'object' && p !== null)
      .map((p) => resolveSchema(p, { dereferenced: true }));
    return { kind: 'intersection', parts, schema: s };
  }

  const variants = getResolvedUnionVariants(s);
  if (variants) {
    // Literal-union: every variant is either a const or an isolated primitive type, with >=1 const.
    const consts: unknown[] = [];
    const escapeHatches: string[] = [];
    let allConstOrPrimitive = true;
    const seenHatches = new Set<string>();
    for (const v of variants) {
      if (v.const !== undefined) {
        consts.push(v.const);
        continue;
      }
      if (typeof v.type === 'string' && isPrimitiveTypeName(v.type)) {
        if (!seenHatches.has(v.type)) {
          seenHatches.add(v.type);
          escapeHatches.push(v.type);
        }
        continue;
      }
      allConstOrPrimitive = false;
      break;
    }
    if (allConstOrPrimitive && consts.length >= 1) {
      return { kind: 'literal-union', consts, escapeHatches, id: getId(s), schema: s };
    }
    return { kind: 'union', variants, id: getId(s), schema: s };
  }

  if (s.type === 'object') {
    if (s.properties && Object.keys(s.properties).length > 0) {
      const properties = Object.fromEntries(
        Object.entries(s.properties).filter(
          (entry): entry is [string, JSONSchema] => typeof entry[1] === 'object' && entry[1] !== null,
        ),
      );
      return {
        kind: 'object',
        properties,
        required: s.required ?? [],
        id: getId(s),
        schema: s,
      };
    }
    if (typeof s.additionalProperties === 'object' && s.additionalProperties !== null) {
      return {
        kind: 'record',
        valueSchema: resolveSchema(s.additionalProperties as JSONSchema, { dereferenced: true }),
        id: getId(s),
        schema: s,
      };
    }
    // type:'object' with no properties and no additionalProperties is caught by nullOrEmpty above.
    return { kind: 'unknown', schema: s };
  }

  if (s.type === 'array') {
    if (Array.isArray(s.items)) {
      const items = s.items.filter((i): i is JSONSchema => typeof i === 'object' && i !== null);
      // Discriminated 2-tuple: [const, value]
      if (items.length === 2) {
        const [head, value] = items as [JSONSchema, JSONSchema];
        if (head.const !== undefined) {
          return {
            kind: 'discriminated-tuple',
            tag: head.const,
            tagSchema: head,
            valueSchema: resolveSchema(value, { dereferenced: true }),
            id: getId(s),
            schema: s,
          };
        }
      }
      const resolvedItems = items.map((i) => resolveSchema(i, { dereferenced: true }));
      return {
        kind: 'tuple',
        items: resolvedItems,
        minItems: typeof s.minItems === 'number' ? s.minItems : resolvedItems.length,
        id: getId(s),
        schema: s,
      };
    }
    if (typeof s.items === 'object' && s.items !== null) {
      return {
        kind: 'array',
        items: resolveSchema(s.items as JSONSchema, { dereferenced: true }),
        id: getId(s),
        schema: s,
      };
    }
    return { kind: 'unknown', schema: s };
  }

  if (isPrimitiveTypeName(s.type)) {
    return {
      kind: 'primitive',
      type: s.type,
      id: getId(s),
      format: typeof s.format === 'string' ? s.format : undefined,
      schema: s,
    };
  }

  if (!s.type) {
    const id = getId(s);
    if (id) return { kind: 'opaque', name: id, schema: s };
    if (s.title) return { kind: 'opaque', name: s.title, schema: s };
  }

  return { kind: 'unknown', schema: s };
};
```

**Step 2: Run the new test file**

Run: `pnpm test classify.test.ts`
Expected: All ~32 classify tests pass.

**Step 3: Run the full suite to confirm nothing else moved**

Run: `pnpm test`
Expected: previous 140 passed + 32 new passed = 172 passed, 13 todo, zero failures.

**Step 4: Type-check**

Run: `pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: clean (no output).

---

## Task 3: Refactor `getTypeName` to dispatch via `classify`

**Files:**
- Modify: `app/lib/json-schema/introspection.ts:41-104` — replace the body of `getTypeName`.

**Step 1: Add the import at the top of `introspection.ts`**

```ts
import { classify, type SchemaKind } from './classify';
```

**Step 2: Replace `getTypeName` body**

```ts
export const getTypeName = (s: JSONSchema, mode: SchemaMode = 'json'): string => {
  const k = classify(s);
  switch (k.kind) {
    case 'empty':
      return 'unknown';
    case 'primitive': {
      if (mode === 'javascript') {
        if (k.format && FORMAT_TO_JS_TYPE[k.format]) return FORMAT_TO_JS_TYPE[k.format]!;
        if (k.type === 'integer') return 'number';
      }
      return k.type;
    }
    case 'const':
      return JSON.stringify(k.value);
    case 'enum':
      return k.values.map((v) => JSON.stringify(v)).join(' | ');
    case 'intersection':
      return k.parts.map((p) => getTypeName(p, mode)).join(' & ');
    case 'literal-union':
    case 'union': {
      if (k.id) return k.id;
      const variantSchemas = k.kind === 'literal-union'
        ? [
            ...k.consts.map((v) => ({ const: v }) as JSONSchema),
            ...k.escapeHatches.map((t) => ({ type: t }) as JSONSchema),
          ]
        : k.variants;
      return variantSchemas.map((v) => getTypeName(v, mode)).join(' | ');
    }
    case 'object':
      return k.id ?? k.schema.title ?? 'object';
    case 'record':
      if (mode === 'javascript') return `Record<string, ${getTypeName(k.valueSchema, mode)}>`;
      return k.id ?? k.schema.title ?? 'object';
    case 'array':
      return `${getTypeName(k.items, mode)}[]`;
    case 'tuple': {
      const parts = k.items.map((item, i) => {
        const name = getTypeName(item, mode);
        return i >= k.minItems ? `${name}?` : name;
      });
      return `[${parts.join(', ')}]`;
    }
    case 'discriminated-tuple': {
      const tag = JSON.stringify(k.tag);
      const value = getTypeName(k.valueSchema, mode);
      return `[type: ${tag}, value: ${value}]`;
    }
    case 'opaque':
      return k.name;
    case 'unknown':
      return (typeof k.schema.type === 'string' ? k.schema.type : undefined) ?? 'unknown';
  }
};
```

**Step 3: Run the introspection suite**

Run: `pnpm test introspection.test.ts`
Expected: all `getTypeName` tests still pass.

**Step 4: Run the full suite**

Run: `pnpm test`
Expected: 172 passed, 13 todo, zero failures.

**Step 5: Type-check**

Run: `pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: clean.

---

## Task 4: Refactor `getExpandableVariants` to dispatch via `classify`

**Files:**
- Modify: `app/lib/json-schema/introspection.ts:271-401` — `tupleVariantToParts`, `variantFromSchema`, `getDiscriminantField`, `enrichWithDiscriminant`, `computeExpandableVariants`, `getExpandableVariants`.

**Step 1: Replace `variantFromSchema` and `tupleVariantToParts` with kind-driven equivalents**

Delete `tupleVariantToParts` (lines 271-288 of introspection.ts). The discriminated-tuple shape is now produced by `classify` directly.

Replace `variantFromSchema` with:

```ts
const variantFromKind = (k: SchemaKind, arrayPrefix = false): ExpandableVariant | undefined => {
  if (k.kind === 'object') {
    const name = getSchemaName(k.schema);
    const label = arrayPrefix ? `${name}[]` : name;
    return { label, summary: summarizeProps(k.schema), descriptionHtml: getVariantDescriptionHtml(k.schema), schema: k.schema };
  }
  if (k.kind === 'discriminated-tuple') {
    const synthetic: DocsJSONSchema = {
      type: 'object',
      ...(k.id ? { id: k.id, title: k.schema.title ?? k.id } : {}),
      properties: { type: k.tagSchema, value: k.valueSchema },
      required: ['type', 'value'],
    };
    const name = getSchemaName(synthetic);
    const label = arrayPrefix ? `${name}[]` : name;
    return {
      label,
      summary: `[type: ${JSON.stringify(k.tag)}, value: ${getTypeName(k.valueSchema, 'json')}]`,
      descriptionHtml: getVariantDescriptionHtml(synthetic),
      schema: synthetic,
      openPlaceholder: '[ ]',
    };
  }
  if (k.kind === 'array') {
    const itemsKind = classify(k.items);
    if (itemsKind.kind === 'object') {
      const name = getSchemaName(k.items);
      return { label: `${name}[]`, summary: summarizeProps(k.items), descriptionHtml: getVariantDescriptionHtml(k.items), schema: k.items };
    }
  }
  return undefined;
};
```

**Step 2: Replace `computeExpandableVariants`**

```ts
const computeExpandableVariants = (s: JSONSchema): ExpandableVariant[] | undefined => {
  const k = classify(s);

  // Expandable literal union: synthesize a single 'values' variant. Display gating happens here.
  if (k.kind === 'literal-union' && isExpandableLiteralUnion(s)) {
    return [{ label: 'values', summary: '', descriptionHtml: '', schema: s }];
  }

  // Direct kinds that produce a single variant
  const direct = variantFromKind(k);
  if (direct) return [direct];

  // Union of variants — each variant gets classified individually
  if (k.kind === 'union') {
    const results = k.variants
      .map((v) => variantFromKind(classify(v)))
      .filter((v): v is ExpandableVariant => !!v);
    if (results.length) {
      enrichWithDiscriminant(results);
      return results;
    }
  }

  // Array whose items are themselves a union
  if (k.kind === 'array') {
    const itemsKind = classify(k.items);
    if (itemsKind.kind === 'union') {
      const results = itemsKind.variants
        .map((v) => variantFromKind(classify(v), true))
        .filter((v): v is ExpandableVariant => !!v);
      if (results.length) {
        enrichWithDiscriminant(results);
        return results;
      }
    }
  }

  return undefined;
};
```

**Step 3: Leave `getExpandableVariants` (the WeakMap-cached wrapper) and `enrichWithDiscriminant` and `getDiscriminantField` unchanged.**

**Step 4: Run the introspection suite**

Run: `pnpm test introspection.test.ts`
Expected: all `getExpandableVariants` tests still pass.

**Step 5: Run the full suite + type-check**

Run: `pnpm test && pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: 172 passed, 13 todo, type-check clean.

---

## Task 5: Refactor `getTypeSummary` to dispatch via `classify`

**Files:**
- Modify: `app/lib/json-schema/introspection.ts:414-474` — replace `getTypeSummary` body.

**Step 1: Replace `getTypeSummary` body**

```ts
export const getTypeSummary = (s: JSONSchema, { expanded = false, mode = 'json' as SchemaMode } = {}): string => {
  const k = classify(s);

  // Expandable literal unions: alias + a peek of values when collapsed; alias only when expanded.
  if (k.kind === 'literal-union' && isExpandableLiteralUnion(s)) {
    const id = k.id!;
    if (expanded) return id;
    const isCleanAlias = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(id);
    if (!isCleanAlias) return id;
    const summary = summarizeConstValues(s);
    return summary ? `${id} ${summary}` : id;
  }

  const variants = getExpandableVariants(s);
  if (!variants) return getTypeName(s, mode);

  if (variants.length === 1) {
    const v = variants[0]!;
    const outerId = getSchemaId(s);
    const innerId = getSchemaId(v.schema);
    const isArray = v.label.endsWith('[]');
    const props = expanded ? '{ }' : summarizeProps(v.schema) || '{ }';

    if (outerId && innerId && outerId !== innerId) {
      const tokens = outerId.split(/(\s*\|\s*)/);
      if (tokens.includes(innerId)) {
        return tokens.map((t) => (t === innerId ? `${innerId}${isArray ? '[]' : ''} ${props}` : t)).join('');
      }
    }

    const id = outerId ?? innerId;
    const isStructuralId = id !== undefined && id.trim().startsWith('{');
    if (id && !isStructuralId) return isArray ? `${id}[] ${props}` : `${id} ${props}`;
    return isArray ? `${props}[]` : props;
  }

  // Named union (e.g. Media, Link)
  const id = getSchemaId(s) ?? (k.kind === 'array' ? getSchemaId(k.items) : undefined);
  if (id) return k.kind === 'array' ? `${id}[]` : id;

  if (k.kind === 'array') {
    const names = variants.map((v) => v.label.replace(/\[\]$/, ''));
    return `(${names.join(' | ')})[]`;
  }

  return variants.map((v) => v.label).join(' | ');
};
```

**Step 2: Run the introspection suite**

Run: `pnpm test introspection.test.ts`
Expected: all `getTypeSummary` tests still pass.

**Step 3: Full suite + type-check**

Run: `pnpm test && pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: 172 passed, 13 todo, clean.

---

## Task 6: Refactor `JsonSchemaFields.vue` template

**Files:**
- Modify: `app/components/JsonSchemaFields.vue:1-207`

**Step 1: Add `classify` to the script imports + a `kind` computed**

In `<script setup lang="ts">`, replace the existing imports + add `kind`:

```ts
import { classify } from '../lib/json-schema/classify';
// ... existing imports ...
// Drop nullOrEmpty import — no longer needed (kind === 'empty' replaces it).

// ... existing schema computed stays unchanged ...

const kind = computed(() => classify(schema.value));
```

The `nullOrEmpty` import becomes unused — remove the import line. The `resolvedProperties` computed stays unchanged (it iterates `schema.value.properties` which still works on an `object` kind).

**Step 2: Replace the template branches**

Replace each `v-if`/`v-else-if` condition that pivots on schema structure:

- `<template v-if="nullOrEmpty(schema)">` → `<template v-if="kind.kind === 'empty'">`
- `<ProseFieldGroup v-if="schema.type === 'object'" ...>` → `<ProseFieldGroup v-if="kind.kind === 'object'" ...>`
- `<template v-else-if="schema.type === 'array'">` → `<template v-else-if="kind.kind === 'array' || kind.kind === 'tuple' || kind.kind === 'discriminated-tuple'">` *(matches current behavior — the existing template runs the "array branch" for any `schema.type === 'array'` regardless of items shape)*

  Wait — re-check: the current code only enters the array branch when `schema.type === 'array'`, which matches all three array-y kinds. Confirm the `getExpandableVariants(schema)` flow inside still produces the same results.

  *Note for the implementer:* the current logic uses `schema.type === 'array'` as a single discriminator; classify splits this into `array` / `tuple` / `discriminated-tuple`. To preserve behavior exactly, treat all three as "array branch" in the template. This is fine because everything inside the array branch ultimately routes through `getExpandableVariants` and `JsonSchemaFields` recursion, which already handle each sub-shape.

- `<template v-else-if="isExpandableLiteralUnion(schema)">` → `<template v-else-if="kind.kind === 'literal-union' && isExpandableLiteralUnion(schema)">`

  The display gate (`isExpandableLiteralUnion`) stays — per Option A, the kind is structural, the heuristic stays in `introspection.ts`.

- The remaining branches (`getExpandableVariants(schema)?.length === 1`, `getExpandableVariants(schema)`, primitive fallback) stay as-is.

**Step 3: Inside the array branch, simplify the "primitive array vs complex array" check**

Currently lines 127-141 contain a long expression checking `(schema.items as JSONSchema).type !== 'object' && ... !== 'array'`. With `kind` available, this becomes cleaner only when `kind.kind === 'array'` (single-items) — for `tuple` / `discriminated-tuple` the existing logic is fine. Defer this simplification to Task 7's sweep if it's not surgical.

For Task 6, leave the inner expression alone. Only the outer branch conditions change.

**Step 4: Run the dev server, render a real docs page**

```bash
pnpm dev
```

In a browser tab, navigate to a page that uses each renderer source:
- An entity reference page (canonical-types source): `http://localhost:3000/api-reference/...`
- A UI component page (vue-component-meta source): `http://localhost:3000/laioutr-ui/...`

Find a page with the actual paths via:
```bash
ls content/3.laioutr-ui/  # for UI components
grep -r "::component-meta" content/ | head -5  # find UI component pages
grep -r "entity-component-meta" content/ | head -5  # find entity pages
```

Visually verify: property tables look the same as before. Chips (literal-union), expandable rows (object/discriminated-tuple), and array branches all render identically.

**Step 5: Run the test suite**

Run: `pnpm test && pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: 172 passed, 13 todo, clean.

---

## Task 7: Sweep dead code

**Files:**
- Modify: `app/lib/json-schema/introspection.ts`

**Step 1: Identify private helpers that are no longer referenced**

After the refactor, the following may be dead inside `introspection.ts`:
- `tupleVariantToParts` — replaced by `discriminated-tuple` kind. **Delete.**
- `variantFromSchema` — replaced by `variantFromKind`. **Delete.**
- `PRIMITIVE_TYPE_NAMES` (line 39) — still used by `isExpandableLiteralUnion` and `isPrimitiveType`. **Keep.**
- `isPrimitiveType` (line 187) — still used by `isExpandableLiteralUnion`. **Keep.**
- `getArrayItems`, `getUnionVariants`, `isObjectWithProps` — still used by `JsonSchemaFields.vue` for inner template logic and by `component-meta-adapter.ts`. **Keep.**

Verify by greppping each candidate before deleting:

```bash
grep -rn "tupleVariantToParts\|variantFromSchema" app/ --include='*.ts' --include='*.vue'
```

If both return zero hits outside `introspection.ts`, delete them.

**Step 2: Run the full suite + type-check**

Run: `pnpm test && pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: 172 passed, 13 todo, clean.

---

## Task 8: Final acceptance verification

**Step 1: Full test suite**

Run: `pnpm test`
Expected: 172 passed (140 prior + 32 new), 13 todo, zero failures.

**Step 2: Strict type-check**

Run: `pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: no output.

**Step 3: Dev server smoke test**

Run `pnpm dev` in the background. Open at least:
- One entity reference page
- One UI component page (e.g. a page that uses `::component-meta`)
- One page with the IconName / FallbackVariant style literal union (look for chip rows)
- One page with a discriminated tuple (the colors fix from `79bed2c`)

Compare against `main` HEAD (before refactor) by stashing the working tree and reloading — or just by eye, since the renderer is deterministic. Anything visually different is a regression.

Stop the dev server.

**Step 4: Lint + format**

Run: `pnpm eslint app/lib/json-schema/ app/components/JsonSchemaFields.vue --fix`
Run: `pnpm prettier --write app/lib/json-schema/classify.ts app/lib/json-schema/classify.test.ts app/lib/json-schema/introspection.ts app/components/JsonSchemaFields.vue`

Expected: no lint errors. Prettier may reformat — that's fine.

**Step 5: Re-run tests + type-check after lint/format**

Run: `pnpm test && pnpm tsc --noEmit -p tsconfig.vitest.json`
Expected: still green.

---

## Task 9: Single commit

**Step 1: Stage the changes**

```bash
git add app/lib/json-schema/classify.ts app/lib/json-schema/classify.test.ts app/lib/json-schema/introspection.ts app/components/JsonSchemaFields.vue docs/plans/2026-05-06-classify-refactor-design.md docs/plans/2026-05-06-classify-refactor.md
```

**Step 2: Commit**

Use a HEREDOC; subject line under 70 chars.

```bash
git commit -m "$(cat <<'EOF'
refactor(json-schema): introduce classify() and dispatch the four sites through it

Single primitive returns a discriminated SchemaKind covering 12 structural
shapes (empty, primitive, const, enum, literal-union, union, intersection,
object, record, array, tuple, discriminated-tuple, opaque, unknown).

Refactors getTypeName, getTypeSummary, getExpandableVariants, and the Vue
JsonSchemaFields template to dispatch on kind. Display heuristics (the
isExpandableLiteralUnion threshold, summarizeConstValues budget, structural-id
splice in getTypeSummary) stay in introspection.ts and operate on the kind
or schema. introspection.ts's public API is unchanged.

Adds 32 classify.test.ts cases. Existing 140 tests remain green; 13 .todo
placeholders for unsupported keywords (multi-type, schema booleans, prefixItems,
if/then/else, etc.) carry over. Adding any of those is now a localized change:
one new SchemaKind variant + one new branch per dispatcher.

Design: docs/plans/2026-05-06-classify-refactor-design.md
EOF
)"
```

**Step 3: Verify commit**

Run: `git log -1 --stat`
Expected: one commit on HEAD with the four `app/` files, both docs/plans files. No partial commits, no leftover files.

---

## Done

If anything fails along the way: stop, investigate, fix the cause. Do not skip steps or paper over failures with `// @ts-ignore` or test deletions. The 140-test safety net exists precisely so a single red test points to the regression.
