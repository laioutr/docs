import type { JSONSchema } from '@laioutr-core/core-types/common';

export const nullOrEmpty = (schema: JSONSchema) => !schema.type || schema.type === 'null';
