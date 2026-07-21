<script setup lang="ts">
import type { JSONSchema } from '@laioutr-core/core-types/common';
import type { SchemaMode } from '../../lib/json-schema/introspection';

definePageMeta({ layout: false });

interface Entry {
  label: string;
  schema: JSONSchema;
  note?: string;
  needsInvestigation?: boolean;
}

interface Section {
  id: string;
  title: string;
  entries: Entry[];
}

const mode = ref<SchemaMode>('javascript');

const TextNode = { id: 'TextNode', type: 'object', properties: { type: { const: 'text' }, text: { type: 'string' } }, required: ['type', 'text'] } as JSONSchema;
const ImageNode = { id: 'ImageNode', type: 'object', properties: { type: { const: 'image' }, src: { type: 'string', format: 'uri' } }, required: ['type', 'src'] } as JSONSchema;
const FileNode = { id: 'FileNode', type: 'object', properties: { type: { const: 'file' }, href: { type: 'string', format: 'uri' }, mime: { type: 'string' } }, required: ['type', 'href'] } as JSONSchema;

const sections: Section[] = [
  {
    id: 'primitives',
    title: 'Primitives & basics',
    entries: [
      { label: 'string', schema: { type: 'string' } },
      { label: 'integer (mode-sensitive)', schema: { type: 'integer' }, note: 'In javascript mode, renders as `number`.' },
      { label: 'string + format: date-time', schema: { type: 'string', format: 'date-time' }, note: 'In javascript mode, renders as `Date` and the format chip is suppressed.' },
      { label: 'string + format: email', schema: { type: 'string', format: 'email' } },
      { label: 'string + pattern (no format)', schema: { type: 'string', pattern: '^[a-z]+$' } },
      { label: 'string + format + pattern (pattern hidden)', schema: { type: 'string', format: 'email', pattern: '^[^@]+@[^@]+$' } },
      { label: 'number with all numeric constraints', schema: { type: 'number', minimum: 0, maximum: 100, exclusiveMinimum: 0, multipleOf: 5 } },
      { label: 'bare {} (any value)', schema: {}, note: 'Empty schema — classified as `empty`.' },
      { label: '{ type: "null" }', schema: { type: 'null' } },
      { label: '{ type: "object" } (no properties)', schema: { type: 'object' }, needsInvestigation: true },
    ],
  },
  {
    id: 'const-enum',
    title: 'Const & enum',
    entries: [
      { label: 'const string', schema: { const: 'fixed' } },
      { label: 'const number', schema: { const: 42 } },
      { label: 'const wins over enum', schema: { const: 'a', enum: ['a', 'b'] } },
      { label: 'enum strings', schema: { enum: ['a', 'b', 'c'] } },
      { label: 'enum mixed types', schema: { enum: ['on', 'off', 0, 1] } },
    ],
  },
  {
    id: 'multi-type-nullable',
    title: 'Multi-type & nullable (review focus)',
    entries: [
      { label: 'type: ["string", "null"]', schema: { type: ['string', 'null'] } as any, note: 'Replaces the old `Array.isArray(schema.type)` workaround in `getTypeName`.', needsInvestigation: true },
      { label: 'type: ["string", "number", "null"]', schema: { type: ['string', 'number', 'null'] } as any, note: '3-way join in the multi-type kind.', needsInvestigation: true },
      { label: 'OpenAPI nullable: true', schema: { type: 'string', nullable: true } as any, note: 'Normalised by classify into multi-type as if `type: ["string","null"]`.', needsInvestigation: true },
      { label: 'OpenAPI nullable + format: date-time', schema: { type: 'string', format: 'date-time', nullable: true } as any, note: 'KNOWN GAP: javascript-mode format mapping (`Date | null`) is lost — multi-type ignores `format`.', needsInvestigation: true },
      { label: 'multi-type as object property', schema: { type: 'object', properties: { id: { type: 'string' }, middleName: { type: ['string', 'null'] } as any }, required: ['id'] }, note: 'Exercises the field-row code path.', needsInvestigation: true },
      { label: 'multi-type as array items', schema: { type: 'array', items: { type: ['string', 'null'] } as any }, note: 'Should render as `(string | null)[]` — `needsParensInArrayContext` adds the parens.' },
      { label: 'OpenAPI nullable on object', schema: { type: 'object', id: 'Foo', properties: { x: { type: 'string' } }, required: ['x'], nullable: true } as any, note: 'KNOWN GAP: classify\'s nullable branch only fires when `typeof type === "string"` — this stays `kind: "object"` and nullable is ignored.', needsInvestigation: true },
    ],
  },
  {
    id: 'composition',
    title: 'Composition',
    entries: [
      { label: 'allOf intersection', schema: { allOf: [{ id: 'A', type: 'object', properties: { a: { type: 'string' } }, required: ['a'] }, { id: 'B', type: 'object', properties: { b: { type: 'number' } }, required: ['b'] }] }, needsInvestigation: true },
      { label: 'allOf single-element wrap', schema: { allOf: [{ type: 'string' }] }, note: 'nuxt-component-meta sometimes emits this — should unwrap to plain `string`.' },
      { label: '$ref to $defs (non-recursive)', schema: { $defs: { Foo: { id: 'Foo', type: 'object', properties: { x: { type: 'string' } }, required: ['x'] } }, $ref: '#/$defs/Foo' } as any, note: 'Recursive $ref entries dropped — JsonSchemaFields recurses into resolved properties with `dereferenced: true`, but cyclic graphs lose the $defs context after the first deref.' },
    ],
  },
  {
    id: 'unions',
    title: 'Unions & discriminants',
    entries: [
      { label: 'anonymous primitive union (string | number | null)', schema: { anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] }, note: 'This is the shape canonical-types reflection actually produces — *not* multi-type.' },
      { label: 'named union of objects (id: "Node")', schema: { id: 'Node', anyOf: [TextNode, ImageNode] } as any, note: 'When the union has an id, the field shows the id.' },
      { label: '3-way named discriminated union (Media)', schema: { id: 'Media', anyOf: [ImageNode, { id: 'Video', type: 'object', properties: { type: { const: 'video' }, src: { type: 'string', format: 'uri' } }, required: ['type', 'src'] }, FileNode] } as any },
      { label: 'mixed object + primitive (Foo | string)', schema: { anyOf: [{ id: 'Foo', type: 'object', properties: { x: { type: 'string' } }, required: ['x'] } as any, { type: 'string' }] },
      { label: 'array of union ((A | B)[])', schema: { type: 'array', items: { anyOf: [TextNode, ImageNode] } } },
      { label: 'anonymous discriminated tuples (Swatch-shape)', schema: { anyOf: [{ type: 'array', items: [{ const: 'color' }, { type: 'string' }] }, { type: 'array', items: [{ const: 'colors' }, { type: 'array', items: { type: 'string' } }] }, { type: 'array', items: [{ const: 'gradient' }, { type: 'array', items: { type: 'string' } }] }] } },
    ],
  },
  {
    id: 'literal-unions',
    title: 'Literal unions',
    entries: [
      { label: 'named clean alias (FallbackVariant)', schema: { id: 'FallbackVariant', anyOf: [{ const: 'icon' }, { const: 'text' }, { const: 'none' }] } as any, note: 'Clean alias — always expands.' },
      { label: 'joined-form long (4+ consts, no clean id)', schema: { id: '"a" | "b" | "c" | "d"', anyOf: [{ const: 'a' }, { const: 'b' }, { const: 'c' }, { const: 'd' }] } as any },
      { label: 'joined-form too short (2 consts)', schema: { id: '"a" | "b"', anyOf: [{ const: 'a' }, { const: 'b' }] } as any, note: 'Below the 4-const threshold — does not expand.' },
      { label: 'named with primitive escape (IconName)', schema: { id: 'IconName', anyOf: [{ const: 'arrow' }, { const: 'check' }, { const: 'close' }, { const: 'menu' }, { const: 'home' }, { type: 'string' }] } as any },
      { label: 'multi-escape (string + number)', schema: { id: 'Sized', anyOf: [{ const: 's' }, { const: 'm' }, { const: 'l' }, { type: 'string' }, { type: 'number' }] } as any },
      { label: 'numeric literal union', schema: { id: 'PowerOfTwo', anyOf: [{ const: 1 }, { const: 2 }, { const: 4 }, { const: 8 }] } as any },
      { label: 'mixed-type consts ("on" | "off" | 0 | 1)', schema: { anyOf: [{ const: 'on' }, { const: 'off' }, { const: 0 }, { const: 1 }] } },
      { label: 'boolean-const union (KNOWN GAP)', schema: { id: 'Toggle', anyOf: [{ const: true }, { const: false }] } as any, note: '.todo line 581: clean alias should expand, currently collapses to `boolean`.', needsInvestigation: true },
    ],
  },
  {
    id: 'objects',
    title: 'Objects',
    entries: [
      { label: 'simple { name, age? }', schema: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } }, required: ['name'] } },
      { label: 'named object (id: "User")', schema: { id: 'User', type: 'object', properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' } }, required: ['name', 'email'] } as any },
      { label: 'with deprecated property', schema: { type: 'object', properties: { active: { type: 'boolean' }, legacy: { type: 'string', deprecated: true } }, required: ['active'] } },
      { label: 'with default values', schema: { type: 'object', properties: { greeting: { type: 'string', default: 'hello' }, retries: { type: 'integer', default: 3 } } } },
      { label: 'nested 3 levels', schema: { type: 'object', properties: { a: { type: 'object', properties: { b: { type: 'object', properties: { c: { type: 'string' } }, required: ['c'] } }, required: ['b'] } }, required: ['a'] } },
      { label: 'object whose property is multi-type', schema: { type: 'object', id: 'Profile', properties: { displayName: { type: 'string' }, middleName: { type: ['string', 'null'] } as any, age: { type: 'integer', nullable: true } as any }, required: ['displayName'] } as any, needsInvestigation: true },
    ],
  },
  {
    id: 'records',
    title: 'Records',
    entries: [
      { label: 'Record<string, string>', schema: { type: 'object', additionalProperties: { type: 'string' } }, note: 'In javascript mode renders as `Record<string, string>`.' },
      { label: 'Record<string, A | B>', schema: { type: 'object', additionalProperties: { anyOf: [TextNode, ImageNode] } }, needsInvestigation: true },
      { label: 'CustomFields open record (named)', schema: { id: 'CustomFields', title: 'CustomFields', type: 'object', additionalProperties: {} } as any, needsInvestigation: true },
      { label: 'additionalProperties + siblings (KNOWN GAP)', schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: { type: 'number' } }, note: '.todo line 576: should render as object + "any other key" row. Currently `additionalProperties` is dropped because object branch wins.', needsInvestigation: true },
    ],
  },
  {
    id: 'arrays',
    title: 'Arrays',
    entries: [
      { label: 'string[]', schema: { type: 'array', items: { type: 'string' } } },
      { label: 'string[] with min/max/unique', schema: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10, uniqueItems: true } },
      { label: '(A | B)[] (parens needed)', schema: { type: 'array', items: { anyOf: [{ type: 'string' }, { type: 'number' }] } } },
      { label: '(string & {})[]', schema: { type: 'array', items: { allOf: [{ type: 'string' }, { id: 'Branded', type: 'object' }] } }, needsInvestigation: true },
      { label: 'Foo[]-style with items description', schema: { type: 'array', items: { id: 'Foo', type: 'object', description: 'A Foo represents a configurable thing in the system.', properties: { x: { type: 'string' } }, required: ['x'] } } as any, note: 'Items description should appear above the expanded property list (`getVariantListDescriptionHtml`).', needsInvestigation: true },
    ],
  },
  {
    id: 'tuples',
    title: 'Tuples',
    entries: [
      { label: '3-tuple [string, number, boolean]', schema: { type: 'array', items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] } as any, needsInvestigation: true },
      { label: 'tuple with optional tail (minItems: 1)', schema: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], minItems: 1 } as any, note: 'Slot 2 should render as `number?`.', needsInvestigation: true },
      { label: 'discriminated 2-tuple [type: "colors", value: string[]]', schema: { type: 'array', items: [{ const: 'colors' }, { type: 'array', items: { type: 'string' } }] } as any, needsInvestigation: true },
      { label: 'tuple with enum head', schema: { type: 'array', items: [{ enum: ['x', 'y', 'z'] }, { type: 'number' }] } as any, needsInvestigation: true },
    ],
  },
  {
    id: 'descriptions',
    title: 'Description visibility rules',
    entries: [
      {
        label: 'A. Property has description, schema has none',
        schema: { type: 'object', properties: { foo: { type: 'string', description: 'A property-level description.' } } },
        note: 'Description on the field row, always visible.',
      },
      {
        label: 'B. Property has description AND schema (object) has description',
        schema: { type: 'object', properties: { foo: { id: 'Foo', type: 'object', description: 'Object-level description (only when expanded).', properties: { x: { type: 'string', description: 'Inner field description.' } }, required: ['x'] } as any } } as any,
        note: 'No property description here — when expandable & single-variant & variant.schema === field, `isFieldDescriptionFromObject` is true so the description shows only when expanded.',
      },
      {
        label: 'C. Property w/o description, schema has description',
        schema: { type: 'object', properties: { user: { id: 'User', type: 'object', description: 'A registered user account.', properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' } }, required: ['name', 'email'] } as any } } as any,
        note: 'Description appears only when expanded.',
      },
      {
        label: 'D. `Foo[]` field where items has description',
        schema: { type: 'object', properties: { items: { type: 'array', items: { id: 'Item', type: 'object', description: 'A line item in the cart.', properties: { sku: { type: 'string' }, qty: { type: 'integer' } }, required: ['sku', 'qty'] } } } } as any,
        note: 'Items description renders above the expanded property list (`getVariantListDescriptionHtml`).',
      },
      {
        label: 'E. `Foo[]` where property AND items have descriptions',
        schema: { type: 'object', properties: { lineItems: { type: 'array', description: 'Cart line items.', items: { id: 'LineItem', type: 'object', description: 'A LineItem describes a single product entry.', properties: { sku: { type: 'string' }, qty: { type: 'integer' } }, required: ['sku', 'qty'] } } } } as any,
        note: 'Property description on field row; items description above the expanded list.',
      },
      {
        label: 'F. Union of objects, each variant with its own description',
        schema: { type: 'object', properties: { node: { anyOf: [{ id: 'TextNode', type: 'object', description: 'A leaf node containing inline text.', properties: { type: { const: 'text' }, text: { type: 'string' } }, required: ['type', 'text'] } as any, { id: 'ImageNode', type: 'object', description: 'A leaf node containing an image source URL.', properties: { type: { const: 'image' }, src: { type: 'string', format: 'uri' } }, required: ['type', 'src'] } as any] } } } as any,
        note: 'Per-variant descriptions render in JsonSchemaVariantList rows.',
      },
      {
        label: 'G. Variant with id and a different title',
        schema: { type: 'object', properties: { kind: { id: 'Kind', title: 'A human-readable kind label', description: 'Distinguishes between supported kinds.', anyOf: [{ id: 'Alpha', title: 'Alpha (priority A)', description: 'Highest priority routing.', type: 'object', properties: { tag: { const: 'alpha' } }, required: ['tag'] } as any, { id: 'Beta', title: 'Beta (priority B)', description: 'Standard routing.', type: 'object', properties: { tag: { const: 'beta' } }, required: ['tag'] } as any] } } } as any,
        note: 'Each variant row prefixes the description with bolded title (when title differs from id).',
        needsInvestigation: true,
      },
    ],
  },
  {
    id: 'opaque',
    title: 'Opaque & real-world shapes',
    entries: [
      { label: 'Opaque component (id + title, no type)', schema: { id: 'Component', title: 'Component' } as any },
      { label: 'LinkQueryValue (anonymous string | number | null)', schema: { anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] } },
      { label: 'CustomFields open record', schema: { id: 'CustomFields', title: 'CustomFields', type: 'object', additionalProperties: {} } as any },
      { label: 'Annotations chips on a string field', schema: { type: 'string', readOnly: true, default: 'hello', minLength: 1, maxLength: 32 } },
      { label: 'write-only & deprecated together', schema: { type: 'string', writeOnly: true, deprecated: true } },
    ],
  },
  {
    id: 'gaps',
    title: 'Known gaps (visualized)',
    entries: [
      { label: 'schema boolean `true` as property', schema: { type: 'object', properties: { anything: true as any } } as any, note: '.todo line 570: spec says `true` means "any value". Currently passes through unchanged.', needsInvestigation: true },
      { label: 'Draft-4 exclusiveMinimum: true (boolean form)', schema: { type: 'number', minimum: 0, exclusiveMinimum: true as any }, note: '.todo line 578: currently emits chip with value `"true"` instead of falling back to `minimum`.', needsInvestigation: true },
      { label: 'if/then/else conditional', schema: { type: 'object', properties: { kind: { type: 'string' } }, if: { properties: { kind: { const: 'a' } } }, then: { required: ['extraA'] }, else: { required: ['extraB'] } } as any, note: '.todo line 573: conditional schemas are ignored.', needsInvestigation: true },
      { label: 'not', schema: { not: { type: 'string' } } as any, note: '.todo line 574: `not` is ignored.', needsInvestigation: true },
    ],
  },
];

const investigationCount = computed(() => sections.reduce((n, s) => n + s.entries.filter((e) => e.needsInvestigation).length, 0));
</script>

<template>
  <div class="min-h-screen bg-white p-8 dark:bg-neutral-950 dark:text-neutral-100">
    <div class="mx-auto max-w-5xl">
      <header class="mb-8 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <h1 class="text-3xl font-semibold">JSON Schema rendering gallery</h1>
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Comprehensive fixture page for visually reviewing the
          <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">JsonSchemaFields</code> renderer. Not part of the docs nav. Edit
          <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">app/pages/dev/schema-gallery.vue</code> to add cases.
        </p>
        <div class="mt-4 flex items-center gap-3 text-sm">
          <span class="font-medium">Mode:</span>
          <button
            v-for="m in (['javascript', 'json'] as const)"
            :key="m"
            class="rounded border px-3 py-1 font-mono"
            :class="
              mode === m ?
                'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300'
              : 'border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900'
            "
            @click="mode = m"
          >
            {{ m }}
          </button>
        </div>
        <p v-if="investigationCount > 0" class="mt-3 inline-flex items-center gap-2 rounded-sm bg-amber-100 px-2 py-1 text-xs text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
          <span class="font-mono font-semibold">{{ investigationCount }}</span>
          entries flagged as <code class="font-mono">needs investigation</code> — see amber-bordered cards below.
        </p>
        <nav class="mt-4 flex flex-wrap gap-2 text-xs">
          <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="rounded bg-neutral-100 px-2 py-1 font-mono hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
            {{ s.title }}
          </a>
        </nav>
      </header>

      <section v-for="s in sections" :id="s.id" :key="s.id" class="mb-12">
        <h2 class="mb-4 border-b border-neutral-200 pb-1 text-2xl font-semibold dark:border-neutral-800">{{ s.title }}</h2>
        <div class="space-y-6">
          <article
            v-for="(e, i) in s.entries"
            :key="i"
            class="rounded-md border p-4"
            :class="
              e.needsInvestigation ?
                'border-amber-400 bg-amber-50/40 dark:border-amber-500/60 dark:bg-amber-950/20'
              : 'border-neutral-200 dark:border-neutral-800'
            "
          >
            <div class="mb-1 flex items-baseline gap-2">
              <h3 class="text-base font-semibold">{{ e.label }}</h3>
              <span
                v-if="e.needsInvestigation"
                class="rounded-sm bg-amber-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-amber-900 uppercase dark:bg-amber-500/30 dark:text-amber-200"
              >
                needs investigation
              </span>
            </div>
            <p v-if="e.note" class="mb-3 text-sm text-neutral-600 italic dark:text-neutral-400">{{ e.note }}</p>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <pre class="overflow-x-auto rounded bg-neutral-50 p-3 font-mono text-xs leading-snug dark:bg-neutral-900">{{ JSON.stringify(e.schema, null, 2) }}</pre>
              <div class="rounded border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
                <JsonSchemaFields :schema="e.schema" :mode="mode" />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
