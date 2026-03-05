import type { JSONSchema } from '@laioutr-core/core-types/common';

// Inlined from dereference-json-schema (CJS-only package breaks Vite dev server)
function klona(val: any): any {
  if (Array.isArray(val)) {
    const out = Array(val.length);
    for (let i = val.length; i--; ) out[i] = val[i] && typeof val[i] === 'object' ? klona(val[i]) : val[i];
    return out;
  }
  if (Object.prototype.toString.call(val) === '[object Object]') {
    const out: any = {};
    for (const k in val) out[k] = val[k] && typeof val[k] === 'object' ? klona(val[k]) : val[k];
    return out;
  }
  return val;
}

function resolveRef(schema: any, ref: string): any {
  const path = ref.split('/').slice(1);
  let current: any = schema;
  for (const segment of path) {
    if (!current || typeof current !== 'object') return null;
    current = current[segment] ?? null;
  }
  return current;
}

function dereferenceSync(schema: any): any {
  const visited = new Set();
  const cloned = klona(schema);
  function resolve(current: any): any {
    if (typeof current !== 'object' || current === null || visited.has(current)) return current;
    visited.add(current);
    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++) current[i] = resolve(current[i]);
    } else {
      if ('$ref' in current && typeof current.$ref === 'string') return resolveRef(cloned, current.$ref);
      for (const key in current) current[key] = resolve(current[key]);
    }
    return current;
  }
  return resolve(cloned);
}

/**
 * Return a shallow clone of the schema with `id` stamped on every
 * `definitions` / `$defs` entry that lacks one (using the key as the name).
 * The original schema is not mutated.
 */
function withDefinitionIds(schema: JSONSchema): JSONSchema {
  if (typeof schema !== 'object') return schema;
  const raw = schema as Record<string, unknown>;
  const defsKey = raw.definitions ? 'definitions' : raw.$defs ? '$defs' : undefined;
  if (!defsKey) return schema;

  const defs = raw[defsKey] as Record<string, JSONSchema>;
  const stamped: Record<string, JSONSchema> = {};
  let changed = false;
  for (const [name, def] of Object.entries(defs)) {
    if (typeof def === 'object' && !(def as Record<string, unknown>).id && !/^__schema\d+$/.test(name)) {
      stamped[name] = { ...def, id: name } as JSONSchema;
      changed = true;
    } else {
      stamped[name] = def;
    }
  }
  return changed ? { ...schema, [defsKey]: stamped } : schema;
}

/**
 * Normalizes a JSON Schema into its canonical form:
 * 1. Stamps fallback `id` on unnamed definitions (using the definition key)
 * 2. Dereferences all `$ref` pointers (unless already dereferenced)
 * 3. Unwraps single-element `allOf` wrappers (common from zod `$ref` codegen)
 *
 * Call once at the boundary (root schema, property values, array items, union variants)
 * so all downstream helpers can work on clean schemas without re-checking.
 */
export function resolveSchema(schema: JSONSchema, { dereferenced = false } = {}): JSONSchema {
  const input = dereferenced ? schema : withDefinitionIds(schema);
  let s = dereferenced ? input : (dereferenceSync(input as any) as unknown as JSONSchema);

  // Unwrap single-element allOf (e.g. { allOf: [{ $ref: "..." }] } after deref)
  while (s.allOf?.length === 1 && typeof s.allOf[0] === 'object') {
    s = s.allOf[0] as JSONSchema;
  }

  return s;
}
