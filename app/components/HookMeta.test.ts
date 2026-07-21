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
    expect(script.content).toContain('dispatch: { type: String, required: true }');
    expect(script.content).toContain('title: { type: String, required: false }');
    // description is authored as an MDC slot, not a prop
    expect(script.content).not.toContain('description: { type: String');
    expect(script.content).toContain('payload: { type: Array, required: false }');
    expect(script.content).toContain('whenItFires: { type: String, required: true }');
  });

  it('renders through MetaCard with the facet row and field-list payload', () => {
    const { source } = compileComponent();
    expect(source).toContain('<MetaCard');
    // labelled inline facets (surface / register / dispatch), not bare pills
    expect(source).toContain('hook-facets');
    expect(source).toContain('hook-facet__label');
    // payload rows reuse the reflected-schema row component, not a bespoke table
    expect(source).toContain('hook-fields');
    expect(source).toContain('<JsonSchemaFieldRow');
    expect(source).toContain(':optional="f.optional"');
    expect(source).not.toContain('hook-args');
    expect(source).not.toContain('hook-pill');
  });

  it('promotes the hook name to the headline when no title is given', () => {
    const { source } = compileComponent();
    // title falls back to name; token badge is suppressed to avoid a duplicate
    expect(source).toContain('title || props.name');
    expect(source).toContain("props.title ? props.name : ''");
  });

  it('gives the mechanic tag a tooltip and links it to the mechanics reference', () => {
    const { source } = compileComponent();
    expect(source).toContain('<UTooltip');
    expect(source).toContain('kindTip');
    expect(source).toContain('#hook-mechanics');
  });

  it('renders the description from the default MDC slot, not a prop', () => {
    const { source } = compileComponent();
    // default slot content is passed through to MetaCard's #description
    expect(source).toContain('#description');
    expect(source).toContain('$slots.default');
  });

  it('renders "When it fires" as a subtle labelled line, not a section', () => {
    const { source } = compileComponent();
    expect(source).toContain('hook-when');
    expect(source).toContain('When it fires:');
    expect(source).not.toContain('label="When it fires"');
    // the standalone result.value section was folded into the payload field
    expect(source).not.toContain('hook-result');
    expect(source).not.toContain('result.value"');
  });

  it('renders the example behind an action-card-style collapsible from a named slot', () => {
    const { source } = compileComponent();
    expect(source).toContain('<UCollapsible');
    expect(source).toContain('usage-trigger');
    expect(source).toContain('$slots.example');
    expect(source).toContain('name="example"');
  });
});
