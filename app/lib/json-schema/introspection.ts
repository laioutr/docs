import { renderDescription } from './renderDescription';
import { resolveSchema } from './resolveSchema';
import type { JSONSchema } from '@laioutr-core/core-types/common';

/**
 * JSON Schema with the custom `id` field added by canonical-types reflection (and stamped by
 * `component-meta-adapter`). Use this in this folder to avoid `as Record<string, unknown>` reads
 * and `as JSONSchema` writes for the `id` key.
 */
export type DocsJSONSchema = JSONSchema & { id?: string };

export const getSchemaId = (s: JSONSchema): string | undefined => (s as DocsJSONSchema).id;

/** Get the preferred display name: id over title. */
export const getSchemaName = (s: JSONSchema): string => getSchemaId(s) ?? s.title ?? 'object';

export const isObjectWithProps = (s: JSONSchema): boolean =>
  typeof s === 'object' && s.type === 'object' && !!s.properties && Object.keys(s.properties).length > 0;

export const getArrayItems = (s: JSONSchema): JSONSchema | undefined =>
  s.type === 'array' && typeof s.items === 'object' && !Array.isArray(s.items) ?
    resolveSchema(s.items as JSONSchema, { dereferenced: true })
  : undefined;

export const getUnionVariants = (s: JSONSchema): JSONSchema[] | undefined => {
  const variants = s.anyOf ?? s.oneOf;
  if (!variants?.length) return undefined;
  return variants.filter((v): v is JSONSchema => typeof v === 'object').map((v) => resolveSchema(v, { dereferenced: true }));
};

// --- Type display ---

export type SchemaMode = 'json' | 'javascript';

const FORMAT_TO_JS_TYPE: Record<string, string> = {
  'date-time': 'Date',
};

const PRIMITIVE_TYPE_NAMES = new Set(['boolean', 'string', 'number', 'integer', 'bigint']);

export const getTypeName = (s: JSONSchema, mode: SchemaMode = 'json'): string => {
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(' | ');
  // `resolveSchema` unwraps single-element `allOf` (zod's `$ref` codegen). What remains here is
  // a real multi-element intersection — those rarely carry a useful id, so showing `A & B` is
  // more informative than the (usually missing) alias.
  if (s.allOf?.length) return s.allOf.map((v) => getTypeName(v, mode)).join(' & ');
  // JSON Schema permits `type` as an array of strings (nullable types like `['string', 'null']`).
  if (Array.isArray(s.type)) return s.type.join(' | ');

  const variants = getUnionVariants(s);
  if (variants) {
    const id = getSchemaId(s);
    if (id) return id;
    return variants.map((v) => getTypeName(v, mode)).join(' | ');
  }

  if (s.type === 'object') {
    if (mode === 'javascript' && !s.properties && typeof s.additionalProperties === 'object') {
      return `Record<string, ${getTypeName(s.additionalProperties, mode)}>`;
    }
    return getSchemaName(s);
  }
  if (s.type === 'array') {
    if (Array.isArray(s.items)) {
      const items = s.items;
      // Re-apply the `[type, value]` labels TypeScript drops on labelled tuples.
      const head = items[0];
      if (
        items.length === 2 &&
        typeof head === 'object' && head !== null && !Array.isArray(head) &&
        head.const !== undefined
      ) {
        const tag = JSON.stringify(head.const);
        const value = typeof items[1] === 'object' ? getTypeName(items[1] as JSONSchema, mode) : 'unknown';
        return `[type: ${tag}, value: ${value}]`;
      }
      const minItems = typeof s.minItems === 'number' ? s.minItems : items.length;
      const parts = items.map((item, i) => {
        const name = typeof item === 'object' ? getTypeName(item, mode) : 'unknown';
        return i >= minItems ? `${name}?` : name;
      });
      return `[${parts.join(', ')}]`;
    }
    const items = getArrayItems(s);
    return items ? `${getTypeName(items, mode)}[]` : 'array';
  }

  if (mode === 'javascript') {
    if (s.format) {
      const jsType = FORMAT_TO_JS_TYPE[s.format];
      if (jsType) return jsType;
    }
    if (s.type === 'integer') return 'number';
  }

  if (!s.type) {
    const id = getSchemaId(s);
    if (id) return id;
    if (s.title) return s.title;
  }

  return s.type ?? 'unknown';
};

