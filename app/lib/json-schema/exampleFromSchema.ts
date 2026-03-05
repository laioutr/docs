import { resolveSchema } from './resolveSchema';

import type { JSONSchema } from '@laioutr-core/core-types/common';

const STRING_HEURISTICS: [RegExp, string][] = [
  [/email/i, 'customer@example.com'],
  [/url|href|link/i, 'https://example.com'],
  [/phone/i, '+1-555-0123'],
  [/name$/i, 'Example Name'],
  [/firstName/i, 'Jane'],
  [/lastName/i, 'Doe'],
  [/password/i, 'secret123'],
  [/token/i, 'tok_abc123'],
  [/id$|Id$/i, 'abc-123'],
  [/sku/i, 'SKU-001'],
  [/slug/i, 'example-item'],
  [/locale|language|lang/i, 'en-US'],
  [/currency/i, 'EUR'],
  [/country/i, 'DE'],
  [/description|body|content/i, 'Example text'],
  [/title|label/i, 'Example'],
  [/date|created|updated/i, '2025-01-15T10:00:00Z'],
  [/image|picture|photo|avatar/i, 'https://example.com/image.jpg'],
];

const NUMBER_HEURISTICS: [RegExp, number][] = [
  [/price|amount|total/i, 29.99],
  [/quantity|count|limit|offset/i, 1],
  [/page/i, 1],
];

const FORMAT_VALUES: Record<string, string> = {
  email: 'customer@example.com',
  uri: 'https://example.com',
  'uri-reference': '/path/to/resource',
  'date-time': '2025-01-15T10:00:00Z',
  date: '2025-01-15',
  time: '10:00:00',
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  ipv4: '192.168.1.1',
  ipv6: '::1',
};

export function exampleFromSchema(schema: JSONSchema, fieldName?: string): unknown {
  const resolved = resolveSchema(schema);
  return generateValue(resolved, fieldName, 0);
}

function generateValue(schema: JSONSchema, fieldName: string | undefined, depth: number): unknown {
  if (depth > 5) return {};

  if (schema.const !== undefined) return schema.const;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  if (schema.default !== undefined) return schema.default;

  // Union types: pick the first non-null variant
  if (schema.oneOf || schema.anyOf) {
    const variants = (schema.oneOf || schema.anyOf) as JSONSchema[];
    const nonNull = variants.find(
      (v) => typeof v === 'object' && v.type !== 'null',
    );
    if (nonNull) return generateValue(resolveSchema(nonNull, { dereferenced: true }), fieldName, depth);
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find((t) => t !== 'null') || schema.type[0]
    : schema.type;

  switch (type) {
    case 'string':
      return stringExample(schema, fieldName);
    case 'number':
    case 'integer':
      return numberExample(schema, fieldName);
    case 'boolean':
      return true;
    case 'array':
      return arrayExample(schema, fieldName, depth);
    case 'object':
      return objectExample(schema, depth);
    case 'null':
      return null;
    default:
      // No type specified but has properties → treat as object
      if (schema.properties) return objectExample(schema, depth);
      return 'example';
  }
}

function stringExample(schema: JSONSchema, fieldName?: string): string {
  if (schema.format && schema.format in FORMAT_VALUES) return FORMAT_VALUES[schema.format]!;
  if (fieldName) {
    for (const [pattern, value] of STRING_HEURISTICS) {
      if (pattern.test(fieldName)) return value;
    }
  }
  return 'example';
}

function numberExample(schema: JSONSchema, fieldName?: string): number {
  if (schema.minimum !== undefined) return schema.minimum as number;
  if (fieldName) {
    for (const [pattern, value] of NUMBER_HEURISTICS) {
      if (pattern.test(fieldName)) return value;
    }
  }
  return schema.type === 'integer' ? 1 : 0;
}

function arrayExample(schema: JSONSchema, fieldName: string | undefined, depth: number): unknown[] {
  if (typeof schema.items === 'object' && !Array.isArray(schema.items)) {
    return [generateValue(resolveSchema(schema.items as JSONSchema, { dereferenced: true }), fieldName, depth + 1)];
  }
  return [];
}

function objectExample(schema: JSONSchema, depth: number): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!schema.properties) return result;

  for (const [key, propSchema] of Object.entries(schema.properties)) {
    if (typeof propSchema !== 'object') continue;
    result[key] = generateValue(resolveSchema(propSchema as JSONSchema, { dereferenced: true }), key, depth + 1);
  }
  return result;
}
