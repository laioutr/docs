import { describe, it, expect } from 'vitest';
import { componentPropsToJsonSchema, componentEventsToJsonSchema, componentSlotsToJsonSchema } from './component-meta-adapter';
import {
  PROP_PLAIN_STRING,
  PROP_REQUIRED_TITLE,
  PROP_WITH_DEFAULT,
  PROP_STRING_AND_EMPTY,
  PROP_INLINE_OBJECT_TYPE,
  PROP_COMPONENT_TYPE,
  PROP_TUPLE,
  PROP_ARRAY_OF_STRING,
  PROP_ENUM_OPTIONAL,
  PROP_ENUM_SINGLE_MEANINGFUL,
  PROP_DEPRECATED,
  PROP_WITH_BOOL_DEFAULT,
  PROP_WITH_NUMERIC_DEFAULT,
  PROP_WITH_JSON_DEFAULT,
  PROP_WITH_DESCRIPTION,
  EVENT_PLAIN,
  EVENT_DEPRECATED,
  SLOT_PLAIN,
  VUE_INLINE_OBJECT_RECOVERED,
  VUE_OPAQUE_COMPONENT,
} from './__fixtures__';

describe('componentPropsToJsonSchema — top-level shape', () => {
  it('builds an object with properties keyed by name', () => {
    const result = componentPropsToJsonSchema([PROP_PLAIN_STRING]);
    expect(result.type).toBe('object');
    expect(result.properties).toHaveProperty('label');
  });

  it('marks required props in the required array', () => {
    const result = componentPropsToJsonSchema([PROP_REQUIRED_TITLE, PROP_PLAIN_STRING]);
    // PROP_REQUIRED_TITLE has name 'title' and required:true; PROP_PLAIN_STRING has name 'label' and required:false.
    expect(result.required).toEqual(['title']);
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

  it('parses boolean default', () => {
    const result = componentPropsToJsonSchema([PROP_WITH_BOOL_DEFAULT]);
    expect((result.properties!.enabled as any).default).toBe(true);
  });

  it('parses numeric default', () => {
    const result = componentPropsToJsonSchema([PROP_WITH_NUMERIC_DEFAULT]);
    expect((result.properties!.count as any).default).toBe(42);
  });

  it('parses JSON-object default', () => {
    const result = componentPropsToJsonSchema([PROP_WITH_JSON_DEFAULT]);
    expect((result.properties!.options as any).default).toEqual({ a: 1 });
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
    expect(result.properties!.cta).toEqual(VUE_INLINE_OBJECT_RECOVERED);
  });
});

describe('walkSchema — opaque framework types', () => {
  it('renders Component as opaque {id, title}', () => {
    const result = componentPropsToJsonSchema([PROP_COMPONENT_TYPE]);
    expect(result.properties!.icon).toEqual(VUE_OPAQUE_COMPONENT);
  });
});

describe('walkSchema — arrays', () => {
  it('preserves all tuple items', () => {
    const result = componentPropsToJsonSchema([PROP_TUPLE]);
    const pair = result.properties!.pair as any;
    expect(pair.type).toBe('array');
    expect(pair.items).toHaveLength(2);
    // Each tuple item in PROP_TUPLE is a vue-component-meta object-kind schema with empty
    // `schema: {}`, so walkSchema enters the object branch and emits the structural form
    // (type/id/title/properties), not the primitive `{ type: 'string' }` shape.
    expect(pair.items[0]).toEqual({ type: 'object', id: 'string', title: 'string', properties: {} });
    expect(pair.items[1]).toEqual({ type: 'object', id: 'number', title: 'number', properties: {} });
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

  it('passes description through to the output schema', () => {
    const result = componentPropsToJsonSchema([PROP_WITH_DESCRIPTION]);
    expect((result.properties!.tooltip as any).description).toBe('Shown on hover.');
  });
});

describe('componentEventsToJsonSchema', () => {
  it('builds an object with events keyed by name', () => {
    const result = componentEventsToJsonSchema([EVENT_PLAIN]);
    expect(result.type).toBe('object');
    expect(result.properties).toHaveProperty('click');
  });

  it('uses the signature as id and title', () => {
    const result = componentEventsToJsonSchema([EVENT_PLAIN]);
    const click = result.properties!.click as any;
    expect(click.id).toBe('(payload: { x: number }) => void');
    expect(click.title).toBe('(payload: { x: number }) => void');
  });

  it('marks deprecated events', () => {
    const result = componentEventsToJsonSchema([EVENT_DEPRECATED]);
    expect((result.properties!.oldEvent as any).deprecated).toBe(true);
  });
});

describe('componentSlotsToJsonSchema', () => {
  it('builds an object with slots keyed by name', () => {
    const result = componentSlotsToJsonSchema([SLOT_PLAIN]);
    expect(result.type).toBe('object');
    expect(result.properties).toHaveProperty('default');
  });

  it('does not mark non-deprecated slots (anchors isDeprecated SlotMeta path)', () => {
    // SlotMeta in vue-component-meta@3.1.8 has no `tags` field; the source fix makes
    // isDeprecated handle this gracefully via `unknown` typing. This test pins that
    // a SlotMeta lacking a `tags` field does not crash and is not marked deprecated.
    const result = componentSlotsToJsonSchema([SLOT_PLAIN]);
    expect((result.properties!.default as any).deprecated).toBeUndefined();
  });
});