// --- Constraints ---

export interface SchemaConstraint {
  label: string;
  value: string;
}

export const getConstraints = (s: JSONSchema, mode: SchemaMode = 'json'): SchemaConstraint[] => {
  const constraints: SchemaConstraint[] = [];

  // Format (skip mapped formats in JS mode — they're already shown as the type name)
  if (s.format && !(mode === 'javascript' && FORMAT_TO_JS_TYPE[s.format])) {
    constraints.push({ label: 'format', value: s.format });
  }

  // String constraints
  if (s.minLength !== undefined) constraints.push({ label: 'min length', value: String(s.minLength) });
  if (s.maxLength !== undefined) constraints.push({ label: 'max length', value: String(s.maxLength) });
  if (s.pattern && !s.format) constraints.push({ label: 'pattern', value: s.pattern });

  // Number constraints
  if (s.minimum !== undefined) constraints.push({ label: 'min', value: String(s.minimum) });
  if (s.maximum !== undefined) constraints.push({ label: 'max', value: String(s.maximum) });
  if (s.exclusiveMinimum !== undefined) constraints.push({ label: 'min (exclusive)', value: String(s.exclusiveMinimum) });
  if (s.exclusiveMaximum !== undefined) constraints.push({ label: 'max (exclusive)', value: String(s.exclusiveMaximum) });
  if (s.multipleOf !== undefined) constraints.push({ label: 'multiple of', value: String(s.multipleOf) });

  // Array constraints
  if (s.minItems !== undefined) constraints.push({ label: 'min items', value: String(s.minItems) });
  if (s.maxItems !== undefined) constraints.push({ label: 'max items', value: String(s.maxItems) });
  if (s.uniqueItems) constraints.push({ label: 'unique items', value: 'true' });

  // Object constraints
  if (s.minProperties !== undefined) constraints.push({ label: 'min properties', value: String(s.minProperties) });
  if (s.maxProperties !== undefined) constraints.push({ label: 'max properties', value: String(s.maxProperties) });

  // Annotations
  if (s.readOnly) constraints.push({ label: 'read-only', value: '' });
  if (s.writeOnly) constraints.push({ label: 'write-only', value: '' });

  // Default value
  if (s.default !== undefined) constraints.push({ label: 'default', value: JSON.stringify(s.default) });

  return constraints;
};

export const summarizeProps = (s: JSONSchema): string => {
  if (!s.properties) return '';
  const keys = Object.keys(s.properties);
  if (!keys.length) return '';
  const shown = keys.slice(0, 3).join(', ');
  const rest = keys.length - 3;
  return rest > 0 ? `{ ${shown}, ${rest} more }` : `{ ${shown} }`;
};

export const getFieldDescriptionHtml = (s: JSONSchema): string => {
  const parts: string[] = [];
  if (s.description) parts.push(s.description);
  return renderDescription(parts.join(' '));
};

// --- Expandability ---

export interface ExpandableVariant {
  label: string;
  summary: string;
  descriptionHtml: string;
  schema: JSONSchema;
  /** Placeholder shown in the type cell when the variant is open. Defaults to `{ }`. */
  openPlaceholder?: string;
}

const getVariantDescriptionHtml = (s: JSONSchema): string => {
  const id = getSchemaId(s);
  const title = id && s.title && id !== s.title ? s.title : undefined;
  const desc = getFieldDescriptionHtml(s);
  if (!title) return desc;
  const titleHtml = `<strong>${renderDescription(title)}</strong>`;
  return desc ? `${titleHtml} — ${desc}` : titleHtml;
};

const isPrimitiveType = (v: JSONSchema): boolean =>
  typeof v.type === 'string' && PRIMITIVE_TYPE_NAMES.has(v.type);

