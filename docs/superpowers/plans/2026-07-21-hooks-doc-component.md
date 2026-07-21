# Hooks Documentation Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six hand-maintained hook tables on the Frontend Hooks page with two structured MDC components (`::hook-meta`, `::hook-lifecycle`) driven by inline YAML, made LLM-readable by a general-purpose renderer that also fixes a live `::cockpit-mcp-workflow` bug.

**Architecture:** Two Vue content components render inline-YAML hook metadata as cards, reusing the repo's `MetaCard`/`MetaCardSection`. A single component-agnostic llms renderer (`renderInlineDataComponent`) YAML-dumps the props of allowlisted inline-data components into `llms-full.txt`, wired through the existing `transform-mdc` allowlist. No source reflection, no central data module.

**Tech Stack:** Nuxt 4, Nuxt Content (MDC), Vue 3 `<script setup>`, Vitest 3 (node env), `confbox` (`stringifyYAML`), minimark AST.

## Global Constraints

- **Work directly on `main`. Never create a branch or worktree.** (User standing rule.)
- **Commits:** Conventional Commits (`feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`), matching the repo's existing history.
- **Test command:** `pnpm vitest run <path>` for a single file; `pnpm test` for all. Vitest env is `node`.
- **LLM-readable rule:** any MDC component carrying structured data must be allowlisted in `transform-mdc.ts`'s `KNOWN_COMPONENTS` and produce readable output — never left to the unknown-component pass-through (which garbles nested props to `[object Object]`).
- **Guardrail:** the generic renderer applies ONLY to explicitly allowlisted pure-inline-data components (`hook-meta`, `hook-lifecycle`, `cockpit-mcp-workflow`). Never make it a blanket fallback for all unknown components — ~350 slot-based prose components (`::features`, `::note`, `::card-group`, …) depend on the pass-through preserving their slotted markdown.
- **Kind taxonomy (verified against source):** `lifecycle` (has `phase`), `filter` (`result.value` pre-seeded, runs after default), `override` (`result.value` empty, runs before default), `modify` (sync, mutate payload directly).

**Spec:** `docs/superpowers/specs/2026-07-21-hooks-doc-component-design.md`

---

## File Structure

- `app/components/MetaCard.vue` — **modify**: make `importLine` optional (hooks have no import).
- `server/utils/llms/render-inline-data.ts` — **create**: general-purpose `renderInlineDataComponent`.
- `server/utils/llms/render-inline-data.test.ts` — **create**: unit tests for the renderer.
- `vitest.config.ts` — **modify**: also include `server/**/*.test.ts`.
- `server/utils/llms/transform-mdc.ts` — **modify**: allowlist + resolve the three inline-data components.
- `app/components/HookMeta.vue` — **create**: the atom (`::hook-meta`).
- `app/components/HookMeta.test.ts` — **create**: SFC compile/contract test.
- `app/components/HookLifecycle.vue` — **create**: the group (`::hook-lifecycle`).
- `app/components/HookLifecycle.test.ts` — **create**: SFC compile/contract test.
- `content/1.frontend/2.features/hooks.md` — **modify**: rewrite tables as components.

---

## Task 1: Make `MetaCard.importLine` optional

`HookMeta` reuses `MetaCard`, but hooks are registered via `nuxtApp.hook(name, …)` and have no import line. Make the import snippet optional so `MetaCard` renders cleanly without it. The 4 existing consumers (ActionMeta, QueryMeta, EntityComponentMeta, PageTypeMeta) all pass `importLine`, so this is additive and backward-compatible.

**Files:**
- Modify: `app/components/MetaCard.vue`
- Test: `app/components/MetaCard.test.ts` (create)

**Interfaces:**
- Produces: `MetaCard` component with props `{ title: string; token: string; importLine?: string }`, slots `after-header`, `description`, `sections`. The import snippet button renders only when `importLine` is a non-empty string.

- [ ] **Step 1: Write the failing test**

Create `app/components/MetaCard.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(new URL('./MetaCard.vue', import.meta.url));

function compileComponent() {
  expect(existsSync(filename), 'MetaCard.vue should exist').toBe(true);
  const source = readFileSync(filename, 'utf8');
  const parsed = parse(source, { filename });
  expect(parsed.errors).toEqual([]);
  const script = compileScript(parsed.descriptor, { id: 'meta-card' });
  const template = compileTemplate({
    id: 'meta-card',
    filename,
    source: parsed.descriptor.template?.content ?? '',
    compilerOptions: { bindingMetadata: script.bindings },
  });
  return { source, script, template };
}

describe('MetaCard', () => {
  it('compiles as a Vue SFC', () => {
    const { template } = compileComponent();
    expect(template.errors).toEqual([]);
  });

  it('treats importLine as optional', () => {
    const { script } = compileComponent();
    expect(script.content).toContain('importLine: { type: String, required: false }');
  });

  it('guards the import snippet behind importLine', () => {
    const { source } = compileComponent();
    expect(source).toMatch(/v-if="importLine"[\s\S]*meta-card__snippet/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/components/MetaCard.test.ts`
Expected: FAIL — `importLine: { type: String, required: false }` not found (currently `required: true`), and the `v-if` guard is absent.

- [ ] **Step 3: Make `importLine` optional in the component**

In `app/components/MetaCard.vue`, change the props definition:

```ts
defineProps<{
  title: string;
  token: string;
  importLine?: string;
}>();
```

Then wrap the import-snippet button with a `v-if`. Replace the existing `<button class="meta-card__snippet" …>…</button>` block with:

