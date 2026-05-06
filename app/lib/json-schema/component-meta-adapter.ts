import type { ComponentMeta, EventMeta, PropertyMeta, SlotMeta } from 'vue-component-meta';
import type { DocsJSONSchema } from './introspection';

type PropertyMetaSchema = PropertyMeta['schema'];

/**
 * Check for `@deprecated` JSDoc tag. Accepts any meta shape because vue-component-meta's
 * `SlotMeta` type lacks a `tags` field entirely, so a strict structural parameter type
 * fails TypeScript's "no properties in common" check at the call sites.
 */
const isDeprecated = (m: unknown): boolean => {
  const tags = (m as { tags?: Array<{ name: string }> }).tags;
  return !!tags?.some((t) => t.name === 'deprecated');
};

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

/**
 * Parse a TypeScript inline object-type string (e.g. `{ s?: "s" | "m"; md: number }`) into a
 * synthetic object schema. vue-component-meta sometimes flattens nested inline object types into
 * raw strings instead of preserving `kind: 'object'`; this recovers their property structure.
 *
 * Limitations: the splitter tracks bracket depth but not string-literal context, so a member
 * value containing a literal `;` or `,` inside `"..."`/`'...'` would split incorrectly. Mapped
 * types and index signatures are silently skipped (no `\w+` name match). Real Vue prop types
 * almost never hit these cases; if they do, the schema falls back to the opaque `{id, title}` form.
 */
const parseInlineObjectType = (raw: string): DocsJSONSchema | undefined => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return undefined;
  const body = trimmed.slice(1, -1).trim();
  if (!body) return undefined;

  // Split at top-level `;` or `,`, respecting nesting in {}/[]/()/<>.
  const members: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{' || c === '[' || c === '(' || c === '<') depth++;
    else if (c === '}' || c === ']' || c === ')' || c === '>') depth--;
    else if ((c === ';' || c === ',') && depth === 0) {
      members.push(body.slice(start, i));
      start = i + 1;
    }
  }
  if (start < body.length) members.push(body.slice(start));

  const properties: Record<string, DocsJSONSchema> = {};
  const required: string[] = [];
  for (const m of members) {
    const match = /^\s*(\w+)(\??):\s*(.+?)\s*$/.exec(m);
    if (!match) continue;
    const [, name, optional, valueType] = match;
    // Strip `| undefined` from optional members; the required badge encodes optionality.
    const cleaned = valueType!.replace(/\s*\|\s*undefined\s*$/, '').trim();
    properties[name!] = { id: cleaned, title: cleaned };
    if (!optional) required.push(name!);
  }
  if (Object.keys(properties).length === 0) return undefined;

  return {
    type: 'object',
    properties,
    ...(required.length ? { required } : {}),
  };
};

const primitiveOrLiteral = (raw: string): DocsJSONSchema => {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return { const: raw.slice(1, -1) };
  }
  if (raw === 'true' || raw === 'false') return { const: raw === 'true' };
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { const: parseFloat(raw) };
  if (raw === 'string' || raw === 'number' || raw === 'boolean') return { type: raw };
  if (raw.trim().startsWith('{')) {
    const parsed = parseInlineObjectType(raw);
    if (parsed) return parsed;
  }
  // Opaque: function signatures, intersections, references, undefined, null, void, etc.
  return { id: raw, title: raw };
};

/** vue-component-meta stores enum/array `schema` as either an array or `{ "0": ..., "1": ... }`. */
const toList = <T>(s: T[] | Record<string, T> | undefined): T[] => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return Object.values(s);
};

/**
 * Vue/Nuxt framework types whose internal shape would mislead the reader (Vue's `Component` carries
 * vue-router's navigation guards, etc.). We render the name only; the reader can look the type up.
 */
const OPAQUE_FRAMEWORK_TYPES = new Set([
  'Component',
  'ConcreteComponent',
  'DefineComponent',
  'FunctionalComponent',
  'VNode',
  'VNodeChild',
]);

/**
 * If `typeStr` is a Vue framework type (or a generic instantiation of one), return the friendly
 * name to display. Vue often resolves `Component` to `ComponentOptions<...>` or similar verbose
 * generics; we want the doc to show `Component`, not the internal expansion.
 *
 * TODO(vue 3.5.x): the `InternalSlots`/`attrs: Data` heuristic matches the function-signature form
 * of Vue's `FunctionalComponent`. If vue's runtime-core changes the public signature naming, this
 * regex needs to be retuned. The other regexes match Vue's generic class/interface names which are
 * stable across vue 3 minor versions.
 */
