import { classify, type DocsJSONSchema, getUnionVariants, isPrimitiveTypeName, type SchemaKind } from './classify';
import { renderDescription } from './renderDescription';
import type { JSONSchema } from '@laioutr-core/core-types/common';

export type { DocsJSONSchema } from './classify';

export const getSchemaId = (s: JSONSchema): string | undefined => (s as DocsJSONSchema).id;

/** Get the preferred display name: id over title. */
export const getSchemaName = (s: JSONSchema): string => getSchemaId(s) ?? s.title ?? 'object';

// --- Type display ---

export type SchemaMode = 'json' | 'javascript';

const FORMAT_TO_JS_TYPE: Record<string, string> = {
  'date-time': 'Date',
};

/**
 * Whether the items of an array need parentheses when stringified inside `T[]`. The TS
 * postfix `[]` binds tighter than `|` and `&`, so `Array<X | Y>` would render as
 * `X | Y[]` and read as `X | (Y[])` — a different type. Named unions/intersections
 * collapse to a single token via their `id`, so they don't need wrapping.
 */
const needsParensInArrayContext = (k: SchemaKind): boolean => {
  switch (k.kind) {
    case 'union':
    case 'literal-union':
      return !k.id;
    case 'intersection':
      return k.parts.length > 1;
    case 'enum':
      return k.values.length > 1;
    case 'multi-type':
      return k.types.length > 1;
    default:
      return false;
  }
};

