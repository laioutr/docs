import { dereferenceSync } from 'dereference-json-schema';
import type { JSONSchema } from '@laioutr-core/core-types/common';

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
