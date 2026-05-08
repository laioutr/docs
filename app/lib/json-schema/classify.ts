import { resolveSchema } from './resolveSchema';
import type { JSONSchema } from '@laioutr-core/core-types/common';

/** JSON Schema with the custom `id` field added by canonical-types reflection / vue-component-meta adapter. */
export type DocsJSONSchema = JSONSchema & { id?: string };

/**
 * The structural type names that count as a primitive in the renderer.
 * `null` is intentionally excluded — it short-circuits to `kind: 'empty'` upstream.
 * `bigint` is a valid TS-emitted type that vue-component-meta can produce.
 */
export const PRIMITIVE_TYPE_NAMES = ['boolean', 'string', 'number', 'integer', 'bigint'] as const;
export type PrimitiveTypeName = (typeof PRIMITIVE_TYPE_NAMES)[number];

export const isPrimitiveTypeName = (t: unknown): t is PrimitiveTypeName =>
  typeof t === 'string' && (PRIMITIVE_TYPE_NAMES as readonly string[]).includes(t);

const getId = (s: JSONSchema): string | undefined => (s as DocsJSONSchema).id;

/** Resolve, then collect anyOf/oneOf variants. Each variant is also resolved. Returns undefined if none. */
export const getUnionVariants = (s: JSONSchema): JSONSchema[] | undefined => {
  const variants = s.anyOf ?? s.oneOf;
  if (!variants?.length) return undefined;
  return variants.filter((v): v is JSONSchema => typeof v === 'object' && v !== null).map((v) => resolveSchema(v, { dereferenced: true }));
};

export type SchemaKind =
  | { kind: 'empty'; schema: JSONSchema }
  | { kind: 'primitive'; type: PrimitiveTypeName; id?: string; format?: string; schema: JSONSchema }
  | { kind: 'const'; value: unknown; id?: string; schema: JSONSchema }
  | { kind: 'enum'; values: unknown[]; id?: string; schema: JSONSchema }
  | { kind: 'literal-union'; consts: unknown[]; escapeHatches: string[]; id?: string; schema: JSONSchema }
  | { kind: 'union'; variants: JSONSchema[]; id?: string; schema: JSONSchema }
  | { kind: 'intersection'; parts: JSONSchema[]; schema: JSONSchema }
  | { kind: 'multi-type'; types: string[]; schema: JSONSchema }
  | { kind: 'object'; properties: Record<string, JSONSchema>; required: string[]; id?: string; schema: JSONSchema }
  | { kind: 'record'; valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'array'; items: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'tuple'; items: JSONSchema[]; minItems: number; id?: string; schema: JSONSchema }
  | { kind: 'discriminated-tuple'; tag: unknown; tagSchema: JSONSchema; valueSchema: JSONSchema; id?: string; schema: JSONSchema }
  | { kind: 'opaque'; name: string; schema: JSONSchema }
  | { kind: 'unknown'; schema: JSONSchema };

export const classify = (input: JSONSchema): SchemaKind => {
  const s = resolveSchema(input, { dereferenced: false });

  if (s.const !== undefined) return { kind: 'const', value: s.const, id: getId(s), schema: s };
  if (s.enum) return { kind: 'enum', values: s.enum, id: getId(s), schema: s };

  if (s.allOf?.length) {
    const parts = s.allOf
      .filter((p): p is JSONSchema => typeof p === 'object' && p !== null)
      .map((p) => resolveSchema(p, { dereferenced: true }));
    return { kind: 'intersection', parts, schema: s };
  }

  const variants = getUnionVariants(s);
  if (variants) {
    const consts: unknown[] = [];
    const escapeHatches: string[] = [];
    let allConstOrPrimitive = true;
    const seenHatches = new Set<string>();
    for (const v of variants) {
      if (v.const !== undefined) {
        consts.push(v.const);
        continue;
      }
      if (typeof v.type === 'string' && isPrimitiveTypeName(v.type)) {
        if (!seenHatches.has(v.type)) {
          seenHatches.add(v.type);
          escapeHatches.push(v.type);
        }
        continue;
      }
      allConstOrPrimitive = false;
      break;
    }
    if (allConstOrPrimitive && consts.length >= 1) {
      return { kind: 'literal-union', consts, escapeHatches, id: getId(s), schema: s };
    }
    return { kind: 'union', variants, id: getId(s), schema: s };
  }

  if (Array.isArray(s.type)) {
    const types = s.type.filter((t): t is string => typeof t === 'string');
    return { kind: 'multi-type', types, schema: s };
  }
  if (s.nullable === true && typeof s.type === 'string') {
    return { kind: 'multi-type', types: [s.type, 'null'], schema: s };
  }

  if (s.type === 'object') {
    if (s.properties && Object.keys(s.properties).length > 0) {
      const properties = Object.fromEntries(
        Object.entries(s.properties).filter((entry): entry is [string, JSONSchema] => typeof entry[1] === 'object' && entry[1] !== null)
      );
      return {
        kind: 'object',
        properties,
        required: s.required ?? [],
        id: getId(s),
        schema: s,
      };
    }
    if (typeof s.additionalProperties === 'object' && s.additionalProperties !== null) {
      return {
        kind: 'record',
        valueSchema: resolveSchema(s.additionalProperties as JSONSchema, { dereferenced: true }),
        id: getId(s),
        schema: s,
      };
    }
    return { kind: 'empty', schema: s };
  }

  if (s.type === 'array') {
    if (Array.isArray(s.items)) {
      const items = s.items.filter((i): i is JSONSchema => typeof i === 'object' && i !== null);
      if (items.length === 2) {
        const [head, value] = items as [JSONSchema, JSONSchema];
        if (head.const !== undefined) {
          return {
            kind: 'discriminated-tuple',
            tag: head.const,
            tagSchema: head,
            valueSchema: resolveSchema(value, { dereferenced: true }),
            id: getId(s),
            schema: s,
          };
        }
      }
      const resolvedItems = items.map((i) => resolveSchema(i, { dereferenced: true }));
      return {
        kind: 'tuple',
        items: resolvedItems,
        minItems: typeof s.minItems === 'number' ? s.minItems : resolvedItems.length,
        id: getId(s),
        schema: s,
      };
    }
    if (typeof s.items === 'object' && s.items !== null) {
      return {
        kind: 'array',
        items: resolveSchema(s.items as JSONSchema, { dereferenced: true }),
        id: getId(s),
        schema: s,
      };
    }
    return { kind: 'unknown', schema: s };
  }

  if (s.type === 'null') return { kind: 'empty', schema: s };

  if (isPrimitiveTypeName(s.type)) {
    return {
      kind: 'primitive',
      type: s.type,
      id: getId(s),
      format: typeof s.format === 'string' ? s.format : undefined,
      schema: s,
    };
  }

  if (!s.type) {
    const id = getId(s);
    if (id) return { kind: 'opaque', name: id, schema: s };
    if (s.title) return { kind: 'opaque', name: s.title, schema: s };
    if (Object.keys(s).length === 0) return { kind: 'empty', schema: s };
  }

  return { kind: 'unknown', schema: s };
};
