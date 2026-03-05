import { kebabCase, pascalCase } from 'scule';

const capitalizeSingle = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalize = (str: string) => str.split('-').map(capitalizeSingle).join('');

export const tokenToExportName = (token: string, suffix?: string) =>
  token
    .split('/')
    .slice(1)
    .map(capitalize)
    .join('') + (suffix ?? '');

export function actionImportPackage(name: string): string {
  return `@laioutr-core/canonical-types/${name.split('/')[0]}`;
}

export function entityComponentExportName(entity: string, component: string): string {
  return `${entity}${pascalCase(component)}`;
}

export function entityComponentImportPath(entity: string): string {
  return `@laioutr-core/canonical-types/entity/${kebabCase(entity)}`;
}

export function importSnippet(exportName: string, importPath: string): string {
  return `import { ${exportName} } from '${importPath}';`;
}
