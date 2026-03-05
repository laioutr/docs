import { renderDescription } from './renderDescription';
import { resolveSchema } from './resolveSchema';
import type { JSONSchema } from '@laioutr-core/core-types/common';

/** Access the custom `id` field added by canonical-types reflection. */
export const getSchemaId = (s: JSONSchema): string | undefined => (s as Record<string, unknown>).id as string | undefined;

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

export const getTypeName = (s: JSONSchema, mode: SchemaMode = 'json'): string => {
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(' | ');
  if (s.allOf?.length) return s.allOf.map((v) => getTypeName(v, mode)).join(' & ');

  const variants = getUnionVariants(s);
  if (variants) return variants.map((v) => getTypeName(v, mode)).join(' | ');

  if (s.type === 'object') {
    if (mode === 'javascript' && !s.properties && typeof s.additionalProperties === 'object') {
      return `Record<string, ${getTypeName(s.additionalProperties, mode)}>`;
    }
    return getSchemaName(s);
  }
  if (s.type === 'array') {
    if (Array.isArray(s.items)) {
      const minItems = typeof s.minItems === 'number' ? s.minItems : s.items.length;
      const parts = s.items.map((item, i) => {
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
}

const getVariantDescriptionHtml = (s: JSONSchema): string => {
  const id = getSchemaId(s);
  const title = id && s.title && id !== s.title ? s.title : undefined;
  const desc = getFieldDescriptionHtml(s);
  if (!title) return desc;
  const titleHtml = `<strong>${renderDescription(title)}</strong>`;
  return desc ? `${titleHtml} — ${desc}` : titleHtml;
};

const variantFromSchema = (s: JSONSchema, arrayPrefix = false): ExpandableVariant | undefined => {
  if (isObjectWithProps(s)) {
    const name = getSchemaName(s);
    const label = arrayPrefix ? `${name}[]` : name;
    return { label, summary: summarizeProps(s), descriptionHtml: getVariantDescriptionHtml(s), schema: s };
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

export const getExpandableVariants = (s: JSONSchema): ExpandableVariant[] | undefined => {
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

/**
 * Whether the field's description belongs to the expanded object rather than the property.
 * If true, description should only show when expanded.
 */
export const isFieldDescriptionFromObject = (s: JSONSchema): boolean => {
  const variants = getExpandableVariants(s);
  if (!variants || variants.length !== 1) return false;
  return variants[0]!.schema === s;
};

export const getTypeSummary = (s: JSONSchema, { expanded = false, mode = 'json' as SchemaMode } = {}): string => {
  const variants = getExpandableVariants(s);
  if (!variants) return getTypeName(s, mode);

  // Single variant: show id + property summary
  if (variants.length === 1) {
    const v = variants[0]!;
    const id = getSchemaId(v.schema);
    const isArray = v.label.endsWith('[]');
    const props = expanded ? '{ }' : summarizeProps(v.schema) || '{ }';
    if (id) {
      return isArray ? `${id}[] ${props}` : `${id} ${props}`;
    }
    return isArray ? `${props}[]` : props;
  }

  // Array of unions: (T1 | T2)[]
  if (s.type === 'array') {
    const names = variants.map((v) => v.label.replace(/\[\]$/, ''));
    return `(${names.join(' | ')})[]`;
  }

  // Regular union: T1 | T2 | T3[]
  return variants.map((v) => v.label).join(' | ');
};
