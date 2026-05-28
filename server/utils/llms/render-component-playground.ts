type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

export async function renderComponentPlayground(
  props: Record<string, unknown>
): Promise<MinimarkNode[] | null> {
  const name = (props.name as string) || 'Component';
  const base = (props.base as string) || '';

  const nodes: MinimarkNode[] = [
    ['h3', { id: `playground-${name.toLowerCase()}` }, `${name} — Playground`],
  ];

  if (base) {
    nodes.push([
      'p',
      {},
      ['a', { href: `https://storybook.laioutr.cloud/?path=/story/${base}` }, 'Storybook'],
    ]);
  }

  // Pull props from nuxt-component-meta if available, mirroring render-ui-meta.
  try {
    const componentMeta = await import('@laioutr-core/ui-component-meta').then((m) => m.default as any);
    const data = componentMeta[name];
    if (data?.meta?.props?.length) {
      const propsList = data.meta.props.map((p: any) => ({
        name: p.name,
        type: typeof p.type === 'string' ? p.type : p.type?.name ?? '',
        required: p.required ?? false,
        default: p.default,
        description: p.description,
      }));
      const requiredCount = propsList.filter((p: any) => p.required).length;
      nodes.push(['h4', { id: 'playground-props' }, `Props (${propsList.length}, ${requiredCount} required)`]);
      nodes.push(['pre', { language: 'json', code: JSON.stringify(propsList, null, 2) }]);
    }
  } catch {
    // Component-meta not available — emit the heading only.
  }

  return nodes;
}
