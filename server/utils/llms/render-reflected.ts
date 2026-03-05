import {
  actionImportPackage,
  entityComponentExportName,
  entityComponentImportPath,
  importSnippet,
  tokenToExportName,
} from '#shared/utils/reflected-meta';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface Action {
  name: string;
  input: unknown;
  output: unknown;
}

interface Query {
  name: string;
  entity: string;
  type: string;
  label: string;
  input: unknown;
}

interface EntityComponent {
  name: string;
  entityType: string;
  schema: unknown;
}

interface EntityLink {
  name: string;
  label: string;
  source: string;
  target: string;
  type: string;
}

function heading(level: string, id: string, ...children: MinimarkNode[]): MinimarkNode {
  return [level, { id }, ...children];
}

function pre(language: string, code: string): MinimarkNode {
  return ['pre', { language, code }];
}

export function renderAction(action: Action): MinimarkNode[] {
  const name = tokenToExportName(action.name, 'Action');
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    heading('h3', id, name + ' ', ['code', {}, action.name]),
    pre('ts', importSnippet(name, actionImportPackage(action.name))),
    heading('h4', `${id}-input`, 'Input'),
    pre('json', JSON.stringify(action.input)),
    heading('h4', `${id}-output`, 'Output'),
    pre('json', JSON.stringify(action.output)),
  ];
}

export function renderQuery(query: Query): MinimarkNode[] {
  const name = tokenToExportName(query.name, 'Query');
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const nodes: MinimarkNode[] = [
    heading('h3', id, name + ' ', ['code', {}, query.name]),
    ['p', {}, ['strong', {}, 'Entity:'], ` ${query.entity} | `, ['strong', {}, 'Type:'], ` ${query.type}`],
  ];
  if (query.label) {
    nodes.push(['p', {}, query.label]);
  }
  nodes.push(
    pre('ts', importSnippet(name, actionImportPackage(query.name))),
    heading('h4', `${id}-input`, 'Input'),
    pre('json', JSON.stringify(query.input)),
  );
  return nodes;
}

export function renderEntityComponent(component: EntityComponent): MinimarkNode[] {
  const name = entityComponentExportName(component.entityType, component.name);
  const path = entityComponentImportPath(component.entityType);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    heading('h3', id, name + ' ', ['code', {}, component.name]),
    pre('ts', importSnippet(name, path)),
    heading('h4', `${id}-schema`, 'Schema'),
    pre('json', JSON.stringify(component.schema)),
  ];
}

export function renderEntityOverview(
  entity: string,
  components: EntityComponent[],
  links: EntityLink[],
): MinimarkNode[] {
  const nodes: MinimarkNode[] = [
    ['p', {}, ['strong', {}, `Entity: ${entity}`]],
    ['p', {}, `Components: ${components.map((c) => c.name).join(', ')}`],
  ];
  if (links.length > 0) {
    nodes.push(
      ['p', {}, 'Links:'],
      ['ul', {}, ...links.map((link): MinimarkNode =>
        ['li', {}, `${link.name} → ${link.target} (${link.type})`],
      )],
    );
  }
  return nodes;
}
