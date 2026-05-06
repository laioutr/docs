/**
 * Fixtures dumped from `@laioutr-core/canonical-types/reflection` on 2026-05-06.
 *
 * The three real-schema constants (`ZOD_ACTION_INPUT`, `ZOD_ACTION_OUTPUT`, `ZOD_COMPONENT_PRICES`)
 * anchor the suite in actual shipped shapes — when canonical-types changes, these may need refreshing.
 *
 * Refresh recipe (replace NAME and OUTPUT_PATH per fixture; full setup in
 * docs/plans/2026-05-06-json-schema-test-suite.md, Task 4):
 *
 * ```bash
 * node --input-type=module -e "
 *   import('@laioutr-core/canonical-types/reflection').then(m => {
 *     const r = m.default;
 *     // For actions:    r.actions.find(a => a.name === NAME).input | .output
 *     // For components: r.components.find(c => c.name === NAME).schema
 *     console.log(JSON.stringify(SELECTED, null, 2));
 *   });
 * " > OUTPUT_PATH
 * ```
 *
 * Sources of the captured fixtures:
 * - `zod-action-input.json`     — action `ecommerce/cart/add-items`, `.input`
 * - `zod-action-output.json`    — action `ecommerce/customer/get-current`, `.output`
 * - `zod-component-prices.json` — component for entity `Product`, name `prices` (renamed from
 *                                 the plan's `ZOD_COMPONENT_BASE`; prices has richer $ref shape)
 *
 * Note: `id` on schemas (e.g. on `ALL_OF_INTERSECTION` variants) is the Laioutr `DocsJSONSchema`
 * extension defined in `../introspection.ts`, not standard JSON Schema.
 */
import type { DocsJSONSchema } from '../introspection';
import zodActionInput from './zod-action-input.json' with { type: 'json' };
import zodActionOutput from './zod-action-output.json' with { type: 'json' };
import zodComponentPrices from './zod-component-prices.json' with { type: 'json' };

/**
 * Real action input schema captured from `@laioutr-core/canonical-types/reflection`
 * (`ecommerce/cart/add-items`). Exercises `anyOf` of `$ref`s, `allOf` single-element
 * wraps around `$ref`, nested `definitions`, `const` discriminators.
 */
export const ZOD_ACTION_INPUT = zodActionInput as DocsJSONSchema;

/**
 * Real action output schema captured from `@laioutr-core/canonical-types/reflection`
 * (`ecommerce/customer/get-current`). Exercises `$ref`+`definitions`, `allOf` single-element
 * wraps, `format`+`pattern` strings, and synthetic `__schema*` ids in `definitions` (the
 * shape `withDefinitionIds` is meant to keep stable).
 */
export const ZOD_ACTION_OUTPUT = zodActionOutput as DocsJSONSchema;

/**
 * Real component schema captured from `@laioutr-core/canonical-types/reflection`
 * (entity `Product`, component `prices`). Exercises `$ref`+`definitions`, `allOf`
 * single-element wraps, and nested `$ref`s between `definitions` (Money → Measurement).
 */
export const ZOD_COMPONENT_PRICES = zodComponentPrices as DocsJSONSchema;

// --- Synthetic complements (for shapes the real schemas don't cover) ---

/** $ref to $defs — minimal example. */
export const REF_TO_DEFS: DocsJSONSchema = {
  $defs: {
    User: {
      type: 'object',
      properties: { id: { type: 'string' }, name: { type: 'string' } },
      required: ['id'],
    },
  },
  $ref: '#/$defs/User',
};

/** Single-element `allOf` wrap — zod's $ref codegen produces this. */
export const ALL_OF_SINGLE_WRAP: DocsJSONSchema = {
  allOf: [{ type: 'string' }],
};

/** Multi-element `allOf` — real intersection. */
export const ALL_OF_INTERSECTION: DocsJSONSchema = {
  allOf: [
    { type: 'object', id: 'A', properties: { a: { type: 'string' } } },
    { type: 'object', id: 'B', properties: { b: { type: 'number' } } },
  ],
};

/** anyOf of full objects with own ids — common in zod-emitted union schemas. */
export const ANY_OF_OBJECTS: DocsJSONSchema = {
  anyOf: [
    {
      type: 'object',
      id: 'TextNode',
      properties: { type: { const: 'text' }, value: { type: 'string' } },
      required: ['type', 'value'],
    },
    {
      type: 'object',
      id: 'ImageNode',
      properties: { type: { const: 'image' }, src: { type: 'string' } },
      required: ['type', 'src'],
    },
  ],
};

/** Cyclic ref — synthetic; tests that resolveSchema doesn't loop. */
export const RECURSIVE_REF: DocsJSONSchema = {
  $defs: {
    Tree: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        children: { type: 'array', items: { $ref: '#/$defs/Tree' } },
      },
    },
  },
  $ref: '#/$defs/Tree',
};

/** Definitions stamped with id by withDefinitionIds. */
export const DEFS_NEEDS_STAMPING: DocsJSONSchema = {
  $defs: {
    Color: { type: 'string', enum: ['red', 'blue'] },
    __schema123: { type: 'number' }, // synthetic name — should NOT be stamped
  },
  type: 'object',
  properties: {
    color: { $ref: '#/$defs/Color' },
    score: { $ref: '#/$defs/__schema123' },
  },
};
