import { renderAction, renderEntityComponent, renderEntityOverview, renderError, renderPageType, renderQuery } from './render-reflected';
import { renderUiComponentMeta } from './render-ui-meta';
import { renderExcalidrawDiagram } from './render-excalidraw';
import reflected from '@laioutr-core/canonical-types/reflection';
import '@laioutr-core/canonical-types/autoload';
import { pageTypeTokenRegistry } from '@laioutr-core/core-types/frontend';
import { canonicalErrors } from '#shared/utils/canonical-errors';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

const KNOWN_COMPONENTS = new Set(['action-meta', 'query-meta', 'entity-component-meta', 'entity-overview', 'component-meta', 'page-type-meta', 'error-meta', 'excalidraw-diagram']);

function isElement(node: MinimarkNode): node is [string, Record<string, unknown>, ...any[]] {
  return Array.isArray(node) && typeof node[0] === 'string';
}

async function resolveComponent(tag: string, props: Record<string, unknown>): Promise<MinimarkNode[] | null> {
  switch (tag) {
    case 'action-meta': {
      const action = reflected.actions.find((a: any) => a.name === props.name);
      if (!action) return null;
      return renderAction(action);
    }
    case 'query-meta': {
      const query = reflected.queries.find((q: any) => q.name === props.name);
      if (!query) return null;
      return renderQuery(query);
    }
    case 'entity-component-meta': {
      const comp = reflected.components.find((c: any) => c.entityType === props.entity && c.name === props.component);
      if (!comp) return null;
      return renderEntityComponent(comp);
    }
    case 'entity-overview': {
      const entity = props.entity as string;
      const entityComponents = reflected.components.filter((c: any) => c.entityType === entity);
      const links = reflected.links.filter((l: any) => l.source === entity);
      return renderEntityOverview(entity, entityComponents, links);
    }
    case 'page-type-meta': {
      const pt = pageTypeTokenRegistry.all().find((p) => p.name === props.name);
      if (!pt) return null;
      return renderPageType(pt);
    }
    case 'error-meta': {
      const err = canonicalErrors.find((e) => e.code === props.code);
      if (!err) return null;
      return renderError(err);
    }
    case 'excalidraw-diagram': {
      const src = props.src as string;
      if (!src) return null;
      return renderExcalidrawDiagram(src, props.alt as string | undefined);
    }
    case 'component-meta': {
      try {
        const componentMeta = await import('@laioutr-core/ui-component-meta').then((m) => m.default);
        const data = componentMeta[props.name as string];
        if (!data) return null;
        return renderUiComponentMeta(props.name as string, data);
      } catch {
        return null;
      }
    }
    default:
      return null;
  }
}

/**
 * Walk the minimark AST body and replace known MDC component nodes
 * with their rendered minimark equivalents.
 */
export async function transformMdcBody(body: { value: MinimarkNode[] }): Promise<void> {
  await walkAndReplace(body.value);
}

async function walkAndReplace(nodes: MinimarkNode[]): Promise<void> {
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    if (!isElement(node)) {
      i++;
      continue;
    }

    const [tag, props, ...children] = node;

    if (KNOWN_COMPONENTS.has(tag)) {
      const normalizedProps = normalizeProps(props);
      const childText = extractChildText(children);

      try {
        const replacement = await resolveComponent(tag, normalizedProps);
        if (replacement) {
          // Preserve children text as a leading paragraph
          if (childText) {
            replacement.unshift(['p', {}, childText]);
          }
          nodes.splice(i, 1, ...replacement);
          i += replacement.length;
          continue;
        }
      } catch (err) {
        console.warn(`[llms] Failed to resolve <${tag}>:`, err);
      }

      // If resolution failed, remove the unresolvable node
      nodes.splice(i, 1);
      continue;
    }

    // Recurse into children
    if (children.length > 0) {
      const childNodes = node.slice(2) as MinimarkNode[];
      await walkAndReplace(childNodes);
    }

    i++;
  }
}

function normalizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    result[key.replace(/^:/, '')] = value;
  }
  return result;
}

function extractChildText(children: any[]): string | null {
  const texts: string[] = [];
  for (const child of children) {
    if (typeof child === 'string') {
      texts.push(child.trim());
    } else if (isElement(child) && child[0] === 'p') {
      for (let j = 2; j < child.length; j++) {
        if (typeof child[j] === 'string') texts.push(child[j].trim());
      }
    }
  }
  const result = texts.filter(Boolean).join(' ');
  return result || null;
}