/**
 * Whether `s` is a literal-suggestion union worth rendering as an expandable list of values:
 * named (e.g. `FallbackVariant`) or unnamed-but-long (e.g. `'s'|'xs'|'sm'|'md'|'lg'|'xl'|number`).
 * Variants may include primitive escape hatches (`(string & {})`, `number`, etc.).
 */
export const isExpandableLiteralUnion = (s: JSONSchema): boolean => {
  const variants = getUnionVariants(s);
  if (!variants || variants.length < 2) return false;
  if (!variants.every((v) => v.const !== undefined || isPrimitiveType(v))) return false;
  const constCount = variants.filter((v) => v.const !== undefined).length;
  if (constCount < 1) return false;
  const id = getSchemaId(s);
  if (!id) return false;
  if (PRIMITIVE_TYPE_NAMES.has(id)) return false;
  // Clean alias name (e.g. `FallbackVariant`): always worth expanding.
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(id)) return true;
  // No clean alias: expand only when the literal list is long enough that inline crowds the cell.
  return constCount >= 4;
};

/** Extract the const values from a const-only union (skips the escape-hatch primitives if present). */
export const getConstValues = (s: JSONSchema): unknown[] =>
  (getUnionVariants(s) ?? []).filter((v) => v.const !== undefined).map((v) => v.const);

/**
 * Build a parenthesised inline summary of a const-only union: `("foo" | "bar" | "qux" | 210 more)`.
 * Values fit greedily within `budgetChars`; escape-hatch types (e.g. `string`) are included after consts.
 * Mirrors the object-summary pattern (`{ a, b, c, 4 more }`) but for literal-suggestion unions.
 */
export const summarizeConstValues = (s: JSONSchema, budgetChars = 50): string => {
  const formatted = [
    ...getConstValues(s).map((v) => JSON.stringify(v)),
    ...getEscapeHatchTypes(s),
  ];
  if (formatted.length === 0) return '';
  const allInline = formatted.join(' | ');
  if (allInline.length <= budgetChars) return `(${allInline})`;

  const shown: string[] = [];
  let length = 0;
  const reserveForMore = 11; // " | NNN more"
  for (const item of formatted) {
    const sep = shown.length > 0 ? ' | ' : '';
    // Always show at least the first value, even if it exceeds the budget on its own.
    if (shown.length > 0 && length + sep.length + item.length > budgetChars - reserveForMore) break;
    shown.push(item);
    length += sep.length + item.length;
  }
  const remaining = formatted.length - shown.length;
  return remaining > 0 ? `(${shown.join(' | ')} | ${remaining} more)` : `(${shown.join(' | ')})`;
};

/** Return the primitive types of the escape-hatch branches in a const-or-primitive union (deduped). */
export const getEscapeHatchTypes = (s: JSONSchema): string[] => {
  const variants = getUnionVariants(s);
  if (!variants) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of variants) {
    if (v.const !== undefined) continue;
    if (!isPrimitiveType(v)) continue;
    const t = v.type as string;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
};

/**
 * Recognise a discriminated 2-tuple `[type: 'X', value: Y]` and return the bits the renderer
 * needs: a synthetic `{ type, value }` object schema for expansion, plus the pre-extracted
 * discriminant tag (`'"X"'`) and value type name (`'Y'`) for the inline tuple-form summary.
 * Returning everything in one call avoids re-asserting the tuple shape in the caller.
 */
interface TupleVariantParts {
  synthetic: DocsJSONSchema;
  tag: string;
  valueName: string;
}

const tupleVariantToParts = (s: JSONSchema): TupleVariantParts | undefined => {
  if (s.type !== 'array' || !Array.isArray(s.items) || s.items.length !== 2) return undefined;
  const head = s.items[0];
  const value = s.items[1];
  if (typeof head !== 'object' || head === null || Array.isArray(head) || head.const === undefined) return undefined;
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
  const id = getSchemaId(s);
  return {
    synthetic: {
      type: 'object',
      ...(id ? { id, title: s.title ?? id } : {}),
      properties: { type: head, value },
      required: ['type', 'value'],
    },
    tag: JSON.stringify(head.const),
    valueName: getTypeName(value, 'json'),
  };
};

