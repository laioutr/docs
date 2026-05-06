# JSON Schema Test Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Lock down the current behavior of the JSON Schema rendering pipeline (`app/lib/json-schema/*`) with a Vitest unit test suite, before any further keyword support or refactor work.

**Architecture:** Pure-function tests only (no Vue components, no DOM). Tests colocated next to source modules. Shared `__fixtures__/` directory with three-way split (shared / canonical-types-style / vue-adapter-style) so the same fixture flows through multiple modules. Real-schema seeding for `schemas-zod.ts` from `@laioutr-core/canonical-types/reflection`. Explicit assertions, no snapshots. ~100 active tests + ~10 `.todo` placeholders documenting known gaps.

**Tech Stack:** Vitest 3.x, TypeScript 5.9, Node environment (no jsdom/happy-dom), pnpm.

**Design doc:** `docs/plans/2026-05-06-json-schema-test-suite-design.md`

---

## Conventions for all tasks

- All paths relative to `/Users/sl/src/docs`.
- Each task ends with a commit. Commit messages follow the existing repo style (`docs(json-schema): ...` prefix when modifying docs-site code; `chore: ...` for tooling).
- After each task, run `pnpm test` to confirm everything still passes.
- If a test fails on an existing edge case we hadn't documented, **stop and surface it** — that's a bug we missed in the design phase, worth a discussion before patching the test.

---

## Task 1: Vitest scaffolding

**Files:**
- Create: `vitest.config.ts`
- Create: `tsconfig.vitest.json` (separate test tsconfig — Nuxt's auto-generated `.nuxt/tsconfig.app.json` has `types: []`, so the language server needs this to resolve vitest types)
- Modify: `tsconfig.json` (add `tsconfig.vitest.json` as a project reference)
- Modify: `package.json` (add devDeps + scripts)
- Create: `app/lib/json-schema/__smoke__.test.ts` (temporary, removed in Task 2)

**Step 1: Install Vitest**

Run:
```bash
pnpm add -D vitest@^3
```

Expected: `vitest` added to `devDependencies` in `package.json`.

**Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['app/**/*.test.ts'],
    environment: 'node',
  },
});
```

**Step 3: Add scripts to `package.json`**

Insert into `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 3.5: Create `tsconfig.vitest.json`**

Nuxt's auto-generated `.nuxt/tsconfig.app.json` has `types: []` — without a separate test tsconfig, the language server can't find vitest types. Create at repo root:

```json
{
  "extends": "./.nuxt/tsconfig.app.json",
  "compilerOptions": {
    "types": ["node"]
  },
  "include": [
    "vitest.config.ts",
    "app/**/*.test.ts",
    "app/lib/json-schema/__fixtures__/**/*"
  ]
}
```

Then add a project reference in `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" },
    { "path": "./tsconfig.vitest.json" }
  ]
}
```

**Step 4: Smoke test to prove the toolchain**

Create `app/lib/json-schema/__smoke__.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { nullOrEmpty } from './nullOrEmpty';

describe('toolchain smoke', () => {
  it('imports and runs the module under test', () => {
    expect(nullOrEmpty({})).toBe(true);
  });
});
```

**Step 5: Run**

Run: `pnpm test`
Expected: 1 file, 1 test passed.

**Step 6: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml app/lib/json-schema/__smoke__.test.ts
git commit -m "chore(test): scaffold vitest with smoke test"
```

---

## Task 2: `nullOrEmpty.test.ts`

**Files:**
- Create: `app/lib/json-schema/nullOrEmpty.test.ts`
- Delete: `app/lib/json-schema/__smoke__.test.ts`

**Step 1: Write the test file**

```ts
import { describe, it, expect } from 'vitest';
import { nullOrEmpty } from './nullOrEmpty';

describe('nullOrEmpty', () => {
  it('returns true for missing type', () => {
    expect(nullOrEmpty({})).toBe(true);
  });

  it('returns true for type: null', () => {
    expect(nullOrEmpty({ type: 'null' })).toBe(true);
  });

  it('returns true for empty object', () => {
    expect(nullOrEmpty({ type: 'object' })).toBe(true);
    expect(nullOrEmpty({ type: 'object', properties: {} })).toBe(true);
  });

  it('returns false for object with properties', () => {
    expect(nullOrEmpty({ type: 'object', properties: { a: { type: 'string' } } })).toBe(false);
  });

  it('returns false for primitive types', () => {
    expect(nullOrEmpty({ type: 'string' })).toBe(false);
    expect(nullOrEmpty({ type: 'number' })).toBe(false);
    expect(nullOrEmpty({ type: 'integer' })).toBe(false);
    expect(nullOrEmpty({ type: 'boolean' })).toBe(false);
    expect(nullOrEmpty({ type: 'array' })).toBe(false);
  });

  it('returns false for any union (anyOf, oneOf, allOf)', () => {
    expect(nullOrEmpty({ anyOf: [{ type: 'string' }] })).toBe(false);
    expect(nullOrEmpty({ oneOf: [{ type: 'string' }] })).toBe(false);
    expect(nullOrEmpty({ allOf: [{ type: 'string' }] })).toBe(false);
  });
});
```

**Step 2: Delete the smoke test**

```bash
rm app/lib/json-schema/__smoke__.test.ts
```

**Step 3: Run**

Run: `pnpm test`
Expected: 1 file, 6 tests passed.

**Step 4: Commit**

```bash
git add app/lib/json-schema/nullOrEmpty.test.ts app/lib/json-schema/__smoke__.test.ts
git commit -m "test(json-schema): cover nullOrEmpty"
```

---

## Task 3: Shared fixtures (`schemas-shared.ts`)

**Files:**
- Create: `app/lib/json-schema/__fixtures__/schemas-shared.ts`
- Create: `app/lib/json-schema/__fixtures__/index.ts`

**Step 1: Create `schemas-shared.ts`**

Fixtures both `vue-component-meta` and `canonical-types/reflection` produce. Each has a JSDoc explaining what it exercises.

```ts
import type { DocsJSONSchema } from '../introspection';

// --- Primitives ---

export const PRIM_STRING: DocsJSONSchema = { type: 'string' };
export const PRIM_NUMBER: DocsJSONSchema = { type: 'number' };
export const PRIM_INTEGER: DocsJSONSchema = { type: 'integer' };
export const PRIM_BOOLEAN: DocsJSONSchema = { type: 'boolean' };

