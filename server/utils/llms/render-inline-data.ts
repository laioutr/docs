import { stringifyYAML } from 'confbox';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface RenderInlineDataOptions {
  /** Name of a string prop to lift into an `h3` heading (e.g. `name`, `family`). */
  titleKey?: string;
}

/**
 * Render an allowlisted, pure-inline-data MDC component for `llms-full.txt`.
 *
 * Components whose data lives entirely in nested props (arrays/objects) are
 * garbled to `[object Object]` by the default minimark stringifier. This helper
 * dumps the props verbatim as a fenced YAML block so the structured data stays
 * readable, optionally prefixed with a heading, followed by any slotted children.
 */
export function renderInlineDataComponent(
  props: Record<string, unknown>,
  children: MinimarkNode[] = [],
  opts: RenderInlineDataOptions = {},
): MinimarkNode[] {
  const nodes: MinimarkNode[] = [];

  const title = opts.titleKey ? props[opts.titleKey] : undefined;
  if (typeof title === 'string' && title) {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    nodes.push(['h3', { id }, title]);
  }

  const code = stringifyYAML(props).trimEnd();
  nodes.push(['pre', { language: 'yaml', code }, ['code', {}, code]]);

  for (const child of children) nodes.push(child);

  return nodes;
}