const variantFromSchema = (s: JSONSchema, arrayPrefix = false): ExpandableVariant | undefined => {
  if (isObjectWithProps(s)) {
    const name = getSchemaName(s);
    const label = arrayPrefix ? `${name}[]` : name;
    return { label, summary: summarizeProps(s), descriptionHtml: getVariantDescriptionHtml(s), schema: s };
  }
  const tuple = tupleVariantToParts(s);
  if (tuple) {
    const name = getSchemaName(tuple.synthetic);
    const label = arrayPrefix ? `${name}[]` : name;
    return {
      label,
      summary: `[type: ${tuple.tag}, value: ${tuple.valueName}]`,
      descriptionHtml: getVariantDescriptionHtml(tuple.synthetic),
      schema: tuple.synthetic,
      openPlaceholder: '[ ]',
    };
  }
  const items = getArrayItems(s);
  if (items && isObjectWithProps(items)) {
    const name = getSchemaName(items);
    return { label: `${name}[]`, summary: summarizeProps(items), descriptionHtml: getVariantDescriptionHtml(items), schema: items };
  }
  return undefined;
};

/** Detect a discriminant: a property where every schema has a unique `const` value. */
const getDiscriminantField = (schemas: JSONSchema[]): string | undefined => {
  if (schemas.length < 2) return undefined;
  const first = schemas[0]!;
  if (!first.properties) return undefined;
  for (const key of Object.keys(first.properties)) {
    const prop = first.properties[key];
    if (!prop || typeof prop !== 'object' || prop.const === undefined) continue;
    if (
      schemas.every((v) => {
        const p = v.properties?.[key];
        return p && typeof p === 'object' && p.const !== undefined;
      })
    )
      return key;
  }
  return undefined;
};

/** Enrich variant labels with discriminant values when variants lack unique ids. */
const enrichWithDiscriminant = (results: ExpandableVariant[]): void => {
  if (results.length < 2) return;
  const disc = getDiscriminantField(results.map((r) => r.schema));
  if (!disc) return;
  for (const variant of results) {
    if (getSchemaId(variant.schema)) continue;
    const prop = variant.schema.properties?.[disc];
    if (!prop || typeof prop !== 'object' || prop.const === undefined) continue;
    const isArray = variant.label.endsWith('[]');
    const base = `{ ${disc}: ${JSON.stringify(prop.const)} }`;
    variant.label = isArray ? `${base}[]` : base;
  }
};

/**
 * Memoise per schema reference. Templates call `getExpandableVariants(field)` 3-4× per row
 * (`v-if` trigger, `length === 1` check, `getTypeSummary` call). The schema is the same
 * object reference across calls within a single render, so a WeakMap pins the result for free.
 * `null` means "computed and is undefined" (distinguished from "not yet computed").
 */
const expandableVariantsCache = new WeakMap<object, ExpandableVariant[] | null>();

const computeExpandableVariants = (s: JSONSchema): ExpandableVariant[] | undefined => {
  // Expandable literal union: synthesize one variant so JsonSchemaPropTable wraps the row.
  // The expand body is rendered specially by JsonSchemaFields; this variant only exists to
  // signal expandability.
  if (isExpandableLiteralUnion(s)) {
    return [{ label: 'values', summary: '', descriptionHtml: '', schema: s }];
  }

  const direct = variantFromSchema(s);
  if (direct) return [direct];

  const unionVariants = getUnionVariants(s);
  if (unionVariants) {
    const results = unionVariants.map((v) => variantFromSchema(v)).filter((v): v is ExpandableVariant => !!v);
    if (results.length) {
      enrichWithDiscriminant(results);
      return results;
    }
  }

  // Array whose items are a union
  const items = getArrayItems(s);
  if (items) {
    const itemVariants = getUnionVariants(items);
    if (itemVariants) {
      const results = itemVariants.map((v) => variantFromSchema(v)).filter((v): v is ExpandableVariant => !!v);
      if (results.length) {
        enrichWithDiscriminant(results);
        return results;
      }
    }
  }

  return undefined;
};