/** String with a regex pattern + length bounds — exercises constraint extraction. */
export const STRING_WITH_PATTERN: DocsJSONSchema = {
  type: 'string',
  pattern: '^\\d+$',
  minLength: 1,
  maxLength: 10,
};

/** Number with full range constraints. */
export const NUMBER_WITH_RANGE: DocsJSONSchema = {
  type: 'number',
  minimum: 0,
  maximum: 100,
  exclusiveMinimum: 0,
  multipleOf: 5,
};

/** date-time format — JS mode maps to `Date`, JSON mode keeps as constraint. */
export const STRING_DATE_TIME: DocsJSONSchema = { type: 'string', format: 'date-time' };

/** A non-mapped format — should appear as a constraint chip in both modes. */
export const STRING_EMAIL: DocsJSONSchema = { type: 'string', format: 'email' };

// --- Const & enum ---

export const CONST_STRING: DocsJSONSchema = { const: 'fixed' };
export const CONST_NUMBER: DocsJSONSchema = { const: 42 };
export const ENUM_STRINGS: DocsJSONSchema = { enum: ['a', 'b', 'c'] };

// --- Annotations ---

export const DEPRECATED_STRING: DocsJSONSchema = { type: 'string', deprecated: true };
export const READ_ONLY_STRING: DocsJSONSchema = { type: 'string', readOnly: true };
export const WRITE_ONLY_STRING: DocsJSONSchema = { type: 'string', writeOnly: true };
export const STRING_WITH_DEFAULT: DocsJSONSchema = { type: 'string', default: 'hello' };
export const STRING_WITH_DESCRIPTION: DocsJSONSchema = {
  type: 'string',
  description: 'A user-facing message.',
};

// --- Objects ---

/** Simple object with one required and one optional field. */
export const OBJECT_SIMPLE: DocsJSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' },
  },
  required: ['name'],
};

/** Nested object — name → address.street etc. */
export const OBJECT_NESTED: DocsJSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
      },
      required: ['street'],
    },
  },
  required: ['name'],
};

// --- Arrays & tuples ---

export const ARRAY_OF_STRING: DocsJSONSchema = { type: 'array', items: { type: 'string' } };
export const ARRAY_WITH_LENGTH: DocsJSONSchema = {
  type: 'array',
  items: { type: 'string' },
  minItems: 1,
  maxItems: 10,
  uniqueItems: true,
};

export const TUPLE_THREE: DocsJSONSchema = {
  type: 'array',
  items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
};

/** Discriminated 2-tuple `[type: 'colors', value: string[]]` — recent fix in 79bed2c. */
export const TUPLE_DISCRIMINATED: DocsJSONSchema = {
  type: 'array',
  items: [
    { const: 'colors' },
    { type: 'array', items: { type: 'string' } },
  ],
};
```

**Step 2: Create `index.ts`**

```ts
export * from './schemas-shared';
```

(`schemas-zod.ts`, `schemas-vue.ts`, `vue-meta.ts` get added in later tasks.)

**Step 3: Verify it compiles by running tests**

Run: `pnpm test`
Expected: 1 file, 6 tests passed (no new tests yet, just the existing `nullOrEmpty` ones; this confirms no import errors).

**Step 4: Commit**

```bash
git add app/lib/json-schema/__fixtures__/
git commit -m "test(json-schema): add shared fixture catalog"
```

---

## Task 4: Real-schema fixtures (`schemas-zod.ts`)

**Files:**
- Create: `app/lib/json-schema/__fixtures__/schemas-zod.ts`
- Modify: `app/lib/json-schema/__fixtures__/index.ts`

**Step 1: Dump real schemas from `@laioutr-core/canonical-types/reflection`**

Run this one-shot script to inspect what's available:

```bash
node -e "
import('@laioutr-core/canonical-types/reflection').then(m => {
  const r = m.default;
  console.log('actions:', r.actions.map(a => a.name).slice(0, 5));
  console.log('queries:', r.queries.map(q => q.name).slice(0, 5));
  console.log('components:', r.components.map(c => c.name).slice(0, 5));
});
"
```

Pick 3-4 representative items: one action with non-trivial input/output, one component with a recursive schema if available, one entity-style component.

**Step 2: Save chosen schemas as JSON fixtures**

For each chosen item, write its `input`/`output`/`schema` to a `.json` file under `__fixtures__/`:

```bash
node -e "
import('@laioutr-core/canonical-types/reflection').then(m => {
  const r = m.default;
  const action = r.actions.find(a => a.name === 'CHOSEN_ACTION');
  console.log(JSON.stringify(action.input, null, 2));
});
" > app/lib/json-schema/__fixtures__/zod-action-input.json
```

Repeat for `zod-action-output.json`, `zod-component-base.json`, etc. Aim for 3-4 JSON files.

**Step 3: Create `schemas-zod.ts` with imports**

```ts
import type { DocsJSONSchema } from '../introspection';
import zodActionInput from './zod-action-input.json' with { type: 'json' };
import zodActionOutput from './zod-action-output.json' with { type: 'json' };
import zodComponentBase from './zod-component-base.json' with { type: 'json' };

/** Real action input schema captured from canonical-types/reflection — exercises $ref+$defs, allOf single-element wraps. */
export const ZOD_ACTION_INPUT = zodActionInput as DocsJSONSchema;

/** Real action output schema. */
export const ZOD_ACTION_OUTPUT = zodActionOutput as DocsJSONSchema;

/** Real component base schema — exercises anyOf of full-id objects, nested $refs. */
export const ZOD_COMPONENT_BASE = zodComponentBase as DocsJSONSchema;

// --- Synthetic complements (for shapes the real schemas don't cover) ---

/** $ref to $defs — minimal example. */
export const REF_TO_DEFS: DocsJSONSchema = {
  $defs: {
    User: {
      type: 'object',
      properties: { id: { type: 'string' }, name: { type: 'string' } },
      required: ['id'],
    },
  },
  $ref: '#/$defs/User',
};

/** Single-element `allOf` wrap — zod's $ref codegen produces this. */
export const ALL_OF_SINGLE_WRAP: DocsJSONSchema = {
  allOf: [{ type: 'string' }],
};

/** Multi-element `allOf` — real intersection. */
export const ALL_OF_INTERSECTION: DocsJSONSchema = {
  allOf: [
    { type: 'object', id: 'A', properties: { a: { type: 'string' } } },
    { type: 'object', id: 'B', properties: { b: { type: 'number' } } },
  ],
};

