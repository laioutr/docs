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
