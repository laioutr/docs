/**
 * Fixture catalog for JSON schema rendering tests, split by source/origin:
 *
 * - `schemas-shared` — shapes both vue-component-meta and canonical-types/reflection produce
 *   (primitives, simple objects, tuples, annotations, literal unions).
 * - `schemas-zod` — canonical-types/reflection style ($ref+$defs, allOf single-element wraps,
 *   anyOf of full-id objects, recursive refs). Includes 3 real schemas captured from
 *   `@laioutr-core/canonical-types/reflection`.
 * - `schemas-vue` — vue-component-meta adapter outputs (structural ids, opaque framework
 *   types, flat — no $ref).
 * - `vue-meta` — vue-component-meta PropertyMeta inputs (the adapter's input side).
 */
export * from './schemas-shared';
export * from './schemas-zod';
export * from './schemas-vue';
export * from './vue-meta';