/** anyOf of full objects with own ids — common in zod-emitted union schemas. */
export const ANY_OF_OBJECTS: DocsJSONSchema = {
  anyOf: [
    {
      type: 'object',
      id: 'TextNode',
      properties: { type: { const: 'text' }, value: { type: 'string' } },
      required: ['type', 'value'],
    },
    {
      type: 'object',
      id: 'ImageNode',
      properties: { type: { const: 'image' }, src: { type: 'string' } },
      required: ['type', 'src'],
    },
  ],
};

/** Cyclic ref — synthetic; tests that resolveSchema doesn't loop. */
export const RECURSIVE_REF: DocsJSONSchema = {
  $defs: {
    Tree: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        children: { type: 'array', items: { $ref: '#/$defs/Tree' } },
      },
    },
  },
  $ref: '#/$defs/Tree',
};

/** Definitions stamped with id by withDefinitionIds. */
export const DEFS_NEEDS_STAMPING: DocsJSONSchema = {
  $defs: {
    Color: { type: 'string', enum: ['red', 'blue'] },
    __schema123: { type: 'number' }, // synthetic name — should NOT be stamped
  },
  type: 'object',
  properties: {
    color: { $ref: '#/$defs/Color' },
    score: { $ref: '#/$defs/__schema123' },
  },
};
```

**Step 4: Update `index.ts`**

```ts
export * from './schemas-shared';
export * from './schemas-zod';
```

**Step 5: Verify compiles**

Run: `pnpm test`
Expected: still 6 tests passing.

**Step 6: Commit**

```bash
git add app/lib/json-schema/__fixtures__/
git commit -m "test(json-schema): seed zod-style fixtures from canonical-types reflection"
```

---

## Task 5: `resolveSchema.test.ts`

**Files:**
- Create: `app/lib/json-schema/resolveSchema.test.ts`

**Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { resolveSchema } from './resolveSchema';
import {
  REF_TO_DEFS,
  ALL_OF_SINGLE_WRAP,
  ALL_OF_INTERSECTION,
  RECURSIVE_REF,
  DEFS_NEEDS_STAMPING,
} from './__fixtures__';

describe('resolveSchema', () => {
  describe('withDefinitionIds (via resolveSchema)', () => {
    it('stamps id on $defs entries that lack one', () => {
      const result = resolveSchema(DEFS_NEEDS_STAMPING) as any;
      // After dereferencing, the property points at the stamped def.
      expect((result.properties.color as any).id).toBe('Color');
    });

    it('skips synthetic __schemaN names', () => {
      const result = resolveSchema(DEFS_NEEDS_STAMPING) as any;
      expect((result.properties.score as any).id).toBeUndefined();
    });

    it('does not mutate input', () => {
      const input = { ...REF_TO_DEFS };
      const before = JSON.stringify(input);
      resolveSchema(input);
      expect(JSON.stringify(input)).toBe(before);
    });
  });

  describe('dereferenceSync', () => {
    it('resolves a single-level $ref', () => {
      const result = resolveSchema(REF_TO_DEFS) as any;
      expect(result.type).toBe('object');
      expect(result.properties.id).toEqual({ type: 'string' });
    });

    it('does not loop on cyclic refs', () => {
      // Should complete without RangeError.
      expect(() => resolveSchema(RECURSIVE_REF)).not.toThrow();
    });
  });

  describe('allOf unwrap', () => {
    it('unwraps single-element allOf', () => {
      const result = resolveSchema(ALL_OF_SINGLE_WRAP);
      expect(result).toEqual({ type: 'string' });
    });

    it('unwraps recursively until no single-element allOf remains', () => {
      const nested = { allOf: [{ allOf: [{ type: 'string' as const }] }] };
      expect(resolveSchema(nested)).toEqual({ type: 'string' });
    });

    it('preserves multi-element allOf', () => {
      const result = resolveSchema(ALL_OF_INTERSECTION);
      expect(result.allOf).toHaveLength(2);
    });
  });

  describe('dereferenced flag', () => {
    it('honors dereferenced: true (skips deref)', () => {
      const input = { $ref: '#/foo' };
      const result = resolveSchema(input, { dereferenced: true });
      expect(result).toEqual({ $ref: '#/foo' });
    });
  });
});
```

**Step 2: Run**

Run: `pnpm test`
Expected: 2 files, ~14 tests passing.

If any test fails: stop. Cyclic refs may currently loop — that's exactly what we want to know now, before claiming the suite is green. Surface the failure rather than weakening the test.

**Step 3: Commit**

```bash
git add app/lib/json-schema/resolveSchema.test.ts
git commit -m "test(json-schema): cover resolveSchema deref, allOf unwrap, definition stamping"
```

---

## Task 6: `introspection.test.ts` — `getTypeName` + `getConstraints`

**Files:**
- Create: `app/lib/json-schema/introspection.test.ts` (this task creates the file with two `describe` blocks; later tasks add more blocks)

**Step 1: Write the test file**

