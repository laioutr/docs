import { describe, it, expect } from 'vitest';
import { exampleFromSchema } from './exampleFromSchema';

describe('exampleFromSchema — resolution priority', () => {
  it('honors const value', () => {
    expect(exampleFromSchema({ const: 'fixed' })).toBe('fixed');
  });

  it('uses first enum value', () => {
    expect(exampleFromSchema({ enum: ['a', 'b', 'c'] })).toBe('a');
  });

  it('honors default when present', () => {
    expect(exampleFromSchema({ type: 'string', default: 'hello' })).toBe('hello');
  });

  it('const wins over default', () => {
    expect(exampleFromSchema({ const: 'fixed', default: 'override' })).toBe('fixed');
  });

  it('enum wins over default', () => {
    expect(exampleFromSchema({ enum: ['from-enum'], default: 'from-default' })).toBe('from-enum');
  });
});

describe('exampleFromSchema — primitives', () => {
  it('returns "example" for plain string with no field name', () => {
    expect(exampleFromSchema({ type: 'string' })).toBe('example');
  });

  it('returns 0 for plain number', () => {
    expect(exampleFromSchema({ type: 'number' })).toBe(0);
  });

  it('returns 1 for plain integer', () => {
    expect(exampleFromSchema({ type: 'integer' })).toBe(1);
  });

  it('returns true for boolean', () => {
    expect(exampleFromSchema({ type: 'boolean' })).toBe(true);
  });

  it('returns null for null type', () => {
    expect(exampleFromSchema({ type: 'null' })).toBeNull();
  });

  it('treats schema with properties but no type as object (default-branch fallthrough)', () => {
    // Hits exampleFromSchema.ts line 85: no type set, but `properties` present.
    const schema = { properties: { name: { type: 'string' as const, default: 'Alice' } } };
    expect(exampleFromSchema(schema as any)).toEqual({ name: 'Alice' });
  });

  it('returns "example" for schema with neither type nor properties', () => {
    // Hits exampleFromSchema.ts line 86: total fallback.
    expect(exampleFromSchema({})).toBe('example');
  });
});

describe('exampleFromSchema — format mapping', () => {
  it('maps email format', () => {
    expect(exampleFromSchema({ type: 'string', format: 'email' })).toBe('customer@example.com');
  });

  it('maps date-time format', () => {
    expect(exampleFromSchema({ type: 'string', format: 'date-time' })).toBe('2025-01-15T10:00:00Z');
  });

  it('maps uuid format', () => {
    expect(exampleFromSchema({ type: 'string', format: 'uuid' })).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('falls back to "example" for unknown format', () => {
    expect(exampleFromSchema({ type: 'string', format: 'something-custom' })).toBe('example');
  });

  it('maps uri-reference format (hyphenated key)', () => {
    expect(exampleFromSchema({ type: 'string', format: 'uri-reference' })).toBe('/path/to/resource');
  });
});

// Tests cover a representative sample of the regex shapes in STRING_HEURISTICS
// (anchored suffix, alternation, word boundary). Each pattern is a static lookup,
// so we don't repeat for every entry — see STRING_HEURISTICS for the full list.
describe('exampleFromSchema — string field-name heuristics', () => {
  it('matches email pattern', () => {
    expect(exampleFromSchema({ type: 'string' }, 'userEmail')).toBe('customer@example.com');
  });

  it('matches url/href/link pattern', () => {
    expect(exampleFromSchema({ type: 'string' }, 'href')).toBe('https://example.com');
  });

  it('matches id pattern (suffix)', () => {
    expect(exampleFromSchema({ type: 'string' }, 'productId')).toBe('abc-123');
  });

  it('matches title/label pattern', () => {
    expect(exampleFromSchema({ type: 'string' }, 'label')).toBe('Example');
  });

  it('format wins over field name (format checked first)', () => {
    expect(exampleFromSchema({ type: 'string', format: 'uuid' }, 'userId')).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});

describe('exampleFromSchema — number heuristics', () => {
  it('uses minimum when set', () => {
    expect(exampleFromSchema({ type: 'number', minimum: 100 })).toBe(100);
  });

  it('matches price/amount/total pattern', () => {
    expect(exampleFromSchema({ type: 'number' }, 'totalAmount')).toBe(29.99);
  });

  it('matches quantity pattern', () => {
    expect(exampleFromSchema({ type: 'number' }, 'quantity')).toBe(1);
  });
});

describe('exampleFromSchema — composition', () => {
  it('picks first non-null variant from anyOf', () => {
    const schema = { anyOf: [{ type: 'null' as const }, { type: 'string' as const, default: 'picked' }] };
    expect(exampleFromSchema(schema)).toBe('picked');
  });

  it('handles type-array by picking first non-null', () => {
    expect(exampleFromSchema({ type: ['null', 'string'] as any })).toBe('example');
  });
});

describe('exampleFromSchema — recursion', () => {
  it('recurses into objects', () => {
    const schema = {
      type: 'object' as const,
      properties: {
        name: { type: 'string' as const, default: 'Alice' },
        count: { type: 'integer' as const, default: 7 },
      },
    };
    expect(exampleFromSchema(schema)).toEqual({ name: 'Alice', count: 7 });
  });

  it('passes property names through to heuristics', () => {
    const schema = {
      type: 'object' as const,
      properties: { email: { type: 'string' as const } },
    };
    expect(exampleFromSchema(schema)).toEqual({ email: 'customer@example.com' });
  });

  it('returns single-element array for array of items', () => {
    const schema = { type: 'array' as const, items: { type: 'string' as const, default: 'x' } };
    expect(exampleFromSchema(schema)).toEqual(['x']);
  });

  it('returns empty object for object with no properties', () => {
    expect(exampleFromSchema({ type: 'object' })).toEqual({});
  });

  it('caps recursion depth at 5 (returns {} beyond limit)', () => {
    // Build a 7-level deep nested object schema. Each non-leaf level wraps a `next`
    // property pointing one level deeper; the deepest level is a string with `default: 'leaf'`.
    // The depth-cap `if (depth > 5) return {}` at the top of generateValue fires before
    // recursion can reach the leaf, so somewhere in the result tree we hit `{}` instead of `'leaf'`.
    const deep = (n: number): any =>
      n === 0
        ? { type: 'string', default: 'leaf' }
        : { type: 'object', properties: { next: deep(n - 1) } };
    const result = exampleFromSchema(deep(7)) as any;
    // Walk down through `next` until we hit a node without one.
    let cursor = result;
    let levels = 0;
    while (cursor && typeof cursor === 'object' && 'next' in cursor) {
      cursor = cursor.next;
      levels += 1;
    }
    // Lock in the exact number of next-levels reached and the empty-object terminal shape.
    // (If you change the cap from `> 5`, recompute these values.)
    // The entry call is depth 0; objectExample recurses at depth+1. The first call
    // for which `depth > 5` is true is depth 6, which lands on the 6th `next:` value.
    expect(levels).toBe(6);
    expect(cursor).toEqual({});
  });
});
