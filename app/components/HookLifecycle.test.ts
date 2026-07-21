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