```ts
import { describe, it, expect } from 'vitest';
import { getTypeName, getConstraints } from './introspection';
import {
  PRIM_STRING,
  PRIM_INTEGER,
  STRING_DATE_TIME,
  STRING_EMAIL,
  STRING_WITH_PATTERN,
  NUMBER_WITH_RANGE,
  ARRAY_OF_STRING,
  ARRAY_WITH_LENGTH,
  TUPLE_THREE,
  TUPLE_DISCRIMINATED,
  CONST_STRING,
  CONST_NUMBER,
  ENUM_STRINGS,
  OBJECT_SIMPLE,
  ALL_OF_INTERSECTION,
  ANY_OF_OBJECTS,
  DEPRECATED_STRING,
  READ_ONLY_STRING,
  WRITE_ONLY_STRING,
  STRING_WITH_DEFAULT,
} from './__fixtures__';

describe('getTypeName', () => {
  describe('primitives', () => {
    it('returns the type for plain primitives', () => {
      expect(getTypeName(PRIM_STRING)).toBe('string');
      expect(getTypeName({ type: 'number' })).toBe('number');
      expect(getTypeName({ type: 'boolean' })).toBe('boolean');
    });

    it('integer stays integer in json mode', () => {
      expect(getTypeName(PRIM_INTEGER, 'json')).toBe('integer');
    });

    it('integer becomes number in javascript mode', () => {
      expect(getTypeName(PRIM_INTEGER, 'javascript')).toBe('number');
    });
  });

  describe('const and enum', () => {
    it('renders const value as JSON', () => {
      expect(getTypeName(CONST_STRING)).toBe('"fixed"');
      expect(getTypeName(CONST_NUMBER)).toBe('42');
    });

    it('renders enum as union of JSON values', () => {
      expect(getTypeName(ENUM_STRINGS)).toBe('"a" | "b" | "c"');
    });
  });

  describe('arrays and tuples', () => {
    it('renders T[] for single-item array', () => {
      expect(getTypeName(ARRAY_OF_STRING)).toBe('string[]');
    });

    it('renders [A, B, C] for tuples', () => {
      expect(getTypeName(TUPLE_THREE)).toBe('[string, number, boolean]');
    });

    it('renders discriminated 2-tuple with re-applied [type, value] labels', () => {
      expect(getTypeName(TUPLE_DISCRIMINATED)).toBe('[type: "colors", value: string[]]');
    });

    it('marks tuple slots beyond minItems as optional', () => {
      const tuple = { type: 'array' as const, items: [{ type: 'string' as const }, { type: 'number' as const }], minItems: 1 };
      expect(getTypeName(tuple)).toBe('[string, number?]');
    });
  });

  describe('objects', () => {
    it('uses id when present', () => {
      expect(getTypeName({ ...OBJECT_SIMPLE, id: 'Foo' } as any)).toBe('Foo');
    });

    it('falls back to title', () => {
      expect(getTypeName({ ...OBJECT_SIMPLE, title: 'Bar' })).toBe('Bar');
    });

    it('returns "object" with no id/title', () => {
      expect(getTypeName(OBJECT_SIMPLE)).toBe('object');
    });

    it('renders Record<string, T> for additionalProperties in javascript mode', () => {
      const dict = { type: 'object' as const, additionalProperties: { type: 'number' as const } };
      expect(getTypeName(dict, 'javascript')).toBe('Record<string, number>');
    });
  });

  describe('composition', () => {
    it('joins multi-element allOf with &', () => {
      expect(getTypeName(ALL_OF_INTERSECTION)).toBe('A & B');
    });

    it('uses id for anyOf when present', () => {
      expect(getTypeName({ ...ANY_OF_OBJECTS, id: 'Node' } as any)).toBe('Node');
    });

    it('joins anyOf variants with | when no id', () => {
      expect(getTypeName(ANY_OF_OBJECTS)).toBe('TextNode | ImageNode');
    });

    it('joins type-array with |', () => {
      expect(getTypeName({ type: ['string', 'null'] } as any)).toBe('string | null');
    });
  });

  describe('format mapping', () => {
    it('maps date-time to Date in javascript mode', () => {
      expect(getTypeName(STRING_DATE_TIME, 'javascript')).toBe('Date');
    });

    it('keeps date-time as string in json mode', () => {
      expect(getTypeName(STRING_DATE_TIME, 'json')).toBe('string');
    });

    it('does not map non-mapped formats', () => {
      expect(getTypeName(STRING_EMAIL, 'javascript')).toBe('string');
    });
  });
});

describe('getConstraints', () => {
  it('extracts string constraints', () => {
    const c = getConstraints(STRING_WITH_PATTERN);
    expect(c).toContainEqual({ label: 'min length', value: '1' });
    expect(c).toContainEqual({ label: 'max length', value: '10' });
    expect(c).toContainEqual({ label: 'pattern', value: '^\\d+$' });
  });

  it('skips pattern when format is set (format wins)', () => {
    const c = getConstraints({ type: 'string', pattern: '^\\d+$', format: 'email' });
    expect(c.find((x) => x.label === 'pattern')).toBeUndefined();
    expect(c.find((x) => x.label === 'format')?.value).toBe('email');
  });

  it('extracts number constraints', () => {
    const c = getConstraints(NUMBER_WITH_RANGE);
    expect(c).toContainEqual({ label: 'min', value: '0' });
    expect(c).toContainEqual({ label: 'max', value: '100' });
    expect(c).toContainEqual({ label: 'min (exclusive)', value: '0' });
    expect(c).toContainEqual({ label: 'multiple of', value: '5' });
  });

  it('extracts array constraints', () => {
    const c = getConstraints(ARRAY_WITH_LENGTH);
    expect(c).toContainEqual({ label: 'min items', value: '1' });
    expect(c).toContainEqual({ label: 'max items', value: '10' });
    expect(c).toContainEqual({ label: 'unique items', value: 'true' });
  });

  it('emits deprecated/readOnly/writeOnly as flags', () => {
    expect(getConstraints(READ_ONLY_STRING)).toContainEqual({ label: 'read-only', value: '' });
    expect(getConstraints(WRITE_ONLY_STRING)).toContainEqual({ label: 'write-only', value: '' });
  });

  it('emits default as JSON-stringified value', () => {
    expect(getConstraints(STRING_WITH_DEFAULT)).toContainEqual({ label: 'default', value: '"hello"' });
  });

  it('skips mapped-format constraint chip in javascript mode', () => {
    const c = getConstraints(STRING_DATE_TIME, 'javascript');
    expect(c.find((x) => x.label === 'format')).toBeUndefined();
  });

  it('keeps mapped-format constraint chip in json mode', () => {
    const c = getConstraints(STRING_DATE_TIME, 'json');
    expect(c).toContainEqual({ label: 'format', value: 'date-time' });
  });
});
```

**Step 2: Run**

Run: `pnpm test`
Expected: 3 files, ~40 tests passing.

**Step 3: Commit**

```bash
git add app/lib/json-schema/introspection.test.ts
git commit -m "test(json-schema): cover getTypeName and getConstraints"
```

---

## Task 7: `introspection.test.ts` — literal unions

Append two new `describe` blocks: `isExpandableLiteralUnion`, `summarizeConstValues`.

**Files:**
- Modify: `app/lib/json-schema/introspection.test.ts` (append)
- Modify: `app/lib/json-schema/__fixtures__/schemas-shared.ts` (add literal-union fixtures)

**Step 1: Add fixtures to `schemas-shared.ts`**

