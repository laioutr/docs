import { kebabCase } from 'scule';

export function entityPagePath(entity: string): string {
  return `/frontend/api-reference/entities/${kebabCase(entity)}`;
}
