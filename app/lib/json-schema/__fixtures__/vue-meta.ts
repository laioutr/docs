import type { EventMeta, PropertyMeta, SlotMeta } from 'vue-component-meta';

/**
 * vue-component-meta's `PropertyMeta` requires a `getTypeObject()` method that returns
 * a `ts.Type`. Tests never call it (the adapter only reads name/type/schema/etc.), so we
 * stub it with a thrower; the cast keeps the rest of the fixture readable.
 */
const baseMeta = (overrides: Partial<PropertyMeta>): PropertyMeta =>
  ({
    name: 'prop',
    global: false,
    description: '',
    tags: [],
    required: false,
    type: 'string',
    declarations: [],
    schema: 'string',
    getTypeObject: () => {
      throw new Error('getTypeObject is not implemented in fixtures');
    },
    ...overrides,
  }) as PropertyMeta;

/** A plain string prop. */
export const PROP_PLAIN_STRING: PropertyMeta = baseMeta({ name: 'label', type: 'string', schema: 'string' });

/** A required prop. Note: distinct name from PROP_PLAIN_STRING so they can coexist in the same call. */
export const PROP_REQUIRED_TITLE: PropertyMeta = baseMeta({
  name: 'title',
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
      {
        kind: 'object',
        type: 'Link',
        schema: {
          href: {
            name: 'href',
            global: false,
            description: '',
            tags: [],
            type: 'string',
            schema: 'string',
            required: true,
            declarations: [],
          } as any,
        },
      } as any,
      'undefined',
    ],
  },
});

/** Deprecated prop. */
export const PROP_DEPRECATED: PropertyMeta = baseMeta({
  name: 'old',
  type: 'string',
  schema: 'string',
  tags: [{ name: 'deprecated', text: 'use newProp instead' } as any],
});

// --- parseDefault branch fixtures (PROP_WITH_DEFAULT covers quoted strings) ---

/** Boolean default. */
export const PROP_WITH_BOOL_DEFAULT: PropertyMeta = baseMeta({
  name: 'enabled',
  type: 'boolean',
  schema: 'boolean',
  default: 'true',
});

/** Numeric default. */
export const PROP_WITH_NUMERIC_DEFAULT: PropertyMeta = baseMeta({
  name: 'count',
  type: 'number',
  schema: 'number',
  default: '42',
});

/** JSON-object default — exercises the JSON.parse branch. */
export const PROP_WITH_JSON_DEFAULT: PropertyMeta = baseMeta({
  name: 'options',
  type: 'object',
  schema: { kind: 'object', type: 'object', schema: {} },
  default: '{"a":1}',
});

// --- Description passthrough ---

/** Prop with a JSDoc description — should appear on the output schema. */
export const PROP_WITH_DESCRIPTION: PropertyMeta = baseMeta({
  name: 'tooltip',
  type: 'string',
  schema: 'string',
  description: 'Shown on hover.',
});

// --- EventMeta and SlotMeta fixtures ---

const baseEventMeta = (overrides: Partial<EventMeta>): EventMeta =>
  ({
    name: 'event',
    description: '',
    tags: [],
    type: '() => void',
    signature: '() => void',
    declarations: [],
    schema: [],
    getDeclarations: () => [],
    getTypeObject: () => {
      throw new Error('getTypeObject is not implemented in fixtures');
    },
    ...overrides,
  }) as EventMeta;

const baseSlotMeta = (overrides: Partial<SlotMeta>): SlotMeta =>
  ({
    name: 'slot',
    description: '',
    type: '{}',
    declarations: [],
    schema: 'string',
    getDeclarations: () => [],
    getTypeObject: () => {
      throw new Error('getTypeObject is not implemented in fixtures');
    },
    ...overrides,
  }) as SlotMeta;

// --- Events ---

/** A plain event with a signature. */
export const EVENT_PLAIN: EventMeta = baseEventMeta({
  name: 'click',
  signature: '(payload: { x: number }) => void',
  type: '(payload: { x: number }) => void',
});

/** A deprecated event. */
export const EVENT_DEPRECATED: EventMeta = baseEventMeta({
  name: 'oldEvent',
  signature: '() => void',
  type: '() => void',
  tags: [{ name: 'deprecated', text: 'use newEvent' } as any],
});

// --- Slots ---

/** A plain slot. */
export const SLOT_PLAIN: SlotMeta = baseSlotMeta({
  name: 'default',
  type: '{ item: string }',
});

/**
 * SLOT_DEPRECATED was dropped: vue-component-meta@3.1.8 (the resolved version) defines
 * `SlotMeta` without a `tags` field, so a typed fixture cannot carry deprecated tags.
 * This is exactly the scenario the source's `isDeprecated(m: unknown)` cast addresses
 * (a SlotMeta with no `tags` should not crash and should yield `false`). SLOT_PLAIN
 * anchors that behavior — it has no tags, and the test asserts no `deprecated: true`.
 */