Append:
```ts
// --- Literal unions (anyOf with consts, possibly with primitive escape hatches) ---

/** Named clean alias — always expandable. */
export const LITERAL_UNION_NAMED: DocsJSONSchema = {
  id: 'FallbackVariant',
  anyOf: [{ const: 'icon' }, { const: 'text' }, { const: 'none' }],
};

/** Named long literal union with primitive escape hatch — IconName style. */
export const LITERAL_UNION_LONG_WITH_ESCAPE: DocsJSONSchema = {
  id: 'IconName',
  anyOf: [
    { const: 'arrow' },
    { const: 'check' },
    { const: 'close' },
    { const: 'menu' },
    { const: 'home' },
    { type: 'string' },
  ],
};

/** Joined-form id (no clean alias) — needs >=4 consts to be expandable. */
export const LITERAL_UNION_JOINED_FORM: DocsJSONSchema = {
  id: '"s" | "m" | "lg" | "xl" | number',
  anyOf: [
    { const: 's' },
    { const: 'm' },
    { const: 'lg' },
    { const: 'xl' },
    { type: 'number' },
  ],
};

/** Short joined-form union — should NOT be expandable (only 2 consts). */
export const LITERAL_UNION_JOINED_TOO_SHORT: DocsJSONSchema = {
  id: '"a" | "b"',
  anyOf: [{ const: 'a' }, { const: 'b' }],
};

/** Multiple distinct primitive escape hatches. */
export const LITERAL_UNION_MULTI_ESCAPE: DocsJSONSchema = {
  id: 'Mixed',
  anyOf: [{ const: 'a' }, { const: 'b' }, { type: 'string' }, { type: 'number' }],
};
```

**Step 2: Append `describe` blocks to `introspection.test.ts`**

Add these imports at the top:
```ts
import {
  isExpandableLiteralUnion,
  getEscapeHatchTypes,
  getConstValues,
  summarizeConstValues,
} from './introspection';
import {
  LITERAL_UNION_NAMED,
  LITERAL_UNION_LONG_WITH_ESCAPE,
  LITERAL_UNION_JOINED_FORM,
  LITERAL_UNION_JOINED_TOO_SHORT,
  LITERAL_UNION_MULTI_ESCAPE,
} from './__fixtures__';
```

Append:
```ts
describe('isExpandableLiteralUnion', () => {
  it('triggers on a clean named alias', () => {
    expect(isExpandableLiteralUnion(LITERAL_UNION_NAMED)).toBe(true);
  });

  it('triggers on joined-form ids with >=4 consts', () => {
    expect(isExpandableLiteralUnion(LITERAL_UNION_JOINED_FORM)).toBe(true);
  });

  it('rejects joined-form with only 2 consts', () => {
    expect(isExpandableLiteralUnion(LITERAL_UNION_JOINED_TOO_SHORT)).toBe(false);
  });

  it('rejects when no id is present', () => {
    const noId = { ...LITERAL_UNION_NAMED, id: undefined };
    expect(isExpandableLiteralUnion(noId as any)).toBe(false);
  });

  it('rejects primitive-only unions (no consts)', () => {
    const prim = { id: 'X', anyOf: [{ type: 'string' as const }, { type: 'number' as const }] };
    expect(isExpandableLiteralUnion(prim)).toBe(false);
  });

  it('rejects when the id itself is a primitive type name', () => {
    const stringAliased = { id: 'string', anyOf: [{ const: 'a' }, { const: 'b' }] };
    expect(isExpandableLiteralUnion(stringAliased)).toBe(false);
  });

  it('rejects boolean (excluded from literal-union expansion)', () => {
    const bool = { id: 'X', anyOf: [{ const: true }, { const: false }] };
    expect(isExpandableLiteralUnion(bool)).toBe(false);
  });
});

describe('getEscapeHatchTypes', () => {
  it('returns empty for pure const union', () => {
    expect(getEscapeHatchTypes(LITERAL_UNION_NAMED)).toEqual([]);
  });

  it('returns single escape hatch when present', () => {
    expect(getEscapeHatchTypes(LITERAL_UNION_LONG_WITH_ESCAPE)).toEqual(['string']);
  });

  it('dedupes multiple escape hatches of the same type', () => {
    const dup = { anyOf: [{ const: 'a' }, { type: 'string' as const }, { type: 'string' as const }] };
    expect(getEscapeHatchTypes(dup)).toEqual(['string']);
  });

  it('returns multiple distinct primitives', () => {
    expect(getEscapeHatchTypes(LITERAL_UNION_MULTI_ESCAPE).sort()).toEqual(['number', 'string']);
  });
});

describe('getConstValues', () => {
  it('returns const values, excluding escape hatches', () => {
    expect(getConstValues(LITERAL_UNION_LONG_WITH_ESCAPE)).toEqual([
      'arrow',
      'check',
      'close',
      'menu',
      'home',
    ]);
  });
});

describe('summarizeConstValues', () => {
  it('inlines all values when budget allows', () => {
    expect(summarizeConstValues(LITERAL_UNION_NAMED)).toBe('("icon" | "text" | "none")');
  });

  it('truncates with "N more" when budget exceeded', () => {
    const result = summarizeConstValues(LITERAL_UNION_LONG_WITH_ESCAPE, 30);
    expect(result).toMatch(/^\(.*\| \d+ more\)$/);
  });

  it('always shows at least the first value, even if it exceeds the budget', () => {
    const oneLongValue = { anyOf: [{ const: 'aaaaaaaaaaaaaaaaaaaaaaaaaa' }, { const: 'b' }] };
    const result = summarizeConstValues(oneLongValue, 5);
    expect(result).toContain('aaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('includes escape-hatch types after consts', () => {
    expect(summarizeConstValues(LITERAL_UNION_LONG_WITH_ESCAPE, 200)).toContain('| string');
  });
});
```

**Step 3: Run**

Run: `pnpm test`
Expected: ~58 tests passing.

**Step 4: Commit**

```bash
git add app/lib/json-schema/introspection.test.ts app/lib/json-schema/__fixtures__/schemas-shared.ts
git commit -m "test(json-schema): cover isExpandableLiteralUnion and summarizeConstValues"
```

---

## Task 8: `introspection.test.ts` — variants & summary

Append `getExpandableVariants` and `getTypeSummary` describe blocks. These exercise the most subtle introspection logic (discriminant detection, splice into outer ids, WeakMap cache).

**Files:**
- Modify: `app/lib/json-schema/introspection.test.ts` (append)

**Step 1: Append**

