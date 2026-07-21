import { stringifyYAML } from 'confbox';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface RenderInlineDataOptions {
  /** Name of a string prop to lift into an `h3` heading (e.g. `name`, `family`). */
  titleKey?: string;
}

function isTemplateSlot(node: MinimarkNode): node is [string, Record<string, unknown>, ...MinimarkNode[]] {
  return Array.isArray(node) && node[0] === 'template';
}

/**
 * Render an allowlisted, pure-inline-data MDC component for `llms-full.txt`.
 *
 * Components whose data lives entirely in nested props (arrays/objects) are
 * garbled to `[object Object]` by the default minimark stringifier. This helper
 * dumps the props verbatim as a fenced YAML block so the structured data stays
 * readable.
 *
 * Slot content is emitted around the YAML block:
 * - Default-slot children (e.g. a `description` paragraph) render as prose
 *   *before* the YAML, so the card reads title → description → data.
 * - Named slots (e.g. `#example`) arrive as `<template>` children; their
 *   content renders *after* the YAML.
 *
 * Because this helper renders its own children, `transform-mdc` must not also
 * lift the default prose into a leading paragraph (see CHILD_RENDERING_COMPONENTS).
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

  const defaultProse: MinimarkNode[] = [];
  const namedSlotContent: MinimarkNode[] = [];
  for (const child of children) {
    if (isTemplateSlot(child)) {
      for (let i = 2; i < child.length; i++) namedSlotContent.push(child[i] as MinimarkNode);
    } else {
      defaultProse.push(child);
    }
  }

  for (const node of defaultProse) nodes.push(node);

  const code = stringifyYAML(props).trimEnd();
  nodes.push(['pre', { language: 'yaml', code }, ['code', {}, code]]);

  for (const node of namedSlotContent) nodes.push(node);

  return nodes;
}