```vue
<!-- Import snippet -->
<button v-if="importLine" class="meta-card__snippet" type="button" @click="copyImport(importLine)">
  <code class="meta-card__snippet-code">{{ importLine }}</code>
  <UIcon
    :name="copied ? 'lucide:check' : 'lucide:copy'"
    class="meta-card__snippet-icon"
    :class="{ 'meta-card__snippet-icon--done': copied }"
  />
</button>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/components/MetaCard.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full suite to confirm no regressions**

Run: `pnpm test`
Expected: PASS — existing tests unaffected.

- [ ] **Step 6: Commit**

```bash
git add app/components/MetaCard.vue app/components/MetaCard.test.ts
git commit -m "refactor(meta): make MetaCard importLine optional"
```

---

## Task 2: General-purpose llms renderer + wiring (fixes `::cockpit-mcp-workflow`)

Create one component-agnostic renderer that YAML-dumps an inline-data component's props into `llms-full.txt`, and wire it into the `transform-mdc` allowlist for `hook-meta`, `hook-lifecycle`, and `cockpit-mcp-workflow`. This immediately fixes the live bug where `::cockpit-mcp-workflow`'s nested `steps` garble to `[object Object]`.

**Files:**
- Create: `server/utils/llms/render-inline-data.ts`
- Create: `server/utils/llms/render-inline-data.test.ts`
- Modify: `vitest.config.ts`
- Modify: `server/utils/llms/transform-mdc.ts`

**Interfaces:**
- Produces: `renderInlineDataComponent(props: Record<string, unknown>, children?: MinimarkNode[], opts?: { titleKey?: string }): MinimarkNode[]`. Emits an optional `['h3', { id }, title]` (when `opts.titleKey` names a string prop), then `['pre', { language: 'yaml', code }, ['code', {}, code]]` (the full props as YAML), then the slotted `children` verbatim.
- Consumes: `stringifyYAML` from `confbox`.

- [ ] **Step 1: Extend the vitest include to cover server tests**

In `vitest.config.ts`, change the `include` array:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['app/**/*.test.ts', 'server/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 2: Write the failing test**

Create `server/utils/llms/render-inline-data.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { renderInlineDataComponent } from './render-inline-data';

