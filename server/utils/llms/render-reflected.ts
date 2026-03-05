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
  const pkg = actionImportPackage(action.name);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const lastSegment = action.name.split('/').at(-1) ?? '';
  const isQuery = lastSegment.startsWith('get-');
  const composable = isQuery ? 'useQueryAction' : 'useMutationAction';

  const vueLines = [
    importSnippet(name, pkg),
    '',
  ];
  if (isQuery) {
    vueLines.push(`const { data, status } = ${composable}(${name});`);
  } else {
    vueLines.push(`const { mutate, status } = ${composable}(${name});`);
    vueLines.push('await mutate(input);');
  }

  return [
    heading('h3', id, `${name  } `, ['code', {}, action.name]),
    pre('ts', importSnippet(name, pkg)),
    heading('h4', `${id}-input`, 'Input'),
    pre('json', JSON.stringify(action.input)),
    heading('h4', `${id}-output`, 'Output'),
    pre('json', JSON.stringify(action.output)),
    heading('h4', `${id}-usage`, 'Usage'),
    pre('bash', `curl -X POST http://localhost:3000/api/orchestr/action/${action.name} \\\n  -H "Content-Type: application/json" \\\n  -d '{ "input": ... }'`),
    pre('vue', vueLines.join('\n')),
  ];
}

export function renderQuery(query: Query): MinimarkNode[] {
  const name = tokenToExportName(query.name, 'Query');
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const nodes: MinimarkNode[] = [
    heading('h3', id, `${name  } `, ['code', {}, query.name]),
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
    heading('h3', id, `${name  } `, ['code', {}, component.name]),
    pre('ts', importSnippet(name, path)),
    heading('h4', `${id}-schema`, 'Schema'),
    pre('json', JSON.stringify(component.schema)),
  ];
}

interface PageType {
  name: string;
  kind: string;
  studio: { label: string; group?: string; description?: string };
  requiredQueries?: { alias: string; entityType: string }[];
  pathConstraints?: { exact?: string; requiredParams?: string[]; default?: string };
  resolveFor?: { referenceType: string }[];
}

const pageTypeExportNames: Record<string, string> = {
  'core/home': 'Home',
  'core/landingpage': 'Landingpage',
  'core/contentpage': 'Contentpage',
  'core/404': 'NotFoundPage',
  'ecommerce/product-detail-page': 'ProductDetailPage',
  'ecommerce/product-listing-page': 'ProductListingPage',
  'ecommerce/product-search-page': 'ProductSearchPage',
  'blog/post-single': 'BlogPostSinglePage',
  'blog/post-listing': 'BlogPostListingPage',
  'blog/collection': 'BlogPostCollectionPage',
};

export function renderPageType(pt: PageType): MinimarkNode[] {
  const exportName = pageTypeExportNames[pt.name] ?? pt.name;
  const id = pt.studio.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const path = pt.pathConstraints?.exact || pt.pathConstraints?.default;
  const nodes: MinimarkNode[] = [
    heading('h3', id, `${pt.studio.label} `, ['code', {}, pt.name]),
    ['p', {}, ['strong', {}, 'Kind:'], ` ${pt.kind}`, ...(path ? [' | ', ['strong', {}, 'Path:'] as MinimarkNode, ` ${path}`] : [])],
  ];
  if (pt.studio.description) {
    nodes.push(['p', {}, pt.studio.description]);
  }
  nodes.push(pre('ts', importSnippet(exportName, actionImportPackage(pt.name))));
  if (pt.requiredQueries?.length) {
    nodes.push(
      ['p', {}, ['strong', {}, 'Required Queries:']],
      ['ul', {}, ...pt.requiredQueries.map((rq): MinimarkNode =>
        ['li', {}, `${rq.alias} → ${rq.entityType}`],
      )],
    );
  }
  return nodes;
}

export function renderError(error: {
  className: string;
  code: string;
  httpStatus?: number;
  description: string;
  data?: { name: string; type: string }[];
  reasonValues?: string[];
  thrownBy: string[];
}): MinimarkNode[] {
  const id = error.code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const nodes: MinimarkNode[] = [
    heading('h3', id, `${error.className} `, ['code', {}, error.code]),
    ['p', {}, error.description, ...(error.httpStatus ? [` (HTTP ${error.httpStatus})`] : [])],
    pre('ts', importSnippet(error.className, `@laioutr-core/canonical-types/${error.code.startsWith('BLOG') ? 'blog' : 'ecommerce'}`)),
  ];
  if (error.data?.length) {
    nodes.push(
      ['p', {}, ['strong', {}, 'Error data:']],
      ['ul', {}, ...error.data.map((f): MinimarkNode => ['li', {}, `${f.name}: ${f.type}`])],
    );
  }
  if (error.reasonValues?.length) {
    nodes.push(['p', {}, ['strong', {}, 'Reason values: '], error.reasonValues.map((r) => `\`${r}\``).join(', ')]);
  }
  if (error.thrownBy.length) {
    nodes.push(
      ['p', {}, ['strong', {}, 'Thrown by: '], error.thrownBy.map((t) => tokenToExportName(t, 'Action')).join(', ')],
    );
  }
  return nodes;
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
