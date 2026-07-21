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