const opaqueFrameworkTypeName = (typeStr: string): string | undefined => {
  if (OPAQUE_FRAMEWORK_TYPES.has(typeStr)) return typeStr;
  if (/^(ComponentOptions|ConcreteComponent|DefineComponent|ComponentPublicInstanceConstructor)</.test(typeStr)) return 'Component';
  if (/^FunctionalComponent</.test(typeStr)) return 'FunctionalComponent';
  // Vue's FunctionalComponent expanded as a function signature: `(props: any, ctx: Omit<{ attrs: Data; slots: Readonly<InternalSlots>; ... }, ...>): any`
  if (/InternalSlots|attrs:\s*Data\b/.test(typeStr)) return 'Component';
  return undefined;
};

/** Strip `| undefined` (in any position) from a TS type string. Required-badge conveys this. */
const stripUndefined = (typeStr: string): string =>
  typeStr
    .replace(/\s*\|\s*undefined\b/g, '')
    .replace(/^undefined\s*\|\s*/g, '')
    .trim();

/**
 * `'undefined'` is not a valid `JSONSchema.type`; this is a TS-meta-level branch that
 * vue-component-meta uses to represent optional members. Don't `// @ts-expect-error`-purge.
 */
const isUndefinedBranch = (b: PropertyMetaSchema): boolean =>
  b === 'undefined' || (typeof b === 'object' && b.type === 'undefined');

const walkSchema = (s: PropertyMetaSchema, fallbackType: string): DocsJSONSchema => {
  if (typeof s === 'string') return primitiveOrLiteral(s);

  if (s.kind === 'object') {
    // Normalize the TypeScript autocomplete-suggestion trick `string & {}` to plain `string`.
    if (s.type === 'string & {}' && (!s.schema || Object.keys(s.schema).length === 0)) {
      return { type: 'string' };
    }
    // Vue/Nuxt framework types: render the name only, don't expose internal navigation guards etc.
    const opaque = opaqueFrameworkTypeName(s.type);
    if (opaque) {
      return { id: opaque, title: opaque };
    }
    const properties: Record<string, DocsJSONSchema> = {};
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
    };
  }

  if (s.kind === 'array') {
    const items = toList(s.schema as PropertyMetaSchema[] | Record<string, PropertyMetaSchema>);
    // Tuple: vue-component-meta lists each element separately.
    if (items.length > 1) {
      return {
        type: 'array',
        id: s.type,
        title: s.type,
        items: items.map((item) => walkSchema(item, typeof item === 'string' ? item : item.type)),
      };
    }
    const head = items[0];
    const itemFallback = head ? (typeof head === 'string' ? head : head.type) : 'unknown';
    // Strip trailing `[]` so the id reflects the element name; the array shape is conveyed by `type:'array'`.
    const elementName = s.type.replace(/(\s*\[\])+$/, '');
    return {
      type: 'array',
      id: elementName,
      title: elementName,
      items: head ? walkSchema(head, itemFallback) : {},
    };
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
    };
  }

  if (s.kind === 'event') {
    const opaque = opaqueFrameworkTypeName(s.type);
    return { id: opaque ?? s.type, title: opaque ?? s.type };
  }

  return { id: fallbackType, title: fallbackType };
};

const walkPropertyMeta = (p: PropertyMeta): DocsJSONSchema => {
  const inner = walkSchema(p.schema, p.type);
  const defaultValue = parseDefault(p.default);
  return {
    ...inner,
    ...(p.description ? { description: p.description } : {}),
    ...(defaultValue !== undefined ? { default: defaultValue } : {}),
    ...(isDeprecated(p) ? { deprecated: true } : {}),
  };
};

export const componentPropsToJsonSchema = (props: ComponentMeta['props']): DocsJSONSchema => {
  const properties: Record<string, DocsJSONSchema> = {};
  const required: string[] = [];
  for (const prop of props) {
    properties[prop.name] = walkPropertyMeta(prop);
    if (prop.required) required.push(prop.name);
  }
  return {
    type: 'object',
    properties,
    ...(required.length ? { required } : {}),
  };
};

const memberToJsonSchema = (
  m: EventMeta | SlotMeta,
  typeFor: (m: EventMeta | SlotMeta) => string,
): DocsJSONSchema => {
  const sig = typeFor(m);
  return {
    id: sig,
    title: sig,
    ...(m.description ? { description: m.description } : {}),
    ...(isDeprecated(m) ? { deprecated: true } : {}),
  };
};

export const componentEventsToJsonSchema = (events: ComponentMeta['events']): DocsJSONSchema => {
  const properties: Record<string, DocsJSONSchema> = {};
  for (const e of events) properties[e.name] = memberToJsonSchema(e, (m) => (m as EventMeta).signature ?? m.type);
  return { type: 'object', properties };
};

export const componentSlotsToJsonSchema = (slots: ComponentMeta['slots']): DocsJSONSchema => {
  const properties: Record<string, DocsJSONSchema> = {};
  for (const s of slots) properties[s.name] = memberToJsonSchema(s, (m) => m.type);
  return { type: 'object', properties };
};