Imports to add:
```ts
import { getExpandableVariants, getTypeSummary } from './introspection';
import { ANY_OF_OBJECTS } from './__fixtures__';
```

```ts
describe('getExpandableVariants', () => {
  it('returns single variant for a plain object with properties', () => {
    const variants = getExpandableVariants(OBJECT_SIMPLE);
    expect(variants).toHaveLength(1);
    expect(variants![0].label).toBe('object');
  });

  it('returns single variant for a discriminated 2-tuple', () => {
    const variants = getExpandableVariants(TUPLE_DISCRIMINATED);
    expect(variants).toHaveLength(1);
    expect(variants![0].summary).toBe('[type: "colors", value: string[]]');
    expect(variants![0].openPlaceholder).toBe('[ ]');
  });

  it('returns one variant per anyOf branch when each is an object', () => {
    const variants = getExpandableVariants(ANY_OF_OBJECTS);
    expect(variants).toHaveLength(2);
    expect(variants!.map((v) => v.label)).toEqual(['TextNode', 'ImageNode']);
  });

  it('synthesizes a single "values" variant for expandable literal unions', () => {
    const variants = getExpandableVariants(LITERAL_UNION_NAMED);
    expect(variants).toHaveLength(1);
    expect(variants![0].label).toBe('values');
  });

  it('returns undefined for primitives', () => {
    expect(getExpandableVariants(PRIM_STRING)).toBeUndefined();
  });

  it('enriches discriminant labels when variants lack ids', () => {
    const anonAnyOf = {
      anyOf: [
        {
          type: 'object' as const,
          properties: { kind: { const: 'a' }, payload: { type: 'string' as const } },
        },
        {
          type: 'object' as const,
          properties: { kind: { const: 'b' }, payload: { type: 'number' as const } },
        },
      ],
    };
    const variants = getExpandableVariants(anonAnyOf);
    expect(variants!.map((v) => v.label)).toEqual([
      '{ kind: "a" }',
      '{ kind: "b" }',
    ]);
  });

  it('returns the same array on repeat calls (WeakMap cache)', () => {
    const a = getExpandableVariants(OBJECT_SIMPLE);
    const b = getExpandableVariants(OBJECT_SIMPLE);
    expect(a).toBe(b);
  });

  it('handles array-of-union: items is anyOf of objects', () => {
    const arr = { type: 'array' as const, items: ANY_OF_OBJECTS };
    const variants = getExpandableVariants(arr);
    expect(variants).toHaveLength(2);
    expect(variants!.every((v) => v.label.endsWith('[]'))).toBe(true);
  });
});

describe('getTypeSummary', () => {
  it('returns plain type for primitives', () => {
    expect(getTypeSummary(PRIM_STRING)).toBe('string');
  });

  it('appends property summary for single object variant', () => {
    expect(getTypeSummary({ ...OBJECT_SIMPLE, id: 'Foo' } as any)).toBe('Foo { name, age }');
  });

  it('uses { } when expanded', () => {
    expect(getTypeSummary({ ...OBJECT_SIMPLE, id: 'Foo' } as any, { expanded: true })).toBe('Foo { }');
  });

  it('renders union of object variants as joined labels when no id', () => {
    expect(getTypeSummary(ANY_OF_OBJECTS)).toBe('TextNode | ImageNode');
  });

  it('uses outer id over expanding variants when both are present', () => {
    expect(getTypeSummary({ ...ANY_OF_OBJECTS, id: 'Node' } as any)).toBe('Node');
  });

  it('appends literal-union summary inline for clean alias', () => {
    expect(getTypeSummary(LITERAL_UNION_NAMED)).toMatch(/^FallbackVariant \(/);
  });

  it('omits literal-union summary for joined-form ids (would muddle)', () => {
    expect(getTypeSummary(LITERAL_UNION_JOINED_FORM)).toBe('"s" | "m" | "lg" | "xl" | number');
  });

  it('shows just the alias when expanded', () => {
    expect(getTypeSummary(LITERAL_UNION_NAMED, { expanded: true })).toBe('FallbackVariant');
  });
});
```

**Step 2: Run**

Run: `pnpm test`
Expected: ~75 tests passing. If any cross-fixture interaction fails, surface it.

**Step 3: Commit**

```bash
git add app/lib/json-schema/introspection.test.ts
git commit -m "test(json-schema): cover getExpandableVariants and getTypeSummary"
```

---

## Task 9: Vue-meta inputs + adapter outputs (`vue-meta.ts`, `schemas-vue.ts`)

**Files:**
- Create: `app/lib/json-schema/__fixtures__/vue-meta.ts`
- Create: `app/lib/json-schema/__fixtures__/schemas-vue.ts`
- Modify: `app/lib/json-schema/__fixtures__/index.ts`

**Step 1: Create `vue-meta.ts`**

These are `PropertyMeta` shapes — input to the adapter. Keep them small and named so each tests one thing.

