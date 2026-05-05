import type { ComponentMeta, EventMeta, PropertyMeta, SlotMeta } from 'vue-component-meta';
import type { JSONSchema } from '@laioutr-core/core-types/common';

type PropertyMetaSchema = PropertyMeta['schema'];

const isDeprecated = (m: { tags?: Array<{ name: string }> }): boolean =>
  !!m.tags?.some((t) => t.name === 'deprecated');

/** Mirror of nuxt-component-meta's parseDefaultValue without its other side effects. */
const parseDefault = (raw: string | undefined): unknown => {
  if (raw === undefined) return undefined;
  try {
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(raw)) return parseFloat(raw);
    if (raw.startsWith('{') || raw.startsWith('[')) return JSON.parse(raw);
  } catch {
    /* fall through */
  }
  return raw;
};

const primitiveOrLiteral = (raw: string): JSONSchema => {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return { const: raw.slice(1, -1) } as JSONSchema;
  }
  if (raw === 'true' || raw === 'false') return { const: raw === 'true' } as JSONSchema;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { const: parseFloat(raw) } as JSONSchema;
  if (raw === 'string' || raw === 'number' || raw === 'boolean') return { type: raw } as JSONSchema;
  // Opaque: function signatures, intersections, references, undefined, null, void, etc.
  return { id: raw, title: raw } as JSONSchema;
};

/** vue-component-meta stores enum/array `schema` as either an array or `{ "0": ..., "1": ... }`. */
const toList = <T>(s: T[] | Record<string, T> | undefined): T[] => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return Object.values(s);
};

/** Strip `| undefined` (in any position) from a TS type string. Required-badge conveys this. */
const stripUndefined = (typeStr: string): string =>
  typeStr
    .replace(/\s*\|\s*undefined\b/g, '')
    .replace(/^undefined\s*\|\s*/g, '')
    .trim();

const isUndefinedBranch = (b: PropertyMetaSchema): boolean =>
  b === 'undefined' || (typeof b === 'object' && b.type === 'undefined');

const walkSchema = (s: PropertyMetaSchema, fallbackType: string): JSONSchema => {
  if (typeof s === 'string') return primitiveOrLiteral(s);

  if (s.kind === 'object') {
    const properties: Record<string, JSONSchema> = {};
    const required: string[] = [];
    for (const [k, child] of Object.entries(s.schema ?? {})) {
      properties[k] = walkPropertyMeta(child);
      if (child.required) required.push(k);
    }
    return {
      type: 'object',
      id: s.type,
      title: s.type,
      properties,
      ...(required.length ? { required } : {}),
    } as JSONSchema;
  }

  if (s.kind === 'array') {
    const items = toList(s.schema as PropertyMetaSchema[] | Record<string, PropertyMetaSchema>);
    const head = items[0];
    const itemFallback = head ? (typeof head === 'string' ? head : head.type) : 'unknown';
    return {
      type: 'array',
      id: s.type,
      title: s.type,
      items: head ? walkSchema(head, itemFallback) : ({} as JSONSchema),
    } as JSONSchema;
  }

  if (s.kind === 'enum') {
    // Drop `undefined` branches — optionality is conveyed by the required badge, not the type.
    const meaningful = toList(s.schema as PropertyMetaSchema[] | Record<string, PropertyMetaSchema>).filter(
      (b) => !isUndefinedBranch(b),
    );
    const displayType = stripUndefined(s.type);
    if (meaningful.length === 1) {
      // Collapse single-branch unions: e.g. `Link | undefined` → just walk Link.
      return walkSchema(meaningful[0]!, displayType);
    }
    return {
      id: displayType,
      title: displayType,
      anyOf: meaningful.map((v) => walkSchema(v, typeof v === 'string' ? v : v.type)),
    } as JSONSchema;
  }

  if (s.kind === 'event') {
    return { id: s.type, title: s.type } as JSONSchema;
  }

  return { id: fallbackType, title: fallbackType } as JSONSchema;
};

const walkPropertyMeta = (p: PropertyMeta): JSONSchema => {
  const inner = walkSchema(p.schema, p.type) as Record<string, unknown>;
  if (p.description) inner.description = p.description;
  const defaultValue = parseDefault(p.default);
  if (defaultValue !== undefined) inner.default = defaultValue;
  if (isDeprecated(p)) inner.deprecated = true;
  return inner as JSONSchema;
};

export const componentPropsToJsonSchema = (props: ComponentMeta['props']): JSONSchema => {
  const properties: Record<string, JSONSchema> = {};
  const required: string[] = [];
  for (const prop of props) {
    properties[prop.name] = walkPropertyMeta(prop);
    if (prop.required) required.push(prop.name);
  }
  return {
    type: 'object',
    properties,
    ...(required.length ? { required } : {}),
  } as JSONSchema;
};

const memberToJsonSchema = (
  m: EventMeta | SlotMeta,
  typeFor: (m: EventMeta | SlotMeta) => string,
): JSONSchema => {
  const sig = typeFor(m);
  return {
    id: sig,
    title: sig,
    ...(m.description ? { description: m.description } : {}),
    ...(isDeprecated(m) ? { deprecated: true } : {}),
  } as JSONSchema;
};

export const componentEventsToJsonSchema = (events: ComponentMeta['events']): JSONSchema => {
  const properties: Record<string, JSONSchema> = {};
  for (const e of events) properties[e.name] = memberToJsonSchema(e, (m) => (m as EventMeta).signature ?? m.type);
  return { type: 'object', properties } as JSONSchema;
};

export const componentSlotsToJsonSchema = (slots: ComponentMeta['slots']): JSONSchema => {
  const properties: Record<string, JSONSchema> = {};
  for (const s of slots) properties[s.name] = memberToJsonSchema(s, (m) => m.type);
  return { type: 'object', properties } as JSONSchema;
};
