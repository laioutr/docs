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