export const getExpandableVariants = (s: JSONSchema): ExpandableVariant[] | undefined => {
  if (typeof s !== 'object' || s === null) return undefined;
  const cached = expandableVariantsCache.get(s);
  if (cached !== undefined) return cached ?? undefined;
  const result = computeExpandableVariants(s);
  expandableVariantsCache.set(s, result ?? null);
  return result;
};

/**
 * Whether the field's description belongs to the expanded object rather than the property.
 * If true, description should only show when expanded.
 */
export const isFieldDescriptionFromObject = (s: JSONSchema): boolean => {
  if (isExpandableLiteralUnion(s)) return false;
  const variants = getExpandableVariants(s);
  if (!variants || variants.length !== 1) return false;
  return variants[0]!.schema === s;
};

export const getTypeSummary = (s: JSONSchema, { expanded = false, mode = 'json' as SchemaMode } = {}): string => {
  // Expandable literal unions: alias + a peek of the values when collapsed (mirrors the object-summary
  // pattern), alias only when expanded (the panel below shows the full list).
  if (isExpandableLiteralUnion(s)) {
    const id = getSchemaId(s)!;
    if (expanded) return id;
    // Joined-form ids (e.g. `number | BreakpointName | (string & {})`) already convey structure;
    // appending a `("a" | "b" | …)` summary would visually muddle the type expression.
    const isCleanAlias = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(id);
    if (!isCleanAlias) return id;
    const summary = summarizeConstValues(s);
    return summary ? `${id} ${summary}` : id;
  }

  const variants = getExpandableVariants(s);
  if (!variants) return getTypeName(s, mode);

  // Single variant: show id + property summary. When the wrapping schema is a union
  // wrapper around the variant (e.g. "CtaBannerButton | undefined"), splice the summary
  // after the variant's name so it visually attaches to the right type.
  if (variants.length === 1) {
    const v = variants[0]!;
    const outerId = getSchemaId(s);
    const innerId = getSchemaId(v.schema);
    const isArray = v.label.endsWith('[]');
    const props = expanded ? '{ }' : summarizeProps(v.schema) || '{ }';

    if (outerId && innerId && outerId !== innerId) {
      // Split the outer id by union pipes (preserving separators) and inject the props
      // after the matching inner id token. The token match assumes inner ids are atomic
      // (no `|` of their own); if that assumption breaks, we fall through to plain id+props.
      const tokens = outerId.split(/(\s*\|\s*)/);
      if (tokens.includes(innerId)) {
        return tokens.map((t) => (t === innerId ? `${innerId}${isArray ? '[]' : ''} ${props}` : t)).join('');
      }
    }

    // At this point either outerId === innerId, or one is missing, or the splice didn't apply;
    // pick whichever is set (they're known equivalent enough for display).
    const id = outerId ?? innerId;
    // Anonymous inline object types get their structural form as the id
    // (e.g. `{ href: string; text: string }`). That already encodes the property names with types,
    // so adding `{ href, text }` on top duplicates the info. Show just the property summary.
    const isStructuralId = id !== undefined && id.trim().startsWith('{');
    if (id && !isStructuralId) return isArray ? `${id}[] ${props}` : `${id} ${props}`;
    return isArray ? `${props}[]` : props;
  }

  // Named union (e.g. Media, Link): show id instead of expanding variant labels
  const id = getSchemaId(s) ?? (s.type === 'array' ? getSchemaId(getArrayItems(s)!) : undefined);
  if (id) return s.type === 'array' ? `${id}[]` : id;

  // Array of unions: (T1 | T2)[]
  if (s.type === 'array') {
    const names = variants.map((v) => v.label.replace(/\[\]$/, ''));
    return `(${names.join(' | ')})[]`;
  }

  // Regular union: T1 | T2 | T3[]
  return variants.map((v) => v.label).join(' | ');
};