describe('renderInlineDataComponent', () => {
  it('emits a heading from titleKey and a yaml block with nested props intact', () => {
    const nodes = renderInlineDataComponent(
      {
        name: 'orchestr:action:fetch:before',
        kind: 'lifecycle',
        payload: [{ field: 'token', type: 'string' }],
      },
      [],
      { titleKey: 'name' },
    );

    expect(nodes[0]).toEqual(['h3', { id: 'orchestr-action-fetch-before' }, 'orchestr:action:fetch:before']);

    const pre = nodes[1] as [string, Record<string, unknown>, unknown];
    expect(pre[0]).toBe('pre');
    expect(pre[1].language).toBe('yaml');
    expect(String(pre[1].code)).toContain('field: token'); // nested array survives
    expect(String(pre[1].code)).toContain('kind: lifecycle');
    expect(String(pre[1].code)).not.toContain('[object Object]');
  });

  it('omits the heading without a titleKey and dumps cockpit-mcp-workflow steps', () => {
    const nodes = renderInlineDataComponent({
      prompt: 'Update the hero',
      steps: [{ phase: 'Discover', title: 'Homepage found', tools: ['project_list'] }],
      review: 'Check both languages',
    });

    const pre = nodes[0] as [string, Record<string, unknown>, unknown];
    expect(pre[0]).toBe('pre');
    expect(String(pre[1].code)).toContain('phase: Discover');
    expect(String(pre[1].code)).toContain('project_list');
    expect(String(pre[1].code)).not.toContain('[object Object]');
  });

  it('preserves slotted children after the yaml block', () => {
    const codeFence = ['pre', { language: 'ts', code: 'x' }, ['code', {}, 'x']];
    const nodes = renderInlineDataComponent({ name: 'h' }, [codeFence as never], { titleKey: 'name' });
    expect(nodes[nodes.length - 1]).toBe(codeFence);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run server/utils/llms/render-inline-data.test.ts`
Expected: FAIL — `Cannot find module './render-inline-data'`.

- [ ] **Step 4: Write the renderer**

Create `server/utils/llms/render-inline-data.ts`:

```ts
import { stringifyYAML } from 'confbox';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface RenderInlineDataOptions {
  /** Name of a string prop to lift into an `h3` heading (e.g. `name`, `family`). */
  titleKey?: string;
}

/**
 * Render an allowlisted, pure-inline-data MDC component for `llms-full.txt`.
 *
 * Components whose data lives entirely in nested props (arrays/objects) are
 * garbled to `[object Object]` by the default minimark stringifier. This helper
 * dumps the props verbatim as a fenced YAML block so the structured data stays
 * readable, optionally prefixed with a heading, followed by any slotted children.
 */
export function renderInlineDataComponent(
  props: Record<string, unknown>,
  children: MinimarkNode[] = [],
  opts: RenderInlineDataOptions = {},
): MinimarkNode[] {
  const nodes: MinimarkNode[] = [];

  const title = opts.titleKey ? props[opts.titleKey] : undefined;
  if (typeof title === 'string' && title) {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    nodes.push(['h3', { id }, title]);
  }

  const code = stringifyYAML(props).trimEnd();
  nodes.push(['pre', { language: 'yaml', code }, ['code', {}, code]]);

  for (const child of children) nodes.push(child);

  return nodes;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run server/utils/llms/render-inline-data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Wire the components into `transform-mdc.ts`**

In `server/utils/llms/transform-mdc.ts`:

Add the import near the other render imports at the top:

```ts
import { renderInlineDataComponent } from './render-inline-data';
```

Add the three tags to `KNOWN_COMPONENTS` (append inside the existing `new Set([...])`):

```ts
const KNOWN_COMPONENTS = new Set(['action-meta', 'query-meta', 'entity-component-meta', 'entity-overview', 'component-meta', 'component-playground', 'page-type-meta', 'error-meta', 'excalidraw-diagram', 'component-code', 'since-version', 'screenshot', 'hook-meta', 'hook-lifecycle', 'cockpit-mcp-workflow']);
```

Add three cases to the `resolveComponent` switch, immediately before the `default:` case:

```ts
    case 'hook-meta':
      return renderInlineDataComponent(props, children, { titleKey: 'name' });
    case 'hook-lifecycle':
      return renderInlineDataComponent(props, children, { titleKey: 'family' });
    case 'cockpit-mcp-workflow':
      return renderInlineDataComponent(props, children);
```

- [ ] **Step 7: Manually verify the live bugfix**

Run the dev server: `pnpm dev`
In another terminal: `curl -s http://localhost:3000/raw/cockpit/features/mcp | grep -A2 'phase: Discover'`
Expected: the YAML block appears with real step content (e.g. `phase: Discover`, `project_list`) — NOT `[object Object]`. Stop the dev server.

> If the raw path differs, derive it from the content path: `content/8.Cockpit/1.Features/mcp.md` → `/cockpit/features/mcp` (drop numeric prefixes, lowercase). The `/raw/` prefix is served by `server/routes/raw/[...slug].ts`.

- [ ] **Step 8: Commit**

```bash
git add server/utils/llms/render-inline-data.ts server/utils/llms/render-inline-data.test.ts server/utils/llms/transform-mdc.ts vitest.config.ts
git commit -m "feat(llms): render inline-data components as YAML, fix cockpit-mcp-workflow"
```

---

## Task 3: `HookMeta.vue` — the atom (`::hook-meta`)

The single-hook card: header (title + token badge + pills), payload table, optional `result.value` callout, "when it fires", optional related/fired-by chips, and an optional example via the default slot.

**Files:**
- Create: `app/components/HookMeta.vue`
- Test: `app/components/HookMeta.test.ts`

**Interfaces:**
- Consumes: `MetaCard` (Task 1, `importLine` optional), `MetaCardSection`.
- Produces: `::hook-meta` accepting inline-YAML props `name`, `title`, `surface` (`client|server`), `register` (`nuxt-plugin|nitro-plugin`), `kind` (`lifecycle|filter|override|modify`), `phase?`, `payload?: {field,type,description?,optional?}[]`, `result?: {seed:'pre-seeded'|'empty',type,description?}`, `whenItFires`, `firedBy?: string[]`, `related?: {label,to}[]`; default slot = example code fence.

- [ ] **Step 1: Write the failing test**

Create `app/components/HookMeta.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(new URL('./HookMeta.vue', import.meta.url));

function compileComponent() {
  expect(existsSync(filename), 'HookMeta.vue should exist').toBe(true);
  const source = readFileSync(filename, 'utf8');
  const parsed = parse(source, { filename });
  expect(parsed.errors).toEqual([]);
  const script = compileScript(parsed.descriptor, { id: 'hook-meta' });
  const template = compileTemplate({
    id: 'hook-meta',
    filename,
    source: parsed.descriptor.template?.content ?? '',
    compilerOptions: { bindingMetadata: script.bindings },
  });
  return { source, script, template };
}

describe('HookMeta', () => {
  it('compiles as a Vue SFC', () => {
    const { template } = compileComponent();
    expect(template.errors).toEqual([]);
  });

  it('exposes the hook metadata contract', () => {
    const { script } = compileComponent();
    expect(script.content).toContain('name: { type: String, required: true }');
    expect(script.content).toContain('kind: { type: String, required: true }');
    expect(script.content).toContain('payload: { type: Array, required: false }');
    expect(script.content).toContain('whenItFires: { type: String, required: true }');
  });

  it('renders through MetaCard with pills and a payload table', () => {
    const { source } = compileComponent();
    expect(source).toContain('<MetaCard');
    expect(source).toContain('hook-pill');
    expect(source).toContain('hook-args');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/components/HookMeta.test.ts`
Expected: FAIL — `HookMeta.vue should exist`.

- [ ] **Step 3: Write the component**

Create `app/components/HookMeta.vue`:

```vue
<script lang="ts" setup>
interface PayloadField {
  field: string;
  type: string;
  description?: string;
  optional?: boolean;
}
interface HookResultInfo {
  seed: 'pre-seeded' | 'empty';
  type: string;
  description?: string;
}
interface RelatedLink {
  label: string;
  to: string;
}

const props = defineProps<{
  name: string;
  title: string;
  surface: 'client' | 'server';
  register: 'nuxt-plugin' | 'nitro-plugin';
  kind: 'lifecycle' | 'filter' | 'override' | 'modify';
  phase?: 'before' | 'success' | 'error' | 'finally';
  payload?: PayloadField[];
  result?: HookResultInfo;
  whenItFires: string;
  firedBy?: string[];
  related?: RelatedLink[];
}>();

const surfaceLabel = computed(() => (props.surface === 'server' ? 'Server' : 'Client'));
const registerLabel = computed(() => (props.register === 'nitro-plugin' ? 'Nitro plugin' : 'Nuxt plugin'));
const kindLabel = computed(() => {
  const labels = { lifecycle: 'Lifecycle', filter: 'Filter', override: 'Override', modify: 'Modify' } as const;
  const base = labels[props.kind];
  return props.kind === 'lifecycle' && props.phase ? `${base} · ${props.phase}` : base;
});
</script>

<template>
  <MetaCard :title="title" :token="name">
    <template #after-header>
      <div class="hook-pills">
        <span class="hook-pill" :class="`hook-pill--${surface}`">{{ surfaceLabel }}</span>
        <span class="hook-pill hook-pill--plain">{{ registerLabel }}</span>
        <span class="hook-pill" :class="`hook-pill--${kind}`">{{ kindLabel }}</span>
      </div>
    </template>

    <template #sections>
      <MetaCardSection v-if="payload?.length" label="Payload">
        <table class="hook-args">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in payload" :key="f.field">
              <td class="hook-args__k">{{ f.field }}<span v-if="f.optional" class="hook-args__opt">?</span></td>
              <td class="hook-args__t">{{ f.type }}</td>
              <td class="hook-args__d">{{ f.description }}</td>
            </tr>
          </tbody>
        </table>
      </MetaCardSection>

      <MetaCardSection v-if="result" label="result.value">
        <div class="hook-result">
          <div class="hook-result__top">
            <span
              class="hook-result__seed"
              :class="result.seed === 'pre-seeded' ? 'hook-result__seed--pre' : 'hook-result__seed--empty'"
            >
              {{ result.seed === 'pre-seeded' ? 'Pre-seeded' : 'Starts empty' }}
            </span>
            <code class="hook-result__type">{{ result.type }}</code>
          </div>
          <p v-if="result.description" class="hook-result__desc">{{ result.description }}</p>
        </div>
      </MetaCardSection>

      <MetaCardSection label="When it fires">
        <p class="hook-fires">{{ whenItFires }}</p>
      </MetaCardSection>

      <MetaCardSection v-if="firedBy?.length" label="Fired by">
        <div class="hook-chips">
          <code v-for="f in firedBy" :key="f" class="hook-chip">{{ f }}</code>
        </div>
      </MetaCardSection>

      <MetaCardSection v-if="related?.length" label="Related">
        <div class="hook-chips">
          <NuxtLink v-for="r in related" :key="r.to" :to="r.to" class="hook-chip hook-chip--link">{{ r.label }}</NuxtLink>
        </div>
      </MetaCardSection>

      <MetaCardSection v-if="$slots.default" label="Example">
        <slot />
      </MetaCardSection>
    </template>
  </MetaCard>
</template>

<style scoped>
.hook-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.hook-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.hook-pill--client {
  color: var(--color-cyan-700);
  background: var(--color-cyan-100);
}
.hook-pill--server {
  color: var(--color-amber-700);
  background: var(--color-amber-100);
}
.hook-pill--filter {
  color: var(--color-indigo-700);
  background: var(--color-indigo-100);
}
.hook-pill--override {
  color: var(--color-violet-700);
  background: var(--color-violet-100);
}
.hook-pill--modify {
  color: var(--color-teal-700);
  background: var(--color-teal-100);
}
.hook-pill--lifecycle {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}
.hook-pill--plain {
  color: var(--color-gray-500);
  background: transparent;
  border-color: var(--color-gray-300);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 500;
}

:root.dark .hook-pill--client {
  color: var(--color-cyan-300);
  background: color-mix(in oklch, var(--color-cyan-500) 18%, transparent);
}
:root.dark .hook-pill--server {
  color: var(--color-amber-300);
  background: color-mix(in oklch, var(--color-amber-500) 18%, transparent);
}
:root.dark .hook-pill--filter {
  color: var(--color-indigo-300);
  background: color-mix(in oklch, var(--color-indigo-500) 18%, transparent);
}
:root.dark .hook-pill--override {
  color: var(--color-violet-300);
  background: color-mix(in oklch, var(--color-violet-500) 18%, transparent);
}
:root.dark .hook-pill--modify {
  color: var(--color-teal-300);
  background: color-mix(in oklch, var(--color-teal-500) 18%, transparent);
}
:root.dark .hook-pill--lifecycle {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}
:root.dark .hook-pill--plain {
  color: var(--color-gray-400);
  border-color: var(--color-gray-700);
}

/* payload table */
.hook-args {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.hook-args th {
  text-align: left;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-gray-400);
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}
.hook-args td {
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: top;
}
.hook-args__k {
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-gray-800);
  white-space: nowrap;
}
.hook-args__opt {
  color: var(--color-gray-400);
}
.hook-args__t {
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-primary-600, var(--color-indigo-600));
  white-space: nowrap;
}
.hook-args__d {
  color: var(--color-gray-600);
}

:root.dark .hook-args th {
  border-bottom-color: var(--color-gray-800);
  color: var(--color-gray-500);
}
:root.dark .hook-args td {
  border-bottom-color: var(--color-gray-800);
}
:root.dark .hook-args__k {
  color: var(--color-gray-200);
}
:root.dark .hook-args__d {
  color: var(--color-gray-400);
}

/* result callout */
.hook-result {
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
}
.hook-result__top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-gray-50);
}
.hook-result__seed {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.4375rem;
  border-radius: 0.3125rem;
}
.hook-result__seed--pre {
  color: var(--color-indigo-700);
  background: var(--color-indigo-100);
}
.hook-result__seed--empty {
  color: var(--color-violet-700);
  background: var(--color-violet-100);
}
.hook-result__type {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-600);
}
.hook-result__desc {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}

:root.dark .hook-result {
  border-color: var(--color-gray-800);
}
:root.dark .hook-result__top {
  background: var(--color-gray-900);
}
:root.dark .hook-result__desc {
  color: var(--color-gray-400);
}

.hook-fires {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}
:root.dark .hook-fires {
  color: var(--color-gray-400);
}

.hook-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.hook-chip {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  padding: 0.1875rem 0.5rem;
  border-radius: 0.375rem;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  text-decoration: none;
}
.hook-chip--link {
  color: var(--color-primary-600, var(--color-indigo-600));
}
:root.dark .hook-chip {
  color: var(--color-gray-300);
  background: var(--color-gray-800);
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/components/HookMeta.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/HookMeta.vue app/components/HookMeta.test.ts
git commit -m "feat(hooks): add HookMeta content component"
```

---

## Task 4: `HookLifecycle.vue` — the group (`::hook-lifecycle`)

Renders an ordered before/success/error/finally family as a color-coded rail. No diagram yet (phase 2).

**Files:**
- Create: `app/components/HookLifecycle.vue`
- Test: `app/components/HookLifecycle.test.ts`

**Interfaces:**
- Produces: `::hook-lifecycle` accepting inline-YAML props `family`, `description?`, `surface` (`client|server`), `register` (`nuxt-plugin|nitro-plugin`), `firedBy?: string[]`, `phases: {phase:'before'|'success'|'error'|'finally',name,when,payload?}[]`, `diagram?` (reserved for phase 2).

- [ ] **Step 1: Write the failing test**

Create `app/components/HookLifecycle.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(new URL('./HookLifecycle.vue', import.meta.url));

function compileComponent() {
  expect(existsSync(filename), 'HookLifecycle.vue should exist').toBe(true);
  const source = readFileSync(filename, 'utf8');
  const parsed = parse(source, { filename });
  expect(parsed.errors).toEqual([]);
  const script = compileScript(parsed.descriptor, { id: 'hook-lifecycle' });
  const template = compileTemplate({
    id: 'hook-lifecycle',
    filename,
    source: parsed.descriptor.template?.content ?? '',
    compilerOptions: { bindingMetadata: script.bindings },
  });
  return { source, script, template };
}

describe('HookLifecycle', () => {
  it('compiles as a Vue SFC', () => {
    const { template } = compileComponent();
    expect(template.errors).toEqual([]);
  });

  it('exposes the lifecycle contract', () => {
    const { script } = compileComponent();
    expect(script.content).toContain('family: { type: String, required: true }');
    expect(script.content).toContain('phases: { type: Array, required: true }');
  });

  it('renders a phase rail keyed by phase', () => {
    const { source } = compileComponent();
    expect(source).toContain('hook-phase');
    expect(source).toContain('v-for');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/components/HookLifecycle.test.ts`
Expected: FAIL — `HookLifecycle.vue should exist`.

- [ ] **Step 3: Write the component**

Create `app/components/HookLifecycle.vue`:

```vue
<script lang="ts" setup>
interface LifecyclePhase {
  phase: 'before' | 'success' | 'error' | 'finally';
  name: string;
  when: string;
  payload?: string;
}

defineProps<{
  family: string;
  description?: string;
  surface: 'client' | 'server';
  register: 'nuxt-plugin' | 'nitro-plugin';
  firedBy?: string[];
  phases: LifecyclePhase[];
  diagram?: string;
}>();
</script>

<template>
  <section class="hook-lc">
    <header class="hook-lc__head">
      <h3 :id="family.toLowerCase().replace(/[^a-z0-9]+/g, '-')" class="hook-lc__title">{{ family }}</h3>
      <p v-if="description" class="hook-lc__desc">{{ description }}</p>
      <div v-if="firedBy?.length" class="hook-lc__firedby">
        <span class="hook-lc__firedby-label">Fired by</span>
        <code v-for="f in firedBy" :key="f">{{ f }}</code>
      </div>
    </header>

    <ol class="hook-lc__rail">
      <li v-for="p in phases" :key="p.name" class="hook-phase" :class="`hook-phase--${p.phase}`">
        <span class="hook-phase__dot" aria-hidden="true" />
        <div class="hook-phase__body">
          <div class="hook-phase__name">
            <strong>{{ p.phase }}</strong>
            <code>{{ p.name }}</code>
          </div>
          <p class="hook-phase__when">{{ p.when }}</p>
          <div v-if="p.payload" class="hook-phase__payload">{{ p.payload }}</div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.hook-lc {
  margin-block: 1.5rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  overflow: hidden;
}
:root.dark .hook-lc {
  border-color: var(--color-gray-800);
}

.hook-lc__head {
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid var(--color-gray-200);
}
:root.dark .hook-lc__head {
  border-bottom-color: var(--color-gray-800);
}
.hook-lc__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hook-lc__desc {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}
:root.dark .hook-lc__desc {
  color: var(--color-gray-400);
}
.hook-lc__firedby {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
}
.hook-lc__firedby-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
}
.hook-lc__firedby code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  padding: 0.125rem 0.4375rem;
  border-radius: 0.375rem;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
}
:root.dark .hook-lc__firedby code {
  color: var(--color-gray-300);
  background: var(--color-gray-800);
}

.hook-lc__rail {
  list-style: none;
  margin: 0;
  padding: 0.5rem 1.5rem 0.75rem;
}
.hook-phase {
  position: relative;
  display: flex;
  gap: 0.875rem;
  padding: 0.75rem 0;
}
.hook-phase:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 0.3125rem;
  top: 1.75rem;
  bottom: -0.75rem;
  width: 2px;
  background: var(--color-gray-200);
}
:root.dark .hook-phase:not(:last-child)::before {
  background: var(--color-gray-800);
}
.hook-phase__dot {
  width: 0.75rem;
  height: 0.75rem;
  flex: none;
  margin-top: 0.25rem;
  border-radius: 9999px;
}
.hook-phase--before .hook-phase__dot {
  background: var(--color-gray-400);
}
.hook-phase--success .hook-phase__dot {
  background: var(--color-green-500);
}
.hook-phase--error .hook-phase__dot {
  background: var(--color-red-500);
}
.hook-phase--finally .hook-phase__dot {
  background: var(--color-primary-500, var(--color-indigo-500));
}
.hook-phase__body {
  min-width: 0;
}
.hook-phase__name {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.hook-phase__name strong {
  font-size: 0.875rem;
}
.hook-phase__name code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  padding: 0.0625rem 0.4375rem;
  border-radius: 0.3125rem;
}
:root.dark .hook-phase__name code {
  color: var(--color-gray-400);
  background: var(--color-gray-800);
}
.hook-phase__when {
  margin: 0.1875rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}
:root.dark .hook-phase__when {
  color: var(--color-gray-400);
}
.hook-phase__payload {
  margin-top: 0.375rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  color: var(--color-gray-400);
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/components/HookLifecycle.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/HookLifecycle.vue app/components/HookLifecycle.test.ts
git commit -m "feat(hooks): add HookLifecycle content component"
```

---

## Task 5: Rewrite `hooks.md` to use the components

Replace the six tables with `::hook-lifecycle` groups (fetch, mutation, handler) and `::hook-meta` atoms (the nine non-lifecycle hooks). Preserve all intro prose, the filter-vs-override explanation, the `client-env` synchrony `::note`, the mutation `context` note, and the existing combined code examples (kept as normal ```ts fences after their groups).

**Files:**
- Modify: `content/1.frontend/2.features/hooks.md`

- [ ] **Step 1: Replace the whole file with the new content**

Overwrite `content/1.frontend/2.features/hooks.md` with:

````md
---
title: Hooks
description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
links: []
seo:
  title: Hooks | Laioutr
  description: Extend frontend-core and orchestr behavior using Nuxt runtime hooks
---

Frontend-core and orchestr expose [Nuxt runtime hooks](https://nuxt.com/docs/guide/going-further/hooks#app-hooks-runtime) that let you extend or modify the complete behaviour of your Laioutr Frontend. Register hooks inside a [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins) for client-side hooks, or a [Nitro plugin](https://nitro.build/guide/plugins#nitro-hooks) for server-side hooks.

## Frontend Core Hooks

These hooks run on the client. Register them in a Nuxt plugin with [`nuxtApp.hook()`](https://nuxt.com/docs/3.x/api/composables/use-nuxt-app#hookname-cb).

### Link Resolver

Three hooks let you customize how `linkResolver` resolves links, switches locale paths, and switches market URLs. They come in two shapes.

The `resolve` hook is a **filter**. It runs *after* a link is resolved, with `result.value` pre-seeded with the resolved URL or path. Your handler can transform that value, replace it outright, or leave it untouched to keep the default. When several plugins register this hook, each receives the previous one's output.

The two `switch-*` hooks are **overrides**. They run *before* the default logic, with `result.value` starting empty. Set it to take over locale or market switching, including cases the default cannot resolve. Leave it unset to fall back to the default.

::hook-meta
---
name: frontend-core:link-resolver:resolve
title: link-resolver · resolve
surface: client
register: nuxt-plugin
kind: filter
payload:
  - { field: link, type: Link, description: The link being resolved. }
  - { field: result, type: '{ value: string }', description: Mutate to transform the output — see result.value. }
result: { seed: pre-seeded, type: string, description: Starts with the resolved URL or path. Transform it, replace it, or leave it untouched. Threads across plugins — each handler receives the previous one's output. }
whenItFires: After every call to linkResolver.resolve(), once the default resolution has produced a value.
---
```ts [app/plugins/custom-link-resolver.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // Replace: resolve product references to an external catalog URL
  nuxtApp.hook('frontend-core:link-resolver:resolve', ({ link, result }) => {
    if (link.type === 'reference' && link.reference.type === 'Product') {
      result.value = `https://catalog.example.com/p/${link.reference.slug}`;
    }
  });
});
```
::

::hook-meta
---
name: frontend-core:link-resolver:switch-locale-path
title: link-resolver · switch-locale-path
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: targetLanguageId, type: string, description: The language being switched to. }
  - { field: result, type: '{ value?: string }', description: Set it to take over — see result.value. }
result: { seed: empty, type: string | undefined, description: Set it to take over locale switching, including cases the default cannot resolve. Leave it unset to fall back. First handler to set a value wins. }
whenItFires: Before the default logic, when switching the current page to another language.
---
```ts [app/plugins/custom-locale-switch.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:link-resolver:switch-locale-path', ({ targetLanguageId, result }) => {
    if (targetLanguageId === 'fr-CH') {
      result.value = `/fr-ch${useRoute().path}`;
    }
  });
});
```
::

::hook-meta
---
name: frontend-core:link-resolver:switch-market-url
title: link-resolver · switch-market-url
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: targetMarketId, type: string, description: The market being switched to. }
  - { field: targetLanguageId, type: string, description: The target language, if any., optional: true }
  - { field: result, type: '{ value?: string }', description: Set it to take over — see result.value. }
result: { seed: empty, type: string | undefined, description: Set it to take over market switching (may include a host change). Leave it unset to fall back to the default. }
whenItFires: Before the default logic, when switching to a different market.
---
::

### Page Renderer

This hook lets you control which **page variant** is rendered. Pages can have multiple variants (for A/B testing, personalization, or conditional layouts). If you set `result.value` to a `RenderPageVariant`, that variant is used instead of the default.

::hook-meta
---
name: frontend-core:page-renderer:select-page-variant
title: page-renderer · select-page-variant
surface: client
register: nuxt-plugin
kind: override
payload:
  - { field: page, type: RenderPage, description: 'Contains id, type, path, and a variants array.' }
  - { field: result, type: '{ value?: RenderPageVariant }', description: Set it to pick a variant — see result.value. }
result: { seed: empty, type: RenderPageVariant | undefined, description: Set it to a variant to render it instead of the default. Leave it unset to keep the default. }
whenItFires: When the PageRenderer component selects a variant.
---
```ts [app/plugins/ab-testing.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:page-renderer:select-page-variant', ({ page, result }) => {
    const variantId = useCookie('ab-variant').value;
    const match = page.variants.find((v) => v.id === variantId);
    if (match) {
      result.value = match;
    }
  });
});
```
::

### Page Head

One **filter** hook lets you customize the tags Frontend Core writes to `<head>` on every page. It runs with `result.value` pre-seeded with Frontend Core's computed head, so your handler can read those values and add, override, or remove tags.

::hook-meta
---
name: frontend-core:page-head:resolve
title: page-head · resolve
surface: client
register: nuxt-plugin
kind: filter
payload:
  - { field: page, type: RenderPage, description: The page being rendered. }
  - { field: pageVariant, type: RenderPageVariant, description: The selected variant. }
  - { field: metaPage, type: MetaPage, description: The page's SEO meta. }
  - { field: currentDomain, type: string, description: The resolved market domain — undefined in Studio preview., optional: true }
  - { field: result, type: '{ value: { seo, locale } }', description: Mutate to change the head — see result.value. }
result: { seed: pre-seeded, type: '{ seo, locale }', description: 'seo is a flat useSeoMeta object (title, description, robots, og:/twitter:). locale is { htmlAttrs, meta, link } — html lang, og:locale, canonical, and hreflang alternates.' }
whenItFires: When the PageRenderer applies the page head via useHead, on every page.
---
```ts [app/plugins/custom-head.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('frontend-core:page-head:resolve', ({ result }) => {
    // Append a site name to the resolved title and add a default OG image
    result.value.seo.title = `${result.value.seo.title} — Acme`;
    result.value.seo.ogImage ??= 'https://example.com/og.png';

    // Remove the x-default alternate
    result.value.locale.link = result.value.locale.link.filter((l) => l.hreflang !== 'x-default');
  });
});
```
::

## Orchestr Client Hooks

These hooks fire during client-side action execution. They follow the lifecycle pattern: `before` fires before the request, `success` or `error` after resolution, and `finally` always. All receive a `token` string that identifies the action (e.g. `ecommerce/cart/add-items`).

### Fetch Action Hooks

::hook-lifecycle
---
family: Fetch action lifecycle
description: Four hooks fire around every fetchAction request. finally always runs, whether the action resolved or errored.
surface: client
register: nuxt-plugin
firedBy: [fetchAction, useFetchAction, useQueryAction, useMutationAction]
diagram: fetch
phases:
  - { phase: before, name: 'orchestr:action:fetch:before', when: Before the request is sent., payload: '{ token, input }' }
  - { phase: success, name: 'orchestr:action:fetch:success', when: After the action resolves., payload: '{ token, output }' }
  - { phase: error, name: 'orchestr:action:fetch:error', when: After the action rejects., payload: '{ token, error }' }
  - { phase: finally, name: 'orchestr:action:fetch:finally', when: Always, after success or error., payload: '{ token, output?, error?, input }' }
---
::

### Mutation Action Hooks

::hook-lifecycle
---
family: Mutation action lifecycle
description: useMutationAction fires these around the mutation. The context value comes from Pinia Colada's mutation context, set by the onMutate callback.
surface: client
register: nuxt-plugin
firedBy: [useMutationAction]
diagram: mutation
phases:
  - { phase: before, name: 'orchestr:action:mutation:before', when: Before the mutation runs., payload: '{ token, input }' }
  - { phase: success, name: 'orchestr:action:mutation:success', when: After the mutation resolves., payload: '{ token, output, input, context }' }
  - { phase: error, name: 'orchestr:action:mutation:error', when: After the mutation rejects., payload: '{ token, error, context }' }
  - { phase: finally, name: 'orchestr:action:mutation:finally', when: Always, after success or error., payload: '{ token, output?, error?, input, context }' }
---
::

The `context` value comes from [Pinia Colada's mutation context](https://pinia-colada.esm.dev/guide/mutations.html) and is set by the `onMutate` callback.

```ts [app/plugins/action-error-tracking.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // Track all failed actions (both fetch and mutation)
  nuxtApp.hook('orchestr:action:fetch:error', ({ token, error }) => {
    errorTracker.capture(error, { action: token, type: 'fetch' });
  });

  nuxtApp.hook('orchestr:action:mutation:error', ({ token, error }) => {
    errorTracker.capture(error, { action: token, type: 'mutation' });
  });
});
```

### URL Query Parameters

Two hooks control how Orchestr reads and writes URL query parameters (pagination, sorting, filters). See [URL Query Parameters](/frontend/orchestr/url-query-params#hooks) for the full reference with examples.

::hook-meta
---
name: orchestr:query-params:parsed
title: query-params · parsed
surface: client
register: nuxt-plugin
kind: modify
payload:
  - { field: params, type: QueryParams, description: The parsed query params — mutate directly. }
  - { field: queryPrefixes, type: QueryPrefixes, description: The active query prefixes. }
  - { field: route, type: RouteLocation, description: The current route. }
whenItFires: After parsing the URL, before reading pagination, sort, and filter.
related:
  - { label: URL Query Parameters, to: /frontend/orchestr/url-query-params#hooks }
---
::

::hook-meta
---
name: orchestr:navigate-query:build
title: navigate-query · build
surface: client
register: nuxt-plugin
kind: modify
payload:
  - { field: params, type: QueryParams, description: The params being written. }
  - { field: query, type: QueryObject, description: The assembled query object — mutate directly. }
  - { field: path, type: string, description: The target path. }
  - { field: queryString, type: string, description: The serialized query string. }
whenItFires: At the end of buildQueryUrl(), before returning the URL.
related:
  - { label: URL Query Parameters, to: /frontend/orchestr/url-query-params#hooks }
---
::

### Client Environment

::hook-meta
---
name: orchestr:client-env:modify
title: client-env · modify
surface: client
register: nuxt-plugin
kind: modify
payload:
  - { field: clientEnv, type: ClientEnv, description: '{ locale, currency, isPreview?, custom? } — mutate directly, do not replace.' }
whenItFires: Synchronously, every time orchestr builds the clientEnv object before sending an action request.
---
```ts [app/plugins/client-env.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('orchestr:client-env:modify', ({ clientEnv }) => {
    clientEnv.locale = useLanguage().value.locale;
    clientEnv.currency = useCurrency().value;
  });
});
```
::

::note
This hook is called synchronously (not `async`). Avoid async work inside the callback.
::

## Orchestr Server Hooks

These hooks fire during **server-side** action handler execution. They are [Nitro runtime hooks](https://nitro.build/guide/plugins#nitro-hooks) and must be registered in a Nitro plugin, not a Nuxt plugin.

::hook-lifecycle
---
family: Server handler lifecycle
description: Four hooks fire around the server-side action handler. Register them in a Nitro plugin with nitroApp.hooks.hook().
surface: server
register: nitro-plugin
diagram: handler
phases:
  - { phase: before, name: 'orchestr:action:handler:before', when: Before the handler runs., payload: '{ token, input, clientEnv }' }
  - { phase: success, name: 'orchestr:action:handler:success', when: After the handler resolves., payload: '{ token, output }' }
  - { phase: error, name: 'orchestr:action:handler:error', when: After the handler throws., payload: '{ token, error }' }
  - { phase: finally, name: 'orchestr:action:handler:finally', when: Always, after success or error., payload: '{ token, output?, error?, input }' }
---
::

```ts [server/plugins/action-logging.ts]
export default defineNitroPlugin((nitroApp) => {
  const pending = new Map<string, number>();

  nitroApp.hooks.hook('orchestr:action:handler:before', ({ token }) => {
    pending.set(token, Date.now());
  });

  nitroApp.hooks.hook('orchestr:action:handler:error', ({ token, error }) => {
    const startedAt = pending.get(token);
    const duration = startedAt ? Date.now() - startedAt : undefined;
    console.error(`[orchestr] ${token} failed after ${duration}ms`, error);
    pending.delete(token);
  });
});
```
````

- [ ] **Step 2: Verify the page renders**

Run: `pnpm dev`
Open `http://localhost:3000/frontend/features/hooks` and confirm each hook renders as a card (pills, payload table, result callout where present) and the three lifecycle families render as phase rails. No raw MDC syntax or "No metadata found" warnings.