export const getTypeName = (s: JSONSchema, mode: SchemaMode = 'json'): string => {
  const k = classify(s);
  switch (k.kind) {
    case 'empty':
      // Preserve the original `getTypeName` output for the two type-bearing empty shapes.
      // (`type:'null'` and `type:'object'` are routed to `empty` upstream by classify.)
      if (k.schema.type === 'null') return 'null';
      if (k.schema.type === 'object') return 'object';
      return 'unknown';
    case 'primitive': {
      if (mode === 'javascript') {
        if (k.format && FORMAT_TO_JS_TYPE[k.format]) return FORMAT_TO_JS_TYPE[k.format]!;
        if (k.type === 'integer') return 'number';
      }
      return k.type;
    }
    case 'const':
      return JSON.stringify(k.value);
    case 'enum':
      return k.values.map((v) => JSON.stringify(v)).join(' | ');
    case 'intersection':
      return k.parts.map((p) => getTypeName(p, mode)).join(' & ');
    case 'multi-type':
      return k.types.join(' | ');
    case 'literal-union':
    case 'union': {
      if (k.id) return k.id;
      const variantSchemas =
        k.kind === 'literal-union' ?
          [...k.consts.map((v) => ({ const: v }) as JSONSchema), ...k.escapeHatches.map((t) => ({ type: t }) as JSONSchema)]
        : k.variants;
      return variantSchemas.map((v) => getTypeName(v, mode)).join(' | ');
    }
    case 'object':
      return k.id ?? k.schema.title ?? 'object';
    case 'record':
      if (mode === 'javascript') return `Record<string, ${getTypeName(k.valueSchema, mode)}>`;
      return k.id ?? k.schema.title ?? 'object';
    case 'array': {
      const name = getTypeName(k.items, mode);
      return needsParensInArrayContext(classify(k.items)) ? `(${name})[]` : `${name}[]`;
    }
    case 'tuple': {
      const parts = k.items.map((item, i) => {
        const name = getTypeName(item, mode);
        return i >= k.minItems ? `${name}?` : name;
      });
      return `[${parts.join(', ')}]`;
    }
    case 'discriminated-tuple': {
      const tag = JSON.stringify(k.tag);
      const value = getTypeName(k.valueSchema, mode);
      return `[type: ${tag}, value: ${value}]`;
    }
    case 'opaque':
      return k.name;
    case 'unknown':
      return (typeof k.schema.type === 'string' ? k.schema.type : undefined) ?? 'unknown';
    default: {
      const _exhaustive: never = k;
      return String(_exhaustive);
    }
  }
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

/**
 * Description to surface immediately above an expanded variant list. For `Foo[]`-style fields
 * the union sits on `items`, so the property's own description ("All media: …") takes the field
 * row and the union's own description ("A Media object describes …") would otherwise be lost.
 * Returns empty for direct-union fields, where the description is already on the field row above.
 */
export const getVariantListDescriptionHtml = (field: JSONSchema): string => {
  if (field.type === 'array' && typeof field.items === 'object' && !Array.isArray(field.items)) {
    return getFieldDescriptionHtml(field.items);
  }
  return '';
};

// --- Expandability ---

export interface ExpandableVariant {
  label: string;
  summary: string;
  descriptionHtml: string;
  schema: JSONSchema;
  /** Placeholder shown in the type cell when the variant is open. Defaults to `{ }`. */
  openPlaceholder?: string;
  /**
   * The `SchemaKind` the variant was synthesised from. Lets downstream callers (e.g.
   * `enrichWithDiscriminant`) make shape-aware decisions without inspecting `schema`,
   * which for `discriminated-tuple` is a render-only `{type, value}` shim.
   */
  originKind?: SchemaKind['kind'];
}

const getVariantDescriptionHtml = (s: JSONSchema): string => {
  const id = getSchemaId(s);
  const title = id && s.title && id !== s.title ? s.title : undefined;
  const desc = getFieldDescriptionHtml(s);
  if (!title) return desc;
  const titleHtml = `<strong>${renderDescription(title)}</strong>`;
  return desc ? `${titleHtml} — ${desc}` : titleHtml;
};

const isPrimitiveType = (v: JSONSchema): boolean => isPrimitiveTypeName(v.type);

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
  if (isPrimitiveTypeName(id)) return false;
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
  const formatted = [...getConstValues(s).map((v) => JSON.stringify(v)), ...getEscapeHatchTypes(s)];
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

const variantFromKind = (k: SchemaKind): ExpandableVariant | undefined => {
  if (k.kind === 'object') {
    const name = getSchemaName(k.schema);
    return {
      label: name,
      summary: summarizeProps(k.schema),
      descriptionHtml: getVariantDescriptionHtml(k.schema),
      schema: k.schema,
      originKind: 'object',
    };
  }
  if (k.kind === 'discriminated-tuple') {
    const synthetic: DocsJSONSchema = {
      type: 'object',
      ...(k.id ? { id: k.id, title: k.schema.title ?? k.id } : {}),
      properties: { type: k.tagSchema, value: k.valueSchema },
      required: ['type', 'value'],
    };
    const name = getSchemaName(synthetic);
    return {
      label: name,
      summary: `[type: ${JSON.stringify(k.tag)}, value: ${getTypeName(k.valueSchema, 'json')}]`,
      descriptionHtml: getVariantDescriptionHtml(synthetic),
      schema: synthetic,
      openPlaceholder: '[ ]',
      originKind: 'discriminated-tuple',
    };
  }
  if (k.kind === 'array') {
    const itemsKind = classify(k.items);
    if (itemsKind.kind === 'object') {
      const name = getSchemaName(k.items);
      return {
        label: `${name}[]`,
        summary: summarizeProps(k.items),
        descriptionHtml: getVariantDescriptionHtml(k.items),
        schema: k.items,
        originKind: 'array',
      };
    }
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
    // Mirror the object form (`{ disc: const }`) with the tuple form (`[disc: const]`) so the
    // shape is preserved and the row's left cell stays distinct from the per-variant `summary`
    // (`[type: "color", value: string]`) shown in the right cell.
    const isArray = variant.label.endsWith('[]');
    const base =
      variant.originKind === 'discriminated-tuple' ?
        `[${disc}: ${JSON.stringify(prop.const)}]`
      : `{ ${disc}: ${JSON.stringify(prop.const)} }`;
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
  const k = classify(s);

  // Expandable literal union: synthesize a single 'values' variant. Display gating happens here.
  if (k.kind === 'literal-union' && isExpandableLiteralUnion(s)) {
    return [{ label: 'values', summary: '', descriptionHtml: '', schema: s }];
  }

  // Direct kinds that produce a single variant
  const direct = variantFromKind(k);
  if (direct) return [direct];

  // Union of variants — each variant gets classified individually
  if (k.kind === 'union') {
    const results = k.variants.map((v) => variantFromKind(classify(v))).filter((v): v is ExpandableVariant => !!v);
    if (results.length) {
      enrichWithDiscriminant(results);
      return results;
    }
  }

  // Array whose items are themselves a union
  if (k.kind === 'array') {
    const itemsKind = classify(k.items);
    if (itemsKind.kind === 'union') {
      const results = itemsKind.variants.map((v) => variantFromKind(classify(v))).filter((v): v is ExpandableVariant => !!v);
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
 * Compact summary for an unnamed union of discriminated tuples: collapses the per-variant
 * `[type: "color", value: string] | [type: "colors", value: string[]] | …` into a single
 * `[type: "color" | "colors" | …, value]`. The full per-variant detail still shows in the
 * expanded view; this just keeps the row summary scannable.
 */
const summarizeDiscriminatedTupleUnion = (variants: ExpandableVariant[]): string | undefined => {
  if (variants.length < 2) return undefined;
  if (!variants.every((v) => v.originKind === 'discriminated-tuple')) return undefined;
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const v of variants) {
    const tag = v.schema.properties?.type;
    if (!tag || typeof tag !== 'object' || tag.const === undefined) return undefined;
    const formatted = JSON.stringify(tag.const);
    if (seen.has(formatted)) continue;
    seen.add(formatted);
    tags.push(formatted);
  }
  return `[type: ${tags.join(' | ')}, value]`;
};

/**
 * Whether the field's description belongs to the expanded object rather than the property.
 * If true, description should only show when expanded.
 *
 * A field whose schema has a stamped `id` came in via a `$ref` to a named definition, which means
 * any description on the resolved schema came with the type — we surface it inside the expansion
 * instead of next to the property name. Only applies when there's exactly one expandable variant
 * (multi-variant unions show the union's own description on the field row).
 */
export const isFieldDescriptionFromObject = (s: JSONSchema): boolean => {
  if (isExpandableLiteralUnion(s)) return false;
  const variants = getExpandableVariants(s);
  if (!variants || variants.length !== 1) return false;
  return !!getSchemaId(s);
};

export const getTypeSummary = (s: JSONSchema, { expanded = false, mode = 'json' as SchemaMode } = {}): string => {
  const k = classify(s);

  // Expandable literal unions: alias + a peek of values when collapsed; alias only when expanded.
  if (k.kind === 'literal-union' && isExpandableLiteralUnion(s)) {
    const id = k.id!;
    if (expanded) return id;
    const isCleanAlias = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(id);
    if (!isCleanAlias) return id;
    const summary = summarizeConstValues(s);
    return summary ? `${id} ${summary}` : id;
  }

  const variants = getExpandableVariants(s);
  if (!variants) return getTypeName(s, mode);

  if (variants.length === 1) {
    const v = variants[0]!;
    const outerId = getSchemaId(s);
    const innerId = getSchemaId(v.schema);
    const isArray = v.label.endsWith('[]');
    const props = expanded ? '{ }' : summarizeProps(v.schema) || '{ }';

    if (outerId && innerId && outerId !== innerId) {
      const tokens = outerId.split(/(\s*\|\s*)/);
      if (tokens.includes(innerId)) {
        return tokens.map((t) => (t === innerId ? `${innerId}${isArray ? '[]' : ''} ${props}` : t)).join('');
      }
    }

    const id = outerId ?? innerId;
    const isStructuralId = id !== undefined && id.trim().startsWith('{');
    if (id && !isStructuralId) return isArray ? `${id}[] ${props}` : `${id} ${props}`;
    return isArray ? `${props}[]` : props;
  }

  // Named union (e.g. Media, Link)
  const id = getSchemaId(s) ?? (k.kind === 'array' ? getSchemaId(k.items) : undefined);
  if (id) return k.kind === 'array' ? `${id}[]` : id;

  // Anonymous union of discriminated tuples: render the compact `[type: "a" | "b", value]` form
  // instead of joining `[type: "a", value: …] | [type: "b", value: …] | …`.
  const tupleSummary = summarizeDiscriminatedTupleUnion(variants);
  if (tupleSummary) return k.kind === 'array' ? `(${tupleSummary})[]` : tupleSummary;

  if (k.kind === 'array') {
    const names = variants.map((v) => v.label.replace(/\[\]$/, ''));
    return `(${names.join(' | ')})[]`;
  }

  return variants.map((v) => v.label).join(' | ');
};
