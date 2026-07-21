import { describe, expect, it, test } from 'vitest';
import {
  ALL_OF_INTERSECTION,
  ANY_OF_DISCRIMINATED_TUPLES_UNNAMED,
  ANY_OF_OBJECTS,
  ARRAY_OF_STRING,
  ARRAY_WITH_LENGTH,
  CONST_NUMBER,
  CONST_STRING,
  ENUM_STRINGS,
  LITERAL_UNION_JOINED_FORM,
  LITERAL_UNION_JOINED_TOO_SHORT,
  LITERAL_UNION_LONG_WITH_ESCAPE,
  LITERAL_UNION_MULTI_ESCAPE,
  LITERAL_UNION_NAMED,
  NUMBER_WITH_RANGE,
  OBJECT_SIMPLE,
  PRIM_INTEGER,
  PRIM_STRING,
  READ_ONLY_STRING,
  STRING_DATE_TIME,
  STRING_EMAIL,
  STRING_WITH_DEFAULT,
  STRING_WITH_PATTERN,
  TUPLE_DISCRIMINATED,
  TUPLE_THREE,
  WRITE_ONLY_STRING,
  ZOD_ARRAY_OF_NAMED_OBJECT,
  ZOD_ARRAY_OF_NAMED_UNION,
  ZOD_ARRAY_OF_UNNAMED_UNION,
  ZOD_INLINE_OBJECT_WITH_REFS,
  ZOD_NAMED_DISCRIMINATED_UNION,
  ZOD_OPEN_RECORD_NAMED,
  ZOD_PRIMITIVE_UNION,
  ZOD_TUPLE_ENUM_HEAD,
} from './__fixtures__';
import {
  getConstraints,
  getConstValues,
  getEscapeHatchTypes,
  getExpandableVariants,
  getTypeName,
  getTypeSummary,
  getVariantListDescriptionHtml,
  isExpandableLiteralUnion,
  isFieldDescriptionFromObject,
  summarizeConstValues,
} from './introspection';

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

    it('renders bare type:null as "null"', () => {
      expect(getTypeName({ type: 'null' })).toBe('null');
    });

    it('renders bare type:object (no properties) as "object"', () => {
      expect(getTypeName({ type: 'object' })).toBe('object');
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

  it('expands boolean-const unions today (see Task 12 todo: arguably should collapse to `boolean`)', () => {
    // Lock down current behavior: a clean-alias `id` with two boolean consts passes all
    // the gates (constCount >= 1, id not in PRIMITIVE_TYPE_NAMES, clean-alias regex matches).
    // Whether this should collapse to a plain `boolean` is a UX call — see Task 12.
    const bool = { id: 'X', anyOf: [{ const: true }, { const: false }] };
    expect(isExpandableLiteralUnion(bool)).toBe(true);
  });

  it('rejects a single-variant union', () => {
    // Hits the `variants.length < 2` branch (degenerate union).
    expect(isExpandableLiteralUnion({ id: 'X', anyOf: [{ const: 'a' }] })).toBe(false);
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

  it('returns multiple distinct primitives in insertion order', () => {
    expect(getEscapeHatchTypes(LITERAL_UNION_MULTI_ESCAPE)).toEqual(['string', 'number']);
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
    expect(result).toBe('("aaaaaaaaaaaaaaaaaaaaaaaaaa" | 1 more)');
  });

  it('includes escape-hatch types after consts', () => {
    expect(summarizeConstValues(LITERAL_UNION_LONG_WITH_ESCAPE, 200)).toContain('| string');
  });
});

describe('getExpandableVariants', () => {
  it('returns single variant for a plain object with properties', () => {
    const variants = getExpandableVariants(OBJECT_SIMPLE);
    expect(variants).toHaveLength(1);
    expect(variants![0]!.label).toBe('object');
  });

  it('returns single variant for a discriminated 2-tuple', () => {
    const variants = getExpandableVariants(TUPLE_DISCRIMINATED);
    expect(variants).toHaveLength(1);
    expect(variants![0]!.summary).toBe('[type: "colors", value: string[]]');
    expect(variants![0]!.openPlaceholder).toBe('[ ]');
  });

  it('returns one variant per anyOf branch when each is an object', () => {
    const variants = getExpandableVariants(ANY_OF_OBJECTS);
    expect(variants).toHaveLength(2);
    expect(variants!.map((v) => v.label)).toEqual(['TextNode', 'ImageNode']);
  });

  it('synthesizes a single "values" variant for expandable literal unions', () => {
    const variants = getExpandableVariants(LITERAL_UNION_NAMED);
    expect(variants).toHaveLength(1);
    expect(variants![0]!.label).toBe('values');
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

  it('uses tuple-shaped labels for an unnamed union of discriminated tuples', () => {
    // Without the originKind branch, `enrichWithDiscriminant` would overwrite each tuple
    // variant's label with the object-shaped `{ type: "color" }` fallback, misrepresenting
    // the underlying tuple. Mirroring with `[type: "color"]` parallels the object form
    // and stays distinct from the per-variant `summary` (`[type: "color", value: string]`)
    // shown alongside it in the variant-list row.
    const variants = getExpandableVariants(ANY_OF_DISCRIMINATED_TUPLES_UNNAMED);
    expect(variants!.map((v) => v.label)).toEqual([
      '[type: "color"]',
      '[type: "colors"]',
      '[type: "gradient"]',
    ]);
    expect(variants!.map((v) => v.summary)).toEqual([
      '[type: "color", value: string]',
      '[type: "colors", value: string[]]',
      '[type: "gradient", value: string[]]',
    ]);
  });

  it('returns the same array on repeat calls (WeakMap cache)', () => {
    const a = getExpandableVariants(OBJECT_SIMPLE);
    const b = getExpandableVariants(OBJECT_SIMPLE);
    expect(a).toBe(b);
  });

  it('handles array-of-union: items is anyOf of objects (variants stay bare; array-ness applied at summary level)', () => {
    const arr = { type: 'array' as const, items: ANY_OF_OBJECTS };
    const variants = getExpandableVariants(arr);
    expect(variants).toHaveLength(2);
    // Per-variant labels stay bare; array-ness is handled by getTypeSummary's `(T1 | T2)[]` wrapper.
    expect(variants!.map((v) => v.label)).toEqual(['TextNode', 'ImageNode']);
  });

  it('does not share results across structurally-equal but distinct schema objects', () => {
    // The cache is a WeakMap keyed by schema reference, NOT by structural equality.
    // Locks this contract so a future "let's hash schemas" change can't silently regress.
    const a = { type: 'object' as const, properties: { x: { type: 'string' as const } } };
    const b = { type: 'object' as const, properties: { x: { type: 'string' as const } } };
    expect(getExpandableVariants(a)).not.toBe(getExpandableVariants(b));
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

  it('preserves primitive and expandable object branches in a mixed union', () => {
    const productSpecificationValue = {
      anyOf: [
        { type: 'string' as const },
        { type: 'number' as const },
        { type: 'boolean' as const },
        {
          id: 'Measurement',
          type: 'object' as const,
          properties: { unit: { type: 'string' as const }, value: { type: 'number' as const } },
        },
        {
          id: 'Money',
          type: 'object' as const,
          properties: { amount: { type: 'number' as const }, currency: { type: 'string' as const } },
        },
      ],
    };

    expect(getTypeSummary(productSpecificationValue)).toBe('string | number | boolean | Measurement | Money');
    expect(
      getExpandableVariants(productSpecificationValue)?.map(({ label, expandable }) => ({ label, expandable }))
    ).toEqual([
      { label: 'string', expandable: false },
      { label: 'number', expandable: false },
      { label: 'boolean', expandable: false },
      { label: 'Measurement', expandable: true },
      { label: 'Money', expandable: true },
    ]);
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

  it('renders array-of-union as (T1 | T2)[]', () => {
    const arr = { type: 'array' as const, items: ANY_OF_OBJECTS };
    expect(getTypeSummary(arr)).toBe('(TextNode | ImageNode)[]');
  });

  it('splices property summary into outer-id when single variant has matching inner id', () => {
    // The most intricate single-variant logic: split outer id by `|`, find the inner-id
    // token, splice the property summary there. Hits introspection.ts lines 441-449.
    const spliceCase = {
      id: 'Foo | undefined',
      anyOf: [
        { type: 'object' as const, id: 'Foo', properties: { x: { type: 'string' as const } } },
      ],
    };
    expect(getTypeSummary(spliceCase as any)).toBe('Foo { x } | undefined');
  });

  it('falls through to plain id+props when outer id does not contain the inner id token', () => {
    // Outer id `Wrapper<Foo>` is not split-by-`|` to a `Foo` token, so the splice
    // doesn't apply and we get plain `Foo { x }`. Locks the fall-through path.
    const fallthrough = {
      id: 'Wrapper<Foo>',
      anyOf: [
        { type: 'object' as const, id: 'Foo', properties: { x: { type: 'string' as const } } },
      ],
    };
    // The function returns whichever of outer/inner id is set; both are set here.
    // Per source, single-variant with both ids and no token match falls back to
    // `${id} ${props}` using outerId. Run it and assert the actual output.
    const result = getTypeSummary(fallthrough as any);
    // Expected: 'Wrapper<Foo> { x }' — outer id with property summary (no splice).
    expect(result).toBe('Wrapper<Foo> { x }');
  });

  it('collapses an unnamed union of discriminated tuples into a compact head-merged form', () => {
    // Reproduction of the canonical-types `Swatch` regression. Two prior shapes, both wrong:
    // - object form: `{ type: "color" } | { type: "colors" } | { type: "gradient" }` (misrepresents
    //   the tuple), and
    // - per-variant tuple form: `[type: "color", value: string] | [type: "colors", value: string[]] | …`
    //   (correct, but too verbose for a row summary).
    // Final: merge the discriminant constants and elide the value slot — full detail is still in
    // the expanded variant list.
    expect(getTypeSummary(ANY_OF_DISCRIMINATED_TUPLES_UNNAMED)).toBe(
      '[type: "color" | "colors" | "gradient", value]'
    );
  });

  it('renders Cta[]-style array of named union (uses items id)', () => {
    // Array whose items have a top-level id and are a union: rendered as `Id[]`,
    // not `(T1 | T2)[]`. Hits the "Named union" branch at introspection.ts ~line 463.
    const namedItems = {
      id: 'Cta',
      anyOf: [
        { type: 'object' as const, id: 'CtaButton', properties: { kind: { const: 'button' } } },
        { type: 'object' as const, id: 'CtaLink', properties: { kind: { const: 'link' } } },
      ],
    };
    const arr = { type: 'array' as const, items: namedItems };
    expect(getTypeSummary(arr)).toBe('Cta[]');
  });
});

describe('getVariantListDescriptionHtml', () => {
  it('returns the items description for a `Foo[]` field (so the union description survives the array wrap)', () => {
    const field = {
      description: 'All media: images, videos, …',
      type: 'array' as const,
      items: { id: 'Media', description: 'A Media object describes …', anyOf: [{ const: 'image' }, { const: 'video' }] },
    };
    expect(getVariantListDescriptionHtml(field)).toContain('A Media object describes');
  });

  it('returns empty for a direct-union field — its description is already on the field row', () => {
    const field = { id: 'Link', description: 'A Link can be …', anyOf: [{ const: 'url' }, { const: 'page' }] };
    expect(getVariantListDescriptionHtml(field)).toBe('');
  });

  it('returns empty for arrays whose items have no description', () => {
    const field = { type: 'array' as const, items: { id: 'X', anyOf: [{ const: 'a' }, { const: 'b' }] } };
    expect(getVariantListDescriptionHtml(field)).toBe('');
  });

  it('returns empty for tuples (items is an array, not a single schema)', () => {
    const tuple = { type: 'array' as const, items: [{ const: 'a' }, { type: 'string' as const }] };
    expect(getVariantListDescriptionHtml(tuple)).toBe('');
  });
});

describe('isFieldDescriptionFromObject', () => {
  it('treats a single-variant named object field as belonging to the type (so the field row stays clean and the description shows on expand)', () => {
    // Mirrors `MediaSourceVideo.length: Duration` — the deref'd `length` schema *is* `Duration`,
    // and we don't want Duration's description leaking onto the `length` field row.
    const lengthField = {
      id: 'Duration',
      title: 'Duration',
      description: 'ISO 8601 duration string',
      type: 'object' as const,
      properties: { duration: { type: 'string' as const } },
      required: ['duration'],
    };
    expect(isFieldDescriptionFromObject(lengthField)).toBe(true);
  });

  it('treats an inline single-variant object as the property\'s own description', () => {
    const inline = {
      description: 'A property described inline',
      type: 'object' as const,
      properties: { x: { type: 'number' as const } },
    };
    expect(isFieldDescriptionFromObject(inline)).toBe(false);
  });

  it('returns false for multi-variant unions — the description belongs above "Accepts one of …"', () => {
    const union = {
      id: 'Media',
      description: 'A Media object …',
      anyOf: [
        { type: 'object' as const, properties: { type: { const: 'image' } } },
        { type: 'object' as const, properties: { type: { const: 'video' } } },
      ],
    };
    expect(isFieldDescriptionFromObject(union)).toBe(false);
  });

  it('returns false for non-expandable fields (no variants → field-row description is the only place it can show)', () => {
    const primitive = { id: 'ColorString', type: 'string' as const, description: 'A CSS color string' };
    expect(isFieldDescriptionFromObject(primitive)).toBe(false);
  });
});

// --- Characterization tests for shipped reflection shapes ---
//
// These pin the rendered output for shapes that actually appear in
// `@laioutr-core/canonical-types/reflection`. Synthesized to keep the suite hermetic — when the
// real schema changes, the failing test points at the divergence. Each test asserts both the
// row-level summary (`getTypeSummary`) and the variant labels shown in the expanded panel
// (`getExpandableVariants`), since those are the two surfaces a user sees per field.

describe('shipped reflection shapes (characterization)', () => {
  it('Media — named discriminated union of named objects', () => {
    expect(getTypeSummary(ZOD_NAMED_DISCRIMINATED_UNION)).toBe('Media');
    const variants = getExpandableVariants(ZOD_NAMED_DISCRIMINATED_UNION);
    expect(variants!.map((v) => v.label)).toEqual(['MediaImage', 'MediaVideo']);
    expect(variants!.map((v) => v.summary)).toEqual([
      '{ type, sources, alt }',
      '{ type, sources, poster }',
    ]);
  });

  it('MediaImage[] — array of a single named object: name + property peek (current UX, slightly ambiguous)', () => {
    // The trailing `{...}` describes the *items*, not the array itself, but the rendered string
    // doesn't make that scoping explicit. Pinning current behavior; revisit if it confuses readers.
    expect(getTypeSummary(ZOD_ARRAY_OF_NAMED_OBJECT)).toBe('MediaImage[] { type, sources, alt }');
    const variants = getExpandableVariants(ZOD_ARRAY_OF_NAMED_OBJECT);
    expect(variants!.map((v) => v.label)).toEqual(['MediaImage[]']);
  });

  it('Media[] — array of a named discriminated union (uses items id, no peek)', () => {
    expect(getTypeSummary(ZOD_ARRAY_OF_NAMED_UNION)).toBe('Media[]');
    const variants = getExpandableVariants(ZOD_ARRAY_OF_NAMED_UNION);
    expect(variants!.map((v) => v.label)).toEqual(['MediaImage', 'MediaVideo']);
  });

  it('placeholder — tuple with an enum head (not discriminated)', () => {
    // Head is an enum, not a single `const`, so `classify` returns `tuple`, not
    // `discriminated-tuple`. Output: `[("solid" | "thumbhash"), string]`.
    expect(getTypeName(ZOD_TUPLE_ENUM_HEAD)).toBe('["solid" | "thumbhash", string]');
    expect(getTypeSummary(ZOD_TUPLE_ENUM_HEAD)).toBe('["solid" | "thumbhash", string]');
  });

  it('LocationQueryRaw value — anonymous union of primitives renders as joined types', () => {
    expect(getTypeName(ZOD_PRIMITIVE_UNION)).toBe('string | number | null');
    expect(getTypeSummary(ZOD_PRIMITIVE_UNION)).toBe('string | number | null');
    expect(getExpandableVariants(ZOD_PRIMITIVE_UNION)).toBeUndefined();
  });

  it('CustomFields — open record renders as `Record<string, unknown>` in javascript mode', () => {
    expect(getTypeName(ZOD_OPEN_RECORD_NAMED, 'javascript')).toBe('Record<string, unknown>');
    expect(getTypeSummary(ZOD_OPEN_RECORD_NAMED, { mode: 'javascript' })).toBe('Record<string, unknown>');
    // In json mode the record falls back to its id (or `'object'` if anonymous).
    expect(getTypeName(ZOD_OPEN_RECORD_NAMED, 'json')).toBe('CustomFields');
  });

  it('Array<X | Y> — wraps anonymous-union items in parens so `[]` does not bind tighter than `|`', () => {
    // Without the wrap, `Array<string | number>` renders as `string | number[]`, which TS
    // reads as `string | (number[])` — a different type. Named unions stay unwrapped because
    // they collapse to a single token via their `id` (e.g., `Media[]`).
    expect(getTypeName(ZOD_ARRAY_OF_UNNAMED_UNION)).toBe('(string | number)[]');
    expect(getTypeSummary(ZOD_ARRAY_OF_UNNAMED_UNION)).toBe('(string | number)[]');
    // Sanity: named-union items keep the unwrapped form.
    expect(getTypeName({ type: 'array' as const, items: { ...ANY_OF_OBJECTS, id: 'Node' } as any })).toBe('Node[]');
  });

  it('shipping — anonymous inline object: row shows just the property peek', () => {
    // No `id`/`title` on the wrapper — `getTypeSummary` drops the leading id and shows just
    // the property summary. The variant-list label still falls back to the literal `'object'`,
    // which is generic; pinning so a future "carry the property name" enhancement is an
    // explicit choice rather than an accidental change.
    expect(getTypeSummary(ZOD_INLINE_OBJECT_WITH_REFS)).toBe('{ total, isEstimated }');
    const variants = getExpandableVariants(ZOD_INLINE_OBJECT_WITH_REFS);
    expect(variants!.map((v) => v.label)).toEqual(['object']);
    expect(variants!.map((v) => v.summary)).toEqual(['{ total, isEstimated }']);
  });
});

// --- Known gaps ---
//
// These are documented limitations of the current renderer. Each entry corresponds to
// a JSON Schema construct or behavior we don't yet handle (or handle in a way we may
// want to revisit). Flip from `.todo` → real test once support is added or behavior
// is intentionally changed; the failing test will then drive the implementation.
//
// See docs/plans/2026-05-06-json-schema-test-suite-design.md for the gap analysis.

describe('known gaps (documented limitations)', () => {
  test.todo('schema booleans: properties with `true`/`false` value');
  test('multi-type: type: ["string", "null"] renders both branches in the field row', () => {
    expect(getTypeSummary({ type: ['string', 'null'] } as any)).toBe('string | null');
  });
  test.todo('prefixItems (Draft 2020-12 tuples)');
  test.todo('if/then/else conditional schemas');
  test.todo('not');
  test('nullable: true (OpenAPI 3.0) renders as "T | null"', () => {
    expect(getTypeSummary({ type: 'string', nullable: true } as any)).toBe('string | null');
  });
  test.todo('additionalProperties as schema with sibling properties — render as "any other key" row');
  test.todo('examples (array) — render as an expandable list separate from default');
  test.todo('exclusiveMinimum/Maximum as boolean (Draft 4 form) — currently prints "true"/"false"');
  test.todo('cycle protection in introspection.ts (post-deref renderer recursion: getExpandableVariants/getTypeSummary on cyclic anyOf or items)');
  test.todo('resolveSchema: recursive allOf unwrap (currently shallow — downstream callers must re-resolve at each descent)');
  test.todo('boolean-const union with clean alias renders expanded instead of collapsing to `boolean`');
  test.todo('deprecated annotation is not emitted as a constraint chip (only shown as field-row badge)');
  // Layer 2 (hygiene): `classify` re-derefs via `resolveSchema(input, { dereferenced: false })`,
  // which klones every input. All current callsites pass already-resolved schemas, so the work
  // is wasted AND it breaks reference-equality checks in downstream heuristics (this is exactly
  // how `isFieldDescriptionFromObject`'s identity check silently failed). Make the contract
  // explicit (input must be resolved), drop the re-deref, keep only the defensive allOf unwrap.
  test.todo('classify: assume resolved input, drop the implicit klone, preserve identity for downstream identity-based heuristics');
  // Layer 3 (semantics): per Draft 7, `dereferenceSync` replaces `{ $ref, description: "own" }`
  // with the target — losing the property's own description. Draft 2020-12 / OpenAPI 3.1 merge
  // siblings instead. Switch to merge semantics so a property can override the type's description
  // (and so `isFieldDescriptionFromObject` could distinguish "type-level" from "property-level"
  // without relying on `id` as a proxy).
  test.todo('resolveSchema: merge $ref siblings onto the resolved target so property-level overrides survive (Draft 2020-12 / OpenAPI 3.1 semantics)');
});
