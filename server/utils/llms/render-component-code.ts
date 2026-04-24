type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

function isElement(node: MinimarkNode): node is [string, Record<string, unknown>, ...any[]] {
  return Array.isArray(node) && typeof node[0] === 'string';
}

function collectCodeBlocks(children: MinimarkNode[], out: MinimarkNode[]): void {
  for (const child of children) {
    if (!isElement(child)) continue;
    if (child[0] === 'pre' || child[0] === 'code') {
      out.push(child);
      continue;
    }
    const nested = child.slice(2) as MinimarkNode[];
    if (nested.length) collectCodeBlocks(nested, out);
  }
}

export function renderComponentCode(props: Record<string, unknown>, children: MinimarkNode[]): MinimarkNode[] {
  const name = (props.name as string) || 'Component';
  const title = (props.title as string) || name;
  const storyId = (props.storyId || props['story-id']) as string | undefined;
  const id = `example-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const nodes: MinimarkNode[] = [['h4', { id }, `Example: ${title}`]];

  if (storyId) {
    const storybookUrl = `https://storybook.laioutr.cloud/?path=/story/${storyId}`;
    nodes.push(['p', {}, 'Live preview: ', ['a', { href: storybookUrl }, storybookUrl]]);
  }

  const codeBlocks: MinimarkNode[] = [];
  collectCodeBlocks(children, codeBlocks);
  nodes.push(...codeBlocks);

  return nodes;
}
