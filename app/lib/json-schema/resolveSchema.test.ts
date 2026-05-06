import { describe, it, expect } from 'vitest';
import { resolveSchema } from './resolveSchema';
import {
  REF_TO_DEFS,
  ALL_OF_SINGLE_WRAP,
  ALL_OF_INTERSECTION,
  RECURSIVE_REF,
  DEFS_NEEDS_STAMPING,
  ZOD_ACTION_INPUT,
  ZOD_ACTION_OUTPUT,
  ZOD_COMPONENT_PRICES,
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

    it('handles the legacy `definitions` key the same as `$defs`', () => {
      const legacy = {
        definitions: {
          Color: { type: 'string' as const, enum: ['red', 'blue'] as const },
        },
        type: 'object' as const,
        properties: {
          color: { $ref: '#/definitions/Color' },
        },
      };
      const result = resolveSchema(legacy) as any;
      // Stamping happens in `definitions` too.
      expect(result.definitions.Color.id).toBe('Color');
      // Deref resolves through `definitions`.
      expect(result.properties.color.type).toBe('string');
      // Verify the stamped id survived the deref — properties.color should carry
      // the stamped id from the definition, not be a bare {type: 'string', enum: [...]}.
      expect(result.properties.color.id).toBe('Color');
    });
  });

  describe('dereferenceSync', () => {
    it('resolves a single-level $ref', () => {
      const result = resolveSchema(REF_TO_DEFS) as any;
      expect(result.type).toBe('object');
      expect(result.properties.id).toEqual({ type: 'string' });
    });

    it('resolves cyclic refs without looping (and produces usable shape)', () => {
      const result = resolveSchema(RECURSIVE_REF) as any;
      // Cycle protection didn't crash; non-cyclic siblings still resolved.
      expect(result.type).toBe('object');
      expect(result.properties.value).toEqual({ type: 'string' });
      // The cyclic point: children.items has been visited; the visited-node
      // short-circuit returns the cached object rather than producing null/undefined.
      expect(result.properties.children.type).toBe('array');
      expect(result.properties.children.items).toBeDefined();
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
    it('honors dereferenced: true (skips both stamping and deref)', () => {
      const result = resolveSchema(DEFS_NEEDS_STAMPING, { dereferenced: true }) as any;
      // Stamping skipped: Color def isn't given an id.
      expect(result.$defs.Color.id).toBeUndefined();
      // Deref skipped: properties.color stays as a $ref.
      expect(result.properties.color).toEqual({ $ref: '#/$defs/Color' });
    });
  });
});

describe('resolveSchema — real-schema integration (canonical-types/reflection)', () => {
  // Smoke tests using captured zod-emitted schemas. Anchor the suite in real shapes
  // (per design doc: "fixtures anchored in real shipped shapes catch the 'I forgot
  // zod emits this weird wrapper' class of bug"). See schemas-zod.ts for refresh recipe.

  it('ZOD_ACTION_INPUT: deref + allOf-unwrap leaves no $ref behind', () => {
    const result = resolveSchema(ZOD_ACTION_INPUT) as any;
    // Walk the result and confirm no $ref strings remain.
    const json = JSON.stringify(result);
    expect(json).not.toContain('"$ref"');
  });

  it('ZOD_ACTION_OUTPUT: stamps user-named definitions, skips synthetic __schemaN names', () => {
    // The captured output schema has both human-named definitions (e.g. PhoneNumber,
    // MailingAddress) and synthetic __schemaN ids. Stamping should hit the former, skip the latter.
    const result = resolveSchema(ZOD_ACTION_OUTPUT) as any;
    // Find at least one stamped human-named def by walking properties recursively.
    const findStampedIds = (s: any, ids: Set<string> = new Set()): Set<string> => {
      if (!s || typeof s !== 'object') return ids;
      if (typeof s.id === 'string' && !s.id.startsWith('__schema')) ids.add(s.id);
      for (const v of Object.values(s)) {
        if (typeof v === 'object' && v !== null) findStampedIds(v, ids);
      }
      return ids;
    };
    const stamped = findStampedIds(result);
    // We should find at least one human-named id stamped onto a property; we should NOT
    // find any __schemaN ids stamped (they'd appear in the output if stamping wrongly fired).
    expect(stamped.size).toBeGreaterThan(0);
    for (const id of stamped) expect(id).not.toMatch(/^__schema\d+$/);
  });

  it('ZOD_COMPONENT_PRICES: cross-referenced definitions resolve correctly', () => {
    // The prices schema has Money and Measurement defined as separate $defs/definitions
    // entries that reference each other (UnitPrice.price → Money, UnitPrice.quantity → Measurement).
    // After resolveSchema, the cross-references should be inlined.
    const result = resolveSchema(ZOD_COMPONENT_PRICES) as any;
    const json = JSON.stringify(result);
    expect(json).not.toContain('"$ref"');
  });

  it('ZOD_ACTION_INPUT: top-level shape is normalized; nested allOf wraps survive (shallow contract)', () => {
    // resolveSchema only normalizes the top level. Single-element allOf wraps inside
    // `definitions[X].properties.Y` survive — they get unwrapped when the renderer descends
    // (JsonSchemaFields, getArrayItems, getUnionVariants all re-call resolveSchema on sub-schemas).
    // This test pins that shallow contract; remove if resolveSchema is ever made recursive.
    const result = resolveSchema(ZOD_ACTION_INPUT) as any;
    // Top-level: any single-element allOf at the root must be unwrapped.
    expect(result.allOf?.length).not.toBe(1);
    // But nested allOf wraps inside definitions are expected to remain (shallow contract).
    // Just confirm we didn't accidentally make the function recursive — the bare existence
    // of *any* allOf below the top level confirms current behavior.
    const json = JSON.stringify(result);
    expect(json).toContain('"allOf"');
  });
});
