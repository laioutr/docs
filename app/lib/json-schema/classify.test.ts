import { describe, expect, it } from 'vitest';
import {
  ALL_OF_INTERSECTION,
  ALL_OF_SINGLE_WRAP,
  ANY_OF_OBJECTS,
  ARRAY_OF_STRING,
  CONST_NUMBER,
  CONST_STRING,
  ENUM_STRINGS,
  LITERAL_UNION_JOINED_TOO_SHORT,
  LITERAL_UNION_LONG_WITH_ESCAPE,
  LITERAL_UNION_NAMED,
  OBJECT_SIMPLE,
  PRIM_INTEGER,
  PRIM_STRING,
  RECURSIVE_REF,
  REF_TO_DEFS,
  STRING_DATE_TIME,
  TUPLE_DISCRIMINATED,
  TUPLE_THREE,
  VUE_OPAQUE_COMPONENT,
} from './__fixtures__';
import { classify } from './classify';

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
    const k = classify({ type: 'object', properties: {} });
    expect(k.kind).toBe('empty');
  });

  it('object with no properties and no additionalProperties → unknown (or empty)', () => {
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