- [ ] **Step 3: Verify the llms output**

With the dev server running:
`curl -s http://localhost:3000/raw/frontend/features/hooks | grep -A3 'client-env:modify'`
Expected: a `yaml` block containing the hook's props (`kind: modify`, the `clientEnv` payload). Confirm no `[object Object]` appears anywhere:
`curl -s http://localhost:3000/raw/frontend/features/hooks | grep -c '\[object Object\]'`
Expected: `0`. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add content/1.frontend/2.features/hooks.md
git commit -m "docs(hooks): render hooks with HookMeta and HookLifecycle components"
```

---

## Out of scope (phase 2)

The `diagram` key on `::hook-lifecycle` (`fetch` / `mutation` / `handler`) is authored now but unused. Phase 2 embeds the round-trip Mermaid sequence diagram (already prototyped) behind a disclosure inside `HookLifecycle`, keyed off `diagram`. Not part of this plan.

## Self-Review

**Spec coverage:**
- Decision 1 (both atom + group) → Tasks 3, 4. ✓
- Decision 2 (inline YAML + generic allowlisted renderer) → Task 2. ✓
- Decision 3 (components + data + renderer + page rewrite; diagram phase 2) → Tasks 1–5, phase-2 note. ✓
- MetaCard `importLine` optional → Task 1. ✓
- `cockpit-mcp-workflow` allowlisted + bugfix → Task 2. ✓
- Kind taxonomy, 20 hooks, families → Task 5 content. ✓
- Guardrail (allowlist only) → Global Constraints + Task 2 wiring (no pass-through change). ✓
- LLM-readability test guarding `[object Object]` → Task 2 Step 2, Task 5 Step 3. ✓

**Placeholder scan:** No TBD/TODO; every code/step is complete. ✓

**Type consistency:** `renderInlineDataComponent(props, children?, { titleKey })` signature is identical in the renderer (Task 2 Step 4), its test (Step 2), and the three call sites (Step 6). Component prop names in `hooks.md` YAML (Task 5) match the `defineProps` of `HookMeta` (Task 3) and `HookLifecycle` (Task 4): `name/title/surface/register/kind/phase/payload/result/whenItFires/firedBy/related` and `family/description/surface/register/firedBy/phases/diagram`. ✓
