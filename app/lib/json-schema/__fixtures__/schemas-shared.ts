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