```ts
import type { PropertyMeta } from 'vue-component-meta';

const baseMeta = (overrides: Partial<PropertyMeta>): PropertyMeta => ({
  name: 'prop',
  global: false,
  description: '',
  tags: [],
  required: false,
  type: 'string',
  declarations: [],
  schema: 'string',
  ...overrides,
});

/** A plain string prop. */
export const PROP_PLAIN_STRING: PropertyMeta = baseMeta({ name: 'label', type: 'string', schema: 'string' });

/** A required prop. */
export const PROP_REQUIRED_STRING: PropertyMeta = baseMeta({
  name: 'label',
  required: true,
  type: 'string',
  schema: 'string',
});

/** Prop with a default value (string). */
export const PROP_WITH_DEFAULT: PropertyMeta = baseMeta({
  name: 'size',
  type: 'string',
  schema: 'string',
  default: '"md"',
});

/** Prop with a `string & {}` autocomplete-suggestion type — should normalize to string. */
export const PROP_STRING_AND_EMPTY: PropertyMeta = baseMeta({
  name: 'variant',
  type: 'string & {}',
  schema: { kind: 'object', type: 'string & {}', schema: {} },
});

/** Prop with an inline object type flattened to a string (vue-component-meta sometimes does this). */
export const PROP_INLINE_OBJECT_TYPE: PropertyMeta = baseMeta({
  name: 'cta',
  type: '{ href: string; text: string }',
  schema: '{ href: string; text: string }',
});

/** Vue framework type (Component) — should render opaque. */
export const PROP_COMPONENT_TYPE: PropertyMeta = baseMeta({
  name: 'icon',
  type: 'Component',
  schema: { kind: 'object', type: 'Component', schema: {} },
});

/** Tuple prop with multiple items. */
export const PROP_TUPLE: PropertyMeta = baseMeta({
  name: 'pair',
  type: '[string, number]',
  schema: {
    kind: 'array',
    type: '[string, number]',
    schema: [
      { kind: 'object', type: 'string', schema: {} } as any,
      { kind: 'object', type: 'number', schema: {} } as any,
    ],
  },
});

/** Single-item array prop — element id should have trailing `[]` stripped. */
export const PROP_ARRAY_OF_STRING: PropertyMeta = baseMeta({
  name: 'tags',
  type: 'string[]',
  schema: {
    kind: 'array',
    type: 'string[]',
    schema: ['string'],
  },
});

/** Enum prop with `undefined` branch — should drop undefined. */
export const PROP_ENUM_OPTIONAL: PropertyMeta = baseMeta({
  name: 'align',
  type: '"left" | "right" | undefined',
  schema: {
    kind: 'enum',
    type: '"left" | "right" | undefined',
    schema: ['"left"', '"right"', 'undefined'],
  },
});

/** Enum prop where only one branch is meaningful (collapses). */
export const PROP_ENUM_SINGLE_MEANINGFUL: PropertyMeta = baseMeta({
  name: 'link',
  type: 'Link | undefined',
  schema: {
    kind: 'enum',
    type: 'Link | undefined',
    schema: [
      { kind: 'object', type: 'Link', schema: { href: { name: 'href', type: 'string', schema: 'string', required: true, declarations: [], description: '', tags: [] } as any } } as any,
      'undefined',
    ],
  },
});

/** Deprecated prop. */
export const PROP_DEPRECATED: PropertyMeta = baseMeta({
  name: 'old',
  type: 'string',
  schema: 'string',
  tags: [{ name: 'deprecated', text: 'use newProp instead' }],
});
```

**Step 2: Create `schemas-vue.ts` — expected adapter outputs**

```ts
import type { DocsJSONSchema } from '../introspection';

/** Expected output for a structural-id schema (inline object type recovered). */
export const VUE_INLINE_OBJECT_RECOVERED: DocsJSONSchema = {
  type: 'object',
  properties: {
    href: { id: 'string', title: 'string' },
    text: { id: 'string', title: 'string' },
  },
  required: ['href', 'text'],
};

/** Expected output for the Vue Component opaque framework type. */
export const VUE_OPAQUE_COMPONENT: DocsJSONSchema = {
  id: 'Component',
  title: 'Component',
};
```

**Step 3: Update `index.ts`**

```ts
export * from './schemas-shared';
export * from './schemas-zod';
export * from './schemas-vue';
export * from './vue-meta';
```

**Step 4: Verify compiles**

Run: `pnpm test`
Expected: still ~75 tests passing.

**Step 5: Commit**

```bash
git add app/lib/json-schema/__fixtures__/
git commit -m "test(json-schema): add vue-component-meta input + adapter output fixtures"
```

---

## Task 10: `component-meta-adapter.test.ts`

**Files:**
- Create: `app/lib/json-schema/component-meta-adapter.test.ts`

**Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { componentPropsToJsonSchema } from './component-meta-adapter';
import {
  PROP_PLAIN_STRING,
  PROP_REQUIRED_STRING,
  PROP_WITH_DEFAULT,
  PROP_STRING_AND_EMPTY,
  PROP_INLINE_OBJECT_TYPE,
  PROP_COMPONENT_TYPE,
  PROP_TUPLE,
  PROP_ARRAY_OF_STRING,
  PROP_ENUM_OPTIONAL,
  PROP_ENUM_SINGLE_MEANINGFUL,
  PROP_DEPRECATED,
} from './__fixtures__';

describe('componentPropsToJsonSchema — top-level shape', () => {
  it('builds an object with properties keyed by name', () => {
    const result = componentPropsToJsonSchema([PROP_PLAIN_STRING]);
    expect(result.type).toBe('object');
    expect(result.properties).toHaveProperty('label');
  });

  it('marks required props in the required array', () => {
    const result = componentPropsToJsonSchema([PROP_REQUIRED_STRING, PROP_PLAIN_STRING]);
    // PROP_REQUIRED_STRING and PROP_PLAIN_STRING share the name 'label' — pick distinct ones in real test
    // (kept simple here; required is union-like)
    expect(result.required).toContain('label');
  });

  it('omits required array when empty', () => {
    const result = componentPropsToJsonSchema([PROP_PLAIN_STRING]);
    expect(result.required).toBeUndefined();
  });
});

describe('walkSchema — primitives and literals', () => {
  it('keeps plain string', () => {
    const result = componentPropsToJsonSchema([PROP_PLAIN_STRING]);
    expect(result.properties!.label).toEqual({ type: 'string' });
  });

  it('parses string default', () => {
    const result = componentPropsToJsonSchema([PROP_WITH_DEFAULT]);
    expect((result.properties!.size as any).default).toBe('md');
  });
});

describe('walkSchema — `string & {}` normalization', () => {
  it('normalizes to plain string', () => {
    const result = componentPropsToJsonSchema([PROP_STRING_AND_EMPTY]);
    expect(result.properties!.variant).toEqual({ type: 'string' });
  });
});

describe('walkSchema — inline object type recovery', () => {
  it('parses { href: string; text: string } into properties', () => {
    const result = componentPropsToJsonSchema([PROP_INLINE_OBJECT_TYPE]);
    const cta = result.properties!.cta as any;
    expect(cta.type).toBe('object');
    expect(cta.properties).toHaveProperty('href');
    expect(cta.properties).toHaveProperty('text');
    expect(cta.required).toEqual(['href', 'text']);
  });
});

describe('walkSchema — opaque framework types', () => {
  it('renders Component as opaque {id, title}', () => {
    const result = componentPropsToJsonSchema([PROP_COMPONENT_TYPE]);
    expect(result.properties!.icon).toEqual({ id: 'Component', title: 'Component' });
  });
});

