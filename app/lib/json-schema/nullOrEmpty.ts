import type { JSONSchema } from '@laioutr-core/core-types/common';

export const nullOrEmpty = (schema: JSONSchema) => {
  if (schema.anyOf?.length || schema.oneOf?.length || schema.allOf?.length) return false;
  if (!schema.type || schema.type === 'null') return true;
  if (schema.type === 'object' && !Object.keys(schema.properties ?? {}).length) return true;
  return false;
};
