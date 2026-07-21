import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(new URL('./CockpitMcpWorkflow.vue', import.meta.url));

function compileComponent() {
  expect(existsSync(filename), 'CockpitMcpWorkflow.vue should exist').toBe(true);

  const source = readFileSync(filename, 'utf8');
  const parsed = parse(source, { filename });

  expect(parsed.errors).toEqual([]);
  expect(parsed.descriptor.scriptSetup).not.toBeNull();
  expect(parsed.descriptor.template).not.toBeNull();

  const script = compileScript(parsed.descriptor, { id: 'cockpit-mcp-workflow' });
  const template = compileTemplate({
    id: 'cockpit-mcp-workflow',
    filename,
    source: parsed.descriptor.template?.content ?? '',
    compilerOptions: { bindingMetadata: script.bindings },
  });

  return { source, script, template };
}

describe('CockpitMcpWorkflow', () => {
  it('compiles as a Vue SFC', () => {
    const { template } = compileComponent();

    expect(template.errors).toEqual([]);
  });

  it('exposes the data-driven workflow contract', () => {
    const { script } = compileComponent();

    expect(script.content).toContain('prompt: { type: String, required: true }');
    expect(script.content).toContain('steps: { type: Array, required: true }');
    expect(script.content).toContain(
      `handoff: { type: String, required: false, default: "The edit enters Cockpit's shared Studio document." }`
    );
    expect(script.content).toContain('review: { type: String, required: true }');
  });

  it('uses semantic, state-free activity markup', () => {
    const { source } = compileComponent();

    expect(source).toContain('<figure');
    expect(source).toContain('<figcaption');
    expect(source).toContain('<ol');
    expect(source).toContain('<li');
    expect(source).not.toContain('@click');
    expect(source).not.toMatch(/\bref\s*\(/);
  });
});