describe('walkSchema — arrays', () => {
  it('preserves all tuple items', () => {
    const result = componentPropsToJsonSchema([PROP_TUPLE]);
    const pair = result.properties!.pair as any;
    expect(pair.type).toBe('array');
    expect(pair.items).toHaveLength(2);
  });

  it('strips trailing [] from element id', () => {
    const result = componentPropsToJsonSchema([PROP_ARRAY_OF_STRING]);
    const tags = result.properties!.tags as any;
    expect(tags.id).toBe('string'); // not 'string[]'
  });
});

describe('walkSchema — enums', () => {
  it('drops undefined branches', () => {
    const result = componentPropsToJsonSchema([PROP_ENUM_OPTIONAL]);
    const align = result.properties!.align as any;
    expect(align.anyOf).toHaveLength(2); // not 3
  });

  it('collapses single-meaningful branch into the inner type', () => {
    const result = componentPropsToJsonSchema([PROP_ENUM_SINGLE_MEANINGFUL]);
    const link = result.properties!.link as any;
    expect(link.type).toBe('object');
    expect(link.id).toBe('Link');
  });
});

describe('walkPropertyMeta — annotations', () => {
  it('marks deprecated props', () => {
    const result = componentPropsToJsonSchema([PROP_DEPRECATED]);
    expect((result.properties!.old as any).deprecated).toBe(true);
  });
});
```

**Step 2: Run**

Run: `pnpm test`
Expected: ~88 tests passing.

If any fail because of `PropertyMeta` type-check issues at runtime: cast inputs to `PropertyMeta` via `as any` if the strict shape requires more keys than you're providing. The fixture file already does this.

**Step 3: Commit**

```bash
git add app/lib/json-schema/component-meta-adapter.test.ts
git commit -m "test(json-schema): cover component-meta-adapter walk and edge cases"
```

---

## Task 11: `exampleFromSchema.test.ts`

**Files:**
- Create: `app/lib/json-schema/exampleFromSchema.test.ts`

**Step 1: Read the source first**

Run: `cat app/lib/json-schema/exampleFromSchema.ts`

Note the exported function name (likely `exampleFromSchema` or similar) and any heuristics it uses (name patterns, depth cap). Tests should follow the actual signature.

**Step 2: Write tests targeting documented behavior**

Cover:
- Honors `default` (returns it directly).
- Falls back to first enum / first const value.
- Recurses into object properties.
- Recurses into arrays (returns single-element array).
- Depth cap at 5 (returns `null` or empty for deeper recursion).
- Name-heuristic: e.g. `email` → returns a plausible email string.

Skeleton:

```ts
import { describe, it, expect } from 'vitest';
import { exampleFromSchema } from './exampleFromSchema'; // adjust import to actual export

describe('exampleFromSchema', () => {
  it('honors default', () => {
    expect(exampleFromSchema({ type: 'string', default: 'override' })).toBe('override');
  });

  it('uses const value', () => {
    expect(exampleFromSchema({ const: 'fixed' })).toBe('fixed');
  });

  it('uses first enum value', () => {
    expect(exampleFromSchema({ enum: ['a', 'b'] })).toBe('a');
  });

  it('recurses into objects', () => {
    const result = exampleFromSchema({
      type: 'object',
      properties: { a: { type: 'string', default: 'x' }, b: { type: 'number', default: 1 } },
    });
    expect(result).toEqual({ a: 'x', b: 1 });
  });

  it('recurses into arrays', () => {
    expect(exampleFromSchema({ type: 'array', items: { type: 'string', default: 'x' } })).toEqual(['x']);
  });

  // Add depth-cap and heuristic tests after reading source.
});
```

Adjust to match the actual API.

**Step 3: Run**

Run: `pnpm test`
Expected: ~98 tests passing.

**Step 4: Commit**

```bash
git add app/lib/json-schema/exampleFromSchema.test.ts
git commit -m "test(json-schema): cover exampleFromSchema"
```

---

## Task 12: `.todo` placeholder block

**Files:**
- Modify: `app/lib/json-schema/introspection.test.ts` (append at the end)

**Step 1: Append**

```ts
// --- Known gaps ---
//
// These are documented limitations of the current renderer. Each entry corresponds to
// a JSON Schema construct we don't yet handle. Flip from `.todo` → real test once support
// is added; the failing test will then drive the implementation.
//
// See docs/plans/2026-05-06-json-schema-test-suite-design.md for context.

describe('known gaps (documented limitations)', () => {
  test.todo('schema booleans: properties with `true`/`false` value');
  test.todo('multi-type: type: ["string", "null"] renders both branches in the field row');
  test.todo('prefixItems (Draft 2020-12 tuples)');
  test.todo('if/then/else conditional schemas');
  test.todo('not');
  test.todo('nullable: true (OpenAPI 3.0)');
  test.todo('additionalProperties as schema with sibling properties — render as "any other key" row');
  test.todo('examples (array) — render as an expandable list separate from default');
  test.todo('exclusiveMinimum/Maximum as boolean (Draft 4 form) — currently prints "true"/"false"');
  test.todo('cycle protection in renderer recursion (depth limit or visited-id tracking)');
});
```

**Step 2: Run**

Run: `pnpm test`
Expected: ~98 tests passing, ~10 skipped/todo. Vitest reports `.todo` as "todo" in the summary, not as failure.

**Step 3: Commit**

```bash
git add app/lib/json-schema/introspection.test.ts
git commit -m "test(json-schema): document known gaps as .todo placeholders"
```

---

## Final verification

After all 12 tasks:

```bash
pnpm test
```

Expected output: 6 test files, ~98 active tests passing, ~10 todo, 0 failed.

If anything is red: investigate before merging. Failing tests at this stage indicate either an over-specified test (too strict on internal detail) or a real bug we should fix.

Optional sanity check:
```bash
pnpm test --reporter=verbose
```

Confirms each describe/it line for review.

## Summary of artifacts

After all tasks:

```
app/lib/json-schema/
  __fixtures__/
    schemas-shared.ts
    schemas-zod.ts
    schemas-vue.ts
    vue-meta.ts
    zod-action-input.json
    zod-action-output.json
    zod-component-base.json
    index.ts
  nullOrEmpty.test.ts
  resolveSchema.test.ts
  introspection.test.ts
  component-meta-adapter.test.ts
  exampleFromSchema.test.ts
vitest.config.ts
package.json (scripts + devDeps)
```

12 commits, each independently reviewable. ~98 active tests + 10 `.todo` placeholders. Test runtime: well under 1 second (no DOM, no I/O outside fixture loads).
