type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

const IGNORED_PROPS = [
  'activeClass',
  'inactiveClass',
  'exactActiveClass',
  'ariaCurrentValue',
  'rel',
  'noRel',
  'prefetch',
  'prefetchOn',
  'noPrefetch',
  'prefetchedClass',
  'replace',
  'exact',
  'exactQuery',
  'exactHash',
  'external',
  'onClick',
  'viewTransition',
];

function sortProps(props: any[]): any[] {
  return [...props].sort((a, b) => {
    if (a.name === 'as') return -1;
    if (b.name === 'as') return 1;
    if (a.name === 'ui') return 1;
    if (b.name === 'ui') return -1;
    return 0;
  });
}

export async function renderUiComponentMeta(_name: string, data: any): Promise<MinimarkNode[]> {
  const nodes: MinimarkNode[] = [];

  // Props
  if (data.meta?.props?.length) {
    const filteredProps = sortProps(
      data.meta.props.filter((p: any) => !IGNORED_PROPS.includes(p.name)),
    );

    let propsJson: string;
    try {
      const { propsToJsonSchema } = await import('nuxt-component-meta/utils');
      propsJson = JSON.stringify(propsToJsonSchema(filteredProps));
    } catch {
      propsJson = JSON.stringify(filteredProps.map((p: any) => ({
        name: p.name,
        type: p.type,
        required: p.required,
        default: p.default,
        description: p.description,
      })));
    }

    nodes.push(
      ['h4', { id: 'props' }, 'Props'],
      ['pre', { language: 'json', code: propsJson }],
    );
  }

  // Slots
  if (data.meta?.slots?.length) {
    nodes.push(
      ['h4', { id: 'slots' }, 'Slots'],
      ['pre', { language: 'json', code: JSON.stringify(data.meta.slots) }],
    );
  }

  // Events
  if (data.meta?.events?.length) {
    nodes.push(
      ['h4', { id: 'events' }, 'Events'],
      ['pre', { language: 'json', code: JSON.stringify(data.meta.events) }],
    );
  }

  return nodes;
}
