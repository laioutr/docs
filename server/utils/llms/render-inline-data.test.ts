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

  it('renders default-slot prose before the yaml and named-slot (#example) content after', () => {
    const description = ['p', {}, 'Transform the link.']; // default slot
    const example = ['template', { 'v-slot:example': '' }, ['pre', { language: 'ts', code: 'x' }, ['code', {}, 'x']]];

    const nodes = renderInlineDataComponent(
      { name: 'frontend-core:link-resolver:resolve', kind: 'filter' },
      [description as never, example as never],
      { titleKey: 'name' },
    );

    // order: h3 → description prose → yaml → example code
    expect((nodes[0] as [string])[0]).toBe('h3');
    expect(nodes[1]).toBe(description);

    const yaml = nodes[2] as [string, Record<string, unknown>, unknown];
    expect(yaml[0]).toBe('pre');
    expect(yaml[1].language).toBe('yaml');

    const last = nodes[nodes.length - 1] as [string, Record<string, unknown>, unknown];
    expect(last[0]).toBe('pre'); // the example code fence, unwrapped from its template
    expect(last[1].language).toBe('ts');

    // the raw <template> wrapper must not survive, and the description must not
    // leak into the yaml props
    expect(nodes.some((n: unknown) => Array.isArray(n) && n[0] === 'template')).toBe(false);
    expect(String(yaml[1].code)).not.toContain('Transform the link');
  });
});
